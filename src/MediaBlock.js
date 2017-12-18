import React from 'react';


export default class MediaBlock extends React.Component{

	render(){
		const {contentState,block} = this.props;
		const entityKey = block.getEntityAt(0);
		if(entityKey){
			const entity = contentState.getEntity(entityKey);
			const {src,description} =entity.getData();
			if(entity.getType()==='image'){
				return (
					<div>
						<img src={src} alt={description} />
						<figcation>{description}</figcation>
					</div>	
					);
			}else if(entity.getType()==='video'){
				return (
					<div>tokyo hot</div>
					);
			}
				
		}
		return null;
	}
}