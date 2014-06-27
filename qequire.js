// like reQUIRE but wraps fns with cbs so they return promises.
// probably might break things so be careful ok? <3

var Q = require('q');
var takesCallback = require('takes-callback');

var quire = function (api) {
  var originals = [],
    augmentedFns = [];

  return (function quire (api) {
    var augmented;
    if (originals.indexOf(api) !== -1) {
      return augmentedFns[originals.indexOf(api)];
    } else if (typeof api === 'function') {
      if (takesCallback(api)) {
        augmented = function () {
          return Q.nfapply(api, arguments);
        };
      } else {
        return api;
      }
    } else if (api instanceof Array) {
      augmented = api.map(quire);
    } else if (api !== null && typeof api === 'object') {
      augmented = {};
    } else { // not a fn, obj, or array
      return api;
    }
    originals.push(api);
    augmentedFns.push(augmented);

    if (api !== null && typeof api === 'object') {
      // we want the full proto chain
      var keys = [], key;
      for (key in api) {
        keys.push(key);
      }

      keys.
        filter(function (key) {
          return key[0] !== '_'; // ignore "private" properties
        }).
        reduce(function (newObj, prop) {
          if (typeof api[prop] === 'function') {
            if (takesCallback(api[prop])) {
              newObj[prop] = function () {
                return Q.npost(api, prop, arguments); // try to preserve "this"
              };
            } else {
              newObj[prop] = api[prop].bind(api); // try to preserve "this"
            }
          } else {
            newObj[prop] = quire(api[prop]);
          }
          return newObj;
        }, augmented);
    }

    return augmented;
  }(api));
};


module.exports = function qequire (pack) {
  return quire(require(pack));
};

module.exports.quire = quire;
