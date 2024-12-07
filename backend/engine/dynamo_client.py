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
        try:
            response_all = self.db.scan(TableName=self.table_name)
            items = response_all.get('Items', [])
            if not items:
                return None
            random_item = random.choice(items)
            return random_item
        except Exception as e:
            print(f"Error retrieving random item: {e}")
            return None
    
    def get_random_2(self, genre: str) -> None:
        '''指定されたジャンルの中からランダムに1件レコードを取得するメソッド'''
        # 指定されたジャンルのアイテムをスキャン
        response_all = self.db.scan(
            TableName=self.table_name,
            FilterExpression="genre = :genre",
            ExpressionAttributeValues={":genre": {"S": genre}}
        )
        items = response_all.get('Items', [])
        if not items:
                return None
        if genre == "quiz":
            # 有効なキーを取得
            valid_keys = [item['id']['N'] for item in response_all['Items']]
            random_key = random.choice(valid_keys)
            response = self.db.get_item(TableName=self.table_name, Key={"id": {"N": str(random_key)}})
            return response.get('Item')
        if genre == "introdon":
            # 有効なキーを取得
            valid_keys = [item['id']['N'] for item in response_all['Items']]
            random_key = random.choice(valid_keys)
            selected_item = random.choice(items)

            # 音声データのハッシュ値と元の名前を取得
            file_hash = selected_item['file_hash']['S']
            original_name = selected_item['original_name']['S']

            # 必要に応じて他の処理を追加可能
            return {
                "file_hash": file_hash,
                "original_name": original_name,
            }
        if genre == "search_diff":
            selected_item = random.choice(items)
            # 画像データのハッシュリストと正解インデックスを取得
            image_hashes = [hash_item["S"] for hash_item in selected_item['image_hashes']['L']]
            answer_idx = int(selected_item['answer_idx']['N'])

            # 必要なデータを返す
            return {
                "image_hashes": image_hashes,
                "answer_idx": answer_idx
            }
        else:
            return None


    def scan(self, **kwargs):
        return self.db.scan(**kwargs)

    def create_quiz(self, data: dict) -> None:
        '''対象のテーブルにクイズデータを登録するメソッド
        '''
        try:
            response = self.db.put_item(TableName=self.table_name, Item={
                'id': {'N': str(data['id'])},
                'question': {'S': data['question']},
                'selects': {'L': [{'S': s} for s in data['selects']]},
                'answer_idx': {'N': str(data['answer_idx'])},
                'likes': {'N': '0'}
            })
            return True if response['ResponseMetadata']['HTTPStatusCode'] == 200 else False
        except Exception as e:
            print(f"Error saving data to DynamoDB: {e}")
            return False

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

    def save_file_metadata(self, data: dict, file_hash: str, original_name: str) -> bool:
        """
        DynamoDBにファイルのメタデータを保存する関数

        Args:
            file_hash (str): ファイルのハッシュ値
            original_name (str): 元のファイル名

        Returns:
            bool: 成功した場合はTrue、失敗した場合はFalse
        """
        try:
            client = boto3.client('dynamodb')
            # DynamoDBにデータを登録
            response = client.put_item(Item={
                'id': {'N': str(data['id'])},
                'file_hash': file_hash,
                'original_name': original_name
            })
            return response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200
        except Exception as e:
            print(f"Error saving file metadata to DynamoDB: {e}")
            return False
        

    def create_search_diff(self, data: dict) -> bool:
        """
        DynamoDBに間違い画像選択ゲームのデータを保存する
        """
        try:
            item = {
            'id': {'N': str(data['id'])},
            'genre': {'S': data['genre']},
            'image_hashes': {'L': [{'S': hash} for hash in data['image_hashes']]},
            'answer_idx': {'N': str(data['answer_idx'])},
            'likes': {'N': '0'}  # 初期値として0を設定
            }
            response = self.db.put_item(
                TableName=self.table_name,
                #Item=data
                Item=item
            )
            # ステータスコードが200であれば成功
            return response['ResponseMetadata']['HTTPStatusCode'] == 200
        except Exception as e:
            print(f"Error saving data to DynamoDB: {e}")
            return False

        
        
    
