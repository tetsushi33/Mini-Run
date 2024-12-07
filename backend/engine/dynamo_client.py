import os
import boto3
import random

class DynamoClient:
    def __init__(self, table_name: str) -> None:
        self.db = boto3.client('dynamodb')
        self.table_name = table_name
        #self.db = boto3.resource('dynamodb', region_name=REGION_NAME)
        #self.table_name = table_name or DYNAMODB_TABLE
        #self.table = self.db.Table(self.table_name)

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

    def create_quiz(self, data: dict) -> None:
        '''対象のテーブルにクイズデータを登録するメソッド
        '''
        client = boto3.client('dynamodb') # ここで良いかは不明
        response = client.put_item(TableName=self.table_name, Item={
            'id': {'N': str(data['id'])},
            'question': {'S': data['question']},
            'selects': {'L': [{'S': s} for s in data['selects']]},
            'answer_idx': {'N': str(data['answer'])},
            'likes': {'N': '0'}
        })
        return True if response['ResponseMetadata']['HTTPStatusCode'] == 200 else False

    def create_intro(self, data: dict) -> None:
        '''対象のテーブルにイントロデータを登録するメソッド
        '''
        client = boto3.client('dynamodb')
        response = client.put_item(TableName=self.table_name, Item={
            'id': {'N': str(data['id'])},
            'music_title_answer': {'S': data['music_title_answer']},
            'music_data': {'B': data['music_data']},
            'likes': {'N': '0'}
        })

    def create_diffshot(self, data: dict) -> None:
        '''対象のテーブルにディフショットデータを登録するメソッド
        '''
        client = boto3.client('dynamodb')
        
    
