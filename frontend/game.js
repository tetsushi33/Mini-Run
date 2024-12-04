document.addEventListener("DOMContentLoaded", () => {
    const homeScreen = document.getElementById("home");
    const quizScreen = document.getElementById("quiz");
    const resultScreen = document.getElementById("result");
    const gameModeScreen = document.getElementById("game-mode");
    const selectGameScreen = document.getElementById("SelctGameKind");

  
    const startButton = document.getElementById("start-button");
    const createButton = document.getElementById("create-button");
    const playButton = document.getElementById("play-button");

    
    
    const options = document.querySelectorAll(".selects");
    const nextButton = document.querySelector(".next-button");
    const quitButton = document.querySelector(".quit-button");
    const gameKindOptions = document.querySelectorAll(".gamekind-option");
    // const gameModeOptions = document.querySelector(".gamemodes-option");


    const statusText = document.querySelector(".status");
    const answerText = document.querySelector(".answer");
  
    // ゲームデータ
    let gameMode = "play";
    //ゲーム選択画面でそのままLoadingKeyに入れるようにするための対策
    gamekind = {
      "クイズ":"quiz",
      "間違え探し":"SerchDifferent",
      "イントロドン":"introdon"
    }

    questions = [
      {
          "question": "halejfalwjfwfioa",
          "options": [
              "hewaj;foewifj;w", 
              "jfoiea;jfiwfo", 
              "hoieajf;fjwf", 
              "hioefj;aefiofe"
          ],
          "answer": "hfeafjaweo;fiw"
      },

      {
          "question": "別の質問例",
          "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
          "answer": "選択肢1"
      },
  ]  


    /**
     * That option discplayis
     * @param display (string)この引数にhome,quiz,result,game_select,game_modeなどをstringで入れると、
     * その名前のdisplayを表示する
     */
    function displayLoadRequest(display)
    {
        
        gameModeScreen.classList.add("d-none");
        selectGameScreen.classList.add("d-none");
        quizScreen.classList.add("d-none");
        resultScreen.classList.add("d-none");
        // menuScreen.classList.add("d-none");
        homeScreen.classList.add("d-none");
        if (display == "home")
        {
            homeScreen.classList.remove("d-none");
        }
        else if (display == "quiz")
        {
            quizScreen.classList.remove("d-none");
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
    // 正解データ
    let correctAnswer = "スイッチ";
    
    // ゲームモードへ行く
    startButton.addEventListener("click", () => {
        /*
        homeScreen.classList.add("d-none");
      quizScreen.classList.remove("d-none");
      */
      displayLoadRequest("game_mode");
    });

    playButton.addEventListener("click",()=>{
      displayLoadRequest("game_select");
    });

    //gameMode


    //クイズ
    options.forEach(option => {
      console.log(option[0]);
      option.addEventListener("click", (event) => {
        const selectedAnswer = event.target.textContent;
  
        // 判定処理
        if (selectedAnswer === correctAnswer) 
        {
          statusText.textContent = "正解";
          statusText.style.color = "#28a745"; 
        }


        else
        {
          statusText.textContent = "不正解";
          statusText.style.color = "#dc3545"; 
        }
  
        answerText.textContent = correctAnswer; // 正解を表示
  
        // 結果画面へ移動
        displayLoadRequest("result");
      });
    });
    
    
    //間違い探し

    

    console.log(gameKindOptions);
    gameKindOptions.forEach(option => 
    {
      console.log(option);
      option.addEventListener("click", (event) => 
      {
        const selectGameKind = event.target.textContent;
        if(gamekind[selectGameKind] != null){
          displayLoadRequest(gamekind[selectGameKind]);
        }
        
        else
        {
          console.error("selectGameKindOptionNothing");
        }
      });
    });

    /*
     * 作る
     * @param questions リスト
     **/

    q = ["hello","helntai","haefo;wj","jfo;ejfw"]
    function quiz_set(questions,answer_number)
    {
      const quiz_contents = options.item(0).children;      
      for(var i = 0; i < 4;i++)
      {
        quiz_contents[i].textContent = questions[i];
      }
      correctAnswer = questions[answer_number];
    }

    quiz_set(q,2);
    
  
    // 回答選択
    options.forEach(option => 
    {
      option.addEventListener("click", (event) => {
        const selectedAnswer = event.target.textContent;
  
        // 判定処理
        if (selectedAnswer === correctAnswer) 
        {
          statusText.textContent = "正解";
          statusText.style.color = "#28a745"; 
        }
        else
        {
          statusText.textContent = "不正解";
          statusText.style.color = "#dc3545"; 
        }
  
        answerText.textContent = correctAnswer; // 正解を表示
        
        // 結果画面へ移動
        displayLoadRequest("result");
      });
    });
  

    // 次の問題へ（ここでは単純にホーム画面に戻る処理）
    nextButton.addEventListener("click", () => {
      displayLoadRequest("home");
    });
  
    // やめる（ホーム画面に戻る）
    quitButton.addEventListener("click", () => {
      displayLoadRequest("home");
    });

    
  });

