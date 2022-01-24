module.exports = function (find, replace, str) {
  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  return str.replace(new RegExp(find, "g"), replace);
};
