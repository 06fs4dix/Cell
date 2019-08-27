var CVProcess_eCondition_Never=0;
var CVProcess_eCondition_Less=1;
var CVProcess_eCondition_Equal=2;
var CVProcess_eCondition_Greater=3;
var CVProcess_eCondition_NotEqual=4;
var CVProcess_eCondition_LessEqual=5;
var CVProcess_eCondition_GreaterEqual=6;
var CVProcess_eCondition_Always=7;
var CVProcess_eCondition_And=8;
var CVProcess_eCondition_Or=9;

var CvMap_eTag_Qt="Qt";
	
function CVProcess() 
{
	this.m_key="";
	this.m_value=0;
	this.m_condition=0;
}
CVProcess.prototype=new ISerialize();
CVProcess.prototype.constructor	=CVProcess;
CVProcess.prototype.Process=function(_vMap)
{
	var val=_vMap.get(this.m_key);
	if(val==null)//널은 0으로 생각한다
		val=0;
	
	if(CVProcess_eCondition_Never==this.m_condition)
		return false;
	else if(CVProcess_eCondition_Less==this.m_condition)
		return val<this.m_value;
	else if(CVProcess_eCondition_Equal==this.m_condition)
		return val==this.m_value;
	else if(CVProcess_eCondition_Greater==this.m_condition)
		return val>this.m_value;
	else if(CVProcess_eCondition_NotEqual==this.m_condition)
			return val!=this.m_value;
	else if(CVProcess_eCondition_LessEqual==this.m_condition)
		return val<=this.m_value;
	else if(CVProcess_eCondition_GreaterEqual==this.m_condition)
		return val>=this.m_value;
	
	return true;
}
CVProcess.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CVProcess";
	pac.Push(this.m_key);
	pac.Push(this.m_value);
	pac.Push(this.m_condition);
	
	return pac;
}
CVProcess.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	this.m_key=dummy.value[0];
	this.m_value=Number(dummy.value[1]);
	this.m_condition=Number(dummy.value[2]);
}
//key:1,<;
CVProcess.prototype.StringToData=function(_str)
{
	var arr0=_str.split(":");
	this.m_key=arr0[0];
	var arr1=arr0[1].split(",");
	this.m_value=Number(arr1[0]);
	if(arr1[1]=="<")
		this.m_condition=CVProcess_eCondition_Less;
	else if(arr1[1]=="==")
		this.m_condition=CVProcess_eCondition_Equal;
	else if(arr1[1]==">")
		this.m_condition=CVProcess_eCondition_Greater;
	else if(arr1[1]=="!=")
		this.m_condition=CVProcess_eCondition_NotEqual;
	else if(arr1[1]=="<=")
		this.m_condition=CVProcess_eCondition_LessEqual;
	else if(arr1[1]==">=")
		this.m_condition=CVProcess_eCondition_GreaterEqual;
	else if(arr1[1]=="true")
		this.m_condition=CVProcess_eCondition_Always;
	else if(arr1[1]=="false")
		this.m_condition=CVProcess_eCondition_Never;
	else if(arr1[1]=="&&")
		this.m_condition=CVProcess_eCondition_And;
	else if(arr1[1]=="||")
		this.m_condition=CVProcess_eCondition_Or;
	else
		this.m_condition=Number(arr1[1]);
}
CVProcess.prototype.DataToStr=function()
{
	var all=this.m_key+":"+this.m_value+",";
	if(CVProcess_eCondition_Less==this.m_condition)
		all+="<";
	else if(CVProcess_eCondition_Equal==this.m_condition)
		all+="==";
	else if(CVProcess_eCondition_Greater==this.m_condition)
		all+=">";
	else if(CVProcess_eCondition_NotEqual==this.m_condition)
		all+="!=";
	else if(CVProcess_eCondition_LessEqual==this.m_condition)
		all+="<=";
	else if(CVProcess_eCondition_GreaterEqual==this.m_condition)
		all+=">=";
	else if(CVProcess_eCondition_Always==this.m_condition)
		all+="true";
	else if(CVProcess_eCondition_Never==this.m_condition)
		all+="false";
	else if(CVProcess_eCondition_And==this.m_condition)
		all+="&&";
	else if(CVProcess_eCondition_Or==this.m_condition)
		all+="||";
	else
		all+=this.m_condition;
	
	
	return all;
}
function CVPAndOr() 
{
	this.m_andVp=new Array();
	this.m_orVp=new Array();
}
CVPAndOr.prototype=new ISerialize();
CVPAndOr.prototype.constructor	=CVPAndOr;
CVPAndOr.prototype.Process=function(_vMap)
{
	for(var i=0;i<this.m_andVp.length;++i)
	{
		if(!this.m_andVp[i].Process(_vMap))
		{
			return false;
		}
	}
	if(this.m_orVp.length==0)
		return true;
	//하나라도 맞으면 패스 안함
	for(var i=0;i<this.m_orVp.length;++i)
	{
		
		if(this.m_orVp[i].Process(_vMap))
		{
			return true;
		}
	}
	return false;
}
CVPAndOr.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CVPAndOr";
	pac.Push(this.m_andVp);
	pac.Push(this.m_orVp);
	
	return pac;
}
CVPAndOr.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	var dummy3=new CPacket();
	dummy3.Deserialize(dummy.value[0]);
	for(var i=0;i<dummy3.value.length;++i)
	{
		var vp=new CVProcess();
		vp.Deserialize(dummy3.value[i]);
		this.m_andVp.push(vp);
	}
	
	var dummy4=new CPacket();
	dummy4.Deserialize(dummy.value[1]);
	for(var i=0;i<dummy4.value.length;++i)
	{
		var vp=new CVProcess();
		vp.Deserialize(dummy4.value[i]);
		this.m_orVp.push(vp);
	}

}
