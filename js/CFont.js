var g_fontCount=0;
var g_textMap=new Map();
var g_ttf=null


function CFontRef()
{
	this.m_key="";
	this.m_xSize=0;
	this.m_ySize=0;
}

class CFont
{
	static Init(pa_ttfName)
	{
		this.m_canvas=document.createElement("canvas");
		this.m_canvas.width=32;
		this.m_canvas.height=32;
		this.m_ctx=this.m_canvas.getContext('2d');
		
		if(typeof pa_ttfName == 'undefined')
			g_ttf="Arial";
		else
			g_ttf=pa_ttfName;
	}
	static TextToTexName(pa_text,_fontSize,_exp,_maxX,_maxY)
	{
		if(typeof _exp == 'undefined')
			_exp=false;
		if(typeof _maxX == 'undefined')
		{
			_maxX=100000;
			_maxY=100000;
		}
		
		if(g_ttf==null)
		{
			CMsg.E("font Init fail");
			Init();
			//return; 
		}
		var rname=pa_text+_fontSize;
		
		if(g_textMap.get(pa_text+_fontSize)!=null)
		{
			return g_textMap.get(pa_text+_fontSize);
		}
		g_textMap.set(pa_text+_fontSize,new CFontRef());
		g_textMap.get(pa_text+_fontSize).m_key=rname;;
		
		this.m_ctx.font = _fontSize+"px "+g_ttf;
		g_fontCount++;
		var xMax=0;
		var rText="";
		for(var i=0;i<pa_text.length;++i)
		{
			if(pa_text[i]=='\n')
			{
				xMax=0;
			}
			else
			{
				var xSize=this.m_ctx.measureText(pa_text[i]).width;
				if(xSize+xMax>_maxX)
				{
					xMax=xSize;
					rText+="\n";
				}
				else
					xMax+=xSize;
			}
			
			
			rText+=pa_text[i];
		}
		
		
		
		
		var cutStr=rText.split("\n");
		if(cutStr.length != 0 && cutStr[cutStr.length-1]=="")
		{
			cutStr.splice(cutStr.length-1,1);
		}
		
		//this.m_canvas.width=10000;
		//this.m_canvas.height=10000;
		
		if(cutStr.length*_fontSize>_maxY)
		{
			var mc=_maxY/_fontSize;
			var cc=cutStr.length;
			cutStr.splice(0,cc-mc);
		}
		
		
		
		xMax=0;
		for(var i=0;i<cutStr.length;++i)
		{
			var xSize=this.m_ctx.measureText(cutStr[i]).width;
			if(xSize>xMax)
				xMax=xSize;
		}
		
		g_textMap.get(pa_text+_fontSize).m_xSize=xMax+4;
		g_textMap.get(pa_text+_fontSize).m_ySize=cutStr.length*_fontSize;
		if(_exp)
		{
			this.m_canvas.height=CMath.CloseToExp(_fontSize*cutStr.length, 2);
	    	this.m_canvas.width=CMath.CloseToExp(xMax, 2);
		}
		else
		{
			this.m_canvas.height=_fontSize*cutStr.length;
	    	this.m_canvas.width=xMax+4;
		}
		
		
		
    	//this.m_canvas.clientWidth=xMax;
    	//this.m_canvas.clientHeight=_fontSize;
    	
    	//this.m_ctx.fillStyle = "rgb(0,155,0)";
    	//this.m_ctx.fillRect (0,0,this.m_canvas.width*0.5,this.m_canvas.height);
    	
    	this.m_ctx.strokeStyle = 'rgb(40, 40, 80)';
    	this.m_ctx.fillStyle = 'Black';
    	this.m_ctx.lineWidth = 2;
//    	this.m_ctx.strokeText(pa_text, 100, 100);
//    	this.m_ctx.fillText(pa_text, 100, 100);
    	
    	this.m_ctx.font = _fontSize+"px "+g_ttf;
    	for(var i=0;i<cutStr.length;++i)
    	{
    		var hpos=parseInt(_fontSize*0.88+i*_fontSize);
    		this.m_ctx.fillText(cutStr[i],0,hpos);
    		this.m_ctx.strokeText(cutStr[i],0,hpos);
    	}
    	
    	
    	
    	
    	const imageData = this.m_ctx.getImageData(0, 0, this.m_canvas.width, this.m_canvas.height);
    	//var array = new Uint8Array(imageData.data.buffer); 
    	var tex=new CTexture();
    	tex.CreateByte4(this.m_canvas.width,this.m_canvas.height);
    	var buf = tex.GetByte8();
    	
    	for(var i=0;i<tex.Byte8AllSize();++i)
    	{
    		buf[i]=imageData.data[i];
    	}
    	CWindow.TMgr().Create(tex);
    	//tex.Create(DfTexture.Neaest,0,array,this.m_canvas.width,this.m_canvas.height);
    	
    	
    	
    	CRes.set(rname,tex);
    	
    	return g_textMap.get(pa_text+_fontSize);
    	
	}
};