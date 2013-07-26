# qequire
[![Build Status](https://travis-ci.org/btford/qequire.png?branch=master)](https://travis-ci.org/btford/qequire)

Promisify modules as you require them.

```
var qequire = require('qequire');
var fs = qequire('fs');

// methods on fs return promises
// how crazy is that?
fs.readFile('foo.txt').finally(console.log);
```

Warning: probably breaks stuff.

## Why
Promises are useful when you have a chain of async tasks and want predictable error handling.

## See Also
Q provides some [nice helpers](https://github.com/kriskowal/q#adapting-node).
If you only want to wrap some APIs, you might want to check them out.

## License
MIT
