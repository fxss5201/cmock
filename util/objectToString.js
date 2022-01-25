/**
 * 讲对象转换成字符串
 * @param {object} object 需要被转换的对象
 * @param {array} keys 保留的key
 * @returns {string}
 * 例如 objectToString({ name: 'fxss', age: 28, location: 'shanghai' }, ['name', 'age']) = namefxssage20
 */
module.exports = function (object, keys = []) {
  let res = "";
  Object.keys(object).forEach((item) => {
    if (keys.includes(item)) {
      res += `${item}${object[item]}`;
    }
  });
  return res;
};
