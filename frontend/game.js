const homeScreen = document.getElementById("home");
const quiz_Screen = document.getElementById("quiz-container");
const differentPoint_Screen = document.getElementById("differentPoint-container");
const introdon_Screen = document.getElementById("introDon-container");

const playScreen = document.getElementById("play-mode");
const createScreen = document.getElementById("create-mode");

const resultScreen = document.getElementById("result");
const gameModeScreen = document.getElementById("game-mode");
const selectGameScreen = document.getElementById("SelctGameKind");
const createQuizScreen = document.getElementById("create_quizScreen");



document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    
    const createButton = document.getElementById("create-button");
    const playButton = document.getElementById("play-button");
    const nextButton = document.querySelector(".next-button");
    const quitButton = document.querySelector(".quit-button");
    

    const gameKindOptions = document.querySelectorAll(".gamekind-option");

    //quiz
    const quiz_select_options = document.querySelectorAll(".quiz_selects");
    const quiz_qustion = document.getElementById("question_text");
    const quiz_result = document.getElementById("quiz-judge");

    const statusText = document.querySelector(".status");
    const answerText = document.querySelector(".answer");




    // ゲームデータ
    let gameMode = "play";

    createButton.addEventListener("click",()=>{
        gameMode = "create";
    });
    playButton.addEventListener("click",()=>{
        gameMode = "play";
    });

    //ゲーム選択画面でそのままLoadingKeyに入れるようにするための対策
    const gamekind = {
      "クイズ":"quiz",
      "間違い探し":"differentPoint",
      "イントロドン":"introdon"
    }

    //bug
    const gameSetting = {
      "create":{
        "クイズ":"quiz",
        "間違い探し":"differentPoint",
       "イントロドン":"introdon"
      },
      "play":{
        "クイズ":"create_quiz",
        "間違い探し":"create_differentPoint",
        "イントロドン":"create_introdon"
      }
    }



    function loadQuizQuestion(url, callback) {
        const getUrl = url + "/api/play/quiz";
  
        fetch(getUrl, {
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`ステータスエラー: ${response.status}`);
            }
            return response.json(); // JSONを解析
        })
        .then(data => {
            callback(null, data); // データをコールバックで返す
        })
        .catch(error => {
            callback(error, null); // エラーをコールバックで返す
        });
    }
  


      /**
     * 質問を書き込む
     * @param question_text { string } 質問文
     * @param selects (list-string)選択肢で表示するもの
     * @param answer_number (int)selectsでの連番-何番目の選択肢を正解にするか、
     * その名前のdisplayを表示する
     */

    function set_quiz(question_text,selects,answer_number)
    {
        quiz_qustion.textContent = question_text;
        const quiz_contents = quiz_select_options.item(0).children;      
        for(var i = 0; i < 4;i++)
        {
          quiz_contents[i].textContent = selects[i];
        }
        correctAnswer = selects[answer_number];
    }


    function rd(max){
        return Math.floor(Math.random() * max)
    }
    console.log(rd(2));
    /**
     * That option discplayis
     * @param display (string)この引数にhome,quiz,result,game_select,game_modeなどをstringで入れると、
     * その名前のdisplayを表示する
     */
    function displayLoadRequest(display)
    {

        createScreen.classList.add("d-none");
        playScreen.classList.add("d-none");
        if(gameMode == "create"){
            createScreen.classList.remove("d-none");
        }else if (gameMode == "play"){
            playScreen.classList.remove("d-none");
        }

        gameModeScreen.classList.add("d-none");
        selectGameScreen.classList.add("d-none");
        
        quiz_Screen.classList.add("d-none");
        differentPoint_Screen.classList.add("d-none");
        introdon_Screen.classList.add("d-none");
        
        resultScreen.classList.add("d-none");
        homeScreen.classList.add("d-none");
        create_quizScreen.classList.add("d-none");
        

        console.log(`display:${display}`);

        if (display == "home")
        {
            homeScreen.classList.remove("d-none");
        }
        
        //game-play
        else if (display == "quiz")
        {

            loadQuizQuestion("http://localhost:5001", (error, data) => {
                if (error) {
                    console.error("エラー:", error);
                } else {
                    console.log("取得したクイズデータ:", data);
                    
                    set_quiz(data["game_content"]["question"],data["game_content"]["selects"],data["game_content"]["answer_idx"]);
                }
            });
            quiz_Screen.classList.remove("d-none");


        }
        else if (display == "differentPoint")
        {
            differentPoint_Screen.classList.remove("d-none");
        }
        else if (display == "introdon")
        {
            introdon_Screen.classList.remove("d-none");
        }

        //gameCreate
        else if (display == "create_quiz")
        {
            
            createQuizScreen.classList.remove("d-none");
            

        }

        else if (display == "create_differentPoint")
        {

        }

        else if (display == "create_introdon")
        {

        }

            
        
        


        else if (display == "game_select")
        {
            selectGameScreen.classList.remove("d-none");
        }
        
        else if (display == "game_mode")
        {
            gameModeScreen.classList.remove("d-none");
        }
        
        else if (display == "result")
        {
            resultScreen.classList.remove("d-none");
        }
    }
    


    displayLoadRequest("home");
    
    
    startButton.addEventListener("click", () => {
      displayLoadRequest("game_mode");
    });

    playButton.addEventListener("click",()=>{
      console.log("呼ばれてる１")
      displayLoadRequest("game_select");
    });

    createButton.addEventListener('click',()=>{
      console.log("呼ばれてる２")
      displayLoadRequest("create_quiz");
    });

    //gameMode


      // ============================================================クイズ================================================================================
//============================================================================================================================================
      
      quiz_select_options.forEach(option => {
        console.log(option[0]);
        option.addEventListener("click", (event) => {
          const selectedAnswer = event.target.textContent;
    
          // 判定処理
          if (selectedAnswer === correctAnswer) 
          {
            console.log("正解");
            quiz_result.textContent = "正解！"
            quiz_result.style.color = "#28a745";
          }


          else
          {
            console.log("不正解");
            quiz_result.textContent = "残念、不正解…"
            quiz_result.style.color = "#dc3545"; 
          }

    
          // answerText.textContent = correctAnswer; // 正解を表示
    
          // 結果画面へ移動
          displayLoadRequest("result");
        });
      });

//============================================================================================================================================
//============================================================================================================================================
//========================================間違い探し================================================================================
      
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
          questionDate["ImageList"].push([img.src,img.naturalWidth,img.naturalHeight]);
      })
      console.log(questionDate["ImageList"]);
      LoadImages(0,questionDate["ImageList"][0]);
      LoadImages(1,questionDate["ImageList"][1]);



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
          var d_image = new Image();
          d_image.src = LoadImage[0];
          
          images_list[images_number].width = LoadImage[1];  // 元画像の幅
          images_list[images_number].height = LoadImage[2]; // 元画像の高さ
          console.log(`image:${LoadImage[0]}, dx:0, dy:0, Dwidth:${LoadImage[1]}, Dheight:${LoadImage[2]}`);
          drowCTX.drawImage(d_image, 0, 0, LoadImage[1], LoadImage[2]);

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



//============================================================================================================================================
//============================================================================================================================================
//============================================================================================================================================

//=======================イントロドン======================================

      const introdon_startButton = document.getElementById('start-button');
      const submitButton = document.getElementById('submit-answer-button');
      const resultMessage = document.getElementById('result-message');
      // const nextButton = document.getElementById('next-button');
      const answerInput = document.getElementById('answer-input');
      const timeLeftElement = document.getElementById('time-left');
      const answerCountElement = document.getElementById('answer-count');
      const maxAnswerCountElement = document.getElementById('max-answer-count');
      const infoText = document.getElementById('info-text');
      const button1 = document.getElementById('button1');
      const button2 = document.getElementById('button2');

      const audio = new Audio('your-music-file.mp3');
      let timer;
      let timeRemaining = 10; 
      let answerCount = 0;
      const maxAnswerCount = 5; 
      // let correctAnswer = "曲名"; 
      let quizFinished = false;
      let answerEnabled = false;

      // 初期設定
      maxAnswerCountElement.textContent = maxAnswerCount;
      answerInput.style.display = 'none';
      submitButton.style.display = 'none';
      submitButton.disabled = true;


      introdon_startButton.addEventListener('click', function () {
          audio.play();
          introdon_startButton.disabled = true;
          startTimer();
      });

      function startTimer() {
          timer = setInterval(function () {
              timeRemaining--;
              timeLeftElement.textContent = timeRemaining;

              if (timeRemaining <= 0) {
                  clearInterval(timer);
                  endQuiz(false);
              }
          }, 1000);
      }

      function resetButtons() {
          button1.disabled = false;
          button2.disabled = false;
          button1.classList.remove('disabled');
          button2.classList.remove('disabled');
          button1.style.backgroundColor = '#4caf50';
      button2.style.backgroundColor = '#4caf50';
      }

      button1.addEventListener('click', function () {
          enableAnswer();
          button1.disabled = true;
          button2.classList.add('disabled');
          button2.style.backgroundColor = '#ccc';
      });

      button2.addEventListener('click', function () {
          enableAnswer();
          button2.disabled = true;
          button1.classList.add('disabled');
          button1.style.backgroundColor = '#ccc';
      });

      function enableAnswer() {
          answerEnabled = true;
          answerInput.style.display = 'block';
          submitButton.style.display = 'block';
          submitButton.disabled = false;
      }

      submitButton.addEventListener('click', function () {
          if (quizFinished || !answerEnabled) return;

          const userAnswer = answerInput.value.trim();
          answerCount++;
          answerCountElement.textContent = answerCount;

          if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
              endQuiz(true);
          } else if (answerCount >= maxAnswerCount) {
              endQuiz(false);
          } else {
              resultMessage.style.display = 'block';
              resultMessage.textContent = "×";
              resultMessage.className = 'incorrect';
              resetButtons(); // ボタンの状態をリセット
          }
      });

      nextButton.addEventListener('click', function () {
          // window.location.href = 'next-page.html';
          displayLoadRequest("home");
      });

      function endQuiz(isCorrect) {
          clearInterval(timer);
          quizFinished = true;

          resultMessage.style.display = 'block';
          nextButton.style.display = 'block';

          if (isCorrect) 
          {
              resultMessage.textContent = "〇";
              resultMessage.className = 'correct';
          } 
          
          else 
          {
              resultMessage.textContent = "×";
              resultMessage.className = 'incorrect';
          }
      
          disableAllInputs();

          // 解答入力と解答完了ボタンを無効化
          answerInput.disabled = true;
          submitButton.disabled = true;
          submitButton.classList.add('disabled');
      }

    function disableAllInputs() {
      document.querySelectorAll('.answer-button').forEach(button => {
          button.disabled = true;
          button.classList.add('disabled');
      });

      // 解答入力フィールドと解答完了ボタンを無効化
      answerInput.disabled = true;
      submitButton.disabled = true;
      submitButton.classList.add('disabled');
    }  

    function enableAllInputs() {
      document.querySelectorAll('.answer-button').forEach(button => {
          button.disabled = false;
          button.classList.remove('disabled');
      });
      // 解答完了ボタンも有効化
      submitButton.disabled = false;
      submitButton.classList.remove('disabled');
      answerInput.disabled = false;
    }

//============================================================================================================================================
//============================================================================================================================================
      

    console.log(gameKindOptions);
    gameKindOptions.forEach(option => 
    {
      console.log(option);
      option.addEventListener("click", (event) => 
      {
        const selectGameKind = event.target.textContent;

        //選択したボタンのtextCountentからと一致する名前のゲームのdivを表示する
        if(gamekind[selectGameKind] != null){
          displayLoadRequest(gamekind[selectGameKind]);
        }
        
        else
        {
          console.error(`selectGameKindOptionNothing ,date${selectGameKind}`);
        }
      });


    });


    // //テスト用のプログラムを組み込んでいる
    // quiz_set(question_date[0]["question"],
    //   question_date[0]["selects"],
    //   question_date[0]["answer"]);


    let quiz_number
    // 次の問題へ（ここでは単純にホーム画面に戻る処理）
    nextButton.addEventListener("click", () => {
        displayLoadRequest("quiz");
    });

    // やめる（ホーム画面に戻る）
    quitButton.addEventListener("click", () => {
      displayLoadRequest("home");
    });

    
    document.getElementById("submit_quiz").addEventListener("click", async function () {
        // フォームからデータを取得
        const question = document.getElementById("quiz_question").value;
        const options = [
            document.getElementById("option_1").value,
            document.getElementById("option_2").value,
            document.getElementById("option_3").value,
            document.getElementById("option_4").value,
        ];
        const answer = parseInt(document.getElementById("quiz_answer").value, 10);
    
        // 入力チェック
        if (!question || options.some(option => !option) || isNaN(answer) || answer < 1 || answer > 4) {
            alert("すべてのフィールドを正しく入力してください。");
            return;
        }
    
        // クイズデータを表示（または送信）
        const quizData = {
            question: question,
            selects: options,
            answer_idx: answer,
        };
    
        // クイズデータをサーバーに送信
        try {
            const response = await fetch('http://localhost:5001/api/create/quiz', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(quizData),
            });
          
            if (!response.ok) {
              throw new Error('Failed to fetch');
            }
          
            console.log(await response.json());
          } catch (error) {
            console.error(error);
          };
    
    
    console.log("クイズデータ:", quizData);
        alert("クイズが作成されました！");

    });
    
    });
    
  
 