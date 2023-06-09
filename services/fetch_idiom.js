const axios = require('axios');
const cheerio = require('cheerio');

/** 國家教育研究院教育部成語典網站 */
const BASE_URL = 'https://dict.idioms.moe.edu.tw/';

/**
 * 檢查成語是否存在
 * @param {string} text
 * @returns {Promise<{status: boolean, href?: string, description?:string}>}
 */
const checkIdiom = async (text) => {
  /** 成語典網站 */
  const url = BASE_URL + 'idiomList.jsp';
  const { data: body } = await axios.get(url, {
    params: {
      idiom: text,
      qMd: 0,
      qTp: 1,
    },
  });
  // --- 爬蟲
  const $ = cheerio.load(body);
  const $list = $('#mainContent table.searchL tbody tr');
  const length = $list.length;
  if (1 !== length) {
    return {
      status: false,
    };
  }
  const href = $list.find('td[headers="thVal"] a').attr('href');
  const idiom = await getIdiom(href);
  const description = Array.from(
    { length: idiom.length },
    (_, i) => idiom[i]
  ).join('');
  return {
    status: true,
    href: BASE_URL + href,
    description,
  };
};

/**
 * 取得成語資料
 * @param {string} href
 */
const getIdiom = async (href) => {
  const url = BASE_URL + href;
  const { data: body } = await axios.get(url);
  // --- 爬蟲
  const $ = cheerio.load(body);
  const description = $('#row_useExample td[headers="th_useExample"] h4')
    .filter((_, item) => item.firstChild?.data == '語義說明')
    .map((_, item) => item.nextSibling)
    .map((_, item) => item.data);
  return description;
};

module.exports = { checkIdiom };
