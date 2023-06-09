const express = require('express');

const { OPENAI_CONTENT } = require('../configs');

const chatAI = require('../services/openai');

const router = express.Router();

/** 映射鍵值 */
const MAP_FLASH_KEY = {
  /** OpenAI 解答類型, 1:釋義, 2:聯想, 0:啥都沒有 */
  TYPE: 'type',
  QUES_CONTENT: 'ques_content',
  /** 問題內容/成語 */
  IDIOM_NAME: 'idiom_name',
  /** 成語釋義 */
  IDIOM_INTERPRETATION: 'idiom_interpretation',
  /** 問題內容/成語 cn */
  IDIOM_NAME_CN: 'idiom_name_cn',
  /** 成語釋義 cn */
  IDIOM_INTERPRETATION_CN: 'idiom_interpretation_cn',
  /** 更多成語內容連結 */
  IDIOM_MORE: 'idiom_more_href',
};

router.get('/', async (req, res) => {
  const type = req.flash(MAP_FLASH_KEY.TYPE)[0] || '';
  const data = {
    type,
    [MAP_FLASH_KEY.QUES_CONTENT]:
      req.flash(MAP_FLASH_KEY.QUES_CONTENT)[0] || '',
  };
  res.render(
    'index',
    Object.assign(
      {
        title: '不專業成語大師',
        ques_placeholder: '說吧 想問啥成語意思，或者給我描述幫你想成語',
        type,
      },
      data
    )
  );
});

module.exports = router;
