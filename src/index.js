import React from 'react';
import {render} from 'react-dom';
import {Editor,EditorState,RichUtils,CompositeDecorator,AtomicBlockUtils,convertToRaw} from 'draft-js';
import LinkComponent from './LinkComponent';
import MediaBlock from './MediaBlock';
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
		const decorator =new CompositeDecorator([{
			strategy:findLinkEntities,
			component:LinkComponent
		}]);
		this.state = {editorState:EditorState.createEmpty(decorator)};
		this.onChange = (editorState,callback) =>{
			this.setState({editorState},()=>callback&&callback())
		};

		this.focus=()=>this.editor.focus();
		this.toggleBlockType = this._toggleBlockType.bind(this);
		this.toggleInlineStyle =this._toggleInlineStyle.bind(this);
		this.handleKeyCommand = this._handleKeyCommand.bind(this);
		this.openLinkPanel = this._openLinkPanel.bind(this);
		this.confirmLink = this._confirmLink.bind(this);
		this.removeLink = this._removeLink.bind(this);
		this.insertImage =this._insertImage.bind(this);
	}

	_insertImage(e){
		e.preventDefault();
		const {editorState} = this.state;
		const contentState = editorState.getCurrentContent();
		const contentStateWidthEntity = contentState.createEntity('image','IMMUTABLE',{
			src:'https://avatars2.githubusercontent.com/u/21986012?s=40&v=4',
			description:'hahhahahhhahh'
		});
		const entityKey = contentStateWidthEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState,{currentContent:contentStateWidthEntity});
		this.onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState,entityKey,' '));
	}

	_removeLink(e){
		e.preventDefault();
		const {editorState} = this.state;
		const selection = editorState.getSelection();
		if(!selection.isCollapsed()){
			this.onChange(RichUtils.toggleLink(editorState,selection,null));
		}
	}

	_openLinkPanel(e){
  	const {editorState} = this.state;
  	const selection = editorState.getSelection();
  	if(!selection.isCollapsed()){
  		this.link.classList.add("link-open");
		this.link.focus();
  	}
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

  _confirmLink(e){
  	this.link.classList.remove('link-open');
  	let data = {
  		href:document.getElementById('href').value,
  	}

  	const {editorState} = this.state;
  	const contentState = editorState.getCurrentContent();
  	const contentStateWidthEntity = contentState.createEntity(
  		'LINK',
  		document.getElementById('mutability').value,
  		data
  		);

  	const entityKey = contentStateWidthEntity.getLastCreatedEntityKey();
  	//let newEditorState =EditorState.push(editorState,contentStateWidthEntity,'idonotknow');
  	const newEditorState = EditorState.set(editorState,{currentContent:contentStateWidthEntity});
  	this.onChange(RichUtils.toggleLink(newEditorState,newEditorState.getSelection(),entityKey),
  		() => {
              setTimeout(() => this.focus(), 0);
            }
  		);
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
			       	<CustomBlockControl
			          editorState={editorState}
			          onToggle={this.openLinkPanel}
			        />
			        <button onClick={this.removeLink}>removeLink</button>
			        <button onClick={this.insertImage}>insertImage</button>
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
			            blockRendererFn={myMediaBlockRender}
			            ref={(ref) => this.editor = ref}
			            spellCheck={true}
			          />
			          </div>
					</div>
				<div className="item">
					<Editor
			            blockStyleFn={getBlockStyle}
			            customStyleMap={styleMap}
			            editorState={editorState}
			            placeholder="ccccc"
			            blockRendererFn={myMediaBlockRender}
			            spellCheck={true}
			            ref={(ref)=>this.show=ref}
			            readOnly={true}
			          />
				</div>
				<div className="link-panel" ref={(ref)=>this.link=ref}>
					<p><label htmlFor="mutability" >Mutability:<select name="mutability" id="mutability">
						<option value='MUTABLE'>MUTABLE</option>
						<option value='IMMUTABLE'>IMMUTABLE</option>
						<option value='SEGMENTED'>SEGMENTED</option>
					</select></label></p>
					<p><label htmlFor="href" >Href:<input name="href" id="href" /></label></p>
					<button onClick={this.confirmLink}>Create</button>
				</div>
			</div>
			);
	}
}

const myMediaBlockRender = (block)=>{
	if(block.getType()==='atomic'){
		return {
			component:MediaBlock,
			editable:false
		}
	}

	return null;
}


function findLinkEntities(contentBlock,callback,contentState){
	contentBlock.findEntityRanges(
		(character)=>{
			const entityKey = character.getEntity();
			return (
				entityKey !==null&&contentState.getEntity(entityKey).getType()==='LINK'
			);
		},
		callback
	);
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

const CUSTOM_BLOCK_TYPES = [
  {label: 'Link', style: 'Link'},
];

const CustomBlockControl = (props)=>{
	let blockType = props.editorState.getCurrentContent()
	.getBlockForKey(props.editorState.getSelection().getStartKey())
	.getType();
	
	return (
	<div className="RichEditor-controls">
		{
			CUSTOM_BLOCK_TYPES.map(item=>
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