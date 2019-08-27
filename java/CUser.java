package cell;

import java.io.IOException;
import java.util.Vector;

import javax.websocket.Session;

import cell.CAcSc.CAQInfo;



public class CUser extends CProtozoa implements CSession
{
	int m_display=3200;
	static int l_expTable[]=
		{8,16,32,50,80,
		120,200,400,600,1000,
		1500,2000,2500,3000,4000,
		6000,9000,15000,20000,25000};
	static int d_H=600;
	static int d_HR=60;
	String m_pw="";
	Session m_session=null;
	long m_liveTime=System.currentTimeMillis ();
	Vector<CInventoryInfo> m_charInven=new Vector<CInventoryInfo>();
	Vector<Integer> m_setItem=new Vector<Integer>();
	int m_gold=0;
	boolean m_live=false;
	int m_exp=0;
	int m_expBefore=-1;
	int m_levelBefore=-1;
	boolean m_achievementLock=true;
	void SetAchievement(boolean _lock) {	m_achievementLock=_lock;	}
	boolean GetAchievement()	{	return m_achievementLock;	}
	public void SetDisplay(int _val)
	{
		m_display=_val;
	}
	public String GetPw()	{	return m_pw;	}
	public void ExpPlus(int _val)
	{
		m_exp+=_val;
	}
	public int GetGold()	{	return m_gold;	}
	public boolean DisplayOut(CVec3 _pos) 
	{
		float len=CMath.Vec3Lenght(CMath.Vec3MinusVec3(_pos, m_pos));
		if(len>m_display*2)
			return true;
		
		return false;
	}
	public void SetSession(Session _session) 
	{
		m_session=_session;
	}
	public Session GetSession() 
	{
		return m_session;
	}
	public void LiveTimeRefrash()
	{
		m_liveTime=System.currentTimeMillis();
	}
	public long GetLiveTime()
	{
		return System.currentTimeMillis()-m_liveTime;
	}
	public boolean isUser()	{	return true;	}
 
	
	public boolean GetLive() 
	{
		return m_live;
	}
	
	public void SetLive(boolean _live) 
	{
		m_live=_live;
	}
	//=========================================================
	void Init(String _key,String _pw)
	{
		m_key=_key;
		super.Init();
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.Basic, 6);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.BasicBottom, 6);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.BasicTop, 4);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.BasicLeft, 7);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.BasicRight, 5);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.MoveBottom, 2);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.MoveTop, 0);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.MoveLeft, 3);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.MoveRight, 1);

		m_size=new CVec2(100,100);
		m_pPt = new CPaintBillbord(m_size,"res/none.png");
		super.PushCComponent(m_pPt);

		m_pco=new CCollider(m_pPt);
		super.PushCComponent(m_pco);
		m_pco.SetCollision(true);

		m_bAbli.m_H=500;
		m_bAbli.m_HR=50;
		//m_bAbli.m_PA=200;
		m_bAbli.m_AA=0;
		//m_bAbli.m_AL=200;
		m_bAbli.m_MS=500;
		m_bAbli.m_AS=100;
		m_bAbli.m_MP=100;
		m_bAbli.m_MR=10;
		
		if(CServerValue.m_testMode)
		//if(false)
		{
			
//			m_bAbli.m_MP=1000;
//			m_bAbli.m_H=50000;
			
			for(int i=1;i<=104;++i)
				PushInven(new CInventoryInfo(i,1));
			m_level=20;
		}
		
		
		SetPos(new CVec3(100,1650,100));

		m_pAbli=m_bAbli.toCopy();
		m_mAbli=m_bAbli.toCopy();
		m_group=CGroup.UserBegin;
		m_nick=_key;
		//m_level=0;
		
		
//		
//		PushInven(new CInventoryInfo(24,100));
//		PushInven(new CInventoryInfo(55,100));
//		PushInven(new CInventoryInfo(38,1));
		
		PushInven(new CInventoryInfo(8,1));
		PushInven(new CInventoryInfo(9,1));
		PushInven(new CInventoryInfo(10,1));
		
		
		PushInven(new CInventoryInfo(66,1));
		PushInven(new CInventoryInfo(70,1));
		PushInven(new CInventoryInfo(74,1));
		
//		PushInven(new CInventoryInfo(1,2));
//		PushInven(new CInventoryInfo(2,10));
//		PushInven(new CInventoryInfo(3,2));
//		PushInven(new CInventoryInfo(4,1));
//		PushInven(new CInventoryInfo(7,1000));
	}
	
	public void CanvasDelete()
	{
		super.CanvasDelete();
		try {
			m_session.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.name="CUser";
		pac.Push(super.Serialize());
		
		pac.Push(m_charInven);
		pac.Push(m_setItem);
		pac.Push(m_gold);
		pac.Push(m_exp);

		return pac;
	}
	public CPacket DBSerialize()
	{
		CPacket pac=new CPacket();
		pac.name="CUser";
		pac.Push(super.Serialize());
		
		pac.Push(m_charInven);
		pac.Push(m_setItem);
		pac.Push(m_gold);
		pac.Push(m_exp);

		pac.Push(m_vMap);
		pac.Push(m_inven);
		pac.Push(m_group);
		pac.Push(m_level);
		

		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));

		//pac.GetVector(1, m_charInven);
		CPacket pac2=new CPacket();
		pac2.Deserialize(pac.GetString(1));
		for(int i=0;i<pac2.value.size();++i)
		{
			CInventoryInfo inven=new CInventoryInfo();
			inven.Deserialize(pac2.value.get(i));
			m_charInven.add(inven);
			CItemInfo info=CItemSC.m_itemInfo.get(inven.m_itemOff);
			
			if(info.m_type==CItemSC.Bow || info.m_type==CItemSC.CrossBow)
				m_effect=DfShotType.Arrow;
			else if(info.m_type==CItemSC.Wand || info.m_type==CItemSC.Rod)
				m_effect=DfShotType.Fire;
			
			if(info.m_skill!=-1)
			{
				CSkill skill=CSkSC.GetSkill(info.m_skill);
				PushSkill(skill,inven.m_reinforceCount,this);
			}
		}
		CPacket pac3=new CPacket();
		pac3.Deserialize(pac.GetString(2));
		for(int i=0;i<pac3.value.size();++i)
		{
			m_setItem.add(pac3.GetInt32(i));
		}
	
		m_gold=pac.GetInt32(3);
		m_exp=pac.GetInt32(4);
		

	}
	public void DBDeserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));

		//pac.GetVector(1, m_charInven);
		CPacket pac2=new CPacket();
		pac2.Deserialize(pac.GetString(1));
		for(int i=0;i<pac2.value.size();++i)
		{
			CInventoryInfo inven=new CInventoryInfo();
			inven.Deserialize(pac2.value.get(i));
			m_charInven.add(inven);
			CItemInfo info=CItemSC.m_itemInfo.get(inven.m_itemOff);
			
			if(info.m_type==CItemSC.Bow || info.m_type==CItemSC.CrossBow)
				m_effect=DfShotType.Arrow;
			else if(info.m_type==CItemSC.Wand || info.m_type==CItemSC.Rod)
				m_effect=DfShotType.Fire;
			
			if(info.m_type==CItemSC.Skill)
			{
				CSkill skill=CSkSC.GetSkill(info.m_offset);
				if(skill.m_skType==DfSkType.Passive)
					PushSkill(skill,inven.m_reinforceCount,this);
			}
			
			if(info.m_skill!=-1)
			{
				CSkill skill=CSkSC.GetSkill(info.m_skill);
				PushSkill(skill,inven.m_reinforceCount,this);
			}
		}
		CPacket pac3=new CPacket();
		pac3.Deserialize(pac.GetString(2));
		for(int i=0;i<pac3.value.size();++i)
		{
			m_setItem.add(pac3.GetInt32(i));
		}
		
	
		m_gold=pac.GetInt32(3);
		m_exp=pac.GetInt32(4);
		
		CPacket vMapPac=new CPacket();
		vMapPac.Deserialize(pac.GetString(5));
		for(int i=0;i<vMapPac.value.size();i+=2)
		{
			m_vMap.put(vMapPac.GetString(i), vMapPac.GetInt32(i+1));
		}
		
		m_inven.clear();
		CPacket pac4=new CPacket();
		pac4.Deserialize(pac.GetString(6));
		for(int i=0;i<pac4.value.size();++i)
		{
			CInventoryInfo inven=new CInventoryInfo();
			inven.Deserialize(pac4.value.get(i));
			m_inven.add(inven);
		}

		m_group=pac.GetInt32(7);
		m_level=pac.GetInt32(8);
	}
	
	int m_autoTime=0;
	public void Update(int _delay)
	{
		super.Update(_delay);
		
		
		if(m_autoTime>500)
		{
			CAQInfo aqinfo= CAcSc.Chk(this);
			if(aqinfo!=null)
			{
				m_achievementLock=true;
				CPacketSmart pac=new CPacketSmart();
				pac.name="Quest";
				pac.Push(aqinfo.a);
				pac.Push(aqinfo.q);
				pac.m_accepter=this;
				PushPacket(pac);
			}
			if(m_action==DfPAction.Attack && m_attConscious!=DfPAttackType.Nonviolence)
			{
				//int count=0;
				for(CInventoryInfo each0 : m_charInven)
				{
					CItemInfo info=CItemSC.m_itemInfo.get(each0.m_itemOff);
					
					if(CItemSC.ItemTypeChk(info.m_type)==CItemSC.Skill)
					{
						PushSkill(CSkSC.GetSkill(each0.m_itemOff), each0.m_reinforceCount, this);
						//count++;
					}
				}
			}
			m_autoTime=0;
		}
		
		
		m_autoTime+=_delay;
		
		
		if(m_live)
		{
			if(m_exp!=m_expBefore)
			{
				m_expBefore=m_exp;
				CPacketSmart pac=new CPacketSmart(); 
				pac.m_accepter=this;
				pac.name="Exp";
				
				if(m_level>=l_expTable.length)
				{
					m_level=l_expTable.length-1;
				}
				double exp=(double)m_exp/l_expTable[m_level];
				exp*=100;
				if(exp>=100)
				{
					if(m_level>=l_expTable.length)
					{
						exp=100;
					}
					else
					{
						m_level++;
						exp=0;
						m_exp=0;
					}
					
				}
				pac.Push(exp);
				PushPacket(pac);
				
				
	
				
			}
			if(m_level!=m_levelBefore)
			{
				m_levelBefore=m_level;
				CPacketSmart pac=new CPacketSmart(); 
				pac.m_accepter=this;
				pac.name="Level";
				pac.Push(m_level);
				PushPacket(pac);
				
				
				LevelCac();
				SendAbilityRefrash();
				
	
				CPacketZone pac2=new CPacketZone();
				pac2.EffectCreate(GetPos(), 200, 200, CEffect.LevelUp, null, "",0,0);
				PushPacket(pac2);
			}
		}
	}
	public void LevelCac()
	{
		VMapPushPop(VK.Get(Df.VMap.Lv), m_level);
	}
	int GetProtozoaType()
	{
		return DfPType.User;
	}
	Vector<CInventoryInfo> GetCharInv()
	{
		return m_charInven;
	}
	void SendCharInv2()
	{
		CPacketSmart req0=new CPacketSmart();
		req0.m_accepter=this;
		req0.name="GetCharInv2";
		req0.Push(m_charInven);
		req0.Push(m_inven);
		req0.Push(m_gold);
		m_packet.add(req0);
		SendRefrashCharInv();
		SendStop(false);


	}
	void SendRefrashCharInv()
	{
		CPacketSmart req0=new CPacketSmart();
		req0.m_accepter=this;
		req0.name="RefrashCharInv";
		m_packet.add(req0);
	}
	void MAbilityRefrash()
	{
		//this.m_mAbli=this.m_bAbli.toCopy();
		super.MAbilityRefrash();

		int FWEPA=0;
		int FWEPD=0;
		//여기서 아이템 착용 추가
		for(CInventoryInfo each0 : m_charInven)
		{
			CItemInfo infoCom=CItemSC.m_itemInfo.get(each0.m_itemOff);
			if(infoCom.m_ability!=null)
			{
				m_mAbli.m_H+=infoCom.m_ability.m_H;
				m_mAbli.m_PA+=infoCom.m_ability.m_PA;
				m_mAbli.m_PD+=infoCom.m_ability.m_PD;
				m_mAbli.m_MS+=infoCom.m_ability.m_MS;
				m_mAbli.m_AS+=infoCom.m_ability.m_AS;
				m_mAbli.m_AL+=infoCom.m_ability.m_AL;

				m_mAbli.m_MA+=infoCom.m_ability.m_MA;
				m_mAbli.m_MD+=infoCom.m_ability.m_MD;
				m_mAbli.m_MP+=infoCom.m_ability.m_MP;
				m_mAbli.m_HR+=infoCom.m_ability.m_HR;
				m_mAbli.m_MR+=infoCom.m_ability.m_MR;
				m_mAbli.m_A+=infoCom.m_ability.m_A;
				m_mAbli.m_DSR+=infoCom.m_ability.m_DSR;
				m_mAbli.m_CS+=infoCom.m_ability.m_CS;
				m_mAbli.m_TD+=infoCom.m_ability.m_TD;
				m_mAbli.m_R+=infoCom.m_ability.m_R;
				m_mAbli.m_L+=infoCom.m_ability.m_L;
				m_mAbli.m_PAP+=infoCom.m_ability.m_PAP;
				m_mAbli.m_MAP+=infoCom.m_ability.m_MAP;
				m_mAbli.m_AA+=infoCom.m_ability.m_AA;

				m_mAbli.m_FIA+=infoCom.m_ability.m_FIA;
				m_mAbli.m_ICA+=infoCom.m_ability.m_ICA;
				m_mAbli.m_ELA+=infoCom.m_ability.m_ELA;
				m_mAbli.m_POA+=infoCom.m_ability.m_POA;

				m_mAbli.m_FID+=infoCom.m_ability.m_FID;
				m_mAbli.m_ICD+=infoCom.m_ability.m_ICD;
				m_mAbli.m_ELD+=infoCom.m_ability.m_ELD;
				m_mAbli.m_POD+=infoCom.m_ability.m_POD;

			}
			if(each0.m_reinforceCount>0)
			{
				m_mAbli.m_H+=infoCom.m_reinforce.m_ability.m_H*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_PA+=infoCom.m_reinforce.m_ability.m_PA*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_PD+=infoCom.m_reinforce.m_ability.m_PD*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_MS+=infoCom.m_reinforce.m_ability.m_MS*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_AS+=infoCom.m_reinforce.m_ability.m_AS*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_AL+=infoCom.m_reinforce.m_ability.m_AL*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;

				m_mAbli.m_MA+=infoCom.m_reinforce.m_ability.m_MA*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_MD+=infoCom.m_reinforce.m_ability.m_MD*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_MP+=infoCom.m_reinforce.m_ability.m_MP*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_HR+=infoCom.m_reinforce.m_ability.m_HR*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_MR+=infoCom.m_reinforce.m_ability.m_MR*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_A+=infoCom.m_reinforce.m_ability.m_A*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_DSR+=infoCom.m_reinforce.m_ability.m_DSR*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_CS+=infoCom.m_reinforce.m_ability.m_CS*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_TD+=infoCom.m_reinforce.m_ability.m_TD*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_R+=infoCom.m_reinforce.m_ability.m_R*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_L+=infoCom.m_reinforce.m_ability.m_L*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_PAP+=infoCom.m_reinforce.m_ability.m_PAP*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_MAP+=infoCom.m_reinforce.m_ability.m_MAP*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;
				m_mAbli.m_AA+=infoCom.m_reinforce.m_ability.m_AA*each0.m_reinforceCount*infoCom.m_reinforce.m_rate;

				//최대 40개까지 찍을수 있다
				//방어구에 경우 최대 70%이다
				if(CItemSC.FIEPAttChk(infoCom.m_type))
				{
					FWEPA+=each0.m_fCount+each0.m_iCount+each0.m_eCount+each0.m_pCount;
					if(FWEPA<=40)
					{
						m_mAbli.m_FIA+=each0.m_fCount*3;
						m_mAbli.m_ICA+=each0.m_iCount*3;
						m_mAbli.m_ELA+=each0.m_eCount*3;
						m_mAbli.m_POA+=each0.m_pCount*3;
					}
				}
				else
				{
					FWEPD+=each0.m_fCount+each0.m_iCount+each0.m_eCount+each0.m_pCount;
					if(FWEPD<=40)
					{
						if(m_mAbli.m_FID+each0.m_fCount*3<=23*3)
							m_mAbli.m_FID+=each0.m_fCount*3;
						else
							m_mAbli.m_FID=69;
						if(m_mAbli.m_ICD+each0.m_iCount*3<=23*3)
							m_mAbli.m_ICD+=each0.m_iCount*3;
						else
							m_mAbli.m_ICD=69;
						if(m_mAbli.m_ELD+each0.m_eCount*3<=23*3)
							m_mAbli.m_ELD+=each0.m_eCount*3;
						else
							m_mAbli.m_ELD=69;
						if(m_mAbli.m_POD+each0.m_pCount*3<=23*3)
							m_mAbli.m_POD+=each0.m_pCount*3;
						else
							m_mAbli.m_POD=69;
					}
				}




			}//m_reinforce
		}//for
		//50당 제곱으로 올라간다
		m_mAbli.m_FIA+=(m_mAbli.m_FIA/50)*(m_mAbli.m_FIA/50)*10;
		m_mAbli.m_ICA+=(m_mAbli.m_ICA/50)*(m_mAbli.m_ICA/50)*10;
		m_mAbli.m_ELA+=(m_mAbli.m_ELA/50)*(m_mAbli.m_ELA/50)*10;
		m_mAbli.m_POA+=(m_mAbli.m_POA/50)*(m_mAbli.m_POA/50)*10;

		for(Integer each0 :m_setItem)
		{
			CSetItem set=CSetItemSC.m_setItem.get(each0);
			if(set.m_ability!=null)
			{
				m_mAbli.m_H+=set.m_ability.m_H;
				m_mAbli.m_PA+=set.m_ability.m_PA;
				m_mAbli.m_PD+=set.m_ability.m_PD;
				m_mAbli.m_MS+=set.m_ability.m_MS;
				m_mAbli.m_AS+=set.m_ability.m_AS;
				m_mAbli.m_AL+=set.m_ability.m_AL;

				m_mAbli.m_MA+=set.m_ability.m_MA;
				m_mAbli.m_MD+=set.m_ability.m_MD;
				m_mAbli.m_MP+=set.m_ability.m_MP;
				m_mAbli.m_HR+=set.m_ability.m_HR;
				m_mAbli.m_MR+=set.m_ability.m_MR;
				m_mAbli.m_A+=set.m_ability.m_A;
				m_mAbli.m_DSR+=set.m_ability.m_DSR;
				m_mAbli.m_CS+=set.m_ability.m_CS;
				m_mAbli.m_TD+=set.m_ability.m_TD;
				m_mAbli.m_R+=set.m_ability.m_R;
				m_mAbli.m_L+=set.m_ability.m_L;
				m_mAbli.m_PAP+=set.m_ability.m_PAP;
				m_mAbli.m_MAP+=set.m_ability.m_MAP;
				m_mAbli.m_AA+=set.m_ability.m_AA;

				m_mAbli.m_FIA+=set.m_ability.m_FIA;
				m_mAbli.m_ICA+=set.m_ability.m_ICA;
				m_mAbli.m_ELA+=set.m_ability.m_ELA;
				m_mAbli.m_POA+=set.m_ability.m_POA;

				m_mAbli.m_FID+=set.m_ability.m_FID;
				m_mAbli.m_ICD+=set.m_ability.m_ICD;
				m_mAbli.m_ELD+=set.m_ability.m_ELD;
				m_mAbli.m_POD+=set.m_ability.m_POD;
			}
		}
	}
	public CInventoryInfo PopCharInvenOffset(int _invenOff)
	{
		CInventoryInfo select=null;
		for(CInventoryInfo each0 : m_charInven)
		{
			if(each0.m_offset==_invenOff)
			{
				select=each0;
				break;
			}
		}


		m_charInven.remove(select);

		CItemInfo info=CItemSC.m_itemInfo.get(select.m_itemOff);
		if(info.m_type==CItemSC.Skill)
		{
			//CSkillInfo2 skill=CItemSC.Get_Skill(select.m_itemOff);
			
			CSkill skill=CSkSC.GetSkill(select.m_itemOff);
			//PushSkill(skill,_inven.m_reinforceCount,this);
			
			
			if(skill.m_skType==DfSkType.Passive || 
					skill.m_skType==DfSkType.Switch)
			{
				RemoveSkill(select.m_itemOff,-1);
			}
		}
		if(info.m_skill!=-1)
		{
			RemoveSkill(info.m_skill,1);
		}
		m_setItem=CSetItemSC.SetChk(m_charInven);
		//SendAbilityRefrash();

		return select;

	}
	//입을수 없는거만 벗기기
	public void AllPutOnChkAndTakeOff()
	{
		for(int i=0;i<m_charInven.size();++i)
		{
			CInventoryInfo iv=m_charInven.get(i);
			if(PutOnChk(iv.m_itemOff)!=0)
			{
				//CInventoryInfo each0=Pop_CharInvenOffset(iv.m_offset);
				PushInven(PopCharInvenOffset(iv.m_offset));
				i=-1;
			}
		}
		m_setItem=CSetItemSC.SetChk(m_charInven);
		//SendAbilityRefrash();
	}
	//착용 가능한지 확인(무기 제한 확인
	//못입는건 -1 레벨부족 -2 무기 미착용 -3 풋온 타입 없음-4 착용가능 0
	public int PutOnChk(int _itemOff)
	{

		CItemInfo info=CItemSC.m_itemInfo.get(_itemOff);
		
		if(info.m_type==CItemSC.Potion ||
				info.m_type==CItemSC.Material ||
				info.m_type==CItemSC.Book ||
				info.m_type==CItemSC.Food)
			return -1;
		
		if(info.m_level>this.m_level)
			return -2;
		int rVal=-4;
		CInventoryInfo wep= GetCInvenInITypeToInven(CItemSC.Weapon,0);
		if(info.m_putOnType.isEmpty())
			return 0;
		for(Integer each0 : info.m_putOnType)
		{
			if(wep==null)
				return -3;
			CItemInfo winfo=CItemSC.m_itemInfo.get(wep.m_itemOff);
			if(each0==winfo.m_type)
			{
				rVal=0;

				break;
			}
		}


		return rVal;
	}
	public CInventoryInfo GetCInvenInITypeToInven(int _itemType,int _count)
	{
		int count=0;
		for(CInventoryInfo each0 : m_charInven)
		{
			CItemInfo info=CItemSC.m_itemInfo.get(each0.m_itemOff);
			
			if(CItemSC.ItemTypeChk(info.m_type)==_itemType)
			{
				if(count==_count)
					return each0;
				count++;
			}
		}
		return null;
	}
	//안에 있냐?
	public boolean CharInvenInChk(int _itemOff)
	{
		int skillCount=0;
		CItemInfo info=CItemSC.m_itemInfo.get(_itemOff);
		
		for(CInventoryInfo each0 : m_charInven)
		{
			CItemInfo infoCom=CItemSC.m_itemInfo.get(each0.m_itemOff);
			
			if(CItemSC.ItemTypeChk(info.m_type)==CItemSC.Weapon)
			{
				if(CItemSC.ItemTypeChk(infoCom.m_type)==CItemSC.ItemTypeChk(info.m_type))
					return true;
			}
			else if(CItemSC.ItemTypeChk(info.m_type)==CItemSC.Skill)
			{
				if(skillCount>=2)
					return true;
				if(infoCom.m_type==CItemSC.Skill && skillCount<2)
				{
					skillCount++;
					
					continue;
				}
				
			}
			else if(info.m_type==infoCom.m_type)
				return true;
		}
		
		return false;
	}
	//같은 타입을 벗긴다 벗긴 아이템을 리턴한다
	void Pop_SameTypeTakeOff(int _itemOff)
	{
		CItemInfo info=CItemSC.m_itemInfo.get(_itemOff);
		for(CInventoryInfo each0 : m_charInven)
		{
			CItemInfo infoCom=CItemSC.m_itemInfo.get(each0.m_itemOff);
			if(infoCom.m_type==info.m_type)
			{
				CInventoryInfo ivinfo=PopCharInvenOffset(each0.m_offset);
				PushInven(ivinfo);
				
				break;
			}
			
			else if(CItemSC.ItemTypeChk(infoCom.m_type)==CItemSC.ItemTypeChk(info.m_type) && CItemSC.ItemTypeChk(info.m_type)!=CItemSC.Puton)
			{
				CInventoryInfo ivinfo=PopCharInvenOffset(each0.m_offset);
				PushInven(ivinfo);
				
				break;
			}
		}
		m_setItem=CSetItemSC.SetChk(m_charInven);
		//SendAbilityRefrash();
	}
	//캐릭터 인벤은 수량따위 없다 무조건 수량이 몇개던 하나만 입는다
	public boolean PushCharInven(CInventoryInfo _inven)
	{
		if(_inven.m_amount<=0)
			return false;

		m_charInven.add(_inven);
		
		CItemInfo info=CItemSC.m_itemInfo.get(_inven.m_itemOff);
		if(info.m_type==CItemSC.Skill)
		{
			CSkill skill=CSkSC.GetSkill(_inven.m_itemOff);
			if(skill.m_skType==DfSkType.Passive)
			{
				PushSkill(skill,_inven.m_reinforceCount,this);
			}
		}
		if(info.m_skill!=-1)
		{
			CSkill skill=CSkSC.GetSkill(info.m_skill);
			PushSkill(skill,_inven.m_reinforceCount,this);
		}
		m_setItem=CSetItemSC.SetChk(m_charInven);
		
		if(info.m_type==CItemSC.Bow || info.m_type==CItemSC.CrossBow)
			m_effect=DfShotType.Arrow;
		else if(info.m_type==CItemSC.Wand || info.m_type==CItemSC.Rod)
			m_effect=DfShotType.Fire;
			
		//SendAbilityRefrash();
		return true;
	}
	CInventoryInfo GetCharInvenInfo(int _offset)
	{
		for(CInventoryInfo each0 : m_charInven)
		{
			if(each0.m_offset==_offset)
				return each0;
		}
		return null;
	}
	public void SendTarget()
	{
		CPacketSmart smt=new CPacketSmart();
		smt.m_accepter=this;
		smt.name="SetTarget";
		if(m_target==null)
			smt.Push(m_target);
		else
			smt.Push(m_target.GetKey());
		PushPacket(smt);
		
	}
	
}

