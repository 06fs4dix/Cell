package cell;


class CAbility implements ISerialize
{
	int m_PA=0;//Physical Attack 물리 공격
	int m_PD=0;//Physical Defence
	int m_H=0;// Health 체력
	//int 속성;
	int m_AS=0;//Attack Speed //공속
	int m_MS=0;//Movement Speed 이속
	int m_AL=0;//Physical Attack Length물리 공격 거리
	
	
	int m_MA=0;//Magic Attack
	
	int m_MD=0;//Magic Defence
	int m_MP=0;//Magic Point
	int m_HR=0;//Health Recovery
	int m_MR=0;//마나
	int m_A=0;//avoid 회피
	int m_DSR=0;//DamageSussceRate적중률
	int m_CS=0;//Casting Speed 캐스팅
	int m_TD=0;//true Damage
	int m_R=0;//reflect 반사뎀
	int m_L=0;//Lucky
	
	int m_PAP=0;//Physical Attack Penetration
	int m_MAP=0;//Magic Attack Penetration
	float m_AA=0;
	
	int m_FIA;//fire attack
	int m_ICA;//ice 
	int m_ELA;//electr 
	int m_POA;//poision 
	
	int m_FID;//fire
	int m_ICD;//ice
	int m_ELD;//electr
	int m_POD;//poison
	
	
	CAbility toCopy()
	{
		CAbility dummy=new CAbility();
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
	public CPacket Serialize() 
	{
		CPacket pac=new CPacket();
		pac.name="CAbility";
		pac.Push(m_PA);
		pac.Push(m_H);
		pac.Push(m_PD);
		pac.Push(m_AS);
		pac.Push(m_MS);
		pac.Push(m_AL);
		
		pac.Push(m_MA);
		pac.Push(m_MD);
		pac.Push(m_MP);
		pac.Push(m_HR);
		pac.Push(m_MR);
		pac.Push(m_A);
		pac.Push(m_DSR);
		pac.Push(m_CS);
		pac.Push(m_TD);
		pac.Push(m_R);
		pac.Push(m_L);
		
		pac.Push(m_PAP);
		pac.Push(m_MAP);
		pac.Push(m_AA);
		
		pac.Push(m_FIA);
		pac.Push(m_ICA);
		pac.Push(m_ELA);
		pac.Push(m_POA);
		
		pac.Push(m_FID);
		pac.Push(m_ICD);
		pac.Push(m_ELD);
		pac.Push(m_POD);
		
		return pac;
	}
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_PA=pac.GetInt32(0);
		m_H=pac.GetInt32(1);
		m_PD=pac.GetInt32(2);
		m_AS=pac.GetInt32(3);
		m_MS=pac.GetInt32(4);
		m_AL=pac.GetInt32(5);
		
		
		m_MA=pac.GetInt32(6);
		m_MD=pac.GetInt32(7);
		m_MP=pac.GetInt32(8);
		m_HR=pac.GetInt32(9);
		m_MR=pac.GetInt32(10);
		m_A=pac.GetInt32(11);
		m_DSR=pac.GetInt32(12);
		m_CS=pac.GetInt32(13);
		m_TD=pac.GetInt32(14);
		m_R=pac.GetInt32(15);
		m_L=pac.GetInt32(16);
		
		m_PAP=pac.GetInt32(17);
		m_MAP=pac.GetInt32(18);
		m_AA=pac.GetFloat(19);
		
		m_FIA=pac.GetInt32(20);
		m_ICA=pac.GetInt32(21);
		m_ELA=pac.GetInt32(22);
		m_POA=pac.GetInt32(23);
		
		m_FID=pac.GetInt32(24);
		m_ICD=pac.GetInt32(25);
		m_ELD=pac.GetInt32(26);
		m_POD=pac.GetInt32(27);
		
	}
}