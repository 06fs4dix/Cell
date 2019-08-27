package cell;

import java.util.HashMap;
import java.util.Map;
import java.util.Vector;
class CPairStrStr
{
	CPairStrStr(String _first,String _second)
	{
		first=_first;
		second=_second;
	}
	String first;
	String second;
}
public class CCanvas
{
	CCamera m_cam;
	Vector<CCanvas> m_colCan=new Vector<CCanvas>();
	void PushColCan(CCanvas _can) { m_colCan.add(_can); }
	public CCanvas(CCamera _cam)
	{
		m_cam=_cam;
	}
	public void Init() {}
	CCamera GetCam() { return m_cam;	 }
	public void Render() {}
	public Map<String,CRenObj> m_obj=new HashMap<String,CRenObj>();
	public Map<String,CRenObj> GetObjectMap() { return m_obj; }
	void KeyChange(String _org, String _tar)
	{
		CRenObj obj=m_obj.get(_org);
		if (obj==null)
		{
			return;
		}

		obj.SetKey(_tar);
		obj.ClearKeyChange();
		m_obj.put(_tar,obj);
		m_obj.remove(_org);
	}
	public CRenObj Find(String _key)
	{
		
		return m_obj.get(_key);
	}
	public void Push(CRenObj _obj)
	{
		if(_obj.GetKey().isEmpty())
		{
			_obj.SetKey(CRand.RandStr());
			
		}
		
		m_obj.put(_obj.GetKey(), _obj);
		_obj.ClearKeyChange();
	}

	public void Update(int _delay)
	{
		Vector<String> remove=new Vector<String>();
		for(var each0 : m_obj.values())
		{
			//m_obj[i].Update(_delay);
			if (each0.GetRemove())
			{
				each0.CanvasDelete();
				remove.add(each0.GetKey());
				continue;
			}
		}
		for(var each0 : remove)
		{
			m_obj.remove(each0);
		}
		
		Vector<CPairStrStr> keyChangeList=new Vector<CPairStrStr>();
		
		for(var each0 : m_obj.values())
		{
			if (CRoot.m_async&& each0.GetCRenObjType() == DfCRenObj.CObject)
			{
				CAsync.Async((IAsync)each0);
			}
			else
				each0.Update(_delay);
			
			if (each0.GetKeyChange().isEmpty() == false)
			{
				keyChangeList.add(new CPairStrStr(each0.GetKeyChange(), each0.GetKey()));
				if (this.Find(each0.GetKey()) != null)
					CMsg.E("key already!");
			}
		}
		for (var each0 : keyChangeList)
		{
			this.KeyChange(each0.first, each0.second);
		}
		
		if(CRoot.m_async)
			CAsync.AwaitUpdate(_delay);

		
		CThreeVec3 ray = null;
		CSixVec4 plane = null;
		//int size = m_obj.size();
		for(var each0 : m_obj.values())
		{
			if (each0.GetCRenObjType() == DfCRenObj.CObject)
			{
				CObject iobj = null;
				iobj = (CObject)each0;

				Vector<CComponent> icom = iobj.GetCComponent(Df.CComponent.CCollider);
				for (int k = 0; k < icom.size(); ++k)
				{
					CCollider ic = (CCollider)icom.get(k);
					ic.m_update.Reset(iobj, ray,plane);
					ic.m_update.PushObjectMap(m_obj);
					
					for (var each1 : m_colCan)
					{
						ic.m_update.PushObjectMap(each1.GetObjectMap());
					}
					
					if(CRoot.m_async)
						CAsync.Async((IAsync)ic);
					else
						ic.Update(_delay);
				}
			}
		
		}
		if (CRoot.m_async)
			CAsync.AwaitUpdate(_delay);
		for(var each0 : m_obj.values())
		{
			if (each0.GetCRenObjType() == DfCRenObj.CObject)
			{
				CObject iobj = null;
				iobj = (CObject) each0;

				Vector<CComponent> icom = iobj.GetCComponent(Df.CComponent.CCollider);
				for (int k = 0; k < icom.size(); ++k)
				{
					CCollider ic = (CCollider)icom.get(k);
					if (ic.m_update.pick.IsZero() == false)
					{
						iobj.Pick(ic, ray);
					}
					if (ic.m_update.out)
					{
						iobj.CameraOut(ic);
					}
					if (ic.m_update.join.isEmpty() == false)
					{
						iobj.CameraJoin(ic, ic.m_update.join);
					}
					for (int j = 0; j < ic.m_update.colObj.size(); ++j)
					{
						iobj.Collision(ic, ic.m_update.colObj.get(j), ic.m_update.colLen.get(j));
					}
				}
			}

		}//for
		
		for(var each0 : m_obj.values())
		{
			
			each0.LastUpdate(_delay);
		}
	}
	Vector<CRenObj> FindNearCObject(CVec3 _pos, float _len)
	{
		Vector<CRenObj> rVal = new Vector<CRenObj>();
		
		for(var each0 : m_obj.values())
		{
			CObject obj = (CObject)each0;
			if (obj != null)
			{
				float len=CMath.Vec3Lenght(CMath.Vec3MinusVec3(_pos, obj.GetPos()));
				if (len < _len)
				{
					
					rVal.add(obj);
				}
			}
		}
		return rVal;
	}
}
