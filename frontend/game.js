document.addEventListener("DOMContentLoaded", () => {
    const homeScreen = document.getElementById("home");
    const quizScreen = document.getElementById("quiz");
    const resultScreen = document.getElementById("result");
    const menuScreen = document.getElementById("menu");
  
    const startButton = document.getElementById("start-button");
    const createButton = document.getElementById("create-button");
    const playButton = document.getElementById("play-button");
    
    const options = document.querySelectorAll(".selects");
    const nextButton = document.querySelector(".next-button");
    const quitButton = document.querySelector(".quit-button");


  
    const statusText = document.querySelector(".status");
    const answerText = document.querySelector(".answer");
  
    // クイズデータ
    
    
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
          "answer": "正解"
      }
  ]  

    function reqListener(){
      console.log(this.responseText);
    }

    function LoadRequest(){
      console.log("hello");

      const req = new XMLHttpRequest();
      // req.addEventListener("load",reqListener);
      req.open("GET","http://127.0.0.1:2342/info/2")
      // req.send();
      req.responseType = "json";
      req.onload = () => {
        if(req.readyState == 4 && req.status == 200){
          const date = req.response;
          console.log(date);
          return date;
        }else{
          console.log(`Error: ${req.status}`);
        }
      };
      return "Not Found";    
    }


    question = {}

    fetch('http://127.0.0.1:2342/info/2')
        .then(res => res.json())
        .then(data => {
          console.log(data[0]);
          const question = data[0];
          const d = document.createElement('h1');
          d.innerText=question["questiondate"];
          document.body.appendChild(d)
        })
       

displayLoadRequest
    //display
    function displayLoadRequest(display)
    {
        /**
         * That option discplayis
         * @param display (string)第1引数のコメント
         * [home],["quiz"],["menu"],["result"]
         */
        quizScreen.classList.add("d-none");
        resultScreen.classList.add("d-none");
        menuScreen.classList.add("d-none");
        homeScreen.classList.add("d-none");
        if (display == "home")
        {
            homeScreen.classList.remove("d-none");
        }
        else if (display == "quiz")
        {
            quizScreen.classList.remove("d-none");
        }
        else if (display == "menu")
        {
            menuScreen.classList.remove("d-none");
        }
        else if (display == "result")
        {
            resultScreen.classList.remove("d-none");
        }
    }

    // 正解データ
    const correctAnswer = "スイッチ";
  
    // クイズ開始
    startButton.addEventListener("click", () => {
        /*
        homeScreen.classList.add("d-none");
      quizScreen.classList.remove("d-none");
      */
        displayLoadRequest("menu");
    });

    
  
    // 回答選択
    options.forEach(option => {
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
        quizScreen.classList.add("d-none");
        resultScreen.classList.remove("d-none");
      });
    });
  

    function ScreenSet(switch_screen,screen)
    {
      console.log(screen,switch_screen);
      if(switch_screen == true)
      {
        
        screen.classList.remove("d-none");
      }
      else if(switch_screen == false)
      {
        screen.classList.add("d-none");
      }
      else
      {
        console.error("ScreenDon't set switch_screen");
      }
      console.log(screen,switch_screen);

    }

    // 次の問題へ（ここでは単純にホーム画面に戻る処理）
    nextButton.addEventListener("click", () => {
      // resultScreen.classList.add("d-none");
      // menuScreen.classList.add("d-none");
      // homeScreen.classList.remove("d-none");
      ScreenSet(false,resultScreen);
      ScreenSet(false,menuScreen);
      ScreenSet(true,homeScreen);
    });
  
    // やめる（ホーム画面に戻る）
    quitButton.addEventListener("click", () => {
      resultScreen.classList.add("d-none");
      homeScreen.classList.remove("d-none");
    });

    
  });

