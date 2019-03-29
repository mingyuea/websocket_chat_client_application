import React from 'react';
import { Container, Spinner } from 'reactstrap';

const contStyle = {
	height: "100%",
	width: "100%",
	maxWidth: "100%",
	maxHeight: "100%",
	backgroundColor: "white",
	margin: "0",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "0"
}

class LoadComp extends React.Component {
	render(){
		return(
			<div className="container d-flex justify-content-center align-items-center">
				<Spinner style={{ width: '3rem', height: '3rem' }} type="grow" color="dark" />
				<Spinner style={{ width: '3rem', height: '3rem' }} type="grow" color="dark" />
				<Spinner style={{ width: '3rem', height: '3rem' }} type="grow" color="dark" />
			</div>
		);
	}
}

export default LoadComp;