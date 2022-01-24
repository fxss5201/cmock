module.exports = function (object, keys = []) {
  let res = "";
  Object.keys(object).forEach((item) => {
    if (keys.includes(item)) {
      res += `${item}${object[item]}`;
    }
  });
  return res;
};
