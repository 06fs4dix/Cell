

var DefferredDirectLight=1;
var ForwardDirectLight=1;
var VoxelLight=40;
var TexMax=8;
var BoneMax=100;
var InstanceMax = 50;
function CShader() 
{
	
}
CShader.prototype.constructor	=CShader;

function CShaderGL() 
{
	var m_com=null;

	var m_glC=null;
	var m_glA=null;
	
	var All=null;
	var Vs=null;
	var Ps=null;
}
CShaderGL.prototype=new CShader();
CShaderGL.prototype.constructor	=CShaderGL;

CShaderGL.prototype.Init=function()
{
	
	var max_v_uniforms = 0;
	var max_f_uniforms = 0;
	var texture_units;

	//한개당 4개벡터 기준이다! 1024 나오면 총 CVec4 1024개 쓴다
	max_v_uniforms=gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
	max_f_uniforms=gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
	texture_units=gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	
	
	
	var minUni= max_v_uniforms;
	if (minUni > max_f_uniforms)
		minUni = max_f_uniforms;
	VoxelLight = minUni-(16);
	BoneMax = minUni / 4-(8);
	
	for (var i = 256; ; --i)
	{
		var val = i*16+ i*4+ i*4+12+12;
		InstanceMax = i;
		if (val < minUni*4)
			break;
	}
	
	
	
	
	
	
	
	
	m_com=new Array();
	m_glC=new Array();
	m_glA="";
	All="";
	Vs="";
	Ps="";
	
	m_glC.push_back(new CPairStrStr("CVec2", "vec2"));
	m_glC.push_back(new CPairStrStr("CVec3", "vec3"));
	m_glC.push_back(new CPairStrStr("CVec4", "vec4"));
	m_glC.push_back(new CPairStrStr("CMat3", "mat3"));
	m_glC.push_back(new CPairStrStr("CMat", "mat4"));
	m_glC.push_back(new CPairStrStr("Vec3Normalize", "normalize"));
	m_glC.push_back(new CPairStrStr("Vec3Dot", "dot"));
	
	if (CRoot.m_renderer == DfRen.GL_H)
		BoneMax = 100;
	else
		BoneMax = 10;
	
	m_glC.push_back(new CPairStrStr("DefferredDirectLight", DefferredDirectLight));
	m_glC.push_back(new CPairStrStr("ForwardDirectLight", ForwardDirectLight));
	m_glC.push_back(new CPairStrStr("TexMax", TexMax));
	m_glC.push_back(new CPairStrStr("VoxelLight", VoxelLight));
	m_glC.push_back(new CPairStrStr("BoneMax", BoneMax));
	m_glC.push_back(new CPairStrStr("InstanceMax", InstanceMax));
	


	m_glC.push_back(new CPairStrStr("DfShaBuf.Pos", "0"));
	m_glC.push_back(new CPairStrStr("DfShaBuf.Nor", "1"));
	m_glC.push_back(new CPairStrStr("DfShaBuf.Dif", "2"));
	m_glC.push_back(new CPairStrStr("DfShaBuf.Sha", "3"));
	m_glC.push_back(new CPairStrStr("DfShaBuf.Mat", "4"));
 	

	
	m_glA += "int GetInt(float _val)\n";
	m_glA += "{\n";
	m_glA += "	return int(_val+0.5);\n";
	m_glA += "}\n";
	
	m_glA += "vec3 VecToTex(vec3 vec)\n";
	m_glA += "{\n";
	m_glA += "	return 0.5*vec+0.5;\n";
	m_glA += "}\n";
	m_glA += "vec4 VecToTex(vec4 vec)\n";
	m_glA += "{\n";
	m_glA += "	return 0.5*vec+0.5;\n";
	m_glA += "}\n";
	m_glA += "vec4 TexToVec(vec4 tex)\n";
	m_glA += "{\n";
	m_glA += "	return 2.0*tex-1.0;\n";
	m_glA += "}\n";
	m_glA += "vec3 TexToVec(vec3 tex)\n";
	m_glA += "{\n";
	m_glA += "	return 2.0*tex-1.0;\n";
	m_glA += "}\n";
	
	
	m_glA += "float Max(float a, float b)\n";
	m_glA += "{\n";
	m_glA += "	if(a<b)\n";
	m_glA += "		return b;\n";
	m_glA += "	return a;\n";
	m_glA += "}\n";
	
	m_glA += "vec4 LWVPMul(vec3 pa_local,mat4 world,mat4 view,mat4 proj)\n";
	m_glA += "{\n";
	m_glA += "	return proj*view*world*vec4(pa_local,1.0);\n";
	m_glA += "}\n";
	
	m_glA += "mat3 Mat4ToMat3(mat4 val0)\n";
	m_glA += "{\n";
	m_glA += "	mat3 mats;\n";
	m_glA += "	mats[0][0]=val0[0][0];mats[0][1]=val0[0][1];mats[0][2]=val0[0][2];\n";
	m_glA += "	mats[1][0]=val0[1][0];mats[1][1]=val0[1][1];mats[1][2]=val0[1][2];\n";
	m_glA += "	mats[2][0]=val0[2][0];mats[2][1]=val0[2][1];mats[2][2]=val0[2][2];\n";
	m_glA += "	return mats;\n";
	m_glA += "}\n";


	m_glA += "mat4 Mul(mat4 pa_mat0,mat4 pa_mat1)\n";
	m_glA += "{\n";
	m_glA += "	return pa_mat1*pa_mat0;\n";
	m_glA += "}\n";

	m_glA += "vec4 Mul(vec4 pa_val,mat4 pa_mat)\n";
	m_glA += "{\n";
	m_glA += "	return pa_mat*pa_val;\n";
	m_glA += "}\n";

	m_glA += "vec4 Mul(vec3 pa_val,mat4 pa_mat)\n";
	m_glA += "{\n";
	m_glA += "	return pa_mat*vec4(pa_val,1.0);\n";
	m_glA += "}\n";

	m_glA += "vec3 Mul(vec3 pa_val,mat3 pa_mat)\n";
	m_glA += "{\n";
	m_glA += "	return pa_mat*pa_val;\n";
	m_glA += "}\n";

	m_glA += "mat4 Mul(float pa_val,mat4 pa_mat)\n";
	m_glA += "{\n";
	m_glA += "	return pa_mat*pa_val;\n";
	m_glA += "}\n";
	
	m_glA += "float Saturate(float pa_val)\n";
	m_glA += "{\n";
	m_glA += "	if(pa_val>1.0)\n";
	m_glA += "		pa_val=1.0;\n";
	m_glA += "	return pa_val;\n";
	m_glA += "}\n";

	m_glA += "vec3 Saturate(vec3 pa_val)\n";
	m_glA += "{\n";
	m_glA += "	if(pa_val.x>1.0)\n";
	m_glA += "		pa_val.x=1.0;\n";
	m_glA += "	if(pa_val.y>1.0)\n";
	m_glA += "		pa_val.y=1.0;\n";
	m_glA += "	if(pa_val.z>1.0)\n";
	m_glA += "		pa_val.z=1.0;\n";
	m_glA += "	return pa_val;\n";
	m_glA += "}\n";

	m_glA += "vec4 Saturate(vec4 pa_val)\n";
	m_glA += "{\n";
	m_glA += "	if(pa_val.x>1.0)\n";
	m_glA += "		pa_val.x=1.0;\n";
	m_glA += "	if(pa_val.y>1.0)\n";
	m_glA += "		pa_val.y=1.0;\n";
	m_glA += "	if(pa_val.z>1.0)\n";
	m_glA += "		pa_val.z=1.0;\n";
	m_glA += "	if(pa_val.w>1.0)\n";
	m_glA += "		pa_val.w=1.0;\n";
	m_glA += "	return pa_val;\n";
	m_glA += "}\n";
	
	m_glA += "vec4 RGBAAdd(vec4 _a,vec4 _b)\n";
	m_glA += "{\n";
	m_glA += "	_a.x+=_b.x;\n";
	m_glA += "	_a.y+=_b.y;\n";
	m_glA += "	_a.z+=_b.z;\n";
	m_glA += "	_a.w+=_b.w;\n";
	m_glA += "	if(_a.x>1.0)\n";
	m_glA += "		_a.x=1.0;\n";
	m_glA += "	if(_a.y>1.0)\n";
	m_glA += "		_a.y=1.0;\n";
	m_glA += "	if(_a.z>1.0)\n";
	m_glA += "		_a.z=1.0;\n";
	m_glA += "	if(_a.w>1.0)\n";
	m_glA += "		_a.w=1.0;\n";
	m_glA += "	return _a;\n";
	m_glA += "	if(_a.x<0.0)\n";
	m_glA += "		_a.x=0.0;\n";
	m_glA += "	if(_a.y<0.0)\n";
	m_glA += "		_a.y=0.0;\n";
	m_glA += "	if(_a.z<0.0)\n";
	m_glA += "		_a.z=0.0;\n";
	m_glA += "	if(_a.w<0.0)\n";
	m_glA += "		_a.w=0.0;\n";
	m_glA += "	return _a;\n";
	m_glA += "}\n";
}
CShaderGL.prototype.AddStr=function(_str,_mode)
{
	switch (_mode)
	{
	case 0:
		All += _str;
		break;
	case 1:
		Vs += _str;
		break;
	case 2:
		Ps += _str;
		break;
	}
}
CShaderGL.prototype.Compile=function(_text,_vf)
{
	//alert("test");
	_text = _text.replaceAll("\n","");
	_text = _text.replaceAll("\r", "");

	var mode = 0;
	All += m_glA;
	//단순 치환 작업 먼저함
	for (var i = 0; i<m_glC.length; ++i)
	{
		_text = _text.replaceAll(m_glC[i].first, m_glC[i].second);
	}

	var sp = _text.split(";");
	var texCount = 0;
	for (var i = 0; i < sp.length; ++i)
	{
		if (sp[i].indexOf("CTexture") != -1)
		{
			if (sp[i].indexOf("ctex") == -1)
			{
				CMsg.E("ctex not def");
			}
			this.AddStr("uniform sampler2D ctex[8];\n", mode);
			texCount++;
		}
		else if (sp[i].indexOf("Tex2D") != -1)
		{
			var stt2 = sp[i].indexOf("Tex2D(");


			var st = sp[i].indexOf("ctex[");
			var ed = sp[i].indexOf("],");
			var cut = sp[i].substr(st + 5, ed - st - 5);
			cut = cut.replaceAll(" ", "");


			var dum = sp[i].substr(0, stt2);
			dum += "GetTex(" + cut;
			dum += sp[i].substr(ed + 1, sp[i].lenght) + ";\n";
			this.AddStr(dum, mode);
		}
		else if (sp[i].indexOf("SetCol") != -1)
		{
			var inStr = sp[i].substr(sp[i].indexOf("SetCol(") + 7, sp[i].lastIndexOf(")") - sp[i].indexOf("SetCol(") - 7);
			this.AddStr(sp[i].substr(0, sp[i].indexOf("SetCol(") ),mode);
			this.AddStr("{\ngl_FragColor=" + inStr + ";\nreturn;\n}\n",mode);
		}
		else if (sp[i].indexOf("SetPos") != -1)
		{
			var inStr = sp[i].substr(sp[i].indexOf("SetPos(") + 7, sp[i].lastIndexOf(")") - sp[i].indexOf("SetPos(") - 7);
			this.AddStr(sp[i].substr(0, sp[i].indexOf("SetPos(")),mode);
			this.AddStr("\n	gl_Position=" + inStr + ";\n",mode);
		}
		else if (sp[i].indexOf("m_Shader") != -1)
		{
			var inStr = sp[i].substr(sp[i].indexOf("(")+1, sp[i].lastIndexOf(")") - sp[i].indexOf("(")-1);
			inStr = inStr.substr(inStr.indexOf("\"")+1, inStr.lastIndexOf("\"") - inStr.indexOf("\"")-1);
			_vf.m_key = inStr;
		}
		else if (sp[i].indexOf("m_VSFormat") != -1)
		{

			var inStr = sp[i].substr(sp[i].indexOf("(") + 1, sp[i].lastIndexOf(")")- sp[i].indexOf("(") - 1);

			var formatCount = new Array(DfVertexType.Count);
			
			var v0 = inStr.split(",");

			for (var j = 0; j < v0.length; ++j)
			{
				if(v0[j].length==0)
					continue;
				var vf=new CVertexFormatData();
				vf.Parsing(v0[j], formatCount);
				_vf.m_data.push_back(vf);
				this.AddStr("attribute " + vf.DataTypeAddCount() + " " + vf.text + ";\n",1);
			}
		}
		else if (sp[i].indexOf("m_PSFormat") != -1)
		{
			var inStr = sp[i].substr(sp[i].indexOf("(") + 1, sp[i].lastIndexOf(")") - sp[i].indexOf("(") - 1);


			var formatCount = new Array(DfVertexType.Count);
			
			var v0 = inStr.split(",");
			var vfd=new Array();



			for (var j = 0; j < v0.length; ++j)
			{
				if(v0[j].length==0)
					continue;
				var vf=new CVertexFormatData();
				vf.Parsing(v0[j], formatCount);
				vfd.push_back(vf);
				this.AddStr("varying " + vf.DataTypeAddCount() +" "+ vf.text + ";\n",mode);
			}


		}
		else if (sp[i].indexOf("m_VSBegin") != -1)
		{
			mode = 1;
			this.AddStr(sp[i].replaceAll("m_VSBegin",""),mode);
			this.AddStr("\nvoid main()",mode);
		}
		else if (sp[i].indexOf("m_PSBegin") != -1)
		{
			mode = 2;
			
			var gettexStr="";
			
			
			
			gettexStr += "vec4 GetTex(float _off,vec2 _uv)\n";
			gettexStr += "{\n";
			for (var j = 0; j < TexMax; ++j)
			{
				gettexStr += "	if(_off-0.5<=" + j + ".0)";
				gettexStr += "		return texture2D(ctex[" + j + "],_uv);\n";
			}
			gettexStr += "	return vec4(0,0,0,1);\n";
			gettexStr += "}\n";
			
			gettexStr += "vec4 GetTex(int _off,vec2 _uv)\n";
			gettexStr += "{\n";
			gettexStr += "	return GetTex(float(_off),_uv);\n";
			gettexStr += "}\n";
			
			this.AddStr(gettexStr, mode);
			
			
			this.AddStr(sp[i].replaceAll("m_PSBegin", ""),mode);
			this.AddStr("\nvoid main()",mode);
		}
		else if (sp[i].indexOf("m_End") != -1)
		{
			this.AddStr(sp[i].replaceAll("m_End", "")+"\n",mode);
			mode = 0;
		}
		else if (sp[i].indexOf("uniform") != -1)
		{
			var arr = sp[i].split(" ");
			var arrChk="";
			if (arr[2].indexOf("[") != -1)
			{
				arr[2] = arr[2].substr(0, arr[2].indexOf("["));
			}
			_vf.m_uniform.push_back(new CUniform(_vf.m_uniform.size(),arr[1], arr[2]));
			
			this.AddStr(sp[i] + ";\n", mode);
		}
		else if(sp[i].length!=0)
			this.AddStr(sp[i]+";\n",mode);
	}
	
	if (CRoot.m_platform == 1)
		All = "precision highp float;"+All;
	
//	var texStr = "sampler2D GetTex(float _off){\n";
//	for (var i = 0; i < texCount; ++i)
//	{
//		texStr += "if(_off>="+i+"-0.5 && _off<="+i+"+0.5)		return ctex"+i+";\n";
//	}
//	texStr += "return ctex0;	\n}\n";
//	this.AddStr(texStr, 0);
	
	
	var L_vs = gl.createShader(gl.VERTEX_SHADER);
	var L_fs = gl.createShader(gl.FRAGMENT_SHADER);
	var L_all_sh = gl.createProgram();
	Vs = All + Vs;
	gl.shaderSource(L_vs,Vs);
	gl.compileShader(L_vs);
	var compiled = gl.getShaderParameter(L_vs, gl.COMPILE_STATUS);
	if (!compiled) 
	{
		var lastError = gl.getShaderInfoLog(L_vs);
		CMsg.E("vs\n\n"+lastError+"\n\n"+Vs);
		
	}
	
	
	Ps = All + Ps;
	gl.shaderSource(L_fs,Ps);
	gl.compileShader(L_fs);
	var compiled = gl.getShaderParameter(L_fs, gl.COMPILE_STATUS);
	if (!compiled) 
	{
		var lastError = gl.getShaderInfoLog(L_fs);
		CMsg.E("ps\n\n"+lastError+"\n\n"+Ps);
		
	}
	gl.attachShader(L_all_sh, L_vs);
	gl.attachShader(L_all_sh, L_fs);
	for (var i = 0; i < _vf.m_data.length; ++i)
	{
		gl.bindAttribLocation(L_all_sh, i, _vf.m_data[i].text);
	}
	gl.linkProgram(L_all_sh);
  if (!gl.getProgramParameter(L_all_sh, gl.LINK_STATUS)) {
      alert("Could not initialise shaders\n");
      alert(Vs);
      alert(Ps);
  }
	
	_vf.m_shader = L_all_sh;
	_vf.m_vs = L_vs;
	_vf.m_ps = L_fs;
	
	for (var i = 0; i < _vf.m_uniform.size(); ++i)
	{
		var L_word = gl.getUniformLocation(_vf.m_shader, _vf.m_uniform[i].name);
		_vf.m_uniform[i].data = L_word;
	}
	
	All = "";
	Vs = "";
	Ps = "";
}
