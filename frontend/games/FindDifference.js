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
 * @param answer_map クリックするとどこが間違ってるかを教えてくれる
 * @param CorrectAnswer answer_mapの連番でどれが正解したかを保存する
 */

let questionDate = {
    "ImageList":[], 
    "answer_map":[[116,69],[42,51]], 
    "CorrectAnswer":[false,false],
}


const imgs = document.querySelectorAll(".imgs");

imgs.forEach(img =>{
    questionDate["ImageList"].push([img,img.naturalWidth,img.naturalHeight]);
    
})

LoadImages(0,questionDate["ImageList"][0]);
LoadImages(1,questionDate["ImageList"][1]);



console.log(questionDate["ImageList"]);

// // 画像とCanvas要素を取得
// const img = document.getElementById('sourceImage');
// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');

// // ボタンが押されたらCanvasに描画
// document.getElementById('drawButton').addEventListener('click', () => {
//     // 画像の幅と高さに合わせてCanvasサイズを設定
//     canvas.width = img.naturalWidth;  // 元画像の幅
//     canvas.height = img.naturalHeight; // 元画像の高さ

//     // Canvasに画像を描画
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// });

let userDate = {
    "lastTouchPos":[25.32, 3452.3],
    "selectTouchPostions":[[2432,343],[2432,343]]
}


let userClick_history = [];
let canvas_history = [[],[]]
const canvas_images = document.querySelectorAll(".different-image");

/**
 * 画像をロードする関数です。
 * @param images_number (int)連番の値
 * @param images_number ()連番の値
 */
function LoadImages(images_number,LoadImage)
{
    // images_list[images_number].HTMLimages = LoadImage
    var drowCTX = images_list[images_number].getContext('2d');
    
    images_list[images_number].width = LoadImage[1].naturalWidth;  // 元画像の幅
    images_list[images_number].height = LoadImage[2].naturalHeight; // 元画像の高さ
    drowCTX.drawImage(LoadImage[0], 0, 0, LoadImage[1].naturalHeight, LoadImage[2].naturalHeight);
}


console.log(images_list[0]);

/**
     * 指定した場所を描画する処理
     * @param map  一次元の配列です{34,42}のような形式で送ってください
     */
function Drow_ScuessImagePostion(map){
    images_list.forEach(img =>{
        var drowCtx = img.getContext("2d");
        drowCtx.beginPath();
        drowCtx.arc(map[0], map[1], 2, 0, Math.PI * 2);
        
        drowCtx.fillStyle = 'red';
        if(Check_TouchImagePostion_CorrectAnswer([map[0],map[1]],questionDate["answer_map"],10))
            {
                drowCtx.fillStyle = 'green';
            }
        
        drowCtx.fill();
        drowCtx.stroke();
    })
}





//画像のどこをタップしたかを調べる処理
images_list.forEach(image =>
{
    image.addEventListener("click",(c)=>
        {
            console.log(c.offsetX,c.offsetY);

            
            userDate["lastTouchPos"][0] = c.offsetX;
            userDate["lastTouchPos"][1] = c.offsetY;

            Drow_ScuessImagePostion([c.offsetX,c.offsetY]);
            if (debug_log["postion"] == true){
                console.log(
                    Check_TouchImagePostion_CorrectAnswer(
                        userDate["lastTouchPos"],
                        questionDate["answer_map"],
                        10
                    )
                    
                );
            }
            
        });
});


/** 
     * 正解の場所かどうかを判定する処理
     * @param touchPos 要素数2の1次元の配列
     * @param answer_map 間違い場所を2次元配列で管理しているもの
     * @param range どれくらいのpx誤差を許容するか?
     */
function Check_TouchImagePostion_CorrectAnswer(touchPos,answer_map,range){
    let isTouchAnswer = false;
    answer_map.forEach(ans_map => {
        // isTouchAnswer = false;
        console.log(`helloWOrld${ans_map}`)
        console.log(`Check_touchPosCorrectAnswer\n SelectPos-x:${touchPos[0]},y:${touchPos[1]} \n AnswerPos-x:${ans_map[0]}, y:${ans_map[1]} \n range:${range}`);
        

        //0 = x座標 1 = y座標.
        if ((ans_map[0]-range <= touchPos[0] && ans_map[0]+range >= touchPos[0]) &&
            (ans_map[1]-range <= touchPos[1] && ans_map[1]+range >= touchPos[1]) 
            )
        {   
            console.log(`answers \n +x${ans_map[0]+range},-x${ans_map[0]-range} \n +y${ans_map[1]+range},-y${ans_map[1]-range} \n`);
            isTouchAnswer = true;
        }

        else
        { 
            // isTouchAnswer = false;
        }
        console.log(isTouchAnswer);
        

    })
    
    return isTouchAnswer;
}

function Drow_CorrectAnswer(){
    questionDate["answer_map"].forEach(ans_map => {
        console.log("\n==============================================\n");
        Drow_ScuessImagePostion(ans_map);
    })
}
Drow_CorrectAnswer();