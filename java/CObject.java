package cell;

import java.util.Vector;

public class CObject extends CRenObj implements IAsync
{
	Vector<CPacketSmart> m_packet=new Vector<CPacketSmart>();
	
	protected CObject m_parent = null;
	protected Vector<CObject> m_childe=new Vector<CObject>();
	protected CMat m_pMat;
	
	protected Vector<CComponent> m_ptVec=new Vector<CComponent>();
	protected Vector<CComponent> m_rbVec=new Vector<CComponent>();
	protected Vector<CComponent> m_clVec=new Vector<CComponent>();
	protected Vector<CComponent> m_enVec=new Vector<CComponent>();
	protected Vector<CComponent> m_aniVec=new Vector<CComponent>();
	protected Vector<CFlow> m_flow=new Vector<CFlow>();
	
	
	protected CVec3 m_pos =new CVec3();
	protected CVec4 m_rot =new CVec4();
	protected CVec3 m_sca =new CVec3(1, 1, 1);
	//protected CVec4 m_RGBA=new CVec4(0,0,0,0);
	protected CMat m_wMat =new CMat();
	protected float m_speed=1.0f;
	
	public CBound GetBound()
	{
		if(m_clVec.isEmpty())
			return null;
		CCollider cl=(CCollider)m_clVec.get(0);
		CBound bound=cl.GetBound().toCopy();
		bound.min = CMath.MatToVec3Normal(bound.min, cl.GetLMat());
		bound.min.z=bound.min.y;
		bound.max = CMath.MatToVec3Normal(bound.max, cl.GetLMat());
		bound.max.z=bound.max.y;
		
		
		float maxVal = CMath.Max(bound.max.x, bound.max.y);
		maxVal = CMath.Max(maxVal, bound.max.z);
		bound.min.x = -maxVal;
		bound.max.x = maxVal;
		bound.min.y = -maxVal;
		bound.max.y = maxVal;
		bound.min.z = -maxVal;
		bound.max.z = maxVal;
		
		return bound;
	}
	public void PushPacket(CPacketSmart _pac)
	{
		m_packet.add(_pac);
	}
	protected void CallRemoveCComponent(CComponent _com)
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).EICompontRemove(_com);
			}
		}
	}
	public void SetPMat(CMat _mat) { m_pMat = _mat;	 }
	public void SetParent(CObject _obj)
	{
		m_parent = _obj;
		if (m_parent != null)
		{
			m_parent.m_childe.add(this);
			m_parent.PRSReset();
		}
		else
			m_pMat =new CMat();
	}
	public void PushChilde(CObject _obj)
	{ 
		_obj.SetParent(this); 
	}

	public void RemoveChilde(CObject _obj)
	{
		for (int i = 0; i < this.m_childe.size(); ++i)
		{
			if (this.m_childe.get(i) == _obj)
			{
				this.m_childe.remove(i);
				break;
			}
		}
	}
	public Vector<CPacketSmart> GetPacket()
	{
		return m_packet;
	}
	public void ClearPacket()
	{
		m_packet.clear();
	}
	public CObject() {}
	public float GetSpeed() {return m_speed;	};
	public Vector<CComponent>  GetCComponent(int _type)
	{
		switch (_type)
		{
		case Df.CComponent.CPaint:	return m_ptVec;
		case Df.CComponent.CRigidbody:	return m_rbVec;
		case Df.CComponent.CCollider:	return m_clVec;
		case Df.CComponent.CEventComponent:	return m_enVec;
		case Df.CComponent.CAnimation:	return m_aniVec;
		}
		return new Vector<CComponent>();
	}
	public Vector<CComponent> GetCComponentKey(String _key)
	{
		Vector<CComponent> com=new Vector<CComponent>();
		for (int i = 0; i < m_ptVec.size(); ++i)
		{
			if (m_ptVec.get(i).GetKey().equals(_key))
				com.add(m_ptVec.get(i));
		}
		for (int i = 0; i < m_rbVec.size(); ++i)
		{
			if (m_rbVec.get(i).GetKey().equals(_key))
				com.add(m_rbVec.get(i));
		}
		for (int i = 0; i < m_clVec.size(); ++i)
		{
			if (m_clVec.get(i).GetKey().equals(_key))
				com.add(m_clVec.get(i));
		}
		for (int i = 0; i < m_enVec.size(); ++i)
		{
			if (m_enVec.get(i).GetKey().equals(_key))
				com.add(m_enVec.get(i));
		}
		for (int i = 0; i < m_aniVec.size(); ++i)
		{
			if (m_aniVec.get(i).GetKey().equals(_key))
				com.add(m_aniVec.get(i));
		}
		return com;
	}
	public void PushCComponent(CComponent _com)
	{
		if (_com.GetCComponentType() == Df.CComponent.CPaint)
		{
			m_ptVec.add(_com);
			PRSReset();
		}
		else if (_com.GetCComponentType() == Df.CComponent.CRigidbody)
		{
			m_rbVec.add(_com);
		}
		else if (_com.GetCComponentType() == Df.CComponent.CCollider)
		{
			m_clVec.add(_com);
		}
		else if (_com.GetCComponentType() == Df.CComponent.CEventComponent)
		{
			CEventComponent dum = (CEventComponent)_com;
			dum.SetCObject(this);
			dum.Init();
			PRSReset();
			m_enVec.add(_com);
		}
		else if (_com.GetCComponentType() == Df.CComponent.CAnimation)
		{
			m_aniVec.add(_com);
			m_flow.add(new CFlow());
			((CAnimation)m_aniVec.lastElement()).Update(m_flow.lastElement(), this, 1);
		}
	}
	CComponent NewCComponent(CComponent _dummy)
	{
		this.PushCComponent(_dummy);
		return _dummy;
	}
	public void RemoveAllCComponent(int _type)
	{
		if (_type == Df.CComponent.CPaint)
		{
			for (int i = 0; i < m_ptVec.size(); ++i)
			{
				CallRemoveCComponent(m_ptVec.get(i));
			}
			m_ptVec.clear();
		}
		else if (_type == Df.CComponent.CRigidbody)
		{
			for (int i = 0; i < m_rbVec.size(); ++i)
			{
				CallRemoveCComponent(m_rbVec.get(i));
			}
			m_rbVec.clear();
		}
		else if (_type == Df.CComponent.CCollider)
		{
			for (int i = 0; i < m_clVec.size(); ++i)
			{
				CallRemoveCComponent(m_clVec.get(i));
			}
			m_clVec.clear();
		}
		else if (_type == Df.CComponent.CEventComponent)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				CallRemoveCComponent(m_enVec.get(i));
			}
			m_enVec.clear();
		}
		else if (_type == Df.CComponent.CAnimation)
		{
			for (int i = 0; i < m_aniVec.size(); ++i)
			{
				CallRemoveCComponent(m_aniVec.get(i));
			}
			m_aniVec.clear();
			m_flow.clear();
		}
	}
	//public void SetRGBA(CVec4 _rgba) { m_RGBA = _rgba; }
	
	public CMat GetWMat()
	{
		if (m_parent != null)
			return CMath.MatMul(m_wMat,m_pMat);
		return m_wMat.toCopy();
	}
	public CVec3 GetPos() { return m_pos.toCopy(); }
	public CVec4 GetRot() { return m_rot.toCopy(); };
	public CVec3 GetSca() { return m_sca.toCopy(); };
	
	public void SetPos(CVec3 _pos)
	{
		m_pos = _pos.toCopy();
		PRSReset();
	}
	public void SetPos(CVec3 _pos, boolean _reset)
	{
		m_pos = _pos.toCopy();
		if(_reset)
			PRSReset();
	}
	
	public void SetRot(CVec4 _rot, boolean _reset)
	{
		m_rot = _rot.toCopy();
		if (_reset)
			PRSReset();
	}
	public void SetSca(CVec3 _sca, boolean _reset)
	{
		m_sca = _sca.toCopy();
		if (_reset)
			PRSReset();
	}

	public void PRSReset()
	{
		CMat scaMat;
		CMat rotMat;
		scaMat = CMath.MatScale(m_sca);
		rotMat = CMath.QutToMatrix(m_rot);

		m_wMat = CMath.MatMul(scaMat, rotMat);

		m_wMat.arr[3][0] = m_pos.x;
		m_wMat.arr[3][1] = m_pos.y;
		m_wMat.arr[3][2] = m_pos.z;

		for (int i = 0; i < this.m_childe.size(); ++i)
		{
			this.m_childe.get(i).SetPMat(CMath.MatMul(this.m_wMat, this.m_pMat));

		}
	}
	public void Render(CCamera _cam)
	{
		
	}
	public void Update(int _delay)
	{
		if (m_rbVec.isEmpty() == false)
		{
			for (int i = 0; i < m_rbVec.size(); ++i)
			{
				m_pos =((CRigidBody)m_rbVec.get(i)).Update(m_pos,_delay);
			}
			PRSReset();
		}
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).Update(_delay);
			}
		}
		if (m_aniVec.isEmpty() == false)
		{
			Vector<Integer> rcom=new Vector<Integer>();
			for (int i = 0; i < m_aniVec.size(); ++i)
			{
				if (((CAnimation)m_aniVec.get(i)).Update(m_flow.get(i), this, _delay))
				{
					rcom.add(i);
				}
			}
			for (int i = rcom.size()-1; i >=0 ; --i)
			{
				CallRemoveCComponent(m_aniVec.get(rcom.get(i)));
				m_aniVec.remove(i);

			}
		}
	}
	public void LastUpdate(int _delay)
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).LastUpdate(_delay);
			}
		}
	}
	public void Collision(CComponent _com, CObject _col, float _len)
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).ECollision(_com,_col, _len);
			}
		}
	}
	public void Pick(CComponent _com, CThreeVec3 _ray)
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).EPick(_com, _ray.GetPosition());
			}
		}
	}
	public void CameraOut(CComponent _com)
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).ECameraOut(_com);
			}
		}
	}
	public void CameraJoin(CComponent _com, Vector<CPlaneOutJoin> _joinPlane)
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).ECameraJoin(_com, _joinPlane);
			}
		}
	}
	public int GetCRenObjType() { return DfCRenObj.CObject; }
	public void Destroy()
	{
		m_remove = true;

		if (m_parent != null)
		{
			m_parent.RemoveChilde(this);
		}
		
		for (int i = 0; i < this.m_childe.size(); ++i)
		{
			this.m_childe.get(i).SetParent(null);
			this.m_childe.get(i).Destroy();
		}
		

	}
	public void CanvasDelete()
	{
		if (m_enVec.isEmpty() == false)
		{
			for (int i = 0; i < m_enVec.size(); ++i)
			{
				((CEventComponent)m_enVec.get(i)).CanvasDelete();
			}
		}
	}
	
	
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(super.Serialize());

		pac.Push(m_pos);
		pac.Push(m_rot);
		pac.Push(m_sca);
		pac.Push(m_speed);
		pac.Push(m_ptVec);
		pac.Push(m_rbVec);
		pac.Push(m_clVec);
		pac.Push(m_aniVec);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		
		m_pos.Deserialize(pac.GetString(1));
		m_rot.Deserialize(pac.GetString(2));
		m_sca.Deserialize(pac.GetString(3));
	
		m_speed = pac.GetFloat(4);

		CPacket pac0=new CPacket();
		pac0.Deserialize(pac.GetString(5));
		for (String each0 : pac0.value)
		{
			CPaint pt = null;
			var pacDum = new CPacket();
			pacDum.Deserialize(each0);
			if (pacDum.name.equals("CPaint2D"))
				pt = new CPaint2D();
			else if (pacDum.name.equals("CPaintBillbord"))
				pt = new CPaintBillbord();
			else if (pacDum.name.equals("CPaint3D"))
				pt = new CPaint3D();
			else
				CMsg.E("¹ÌÁ¤ÀÇ");
			pt.Deserialize(each0);
			PushCComponent(pt);
		}
		pac0.Deserialize(pac.GetString(6));
		for (String each0 : pac0.value)
		{
			CRigidBody rb = new CRigidBody();
			rb.Deserialize(each0);
			PushCComponent(rb);
		}
		pac0.Deserialize(pac.GetString(7));
		for (String each0 : pac0.value)
		{
			CCollider cl = new CCollider();
			cl.Deserialize(each0);
			PushCComponent(cl);
		}
		pac0.Deserialize(pac.GetString(8));
		for (String each0 : pac0.value)
		{
			CAnimation ani = new CAnimation();
			ani.Deserialize(each0);
			PushCComponent(ani);
		}
	}
}
