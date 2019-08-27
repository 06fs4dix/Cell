function JSDfCPaint()
{
	this.D2 = 0;
	this.Billbord = 1;
	this.D3 = 2;
	this.Skin = 3;
	this.Count = 4;
	this.Null = 5;
};
var DfCPaint=new JSDfCPaint();
function JSDfCPaintPriority()
{
	this.BackGround = 2000;
	this.Normal = 3000;
	this.Alpha = 4000;

	this.PCount = 1000;
	this.Null = 500;
};
var DfCPaintPriority=new JSDfCPaintPriority();

class CPaint extends CComponent
{
	constructor()
	{
		super();
		this.fMat=new CMat();
		this.RGBA=new CVec4(0,0,0,0);
		this.vf=null;
		this.priority=DfCPaintPriority.Normal;
	}
	GetPriority() { return this.priority; }
	SetPriority(_val) {	this.priority = _val;	}
	SetRGBA(_rgba) { this.RGBA = _rgba; }
	GetRGBA() { return this.RGBA; }
	GetCComponentType() { return Df.CComponent.CPaint; }
	GetKey() { return ""; }
	SetVfValue(_name,_vec)
	{
		CWindow.RMgr().SetValue(this.GetVf(), _name, _vec);
	}
	SetVfValue(_name,_mat)
	{
		CWindow.RMgr().SetValue(this.GetVf(), _name, _mat);
	}
	GetVf()
	{
		return this.vf;
	}
	FinalMatCac(_first,_second)
	{
		this.fMat = CMath.MatMul(this.GetLMat(),_first);
		this.fMat = CMath.MatMul(this.fMat, _second);
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.Push(super.Serialize());
		pac.Push(this.fMat);
		pac.Push(this.RGBA);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1,this.fMat);
		pac.GetISerialize(2,this.RGBA);
	}
}
class CPaint2D extends CPaint
{
	constructor(_size,_texture)
	{
		super();
		this.texture=new Array();
		if(typeof _size == 'undefined')
		{
			this.size=new CVec2();
		}
		else
		{
			this.size=_size;
			this.texture.push_back(_texture);
		}
		
		
		
		this.animationVisible = 1.0;
		
		this.pivot=new CVec3();
		this.pos=new CVec3();
		this.rot=new CVec4();
		
		
		this.texCodi =new CVec4(1, 1, 0, 0);
		this.localMat=new CMat();
		this.PRSReset();
		this.vf=CPalette.GetVf2D();
		
	}
	
	GetCComponentType() { return Df.CComponent.CPaint; }
	GetKey() { return CString(); }
	GetCPaintType() { return DfCPaint.D2;	 }
	PRSReset()
	{
		var bound = this.GetBound();
		var bSca = this.GetScale();

		var lpos=this.pos.toCopy();
		lpos.x += bound.max.x*bSca.x*this.pivot.x;
		lpos.y += bound.max.y*bSca.y*this.pivot.y;
		//lpos.z += bound.max.z*bSca.z*this.pivot.z;


		//this.localMat = CMath.MatScale(bSca);
		var scaMat=new CMat();
		var rotMat=new CMat();
		scaMat = CMath.MatScale(bSca);
		rotMat = CMath.QutToMatrix(this.rot);

		this.localMat = CMath.MatMul(scaMat, rotMat);
		
		//CMat mat;
		this.localMat.arr[3][0] = lpos.x;
		this.localMat.arr[3][1] = lpos.y;
		this.localMat.arr[3][2] = lpos.z;


	}
	GetHalf(_wMat)
	{
		var pos=new CVec3((this.size.x * 0.5)*this.pivot.x, (this.size.y * 0.5)*this.pivot.y, 0);
		pos = CMath.MatToVec3Normal(pos, _wMat);
		return pos;
	}
	GetScale()
	{
		return new CVec3(this.size.x / d_Mesh2DSize, this.size.y / d_Mesh2DSize, 1);
	}
	GetBound()
	{
		//CVec3 bSca = GetScale();
		var bound=new CBound();

		bound.min.x = -d_Mesh2DSize * 0.5;
		bound.min.y = -d_Mesh2DSize * 0.5;
		bound.min.z = -0.5;

		bound.max.x = d_Mesh2DSize * 0.5;
		bound.max.y = d_Mesh2DSize * 0.5;
		bound.max.z = 0.5;

		return bound;
	}
	GetSize() 
	{ 
		return this.size.toCopy();	 
	};
	GetPos()
	{
		return this.pos.toCopy();
	}
	Render()
	{
		CWindow.RMgr().SetValue(this.GetVf(), "worldMat", this.fMat);
		CWindow.RMgr().SetValue(this.GetVf(), "RGBA", this.RGBA);
		CWindow.RMgr().SetValue(this.GetVf(), "texCodi", this.texCodi);
		CWindow.RMgr().SetTexture(this.GetVf(),this.texture.front() );
		CWindow.RMgr().VDrawMeshData(this.GetVf(), CPalette.Get2DMeshData());
	}
	SetTexture(_tex)
	{
		this.texture.clear();
		this.texture.push_back(_tex);
	}
	GetTexture() {	return this.texture;	}
	SetTexCodi(_stX,_stY,_edX,_edY,_imgW,_imgH)
	{
		if(_stX instanceof CVec4)
		{
			this.texCodi=_stX.toCopy();
		}
		else
		{
			this.texCodi.z = (_stX*1.0) / _imgW;
			this.texCodi.w = (_stY*1.0) / _imgH;

			this.texCodi.x = (_edX - _stX) / _imgW*1.0;
			this.texCodi.y = (_edY - _stY) / _imgH*1.0;
		}
		
		
	}
	SetPivot(_pivot)
	{
		this.pivot = _pivot;
		this.PRSReset();
	}
	SetSize(_size)
	{
		this.size = _size;
		this.PRSReset();
	}
	SetPos(_pos)
	{
		this.pos = _pos;
		this.PRSReset();
	}
	SetRot(_rot)
	{
		this.rot = _rot;
		this.PRSReset();
	}
	GetLMat() {	return this.localMat;	};

	Serialize()
	{
		var pac = new CPacket();
		pac.name = "CPaint2D";
		pac.Push(super.Serialize());
		pac.Push(this.size);
		pac.Push(this.pivot);
		pac.Push(this.pos);
		pac.Push(this.rot);
		
		pac.Push(this.texture);
		pac.Push(this.texCodi);
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1,this.size);
		pac.GetISerialize(2,this.pivot);
		pac.GetISerialize(3,this.pos);
		pac.GetISerialize(4,this.rot);
		
		
		var pac2=new CPacket();
		pac2.Deserialize(pac.GetString(5));
		for (var each0 of pac2.value)
		{
			this.texture.add(each0);
		}
		pac.GetISerialize(6,this.texCodi);
		this.PRSReset();
	}
}
class CPaintBillbord extends CPaint2D
{
	constructor(_size,_texture)
	{
		super(_size,_texture);
		
	}
//	GetLMat()
//	{
//		return new CMat();
//	}
//	GetBound()
//	{
//		var bSca = this.GetScale();
//		var bound=new CBound();
//
//		bound.min.x = -d_Mesh2DSize * 0.5;
//		bound.min.y = -d_Mesh2DSize * 0.5;
//		bound.min.z = -0.5;
//
//		bound.max.x = d_Mesh2DSize * 0.5;
//		bound.max.y = d_Mesh2DSize * 0.5;
//		bound.max.z = 0.5;
//		var maxVal = CMath.Max(bSca.x, bSca.y);
//		maxVal = CMath.Max(bSca.x, bSca.y);
//		bound.min.x *= maxVal;
//		bound.max.x *= maxVal;
//		bound.min.y *= maxVal;
//		bound.max.y *= maxVal;
//
//		return bound;
//	}
	GetCPaintType() { return DfCPaint.Billbord; }
	FinalMatCac(_first,_second)
	{
		this.fMat = CMath.MatMul(this.GetLMat(), _second);
		this.fMat = CMath.MatMul(this.fMat,_first);
//		this.fMat.arr[0][0]*=_first.arr[0][0];
//		this.fMat.arr[1][1]*=_first.arr[1][1];
//		this.fMat.arr[2][2]*=_first.arr[2][2];
		
		
//		this.fMat.arr[3][0] += _first.arr[3][0];
//		this.fMat.arr[3][1] += _first.arr[3][1];
//		this.fMat.arr[3][2] += _first.arr[3][2];
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.name = "CPaintBillbord";
		pac.Push(super.Serialize());
		
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		
	}
}
function TreeCopy(_a,_b,_sum,_bound)
{
	_b.key = _a.key;
	if (_a.data.ci != null)
	{
		_b.data.pos = _a.data.ci.pos;
		_b.data.rot = _a.data.ci.rot;
		_b.data.sca = new CVec3(1,1,1);
		_b.data.PRSReset();
		CAnimation.UpdateTree(0, _a.data, _b.data, _sum);
	}
	for (var i = 0; i < _a.data.vNum; ++i)
	{
		_bound.ResetBoxMinMax(CMath.MatToVec3Coordinate(_a.data.vInfo[i], _b.data.pst));
	}
	
	if (_a.childe != null)
	{
		_b.childeAdd(_a.childe.key);
		_b.childe.data=new CMeshCopyInfo();
		TreeCopy(_a.childe, _b.childe,_b.data.pst);
	}
	if (_a.colleague != null)
	{
		_b.colleagueAdd(_a.colleague.key);
		_b.colleague.data=new CMeshCopyInfo();
		TreeCopy(_a.colleague, _b.colleague,_sum);
	}
}
class CPaint3D extends CPaint
{
	constructor(_mesh)
	{
		super();
		this.tree=null;
		this.mesh="";
		this.boundBox=new CBound();
		
		if(typeof _mesh == 'undefined')
			return;
		
		
		this.SetMesh(_mesh);
	}
	SetMesh(_mesh)
	{
		if(this.tree!=null)
			this.tree=null;
		
		this.mesh = _mesh;
		var lmesh=CRes.get(_mesh);
		if(lmesh==null)
			return;
		this.vf = lmesh.vf;
		this.tree = new CTree();
		this.tree.m_root.data=new CMeshCopyInfo();
		TreeCopy(lmesh.meshTree.m_root,this.tree.m_root,new CMat(),this.boundBox);
	}
	GetCPaintType() { return DfCPaint.D3; }
	
	
	Render(_a,_b,_c)
	{
		
		
		if(this.tree == null)
		{
			this.SetMesh(this.mesh)
			return;
		}
		var lmesh = CRes.get(this.mesh);
		if (lmesh.weightCopyMat.empty() == false)
		{
			CWindow.RMgr().SetValueFloat(this.GetVf(), "weightArrMat", lmesh.weightCopyMat,16);
		}
		
		var node=new Array();
		node.push_back(new CMeshNode(lmesh.meshTree.m_root, this.tree.m_root));
		while (node.empty()==false)
		{
			var all = CMath.MatMul(node.front().mpi.data.pst, this.fMat);
			
			
			if(lmesh.skin)
				this.RenderMeshSkin(lmesh, node.front(), all);
			else
				this.RenderMesh(lmesh, node.front(), all);
			
			
			

			if ( node.front().md.childe != null)
			{
				node.push_back(new CMeshNode(node.front().md.childe, node.front().mpi.childe));
			
				
			}
				
			if (node.front().md.colleague != null)
			{
				node.push_back(new CMeshNode(node.front().md.colleague, node.front().mpi.colleague));
			}
				
			node.splice(0,1);
			
		}
	}
	RenderMesh(_mesh,_node,_all)
	{
		
		
		if (_node.md.data.vNum > 0)
		{
			CWindow.RMgr().SetValue(this.GetVf(), "worldMat", _all);
			CWindow.RMgr().SetTexture(this.GetVf(), _mesh.texture, _node.md.data.textureOff);
			CWindow.RMgr().VDrawMeshData(this.GetVf(), _node.md.data);
		}
	}
	RenderMeshSkin(_mesh,_node,_all)
	{
		for (var i = 0; i < _mesh.weightName.size(); ++i)
		{
			if (_mesh.weightName[i].equals(_node.md.key))
			{
				var all=new CMat();
				all = CMath.MatMul(_mesh.weightMat[i].mat, _all);
				_mesh.SetWeightMat(i, all);

				
				if(_mesh.weightMat[i].target.empty()==false)
				{
					for (var j = 0; j < _mesh.weightMat[i].target.size(); ++j)
					{
						all = CMath.MatMul(_mesh.weightMat[_mesh.weightMat[i].target[j]].mat, _all);
						
						_mesh.SetWeightMat(_mesh.weightMat[i].target[j], all);
					}
					
				}
				break;
			}
		}
		if (_node.md.data.vNum > 0)
		{
		
			CWindow.RMgr().SetTexture(this.GetVf(), _mesh.texture, _node.md.data.textureOff);
			CWindow.RMgr().VDrawMeshData(this.GetVf(), _node.md.data);
		}
	}
	GetMesh() { return this.mesh; }
	GetTree() { return this.tree; }
	GetBound() { return this.boundBox; }
	GetLMat() { return new CMat(); }
	Serialize()
	{
		var pac=new CPacket();
		pac.name = "CPaint3D";
		pac.Push(super.Serialize());
		pac.Push(this.mesh);
		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.mesh=pac.GetString(1);
		this.SetMesh(this.mesh);
	}
}

