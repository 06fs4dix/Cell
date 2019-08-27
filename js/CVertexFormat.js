function JSDfDataType()
{
	this.Byte = 0;
	this.Float = 1;
	this.Int = 2;
	this.Count = 3;
	this.Null = 4;
};
var DfDataType=new JSDfDataType();


function JSDfVertexType()
{
	this.Vertex = 0;
	this.Uv = 1;
	this.Normal = 3;
	this.Weight = 4;
	this.WeightIndex = 5;
	this.Color = 6;
	this.Ref = 7;
	this.Tangent = 8;
	this.Binormal = 9;
	this.Count = 10;
	this.Null = 11;
};

var DfVertexType=new JSDfVertexType();

function CVertexFormatData()
{
	this.text=null;
	this.eachSize=0;//각각에 사이즈
	this.eachCount=0;//몇개 있는지

	this.dataType= DfDataType.Null;//데이터 타임
	
	this.identifier = DfVertexType.Null;
	this.identifierCount = 0;//그래픽 타입 곗수
}
var g_bufMap=new Map();
CVertexFormatData.prototype.WebArray=function(_buf,_size)
{
	var arr=null;
	if (this.dataType == DfDataType.Float)
	{
		arr=g_bufMap.get(this.text+_size);
		if(arr==null)
		{
			arr=new Float32Array(this.eachCount*_size);
			g_bufMap.set(this.text+_size,arr);
		}
			
	}
		
	else
		CMsg.E("error");
	if(_buf==null)
		return arr;
	
	for(var i=0;i<_size;++i)
	{
		if(_buf[i] instanceof CVec3)
		{
			arr[i*3+0]=_buf[i].x;
			arr[i*3+1]=_buf[i].y;
			arr[i*3+2]=_buf[i].z;
		}
		else if(_buf[i] instanceof CVec2)
		{
			arr[i*2+0]=_buf[i].x;
			arr[i*2+1]=_buf[i].y;
		}
		else if(_buf[i] instanceof CVec4)
		{
			arr[i*4+0]=_buf[i].x;
			arr[i*4+1]=_buf[i].y;
			arr[i*4+2]=_buf[i].z;
			arr[i*4+3]=_buf[i].w;
		}
		else
			CMsg.E("error");
	}
	
	return arr;
}
CVertexFormatData.prototype.SysDataType=function()
{
	if (this.dataType != DfDataType.Float)
		return gl.UNSIGNED_BYTE;
	return gl.FLOAT;
}
CVertexFormatData.prototype.DataFormatType=function()
{
	return 0;
}
CVertexFormatData.prototype.DataTypeAddCount=function()
{
	if (this.dataType == DfDataType.Float)
	{
		switch (this.eachCount)
		{
		case 4:
			return "vec4";
		case 3:
			return "vec3";
		case 2:
			return "vec2";
		case 1:
			return "float";
		}
	}

	CMsg.E("error!");
	return "Null";
}
CVertexFormatData.prototype.EachAllSize=function()
{
	return this.eachSize * this.eachCount;
}
CVertexFormatData.prototype.Parsing=function(_str,_vfCount)
{
	this.text = _str;
	var list = _str.split("_");
	if (list[0].indexOf("f4") != -1)
	{
		this.dataType = DfDataType.Float;
		this.eachCount = 4;
		this.eachSize = 4;
	}
	else if (list[0].indexOf("f3") != -1)
	{
		this.dataType = DfDataType.Float;
		this.eachCount = 3;
		this.eachSize = 4;
	}
	else if (list[0].indexOf("f2") != -1)
	{
		this.dataType = DfDataType.Float;
		
		this.eachCount = 2;
		this.eachSize = 4;
	}
	else if (list[0].indexOf("f1") != -1)
	{
		this.dataType = DfDataType.Float;
		
		this.eachCount = 1;
		this.eachSize = 4;
	}
	else if (list[0].indexOf("b4") != -1)
	{
		this.dataType = DfDataType.Float;
	
		this.eachCount = 4;
		this.eachSize = 1;
	}
	
	if (list[1].indexOf("ver") != -1)
	{
		this.identifier = DfVertexType.Vertex;
		this.identifierCount = _vfCount[DfVertexType.Vertex];
		_vfCount[DfVertexType.Vertex]++;
	}
	else if (list[1].indexOf("uv") != -1)
	{
		this.identifier = DfVertexType.Uv;
		this.identifierCount = _vfCount[DfVertexType.Uv];
		_vfCount[DfVertexType.Uv]++;
	}
	else if (list[1].indexOf("col") != -1)
	{
		this.identifier = DfVertexType.Color;
		this.identifierCount = _vfCount[DfVertexType.Color];
		_vfCount[DfVertexType.Color]++;
	}
	else if (list[1].indexOf("wi") != -1)
	{
		this.identifier = DfVertexType.WeightIndex;
		this.identifierCount = _vfCount[DfVertexType.WeightIndex];
		_vfCount[DfVertexType.WeightIndex]++;
	}
	else if (list[1].indexOf("we") != -1)
	{
		this.identifier = DfVertexType.Weight;
		this.identifierCount = _vfCount[DfVertexType.Weight];
		_vfCount[DfVertexType.Weight]++;
	}
	else if (list[1].indexOf("nor") != -1)
	{
		this.identifier = DfVertexType.Normal;
		this.identifierCount = _vfCount[DfVertexType.Normal];
		_vfCount[DfVertexType.Normal]++;
	}
	else if (list[1].indexOf("tan") != -1)
	{
		this.identifier = DfVertexType.Tangent;
		this.identifierCount = _vfCount[DfVertexType.Tangent];
		_vfCount[DfVertexType.Tangent]++;
	}
	else if (list[1].indexOf("bi") != -1)
	{
		this.identifier = DfVertexType.Binormal;
		this.identifierCount = _vfCount[DfVertexType.Binormal];
		_vfCount[DfVertexType.Binormal]++;
	}
	else if (list[1].indexOf("ref") != -1)
	{
		this.identifier = DfVertexType.Ref;
		this.identifierCount = _vfCount[DfVertexType.Ref];
		_vfCount[DfVertexType.Ref]++;
	}
}
class CUniform
{
	constructor(_offset,_value,_name)
	{
		this.count = 1;
		this.offset = _offset;
		this.value=_value;
		this.name=_name;
		this.data=null;
	}
};
//=============================================================================
function CVertexFormat()
{
	this.m_key;
	this.m_shader;
	this.m_vs;
	this.m_ps;
	this.m_data=new Array();
	this.m_uniform=new Array();
	this.vertexAllSize = 0;
};
CVertexFormat.prototype.GetUniform=function(_name)
{
	for (var i = 0; i < this.m_uniform.size(); ++i)
	{
		if (this.m_uniform[i].name.equals(_name))
		{
			return this.m_uniform[i];
		}
	}
	return null;
}