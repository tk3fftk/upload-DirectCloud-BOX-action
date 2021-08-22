'use strict';

const axios = require('axios');
const core = require('@actions/core');
const filetype = require('file-type');
const fs = require('fs/promises');
const FormData = require('form-data');
const path = require('path');

const endpoint = 'https://api.directcloud.jp';
const requireEnvs = [
  'DIRECTCLOUDBOX_SERVICE',
  'DIRECTCLOUDBOX_SERVICE_KEY',
  'DIRECTCLOUDBOX_CODE',
  'DIRECTCLOUDBOX_ID',
  'DIRECTCLOUDBOX_PASSWORD',
  'DIRECTCLOUDBOX_NODE',
  'DIRECTCLOUDBOX_FILE_PATH',
];
const tokenPath = '/openapi/jauth/token?lang=eng';
const tokenParams = ['service', 'service_key', 'code', 'id', 'password'];
const uploadPath = `/openapp/v1/files/upload/${process.env.DIRECTCLOUDBOX_NODE}?lang=eng`;

async function fetchAccessToken() {
  const data = new FormData();
  tokenParams.forEach((key) => {
    const value = process.env[`DIRECTCLOUDBOX_${key.toUpperCase()}`];
    data.append(key, value);
  });
  const options = {
    headers: { ...data.getHeaders() },
  };

  const response = await axios.post(endpoint + tokenPath, data, options);
  const cookie = response.headers['set-cookie'];
  const { success, access_token } = response.data;
  if (!success) {
    throw new Error(
      'Failed to get access token. Please check your environment variables'
    );
  }

  return { cookie, access_token };
}

async function uploadFile(cookie, accessToken) {
  const filepath = process.env.DIRECTCLOUDBOX_FILE_PATH;
  const buffer = await fs.readFile(filepath);
  const ft = await filetype.fromFile(filepath);
  let mime = ft?.mime ? ft.mime : 'text/plain';
  const data = new FormData();
  data.append('Filedata', buffer, {
    filename: path.basename(filepath),
    contentType: mime,
  });
  const options = {
    headers: {
      Cookie: cookie.reduce((acc, cur) => `${acc}; ${cur.split(';')[0]}`, ''),
      access_token: accessToken,
      ...data.getHeaders(),
    },
  };

  const response = await axios.post(endpoint + uploadPath, data, options);
  const { success } = response.data;
  if (success) {
    core.info(`${path.basename(filepath)} is successfully uploaded`);
  } else {
    throw new Error('Failed to upload: ' + filepath);
  }
}

async function run() {
  try {
    const undefinedEnv = [];
    requireEnvs.forEach((env) => {
      if (process.env[env] === undefined) {
        undefinedEnv.push(env);
      }
    });
    if (undefinedEnv.length > 0) {
      throw new Error(
        `Required environment variables are not set: ${undefinedEnv.join(', ')}`
      );
    }

    const { cookie, access_token } = await fetchAccessToken();
    await uploadFile(cookie, access_token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
