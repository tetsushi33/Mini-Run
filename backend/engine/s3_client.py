import boto3
import os
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()


class S3Client:
    def __init__(self):
        """
        S3クライアントを初期化し、バケット名を設定
        """
        self.s3_client = boto3.client(
            "s3",
            #aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
            #aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
            #endpoint_url=os.getenv("S3_ENDPOINT")  # 必要に応じて指定（MinIOやローカルS3の場合）
        )
        self.bucket_name = os.getenv("S3_BUCKET")  # 環境変数からバケット名を取得

    def upload_fileobj(self, file, file_key):
        """
        S3にファイルをアップロードするメソッド

        Args:
            file: アップロードするファイルオブジェクト
            file_key: S3に保存するオブジェクトのキー

        Raises:
            Exception: アップロード失敗時に例外を発生
        """
        try:
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,  # バケット名は内部で指定
                file_key,
                ExtraArgs={'ContentType': file.content_type}  # MIMEタイプを指定
            )
            print(f"Uploaded {file_key} to {self.bucket_name}")
        except Exception as e:
            print(f"Failed to upload file: {e}")
            raise e

## boto3クライアントの初期化
#s3_client = boto3.client(
#    "s3",
#    #aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
#    #aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
#    #endpoint_url=os.getenv("S3_ENDPOINT")  # ローカル時のみ
#)
#
#def upload_to_s3(file, file_hash, content_type):
#    """
#    S3にファイルをアップロードする関数
#
#    Args:
#        file: アップロードするファイルオブジェクト
#        file_hash: S3に保存するオブジェクトのキー（ユニークな名前）
#        content_type: ファイルのContent-Type
#
#    Raises:
#        Exception: アップロードが失敗した場合
#    """
#    try:
#        # 環境変数からS3バケットを取得
#        s3_bucket = os.getenv("S3_BUCKET")
#
#        # S3にファイルをアップロード
#        s3_client.upload_fileobj(
#            file,
#            s3_bucket,
#            file_hash,  # ファイル名の代わりにハッシュを使用
#            ExtraArgs={"ContentType": content_type}
#        )
#        print(f"File uploaded successfully to S3 with key: {file_hash}")
#    except Exception as e:
#        print(f"Error uploading file to S3: {e}")
#        raise e
#    
#def get_s3_file_url(file_key: str) -> str:
#    """
#    S3のファイルにアクセスするための署名付きURLを生成する関数
#
#    Args:
#        file_key (str): S3に格納されているオブジェクトのキー
#
#    Returns:
#        str: 署名付きURL
#    """
#    try:
#        url = s3_client.generate_presigned_url(
#            'get_object',
#            Params={'Bucket': os.getenv("S3_BUCKET"), 'Key': file_key},
#            ExpiresIn=3600  # URLの有効期限（秒単位）
#        )
#        return url
#    except Exception as e:
#        print(f"Error generating S3 presigned URL: {e}")
#        return ""
#    
#def upload_fileobj(self, file, bucket_name, file_hash):
#        """
#        S3にファイルをアップロードする
#        """
#        try:
#            self.s3_client.upload_fileobj(
#                file,
#                bucket_name,
#                file_hash,
#                ExtraArgs={'ContentType': file.content_type}
#            )
#            print(f"Uploaded {file_hash} to {bucket_name}")
#        except Exception as e:
#            print(f"Failed to upload file: {e}")
#            raise e
#