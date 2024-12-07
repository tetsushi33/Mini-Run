function navigate(screenNumber) {
    // すべての画面を非表示にする
    document.getElementById('screen1').style.display = 'none';
    document.getElementById('screen2').style.display = 'none';
    document.getElementById('screen3').style.display = 'none';

    // 選択された画面を表示
    document.getElementById('screen' + screenNumber).style.display = 'block';

    // ボタンをリセットして灰色にする
    resetButtons();

    // 選択されたボタン以外を無効化（灰色にする）
    document.getElementById('btn' + screenNumber).classList.add('inactive-btn');
}

function resetButtons() {
    // すべてのボタンを元に戻す
    document.getElementById('btn1').classList.remove('inactive-btn');
    document.getElementById('btn2').classList.remove('inactive-btn');
    document.getElementById('btn3').classList.remove('inactive-btn');
}
