import React from "react";
import { Row, Col, Card } from "reactstrap";
import PerfectScrollbar from 'react-perfect-scrollbar';
import Style from "../scss/MsgCont.scss";

class MsgCont extends React.PureComponent{
	constructor(props){
		super(props);
	}

	componentDidUpdate(){
		let sCont = this._contRef._container;
		//console.log(sCont);
		let sTop = sCont.scrollHeight - sCont.offsetHeight;

		if(sTop > 0){
			sCont.scrollTop = sTop;
		}
	}

	render(){
		let rendMsg;
		let chatHeader;
		let msgArr;

		if(this.props.histArr){
			msgArr = [...this.props.histArr, ...this.props.currArr]
		}
		else{
			msgArr = this.props.currArr;
		}

		console.log(msgArr);

		rendMsg = msgArr.map((msgObj, ind) => {
			if(msgObj.uid){
				return <Row className="justify-content-end mr-0"><div className={Style.rightBlock}>{msgObj.msg}</div></Row>
			}else{
				return <Row className="justify-content-start ml-0"><div className={Style.leftBlock}>{msgObj.msg}</div></Row>
			}
		});

		if(this.props.currChat){
			chatHeader = <div className={Style.chatHeader}>{this.props.currChat}</div>
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