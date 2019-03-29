import React from 'react';
import { Row, Col, Spinner, Card, CardTitle, CardBody, CardText, CardFooter, Form, FormGroup, Input, Label, Button } from 'reactstrap';


class Auth extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			login: true,
			uInput: "",
			p1Input: "",
			p2Input: "",
			error: null,
			spinner: false,
			redirect: false,
		}

		this.handleInput = this.handleInput.bind(this);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleAnon = this.handleAnon.bind(this);
	}

	handleInput(e){
		let elem = e.currentTarget.id;
		let val = e.currentTarget.value;
		let tmpObj = {}
		tmpObj[elem] = val;

		this.setState(tmpObj);
	}

	toggleLogin(){
		this.setState(prevState => ({
			login: !(prevState.login)
		}));
	}

	handleSubmit(e){
		e.preventDefault();
		let reqObj = {
			"username": this.state.uInput,
			"password": this.state.p1Input
		}

		//SIGNUP
		if(!this.state.login){
			if(this.state.p1Input != this.state.p2Input){
				this.setState({
					error: "Passwords must match"
				});
			}
			else{
				console.log("logging in", this.state.uInput);
				//this.props.socket.emit('login', this.state.uInput, this.state.p1Input)
				this.setState({
					spinner: true
				});



				fetch('/auth/signup', {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(reqObj)
					})
					.then(res => res.json())
					.then(data => {
						if(data.actionSuccess){
							window.location = data.redir;
						}
						else{
							this.setState({
								spinner: false,
								error: data.error
							})
						}
					});
			}
		}
		else{  //LOGIN
			this.setState({
				spinner: true
			});

			/*this.props.socket.emit('login', this.state.uInput, this.state.p1Input, (success, err) => {
				console.log(success);

				if(success){
					this.setState({
						redirect: true
					});
				}
				else{
					this.setState({
						error: err
					})
				}
			})*/

			fetch('/auth/login', {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(reqObj)
					})
					.then(res => res.json())
					.then(data => {
						if(data.actionSuccess){
							window.location = data.redir;
						}
						else{
							this.setState({
								spinner: false,
								error: data.error
							})
						}
					})
		}

		//console.log(this.state);
	}

	handleAnon(){
		this.setState({
			spinner: true
		})

		fetch('/auth/tmp')
		.then(res => res.json())
		.then(data => {
			if(data.actionSuccess){
				window.location = data.redir
			}
		});
	}

	render(){
		//console.log(this.state.spinner);
		let p2Render = null;
		let titleText = "Login";
		let buttonText = "Login";
		let btn2Text = "Sign up";
		let errRend;

		let cardRend;

		if(!(this.state.login)){
			titleText = "Register";
			buttonText = "Sign Up";
			btn2Text = "Login";
			p2Render = <FormGroup>
	                   		<Col md="12">
	                    		<Input type="password" id="p2Input" placeholder="Retype Password" value={this.state.p2Input} onChange={this.handleInput} required />
	                    	</Col>
                    	</FormGroup>
		}

		if(this.state.spinner){
			cardRend = <Spinner color="info" />
		}
		else{
			cardRend = <Card className="text-center width-350">
                    	<CardBody>
                    		<CardTitle><h4>{titleText}</h4></CardTitle>
                    			<Form className="pt-3" onSubmit={this.handleSubmit} >
                    				<FormGroup>
	                    				<Col md="12">
	                    					<Input type="text" id="uInput" placeholder="Username" value={this.state.uInput} onChange={this.handleInput} required />
	                    				</Col>
                    				</FormGroup>

                    				<FormGroup>
	                    				<Col md="12">
	                    					<Input type="password" id="p1Input" placeholder="Password" value={this.state.p1Input} onChange={this.handleInput} required />
	                    				</Col>
                    				</FormGroup>

                    				{p2Render}

                    				<FormGroup>
                    					<Col md="12">
                    						<Button type="info" color="primary" className="btn-raised" onClick={this.handleSubmit}>
                    							{buttonText}
                    						</Button>
                    						<Button type="button" color="success" className="ml-2 btn-raised" onClick={this.toggleLogin} >
                    							{btn2Text}
                    						</Button>
	                    				</Col>
                    				</FormGroup>
                    			</Form>

                    			<CardText>{errRend}</CardText>
                    	</CardBody>
                    	<CardFooter>
                    		<Col md="12" className="d-flex align-items-center justify-content-center">
                    			<Button type="button" color="secondary" block className="btn-raised" onClick={this.handleAnon} >
                    				Use Anonymously
                    			</Button>
                    		</Col>
                    	</CardFooter>
                    </Card>
		}

		if(this.state.error){
			errRend = this.state.error
		}

		return(
			<Row className="full-height-vh pt-5">
				<Col xs="12" className="d-flex align-items-center justify-content-center">
					{cardRend}
				</Col>
			</Row>
		)
	}
}

export default Auth;