package cell;

import java.util.Map;
import java.util.Vector;

class DfColliderType
{
	public static int Sphere = 0;
	public static int Box = 1;
	public static int Poloygon = 2;
	public static int Count = 3;
	public static int Null = 4;
};


class CColliderUpdateData
{
	public void Reset(CObject _obj, CThreeVec3 _ray, CSixVec4 _plane)
	{
		m_renObjMap.clear();
		m_obj = _obj;
		//m_renObj = _renObj;
		m_ray = _ray;
		m_plane=_plane;

		pick =new CVec3();
		out = false;
		join.clear();
		colObj.clear();
		colLen.clear();
	}
	public void PushObjectMap(Map<String,CRenObj>  _map)
	{
		m_renObjMap.add(_map);
	}
	CObject m_obj=null;
	Vector<Map<String,CRenObj>> m_renObjMap=new Vector<Map<String,CRenObj>>();
	//Map<String,CRenObj> m_renObj=null;
	CThreeVec3 m_ray=null;
	CSixVec4 m_plane = null;

	CVec3 pick;
	boolean out=false;
	Vector<CPlaneOutJoin> join=new Vector<CPlaneOutJoin>();
	Vector<CObject> colObj=new Vector<CObject>();
	Vector<Float> colLen=new Vector<Float>();
};
class CCollider extends CComponent implements IAsync
{
	
	CMat m_mat=new CMat();
	CBound m_bound=new CBound();
	boolean m_pick=false;
	boolean m_collision=false;
	boolean m_cameraOut = false;
	boolean m_cameraJoin = false;
	int m_colliderType= DfColliderType.Sphere;


	public CColliderUpdateData m_update=new CColliderUpdateData();
	

	public int GetColliderType() {return m_colliderType;	}
	public void SetColliderType(int _type) { m_colliderType = _type;	 }
	public int GetCComponentType()	{		return Df.CComponent.CCollider;	}
	public String GetKey() { return new String(); }
	public void SetCollision(boolean _val) {m_collision = _val;	}
	public void SetPick(boolean _val) { m_pick = _val; }
	public void SetCameraOut(boolean _val) { m_cameraOut = _val; }
	public void SetCameraJoin(boolean _val) { m_cameraJoin = _val; }

	public boolean GetCollision() { return m_collision; }
	public boolean GetPick() { return m_pick; }
	CBound GetBound() {	return m_bound;	}
	CMat GetLMat() {	return m_mat;	}
	public CCollider()
	{
		
	}
	public CCollider(CPaint _paint)
	{
		this.Init(_paint);
	}
	public void Init(CPaint _paint)
	{
		m_bound = _paint.GetBound().toCopy();
		m_mat = _paint.GetLMat().toCopy();
	}
	public void Update(int _delay)
	{
		if (m_update.m_obj == null || m_update.m_obj.GetShow()==false)
			return;

		CCollider ic = this;
		
		if (ic.Pick(m_update.m_ray, m_update.m_obj.GetWMat()))
		{
			m_update.pick = m_update.m_ray.GetPosition();
		}

		if (ic.CameraOut(m_update.m_plane, m_update.m_obj.GetWMat()))
		{
			m_update.out = true;
		}
		Vector<CPlaneOutJoin> joinPlane = ic.CameraJoin(m_update.m_plane, m_update.m_obj.GetWMat());
		if (joinPlane.isEmpty() == false)
		{
			m_update.join = joinPlane;
			//iobj.CameraJoin(ic, joinPlane);
		}
		//Vector<CRenObj> ren = m_update.m_renObj;
		//for (int j = 0; j < ren.size(); ++j)
		for (var each1 : m_update.m_renObjMap)
		{
			for(var each0 : each1.values())
			{
				if (each0 == m_update.m_obj)
					continue;
				CObject jobj = null;
				if (each0.GetCRenObjType() == DfCRenObj.CObject)
					jobj = (CObject) each0;
	
				if (jobj != null)
				{
					if(jobj.GetShow()==false)
						continue;
					Vector<CComponent> jCom = jobj.GetCComponent(Df.CComponent.CCollider);
					for (int h = 0; h < jCom.size(); ++h)
					{
						CCollider jc = (CCollider) jCom.get(h);
						float len = ic.Collision(m_update.m_obj.GetWMat(), jc, jobj.GetWMat());
						if (len != -1)
						{
							m_update.colObj.add(jobj);
							m_update.colLen.add(len);
						}
					}
				}
			}//for
		}
	}
	public float Collision(CMat _wMatI, CCollider _co, CMat _coWMat)
	{
		if (m_collision == false || _co.GetCollision()==false)
			return -1;


		var Iall=new CMat();
		CVec3 ipos=new CVec3();
		CBound boundI = m_bound.toCopy();
		GetColliderPosAndBound(_wMatI, ipos, boundI, Iall);

		var Call = new CMat();
		CVec3 cpos=new CVec3();
		CBound boundC = _co.GetBound().toCopy();
		_co.GetColliderPosAndBound(_coWMat, cpos, boundC, Call);

		
		if (m_colliderType == DfColliderType.Sphere || _co.GetColliderType()== DfColliderType.Sphere)
			return CMath.ColSphereSphere(ipos, boundI.GetInRadius(), cpos, boundC.GetInRadius());
		float val = CMath.ColSphereSphere(ipos, boundI.GetOutRadius(), cpos, boundC.GetOutRadius());
		if (val!=-1 && CMath.ColBoxBoxOBB(m_bound, Iall, _co.GetBound(), Call))
			return val;
		
		return -1;
	}
	public boolean Pick(CThreeVec3 _ray, CMat _wMat)
	{
		if (m_pick == false || _ray==null)
			return false;
		CThreeVec3 lray = _ray.toCopy();
		CMat all = CMath.MatMul(m_mat, _wMat);
		CMat L_inM = CMath.MatInvert(all);
		lray.SetDirect(CMath.MatToVec3Normal(lray.GetDirect(), L_inM));
		lray.SetOriginal(CMath.MatToVec3Coordinate(lray.GetOriginal(), L_inM));

		boolean pick = false;
		if (m_colliderType == DfColliderType.Sphere)
		{
			pick = CMath.RaySphereIS(m_bound.GetCenterPos(), m_bound.GetInRadius(), lray);
		}
		else
			pick=CMath.RayBoxIS(m_bound.min, m_bound.max, lray);

		_ray.SetPosition(lray.GetPosition());

		return pick;
	}
	public boolean CameraOut(CSixVec4 _plane, CMat _wMat)
	{
		CPlaneOutJoin poj=new CPlaneOutJoin();
		poj.tOutfJoin = true;
		if (this.m_cameraOut == false)
			return false;

		var Iall = new CMat();
		CVec3 ipos=new CVec3();
		CBound boundI = m_bound.toCopy();
		GetColliderPosAndBound(_wMat, ipos, boundI, Iall);

		CMath.PlaneSphereInside(_plane, ipos, boundI.GetInRadius(), poj);
		return poj.plane!=DfPlane.Null;
	}
	public Vector<CPlaneOutJoin> CameraJoin(CSixVec4 _plane, CMat _wMat)
	{
		var plane=new Vector<CPlaneOutJoin>();
		var poj=new CPlaneOutJoin();
		poj.tOutfJoin = false;
		if (m_cameraJoin == false)
			return plane;

		var Iall=new CMat();
		var ipos=new CVec3();
		var boundI = this.m_bound.toCopy();
		this.GetColliderPosAndBound(_wMat, ipos, boundI, Iall);

		
		for (var i = 0; i < DfPlane.Count; ++i)
		{
			poj.plane = i;
			CMath.PlaneSphereInside(_plane, ipos, boundI.GetInRadius(), poj);
			if (poj.plane != DfPlane.Null)
				plane.add(poj);
		}
		
		


		return plane;
	}
	public void GetColliderPosAndBound(CMat _wMat, CVec3 _pos, CBound _bound,CMat allMat)
	{
		allMat.toCopy(CMath.MatMul(m_mat, _wMat));
		_pos.toCopy(allMat.GetPos());
		//CBound boundI = m_bound.toCopy();
		_bound.min = CMath.MatToVec3Normal(_bound.min, allMat);
		_bound.max = CMath.MatToVec3Normal(_bound.max, allMat);
	}
	public CPacket Serialize()
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
	public void Deserialize(String _str)
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
};