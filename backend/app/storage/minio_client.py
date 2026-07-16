import os
from minio import Minio
from minio.error import S3Error
from fastapi import UploadFile

minio_client = Minio(
    endpoint=os.getenv("MINIO_ENDPOINT", "localhost:9000"),
    access_key=os.getenv("MINIO_ROOT_USER", "minioadmin"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD", "minioadmin123"),
    secure=False
)

bucket_name = "bookforge"

def ensure_bucket_exists():
    try:
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
    except S3Error as e:
        print(f"MinIO error: {e}")

def upload_file_to_minio(file: UploadFile, object_name: str) -> str:
    ensure_bucket_exists()
    try:
        minio_client.put_object(
            bucket_name,
            object_name,
            file.file,
            length=-1,
            part_size=10*1024*1024, # 10MB
        )
        return f"s3://{bucket_name}/{object_name}"
    except S3Error as e:
        print(f"Error uploading to MinIO: {e}")
        raise e
        
def get_file_url(object_name: str) -> str:
    return minio_client.presigned_get_object(bucket_name, object_name)
