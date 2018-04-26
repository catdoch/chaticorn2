'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _sweetalert = require('sweetalert');

var _sweetalert2 = _interopRequireDefault(_sweetalert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Main = function (_Component) {
    _inherits(Main, _Component);

    function Main(props) {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

        _this.state = {
            endpoint: 'http://localhost:3000',
            message: '',
            messages: [],
            usernames: []
        };

        _this.socket = (0, _socket2.default)(_this.state.endpoint);

        _this.socket.on('updatechat', function (data) {
            addMessage(data);
        });

        _this.socket.on('updateusers', function (data) {
            _this.setState({ usernames: data });
        });

        var addMessage = function addMessage(data) {
            var chat = { message: data.message, user: data.username, colour: data.colour };
            _this.setState({ messages: [].concat(_toConsumableArray(_this.state.messages), [chat]) });
        };

        _this.showPrompt = _this.showPrompt.bind(_this);
        _this.onChange = _this.onChange.bind(_this);
        _this.sendChat = _this.sendChat.bind(_this);
        return _this;
    }

    _createClass(Main, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.socket.on('connect', function () {
                _this2.showPrompt();
                var confirm = document.querySelector('.swal-button--confirm');
                confirm.onclick = function (event) {
                    event.preventDefault();
                    var value = document.querySelector('.swal-content__input').value;
                    if (value === "") {
                        value = 'Anonymous';
                    }
                    _this2.socket.emit('adduser', value, _this2.randomColour());
                };
            });
        }
    }, {
        key: 'onChange',
        value: function onChange(event) {
            var message = event.currentTarget.value;
            this.setState({ message: message });
        }
    }, {
        key: 'sendChat',
        value: function sendChat(ev) {
            ev.preventDefault();
            var message = this.state.message;

            if (message.length) {
                this.socket.emit('sendchat', message);
            }
            this.setState({ message: '' });
        }
    }, {
        key: 'randomColour',
        value: function randomColour() {
            var letters = '0123456789ABCDEF'.split('');
            var colour = '#';
            for (var i = 0; i < 6; i++) {
                colour += letters[Math.floor(Math.random() * 16)];
            }
            return colour;
        }
    }, {
        key: 'showPrompt',
        value: function showPrompt() {
            (0, _sweetalert2.default)({
                title: "Username please",
                text: "What's your name?",
                content: "input",
                attributes: {
                    placeholder: "What's your name?",
                    type: "text"
                },
                closeModal: true
            });
        }

        // render method that renders in code if the state is updated

    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'content-sidebar' },
                    _react2.default.createElement(
                        'div',
                        { id: 'chatroom' },
                        _react2.default.createElement(
                            'ul',
                            { id: 'conversation' },
                            this.state.messages.map(function (message) {
                                var colour = { background: message.colour };
                                return _react2.default.createElement(
                                    'li',
                                    { style: colour },
                                    message.user,
                                    ': ',
                                    message.message
                                );
                            })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'sidebar' },
                        _react2.default.createElement(
                            'div',
                            { id: 'userList' },
                            _react2.default.createElement(
                                'h4',
                                null,
                                'Users Online'
                            ),
                            _react2.default.createElement(
                                'div',
                                { id: 'users' },
                                this.state.usernames.map(function (users) {
                                    return _react2.default.createElement(
                                        'div',
                                        null,
                                        users.name
                                    );
                                })
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'button_input_group' },
                    _react2.default.createElement('input', {
                        type: 'text',
                        name: 'chat_box',
                        onChange: function onChange(e) {
                            return _this3.setState({ message: e.target.value });
                        },
                        value: this.state.message,
                        id: 'data',
                        placeholder: 'type to chat...'
                    }),
                    _react2.default.createElement(
                        'button',
                        { id: 'datasend', onClick: this.sendChat },
                        'Send'
                    )
                )
            );
        }
    }]);

    return Main;
}(_react.Component);

exports.default = Main;