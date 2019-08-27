function JSDfColliderType()
{
	this.Sphere = 0;
	this.Box = 1;
	this.Poloygon = 2;
	this.Count = 3;
	this.Null = 4;
};
var DfColliderType=new JSDfColliderType();


class CColliderUpdateData
{
	constructor()
	{
		this.m_obj=null;
		this.m_renObjMap=null;
		this.m_ray=new Array();
		this.m_plane = null;

		this.pick=new CVec3();
		this.out=false;
		this.join=new Array();
		this.colObj=new Array();
		this.colLen=new Array();
	}
	Reset(_obj,_ray,_plane)
	{
		this.m_renObjMap=new Array();
		this.m_obj = _obj;
		//this.m_renObj = _renObj;
		this.m_ray = _ray;
		this.m_plane=_plane;

		this.pick =new CVec3();
		this.out = false;
		this.join.clear();
		this.colObj.clear();
		this.colLen.clear();
	}
	PushObjectMap(_map)
	{
		this.m_renObjMap.push_back(_map);
	}
};

class CCollider extends CComponent
{
	constructor(_paint)
	{
		super();
		if(typeof _paint !== 'undefined')
			this.Init(_paint);
		else
		{
			this.m_bound=new CBound();
			this.m_mat=new CMat();
		}
		
	
		this.m_pick=false;
		this.m_collision=false;
		this.m_cameraOut = false;
		this.m_cameraJoin = false;
		this.m_colliderType= DfColliderType.Sphere;
		this.m_update=new CColliderUpdateData();
		
	}
	Init(_paint)
	{
		this.m_bound = _paint.GetBound().toCopy();
		this.m_mat = _paint.GetLMat().toCopy();
	}
	Update(_delay)
	{
		if (this.m_update.m_obj == null || this.m_update.m_obj.GetShow()==false)
			return;

		var ic = this;
		
		for (var each0 of this.m_update.m_ray)
		{
			//if (ic->Pick(each0, m_update.m_obj->GetWMat()))
			if (ic.Pick(each0, this.m_update.m_obj.GetWMat()))
			{
				this.m_update.pick = each0.GetPosition();
				break;
			}
		}
		
		if (ic.CameraOut(this.m_update.m_plane, this.m_update.m_obj.GetWMat()))
		{
			this.m_update.out = true;
		}
		var joinPlane = ic.CameraJoin(this.m_update.m_plane, this.m_update.m_obj.GetWMat());
		if (joinPlane.empty() == false)
		{
			this.m_update.join = joinPlane;
		}
		//var ren = this.m_update.m_renObj;
		//for (var j = 0; j < ren.size(); ++j)
		//{
		for (var each1 of this.m_update.m_renObjMap)
		{
			for (var eachKey of each1)
			{
				var each0=eachKey[1];
				if (each0 == this.m_update.m_obj)
					continue;
				var jobj = null;
				if (each0.GetCRenObjType() == DfCRenObj.CObject)
					jobj = each0;
	
				if (jobj != null)
				{
					if(jobj.GetShow()==false)
						continue;
					var jCom = jobj.GetCComponent(Df.CComponent.CCollider);
					for (var h = 0; h < jCom.size(); ++h)
					{
						var jc = jCom[h];
						var len = ic.Collision(this.m_update.m_obj.GetWMat(), jc, jobj.GetWMat());
						if (len !=-1)
						{
							this.m_update.colObj.push_back(jobj);
							this.m_update.colLen.push_back(len);
						}
					}
				}
			}//for
		}
	}
	GetColliderType() {return this.m_colliderType;	}
	SetColliderType(_type) { this.m_colliderType = _type;	 }
	GetCComponentType()	{		return Df.CComponent.CCollider;	}
	GetKey() { return ""; }
	SetCollision(_val) {this.m_collision = _val;	}
	SetPick(_val) { this.m_pick = _val; }
	SetCameraOut(_val) { this.m_cameraOut = _val; }
	SetCameraJoin(_val) { this.m_cameraJoin = _val; }

	GetCollision() { return this.m_collision; }
	GetPick() { return this.m_pick; }
	GetBound() {	return this.m_bound;	}
	GetLMat() {	return this.m_mat;	}
	
	Collision(_wMatI, _co, _coWMat)
	{
		if (this.m_collision == false || _co.GetCollision()==false)
			return -1;

		var Iall=new CMat();
		var ipos=new CVec3();
		var boundI = this.m_bound.toCopy();
		this.GetColliderPosAndBound(_wMatI, ipos, boundI,Iall);

		var Call = new CMat();
		var cpos=new CVec3();
		var boundC = _co.GetBound().toCopy();
		_co.GetColliderPosAndBound(_coWMat, cpos, boundC,Call);

		if (this.m_colliderType == DfColliderType.Sphere || _co.GetColliderType()== DfColliderType.Sphere)
			return CMath.ColSphereSphere(ipos, boundI.GetInRadius(), cpos, boundC.GetInRadius());
		var val = CMath.ColSphereSphere(ipos, boundI.GetOutRadius(), cpos, boundC.GetOutRadius());
		if (val!=-1 && CMath.ColBoxBoxOBB(this.m_bound, Iall, _co.GetBound(), Call))
			return val;
		
		return -1;
	}
	Pick(_ray,_wMat)
	{
		if (this.m_pick == false)
			return false;
		var lray = _ray.toCopy();
		var L_inM = CMath.MatInvert(_wMat);
		lray.SetDirect(CMath.MatToVec3Normal(lray.GetDirect(), L_inM));
		lray.SetOriginal(CMath.MatToVec3Coordinate(lray.GetOriginal(), L_inM));
		
		var boundI = this.m_bound.toCopy();
		

		
		
		var pick = false;
		if (this.m_colliderType == DfColliderType.Sphere)
		{
			boundI.min = CMath.MatToVec3Normal(boundI.min, this.m_mat);
			boundI.max = CMath.MatToVec3Normal(boundI.max, this.m_mat);
			pick = CMath.RaySphereIS(boundI.GetCenterPos(), boundI.GetInRadius(), lray);
		}
		else
		{
			boundI.min = CMath.MatToVec3Coordinate(boundI.min, this.m_mat);
			boundI.max = CMath.MatToVec3Coordinate(boundI.max, this.m_mat);
			pick=CMath.RayBoxIS(boundI.min, boundI.max, lray);
		}
			
		
		_ray.SetPosition(lray.GetPosition());

		return pick;
	}
	CameraOut(_plane,_wMat)
	{
		var poj=new CPlaneOutJoin();
		poj.tOutfJoin = true;
		if (this.m_cameraOut == false)
			return poj;

		var Iall=new CMat();
		var ipos=new CVec3();
		var boundI = this.m_bound.toCopy();
		this.GetColliderPosAndBound(_wMat, ipos, boundI,Iall);

		CMath.PlaneSphereInside(_plane, ipos, boundI.GetInRadius(), poj);
		return poj.plane!=d_PlaneNull;
	}
	CameraJoin(_plane,_wMat)
	{
		var plane=new Array();
		var poj=new CPlaneOutJoin();
		poj.tOutfJoin = false;
		if (this.m_cameraJoin == false)
			return plane;

		
		var Iall=new CMat();
		var ipos=new CVec3();
		var boundI = this.m_bound.toCopy();
		this.GetColliderPosAndBound(_wMat, ipos, boundI,Iall);

		
		for (var i = 0; i < d_PlaneCount; ++i)
		{
			poj.plane = i;
			CMath.PlaneSphereInside(_plane, ipos, boundI.GetInRadius(), poj);
			if (poj.plane != d_PlaneNull)
				plane.push_back(poj);
		}

		return plane;
	}
	GetColliderPosAndBound(_wMat,_pos,_bound,allMat)
	{
		allMat = CMath.MatMul(this.m_mat, _wMat);
		var vdum=allMat.GetPos();
		_pos.x = vdum.x;
		_pos.y = vdum.y;
		_pos.z = vdum.z;
		//CBound boundI = m_bound.toCopy();
		_bound.min = CMath.MatToVec3Normal(_bound.min, allMat);
		_bound.max = CMath.MatToVec3Normal(_bound.max, allMat);
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.name = "CCollider";
		pac.Push(super.Serialize());
		pac.Push(this.m_mat);
		pac.Push(this.m_bound);
		pac.Push(this.m_pick);
		pac.Push(this.m_collision);
		pac.Push(this.m_cameraOut);
		pac.Push(this.m_cameraJoin);
		pac.Push(this.m_colliderType);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_mat.Deserialize(pac.GetString(1));
		this.m_bound.Deserialize(pac.GetString(2));
		this.m_pick = pac.GetBool(3);
		this.m_collision = pac.GetBool(4);
		this.m_cameraOut = pac.GetBool(5);
		this.m_cameraJoin = pac.GetBool(6);
		this.m_colliderType = pac.GetInt32(7);

	}
}