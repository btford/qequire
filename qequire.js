// like reQUIRE but wraps fns with cbs so they return promises.
// probably might break things so be careful ok? <3

var Q = require('q');


// some consts
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

var CALLBACK_NAMES = [
  'cb',
  'callback',
  'callback_',
  'fn'
];

// fn.toString is super cool
var hasCallback = function hasCallback (fn) {

  if (typeof fn !== 'function') {
    return false;
  }

  var args = [];

  var fnText = fn.toString().replace(STRIP_COMMENTS, '');
  var argDecl = fnText.match(FN_ARGS);
  argDecl[1].split(FN_ARG_SPLIT).forEach(function (arg) {
    arg.replace(FN_ARG, function (all, underscore, name) {
      args.push(name);
    });
  });

  return CALLBACK_NAMES.indexOf(args[args.length -1]) !== -1;
};


var quire = function quire (api) {

  if (typeof api === 'function') {
    if (hasCallback(api)) {
      return function () {
        return Q.nfapply(api, arguments);
      };
    } else {
      return api;
    }
  }

  if (api instanceof Array) {
    return api.map(quire);
  } else if (api !== null && typeof api === 'object') {
    return Object.keys(api).
      filter(function (key) {
        return key[0] !== '_'; // ignore "private" properties
      }).
      reduce(function (newObj, prop) {
        if (typeof api[prop] === 'function') {
          if (hasCallback(api[prop])) {
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
      }, {});
  } else { // not a fn, obj, or array
    return api;
  }
};


module.exports = function qequire (pack) {
  return quire(require(pack));
};

