import os
import boto3
import random

class DynamoClient:
    def __init__(self, table_name: str) -> None:
        self.db = boto3.client('dynamodb', endpoint_url=os.getenv("DYNAMO_ENDPOINT"))
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
        response_len = response_all['Count']
        random_key = random.randrange(response_len)
        response = self.db.get_item(TableName=self.table_name, Key={"id": {"N": str(random_key)}})
        return response.get('Item', [])

    def create_quiz(self, data: dict) -> None:
        '''対象のテーブルにクイズデータを登録するメソッド
        '''
        client = boto3.client('dynamodb') # ここで良いかは不明
        response = client.put_item(TableName=self.table_name, Item={
            'quiz_name': {'S': data['quiz_name']}, # quiz_nameではなくidか
            'questions': {'S': data['questions']},
            'selects': {'L': [{'S': s} for s in data['selects']]},
            'answer': {'N': str(data['answer'])}
        })
        return True if response['ResponseMetadata']['HTTPStatusCode'] == 200 else False