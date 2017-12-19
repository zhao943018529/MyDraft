import React from 'react';
import {render} from 'react-dom';
import {EditorState,Editor,RichUtils} from 'draft-js';
import InlineStyleControl from './components/InlineStyleControl';


class App extends React.Component{

	constructor(props){
		super(props);
		this.state= {editorState:EditorState.createEmpty()};
		this.onChange=(editorState,callback)=>this.setState({editorState},callback&&callback());
		this.handleKeyCommand = this._handleKeyCommand.bind(this);
		this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
		this.toggleBlockType = this._toggleBlockType.bind(this);
		this.focus=()=>this.editor.focus();
	}

	_handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	}

	_toggleInlineStyle(inlineStyle) {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
	}

	_toggleBlockType(blockType) {
		this.onChange(RichUtils.toggleBlockType(
			this.state.editorState,
			blockType
		));
	}

	render(){
		let {editorState} = this.state;
		let contentState = editorState.getCurrentContent();
		let className = 'RichEditor-editor';
		if(!contentState.hasText()){
			if(contentState.getBlockMap().first().getType()!=='unstyled'){
				className+=' RichEditor-hidePlaceholder';
			}
		}
		return (
			<div className="container">
				<div className="operator">
					<InlineStyleControl editorState={editorState} onToggle={this.toggleInlineStyle}/>
				</div>
				<div className={className} onClick={this.focus}>
					<Editor
						onChange={this.onChange}
						editorState={editorState}
						customStyleMap={styleMap}
						ref={(ref)=>this.editor=ref}
						placeholder="Write your article..."
						handleKeyCommand={this.handleKeyCommand}

					/>
				</div>	
			</div>
			);
	}
}

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

render(<App />,document.getElementById('root'));