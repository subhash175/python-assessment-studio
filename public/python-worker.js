// A dedicated module worker. Each instance executes exactly one program.
const ROOT = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let pyodide;
try {
  const { loadPyodide } = await import(ROOT + 'pyodide.mjs');
  pyodide = await loadPyodide({ indexURL: ROOT });
  postMessage({type:'ready'});
} catch (e) { postMessage({type:'load-error',error:'Python could not load. Check your internet connection and access to cdn.jsdelivr.net, then reset the environment. '+String(e)}); }
let used = false;
onmessage = async ({data}) => {
  if (!pyodide || used) return;
  used = true;
  const {id,code,input} = data;
  let bytes = 0;
  const decoder = new TextDecoder();
  const write = (kind) => (buffer) => {
    bytes += buffer.length;
    if(bytes > 65536) throw new Error('Output limit exceeded (64 KiB).');
    postMessage({type:'output',id,kind,text:decoder.decode(buffer,{stream:true})});
    return buffer.length;
  };
  pyodide.setStdout({write:write('stdout')});
  pyodide.setStderr({write:write('stderr')});
  const lines = input === '' ? [] : input.replace(/\r\n/g,'\n').split('\n');
  pyodide.setStdin({stdin:()=>lines.shift() ?? null, isatty:false});
  const start = performance.now();
  try {
    await pyodide.runPythonAsync(code);
    postMessage({type:'done',id,ok:true,duration:performance.now()-start});
  } catch (e) {
    postMessage({type:'done',id,ok:false,error:String(e).slice(0,16000),duration:performance.now()-start});
  }
};
