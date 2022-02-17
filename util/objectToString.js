const replaceAll = require("./replaceAll.js");
/**
 * 将对象转换成字符串
 * @param {object} object 需要被转换的对象
 * @param {array} keys 保留的key
 * @returns {string}
 * 例如 objectToString({ name: 'fxss', age: 28, location: 'shanghai' }, ['name', 'age']) = name_fxss___age_28
 */
module.exports = function (object, keys = []) {
  let res = [];
  Object.keys(object).forEach((item) => {
    if (keys.includes(item)) {
      let value = object[item];
      if (Object.prototype.toString.call(value).slice(8, -1) === "String") {
        value = replaceAll(".", "-", value);
        value = replaceAll("/", "-", value);
      }
      res.push(`${item}_${value}`);
    }
  });
  return res.join("___");
};
