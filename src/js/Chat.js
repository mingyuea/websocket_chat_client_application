import React from 'react';
import io from 'socket.io-client';
import { Row, Col, Spinner, Card, CardBody, CardText, Form, FormGroup, Input, Button } from 'reactstrap';

import Online from "./Online.js";
import InputCont from "./InputCont.js";
import MsgCont from "./MsgCont.js";
import Style from "../scss/Chat.scss";


const example = [
	{id: true, msg: "hello"},
	{id: false, msg: "hello there"},
	{id: true, msg: "This is a test"},
	{id: false, msg: "This is a test"},
];


const socketServer = "http://localhost:5000";

class Chat extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			connected: false,
			userList: [],
			currentChat: "Ming",
			error: false,
			errMsg: "",
			chatHist: [...example],
			chatList: [...example]  //an array of msgObjects {id: [0 or 1], msg: String}
		}

		this.socket;

		this.handleExit = this.handleExit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSelectUser = this.handleSelectUser.bind(this);
		this.handleError = this.handleError.bind(this);
		//this.handleSaveChat = this.handleSaveChat.bind(this);
	}

	

	handleSelectUser(username){
		this.setState({
			currentChat: username
		});
	}

	/*handleSubmit(e){
		e.preventDefault();
		if(this.state.currentChat){
			this.props.socket.emit("message", this.state.input, this.state.currentChat);
		}
		else{
			this.setState({
				error: "Pick someone to chat with!"
			});
		}
	}*/

	handleSubmit(inStr){
		let copyArr = [...this.state.chatList];
		copyArr.push({id: true, msg: inStr});

		/*this.setState({
			chatList: copyArr
		})*/

		this.socket.emit('test', (res) => {
			console.log(res);
		})
	}

	handleError(errMsg){
		this.setState({
			error: true,
			errMsg: errMsg
		});
	}

	/*componentDidMount(){
		let socket = this.props.socket;
		console.log(this.props.socket);

		socket.emit("pollUsers", (usersObj) => {
			console.log("onlineCheck")
			console.log(usersObj);
			let userList = [];

			for (let user in usersObj){
				userList.push({"username": user, "id": usersObj[user]})
			}

			this.setState({
				userList: userList
			})
		});

		socket.on("newUser", (newUserObj) => {
			console.log("A NEW USER SIGNED ON!");
			let copyUser = [...this.state.userList];
			copyUser.push(newUserObj);

			this.setState({
				userList: copyUser
			})
		});

		socket.on("inMsg", (msg) =>{
			console.log(msg);
		});

		socket.on("updateUsers", (usersObj) => {
			console.log("user left")
			let userList = [];

			for (let user in usersObj){
				userList.push({"username": user, "id": usersObj[user]})
			}

			this.setState({
				userList: userList
			})
		})
	}*/


	/* CORRECT ONE
	componentDidMount(){
		this.socket = io.connect("http://localhost:5000", {transports: ['websocket']});
		
		if(!this.state.connected){
			this.setState({
				connected: true
			});
		}

		let socket = this.socket;

		socket.emit("pollUsers", (usersObj) => {
			console.log("onlineCheck")
			console.log(usersObj);
			let userList = [];

			for (let user in usersObj){
				userList.push({"username": user, "id": usersObj[user]})
			}

			this.setState({
				userList: userList
			})
		});

		socket.on("newUser", (newUserObj) => {
			console.log("A NEW USER SIGNED ON!");
			let copyUser = [...this.state.userList];
			copyUser.push(newUserObj);

			this.setState({
				userList: copyUser
			})
		});

		socket.on("inMsg", (msg) =>{
			console.log(msg);
		});

		socket.on("updateUsers", (usersObj) => {
			console.log("user left")
			let userList = [];

			for (let user in usersObj){
				userList.push({"username": user, "id": usersObj[user]})
			}

			this.setState({
				userList: userList
			})
		})
	}
	*/

	handleExit(e){
		//e.preventDefault();
		//e.returnValue = '';

			fetch("/exit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({"msgArr":this.state.chatList})
			})
			.then(res => {return ''});
	}

	componentDidMount(){
		console.log("MOUNTED");

		window.addEventListener("beforeunload", this.handleExit);

		this.socket = io.connect(socketServer, {transports: ['websocket']});
		//let socket = this.socket;

	}

	componentWillUnmount(){
		window.removeEventListener("beforeunload", this.handleExit);
	}

	componentDidUpdate(){
		console.log(this.state.connected);
	}


	render(){
		return(
			<React.Fragment>
				<div id="chatCont" className={Style.mainCont}>
					<Row className="h-100 mh-100">
						<Online users={this.state.userList} onSel={this.handleSelectUser} />
						<Col xs="7" md="8" lg="9" className={"mh-100 " + Style.chatCont}>
							<MsgCont currChat={this.state.currentChat} currArr={this.state.chatList} histArr={this.state.chatHist} />
							<InputCont currentChat={this.state.currentChat} socket={this.socket} onSubmit={this.handleSubmit} onError={this.handleError} />
						</Col>
					</Row>
				</div>
			</React.Fragment>
		);
	}
}

export default Chat;