import React from 'react';

class Root extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			message: [],
			input: "",
			error: null
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSend = this.handleSend.bind(this);
	}

	handleChange(e){
		let id = e.currentTarget.id;
		let val = e.currentTarget.value;
		let stateObj = {};
		stateObj[id] = val;

		this.setState(stateObj);
	}

	handleSend(e){
		e.preventDefault();
		let msgObj = {
			msg: this.state.input
		}
		msgObj = JSON.stringify(msgObj);
		this.socket.send(msgObj);
		this.setState({
			input: ""
		})
	}

	componentDidMount(){
		this.socket = new WebSocket('ws://localhost:5000', ['json']);
		this.socket.onerror = err => {
			console.log(err)
			/*this.setState({
				error: err;
			})*/
		}
		this.socket.onmessage = e => {
			let res = JSON.parse(e.data);
			console.log(e, res);
			let copyArr = [...this.state.message]
			copyArr.push(res);

			this.setState({
				message: copyArr
			});
		}
	}

	render(){
		let rendChat = this.state.message.map((elem, id) => 
			<div>
			{elem}
			</div>)
		return(
			<div>
				<h3>Test</h3>
				<div>
					{rendChat}
				</div>
				<p>{this.state.error}</p>
				<input type="text" id="input" value={this.state.input} onChange={this.handleChange} />
				<button onClick={this.handleSend}>Send</button>
			</div>
		);
	}
}

export default Root; 