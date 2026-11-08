export type Result = {ok:boolean; stdout:string; stderr:string; error:string; duration:number};
export class PythonRunner {
  private worker:Worker|null=null;
  private ready:Promise<void>|null=null;
  private rejectReady:((reason:Error)=>void)|null=null;
  private finish:((r:Result)=>void)|null=null;
  private generation=0;
  private loadTimer:ReturnType<typeof setTimeout>|null=null;
  busy=false;
  constructor(private status:(s:string)=>void){}
  warm(){
    if(this.ready) return this.ready;
    this.status('Loading Python');
    const w = new Worker(new URL('python-worker.js', document.baseURI),{type:'module'});
    this.worker=w;
    this.ready=new Promise((resolve,reject)=>{
      this.rejectReady=reject;
      const timer=this.loadTimer=setTimeout(()=>{reject(new Error('Runtime loading timed out. Reset environment to retry.'));w.terminate();this.ready=null;this.status('Load failed');},60000);
      w.onmessage=({data})=>{if(data.type==='ready'){clearTimeout(timer);this.rejectReady=null;this.status('Python ready');resolve();}else if(data.type==='load-error'){clearTimeout(timer);this.status('Load failed');this.ready=null;reject(new Error(data.error));}};
      w.onerror=()=>{clearTimeout(timer);this.status('Load failed');this.ready=null;reject(new Error('Python worker failed to load. Reset environment to retry.'));};
    });
    return this.ready;
  }
  async run(code:string,input:string,timeout:number):Promise<Result>{
    if(this.busy) throw new Error('An execution is already in progress.');
    if(new TextEncoder().encode(code).length>102400 || input.length>102400) throw new Error('Code and input must each be at most 100 KiB.');
    this.busy=true;
    const gen=++this.generation;
    try{
      await this.warm();
      if(gen!==this.generation) throw new Error('Execution stopped.');
      this.status('Running');
      return await new Promise<Result>((resolve)=>{
        let stdout='',stderr='';
        const started=performance.now();
        const end=(r:Result)=>{clearTimeout(timer);this.finish=null;this.worker?.terminate();this.worker=null;this.ready=null;this.busy=false;this.status('Python ready');resolve(r);};
        this.finish=end;
        const timer=setTimeout(()=>end({ok:false,stdout,stderr,error:`Execution timed out after ${timeout} seconds.`,duration:performance.now()-started}),timeout*1000);
        this.worker!.onerror=()=>end({ok:false,stdout,stderr,error:'Python worker crashed. Run again to create a fresh environment.',duration:performance.now()-started});
        this.worker!.onmessage=({data})=>{
          if(data.id!==gen) return;
          if(data.type==='output'){
            if(data.kind==='stdout')stdout+=data.text;else stderr+=data.text;
            if(stdout.length+stderr.length>65536) end({ok:false,stdout:stdout.slice(0,65536),stderr:stderr.slice(0,65536),error:'Output limit exceeded (64 KiB).',duration:performance.now()-started});
          }else if(data.type==='done')end({ok:data.ok,stdout,stderr,error:data.error||'',duration:data.duration});
        };
        this.worker!.postMessage({id:gen,code,input});
      });
    }catch(e){this.worker?.terminate();this.worker=null;this.ready=null;this.busy=false;this.status('Needs reset');throw e;}
  }
  stop(){if(this.loadTimer)clearTimeout(this.loadTimer);this.generation++;if(this.finish){this.finish({ok:false,stdout:'',stderr:'',error:'Execution stopped by user.',duration:0});}else{this.rejectReady?.(new Error('Execution stopped.'));this.rejectReady=null;this.worker?.terminate();this.worker=null;this.ready=null;this.busy=false;this.status('Stopped');}}
}
