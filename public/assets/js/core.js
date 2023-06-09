/** @type {Element | null} */
let elemQues = null;
/** @type {Element | null} */
let elemGrandmaster = null;

let inputContent = {
  ques: '',
  ques_cn: '',
};
/**
 * 初始化輸入框
 */
const initInput = () => {
  const elemQuesWrap = document.querySelector('#ques-wrap');
  function onFocusInput() {
    elemQuesWrap.classList.add('focus');
    elemQues.value = inputContent.ques;
  }
  async function onBlurInput(e) {
    elemQuesWrap.classList.remove('focus');
    const value = e.target.value;
    if (inputContent.ques != value) {
      inputContent.ques = value;
      const res = await fetch('/api/simp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: value,
        }),
      });
      const { cn } = await res.json();
      inputContent.ques_cn = cn;
    }
    elemQues.value = inputContent.ques_cn;
  }
  function onChange(e) {
    const target = e.target;
    const value = target.value;
    if (value) {
      elemQuesWrap.classList.add('can');
    } else {
      elemQuesWrap.classList.remove('can');
    }
  }
  elemQues.addEventListener('focus', onFocusInput);
  elemQues.addEventListener('blur', onBlurInput);
  elemQues.addEventListener('input', onChange);
};

/**
 * 初始化彈窗
 * @description 針對靜態彈窗，動態生成彈窗不理會XD
 */
const initPopup = () => {
  document.querySelectorAll('.popup').forEach((elemPopup) => {
    elemPopup.querySelector('.btn-close')?.addEventListener('click', () => {
      elemPopup.classList.remove('show');
      elemGrandmaster.classList.remove('move');
      elemQues.removeAttribute('disabled');
    });
  });
};

const checkConfig = () => {
  if (!window.__CUSTOM_INIT__.type) {
    return;
  }
  setTimeout(() => {
    if (1 == window.__CUSTOM_INIT__.type || 2 == window.__CUSTOM_INIT__.type) {
      const elems = document.querySelectorAll('.interpretation, .associate');
      elems.forEach((elemPopup) => {
        elemQues.setAttribute('disabled', 'disabled');
        elemPopup.classList.add('preshow');
        setTimeout(() => {
          elemPopup.classList.remove('preshow');
          elemPopup.classList.add('show');
          elemGrandmaster.classList.add('move');
        }, 100);
      });
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', function () {
  elemQues = document.querySelector('#ques');
  elemGrandmaster = document.querySelector('.grandmaster');
  initInput();
  initPopup();
  checkConfig();
});
