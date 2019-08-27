function CMeshMgr() 
{
}
CMeshMgr.prototype.constructor	=CMeshMgr;
CMeshMgr.prototype.GetPlane=function(_plane)
{
	var rVal=new CMeshCreateInfo();
	var nor = _plane.GetNormal();

	var dir=new CVec3();
	dir.x =1- CMath.Abs(_plane.x);
	dir.y = 1 - CMath.Abs(_plane.y);
	dir.z = 1 - CMath.Abs(_plane.z);

	var  mdir = CMath.Vec3MulFloat(dir,-1);
	var  cro = CMath.Vec3Cross(nor,dir);
	var  mcro = CMath.Vec3MulFloat(cro, -1);

	
	mdir = CMath.Vec3MulFloat(mdir, _plane.w);
	cro = CMath.Vec3MulFloat(cro, _plane.w);
	mcro = CMath.Vec3MulFloat(mcro, _plane.w);
	dir = CMath.Vec3MulFloat(dir, _plane.w);

	rVal.vertex.Push(mdir);
	rVal.vertex.Push(mcro);
	rVal.vertex.Push(dir);
	rVal.vertex.Push(cro);
	rVal.vertex.Push(mdir);
	rVal.vertex.Push(dir);

	var uv = 
	[
		new CVec2(0,0),new CVec2(1,0) ,new CVec2(1,1),
		new CVec2(0,1),new CVec2(0,0) ,new CVec2(1,1)
	];
	
	rVal.uv.Push(uv[0]);
	rVal.uv.Push(uv[1]);
	rVal.uv.Push(uv[2]);
	rVal.uv.Push(uv[3]);
	rVal.uv.Push(uv[4]);
	rVal.uv.Push(uv[5]);

	rVal.normal.Push(nor);
	rVal.normal.Push(nor);
	rVal.normal.Push(nor);
	rVal.normal.Push(nor);
	rVal.normal.Push(nor);
	rVal.normal.Push(nor);

	rVal.vertexCount = 6;
	

	return rVal;
}
CMeshMgr.prototype.GetBox=function(_size)
{
	var rVal=new CMeshCreateInfo();
	rVal.vertex.Push(new CVec3(-_size, _size, -_size));
	rVal.vertex.Push(new CVec3(_size, _size, -_size));
	rVal.vertex.Push(new CVec3(_size, _size, _size));
	rVal.vertex.Push(new CVec3(-_size, _size, _size));


	rVal.vertex.Push(new CVec3(-_size, -_size, -_size));
	rVal.vertex.Push(new CVec3(_size, -_size, -_size));
	rVal.vertex.Push(new CVec3(_size, -_size, _size));
	rVal.vertex.Push(new CVec3(-_size, -_size, _size));


	rVal.vertex.Push(new CVec3(-_size, -_size, _size));
	rVal.vertex.Push(new CVec3(-_size, -_size, -_size));
	rVal.vertex.Push(new CVec3(-_size, _size, -_size));
	rVal.vertex.Push(new CVec3(-_size, _size, _size));


	rVal.vertex.Push(new CVec3(_size, -_size, _size));
	rVal.vertex.Push(new CVec3(_size, -_size, -_size));
	rVal.vertex.Push(new CVec3(_size, _size, -_size));
	rVal.vertex.Push(new CVec3(_size, _size, _size));

	rVal.vertex.Push(new CVec3(-_size, -_size, -_size));
	rVal.vertex.Push(new CVec3(_size, -_size, -_size));
	rVal.vertex.Push(new CVec3(_size, _size, -_size));
	rVal.vertex.Push(new CVec3(-_size, _size, -_size));

	rVal.vertex.Push(new CVec3(-_size, -_size, _size));
	rVal.vertex.Push(new CVec3(_size, -_size, _size));
	rVal.vertex.Push(new CVec3(_size, _size, _size));
	rVal.vertex.Push(new CVec3(-_size, _size, _size));


	//rVal.normal.push_back(CVec3(0, 1, 0));
	//rVal.normal.push_back(CVec3(0, 1, 0));
	//rVal.normal.push_back(CVec3(0, 1, 0));
	//rVal.normal.push_back(CVec3(0, 1, 0));

	//rVal.normal.push_back(CVec3(0, -1, 0));
	//rVal.normal.push_back(CVec3(0, -1, 0));
	//rVal.normal.push_back(CVec3(0, -1, 0));
	//rVal.normal.push_back(CVec3(0, -1, 0));

	//rVal.normal.push_back(CVec3(1, 0, 0));
	//rVal.normal.push_back(CVec3(1, 0, 0));
	//rVal.normal.push_back(CVec3(1, 0, 0));
	//rVal.normal.push_back(CVec3(1, 0, 0));

	//for (int i = 0; i<3 * 4; ++i)
	//{
	//	rVal.normal.push_back(CVec3(0, 0, 0));
	//}

	for (var i=0;i<rVal.vertex.Size(3);++i)
	{
		rVal.normal.Push(CMath.Vec3Normalize(each0));
	}


	rVal.uv.Push(new CVec2(0, 0));
	rVal.uv.Push(new CVec2(1, 0));
	rVal.uv.Push(new CVec2(1, 1));
	rVal.uv.Push(new CVec2(0, 1));

	rVal.uv.Push(new CVec2(0, 0));
	rVal.uv.Push(new CVec2(1, 0));
	rVal.uv.Push(new CVec2(1, 1));
	rVal.uv.Push(new CVec2(0, 1));

	rVal.uv.Push(new CVec2(0, 0));
	rVal.uv.Push(new CVec2(1, 0));
	rVal.uv.Push(new CVec2(1, 1));
	rVal.uv.Push(new CVec2(0, 1));

	rVal.uv.Push(new CVec2(0, 0));
	rVal.uv.Push(new CVec2(1, 0));
	rVal.uv.Push(new CVec2(1, 1));
	rVal.uv.Push(new CVec2(0, 1));

	rVal.uv.Push(new CVec2(0, 0));
	rVal.uv.Push(new CVec2(1, 0));
	rVal.uv.Push(new CVec2(1, 1));
	rVal.uv.Push(new CVec2(0, 1));

	rVal.uv.Push(new CVec2(0, 0));
	rVal.uv.Push(new CVec2(1, 0));
	rVal.uv.Push(new CVec2(1, 1));
	rVal.uv.Push(new CVec2(0, 1));

	rVal.vertexCount = 24;

	rVal.index.push_back(3);
	rVal.index.push_back(1);
	rVal.index.push_back(0);

	rVal.index.push_back(2);
	rVal.index.push_back(1);
	rVal.index.push_back(3);


	rVal.index.push_back(6);
	rVal.index.push_back(4);
	rVal.index.push_back(5);

	rVal.index.push_back(7);
	rVal.index.push_back(4);
	rVal.index.push_back(6);

	rVal.index.push_back(11);
	rVal.index.push_back(9);
	rVal.index.push_back(8);

	rVal.index.push_back(10);
	rVal.index.push_back(9);
	rVal.index.push_back(11);

	rVal.index.push_back(14);
	rVal.index.push_back(12);
	rVal.index.push_back(13);

	rVal.index.push_back(15);
	rVal.index.push_back(12);
	rVal.index.push_back(14);

	rVal.index.push_back(19);
	rVal.index.push_back(17);
	rVal.index.push_back(16);

	rVal.index.push_back(18);
	rVal.index.push_back(17);
	rVal.index.push_back(19);

	rVal.index.push_back(22);
	rVal.index.push_back(20);
	rVal.index.push_back(21);

	rVal.index.push_back(23);
	rVal.index.push_back(20);
	rVal.index.push_back(22);

	rVal.indexCount = 36;

	return rVal;
}
CMeshMgr.prototype.MeshCreateModifyMesh=function(mesh,_vf)
{
	mesh.vf=_vf;
	for (var each0 of _vf.m_data)
	{
		if (DfVertexType.Weight == each0.identifier)
		{
			mesh.skin = true;
			if (mesh.weightMat.empty())
			{
				CMsg.E("skin mesh plz!");
//				mesh.weightMat.push_back(new CWeightMat());
//				mesh.weightCopyMat=new Float32Array(16);
			}
			break;
		}
		
	}
	var node=new Array();
	node.push_back(mesh.meshTree.m_root);
	while (node.empty() == false)
	{
		
		
		var data = node.front().data.ci;

		if (mesh.uvIndexMode && data.uvIndex.empty() == false && data.vertex.empty() == false)
		{
			CMath.UvIndexToVertexIndex(data.vertex, data.uv, data.normal, data.weight,
				data.weightIndex, data.index, data.uvIndex);
			data.vertexCount = data.vertex.Size(3);
			data.indexCount = data.index.size();
		}

		this.MeshCreateModify(node.front().data, _vf, node.front().data.ci);
		
		
		
		
		

		if (node.front().childe != null)
			node.push_back(node.front().childe);
		if (node.front().colleague != null)
			node.push_back(node.front().colleague);
	
		node.splice(0,1);

	}
}
CMeshMgr.prototype.MeshCreateModifyMeshData=function(_mesh,_vf,_info)
{
	
	if (_info.vertex.Empty())
		return;
	
		
	var tanCreate = false;
	for (var  each0 of _vf.m_data)
	{
		if (each0.identifier == DfVertexType.Tangent)
		{
			tanCreate = true;
			break;
		}
	}

		
	if (_info.texOff.Empty() == false && tanCreate)
	{
		var ref=new CFloatArray();
		ref.Resize(_info.vertex.Size(3)*3);
		for (var i = 0; i < ref.Size(3); ++i)
		{
			ref[i] = new CVec3(-1, -1, -1);
		}
		for (var i = 0; i < _info.index.size(); i += 3)
		{
			ref.V3(_info.index[i + 0], _info.texOff.V3(i / 3));
			ref.V3(_info.index[i + 1], _info.texOff.V3(i / 3));
			ref.V3(_info.index[i + 2], _info.texOff.V3(i / 3));

		}
		_info.texOff = ref;
	}

	

	if (tanCreate)
	{
		_info.tangent.Resize(_info.vertexCount*4);
		_info.binormal.Resize(_info.vertexCount*4);
		for(var i=0;i<_info.vertexCount;++i)
		{
			_info.tangent[i]=new CVec4(0,0,0,0);
			_info.binormal[i]=new CVec3(0,0,0);
		}
		
		CMath.TangentCalculate(_info.vertex, _info.normal, _info.uv, _info.index, _info.tangent);
		for(var i=0;i< _info.vertexCount;++i)
		{
			_info.binormal.V3(i,CMath.Vec3Cross(_info.normal.V3(i), _info.tangent.V4(i).GetNormal()));
			_info.binormal.V3(i, CMath.Vec3MulFloat(_info.binormal.V3(i),_info.tangent.W4(i)));
			
//			_info.binormal[i]=CMath.Vec3Cross(_info.normal[i], _info.tangent[i].GetNormal());
//			_info.binormal[i] = CMath.Vec3MulFloat(_info.binormal[i],_info.tangent[i].w);
			
		}
	}

	
	var index=new CIndex();
	index.CreateBuf16(_info.indexCount);
	var buf = index.Index16PT_Get();
	for (var i = 0; i < _info.indexCount*3; ++i)
	{
		buf[i] = _info.index[i];
	}

	this.MeshCreateModify(_mesh, _vf, _info.vertexCount, _info.indexCount,
		_info.vertex,
		_info.uv,
		_info.color,
		_info.weight,
		_info.weightIndex,
		_info.texOff,
		_info.normal,
		_info.tangent,
		_info.binormal,
		index,0);
}
//==============================================================================
//네이티브와 비슷하게 작동하려면 전역으로 선언해야 한다
function CMeshMgrGL() 
{
	
}
CMeshMgrGL.prototype=new CMeshMgr();
CMeshMgrGL.prototype.constructor	=CMeshMgrGL;


CMeshMgrGL.prototype.MeshCreateModify=function(_mesh,_vf,pa_vertexNum,pa_indexNum,
		pa_vertex,pa_uv,pa_color,pa_weight,pa_weightIndex,pa_ref,
		pa_normal,pa_tangent,pa_binormal,pa_index,_0Static1Dynamic2Modify)
{
	
	if(_mesh instanceof CMesh)
	{
		this.MeshCreateModifyMesh(_mesh,_vf);
		return;
	}
	else if(typeof pa_indexNum == 'undefined')
	{
		this.MeshCreateModifyMeshData(_mesh,_vf,pa_vertexNum);
		return;
	}
	
	var L_ver = null;
	var L_uv = null;


	var L_vb = null;
	var L_vb_ex = null;
	var L_vb_map = null;
	var L_type;


	if (_0Static1Dynamic2Modify == 0)
	{
		L_type = gl.STATIC_DRAW;

	}
	else if (_0Static1Dynamic2Modify == 1)
	{
		L_type = gl.DYNAMIC_DRAW;

	}


	if (_0Static1Dynamic2Modify != 2)
	{
		if (CRoot.m_renderer == DfRen.GL_H)
		{
			L_vb=gl.createVertexArray();
			gl.bindVertexArray(L_vb);
		}
		else
			L_vb=1;

		//현재 버텍스 포맷 들어있는 계수 만큼 만들어두고
		L_vb_ex = new Array(_vf.m_data.length + 1);

	}
	else
	{
		L_vb = _mesh.vGBuf;
		if (CRoot.m_renderer == DfRen.GL_H)
		{
			gl.bindVertexArray(L_vb);//바인드 시키고
		}
		L_vb_ex = _mesh.vGBufEx;
		L_type = gl.DYNAMIC_DRAW;
	}
	//L_vb_map=(GLuint *)pa_data.vertexInfo;


	for (var j = 0; j < _vf.m_data.length; ++j)//현재 설정한 포맷만큼 돌린다
	{
		if (_0Static1Dynamic2Modify != 2)
			L_vb_ex[j]=gl.createBuffer();//일단 넣을 버퍼잡아오고
		gl.bindBuffer(gl.ARRAY_BUFFER, L_vb_ex[j]);//몇번째냐 버퍼가

		switch (_vf.m_data[j].identifier)
		{
		case DfVertexType.Vertex:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_vertex.GetArray(), L_type);
		}
		break;
		case DfVertexType.Uv:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_uv.GetArray(), L_type);
		}
		break;
		case DfVertexType.Color:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_color.GetArray(), L_type);
		}
		break;
		case DfVertexType.WeightIndex:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_weightIndex.GetArray(), L_type);
		}
		break;
		//else if(L_fmt[pa_vertexFormat].format[j].find("weight")!=string::npos)
		case DfVertexType.Weight:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_weight.GetArray(), L_type);
		}
		break;
		//else if(L_fmt[pa_vertexFormat].format[j].find("normal")!=string::npos)
		case DfVertexType.Normal:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_normal.GetArray(), L_type);
		}
		break;
		case DfVertexType.Ref:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_ref.GetArray(), L_type);
		}
		break;
		case DfVertexType.Binormal:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_binormal.GetArray(), L_type);
		}
		break;
		case DfVertexType.Tangent:
		{
			gl.bufferData(gl.ARRAY_BUFFER,pa_tangent.GetArray(), L_type);
		}
		break;
		default:
			CMsg.E("설정되지 않은 포맷");
			break;
		}//switch
		gl.vertexAttribPointer(j, _vf.m_data[j].eachCount, _vf.m_data[j].SysDataType(), false, 0, 0);
		gl.enableVertexAttribArray(j);
		//gl.bindBuffer(gl.ARRAY_BUFFER, 0);//초기화

		if (gl.getError())
			CMsg.E("메쉬생성에러");

	}

	if (gl.getError())
		CMsg.E("메쉬생성에러");

	if (_0Static1Dynamic2Modify != 2)
	{

		//gl.bindVertexArray(0);//바인드 시키고
		_mesh.vGBuf = L_vb;
		_mesh.vGBufEx = L_vb_ex;
		_mesh.vInfo = new Array(pa_vertexNum);
		
		for (var i = 0; i < pa_vertexNum; ++i)
		{
			_mesh.vInfo[i] = pa_vertex.V3(i);
		}
		if(pa_index!=null)
		{
			var elementbuffer=gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementbuffer);
			
			if (pa_index.f16t32==false)
			{
				_mesh.iInfo.CreateBuf16(pa_indexNum);
				for (var i = 0; i < pa_indexNum; ++i)
				{
					_mesh.iInfo.Index16PT_Get()[3 * i + 0] = pa_index.Index16PT_Get()[3 * i + 0];
					_mesh.iInfo.Index16PT_Get()[3 * i + 1] = pa_index.Index16PT_Get()[3 * i + 1];
					_mesh.iInfo.Index16PT_Get()[3 * i + 2] = pa_index.Index16PT_Get()[3 * i + 2];
				}
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,pa_index.GetBuf(), gl.STATIC_DRAW);
			}
			else
			{
				_mesh.iInfo.CreateBuf32(pa_indexNum);
				for (var i = 0; i < pa_indexNum; ++i)
				{
					_mesh.iInfo.Index32PT_Get()[3 * i + 0] = pa_index.Index32PT_Get()[3 * i + 0];
					_mesh.iInfo.Index32PT_Get()[3 * i + 1] = pa_index.Index32PT_Get()[3 * i + 1];
					_mesh.iInfo.Index32PT_Get()[3 * i + 2] = pa_index.Index32PT_Get()[3 * i + 2];
				}
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,pa_index.GetBuf(), gl.STATIC_DRAW);
			}
			_mesh.iBuf=elementbuffer;
		}
	}
	else
	{
		
		if(_mesh.vInfo.length!=pa_vertexNum)
		{
			_mesh.vInfo = new Array(pa_vertexNum);
			for (var i = 0; i < pa_vertexNum; ++i)
			{
				_mesh.vInfo[i] = pa_vertex.V3(i);
			}
		}
		else
		{
			for (var i = 0; i < pa_vertexNum; ++i)
			{
				_mesh.vInfo[i].x = pa_vertex.X3(i);
				_mesh.vInfo[i].y = pa_vertex.Y3(i);
				_mesh.vInfo[i].z = pa_vertex.Z3(i);
			}
		}
		
		
	}
	
	_mesh.vNum = pa_vertexNum;
	_mesh.iNum = pa_indexNum;
}