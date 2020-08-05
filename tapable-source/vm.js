// AsyncParallelHook
(function anonymous(name) {
  "use strict";
  return new Promise((_resolve, _reject) => {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(
          Promise.resolve().then(() => {
            throw _err;
          })
        );
      else _reject(_err);
    }
    var _context;
    var _x = this._x;
    do {
      var _counter = 2;
      var _done = () => {
        _resolve();
      };
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasResult0 = false;
      var _promise0 = _fn0(name);
      _promise0.then(
        (_result0) => {
          _hasResult0 = true;
          if (--_counter === 0) _done();
        },
        (_err0) => {
          if (_hasResult0) throw _err0;
          if (_counter > 0) {
            _error(_err0);
            _counter = 0;
          }
        }
      );
      if (_counter <= 0) break;
      var _fn1 = _x[1];
      var _hasResult1 = false;
      var _promise1 = _fn1(name);
      _promise1.then(
        (_result1) => {
          _hasResult1 = true;
          if (--_counter === 0) _done();
        },
        (_err1) => {
          if (_hasResult1) throw _err1;
          if (_counter > 0) {
            _error(_err1);
            _counter = 0;
          }
        }
      );
    } while (false);
    _sync = false;
  });
});

// AsyncParallelBailHook
(function anonymous(name) {
  "use strict";
  return new Promise((_resolve, _reject) => {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(
          Promise.resolve().then(() => {
            throw _err;
          })
        );
      else _reject(_err);
    }
    var _context;
    var _x = this._x;
    var _results = new Array(2);
    var _checkDone = () => {
      for (var i = 0; i < _results.length; i++) {
        var item = _results[i];
        if (item === undefined) return false;
        if (item.result !== undefined) {
          _resolve(item.result);
          return true;
        }
        if (item.error) {
          _error(item.error);
          return true;
        }
      }
      return false;
    };
    do {
      var _counter = 2;
      var _done = () => {
        _resolve();
      };
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasResult0 = false;
      var _promise0 = _fn0(name);
      _promise0.then(
        (_result0) => {
          _hasResult0 = true;
          if (_counter > 0) {
            if (
              0 < _results.length &&
              (_result0 !== undefined && (_results.length = 1),
              (_results[0] = { result: _result0 }),
              _checkDone())
            ) {
              _counter = 0;
            } else {
              if (--_counter === 0) _done();
            }
          }
        },
        (_err0) => {
          if (_hasResult0) throw _err0;
          if (_counter > 0) {
            if (
              0 < _results.length &&
              ((_results.length = 1),
              (_results[0] = { error: _err0 }),
              _checkDone())
            ) {
              _counter = 0;
            } else {
              if (--_counter === 0) _done();
            }
          }
        }
      );

      if (_counter <= 0) break;
      if (1 >= _results.length) {
        if (--_counter === 0) _done();
      } else {
        var _fn1 = _x[1];
        var _hasResult1 = false;
        var _promise1 = _fn1(name);
        _promise1.then(
          (_result1) => {
            _hasResult1 = true;
            if (_counter > 0) {
              if (
                1 < _results.length &&
                (_result1 !== undefined && (_results.length = 2),
                (_results[1] = { result: _result1 }),
                _checkDone())
              ) {
                _counter = 0;
              } else {
                if (--_counter === 0) _done();
              }
            }
          },
          (_err1) => {
            if (_hasResult1) throw _err1;
            if (_counter > 0) {
              if (
                1 < _results.length &&
                ((_results.length = 2),
                (_results[1] = { error: _err1 }),
                _checkDone())
              ) {
                _counter = 0;
              } else {
                if (--_counter === 0) _done();
              }
            }
          }
        );
      }
    } while (false);
    _sync = false;
  });
});

// AsyncSeriesHook
(function anonymous(name, _callback) {
  "use strict";
  var _context;
  var _x = this._x;
  function _next0() {
    var _fn1 = _x[1];
    _fn1(name, (_err1) => {
      if (_err1) {
        _callback(_err1);
      } else {
        _callback();
      }
    });
  }
  var _fn0 = _x[0];
  _fn0(name, (_err0) => {
    if (_err0) {
      _callback(_err0);
    } else {
      _next0();
    }
  });
});

(function anonymous(name) {
  "use strict";
  return new Promise((_resolve, _reject) => {
    var _sync = true;
    function _error(_err) {
      if (_sync)
        _resolve(
          Promise.resolve().then(() => {
            throw _err;
          })
        );
      else _reject(_err);
    }
    var _context;
    var _x = this._x;
    function _next0() {
      var _fn1 = _x[1];
      var _hasResult1 = false;
      var _promise1 = _fn1(name);
      _promise1.then(
        (_result1) => {
          _hasResult1 = true;
          _resolve();
        },
        (_err1) => {
          if (_hasResult1) throw _err1;
          _error(_err1);
        }
      );
    }
    var _fn0 = _x[0];
    var _hasResult0 = false;
    var _promise0 = _fn0(name);
    _promise0.then(
      (_result0) => {
        _hasResult0 = true;
        _next0();
      },
      (_err0) => {
        if (_hasResult0) throw _err0;
        _error(_err0);
      }
    );
    _sync = false;
  });
});
