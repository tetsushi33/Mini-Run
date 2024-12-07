import os
import boto3
import random

class DynamoClient:
    def __init__(self, table_name: str) -> None:
        self.db = boto3.client('dynamodb')
        self.table_name = table_name

    def get_all(self) -> list:
        '''対象のテーブルからレコード全件を取得するメソッド
        '''
        response = self.db.scan(TableName=self.table_name)
        items = response.get('Items', [])
        return items

    def get_random(self) -> None:
        '''対象のテーブルからランダムに1件レコードを取得するメソッド
        '''
        response_all = self.db.scan(TableName=self.table_name)
        valid_keys = [item['id']['N'] for item in response_all['Items']]
        random_key = random.choice(valid_keys)
        response = self.db.get_item(TableName=self.table_name, Key={"id": {"N": str(random_key)}})
        return response.get('Item')
