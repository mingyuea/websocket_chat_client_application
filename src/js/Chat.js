import React from 'react';
import io from 'socket.io-client';
import { Row, Col, Spinner, Card, CardBody, CardText, Form, FormGroup, Input, Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css'; 

import ListCont from "./ListCont.js";
import InputCont from "./InputCont.js";
import MsgCont from "./MsgCont.js";
import Style from "../scss/Chat.scss";


const example = [
	{uid: true, msg: "hello"},
	{uid: false, msg: "hello there"},
	{uid: true, msg: "This is a test"},
	{uid: false, msg: "This is a test"},
];


const socketServer = "http://localhost:5000";

class Chat extends React.PureComponent{
	constructor(props){
		super(props);

		this.state = {
			myName: null,
			connected: false,
			defaultView: true,
			incomingMsgs: {},   //{username: [msgs]}
			notifs: {},   //{username: 'msg, fr, both'} (true to inicate msgs, false to indicate friendrequest, what happens if both)? or maybe an array [username]?
			userList: [],
			friendsList: [],
			incomingFRList: [],  //incoming friend requests [usenames]
			currentChat: null,  //username of person currently chatting with
			error: false,
			errMsg: null,
			chatHist: [...example],
			chatList: [...example],  //an array of msgObjects {uid: [0 or 1], msg: String}
			msgRollbackCounter: 0
		}

		this.socket;

		this.handleExit = this.handleExit.bind(this);
		this.handleListToggle = this.handleListToggle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSelectUser = this.handleSelectUser.bind(this);
		this.handleError = this.handleError.bind(this);
		this.requestFriend = this.requestFriend.bind(this);
		this.handleAcceptFR = this.handleAcceptFR.bind(this);
		this.handleRemoveFriend = this.handleRemoveFriend.bind(this);
		//this.testErr = this.testErr.bind(this);
		//this.handleSaveChat = this.handleSaveChat.bind(this);
	}

	
	handleSelectUser(username){
		if(this.state.currentChat != username){
			console.log("chat list is",this.state.chatList);
			let newNotifType, newStateObj;

			if(this.state.notifs[username] && this.state.notifs[username] != 'fr'){
					/*This means notifs definitely includes awaiting msgs*/
					let notifCopy = JSON.parse(JSON.stringify(this.state.notifs));
					let inMsgCopy = JSON.parse(JSON.stringify(this.state.incomingMsgs));
					console.log(notifCopy, inMsgCopy)

					if(notifCopy[username] == 'msg'){
						delete notifCopy[username];
						newNotifType = "delete";
					}
					else if(notifCopy[username] == 'both'){
						notifCopy[username] == 'fr';
						newNotifType = "fr";
					}

					newStateObj = {
						currentChat: username,
						notifs: notifCopy
					};

					let newChatList = inMsgCopy[username];

					if(newChatList){
						newChatList = newChatList.map(msgStr => {
							return {uid: false, msg: msgStr}
						});

						delete inMsgCopy[username];

						newStateObj["chatList"] = newChatList;
						newStateObj["incomingMsgs"] = inMsgCopy;
					}
					else{
						newStateObj["chatList"] = [];
					}
			}
			else{
					newStateObj = {
						currentChat: username,
						chatList: []
					};
			}


			this.socket.emit('switchUser', this.state.currentChat, this.state.chatList, username, newNotifType, (newChatHist) => {
				/*
				this should set this.state.chatList = incomingMsgs[username]
				*/
				newStateObj["chatHist"] = newChatHist;
				console.log('the new chat hist is', newChatHist);

				this.setState(newStateObj);				
			});
		}
	}

	handleListToggle(bool){
		this.setState({
			defaultView: bool
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
		if(this.state.currentChat){
			let copyArr = [...this.state.chatList];
			copyArr.push({uid: true, msg: inStr});

			/*this.setState({
				chatList: copyArr
			})*/

			this.socket.emit('message', inStr, this.state.currentChat, () => {
				this.setState({
					chatList: copyArr
				})
			});
		}
	}

	handleError(errMsg){
		/*
		this.setState({
			error: true,
			errMsg: errMsg
		}, () => {
			setTimeout(() => {
					this.setState({
						error: false,
					})
				}, 6000)
		});
		*/
		toast(<div>Error: {errMsg}</div>, {type: "error"})
	}

	/*testErr(e){
		e.preventDefault();
		console.log("Error testing");
		this.handleError("Testing");
	}*/

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


	/* VERSION 2
	componentDidMount(){
		if(!this.state.connected){
			this.setState({
				connected: true
			});
		}

		//fetch list of online users, freinds, and newMsgs when first sign on
		NOT NEEDED, REPLACED BY userInit RESPONSE HANDLER
		socket.emit("pollUsers", (usersArr) => {
			usersArr.split(usersArr.indexOf(this.state.myName, 1));
			
			//for (let user in usersObj){
			//	userList.push({"username": user, "id": usersObj[user]})
			//}

			console.log("pollusers", usersArr);

			this.setState({
				userList: usersArr
			})
		});
		


		when the user first signs on, a check will be done for any user notif
		NOT NEEDED, REPLACED BY userInit RESPONSE HANDLER
		socket.on("init", (notifList, frList) =>{
			//this should sort out fr list, and set all fr+new msgs to notifs
			this.setState({
				incomingFRList: frList,
				notif: notifList
			});
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
		e.preventDefault();
		e.returnValue = '';

		let reqBody = {
			"msgArr":this.state.chatList,
			"lastPartner": this.state.currentChat,
			"unreadMsgs": this.state.incomingMsgs,
			"notifs": this.state.notifs,
			"frList": this.state.incomingFRList
		}

		fetch("/exit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(reqBody)
		})
		.then(res => {return ''});
	}

	requestFriend(){
		let frUser = this.state.currentChat;
		console.log("requesting friend", frUser);
		this.socket.emit('sendFR', frUser);
	}

	handleAcceptFR(){
		let partnerName = this.state.currentChat;
		let notifCheck = this.state.notifs[partnerName];
		let currNotif;

		if(notifCheck == "both" || notifCheck == "fr"){
			currNotif = notifCheck;
		}

		let copyFL = [...this.state.friendsList];
		let copyInFR = [...this.state.incomingFRList];
		copyInFR.splice(copyInFR.indexOf(partnerName), 1);
		copyFL.push(partnerName);

		let stateObj = {
			friendsList: copyFL,
			incomingFRList: copyInFR
		}

		if(currNotif){
			let copyNotifs = JSON.parse(JSON.stringify(this.state.notifs));
				
			if(currNotif == "both"){
					copyNotifs[partnerName] = "msg"
			}
			else if(currNotif == "fr"){
					delete copyNotifs[partnerName];
			}
			stateObj["notifs"] = copyNotifs;
		}

		this.socket.emit('acceptFR', partnerName, currNotif, () => {
			this.setState(stateObj);
		})
	}

	handleRemoveFriend(username){
		console.log(username);

		this.socket.emit('removeFriend', username, (actionSuccess, err) => {
			if(actionSuccess){
				let copyFriends = [...this.state.friendsList];
				let frInd = copyFriends.indexOf(username);
				copyFriends.splice(frInd, 1);

				this.setState({
					friendsList: copyFriends
				})
			}
			else{
				this.handleError(err);
			}
		})
	}

	componentDidMount(){
		console.log("MOUNTED");

		(() => {
			let myCookies = document.cookie.split(";");
			let cookieVal = myCookies.map(cookieStr => cookieStr.split("=")[1].trim());
	    	
	    	myCookies = myCookies.map(cookieStr => cookieStr.split("=")[0].trim())
	    	cookieVal = cookieVal[myCookies.indexOf("uname")];

	    	this.setState({
	    		myName: cookieVal
	    	})
    	})();


		/*
		-----------UNCOMMENT FOR PRODUCTION----------------

		window.addEventListener("beforeunload", this.handleExit);
		*/

		this.socket = io.connect(socketServer, {transports: ['websocket']});
		let socket = this.socket;

		socket.on('connect', () => {
			console.log("CONNECTED");
			socket.emit('userInit', ( onlineList, notifObj, inFRList, friendsList) => {
				console.log('got notifications and freinds', onlineList, notifObj, inFRList, friendsList);

				onlineList.splice(onlineList.indexOf(this.state.myName, 1));

				this.setState({
					userList: onlineList,
					friendsList: friendsList,
					incomingFRList: inFRList,
					notifs: notifObj
				});
			});
		});


		socket.on('inMsg', (senderName, input) => {
			console.log('incoming msgs', senderName, input)
			if(senderName == this.state.currentChat){
				//if you received a message from someone you're currently chatting with
				let copyList = [...this.state.chatList];
				copyList.push({uid: false, msg: input});

				this.setState({
					chatList: copyList
				});
			}
			else{
				//else, add it to your incomingMsgs and notif list
				let copyInMsgs = JSON.parse(JSON.stringify(this.state.incomingMsgs));

				if(this.state.notifs[senderName] == undefined){
					let copyNotifs = JSON.parse(JSON.stringify(this.state.notifs));
					copyNotifs[senderName] = "msg";

					if(copyInMsgs[senderName]){
						copyInMsgs[senderName].push(input);
					}
					else{
						copyInMsgs[senderName] = [input];
					}

					this.setState({
						incomingMsgs: copyInMsgs,
						notifs: copyNotifs
					});
				}
				else if(this.state.notifs[senderName] == "fr"){
					let copyNotifs = JSON.parse(JSON.stringify(this.state.notifs));
					copyNotifs[senderName] = "both";

					if(copyInMsgs[senderName]){
						copyInMsgs[senderName].push(input);
					}
					else{
						copyInMsgs[senderName] = [input];
					}

					this.setState({
						incomingMsgs: copyInMsgs,
						notifs: copyNotifs
					});
				}
				else{
					if(copyInMsgs[senderName]){
						copyInMsgs[senderName].push(input);
					}
					else{
						copyInMsgs[senderName] = [input];
					}

					this.setState({
						incomingMsgs: copyInMsgs
					});
				}
			}
		});


		socket.on('inFR', (requestUser) => {
			if(!this.state.incomingFRList.includes(requestUser)){
				let copyList = [...this.state.incomingFRList];
				copyList.push(requestUser);

				let stateObj = {
					incomingFRList: copyList
				}

				if(this.state.notifs[requestUser]){
					//if a entry in the notifObj already exists for this user
					if(this.state.notifs[requestUser] == "msg"){
						//if the value is "msg", set it to "both"
						let copyObj = JSON.parse(JSON.stringify(this.state.notifs));
						copyObj[requestUser] = "both";
						stateObj["notifs"] = copyObj;
					}
				}
				else{
					let copyObj = JSON.parse(JSON.stringify(this.state.notifs));
					copyObj[requestUser] = "fr";
					stateObj["notifs"] = copyObj;
				}

				this.setState(stateObj);
				socket.emit('updateNotifs', stateObj.notifs[requestUser], requestUser);
			}
		})


		/*handles err*/
		socket.on('newError', (errMsg) => {
			console.log('err recieved', errMsg);
			this.handleError(errMsg)
		});


		/*this should update chatlist*/
		socket.on("updateChatlist", (senderName) => {
			if(this.state.currentChat != senderName){
				console.log("updating chatlist for curr user")
				let newChatHist = [...this.state.chatHist, ...this.state.chatList];

				this.setState({
					chatHist: newChatHist,
					chatList: [],
				});
			}
			else{
				console.log("not current chat partner, no chatlist update");
			}
		})


		/*when a new user signs on, adds username to userlist*/
		socket.on("newUser", (newUsername) => {
			console.log("A NEW USER SIGNED ON!");
			let copyUser = [...this.state.userList];
			copyUser.push(newUsername);

			this.setState({
				userList: copyUser
			})
		});


		/*When another user leaves*/
		socket.on("userLeft", (username) => {
			let copyUser = [...this.state.userList];
			copyUser.splice(copyUser.indexOf(username), 1);

			this.setState({
				userList: copyUser
			});


			/*This should delete all the users incomingMsgs, since it'll be saved to db */
		});


		/**/
	}

	componentWillUnmount(){
		//window.removeEventListener("beforeunload", this.handleExit);
		this.socket.emit('disconnect');
	}

	componentDidUpdate(){
		console.log(this.state.notifs);
	}

	render(){
		let errRend;
		//let msgArr = [...this.state.chatHist, ...this.state.chatList];

		/*
		if(this.state.error){
			errRend = <div className={Style.errCont}> {this.state.errMsg} </div>
		}
		*/

		return(
			<React.Fragment>
				<div id="chatCont" className={Style.mainCont}>
					<Row className="h-100 mh-100">
						<ListCont 
							defaultView={this.state.defaultView} 
							onlineList={this.state.userList} 
							onToggle={this.handleListToggle} 
							friendsList={this.state.friendsList} 
							onSel={this.handleSelectUser} 
							inMsg={this.state.incomingMsgs}
							inFR={this.state.incomingFRList}
						/>
						<Col xs="7" md="8" lg="9" className={"mh-100 " + Style.chatCont}>
							<MsgCont 
								currChat={this.state.currentChat} 
								histArr={this.state.chatHist} currArr={this.state.chatList} 
								friendReq={this.state.incomingFRList.includes(this.state.currentChat)} 
								onFR={this.requestFriend} acceptFR={this.handleAcceptFR} 
								isFriend={this.state.friendsList.includes(this.state.currentChat)} 
								onRemoveFriend={this.handleRemoveFriend}
							/>
							<InputCont 
								currentChat={this.state.currentChat} 
								socket={this.socket} 
								onSubmit={this.handleSubmit} 
								onError={this.handleError} 
							/>
						</Col>
					</Row>
				</div>
				<ToastContainer />
			</React.Fragment>
		);
	}
}

export default Chat;