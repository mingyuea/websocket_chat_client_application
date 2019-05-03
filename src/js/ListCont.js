import React from 'react';
import { Col, Nav, NavItem, NavLink } from 'reactstrap';

import Style from "../scss/ListCont.scss";
import Online from "./Online.js";

class ListCont extends React.PureComponent{
	constructor(props){
		super(props);

		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle(e){
		e.preventDefault();
		let id = e.currentTarget.id;
		console.log(id);

		if(id == "online"){
			this.props.onToggle(true);
		}
		else{
			this.props.onToggle(false);
		}
	}

	render(){
		let dataList;
		if(this.props.defaultView){  //if currently viewing online list
			dataList = this.props.onlineList
		}
		else{  //if currently viewing friendslist
			dataList = this.props.friendsList
		}

		return(
			<Col xs="5" md="4" lg="3" className={"mh-100 " + Style.onlineCont}>
				<Nav tabs>
					<NavItem id="online" onClick={this.handleToggle} className={Style.navTabs}>
						<NavLink  active={this.props.defaultView}>ONLINE</NavLink>
					</NavItem>
					<NavItem id="friendslist" onClick={this.handleToggle} className={Style.navTabs}>
						<NavLink active={!(this.props.defaultView)}>FRIENDS</NavLink>
					</NavItem>
				</Nav>
				<Online 
					defaultView={this.props.defaultView} 
					users={dataList} 
					onSel={this.props.onSel}
					inMsg={this.props.inMsg}
					inFR={this.props.inFR}
					onlineList={this.props.onlineList}
				/>
			</Col>
		);
	}
}

export default ListCont;