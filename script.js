
document.addEventListener('DOMContentLoaded', function () {
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

    const audio = new Audio('your-music-file.mp3');
    let timer;
    let timeRemaining = 10; 
    let answerCount = 0;
    const maxAnswerCount = 5; 
    let correctAnswer = "曲名"; 
    let quizFinished = false;
    let answerEnabled = false;

    // 初期設定
    maxAnswerCountElement.textContent = maxAnswerCount;
    answerInput.style.display = 'none';
    submitButton.style.display = 'none';
    submitButton.disabled = true;


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
            resetButtons(); // ボタンの状態をリセット
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
})