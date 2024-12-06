const images_list = document.querySelectorAll('.different-image');


const debug_log = {
    "postion":false,
    "isDevicePhone":false
}

//アクセスしているのがスマホかPCかを確認する
function isSmartPhone()
{
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/))
    {
        console.log(`UserAgent${navigator.userAgent}, phone:True`);
        return true;
    }
    
    else 
    {
        console.log(`UserAgent${navigator.userAgent},phone:False`);
        return false;
    }
}


const isUsePhone = isSmartPhone();


//request-date

/**
 * @param ImageList srcに代入するためのURL-S3から引っ張ってくるためのキーを指定する
 * @param answer_map src同士で異なった部分をマップとして保存し、それを
 * @param lastTouchPos 
 */



let questionDate = {
    "ImageList":[], 
    "answer_map":[[116,69],[42,51]], 
}

console.log(questionDate["answer_map"]);

let userDate = {
    "lastTouchPos":[25.32, 3452.3],
    "selectTouchPostions":[[2432,343],[2432,343]]
}


//画像のどこをタップしたかを調べる処理
images_list.forEach(image =>
{
    image.addEventListener("click",(c)=>
        {
            console.log(c.offsetX,c.offsetY);

            userDate["lastTouchPos"][0] = c.offsetX;
            userDate["lastTouchPos"][1] = c.offsetY;

            console.log(
                Check_TouchImagePostion_CorrectAnswer(
                    userDate["lastTouchPos"],
                    questionDate["answer_map"],
                    10
                )
            );
        });
});



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
     * @param answer_map 間違い場所を2次元配列で管理しているもの
     * @param range どれくらいのpx誤差を許容するか?
     */
function Check_TouchImagePostion_CorrectAnswer(touchPos,answer_map,range){
    let isTouchAnswer = false;
    answer_map.forEach(ans_map => {
        isTouchAnswer = false;
        
        console.log(`Check_touchPosCorrectAnswer\n SelectPos-x:${touchPos[0]},y:${touchPos[1]} \n AnswerPos-x:${ans_map[0]}, y:${ans_map[1]} \n range:${range}`);
        
        
        //0 = x座標 1 = y座標.
        if(ans_map[0] == touchPos[0] && ans_map[1] == touchPos[1])
        {
            
            isTouchAnswer = true;
        }
        //範囲の中に収まってる
        else if( 
            (ans_map[0]-range <= touchPos[0] && ans_map[0]+range >= touchPos[0]) &&
            (ans_map[1]-range <= touchPos[1] && ans_map[1]+range >= touchPos[1])
            )
        {   
            console.log(`answers \n +x${ans_map[0]+range},-x${ans_map[0]-range} \n +y${ans_map[1]+range},-y${ans_map[1]-range} \n`);
            isTouchAnswer = true;
        }
        else{ 
            isTouchAnswer = false;
        }
        console.log(isTouchAnswer);
        

    })
    
    return isTouchAnswer;
}




    