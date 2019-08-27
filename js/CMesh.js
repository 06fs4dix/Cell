function CIndex()
{
	this.f16t32 = false;
	this.buf = null;
};
CIndex.prototype.CreateBuf16=function(_size)
{
	this.f16t32 = false;
	this.buf = new Uint16Array(_size*3);
	for (var i = 0; i < _size * 3; ++i)
	{
		this.buf[i] = 0;
	}
}
CIndex.prototype.CreateBuf32=function(_size)
{
	this.f16t32 = true;
	this.buf = new Uint32Array(_size*3);
	for (var i = 0; i < _size * 3; ++i)
	{
		this.buf[i] = 0;
	}
}
CIndex.prototype.ChangeBuf=function(_size)
{
	if (f16t32)
	{
		var dum = new Uint16Array(_size*3);
		for (var i = 0; i < _size * 3; ++i)
		{
			dum[i] = buf[i];
		}
		buf = dum;
	}
	else
	{
		var dum = new Uint32Array(_size*3);
		for (var i = 0; i < _size * 3; ++i)
		{
			dum[i] = buf[i];
		}
		buf = dum;
	}
}
//호환성 위해서 만듬
CIndex.prototype.Index16PT_Get=function()	{	return this.buf;	}
CIndex.prototype.Index32PT_Get=function()	{	return this.buf;	}
CIndex.prototype.Index16Pt_Get=function()	{	return this.buf;	}
CIndex.prototype.Index32Pt_Get=function()	{	return this.buf;	}
CIndex.prototype.GetBuf=function()	{	return this.buf;	}

function CKeyFrame()
{
	this.key=0;
	this.value=new CVec3();
};
function CMeshData()
{
	this.ci=null;
	
	this.vInfo=null;
	this.vGBuf = null;
	this.vGBufEx = null;//오픈지엘 더미 담겨있다 파서펑션에서 확인해라

	this.iInfo=new CIndex();//opengl은 밑에 인덱스 버퍼랑 가리키는 곳이 똑같다
	this.iBuf=null;

	this.iNum=0;
	this.vNum=0;
	
	this.keyFramePos=new Array();
	this.keyFrameRot=new Array();
	this.keyFrameSca=new Array();
	
	
	this.textureOff=new Array();
};
CMeshData.prototype.FindKeyFrame=function(_key,_keyFrameVec)
{
	var off = 0;
	for (var i = 0; i < _keyFrameVec.size(); ++i)
	{
		if (_key == _keyFrameVec[i].key)
			return _keyFrameVec[i];
		else if (_key < _keyFrameVec[i].key)
		{
			off = i;
			break;
		}
		
	}
	var keyframe=new CKeyFrame();
	keyframe.key = _key;
	_keyFrameVec.splice(off,0, keyframe);
	return _keyFrameVec[off];
}
function CMaterial()
{
	this.ambient=new CVec3(0.2,0.2,0.2);//주변광//2012.10.08 1.0으로 고정으로 변경
	this.diffuse=new CVec3(1,1,1);//확산광
	this.specular=new CVec3(0.5,0.5,0.5);//반사광
	this.emissive=new CVec3();//방출광
	this.power=0;
};
function CMeshNode(_md,_mpi)
{
	this.md=_md;
	this.mpi=_mpi;
	this.sum=new CMat();
}
function CWeightMat()
{
	this.mat=new CMat();
	this.target=new Array();
}
var MeshBoneMax=100;
function CMeshCreateInfo()
{
	this.name="";
	this.vertexCount = 0;
	this.indexCount = 0;
	this.indexShort = true;
	this.vertex=new CFloatArray();
	this.index=new CFloatArray();
	this.normal=new CFloatArray();
	this.tangent=new CFloatArray();
	this.binormal=new CFloatArray();
	this.texOff=new CFloatArray();
	
	
	this.uv=new CFloatArray()
	this.uvIndex=new CFloatArray();
	this.weight=new CFloatArray();
	this.weightIndex=new CFloatArray();
	this.color=new CFloatArray();
	//vector<float> color;
	//var mat;
	this.pos=new CVec3();
	this.sca =new CVec3(1, 1, 1);
	this.rot=new CVec3();
	//this.texNum=new Array();
	//this.matNum=new Array();
	
}
function CMeshCopyInfo()
{
	
	this.bpos=new CVec3();
	this.brot=new CVec3();
	this.bsca=new CVec3();
	
	this.pos=new CVec3();
	this.rot=new CVec3();
	this.sca=new CVec3();
	this.pst=new CMat();
}
CMeshCopyInfo.prototype.PRSReset=function()
{
	var scaMat=new CMat();
	var rotMat=new CMat();
	scaMat = CMath.MatScale(this.sca);
	rotMat = CMath.QutToMatrix(CMath.EulerToQut(this.rot));

	this.pst = CMath.MatMul(scaMat, rotMat);


	//CMat mat;
	this.pst.arr[3][0] = this.pos.x;
	this.pst.arr[3][1] = this.pos.y;
	this.pst.arr[3][2] = this.pos.z;
}
var MeshBoneMat=100;
function CMesh()
{
	this.uvIndexMode=false;
	this.uvRevers=false;
	this.meshTree=new CTree();

	this.material=new Array();//메터리얼 텍스처 한세트이다
	this.texture=new Array();//사용법은 메쉬에서 메터리얼 텍스처 번호를 참조해서 불러오기 때문이다
	this.weightName=new Array();
	this.weightMat=new Array();
	this.weightCopyMat=new Float32Array();
	this.vf=null;
	this.skin=false;
	
};
CMesh.prototype.SetWeightMat=function(_off,_tar)
{
	for (var y = 0; y < 4; ++y)
	{
		for (var x = 0; x < 4; ++x)
		{
			this.weightCopyMat[_off * 4 * 4 + x + y * 4] = _tar.arr[y][x];
		}
	}
}