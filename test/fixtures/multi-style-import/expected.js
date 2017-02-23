'use strict';

var _test = require('./test1.css');

var _test2 = _interopRequireDefault(_test);

var _test3 = require('./test2.css');

var _test4 = _interopRequireDefault(_test3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

React.createElement(
  'div',
  { className: _test2.default.large + ' ' + _test4.default.red },
  'Hello'
);
