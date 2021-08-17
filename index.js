const core = require('@actions/core');
const endpoint = 'https://api.directcloud.jp/openapi';
const tokenPath = '/jauth/token?lang=eng';
const uploadPath = '/openapp/v1/files/upload/';
const requireEnvs = [
  'DIRECTCLOUDBOX_SERVICE',
  'DIRECTCLOUDBOX_SERVICE_KEY',
  'DIRECTCLOUDBOX_CODE',
  'DIRECTCLOUDBOX_ID',
  'DIRECTCLOUDBOX_PASSWORD',
  'DIRECTCLOUDBOX_NODE',
  'DIRECTCLOUDBOX_FILE_PATH'
];

// most @actions toolkit packages have async methods
async function run() {
  try {
    const undefinedEnv = [];
    requireEnvs.forEach(env => {
      if (process.env[env] === undefined) {
        undefinedEnv.push(env);
      }
    })
    if (undefinedEnv.length > 0) {
      throw new Error(`Required environment variables are not set: ${undefinedEnv.join(', ')}`);
    }

    /*
    const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
    */
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
