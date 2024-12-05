// console.log("loadQuiz.js");



// quiz
const select_options = document.querySelectorAll(".selects");
const question = document.getElementById("question_text");
let correctAnswer = "start-answer";


    /**
     * 質問を書き込む
     * @param question_text (string)質問文
     * @param selects (list-string)選択肢で表示するもの
     * @param answer_number (int)selectsでの連番-何番目の選択肢を正解にするか、
     * その名前のdisplayを表示する
     */
    function quiz_set(question_text,selects,answer_number)
    {
        question.textContent = question_text;
        const quiz_contents = select_options.item(0).children;      
        for(var i = 0; i < 4;i++)
        {
        quiz_contents[i].textContent = selects[i];
        }
        correctAnswer = selects[answer_number];
    }


    function quiz_SelectEvent()
    {
        select_options.forEach(option => 
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
    }

export{
    quiz_SelectEvent,
    quiz_set
}