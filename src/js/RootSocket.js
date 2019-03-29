import React, { Suspense, lazy } from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import LoadComp from './LoadComp.js';

const Auth = lazy(() => import("./Auth.js"));
const Chat = lazy(() => import("./Chat.js"));

class Root2 extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			connect: false
		};
		this.socket;
	}

	componentDidMount(){
		this.socket = io.connect("http://localhost:5000", {transports: ['websocket']});

		this.setState({
			connect: true
		})
	}

	compnentDidUpdate(){
		console.log("updated", this.socket);
	}

	render(){
		console.log(this.socket);
		return(
			<BrowserRouter basename="/">
				<Switch>
					<Route
						exact path="/"
						render={props => (
							<Suspense fallback={<LoadComp />}>
								<Auth {...props} socket={this.socket} />
							</Suspense>
						)}
					/>

					<Route
						exact path="/chat"
						render={props => (
							<Suspense fallback={<LoadComp />}>
								<Chat {...props} socket={this.socket} />
							</Suspense>
						)}
					/>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default Root2;