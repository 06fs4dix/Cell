var g_communityArr=new Array();
function CommunityArr_Init(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	for(var i=0;i<dummy.value.length;++i)
	{
		var com=new CCommunityCondition();
		com.Deserialize(dummy.value[i]);
		g_communityArr.push(com);
	}
}
function CCommunityCondition()
{
	this.m_offset;
	this.m_key;
	this.m_vpao=new CVPAndOr(); 
	this.m_action=new CCommunityAction();
	this.m_fItYou=false;
}
CCommunityCondition.prototype=new ISerialize();
CCommunityCondition.prototype.constructor=CCommunityCondition;
CCommunityCondition.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CCommunityCondition";
	pac.Push(this.m_offset);
	pac.Push(this.m_key);
	pac.Push(this.m_vpao);
	pac.Push(this.m_action);
	pac.Push(this.m_fItYou);
	return pac;
}
CCommunityCondition.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_key=dummy.value[1];
	this.m_vpao.Deserialize(dummy.value[2]);
	this.m_action.Deserialize(dummy.value[3]);
	this.m_fItYou=dummy.value[4]=="true"?true:false;
	
}

function CCommunityAction()
{
	this.m_text="";
	this.m_function=-1;
}
CCommunityAction.prototype=new ISerialize();
CCommunityAction.prototype.constructor=CCommunityAction;
CCommunityAction.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CCommunityAction";
	pac.Push(this.m_text);
	pac.Push(this.m_function);
	return pac;
}
CCommunityAction.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_text=dummy.value[0];
	this.m_function=Number(dummy.value[1]);
}