import React from "react";
import { Row, Col, Card } from "reactstrap";
import { PlusSquare, MinusSquare, Plus, XCircle } from "react-feather";
import PerfectScrollbar from 'react-perfect-scrollbar';
import Style from "../scss/MsgCont.scss";

class MsgCont extends React.PureComponent{
	constructor(props){
		super(props);

		this.requestFriend = this.requestFriend.bind(this);
		this.handleAcceptFR = this.handleAcceptFR.bind(this);
		this.handleRejectFR = this.handleRejectFR.bind(this);
		this.handleRemoveFriend = this.handleRemoveFriend.bind(this);
	}

	/*shouldComponentUpdate(nextProps, nextState){
		
			Added because parent component causes re-rendering, and msgArr prop
			does not pass shallow comparison everytime, since msgArr is created
			in the render function of parent.

			This might need to be rethought, not sure if length comparison for 
			msgArr array will completely work. Perhaps just keep msgArr as it's 
			original 2 seperate lists, and have MsgCont inherit it as 2 props
			as originally planned.
		

		if(this.props.histArr.length != nextProps.histArr.length){
			return true;
		}

		if(this.props.currArr.length != nextProps.currArr.length){
			return true;
		}

		if(this.props.currChat != nextProps.currChat){
			return true;
		}

		if(this.props.friendReq != nextProps.friendReq){
			return true;
		}

		return false;
	}
	*/

	requestFriend(){
		console.log(this.props.currChat);
		this.props.onFR();
	}

	handleAcceptFR(){
		this.props.acceptFR();
	}

	handleRejectFR(){
		this.props.rejectFR();
	}

	handleRemoveFriend(){
		this.props.onRemoveFriend(this.props.currChat)
	}

	componentDidUpdate(){
		let sCont = this._contRef._container;
		//console.log("msg cont updated");
		let sTop = sCont.scrollHeight - sCont.offsetHeight;

		if(sTop > 0){
			sCont.scrollTop = sTop;
		}
	}

	render(){
		let rendMsg;
		let chatHeader;
		
		/*let msgArr

		if(this.props.histArr){
			msgArr = [...this.props.histArr, ...this.props.currArr]
		}
		else{
			msgArr = this.props.currArr;
		}
		*/

		//console.log(msgArr);
		//console.log(this.props.currChat != null && !this.props.friendReq);

		if(this.props.currChat){
			if(this.props.isFriend){
				chatHeader = <div className={Style.chatHeader}>
						{this.props.currChat}
						<span className={Style.removeSpan} onClick={this.handleRemoveFriend}>
						<MinusSquare size={18} color="white"/>
						Remove Friend
						</span>
					</div>
			}
			else{
				let frBanner;
				if(this.props.friendReq){
					frBanner = <div className={Style.acceptFR}>
							<Plus size={16} color="white" style={{cursor: "pointer"}} onClick={this.handleAcceptFR} />
							<span className={Style.acceptTxt} onClick={this.handleAcceptFR}>Accept Friend Request</span>
							<XCircle size={16} color="white" style={{cursor: "pointer"}} onClick={this.handleRejectFR}/>
						</div>
				}

				chatHeader = <div className={Style.chatHeader}>
						{this.props.currChat}

						<div className={Style.btnContainer} onClick={this.requestFriend}>
							<PlusSquare size={18} color="white" />
							<span className={Style.headerTxt} onClick={this.requestFriend}>Add Friend</span>
						</div>
						{frBanner}
					</div>
			}
			
			rendMsg = this.props.histArr.map((msgObj, ind) => {
				if(msgObj.uid){
					return <Row className="justify-content-end mr-0"><div className={Style.rightBlock}>{msgObj.msg}</div></Row>
				}else{
					return <Row className="justify-content-start ml-0"><div className={Style.leftBlock}>{msgObj.msg}</div></Row>
				}
			});
		}
		else{
			rendMsg = <Row className="justify-content-center p-4"><span className={Style.pickMsg}>Pick someone to start a chat with</span></Row>
		}

		return(
			
			<div id="msgCont" className={Style.mainCont}>
			{chatHeader}
			<PerfectScrollbar ref={(contRef) => {this._contRef = contRef;}} option={{suppressScrollX: true}}>
				{rendMsg}
			</PerfectScrollbar>
			</div>
			
		);
	}
}

export default MsgCont;