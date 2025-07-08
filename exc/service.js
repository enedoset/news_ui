// 查詢結果暫存，每個 tab 都有自己的查詢結果
const tabResults = {
  link: '',
  writing: '',
  question: ''
};
const defaultMsg = '請輸入問題並點擊查詢，這裡會顯示答案。';

/**
 * 切換查詢 tab
 * @param {string} type - 當前要切換的 tab 類型
 */
function switchTab(type) {
  const groups = ['link', 'writing', 'question'];
  // 隱藏所有 group
  groups.forEach(g => {
    document.getElementById(g + '-group').style.display = 'none';
  });
  // tab 樣式切換
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  if (type === 'link') {
    document.getElementById('link-group').style.display = 'flex';
    tabBtns[0].classList.add('active');
  } else if (type === 'writing') {
    document.getElementById('writing-group').style.display = 'flex';
    tabBtns[1].classList.add('active');
  } else if (type === 'question') {
    document.getElementById('question-group').style.display = 'flex';
    tabBtns[2].classList.add('active');
  }
  // 顯示對應 tab 的查詢結果或預設提示
  if (!tabResults[type]) {
    document.querySelector('.answer-card').innerHTML = defaultMsg;
  } else {
    document.querySelector('.answer-card').innerHTML = tabResults[type];
  }
}

// 綁定查詢按鈕點擊事件
// 依據目前顯示的 tab 取得輸入內容與日期，並進行驗證與顯示
// 驗證失敗則顯示錯誤訊息
// 驗證通過則顯示查詢結果並暫存

document.getElementById('query-btn').addEventListener('click', function (e) {
  // 按鈕回彈動畫
  const btn = e.currentTarget;
  btn.classList.remove('bounce'); // 先移除，確保能重複觸發
  void btn.offsetWidth; // 觸發 reflow
  btn.classList.add('bounce');

  let input = '';
  let date = '';
  let tabType = '';

  // 取得目前顯示的 group 與對應輸入值
  if (document.getElementById('link-group').style.display === 'flex') {
    input = document.getElementById('link-input').value;
    date = document.getElementById('link-date').value;
    tabType = 'link';
    // 網址格式檢查
    if (input && !/^https?:\/\/.+\..+/.test(input)) {
      showErrorMessage('請輸入網址！');
      return;
    }
  } else if (document.getElementById('writing-group').style.display === 'flex') {
    input = document.getElementById('writing-input').value;
    date = document.getElementById('writing-date').value;
    tabType = 'writing';
  } else if (document.getElementById('question-group').style.display === 'flex') {
    input = document.getElementById('question-input').value;
    date = document.getElementById('question-date').value;
    tabType = 'question';
  }

  // 內容檢查（優先）
  if (!input) {
    showErrorMessage('請輸入問題！');
    return;
  }
  // 日期檢查
  if (!date) {
    showErrorMessage('請選擇日期！');
    return;
  }
  // 組合輸出內容
  let output = `選擇的日期：${date}<br>你輸入的內容：${input}`;
  document.querySelector('.answer-card').innerHTML = output;
  // 存到對應 tab 的暫存
  if (tabType) tabResults[tabType] = output;
});

// 監聽動畫結束，自動移除 bounce class
const queryBtn = document.getElementById('query-btn');
queryBtn.addEventListener('animationend', function() {
  queryBtn.classList.remove('bounce');
});

/**
 * 顯示錯誤訊息（紅色提示條，2 秒後自動消失）
 * @param {string} msg - 要顯示的錯誤訊息
 */
let errorMsgTimeout = null; // 全域 timeout id
function showErrorMessage(msg) {
  const errorDiv = document.querySelector('.error-message');
  errorDiv.textContent = msg;
  errorDiv.classList.add('show');
  errorDiv.style.display = 'block';
  // 清除舊的 timeout，避免多重顯示
  if (errorMsgTimeout) {
    clearTimeout(errorMsgTimeout);
    errorMsgTimeout = null;
  }
  errorMsgTimeout = setTimeout(() => {
    errorDiv.classList.remove('show');
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 400);
    errorMsgTimeout = null;
  }, 2000);
} 