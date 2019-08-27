function JSDfTexture()
{
	this.Clamp = 0;
	this.Repeat = 1;
	this.Mirrored = 2;
	this.Linear = 3;
	this.Neaest = 4;
};
var DfTexture=new JSDfTexture();




function m_TOW_POWER_CHK(pa_x, pa_y)
{
	switch (pa_x)
	{
	case 2:case 4:case 8:case 16:case 32:case 64:case 128:case 256:
	case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:
		break;
	default:
		return true;
	}
	switch (pa_y)
	{
	case 2:case 4:case 8:case 16:case 32:case 64:case 128:case 256:
	case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:
		break;
	default:
		return true;
	}
	return false;
	//return ((pa_x%2)==0 && (pa_y%2)==0)?false:true;
}


function CTexture()
{
	this.m_width=0;
	this.m_height=0;
	this.m_buffer=null;//web Image 
	this.m_gBuffer=null;
	this.m_mipMap=false;
	this.m_wrap=DfTexture.Clamp;//0 CLAMP 1 REPEAT 
	this.m_filter=DfTexture.Neaest;//0LINEAR 1NEAREST
}
CTexture.prototype.constructor	=CTexture;
CTexture.prototype.CreateByte4=function(_width,_height)	
{
	this.m_width = _width;
	this.m_height = _height;
	this.m_buffer = new Uint8Array(_width*_height * 4);	
}
CTexture.prototype.GetGBuf=function()	{	return this.m_gBuffer;	}
CTexture.prototype.SetGBuf=function(_gbuf)	{	this.m_gBuffer=_gbuf;	}
CTexture.prototype.GetByte8=function() { return this.m_buffer; }

CTexture.prototype.SetFilter=function(_option) {this.m_filter= _option; }
CTexture.prototype.SetWrap=function(_option) { this.m_wrap = _option; }
CTexture.prototype.SetMipMap=function(_option) { this.m_mipMap = _option; }
CTexture.prototype.GetWrap=function() { return this.m_wrap;	 }
CTexture.prototype.GetFilter=function() { return this.m_filter; }
CTexture.prototype.GetWidth=function() { return this.m_width; }
CTexture.prototype.GetHeight=function() { return this.m_height; }
CTexture.prototype.GetMipMap=function() { return this.m_mipMap; }
CTexture.prototype.Byte8AllSize=function() { return this.m_width * this.m_height * 4; }





CTexture.prototype.Load=function(_fileName,_f,_w,_m,_complete)
{
	this.m_minMap=false;
	this.m_wrap=_w;
	this.m_filter=_f;
	this.m_mipMap=_m;
	
	
	
	if(gl!=null)
	{
		this.m_gBuffer = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.m_gBuffer);
		 
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		              new Uint8Array([0, 0, 0, 0]));
	}
	
	
	
	
	
	this.m_buffer = new Image();
	this.m_buffer.src = _fileName;
	this.m_buffer.tex=this;
	this.m_buffer.addEventListener('load', function() 
	{
		this.tex.m_width=this.width;
		this.tex.m_height=this.height;
		if(gl!=null)
		{
			if (m_TOW_POWER_CHK(this.tex.GetWidth(), this.tex.GetHeight()) && this.tex.GetWrap() != DfTexture.Clamp)
			{
				CMsg.E("2제곱 텍스쳐가 아니면 클램프로 지정해주세요!(d_TexWClamp)");
			}
			
			gl.bindTexture(gl.TEXTURE_2D, this.tex.m_gBuffer);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this);
			
			
			if (m_TOW_POWER_CHK(this.tex.GetWidth(), this.tex.GetHeight())==false && this.tex.GetMipMap())
			{
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			
		}
		if(_complete!=null)
			_complete();
	});
}
CTexture.prototype.Create=function(_f,_w,_buf,_width,_height)
{
	this.m_minMap=false;
	this.m_wrap=_w;
	this.m_filter=_f;
	this.m_width=_width;
	this.m_height=_height;
	this.m_buffer=null;
	
	if (m_TOW_POWER_CHK(this.GetWidth(), this.GetHeight()) && this.GetWrap() != DfTexture.Clamp)
	{
		CMsg.E("2제곱 텍스쳐가 아니면 클램프로 지정해주세요!(d_TexWClamp)");
	}
	
	this.m_gBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.m_gBuffer);	 
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE,_buf);
	if (m_TOW_POWER_CHK(this.GetWidth(), this.GetHeight())==false && this.GetMipMap())
	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	
}
//========================================================================================
class CTextureMgr
{
	constructor()
	{
		
	}
}
class CTextureMgrGL extends CTextureMgr 
{
	constructor()
	{
		super();
	}
	Create(pa_tex)
	{
		if (m_TOW_POWER_CHK(pa_tex.GetWidth(), pa_tex.GetHeight()) && pa_tex.GetWrap() != DfTexture.Clamp)
		{
			CMsg.E("2제곱 텍스쳐가 아니면 클램프로 지정해주세요!(d_TexWClamp)");
		}
		
		pa_tex.SetGBuf(gl.createTexture());
		gl.bindTexture(gl.TEXTURE_2D, pa_tex.GetGBuf());	 
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, pa_tex.GetWidth(), pa_tex.GetHeight(), 0, gl.RGBA, gl.UNSIGNED_BYTE,pa_tex.GetByte8());
		if (m_TOW_POWER_CHK(pa_tex.GetWidth(), pa_tex.GetHeight())==false && pa_tex.GetMipMap())
		{
			gl.generateMipmap(gl.TEXTURE_2D);
		}
	}
	
}
