class CMovement extends ISerialize
{
	constructor(_key,_dir,_pow)
	{
		super();
		
		if(typeof _key == 'undefined')
		{
			this.m_key = "";
			this.m_direction = new CVec3();
			this.m_power = 0;
		}
		else
		{
			this.m_key = _key+"";
			this.m_direction = _dir;
			this.m_power = _pow;
		}
		
		
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.Push(this.m_key);
		pac.Push(this.m_direction);
		pac.Push(this.m_power);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		this.m_key = pac.GetString(0);
		this.m_direction.Deserialize(pac.GetString(1));
		this.m_power = pac.GetFloat(2);
	}
}
class CRigidBody extends CComponent
{
	constructor()
	{
		super();
		this.m_moveQue=new Array();
	}
	GetCComponentType() { return Df.CComponent.CRigidbody; }
	GetKey() { return ""; }
	GetMoveQue()	{	return this.m_moveQue;	}
	Update(_pos,_delay)
	{
		var rval = _pos.toCopy();
		for (var i = 0; i < this.m_moveQue.size(); ++i)
		{
			var dtime = _delay * 0.001;
			var res = CMath.Vec3MulFloat(CMath.Vec3MulFloat(this.m_moveQue[i].m_direction, this.m_moveQue[i].m_power), dtime);
			rval = CMath.Vec3PlusVec3(rval, res);
		}
		return rval;
	}
	Push(move)
	{
		for (var i = 0; i < this.m_moveQue.size(); ++i)
		{
			if (this.m_moveQue[i].m_key.equals(move.m_key))
			{
				return;
			}
		}
		this.m_moveQue.push_back(move);
	}
	Remove(_key)
	{
		for (var i = 0; i < this.m_moveQue.size(); ++i)
		{
			if (this.m_moveQue[i].m_key.equals(_key+""))
			{
				this.m_moveQue.splice(i,1);
				break;
			}
		}
	}
	IsEmpty(_key)
	{
		for (var i = 0; i < this.m_moveQue.size(); ++i)
		{
			if (this.m_moveQue[i].m_key.equals(_key))
			{
				return false;
			}
		}
		return true;
	}
	Clear() { this.m_moveQue=new Array(); }
	MoveDir()
	{
		var rVal =new CVec3();
		for (var i = 0; i < this.m_moveQue.size(); ++i)
		{
			var dirPower = CMath.Vec3MulFloat(this.m_moveQue[i].m_direction,this.m_moveQue[i].m_power);
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
	Serialize()
	{
		var pac = new CPacket();
		pac.name = "CRigidBody";
		pac.Push(super.Serialize());
		pac.Push(this.m_moveQue);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		var pac2 = new CPacket();
		pac2.Deserialize(pac.GetString(1));
		for (var i = 0; i < pac2.value.size(); ++i)
		{
			var move = new CMovement();
			move.Deserialize(pac2.value[i]);
			this.m_moveQue.push_back(move);

		}
	}
}