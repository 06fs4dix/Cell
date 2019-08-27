function CEvent(_event,_class)
{
	if(typeof _event!='undefined')
		this.m_event=_event;
	else
		this.m_event=null;
	if(typeof _class!='undefined')
		this.m_class=_class;
	else
		this.m_class=null;
}
CEvent.prototype.Call=function(_val)
{
	
	if(this.m_class!=null)
	{
		if(typeof _val=='undefined')
			this.m_event.call(this.m_class);
		else
			this.m_event.call(this.m_class,_val);
	}
	else
	{
		if(typeof _val=='undefined')
			this.m_event();
		else
			this.m_event(_val);
	}
	
}
CEvent.prototype.IsCall=function()
{
	
	if(this.m_class==null && this.m_event==null)
		return false;
	return true;
}