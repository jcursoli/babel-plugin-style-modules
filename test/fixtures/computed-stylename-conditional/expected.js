'use strict';

var _test = require('./test.css');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var color = true ? 'green' : 'red';

React.createElement(
  'div',
  { className: _test2.default[color] },
  'Hello'
);