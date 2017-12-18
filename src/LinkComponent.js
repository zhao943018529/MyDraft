import React from 'react';



export default class LinkComponent extends React.Component{

	render(){
			let {contentState,entityKey}=this.props;
			let data = contentState.getEntity(entityKey).getData();

		return (
			<a key={data.href} href={data.href}>
				{this.props.children}
			</a>
			);
	}
}