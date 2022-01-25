/**
 * 全部替换
 * @param {string} find 需要匹配替换的内容
 * @param {string} replace 替换后的内容
 * @param {string} str 需要处理的字符串
 * @returns {string} 处理后的字符串
 */
module.exports = function (find, replace, str) {
  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  return str.replace(new RegExp(find, "g"), replace);
};
