function CRenderMgr() 
{
}
CRenderMgr.prototype.constructor	=CRenderMgr;
CRenderMgrGL.prototype.Light_Set=function(_vf,_dir,_color,_offset)
{
	this.SetValue(_vf, "ligDirect", _dir);
	this.SetValue(_vf, "ligColor", _color);
}




function CRenderMgrGL() 
{
	
}
CRenderMgrGL.prototype=new CRenderMgr();
CRenderMgrGL.prototype.constructor	=CRenderMgrGL;


CRenderMgrGL.prototype.SetShader=function(_vf)
{
	gl.useProgram(_vf.m_shader);
}
CRenderMgrGL.prototype.VertexArrayBind=function(_vf,_mesh)
{
	if (CRoot.m_renderer == DfRen.GL_L)
	{
		var L_vb_ex = _mesh.vGBufEx;
	
		for (var i = 0; i < _vf.m_data.size(); ++i)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, L_vb_ex[i]);//몇번째냐 버퍼가
			
			gl.enableVertexAttribArray(i);
			gl.vertexAttribPointer(i, _vf.m_data[i].eachCount, _vf.m_data[i].SysDataType(), false, 0, 0);
		}
	}
	else
	{
		gl.bindVertexArray(_mesh.vGBuf);
	}
	
}
CRenderMgrGL.prototype.VDrawMeshData=function(_vf,_mesh)
{
	if (_mesh.vNum == 0)
	{
		return;
	}

	this.VertexArrayBind(_vf, _mesh);
	if(_mesh.iBuf!=null)
	{
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _mesh.iBuf);
		if (_mesh.iInfo.f16t32==false)
			gl.drawElements(gl.TRIANGLES, _mesh.iNum*3, gl.UNSIGNED_SHORT, 0);
		else
			gl.drawElements(gl.TRIANGLES, _mesh.iNum*3, gl.UNSIGNED_INT, 0);
	}
	else
		gl.drawArrays(gl.TRIANGLES, 0, _mesh.vNum);
}
CRenderMgrGL.prototype.SetValue=function(_vf,pa_text,_value)
{
	var uni=_vf.GetUniform(pa_text);
	if(uni==null)
	{
		return;
	}
	
	if(_value instanceof Array)
	{
		var count = pa_mat.length / 16;
		
		for(var i=0;i<count;++i)
		{
			var L_word = gl.getUniformLocation(_vf.m_shader, pa_text+"["+i+"]");
			var dum=new Float32Array(16);
			for(var j=0;j<16;++j)
			{
				dum[j]=_value[i*16+j];
			}
			gl.uniformMatrix4fv(L_word, false, dum);
		}
		
		
		
	}
	else if(_value instanceof CMat)
	{
		
		var L_word = uni.data;

		gl.uniformMatrix4fv(L_word, false, _value.Float32Array());

		
	}
	else if(_value instanceof CVec4)
	{
		
		var L_word = uni.data;

		gl.uniform4fv(L_word, _value.Float32Array());

		
	}
	else if(_value instanceof CVec3)
	{
		
		var L_word = uni.data;

		gl.uniform3fv(L_word, _value.Float32Array());

		
	}
	else if(_value instanceof CVec2)
	{
		
		var L_word = uni.data;

		gl.uniform2fv(L_word, _value.Float32Array());

		
	}
	else if( typeof _value =="number")
	{
		var L_word = _vf.GetUniform(pa_text).data;
		//var L_word = gl.getUniformLocation(_vf.m_shader, pa_text);

		gl.uniform1f(L_word, _value);

		
	}
	else
		CMsg.E("setValue Error");
}
CRenderMgrGL.prototype.SetValueFloat=function(_vf,pa_text,pa_vec,_each)
{
	var uni=_vf.GetUniform(pa_text);
	if(uni==null)
	{
		return;
	}
	var L_word = uni.data;
	if(_each==1)
		gl.uniform1fv(L_word, pa_vec);
	else if(_each==2)
		gl.uniform2fv(L_word, pa_vec);
	else if(_each==3)
		gl.uniform3fv(L_word, pa_vec);
	else if(_each==4)
		gl.uniform4fv(L_word, pa_vec);
	else if(_each==16)
		gl.uniformMatrix4fv(L_word, false, pa_vec);
}
CRenderMgrGL.prototype.SetTexture=function(_vf,_texture,_textureOff)
{
	gl.useProgram(_vf.m_shader);
	
	if(typeof _textureOff == 'undefined')
	{
		gl.activeTexture(gl.TEXTURE0);
		var tex = null;
		tex=CRes.get(_texture);
		if (tex == null)
			return;
		gl.bindTexture(gl.TEXTURE_2D, tex.GetGBuf());
		this.SetTextureOption(tex.GetFilter(),tex.GetWrap(),tex.GetMipMap());
		var L_shTex = gl.getUniformLocation(_vf.m_shader, "ctex[0]");
		gl.uniform1i(L_shTex, 0);
		if (_vf.GetUniform("ctexCound") != null)
		{
			this.SetValue(_vf, "ctexCound", 1.0);
		}
	}
	else
	{
		for (var i = 0; i < _textureOff.length; ++i)
		{

			gl.activeTexture(gl.TEXTURE0+i);
			var tex = null;
			tex=CRes.get(_texture[_textureOff[i]]);
			if(tex==null)
				continue;
			gl.bindTexture(gl.TEXTURE_2D, tex.GetGBuf());
			this.SetTextureOption(tex.GetFilter(),tex.GetWrap(),tex.GetMipMap());
			var str="ctex[";
			str += i+"]";
			var L_shTex = gl.getUniformLocation(_vf.m_shader, str);
			gl.uniform1i(L_shTex, i);
			
		}
		if (_vf.GetUniform("ctexCound") != null)
		{
			this.SetValue(_vf, "ctexCound", _textureOff.length);
		}
	}
	
	
}
CRenderMgrGL.prototype.SetLight=function(_vf,_dir,_color,_offset)
{
	if(typeof _dir == 'undefined')
		_dir  =new CVec3(0,1,0);
	if(typeof _color == 'undefined')
		_color  =new CVec3(1,1,1);
	if(typeof _offset == 'undefined')
		_offset  =0;
	
	this.SetValue(_vf, "ligDirect", _dir);
	this.SetValue(_vf, "ligColor", _color);
}
CRenderMgrGL.prototype.SetMaterial=function(_vf,_mat)
{
	this.SetValue(_vf, "maDiffuse", _mat.diffuse);
	this.SetValue(_vf, "maAmbient", _mat.ambient);
	this.SetValue(_vf, "maSpecular", _mat.specular);
	this.SetValue(_vf, "maPower", _mat.power);
}
CRenderMgrGL.prototype.SetTextureOption=function(_f,_w,_m)
{
	if (_w == DfTexture.Mirrored)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	}
	else if (_w == DfTexture.Repeat)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}



	if (_f == DfTexture.Linear)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		if (_m)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		if (_m)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
	}
}

