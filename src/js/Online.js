import React from "react";
import { Col, ListGroup, ListGroupItem } from "reactstrap";
import Style from "../scss/Online.scss";

class Online extends React.PureComponent{
	constructor(props){
		super(props);

		this.handleSel = this.handleSel.bind(this);
	}

	handleSel(e){
		let id = e.currentTarget.id;
		id = id.split(":")[1];
		console.log(id);
		this.props.onSel(id);
	}

	render(){
		console.log("online pdate");
		let renderList = <div className={Style.emptyDiv}>NO ONE ELSE IS HERE PRESENTLY</div>;

		if(this.props.users.length > 0){
			renderList = this.props.users.map((userObj, ind) => <ListGroupItem key={"user:"+userObj.id} id={"userInd:"+userObj.username} onClick={this.handleSel}>
				{userObj.username}
			</ListGroupItem>)
		}
		return(
			<Col xs="5" md="4" lg="3" className={"mh-100 " + Style.onlineCont}>
				<div className={Style.header}>
					ONLINE
				</div>
				<ListGroup>
					{renderList}
				</ListGroup>
			</Col>
		);
	}
}

export default Online;