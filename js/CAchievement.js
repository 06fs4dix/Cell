function CQuest()
{
	this.m_offset;
	this.m_img;
	this.m_success=new CVPAndOr();
	this.m_location;
	this.m_guide;
	this.m_cameraMove;
	this.m_cmt=new CCommunityAction();
	
	
}
CQuest.prototype=new ISerialize();
CQuest.prototype.constructor=CQuest;
CQuest.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CQuest";
	pac.Push(this.m_offset);
	pac.Push(this.m_img);
	pac.Push(this.m_success);
	pac.Push(this.m_location);
	pac.Push(this.m_guide);
	pac.Push(this.m_cameraMove);
	pac.Push(this.m_cmt);

	
	return pac;
}
CQuest.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_img=dummy.value[1];
	this.m_success.Deserialize(dummy.value[2]);
	this.m_location=dummy.value[3];
	this.m_guide=dummy.value[4]=="true";
	this.m_cameraMove=dummy.value[5]=="true";
	this.m_cmt.Deserialize(dummy.value[6]);
}
function CAchievement()
{
	this.m_offset;
	this.m_subject;
	this.m_img;
	this.m_revelation=new CVPAndOr();//CVProcess
	this.m_zone;
	this.m_quest=new Array();
	this.m_item=new Array();
}
CAchievement.prototype=new ISerialize();
CAchievement.prototype.constructor=CAchievement;
CAchievement.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CAchievement";
	pac.Push(this.m_offset);
	pac.Push(this.m_subject);
	pac.Push(this.m_img);
	pac.Push(this.m_revelation);
	pac.Push(this.m_zone);
	pac.Push(this.m_quest);
	pac.Push(this.m_item);

	return pac;
}
CAchievement.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_subject=dummy.value[1];
	this.m_img=dummy.value[2];

	this.m_revelation.Deserialize(dummy.value[3]);
	this.m_zone=dummy.value[4];
	
	var dummy1=new CPacket();
	dummy1.Deserialize(dummy.value[5]);
	for(var i=0;i<dummy1.value.length;++i)
	{
		var quest=new CQuest();
		quest.Deserialize(dummy1.value[i]);
		this.m_quest.push(quest);
	}
	
	var dummy2=new CPacket();
	dummy2.Deserialize(dummy.value[6]);
	for(var i=0;i<dummy2.value.length;++i)
	{
		var item=new CDropInfo();
		item.Deserialize(dummy2.value[i]);
		this.m_item.push(item);
	}
}
var g_achArr=new Array();
