'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

require('./css/styles.css');

var _Main = require('./Main');

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import registerServiceWorker from './registerServiceWorker'

_reactDom2.default.render(_react2.default.createElement(_Main2.default, null), document.getElementById('root'));
//registerServiceWorker()