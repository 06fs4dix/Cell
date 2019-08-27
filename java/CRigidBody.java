package cell;

import java.util.Vector;

class CMovement implements ISerialize
{
	public CMovement() {}
	public CMovement(String _key, CVec3 _dir, float _pow)
	{
		m_key = _key;
		m_direction = _dir;
		m_power = _pow;
	}
	String m_key="";
	CVec3 m_direction=new CVec3();
	float m_power=0;
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.Push(this.m_key);
		pac.Push(this.m_direction);
		pac.Push(this.m_power);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		this.m_key = pac.GetString(0);
		this.m_direction.Deserialize(pac.GetString(1));
		this.m_power = pac.GetFloat(2);
	}
};
public class CRigidBody extends CComponent
{
	Vector<CMovement> m_moveQue =new Vector<CMovement>();
	
	Vector<CMovement> GetMoveQue()	{	return m_moveQue;	}

	public int GetCComponentType() { return Df.CComponent.CRigidbody; }
	public String GetKey() { return new String(); }
	public CVec3 Update(CVec3 _pos, int _delay)
	{
		CVec3 rval = _pos.toCopy();
		for (int i = 0; i < m_moveQue.size(); ++i)
		{
			float dtime = _delay * 0.001f;
			CVec3 res = CMath.Vec3MulFloat(CMath.Vec3MulFloat(m_moveQue.get(i).m_direction, m_moveQue.get(i).m_power), dtime);
			rval = CMath.Vec3PlusVec3(rval, res);
		}
		return rval;
	}
	public void Push(CMovement move)
	{
		for (int i = 0; i < m_moveQue.size(); ++i)
		{
			if (m_moveQue.get(i).m_key.equals(move.m_key))
			{
				return;
			}
		}
		m_moveQue.add(move);
	}
	public void Remove(String _key)
	{
		for (int i = 0; i < m_moveQue.size(); ++i)
		{
			if (m_moveQue.get(i).m_key.equals(_key))
			{
				m_moveQue.remove(i);
				break;
			}
		}
	}
	public boolean IsEmpty(String _key)
	{
		for (int i = 0; i < m_moveQue.size(); ++i)
		{
			if (m_moveQue.get(i).m_key.equals(_key))
			{
				return false;
			}
		}
		return true;
	}
	public void Clear() { m_moveQue.clear(); }
	CVec3 MoveDir()
	{
		CVec3 rVal =new CVec3();
		for (int i = 0; i < m_moveQue.size(); ++i)
		{
			CVec3 dirPower = CMath.Vec3MulFloat(m_moveQue.get(i).m_direction,m_moveQue.get(i).m_power);
			rVal = CMath.Vec3PlusVec3(rVal, dirPower);
		}
		if (rVal.x == 0 && rVal.y == 0 && rVal.z == 0)
		{
		}
		else
		{
			rVal = CMath.Vec3Normalize(rVal);
		}
		return rVal;
	}
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CRigidBody";
		pac.Push(super.Serialize());
		pac.Push(this.m_moveQue);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		var pac2 = new CPacket();
		pac2.Deserialize(pac.GetString(1));
		for (var i = 0; i < pac2.value.size(); ++i)
		{
			CMovement move = new  CMovement();
			move.Deserialize(pac2.value.get(i));
			m_moveQue.add(move);

		}


	}
};