

class s_localFun
{
	constructor()
	{
		this.event=null;
		this.classFun=null
		this.id=-1;
	}
}

var g_threadId=1;
var g_pstThread=null;
class CThread
{
	constructor()
	{
		this.m_id=g_threadId++;
		this.event=null;
	}
	Start(_event)
	{
		this.worker = new Worker( 'lib/Woker.js' );
		g_pstThread=this;
		this.event=_event;
		this.worker.postMessage();
	}
	ThreadBigin()
	{
		this.worker = new Worker( 'Woker.js' );
		this.worker.postMessage();

	}
	ThreadEnd()
	{
		this.worker.terminate();
		this.worker=undefined;
	}
	ThreadRun(_id)
	{
		
	}
	GetThreadCurrentId()
	{
		return this.m_id;
	}
}


