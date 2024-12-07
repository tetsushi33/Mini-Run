import os
import boto3

dynamodb = boto3.client('dynamodb', endpoint_url=os.getenv("DYNAMO_ENDPOINT"))

table_name = "game_table"

def main():
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
        {"AttributeName": "id", "KeyType": "HASH",},
        ],
        AttributeDefinitions=[
        {"AttributeName": "id", "AttributeType": "N"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )

if __name__ == "__main__":
    main()