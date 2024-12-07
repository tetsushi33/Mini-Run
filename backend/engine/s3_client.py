import boto3
import os
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()

# boto3クライアントの初期化
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
    endpoint_url=os.getenv("S3_ENDPOINT")  # MinIOを使用する場合に必要
)

def upload_to_s3(file, file_hash, content_type):
    """
    S3にファイルをアップロードする関数

    Args:
        file: アップロードするファイルオブジェクト
        file_hash: S3に保存するオブジェクトのキー（ユニークな名前）
        content_type: ファイルのContent-Type

    Raises:
        Exception: アップロードが失敗した場合
    """
    try:
        # 環境変数からS3バケットを取得
        s3_bucket = os.getenv("S3_BUCKET")

        # S3にファイルをアップロード
        s3_client.upload_fileobj(
            file,
            s3_bucket,
            file_hash,  # ファイル名の代わりにハッシュを使用
            ExtraArgs={"ContentType": content_type}
        )
        print(f"File uploaded successfully to S3 with key: {file_hash}")
    except Exception as e:
        print(f"Error uploading file to S3: {e}")
        raise e