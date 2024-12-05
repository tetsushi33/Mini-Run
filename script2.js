document.getElementById("create-button").addEventListener("click", function () {
    const audioFile = document.getElementById("audio-upload").files[0];
    const answer = document.getElementById("answer-input").value;

    // 音声ファイルがない場合
    if (!audioFile) {
        alert("音声ファイルを入力してください！");
        return;
    }

    // 答えがない場合
    if (!answer) {
        alert("答えを入力してください！");
        return;
    }
    

    // フォームデータの作成
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("answer", answer);

    // データをバックエンドに送信
    fetch("YOUR_BACKEND_URL", {
        method: "POST",
        body: formData 
    })
        
    
    .then((response) => {
        if (response.ok) {
            document.getElementById("status-message").style.display = "block";
        } else {
            alert("エラーが発生しました。再試行してください。");
        }
    })
    .catch((error) => {
        console.error("通信エラー:", error);
        alert("通信エラーが発生しました。");
    });
document.getElementById("audio-upload").addEventListener("change", toggleCreateButton);
document.getElementById("answer-input").addEventListener("input", toggleCreateButton);
        
function toggleCreateButton() {
    const audioFile = document.getElementById("audio-upload").files[0];
    const answer = document.getElementById("answer-input").value;
        
    const createButton = document.getElementById("create-button");
        
    // 音声ファイルと答えが両方入力されている場合はボタンを有効化
    if (audioFile && answer) {
        createButton.disabled = false;
            } else {
        createButton.disabled = true;
    }
}
        
// 初期状態でボタンを無効化しておく
toggleCreateButton();
        
});
