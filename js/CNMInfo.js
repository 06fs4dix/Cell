function CDrop()
{
	this.m_itemOff;
	this.m_rate;
	this.m_mount;
	this.m_gRate;
}

function CNMInfo()
{
	this.m_NMType;
	this.m_key;
	this.m_actionAniVec=new Array();
	this.m_startPos="";
	this.m_size=new CVec2();
	this.m_aiName;
	this.m_aiOption="";
	this.m_ability=new CAbility();
	this.m_dropVec=new Array();
	
	this.m_level=0;
	this.m_group=5;
	
	this.m_nick="";
	this.m_escapeHp=0;
	this.m_resurrectionTime=0;
	this.m_activeTime=0;
	this.m_searchLen=0;
	this.m_returnLen=0;
	this.m_escape=0;
	this.m_counterAttack=0;
	this.m_tramp=0;
	this.m_revenge=0;
	this.m_attack=0;
	this.m_effect=0;
	
}
CNMInfo.prototype=new ISerialize();	
CNMInfo.prototype.constructor=CNMInfo;
CNMInfo.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CNMInfo";
	pac.Push(this.m_NMType);
	pac.Push(this.m_key);
	pac.Push(this.m_actionAniVec);
	pac.Push(this.m_startPos);
	pac.Push(this.m_size);
	pac.Push(this.m_aiOption);
	pac.Push(this.m_ability);
	pac.Push(this.m_dropVec);

	pac.Push(this.m_level);
	pac.Push(this.m_group);
	
	
	
	pac.Push(this.m_nick);
	pac.Push(this.m_escapeHp);
	pac.Push(this.m_resurrectionTime);
	pac.Push(this.m_activeTime);
	pac.Push(this.m_searchLen);
	pac.Push(this.m_returnLen);
	pac.Push(this.m_escape);
	pac.Push(this.m_counterAttack);
	pac.Push(this.m_tramp);
	pac.Push(this.m_revenge);
	pac.Push(this.m_attack);
	pac.Push(this.m_effect);
	
	
	
	return pac;
}
CNMInfo.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_NMType=Number(dummy.value[0]);
	this.m_key=dummy.value[1];
	var dum=new CPacket();
	dum.Deserialize(dummy.value[2]);
	for(var i=0;i<dum.value.length;++i)
	{
		this.m_actionAniVec.push(dum.value[i]);
	}

	this.m_startPos=dummy.value[3];
	this.m_size.Deserialize(dummy.value[4]);
	this.m_aiOption=dummy.value[5];
	this.m_ability.Deserialize(dummy.value[6]);
	var pac=new CPacket();
	pac.Deserialize(dummy.value[7]);
	for(var i=0;i<pac.value.length;++i)
	{
		var info=new CDropInfo();
		info.Deserialize(pac.value[i]);
		this.m_dropVec.push(info);
	}

	this.m_level=Number(dummy.value[8]);
	this.m_group=Number(dummy.value[9]);
	
	this.m_nick=dummy.GetString(10);
	this.m_escapeHp=dummy.GetFloat(11);
	this.m_resurrectionTime=dummy.GetInt32(12);
	this.m_activeTime=dummy.GetInt32(13);
	this.m_searchLen=dummy.GetInt32(14);
	this.m_returnLen=dummy.GetInt32(15);
	this.m_escape=dummy.GetBool(16);
	this.m_counterAttack=dummy.GetBool(17);
	this.m_tramp=dummy.GetBool(18);
	this.m_revenge=dummy.GetBool(19);
	this.m_attack=dummy.GetInt32(20);
	this.m_effect=dummy.GetInt32(21);
	
	
}