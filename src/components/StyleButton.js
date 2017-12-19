import React from 'react';


export default class StyleButton extends React.Component{

	constructor(props){
		super(props);
		this.onToggle=(e)=>{
			e.preventDefault();
			this.props.onToggle(this.props.style);
		}
	}

	render(){
		let className= 'editor-item';
		if(this.props.active){
			className+=' editor-active';
		}
		return (
			<span onMouseDown={this.onToggle} className={className}>
				<i className={this.props.className} aria-hidden="true"></i>
			</span>
			);
	}
}