package cell;



public class CPacketZone extends CPacketSmart
{
	public void AbilityRefresh(String _key,CAbility _pAb,CAbility _mAb,CVec3 _pos)
	{
		name="AbilityRefresh";
		Push(_key);
		Push(_pAb);
		Push(_mAb);
		m_pos=_pos;
	}
	public void Text(String _text,CVec3 _pos,CVec4 _color,int _delay,float _scale,String _pzTraking)
	{
		name="Text";
		Push(_text);
		Push(_pos);
		Push(_color);
		Push(_delay);
		Push(_scale);
		Push(_pzTraking);
		m_pos=_pos;
	}
	public void Stalk(String _text,CUser _user,CVec3 pos)
	{
		m_accepter=_user;
		Text(_text,pos,new CVec4(1,1,1,0),1000*10,1.0f,"");
	}
	public void EffectCreate(CVec3 _pos,float _w,float _h,int _aniOff,CVec3 _angle,String _tarPzKey,float _offX,float _offY)
	{
		name="EffectCreate";
		Push(_pos);
		Push(_w);
		Push(_h);
		Push(_aniOff);
		Push(_angle);
		Push(_tarPzKey);
		Push(_offX);
		Push(_offY);
		m_pos=_pos;
	}
	public void FindPath(String _key,CVec3 _pos,String _target,int _pathType)
	{
		m_in=true;
		m_thread=true;
		name="FindPath";
		Push(_key);
		Push(_pos);
		Push(_target);
		Push(_pathType);
	}
	public void Attack(String _key)
	{
		m_in=true;
		name="Attack";
		Push(_key);
		Push("null");
	}
	public void PushObject(CObject _obj)
	{
		name="PushObject";
		Push(_obj.GetKey());
		if(_obj instanceof CUser)
			Push("CUser");
		else if(_obj instanceof CMonster)
			Push("CMonster");
		else if(_obj instanceof CNpc)
			Push("CNpc");
		else if(_obj instanceof CItem)
			Push("CItem");
		else if(_obj instanceof CProjectile)
			Push("CProjectile");
		Push(_obj);
	}
	public void RemoveObject(CObject _obj)
	{
		name="RemoveObject";
		Push(_obj.GetKey());
		if(_obj instanceof CProtozoa)
			Push("CProtozoa");
		else if(_obj instanceof CItem)
			Push("CItem");
		else if(_obj instanceof CProjectile)
			Push("CProjectile");
	}
	public void RemoveObject(String _key,CObject _obj)
	{
		name="RemoveObject";
		Push(_key);
		if(_obj instanceof CProtozoa)
			Push("CProtozoa");
		else if(_obj instanceof CItem)
			Push("CItem");
		else if(_obj instanceof CProjectile)
			Push("CProjectile");
	}
	public void PopupMsg(CUser _user,int _msg)
	{
		name="PopupMsg";
		m_accepter=_user;
		Push(_msg);
	}
	public void Cursor(CUser _user,CVec3 _pos,String _target,int _type)
	{
		name="Cursor";
		m_accepter=_user;
		Push(_user.GetKey());
		Push(_pos);
		Push(_target);
		Push(_type);
	}
	public void Die(String _key)
	{
		m_in=true;
		name="Die";
		Push(_key);
	}
	public void Sound(String _key)
	{
		name="Sound";
		Push(_key);
	}
	public void GetBuySell2(CNpc _npc,CUser _user)
	{
		m_accepter=_user;
		name="GetBuySell2";
		Push(_npc.GetInven());
		Push(_user.GetInven());
		Push(_user.GetGold());
		Push(_npc.GetKey());
		Push(_npc.m_sellPercent);
		Push(_npc.m_buyPercent);
		
	}
	public void CommynityAction(CNpc _npc,CUser _user,String _text)
	{
		m_accepter=_user;
		name="CommynityAction";
		Push(_npc.GetKey());
		Push(_npc.GetActionAniBasic());
		Push(_text);
	}
	public void Chat(String _text)
	{
		name="Chat";
		Push(_text);
	}
	public void Sun(int _type)
	{
		name="Sun";
		Push(_type);
	}
	public void PotionCount(CUser _user)
	{
		name="PotionCount";
		m_accepter=_user;
		
		if(_user.FindItemtoOffset(24)==-1)
			Push(false);
		else
			Push(true);
	}
	public void Wield(CProtozoa _pro)
	{
		name="Wield";
		m_in=true;
		Push(_pro.GetKey());
	}
	public void Shot(CProtozoa _pro,int _shotType,CVec3 _pos,CVec3 _dir,
			float _power,CProjectileSkill _sk,CProtozoa _track,boolean _penetrate,int _len)
	{
		name="Shot";
		m_in=true;
		Push(_pro.GetKey());
		Push(_shotType);
		Push(_pos);
		Push(_dir);
		Push(_power);
		Push(_sk);
		if(_track==null)
			Push("null");
		else
			Push(_track.GetKey());
		Push(_penetrate);
		Push(_len);
		
		
	}
	public void Shake(CUser _user,int _time)
	{
		name="Shake";
		m_accepter=_user;
		Push(_time);
	}
	public void SMQ(String _type,String _key,CRigidBody _rb,CVec3 _pos)
	{
		name="SMQ";
		Push(_key);
		Push(_rb.Serialize());
		Push(_pos);
		Push(_type);
		m_pos=_pos;
	}
	
}
