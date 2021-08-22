# Upload DirectCloud-Box

[DirectCloud-BOX](https://directcloud.jp/freeplan) の [API](https://directcloud.jp/api_reference) を利用し、GitHub Actions のワークフロー内からファイルをアップロードする JavaScript Action です。

## Usage

```yaml
name: upload

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      DIRECTCLOUDBOX_SERVICE: ${{ secrets.DIRECTCLOUDBOX_SERVICE }}
      DIRECTCLOUDBOX_SERVICE_KEY: ${{ secrets.DIRECTCLOUDBOX_SERVICE_KEY }}
      DIRECTCLOUDBOX_CODE: ${{ secrets.DIRECTCLOUDBOX_CODE }}
      DIRECTCLOUDBOX_ID: ${{ secrets.DIRECTCLOUDBOX_ID }}
      DIRECTCLOUDBOX_PASSWORD: ${{ secrets.DIRECTCLOUDBOX_PASSWORD }}
      DIRECTCLOUDBOX_NODE: '1' # "1" means "My Box" folder
      DIRECTCLOUDBOX_FILE_PATH: 'hoge' # set a file or directory
    steps:
      - uses: actions/checkout@v2
      - uses: tk3fftk/upload-DirectCloud-BOX-action@v1.0
```

### Required Environment Variables

動作に必要な環境変数は下記の表の通りです。[Encrypted secrets](https://docs.github.com/en/actions/reference/encrypted-secrets)の利用を推奨します。

| 環境変数                     | 説明                                                                                             | GitHub Secrets の利用を推奨 |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| `DIRECTCLOUDBOX_SERVICE`     | [管理画面](https://boxmanager.directcloud.jp/setting/image)より発行した API キーの `Service`     | ○                           |
| `DIRECTCLOUDBOX_SERVICE_KEY` | [管理画面](https://boxmanager.directcloud.jp/setting/image)より発行した API キーの `Service Key` | ○                           |
| `DIRECTCLOUDBOX_CODE`        | 会社 ID                                                                                          | ○                           |
| `DIRECTCLOUDBOX_ID`          | ユーザー ID                                                                                      | ○                           |
| `DIRECTCLOUDBOX_PASSWORD`    | ユーザーパスワード                                                                               | ○                           |
| `DIRECTCLOUDBOX_NODE`        | アップロード先のフォルダを示す node (DirectCloud-BOX 上で内部的にフォルダ管理に利用している値)   | -                           |
| `DIRECTCLOUDBOX_FILE_PATH`   | アップロードしたいファイルまたはディレクトリの Path                                              | -                           |
