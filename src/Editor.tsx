import {useEffect,useRef} from 'react';
import {EditorView} from '@codemirror/view';
import {EditorState,Compartment} from '@codemirror/state';
import {basicSetup} from 'codemirror';
import {python} from '@codemirror/lang-python';
export default function Editor({value,onChange,readonly=false}:{value:string;onChange:(v:string)=>void;readonly?:boolean}){
 const host=useRef<HTMLDivElement>(null),view=useRef<EditorView|null>(null),callback=useRef(onChange),lock=useRef(new Compartment()),syncing=useRef(false);callback.current=onChange;
 useEffect(()=>{view.current=new EditorView({parent:host.current!,state:EditorState.create({doc:value,extensions:[basicSetup,python(),lock.current.of(EditorState.readOnly.of(readonly)),EditorView.updateListener.of(u=>{if(u.docChanged&&!syncing.current)callback.current(u.state.doc.toString());}),EditorView.theme({'&':{height:'100%',fontSize:'13px'},'.cm-scroller':{fontFamily:'"SFMono-Regular",Consolas,monospace',lineHeight:'1.85'},'.cm-content':{padding:'22px 0'},'.cm-gutters':{background:'transparent',border:'none',color:'#a0a6b1'},'.cm-lineNumbers .cm-gutterElement':{padding:'0 18px'},'.cm-activeLine':{background:'#f4f6fa'},'.cm-activeLineGutter':{background:'transparent'}})]})});return()=>view.current?.destroy();},[]);
 useEffect(()=>{const v=view.current;if(v&&value!==v.state.doc.toString()){syncing.current=true;v.dispatch({changes:{from:0,to:v.state.doc.length,insert:value}});syncing.current=false;}},[value]);
 useEffect(()=>{view.current?.dispatch({effects:lock.current.reconfigure(EditorState.readOnly.of(readonly))});},[readonly]);
 return <div className="editor" ref={host} aria-label={readonly?'Original submission (read only)':'Python code editor'}/>;
}
