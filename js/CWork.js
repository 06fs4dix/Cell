var g_workArr=new Array();

function CWork()
{
	this.m_offset;
	this.m_subject;
	this.m_community;
	this.m_need=new Array();
	this.m_result=new Array();
	this.m_gold;
	this.m_vpao=new CVPAndOr();
	this.m_key;
}
CWork.prototype=new ISerialize();
CWork.prototype.constructor=CWork;
//CWork.prototype.ProbabilityCacResult=function()
//{
//	var res=new Array();
//	for(var i=0;i<this.m_result.length;++i)
//	{
//		var inven=new CInventoryInfo();
//		inven.m_offset=this.m_result[i].m_offset;
//		inven.m_itemOff=this.m_result[i].m_itemOff;
//		inven.m_amount=this.m_result[i].m_amount/this.m_probability;
//		inven.m_offset=null;
//		
//		res.push(inven);
//	}
//	return res;
//}
CWork.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CWork";
	pac.Push(this.m_offset);
	pac.Push(this.m_subject);
	pac.Push(this.m_community);
	pac.Push(this.m_need);
	pac.Push(this.m_result);
	pac.Push(this.m_key);
	pac.Push(this.m_gold);
	pac.Push(this.m_vpao);

	return pac;
}
CWork.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_subject=dummy.value[1];
	this.m_community=dummy.value[2];
	var dummy1=new CPacket();
	dummy1.Deserialize(dummy.value[3]);
	for(var i=0;i<dummy1.value.length;++i)
	{
		var inven=new CDropInfo();
		inven.Deserialize(dummy1.value[i]);
		this.m_need.push(inven);
	}
	var dummy2=new CPacket();
	dummy2.Deserialize(dummy.value[4]);
	for(var i=0;i<dummy2.value.length;++i)
	{
		var inven=new CDropInfo();
		inven.Deserialize(dummy2.value[i]);
		this.m_result.push(inven);
	}
	this.m_key=dummy.value[5];
	this.m_gold=Number(dummy.value[6]);
	this.m_vpao.Deserialize(dummy.value[7]);

	
	
	
}
