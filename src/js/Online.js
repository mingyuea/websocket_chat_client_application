import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import Style from "../scss/Online.scss";

class Online extends React.PureComponent{
	constructor(props){
		super(props);

		this.handleSel = this.handleSel.bind(this);
	}

	handleSel(e){
		let ind = e.currentTarget.id;
		ind = ind.split(":")[1];
		let username = this.props.users[ind];
		console.log(ind, username);
		this.props.onSel(username);
	}
	//<span className={Style.notifSpan}>{this.props.inMsg[username] ? this.props.inMsg[username].length : this.props.inFR.includes(username) ? "!" : ""}</span>

	render(){
		console.log(this.props.inMsg, this.props.inFR, this.props.onlineList);
		let renderList = <div className={Style.emptyDiv}>NO ONE ELSE IS HERE PRESENTLY</div>;

		if(this.props.users.length > 0){
			if(this.props.defaultView){

				renderList = this.props.users.map((username, ind) => <ListGroupItem key={"user:"+ind} id={"userInd:"+ind} style={{cursor: "pointer"}} onClick={this.handleSel}>
					{username}
					{this.props.inMsg[username] ? <span className={Style.notifSpan}>{this.props.inMsg[username].length}</span> : this.props.inFR.includes(username) ? <span className={Style.notifSpan}>!</span> : null}
				</ListGroupItem>)
			}
			else{
				renderList = this.props.users.map((username, ind) => <ListGroupItem key={"user:"+ind} id={"userInd:"+ind} onClick={this.handleSel}>
					<span className={this.props.onlineList.includes(username) ? Style.onlineDot : Style.offlineDot}></span>
					{username}
					{this.props.inMsg[username] ? <span className={Style.notifSpan}>{this.props.inMsg[username].length}</span> : this.props.inFR.includes(username) ? <span className={Style.notifSpan}>!</span> : null}
				</ListGroupItem>)
			}
		}
		return(
				<ListGroup>
					{renderList}
				</ListGroup>
		);
	}
}

export default Online;