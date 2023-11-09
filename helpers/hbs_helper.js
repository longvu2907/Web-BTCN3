module.exports = {
  ifEquals: function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  },
  times: function (n, block) {
    var accum = "";
    for (var i = 0; i < n; ++i) accum += block.fn(i + 1);
    return accum;
  },
};
