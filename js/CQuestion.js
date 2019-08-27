
function CQuestion()
{
	this.m_offset;
	this.m_key;
	this.m_subject;
	this.m_action=new CCommunityAction();
	this.m_vpao=new CVPAndOr();
	
}
CQuestion.prototype=new ISerialize();
CQuestion.prototype.constructor=CQuestion;
CQuestion.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CQuestion";
	pac.Push(this.m_offset);
	pac.Push(this.m_key);
	pac.Push(this.m_subject);
	pac.Push(this.m_action);
	pac.Push(this.m_vpao);

	return pac;
}
CQuestion.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_key=dummy.value[1];
	this.m_subject=dummy.value[2];
	this.m_action.Deserialize(dummy.value[3]);
	this.m_vpao.Deserialize(dummy.value[4]);

}