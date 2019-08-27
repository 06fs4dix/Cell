class CEventComponent extends CComponent
{
	constructor()
	{
		super();
		this.m_cobject=null;
		this.m_icom=this;
		
	}
	Update(_delay) {}
	LastUpdate(_delay) {}
	Init() {}
	Render() {}
	Load() {}
	Collision(_obj) {}
	Pick(_pos) {}
	CameraOut() {}
	CameraJoin(_joinPlane) {}
	Remove(_com) {}
	CanvasDelete() {}
	
	GetCComponentType() { return Df.CComponent.CEventComponent; }
	GetKey() { return CString(); }
	GetCObject() { return m_cobject;	 }
	SetCObject(_obj) { this.m_cobject = _obj; }
	
	ECollision(_com,_obj,_len)
	{
		this.m_icom = _com;
		this.Collision(_obj,_len);
	}
	EPick(_com,_pos)
	{
		this.m_icom = _com;
		this.Pick(_pos);
	}
	ECameraOut(_com)
	{
		this.m_icom = _com;
		this.CameraOut();
	}
	ECameraJoin(_com,_joinPlane)
	{
		this.m_icom = _com;
		this.CameraJoin(_joinPlane);
	}
	EICompontRemove(_com)
	{
		this.m_icom = _com;
		this.Remove(_com);
	}

}