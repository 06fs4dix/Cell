function JSDfCRenObj()
{
	this.CObject = 0;
	this.CMolecule = 1;
	this.Count = 2;
	this.Null = 3;
};
var DfCRenObj=new JSDfCRenObj();

var g_RenObjOff=0;
class CRenObj extends ISerialize 
{
	constructor()
	{
		super();
		this.m_key="";
		this.m_keyChange="";
		this.m_offset=g_RenObjOff++;
		this.m_show=true;
	}
	
	GetRemove() { return this.m_remove;	 }
	GetKeyChange() {	return this.m_keyChange; }
	ClearKeyChange() { this.m_keyChange = "";	 }
	SetShow(_show) { this.m_show = _show; }
	GetShow() { return this.m_show;	 }
	GetCRenObjType()
	{
		return DfCRenObj.Null;
	}
	GetOffset()
	{
		return this.m_offset;
	}
	GetCPaint()
	{
		var dummy=new Array();
		return dummy;
	}
	GetKey() { return this.m_key; }
	SetKey(_key) 
	{
		if(this.m_key==_key)
			return;
		if(this.m_key.isEmpty()==false)
			this.m_keyChange = this.m_key;
		this.m_key = _key; 	
	}
	CanvasKeySet(_key) { this.m_key = _key;	 }
	Serialize()
	{
		var pac=new CPacket();
		pac.Push(this.m_offset);
		pac.Push(this.m_key);
		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		this.m_offset = pac.GetInt32(0);
		this.m_key = pac.GetString(1);
	}
};

