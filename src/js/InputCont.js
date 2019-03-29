import React from "react";
import { Col, InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import { Send } from "react-feather";


class InputCont extends React.PureComponent{
	constructor(props){
		super(props);

		this.state = {
			input: ""
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e){
		let id = e.currentTarget.id;
		let val = e.currentTarget.value;
		let stateObj = {};
		stateObj[id] = val;

		this.setState(stateObj);
	}

	handleSubmit(e){
		e.preventDefault();

		let inStr = String(this.state.input);			
			if(inStr.length > 0){
				this.props.onSubmit(inStr);

				this.setState({
					input: ""
				});
			}

		/*
		if(this.props.currentChat){
			//this.props.socket.emit("message", this.state.input, this.state.currentChat, () => {});
			let inStr = String(this.state.input);			
			if(inStr.length > 0){
				this.onSubmit(inStr);

				this.setState({
					input: ""
				});
			}
		}
		else{
			console.log("no one to chat with")
			this.props.onError("Pick someone to chat with first");
		}
		*/
	}

	render(){
		return(
			<form onSubmit={this.handleSubmit}>
			<InputGroup>
		        <Input type="text" style={{border: "1px solid rgba(0,0,0,0.4)"}} id="input" onChange={this.handleChange} value={this.state.input} />
		        <InputGroupAddon addonType="append" onClick={this.handleSubmit}>
		        	<Button type="submit" color="info"><Send size={18} /></Button>
		        </InputGroupAddon>
		    </InputGroup>
		    </form>
		);
	}
}

export default InputCont;