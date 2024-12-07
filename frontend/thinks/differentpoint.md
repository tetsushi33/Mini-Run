間違い探しの仕様

必要なもの
 - 間違い探しの画像
 - 間違ってる部分のマップ(クリックした場所が間違っているかどうかを描画・判定する)

処理


Play
     - GET_TouchImagePostion
        画像のどこをタップしたかを調べる処理
         |
         V
      addEventlistenerに変更した


     - Drow_ScuessImagePostion
        正解の場所を描画する処理


     - Check_TouchImagePostion_CorrectAnswer
        正解の場所かどうかを判定する処理


Make
     - アップロードした画像を送信する
        SendImage

     - アップロードした画像のプレビューを表示する
        PreviewImage

    挑戦
        プレービュー(テストプレー)できる状態
        TestPlay
