var g_loadCallCount=0;
var g_loadSuccessCount=0;
var CUtil=function()
{
	
}
CUtil.LoadCompleteChk=function()
{
	if(g_loadCallCount==g_loadSuccessCount)
		return true;
	return false;
}
CUtil.LoadSuccess=function()
{
	g_loadSuccessCount++;
}
CUtil.LoadCall=function()
{
	g_loadCallCount++;
}
CUtil.TextureLoad=function(_file,_filter,_wrap,_mipmap)
{
	

	if (null!= CRes.get(_file))
		return;
	var tex=new CTexture();
	if(typeof _filter == 'undefined')
		_filter=DfTexture.Neaest;
	if(typeof _wrap == 'undefined')
		_wrap=DfTexture.Clamp;
	if(typeof _mipmap == 'undefined')
		_mipmap=false;
	
	tex.Load(_file,_filter,_wrap,_mipmap,this.LoadSuccess);
	CRes.set(_file,tex);
	
	g_loadCallCount++;
}
CUtil.ShaderLoad=function(_file)
{
	
	
	
	if (null!= CRes.get(_file))
		return;
	
	var oReq = new XMLHttpRequest();

	oReq.onload = function(e) 
	{
		if (oReq.status != 200) {
	        alert("ShaderLoad error code" + oReq.status);
	        return false;
	    }
		var vf = new CVertexFormat();
		CWindow.Sha().Compile(oReq.response, vf);
		CRes.set(vf.m_key, vf);
		CUtil.LoadSuccess();
		//var arraybuffer = oReq.response; // not responseText
		//alert(arraybuffer);
	  /* ... */
	}
	oReq.open("GET", _file);
	oReq.responseType = "text";
	oReq.send();
	
	
	g_loadCallCount++;
	

}
CUtil.MeshLoad=function(_file,_vf,_texLoad)
{
	
	
	
	if (null!= CRes.get(_file))
		return;
	if (_file.indexOf("fbx") != -1 || _file.indexOf("FBX") != -1) {}
	else
	{
		CMsg.E("only support FBX");
		return;
	}
	
	var oReq = new XMLHttpRequest();
	oReq._vf=_vf;
	if (typeof _texLoad  == 'undefined')
		oReq.texLoad=false;
	else
		oReq.texLoad=_texLoad;

	oReq.onload = function(e) 
	{
		if (oReq.status != 200) {
	        alert("MeshLoad error " + oReq.status);
	        return false;
	    }
		var par = new CParserFbx();
		par.SetBuffer(new Uint8Array(oReq.response),oReq.response.byteLength);
		par.Load(_file);
		var mesh = CRes.get(_file);
		CWindow.MMgr().MeshCreateModify(mesh, this._vf);

		if (this.texLoad)
		{
			for (var each0 of mesh.texture)
			{
				if(mesh.uvRevers)
					CUtil.TextureLoad(each0, DfTexture.Neaest, DfTexture.Repeat);
				else
					CUtil.TextureLoad(each0);
				//CUtil.TextureLoad(each0);
			}
			
		}
		
		CUtil.LoadSuccess();
		//var arraybuffer = oReq.response; // not responseText
		//alert(arraybuffer);
	  /* ... */
	}
	oReq.open("GET", _file);
	oReq.responseType = "arraybuffer";
	oReq.send();
	
	
	g_loadCallCount++;
	

}