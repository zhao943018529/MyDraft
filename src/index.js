import React from 'react';
import {render} from 'react-dom';
import {Editor,EditorState,RichUtils} from 'draft-js';

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

class App extends React.Component{

	constructor(props){
		super(props);
		this.state = {editorState:EditorState.createEmpty()};
		this.onChange = (editorState) =>this.setState({editorState});
		this.focus=()=>this.editor.focus();
		this.toggleBlockType = this._toggleBlockType.bind(this);
		this.toggleInlineStyle =this._toggleInlineStyle.bind(this);
		this.handleKeyCommand = this._handleKeyCommand.bind(this);
	}

	_toggleInlineStyle(inlineStyle){
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState,inlineStyle));
	}

	_toggleBlockType(blockType){
		this.onChange(RichUtils.toggleBlockType(
			this.state.editorState,
			blockType
		));
	}

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

	render(){
		const {
			editorState
		} = this.state;

		// If the user changes block type before entering any text, we can
		// either style the placeholder or hide it. Let's just hide it now.
		let className = 'RichEditor-editor';
		var contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' RichEditor-hidePlaceholder';
			}
		}
		return (
			<div className="container">
				<div className="item">
			        <BlockControl
			          editorState={editorState}
			          onToggle={this.toggleBlockType}
			        />
			        <StyleControl
			          editorState={editorState}
			          onToggle={this.toggleInlineStyle}
			        />
			        <div className={className} onClick={this.focus}>
			          <Editor
			            blockStyleFn={getBlockStyle}
			            customStyleMap={styleMap}
			            editorState={editorState}
			            handleKeyCommand={this.handleKeyCommand}
			            onChange={this.onChange}
			            placeholder="Tell a story..."
			            ref={(ref) => this.editor = ref}
			            spellCheck={true}
			          />
			          </div>
					</div>
				<div className="item">

				</div>
			</div>
			);
	}
}

function getBlockStyle(contentBlock){
	switch(contentBlock.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote';
		default:
			return null;
	}
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockControl = (props)=>{
	let blockType = props.editorState.getCurrentContent()
	.getBlockForKey(props.editorState.getSelection().getStartKey())
	.getType();

	return (
	<div className="RichEditor-controls">
		{
			BLOCK_TYPES.map(item=>
		<StyleButton key={item.label}
		 	label={item.label}
			active={blockType===item.style}
			style={item.style}
			onToggle={props.onToggle}
		 />
		)
	}
		</div>
	);
}

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const StyleControl = (props)=>{
	let currentStyle = props.editorState.getCurrentInlineStyle();
	return (
	<div className="RichEditor-controls">
		{
		INLINE_STYLES.map(item=>
		(<StyleButton key={item.label}
		 label={item.label}
			active={currentStyle.has(item.style)}
			style={item.style}
			onToggle={props.onToggle}
		 />)
		)
	}
		</div>
	);
}

class StyleButton extends React.Component{
	
	constructor(props){
		super();

		this.onToggle=(e)=>{
			e.preventDefault();
			this.props.onToggle(this.props.style);
		}
	}
	render(){
		let className='RichEditor-styleButton';
		if(this.props.active){
			className+=' RichEditor-activeButton'
		}

		return (
	      <span className={className} onMouseDown={this.onToggle}>
	        {this.props.label}
	      </span>
	    );
	}
}




render(<App />,document.getElementById('root'));