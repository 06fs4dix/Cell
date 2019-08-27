package cell;

import java.util.Vector;

public class CEventComponent extends CComponent
{
	protected CObject m_cobject=null;
	protected CComponent m_icom=this;
	
	public int GetCComponentType() { return Df.CComponent.CEventComponent; }
	public String GetKey() { return new String(); }
	public CObject GetCObject() { return m_cobject;	 }
	public void SetCObject(CObject _obj) { m_cobject = _obj; }
	public void Update(int _delay) {}
	public void LastUpdate(int _delay) {}
	public void Init() {}
	public void Render() {}
	public void Load() {}
	public void Collision(CObject _obj, float _len) {}
	public void Pick(CVec3 _pos) {}
	public void CameraOut() {}
	public void CameraJoin(Vector<CPlaneOutJoin> _joinPlane) {}
	public void Remove(CComponent _com) {}
	public void CanvasDelete() {};
	
	
	public void ECollision(CComponent _com, CObject _obj, float _len)
	{
		m_icom = _com;
		Collision(_obj, _len);
	}
	public void EPick(CComponent _com, CVec3 _pos)
	{
		m_icom = _com;
		Pick(_pos);
	}
	public void ECameraOut(CComponent _com)
	{
		m_icom = _com;
		CameraOut();
	}
	public void ECameraJoin(CComponent _com, Vector<CPlaneOutJoin> _joinPlane)
	{
		m_icom = _com;
		CameraJoin(_joinPlane);
	}
	public void EICompontRemove(CComponent _com)
	{
		m_icom = _com;
		Remove(_com);
	}

}
