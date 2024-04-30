/**
 * 接收选择器字符串，返回与选择器匹配的第一个DOM元素
 * @param {string} selectors css选择器
 * @returns
 */
function $(selectors) {
  return document.querySelector(selectors);
}

/**
 * 接收选择器字符串，返回与选择器匹配的全部DOM元素
 * @param {string} selectors css选择器
 * @returns
 */
function $$(selectors) {
  return document.querySelectorAll(selectors);
}
