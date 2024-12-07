document.addEventListener('DOMContentLoaded', function () {
    // DOM要素の取得
    const startButton = document.getElementById('start-button');
    const submitButton = document.getElementById('submit-answer-button');
    const resultMessage = document.getElementById('result-message');
    const nextButton = document.getElementById('next-button');
    const answerInput = document.getElementById('answer-input');
    const timeLeftElement = document.getElementById('time-left');
    const answerCountElement = document.getElementById('answer-count');
    const maxAnswerCountElement = document.getElementById('max-answer-count');
    const infoText = document.getElementById('info-text');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const createButton = document.getElementById('create-button');
    const audioUpload = document.getElementById('audio-upload');
    const statusMessage = document.getElementById('status-message');
    const navigation = document.getElementById("navigation");
    const quizContainer = document.getElementById("quiz-container");
    const createQuizContainer = document.getElementById("create-quiz-container");
    const showQuizButton = document.getElementById("show-quiz");
    const showCreateButton = document.getElementById("show-create");
    const screens = document.querySelectorAll(".screen");

    // 画面切り替え関数
    function switchScreen(targetScreen) {
        screens.forEach(screen => screen.classList.add("d-none")); // すべて非表示
        

        

        // 指定の画面を表示
        targetScreen.classList.remove("d-none");
    }
    

    // イベントリスナーを追加
    showQuizButton.addEventListener("click", () => {
        navigation.classList.add("d-none");
        quizContainer.classList.remove("d-none");
        createQuizContainer.classList.add("d-none");
        
    });

    showCreateButton.addEventListener("click", () => {
        navigation.classList.add("d-none");
        quizContainer.classList.add("d-none");
        createQuizContainer.classList.remove("d-none");
    });

    // クイズ設定
    const audio = new Audio('your-music-file.mp3');
    let timer;
    let timeRemaining = 60;
    let answerCount = 0;
    const maxAnswerCount = 5;
    let correctAnswer = "曲名";
    let quizFinished = false;
    let answerEnabled = false;

    // 音声アップロード初期設定
    if (createButton) createButton.disabled = true;
    

    // 初期化
    maxAnswerCountElement.textContent = maxAnswerCount;
    answerInput.style.display = 'none';
    submitButton.style.display = 'none';
    submitButton.disabled = true;

    
    

    // クイズ開始
    startButton.addEventListener('click', function () {
        audio.play();
        startButton.disabled = true;
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
            resetButtons();
        }
    });

    nextButton.addEventListener('click', function () {
        window.location.href = 'next-page.html';
    });

    function endQuiz(isCorrect) {
        clearInterval(timer);
        quizFinished = true;

        resultMessage.style.display = 'block';
        nextButton.style.display = 'block';

        if (isCorrect) {
            resultMessage.textContent = "〇";
            resultMessage.className = 'correct';
        } else {
            resultMessage.textContent = "×";
            resultMessage.className = 'incorrect';
        }

        disableAllInputs();
        answerInput.disabled = true;
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }

    function disableAllInputs() {
        document.querySelectorAll('.answer-button').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
        answerInput.disabled = true;
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }

    // 音声アップロードの処理
    if (audioUpload) {
        audioUpload.addEventListener('change', toggleCreateButton);
        answerInput.addEventListener('input', toggleCreateButton);
    }

    function toggleCreateButton() {
        const audioFile = audioUpload.files[0];
        const answer = answerInput.value;

        if (createButton) {
            createButton.disabled = !(audioFile && answer);
        }
    }

    if (createButton) {
        createButton.addEventListener('click', function () {
            const audioFile = audioUpload.files[0];
            const answer = answerInput.value;

            if (!audioFile || !answer) {
                alert("音声ファイルと答えを入力してください！");
                return;
            }

            const formData = new FormData();
            formData.append("audio", audioFile);
            formData.append("answer", answer);

            fetch("YOUR_BACKEND_URL", {
                method: "POST",
                body: formData
            })
                .then((response) => {
                    if (response.ok) {
                        statusMessage.style.display = "block";
                    } else {
                        alert("エラーが発生しました。再試行してください。");
                    }
                })
                .catch((error) => {
                    console.error("通信エラー:", error);
                    alert("通信エラーが発生しました。");
                });
        });
    }
    
});

