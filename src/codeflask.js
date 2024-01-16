
 /**
  * EditorJsCodeFlask Block for the Editor.js.
  *
  * @author Calum Knott (calum@calumk.com)
  * @license The MIT License (MIT)
  */
 
 /**
  * @typedef {object} EditorJsCodeFlaskConfig
  * @property {string} placeholder - placeholder for the empty EditorJsCodeFlask
  * @property {boolean} preserveBlank - Whether or not to keep blank EditorJsCodeFlasks when saving editor data
  */
 
 /**
  * @typedef {Object} EditorJsCodeFlaskData
  * @description Tool's input and output data format
  * @property {String} text — EditorJsCodeFlask's content. Can include HTML tags: <a><b><i>
  */

  import style from './codeflask.css'
  import icon from './codeflask.svg';

  import Prism from 'prismjs';

  // import "prismjs-components-importer/esm"; // ALL - Massivly Increases Bundle size!

  import "prismjs-components-importer/esm/prism-abap";
  import "prismjs-components-importer/esm/prism-apacheconf";
  import "prismjs-components-importer/esm/prism-bash";
  import "prismjs-components-importer/esm/prism-c";
  import "prismjs-components-importer/esm/prism-clojure";
  import "prismjs-components-importer/esm/prism-coffeescript";
  import "prismjs-components-importer/esm/prism-cpp";
  import "prismjs-components-importer/esm/prism-csharp";
  import "prismjs-components-importer/esm/prism-dart";
  import "prismjs-components-importer/esm/prism-docker";
  import "prismjs-components-importer/esm/prism-elixir";
  import "prismjs-components-importer/esm/prism-erb";
  import "prismjs-components-importer/esm/prism-erlang";
  import "prismjs-components-importer/esm/prism-excel-formula";
  import "prismjs-components-importer/esm/prism-fsharp";
  import "prismjs-components-importer/esm/prism-go";
  import "prismjs-components-importer/esm/prism-graphql";
  import "prismjs-components-importer/esm/prism-haml";
  import "prismjs-components-importer/esm/prism-haskell";
  import "prismjs-components-importer/esm/prism-http";
  import "prismjs-components-importer/esm/prism-toml";
  import "prismjs-components-importer/esm/prism-java";
  import "prismjs-components-importer/esm/prism-julia";
  import "prismjs-components-importer/esm/prism-kotlin";
  import "prismjs-components-importer/esm/prism-less";
  import "prismjs-components-importer/esm/prism-lisp";
  import "prismjs-components-importer/esm/prism-makefile";
  import "prismjs-components-importer/esm/prism-markdown";
  import "prismjs-components-importer/esm/prism-nginx";
  import "prismjs-components-importer/esm/prism-objectivec";
  import "prismjs-components-importer/esm/prism-ocaml";
  import "prismjs-components-importer/esm/prism-perl";
  import "prismjs-components-importer/esm/prism-php";
  import "prismjs-components-importer/esm/prism-powershell";
  import "prismjs-components-importer/esm/prism-purebasic";
  import "prismjs-components-importer/esm/prism-python";
  import "prismjs-components-importer/esm/prism-r";
  import "prismjs-components-importer/esm/prism-ruby";
  import "prismjs-components-importer/esm/prism-rust";
  import "prismjs-components-importer/esm/prism-scala";
  import "prismjs-components-importer/esm/prism-scss";
  import "prismjs-components-importer/esm/prism-solidity";
  import "prismjs-components-importer/esm/prism-sql";
  import "prismjs-components-importer/esm/prism-swift";
  import "prismjs-components-importer/esm/prism-typescript";
  import "prismjs-components-importer/esm/prism-yaml";
 
  import CodeFlask from 'codeflask';

  import NiceSelect from "nice-select2/dist/js/nice-select2";
  import NiceSelectStyle from "nice-select2/dist/css/nice-select2.css";

  // console.log(Prism.languages)

 class EditorJsCodeFlask {
   /**
    * Default placeholder for EditorJsCodeFlask Tool
    *
    * @return {string}
    * @constructor
    */
   static get DEFAULT_PLACEHOLDER() {
     return '// Hello';
   }

   static get enableLineBreaks() {
    return true;
  }
 
   /**
    * Render plugin`s main Element and fill it with saved data
    *
    * @param {object} params - constructor params
    * @param {EditorJsCodeFlaskData} params.data - previously saved data
    * @param {EditorJsCodeFlaskConfig} params.config - user config for Tool
    * @param {object} params.api - editor.js api
    * @param {boolean} readOnly - read only mode flag
    */
   constructor({data, config, api, readOnly}) {
    //  console.log(data)
     this.api = api;
     this.readOnly = readOnly;
 
     this._CSS = {
       block: this.api.styles.block,
       wrapper: 'ce-EditorJsCodeFlask',
       settingsButton: this.api.styles.settingsButton,
       settingsButtonActive: this.api.styles.settingsButtonActive,
     };
 
     if (!this.readOnly) {
       this.onKeyUp = this.onKeyUp.bind(this);
     }
 
     /**
      * Placeholder for EditorJsCodeFlask if it is first Block
      * @type {string}
      */
     this._placeholder = config.placeholder ? config.placeholder : EditorJsCodeFlask.DEFAULT_PLACEHOLDER;

     this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

     this._element; // used to hold the wrapper div, as a point of reference

 

     // let x = (x === undefined) ? your_default_value : x;
     this.data = {}
     this.data.code = (data.code === undefined) ? '' : data.code;
     this.data.language = (data.language === undefined) ? 'javascript' : data.language;
     this.data.showlinenumbers = config.showlinenumbers;
     this.data.editorInstance = {}

    //  console.log(this.data)

   }
 
   /**
    * Check if text content is empty and set empty string to inner html.
    * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
    *
    * @param {KeyboardEvent} e - key up event
    */
   onKeyUp(e) {
    console.log('yeeeeee');
     if (e.code !== 'Backspace' && e.code !== 'Delete') {
       return;
     }
 
     const {textContent} = this._element;
 
     if (textContent === '') {
       this._element.innerHTML = '';
     }
   }

 
   /**
    * Return Tool's view
    *
    * @returns {HTMLDivElement}
    */
   render() {
    this._element = document.createElement('div');
    this._element.classList.add('editorjs-codeFlask_Wrapper');
    let editorElem = document.createElement('div');
    editorElem.classList.add('editorjs-codeFlask_Editor');
    let langdisplay = document.createElement('div');
    langdisplay.classList.add('editorjs-codeFlask_LangDisplay');
    let settingsContainer = document.createElement('div');
    settingsContainer.classList.add('editorjs-codeFlask_LangSelector');
    let languagesSelect = document.createElement("select");
    languagesSelect.classList.add("small");

    langdisplay.innerHTML = this.data.language

    //sort available languages alphabetically (ignore case)
    let languages = Object.keys(Prism.languages).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    //Create and append the options
    for (var i = 0; i < languages.length; i++) {
        // Weirdly PrismJS doesnt expose a list of installed languages, or rather it does, but it is mixed with helper functions, which i have to clear here.
        if (languages[i] == "extend" || languages[i] == "insertBefore" || languages[i] == "DFS") {
          continue;
        }

        var option = document.createElement("option");
        option.value = languages[i];
        option.text = languages[i];
        if(languages[i] == this.data.language){
          option.selected="selected"
        }
        languagesSelect.appendChild(option);
    }

    languagesSelect.addEventListener('change', (event) => {
      this._updateLanguage(event.target.value)
    });

    // Append language select element to langSelector div
    settingsContainer.appendChild(languagesSelect);
    new NiceSelect(languagesSelect, {searchable : true, placeholder : (this.data.language === undefined) ? "Language...": this.data.language});

    // Append other created elements to parent element
    this._element.appendChild(editorElem)
    this._element.appendChild(langdisplay)
    this._element.appendChild(settingsContainer);

    this.data.editorInstance = new CodeFlask(editorElem, { 
      language: this.data.language, 
      lineNumbers : this.data.showlinenumbers,
      readonly : this.readOnly
    });

    this.data.editorInstance.onUpdate((code) => {
      let _length = code.split('\n').length
      this._debounce(this._updateEditorHeight(_length))
    });

    this.data.editorInstance.addLanguage(this.data.language, Prism.languages[this.data.language]);
    this.data.editorInstance.updateCode(this.data.code);

    return this._element
   }

  _updateEditorHeight(length){

    let _height = (length * 21) + 10
    if (_height < 60){ _height = 60 }

    this._element.style.height = _height + 'px';
  }


  _debounce(func, timeout = 500){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  _toggleLineNumbers = (thing) => {
    this.data.showlinenumbers = !this.data.showlinenumbers
    // replace this with a native method for codeflask, if it gets implemented.
    // for now, we will completely destroy the codeflask instance, and rebuild it - lazy but effective
  }

  _updateLanguage = (lang) => {
    this.data.language = lang
    this._element.querySelector('.editorjs-codeFlask_LangDisplay').innerHTML = this.data.language
    this.data.editorInstance.updateLanguage(this.data.language)
  }
 
   /**
    * Extract Tool's data from the view
    * @param {HTMLDivElement} toolsContent - EditorJsCodeFlask tools rendered view
    * @returns {EditorJsCodeFlaskData} - saved data
    * @public
    */
   save(toolsContent) {
    let resp = {
      code : this.data.editorInstance.getCode(),
      language : this.data.language,
      showlinenumbers : this.data.showlinenumbers
    };
    
    return resp
   }
 
   /**
    * Returns true to notify the core that read-only mode is supported
    *
    * @return {boolean}
    */
   static get isReadOnlySupported() {
     return true;
   }

   /**
    * Icon and title for displaying at the Toolbox
    *
    * @return {{icon: string, title: string}}
    */
   static get toolbox() {
     return {
       icon: icon,
       title: 'Code'
     };
   }
 }
 
export { EditorJsCodeFlask as default }