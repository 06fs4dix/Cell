function CTreeNode()
{
	this.key="";
	this.data=null;
	this.childe = null;
	this.colleague = null;
	
};
CTreeNode.prototype.colleagueAdd=function(_key)
{
	if (this.colleague == null)
	{
		this.colleague = new CTreeNode();
		this.colleague.key = _key;
	}
	else
	{
		return this.colleague.colleagueAdd(_key);
	}
	return this.colleague;
}
CTreeNode.prototype.childeAdd=function(_key)
{
	if (this.childe == null)
	{
		this.childe = new CTreeNode();
		this.childe.key = _key;
	}
	else
	{
		return this.childe.colleagueAdd(_key);
	}
	return this.childe;
}
CTreeNode.prototype.find=function(_key)
{
	if (_key == this.key)
		return this;

	var dum = null;
	if (this.childe != null)
	{
		dum=this.childe.find(_key);
		if (dum != null)
			return dum;
	}
	if (this.colleague != null)
	{
		dum = this.colleague.find(_key);
		if (dum != null)
			return dum;
	}
	return null;
}

function CTree()
{
	this.m_root=new CTreeNode();
};

CTree.prototype.find=function(_key)
{
	var dum = this.m_root.find(_key);
	if (dum == null)
	{
		if (this.m_root.key.equals(_key))
			return this.m_root;
		return null;
	}
		
	return dum;
}