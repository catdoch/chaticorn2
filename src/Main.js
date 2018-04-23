import React, { Component } from 'react'
import io from 'socket.io-client'
import swal from 'sweetalert';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            endpoint: 'http://localhost:3000',
            message: '',
            messages: [],
            usernames: []
        }

        this.socket = io(this.state.endpoint);

        this.socket.on('updatechat', (data) => {
            addMessage(data);
        });

        this.socket.on('updateusers', (data) => {
            this.setState({ usernames: data });
        });

        const addMessage = data => {
            const chat = { message: data.message, user: data.username, colour: data.colour };
            this.setState({ messages: [...this.state.messages, chat] });
        };

        this.showPrompt = this.showPrompt.bind(this);
        this.onChange = this.onChange.bind(this);
        this.sendChat = this.sendChat.bind(this);
    }

    componentDidMount() {
        this.socket.on('connect', () => {
            this.showPrompt();
            const confirm = document.querySelector('.swal-button--confirm');
            confirm.onclick = (event) => {
                event.preventDefault();
                let value = document.querySelector('.swal-content__input').value;
                if (value === "") {
                    value = 'Anonymous';
                }
                this.socket.emit('adduser', value, this.randomColour());
            }
        });
    }

    onChange(event) {
        const message = event.currentTarget.value;
        this.setState({ message });
    }

    sendChat(ev) {
        ev.preventDefault();
        const { message } = this.state;
        if (message.length) {
            this.socket.emit('sendchat', message);
        }
        this.setState({ message: '' });
    }

    randomColour() {
        const letters = '0123456789ABCDEF'.split('');
        let colour = '#';
        for (let i = 0; i < 6; i++) {
            colour += letters[Math.floor(Math.random() * 16)];
        }
        return colour;
    }

    showPrompt() {
        swal({
            title: "Username please",
            text: "What's your name?",
            content: "input",
            attributes: {
                placeholder: "What's your name?",
                type: "text",
            },
            closeModal: true
        });
    }

    // render method that renders in code if the state is updated
    render() {
        return (
            <div>
                <div className="content-sidebar">
                    <div id="chatroom">
                        <ul id="conversation">
                            {this.state.messages.map(message => {
                                let colour = { background: message.colour };
                                return <li style={colour}>{message.user}: {message.message}</li>
                            })}
                        </ul>
                    </div>
                    <div className="sidebar">
                        <div id="userList">
                            <h4>Users Online</h4>
                            <div id="users">
                                {this.state.usernames.map(users => {
                                    return <div>{users.name}</div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button_input_group">
                    <input
                        type="text"
                        name="chat_box"
                        onChange={e => this.setState({ message: e.target.value })}
                        value={this.state.message}
                        id="data"
                        placeholder="type to chat..." 
                    />
                    <button id="datasend" onClick={this.sendChat}>Send</button>
                </div>
            </div>
        )
    }
}

export default Main;