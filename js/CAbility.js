
class CAbility extends ISerialize
{
	constructor()
	{
		super();
		this.m_PA=0;//Physical Attack 물리 공격
		this.m_PD=0;//Physical Defence
		this.m_H=0;// Health 체력

		this.m_AS=0;//Attack Speed //공속
		this.m_MS=0;//Movement Speed 이속
		this.m_AL=0;//Physical Attack Length물리 공격 거리
		
		
		this.m_MA=0;//Magic Attack
		
		this.m_MD=0;//Magic Defence
		this.m_MP=0;//Magic Point
		this.m_HR=0;//Health Recovery
		this.m_MR=0;//마나
		this.m_A=0;//avoid 회피
		this.m_DSR=0;//DamageSussceRate적중률
		this.m_CS=0;//Casting Speed 캐스팅
		this.m_TD=0;//true Damage
		this.m_R=0;//reflect 반사뎀
		this.m_L=0;//Lucky
		
		this.m_PAP=0;//Physical Attack Penetration
		this.m_MAP=0;//Magic Attack Penetration
		this.m_AA=0;
		
		this.m_FIA=0;//fire attack
		this.m_ICA=0;//ice 
		this.m_ELA=0;//electr 
		this.m_POA=0;//poision 
		
		this.m_FID=0;
		this.m_ICD=0;
		this.m_ELD=0;
		this.m_POD=0;
	}
	
	Get_HtmlText(_rc,_rate)
	{
		var rVal="";
		if(this.m_PA!=0)
			rVal+="<b>물리 공격</b> : <span style=\"color: #9932CC;\">"+(this.m_PA*_rc*_rate)+"</span><br>";
		if(this.m_PAP!=0)
			rVal+="<b>물리 관통력</b> : <span style=\"color: #9932CC;\">"+(this.m_PAP*_rc*_rate)+"</span><br>";
		if(this.m_PD!=0)
			rVal+="<b>물리 방어력</b> : <span style=\"color: #9932CC;\">"+(this.m_PD*_rc*_rate)+"</span><br>";
		
		if(this.m_MA!=0)
			rVal+="<b>마법 공격력</b> : <span style=\"color: #008B8B;\">"+(this.m_MA*_rc*_rate)+"</span><br>";
		if(this.m_MAP!=0)
			rVal+="<b>마법 관통력</b> : <span style=\"color: #008B8B;\">"+(this.m_MAP*_rc*_rate)+"</span><br>";
		if(this.m_MD!=0)
			rVal+="<b>마법 방어력</b> : <span style=\"color: #008B8B;\">"+(this.m_MD*_rc*_rate)+"</span><br>";
		
		if(this.m_A!=0)
			rVal+="<b>회피</b> : <span style=\"color: #BDB76B;\">"+(this.m_A*_rc*_rate)+"</span><br>";
		if(this.m_DSR!=0)
			rVal+="<b>적중률</b> : <span style=\"color: #BDB76B;\">"+(this.m_DSR*_rc*_rate)+"</span><br>";
		
		if(this.m_AS!=0)
			rVal+="<b>공격속도</b> : <span style=\"color: rgb(243, 112, 76);\">"+((this.m_AS*_rc*_rate)/1000.0)+"초</span><br>";
		if(this.m_AL!=0)
			rVal+="<b>공격 거리</b> : <span style=\"color: rgb(243, 112, 76);\">"+(this.m_AL*_rc*_rate)+"</span><br>";
		if(this.m_CS!=0)
			rVal+="<b>시전 속도</b> : <span style=\"color: rgb(243, 112, 76);\">"+(this.m_CS*_rc*_rate)+"</span><br>";
		
		if(this.m_H!=0)
			rVal+="<b>체력</b> : <span style=\"color: #DC143C;\">"+(this.m_H*_rc*_rate)+"</span><br>";
		if(this.m_HR!=0)
			rVal+="<b>체력 회복력</b> : <span style=\"color: #DC143C;\">"+(this.m_HR*_rc*_rate)+"</span><br>";
		
		if(this.m_MP!=0)
			rVal+="<b>마나</b> : <span style=\"color: #6495ED;\">"+(this.m_MP*_rc*_rate)+"</span><br>";
		if(this.m_MR!=0)
			rVal+="<b>마나 회복 속도</b> : <span style=\"color: #6495ED;\">"+(this.m_MR*_rc*_rate)+"</span><br>";
		
		

		if(this.m_MS!=0)
			rVal+="<b>이동 속도</b> : <span style=\"color:  	#7FFF00;\">"+(this.m_MS*_rc*_rate)+"</span><br>";
		

		
		if(this.m_TD!=0)
			rVal+="<b>강제 피해</b> : <span style=\"color: rgb(243, 112, 76);\">"+(this.m_TD*_rc*_rate)+"</span><br>";
		if(this.m_R!=0)
			rVal+="<b>반사율</b> : <span style=\"color: rgb(243, 112, 76);\">"+(this.m_R*_rc*_rate)+"</span><br>";
		if(this.m_L!=0)
			rVal+="<b>행운</b> : <span style=\"color: rgb(243, 112, 76);\">"+(this.m_L*_rc*_rate)+"</span><br>";
		
		if(this.m_AA!=0)
			rVal+="<b>각도</b> : <span style=\"color: rgb(243, 112, 76);\">"+(this.m_AA*_rc*_rate)+"</span><br>";
		
		if(this.m_FIA!=0)
			rVal+="<b>화염</b> : <span style=\"color:red;\">"+(this.m_FIA)+"</span><br>";
		if(this.m_ICA!=0 )
			rVal+="<b>냉기</b> : <span style=\"color:blue;\">"+(this.m_ICA)+"</span><br>";
		if(this.m_ELA!=0 )
			rVal+="<b>전기</b> : <span style=\"color:yellow;\">"+(this.m_ELA)+"</span><br>";
		if(this.m_POA!=0 )
			rVal+="<b>독</b> : <span style=\"color:green;\">"+(this.m_POA)+"</span><br>";
		
		if(this.m_FID!=0)
			rVal+="<b>화염 저항력</b> : <span style=\"color:red;\">"+this.m_FID+"%</span><br>";
		if(this.m_ICD!=0)
			rVal+="<b>냉기 저항력</b> : <span style=\"color:blue;\">"+this.m_ICD+"%</span><br>";
		if(this.m_ELD!=0)
			rVal+="<b>전기 저항력</b> : <span style=\"color:yellow;\">"+this.m_ELD+"%</span><br>";
		if(this.m_POD!=0)
			rVal+="<b>독 저항력</b> : <span style=\"color:green;\">"+this.m_POD+"%</span><br>";
		
		
		
		return rVal;
	}

	
	toCopy()
	{
		var dummy=new CAbility();
		dummy.m_PA=this.m_PA;
		dummy.m_PD=this.m_PD;
		dummy.m_H=this.m_H;
		dummy.m_AS=this.m_AS;
		dummy.m_MS=this.m_MS;
		dummy.m_AL=this.m_AL;
		dummy.m_MA=this.m_MA;
		dummy.m_MD=this.m_MD;
		dummy.m_MP=this.m_MP;
		dummy.m_HR=this.m_HR;
		dummy.m_MR=this.m_MR;
		dummy.m_A=this.m_A;
		dummy.m_DSR=this.m_DSR;
		dummy.m_CS=this.m_CS;
		dummy.m_TD=this.m_TD;
		dummy.m_R=this.m_R;
		dummy.m_L=this.m_L;
		dummy.m_PAP=this.m_PAP;
		dummy.m_MAP=this.m_MAP;
		dummy.m_AA=this.m_AA;
		
		dummy.m_FIA=this.m_FIA;
		dummy.m_ICA=this.m_ICA;
		dummy.m_ELA=this.m_ELA;
		dummy.m_POA=this.m_POA;
		
		dummy.m_FID=this.m_FID;
		dummy.m_ICD=this.m_ICD;
		dummy.m_ELD=this.m_ELD;
		dummy.m_POD=this.m_POD;
		return dummy;
	}
	Serialize() 
	{
		var pac=new CPacket();
		pac.name="CAbility";
		pac.Push(this.m_PA);
		pac.Push(this.m_H);
		pac.Push(this.m_PD);
		pac.Push(this.m_AS);
		pac.Push(this.m_MS);
		pac.Push(this.m_AL);
		
		pac.Push(this.m_MA);
		pac.Push(this.m_MD);
		pac.Push(this.m_MP);
		pac.Push(this.m_HR);
		pac.Push(this.m_MR);
		pac.Push(this.m_A);
		pac.Push(this.m_DSR);
		pac.Push(this.m_CS);
		pac.Push(this.m_TD);
		pac.Push(this.m_R);
		pac.Push(this.m_L);
		
		pac.Push(this.m_PAP);
		pac.Push(this.m_MAP);
		pac.Push(this.m_AA);
		
		pac.Push(this.m_FIA);
		pac.Push(this.m_ICA);
		pac.Push(this.m_ELA);
		pac.Push(this.m_POA);
		
		pac.Push(this.m_FID);
		pac.Push(this.m_ICD);
		pac.Push(this.m_ELD);
		pac.Push(this.m_POD);
		
		return pac;
	}
	Deserialize(_str) 
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		this.m_PA=pac.GetInt32(0);
		this.m_H=pac.GetInt32(1);
		this.m_PD=pac.GetInt32(2);
		this.m_AS=pac.GetInt32(3);
		this.m_MS=pac.GetInt32(4);
		this.m_AL=pac.GetInt32(5);
		
		
		this.m_MA=pac.GetInt32(6);
		this.m_MD=pac.GetInt32(7);
		this.m_MP=pac.GetInt32(8);
		this.m_HR=pac.GetInt32(9);
		this.m_MR=pac.GetInt32(10);
		this.m_A=pac.GetInt32(11);
		this.m_DSR=pac.GetInt32(12);
		this.m_CS=pac.GetInt32(13);
		this.m_TD=pac.GetInt32(14);
		this.m_R=pac.GetInt32(15);
		this.m_L=pac.GetInt32(16);
		
		this.m_PAP=pac.GetInt32(17);
		this.m_MAP=pac.GetInt32(18);
		this.m_AA=pac.GetFloat(19);
		
		this.m_FIA=pac.GetInt32(20);
		this.m_ICA=pac.GetInt32(21);
		this.m_ELA=pac.GetInt32(22);
		this.m_POA=pac.GetInt32(23);
		
		this.m_FID=pac.GetInt32(24);
		this.m_ICD=pac.GetInt32(25);
		this.m_ELD=pac.GetInt32(26);
		this.m_POD=pac.GetInt32(27);
		
	}
}