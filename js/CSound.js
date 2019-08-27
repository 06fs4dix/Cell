var g_soundPath="sound/";
var g_soundVolume=1.0;
class CSound
{
	constructor()
	{
		this.m_file;//실제 파일
		this.m_key;//파일별 별칭
		this.m_volume=1.0;
		this.m_loop=false;
		this.m_load=false;
		this.m_play=false;
	}
	Play()
	{
		
	}
	Stop()
	{
		
	}
}
function ReadyCallback(_obj)
{
	var so=CSoundMgr.m_res.get(_obj.origin);
	so.m_load=true;
}
class CSoundMgrWeb
{
	constructor()
	{
		this.m_res=new Map();
	}
	
	Load(_file,_key,_volume,_loop)
	{
		var so=new CSound();
		so.m_file=_file;
		so.m_key=_key;
		so.m_loop=_loop;
		so.m_volume=_volume;
		
		ion.sound({
		    sounds: [
		        {
		            name: _file,
		            alias: _key,
		            volume: _volume,
		        },	 
		    ],
		    loop:_loop,
		    origin: _key,
		    path: g_soundPath,
		    preload: true,
		    multiplay:true,
		    ready_callback: ReadyCallback,
			//ended_callback: myEndedCallback,
		});
		this.m_res.set(so.m_key,so);
	}
	Play(_key,_volume)
	{
		var so=this.m_res.get(_key);
		if(so==null)
			return;
		so.m_play=true;
		if(so.m_load==false)
		{
			setTimeout(function(){CSoundMgr.Play(_key) }, 2000);
			return;
		}
		var vol= typeof _volume !== 'undefined' ? _volume : 1.0;
		if(vol<0.1)
			return;
		else if(vol>1.0)
			vol=1.0;
		vol=vol*so.m_volume*g_soundVolume;
		if(vol<0.1)
			return;
		
		ion.sound.play(so.m_key,{volume: vol});
	}
	Stop()
	{
		
	}
	
}
var CSoundMgr =new CSoundMgrWeb();