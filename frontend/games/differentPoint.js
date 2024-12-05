
//date
let questionDate = {
    "ImageList":[], 
    "answer_map":"間違っている画像の部分を表示する用のマップ", 
    "lastTouchPos":[25.32, 3452.3]
}


class different_play{
    constructor(){
        //初期値
        this.ImageList = []
        this.answer_map = [] // ImageListから取得した画像からサイズを測定してそのサイズの二次元配列を作成する
        
        this.lastTouchPos = [0.0, 0.0]
    }

}


/** 
     *画像のどこをタップしたかを調べる処理
    */
     function GET_TouchImagePostion()
     {
 
     }
 
     /**
      * 正解の場所を描画する処理
      * @param ImageList 間違い探しで使う画像集(何枚使うかがわからなくなったため)
      * @param answer_map  精密なマップ
      */
     function Drow_ScuessImagePostion(ImageList, answer_map){
 
     }
 
 
     /** 
      * 正解の場所かどうかを判定する処理
      * @param touchPos 要素数2の1次元の配列
      * @param answer_map 違う場所を2次元配列で管理しているもの
      */
 
     function Check_TouchImagePostion_CorrectAnswer(){
 
     }