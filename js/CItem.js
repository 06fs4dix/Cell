
class CItem extends CObject
{
	constructor()
	{
		super();
		
		this.m_pt=null;
		this.m_co=null;
		
		this.m_size=new CVec2();
		this.m_inven=new CInventoryInfo();
	}
	
	
	Update(_delay)
	{
		super.Update(_delay);
		
	}
	Serialize()
	{
		var pac=new CPacket();
		//pac.Push(super.Serialize());
		
		pac.Push(this.m_offset);
		pac.Push(this.m_key);
		
		pac.Push(this.m_pos);
		pac.Push(this.m_rot);
		pac.Push(this.m_sca);
		

		pac.Push(this.m_size);

		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);


		this.m_offset = pac.GetInt32(0);
		this.m_key=pac.GetString(1);

		this.m_pos.Deserialize(pac.GetString(2));
		this.m_rot.Deserialize(pac.GetString(3));
		this.m_sca.Deserialize(pac.GetString(4));


		pac.GetISerialize(5, this.m_size);
		
		pac.GetISerialize(6, this.m_inven);

		//if(g_itemInfoArr.lenght==0)
			//alert(g_itemInfoArr[this.m_inven.m_itemOff].m_img);
		this.m_pt = new CPaintBillbord(this.m_size,g_itemInfoArr[this.m_inven.m_itemOff].m_img);
		super.PushCComponent(this.m_pt);
		
		this.PRSReset();
		
	}
	
}
//===================================================================================
function CReinforce()
{
	this.m_max=0;
	this.m_one=0;
	this.m_two=0;
	this.m_three=0;
	this.m_rate=0;
	this.m_ability=new CAbility();
}
CReinforce.prototype=new ISerialize();
CReinforce.prototype.constructor	=CReinforce;
CReinforce.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CReinforce";
	pac.Push(this.m_max);
	pac.Push(this.m_one);
	pac.Push(this.m_two);
	pac.Push(this.m_three);
	pac.Push(this.m_rate);
	pac.Push(this.m_ability);
	return pac;
}
CReinforce.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_max=Number(dummy.value[0]);
	this.m_one=Number(dummy.value[1]);
	this.m_two=Number(dummy.value[2]);
	this.m_three=Number(dummy.value[3]);
	this.m_rate=Number(dummy.value[4]);
	this.m_ability.Deserialize(dummy.value[5]);
}

//==============================================================================
function CInventoryInfo()
{
	this.m_offset=0;
	this.m_itemOff=0;
	this.m_amount=0;
	this.m_reinforceCount=0;
	this.m_durability=-1;
	
	this.m_fCount=0;
	this.m_iCount=0;
	this.m_eCount=0;
	this.m_pCount=0;
}
CInventoryInfo.prototype=new ISerialize();
CInventoryInfo.prototype.constructor	=CInventoryInfo;
CInventoryInfo.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CInventoryInfo";
	pac.Push(this.m_offset);
	pac.Push(this.m_itemOff);
	pac.Push(this.m_amount);
	pac.Push(this.m_reinforceCount);
	pac.Push(this.m_durability);
	pac.Push(this.m_fCount);
	pac.Push(this.m_iCount);
	pac.Push(this.m_eCount);
	pac.Push(this.m_pCount);
	return pac;
}
CInventoryInfo.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_itemOff=Number(dummy.value[1]);
	this.m_amount=Number(dummy.value[2]);
	if(dummy.value.length<=4)
		return;
	
	this.m_reinforceCount=Number(dummy.value[3]);
	this.m_durability=Number(dummy.value[4]);
	
	this.m_fCount=Number(dummy.value[5]);
	this.m_iCount=Number(dummy.value[6]);
	this.m_eCount=Number(dummy.value[7]);
	this.m_pCount=Number(dummy.value[8]);
}
function CDropInfo()
{
	this.m_itemOff=0;
	this.m_amount=0;
	this.m_drop=0;//10000/1
}
CDropInfo.prototype=new ISerialize();
CDropInfo.prototype.constructor	=CDropInfo;
CDropInfo.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CDropInfo";
	pac.Push(this.m_itemOff);
	pac.Push(this.m_amount);
	pac.Push(this.m_drop);
	return pac;
}
CDropInfo.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	
	//this.m_itemOff=Number(dummy.value[1]);
	//this.m_amount=Number(dummy.value[2]);
	
	
	this.m_itemOff=Number(dummy.value[0]);
	this.m_amount=Number(dummy.value[1]);
	this.m_drop=Number(dummy.value[2]);
	
}
//======================================================================
var g_setItemArr=new Array();
//function SetItemArr_Init(_str)
//{
//	g_setItemArr=new Array();
//	var dummy=new CPacket();
//	dummy.Deserialize(_str);
//	for(var i=0;i<dummy.value.length;++i)
//	{
//		var iInfo=new CSetItem();
//		iInfo.Deserialize(dummy.value[i]);
//		g_setItemArr.push(iInfo);
//	}
//}
function CSetItem()
{
	this.m_offset=0;
	this.m_skill=-1;
	this.m_itemOff=new Array();
	this.m_ability=null;
	this.m_text="";
}
CSetItem.prototype=new ISerialize();
CSetItem.prototype.constructor	=CSetItem;
CSetItem.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CSetItem";
	pac.Push(this.m_offset);
	pac.Push(this.m_skill);
	pac.Push(this.m_itemOff);
	pac.Push(this.m_ability);
	pac.Push(this.m_text);
	return pac;
}
CSetItem.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_skill=Number(dummy.value[1]);
	var pac0=new CPacket();
	pac0.Deserialize(dummy.value[2]);
	for(var i=0;i<pac0.value.length;++i)
	{
		if(pac0.value[i]!="")
			this.m_itemOff.push(pac0.value[i]);
	}
	
	if(dummy.value[3]=="null")
		this.m_ability=null;
	else
	{
		this.m_ability=new CAbility();
		this.m_ability.Deserialize(dummy.value[3]);
	}
	this.m_text=dummy.value[4];
}
//================================================================================
function CItemInfo()
{
	this.m_offset;
	this.m_name;
	this.m_img;
	this.m_text;
	this.m_type;
	this.m_gold;
	this.m_dropRate;
	this.m_ability=null;
	this.m_putOnType=new Array();
	this.m_level=0;
	
	
	
	this.m_skill=-1;
	this.m_set=-1;
	this.m_reinforce=null;
	
	this.m_dropMinLevel=-1;
	this.m_dropMaxLevel=-1;
	
	this.m_durabilityMax=-1;
	this.m_discount=false;
}
CItemInfo.prototype=new ISerialize();	
CItemInfo.prototype.constructor=CItemInfo;
CItemInfo.prototype.Get_HtmlText=function(_inv)
{
	var rVal="<font style='text-shadow: 1px 1px 0px #333333'>";
	if(this.m_ability!=null)
	{
		rVal+=this.m_ability.Get_HtmlText(1,1);
		rVal+="<br/>";
	}
	rVal+="<b>가격</b> : <span style=\"color: rgb(241,194,50);\" >"+this.m_gold+"</span>";
	
	if(this.m_discount)
		rVal+=" <font color='red'>할인</font><br/>";
	else
		rVal+="<br/>";
	
	if(this.m_putOnType.length.length!=0)
		rVal+="<b>착용 가능</b> : ";
	for(var i=0;i<this.m_putOnType.length;++i)
	{
		if(this.m_putOnType[i]!="")
			rVal+="<span style=\"color: rgb(243, 112, 76);\">"+CItemSC.GetItemTypeStr(parseInt(this.m_putOnType[i]))+"</span> / ";
	}
	if(this.m_putOnType.length.length!=0)
		rVal+="<br>";
	
	if(this.m_level>0)
		rVal+="<b>레벨제한</b> : <span style=\"color: rgb(30, 30, 255);\">"+this.m_level+"</span><br>";
	
	
	if(_inv!=null)
	{
		rVal+="수량 : "+_inv.m_amount+"<br/><br/>";
		
		if(_inv.m_durability!=-1)
			rVal+="<b>내구도</b> : <span style=\"color: rgb(255, 255, 255);\">"
				+_inv.m_durability+"/"+this.m_durabilityMax+"</span><br>";
		
		if(_inv.m_reinforceCount!=0)
		{
			rVal+="<b>강화</b> : <span style=\"color: #9A2EFE;\">"+_inv.m_reinforceCount+"/"+this.m_reinforce.m_max+" </span><br>";
			if(this.m_reinforce!=null)
				rVal+=this.m_reinforce.m_ability.Get_HtmlText(_inv.m_reinforceCount,this.m_reinforce.m_rate);
			
		}
			
		
		var eCount=(_inv.m_fCount+_inv.m_iCount+_inv.m_eCount+_inv.m_pCount);
		if(eCount!=0)
		{
			rVal+="<b>속성</b> : <span style=\"color: #FF00FF;\">"+eCount+"</span><br>";
			if(CItemSC.FIEPAttChk(this.m_type))
			{
				if(_inv.m_fCount!=0)
					rVal+="<b>화염</b> : <span style=\"color:red;\">"+(_inv.m_fCount*3)+"</span>	";
				if(_inv.m_iCount!=0)
					rVal+="<b>냉기</b> : <span style=\"color:blue;\">"+(_inv.m_iCount*3)+"</span>	";
				if(_inv.m_eCount!=0)
					rVal+="<b>전기</b> : <span style=\"color:yellow;\">"+(_inv.m_eCount*3)+"</span>	";
				if(_inv.m_pCount!=0)
					rVal+="<b>독</b> : <span style=\"color:green;\">"+(_inv.m_pCount*3)+"</span>";
				
				rVal+="<br>";
			}
			else
			{
				if(_inv.m_fCount!=0)
					rVal+="<b>화염 저항력</b> : <span style=\"color:red;\">"+(_inv.m_fCount*3)+"%</span>	";
				if(_inv.m_iCount!=0)
					rVal+="<b>냉기 저항력</b> : <span style=\"color:blue;\">"+(_inv.m_iCount*3)+"%</span>	";
				if(_inv.m_eCount!=0)
					rVal+="<b>전기 저항력</b> : <span style=\"color:yellow;\">"+(_inv.m_eCount*3)+"%</span>	";
				if(_inv.m_pCount!=0)
					rVal+="<b>독 저항력</b> : <span style=\"color:green;\">"+(_inv.m_pCount*3)+"%</span>	";
				rVal+="<br>";
			}
			
			
			
			
		}
	}
	rVal+="<br/>";
	if(this.m_set!=-1 && g_setItemArr.length!=0)
	{
		var set=g_setItemArr[this.m_set];
		rVal+="<span style=\"color:#7CFC00;\"><b>모두 착용시</b><br/>";
		for(var i=0;i<set.m_itemOff.length;++i)
		{
			var item=g_itemInfoArr[set.m_itemOff[i]];
			rVal+=item.m_name;
			if(i!=0 && i%2==0)
				rVal+="<br/>";
			else
				rVal+=" / ";
		}
		rVal+="</span><br/>";
		if(set.m_ability!=null)
			rVal+=set.m_ability.Get_HtmlText(1,1);
		rVal+="<br/>";
	}
		
	
	
	rVal+="<b>설명</b> : "+CST.get(this.m_text)+"<br>";
	rVal+="</font>";
	return rVal;
}
CItemInfo.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.name="CItemInfo";
	pac.Push(this.m_offset);
	pac.Push(this.m_name);
	pac.Push(this.m_img);
	pac.Push(this.m_text);
	pac.Push(this.m_type);
	pac.Push(this.m_gold);
	pac.Push(this.m_dropRate);
	pac.Push(this.m_ability);
	pac.Push(this.m_putOnType);
	pac.Push(this.m_level);
	

	pac.Push(this.m_skill);
	pac.Push(this.m_set);
	pac.Push(this.m_reinforce);
	
	pac.Push(this.m_dropMinLevel);
	pac.Push(this.m_dropMaxLevel);
	pac.Push(this.m_durabilityMax);
	pac.Push(this.m_discount);
	
	return pac;
}
CItemInfo.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	
	this.m_offset=Number(dummy.value[0]);
	this.m_name=dummy.value[1];
	this.m_img=dummy.value[2];
	this.m_text=dummy.value[3];
	this.m_type=Number(dummy.value[4]);
	this.m_gold=Number(dummy.value[5]);
	this.m_dropRate=Number(dummy.value[6]);
	if(dummy.value[7]=="null")
		this.m_ability=null;
	else
	{
		this.m_ability=new CAbility();
		this.m_ability.Deserialize(dummy.value[7]);
	}
	var pac0=new CPacket();
	pac0.Deserialize(dummy.value[8]);
	for(var i=0;i<pac0.value.length;++i)
	{
		if(pac0.value[i]!="")
			this.m_putOnType.push(pac0.value[i]);
	}
	this.m_level=Number(dummy.value[9]);
	
	this.m_skill=Number(dummy.value[10]);
	this.m_set=Number(dummy.value[11]);
	
	if(dummy.value[12]!="null")
	{
		this.m_reinforce=new CReinforce();
		this.m_reinforce.Deserialize(dummy.value[12]);
	}
	
	this.m_dropMinLevel=Number(dummy.value[13]);
	this.m_dropMaxLevel=Number(dummy.value[14]);
	
	this.m_durabilityMax=Number(dummy.value[15]);
	if(dummy.value.size()>16)
		this.m_discount=dummy.value[16]=="true";
}

//=========================================================================
var g_itemInfoArr=new Array();
class CItemInfoScriptWeb
{
	constructor()
	{
		this.Amulet=0;//목걸이  0
		this.Clothes=1;//상의
		this.Weapon=2;//무기
		this.Head=3;//모자
		this.Ring=4;//반지
		this.Hand=5;//손
		this.Pants=6;//하의
		this.Shield=7;//방패
		this.Shoes=8;//신발
		this.Potion=9;//포션
		this.Food=10;//음식
		this.Book=11;// 책
		this.Material=12;//재료
		this.Bow=13;//활   13
		this.CrossBow=14;
		this.Gun=15;
		this.Wand=16;
		this.Rod=17;//17
		this.Axe=18;
		this.Sword=19;//19
		this.LongSword=20;
		this.ShortSword=21;
		this.Spear=22;
		this.Mace=23;
		this.Skill=24;
		this.Quiver=25;
		this.MagicBook=26;
		this.SubHelp=27;
	}
	GetItemTypeStr(_type)
	{
		if(this.Amulet==_type)
			return "목걸이";
		else if(this.Clothes==_type)
			return "장비";
		else if(this.Weapon==_type)
			return "무기";
		else if(this.Head==_type)
			return "머리";
		else if(this.Ring==_type)
			return "반지";
		else if(this.Hand==_type)
			return "장갑";
		else if(this.Pants==_type)
			return "";
		else if(this.Shield==_type)
			return "방패";
		else if(this.Amulet==_type)
			return "목걸이";
		else if(this.Shoes==_type)
			return "신발";
		else if(this.Material==_type)
			return "재료";
		else if(this.Bow==_type)
			return "활";
		else if(this.CrossBow==_type)
			return "쇠뇌";
		else if(this.Sword==_type)
			return "검";
		else if(this.Wand==_type)
			return "지팡이";
		else if(this.Rod==_type)
			return "막대";
		else if(this.Spear==_type)
			return "창";
		else if(this.Mace==_type)
			return "둔기";
		else if(this.Skill==_type)
			return "기술";
		
		return "미정의";
	}
	ItemTypeChk(_type)
	{
		if(this.Bow==_type ||
			this.CrossBow==_type ||
			this.Gun==_type ||
			this.Wand==_type ||
			this.Rod==_type ||
			this.Axe==_type ||
			this.Sword==_type ||
			this.LongSword==_type ||
			this.ShortSword==_type ||
			this.Spear==_type ||
			this.Mace==_type)
			return this.Weapon;
		else if(this.Amulet==_type ||
				this.Clothes==_type ||
				this.Ring==_type ||
				this.Hand==_type ||
				this.Shield==_type ||
				this.Shoes==_type ||
				this.Head==_type ||
				this.Quiver==_type ||
				this.MagicBook==_type ||
				this.SubHelp==_type)
			return this.Puton;
		
		return _type;
	}
	FIEPAttChk(_type)
	{
		if(this.Clothes==_type ||
			this.Shoes==_type ||
			this.Head==_type ||
			this.Amulet==_type)
			return false;
		
		return true;
	}
}
var CItemSC =new CItemInfoScriptWeb();