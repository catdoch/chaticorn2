import React, { Component } from 'react'
import io from 'socket.io-client'
import swal from 'sweetalert';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            endpoint: 'http://localhost:4000',
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


// import React, {Component} from 'react';
// import swal from 'sweetalert';
// import io from 'socket.io-client';

// export class Main extends Component {
//     componentDidMount() {
//         const socket = io.connect();
//         const prompt = swal({
//             title: "Username please",
//             text: "What's your name?",
//             content: "input",
//             attributes: {
//                 placeholder: "What's your name?",
//                 type: "text",
//             },
//             showCancelButton: false,
//             closeOnConfirm: true,
//             animation: "slide-from-top"
//         });

//         socket.on('connect', function() {
//             prompt;
//             // call the server-side function 'adduser' 
//             const confirm = document.querySelector('.swal-button--confirm');
//             confirm.onclick = () => {
//                 let value = document.querySelector('.swal-content__input').value;
//                 if (value === "") {
//                     value = 'Anonymous';
//                 }
//                 socket.emit('adduser', value);
//             }
//         });
//     }
//     render() {
//         return (
//             <div>
//                 <div className="content-sidebar">
//                     <div id="chatroom">
//                         <ul id="conversation"></ul>
//                     </div>
//                     <div className="sidebar">
//                         <div id="userList">
//                             <h4>Users Online</h4>
//                             <div id="users"></div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="button_input_group">
//                     <input type="text" name="chat_box" value="" id="data" placeholder="type to chat..." />
//                     <button id="datasend">Send</button>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Main;
    
// import sweetalert from 'sweetalert';
// import React from 

// var socket = io.connect();
// socket.on('connect', () => {
//     socket.emit('hello', {my: 'world'});
// });

// const prompt = swal({
//     title: "Username please",
//     text: "What's your name?",
//     type: "input",
//     showCancelButton: false,
//     closeOnConfirm: true,
//     animation: "slide-from-top",
//     inputPlaceholder: "What's your name?"
// });

// prompt();


// /**
//  * Set requires for this file
//  */
// var sweetAlert = require('sweetalert');
// var $ = require('jquery');
// var moment = require('moment');


// $(document).ready(function() {

//     var socket = io.connect();

//     var prompt = swal({
//         title: "Username please",
//         text: "What's your name?",
//         type: "input",
//         showCancelButton: false,
//         closeOnConfirm: true,
//         animation: "slide-from-top",
//         inputPlaceholder: "What's your name?"
//     });


//     /**
//      * Get random colour
//      * to assign to user
//      * @return colour
//      */
//     function getRandomColour() {
//         var letters = '0123456789ABCDEF'.split('');
//         var colour = '#';
//         for (var i = 0; i < 6; i++) {
//             colour += letters[Math.floor(Math.random() * 16)];
//         }
//         return colour;
//     }


//     /**
//      * Set config for emojis
//      * including img dir
//      */
//     emojify.setConfig({
//         only_crawl_id: null, // Use to restrict where emojify.js applies
//         img_dir: 'https://github.global.ssl.fastly.net/images/icons/emoji/',
//         ignored_tags: { // Ignore the following tags
//             'SCRIPT': 1,
//             'TEXTAREA': 1,
//             'A': 1,
//             'PRE': 1,
//             'CODE': 1
//         }
//     });


//     /**
//      * On socket connect launch
//      * alert box for username
//      * Emit add user to chat and assign
//      * colour
//      */
    // socket.on('connect', function() {
    //     prompt;
    //     // call the server-side function 'adduser' 
    //     $('.confirm').click(function() {
    //         var value = $('.sweet-alert input').val();
    //         if (value === "") {
    //             value = 'Anonymous';
    //         }
    //         socket.emit('adduser', value, getRandomColour());
    //     });
    // });


//     /**
//      * @param  {username}
//      * @param  {data} - text value
//      * @param  {colour} - user colour
//      * @return append of html
//      */
//     socket.on('updatechat', function(username, data, colour) {
//         var date = new Date();
//         var prettyDate = moment(date).format('kk:mm');

//         $('#conversation').append('<li style="background-color:' + colour + '"><p><b>' + username + ':</b><p> ' + data + '</p><p class="date">'+ prettyDate +'</p></li>');
//         $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
//         emojify.run();
//     });


//     /**
//      * Update users and add to html
//      * @param  {data}
//      * @return append user to html
//      */
//     socket.on('updateusers', function(data) {
//         $('#users').empty();
//         $.each(data, function(key, value) {
//             $('#users').append('<div>' + key + '</div>');
//         });
//     });


//     /**
//      * On socket disconnect log
//      * message to chat
//      * @param  {data}
//      * @return log message
//      */
//     socket.on('exit', function(data) {
//         log_chat_message(data.message);
//     });


//     /**
//      * If user div is empty
//      * hide from list
//      */
//     var nullDiv = $('#users div');

//     $.each(nullDiv, function(index, value) {
//         if (value.innerText === 'null') {
//             $(this).hide();
//         }
//     });


//     /**
//      * On button click send data
//      * and emit message
//      */
//     $('#datasend').click(function() {
//         var message = $('#data').val();
//         if (message.length) {
//             $('#data').val('');
//             // tell server to execute 'sendchat' and
//             // send along one parameter
//             socket.emit('sendchat', message);
//         }
//     });


//     /**
//      * On enter send data
//      * and emit message and 
//      * refocus
//      */
//     $('#data').keypress(function(e) {
//         if (e.which == 13) {
//             $(this).blur();
//             $('#datasend').focus().click();
//             $('#data').focus();
//         }
//     });
// });