const express = require('express');

const { OPENAI_CONTENT } = require('../configs');

const chatAI = require('../services/openai');

const convertToSimp = require('../services/transform_trad2simp');

const { checkIdiom } = require('../services/fetch_idiom');

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

router
  .get('/', async (req, res) => {
    const type = req.flash(MAP_FLASH_KEY.TYPE)[0] || '';
    const data = {
      type,
      [MAP_FLASH_KEY.QUES_CONTENT]:
        req.flash(MAP_FLASH_KEY.QUES_CONTENT)[0] || '',
    };
    const idiomName = req.flash(MAP_FLASH_KEY.IDIOM_NAME)[0];
    const idiomInterpretation = req.flash(
      MAP_FLASH_KEY.IDIOM_INTERPRETATION
    )[0];
    if (1 == type) {
      data.idiom_name = idiomName;
      data.idiom_interpretation = idiomInterpretation;
      data.idiom_name_cn = convertToSimp(idiomName);
      data.idiom_interpretation_cn = convertToSimp(idiomInterpretation);
    } else if (2 == type) {
      data.idiom_name = idiomName;
      data.idiom_name_cn = convertToSimp(idiomName);
    }
    res.render(
      'index',
      Object.assign(
        {
          title: convertToSimp('不專業成語大師'),
          ques_placeholder: convertToSimp(
            // '說吧 想問啥成語意思，或者給我描述幫你想成語'
            '說吧 給我點描述幫你想成語'
          ),
          type,
        },
        data
      )
    );
  })
  .post('/', async (req, res) => {
    const { description: ques } = req.body;
    if (!ques) {
      req.flash(MAP_FLASH_KEY.TYPE, 3);
      res.redirect('/');
      return;
    }
    // const { status, href, description: idiomExplanation } = await checkIdiom(
    //   ques
    // );
    // 取得成語釋義
    if (false) {
      req.flash(MAP_FLASH_KEY.TYPE, 1);
      req.flash(MAP_FLASH_KEY.IDIOM_NAME, ques);
      req.flash(MAP_FLASH_KEY.IDIOM_INTERPRETATION, idiomExplanation);
      req.flash(MAP_FLASH_KEY.IDIOM_MORE, href);
    } else {
      const description = `${ques}`;
      const answer = await chatAI({
        content: OPENAI_CONTENT,
        description,
      });
      req.flash(MAP_FLASH_KEY.TYPE, 2);
      req.flash(MAP_FLASH_KEY.IDIOM_NAME, answer);
      req.flash(MAP_FLASH_KEY.QUES_CONTENT, ques);
    }

    res.redirect('/');
  })
  .post('/api/simp', async (req, res) => {
    const { content } = req.body;
    const result = convertToSimp(content);
    res.json({ cn: result });
  });

module.exports = router;
