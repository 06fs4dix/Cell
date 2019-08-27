package cell;


public class CMonster extends CRobot
{
	void Init(String _key)
	{
		m_key=_key;
		super.Init();
		m_size=new CVec2(100,100);
		m_actionAni.put(DfPAction.Normal + DfPActionDetail.Basic, 9);
	

		m_pPt = new CPaintBillbord(new CVec2(100,100),"res/none.png");
		super.PushCComponent(m_pPt);
		
		
		
		m_pco=new CCollider(m_pPt);
		super.PushCComponent(m_pco);
		m_pco.SetCollision(true);
		
		m_bAbli.m_H=100;
		m_bAbli.m_MS=100;
		m_bAbli.m_AL=100;
		m_bAbli.m_PA=1;
		m_bAbli.m_AS=1000;
		m_attConscious=DfPAttackType.Near;
		
		m_tramp=true;
		
		m_pAbli=m_bAbli.toCopy();
		m_mAbli=m_bAbli.toCopy();
		m_group=CGroup.Wild;
		m_nick="TestMon";
		
		PushInven(new CInventoryInfo(0, 1));
	}
	void Init(CNMInfo _info,float _dropRate)
	{
		m_key="CMon"+GetIndex();
		m_rkey=_info.m_key;
		m_nick=_info.m_nick;
		m_bAbli=_info.m_ability.toCopy();
		m_pAbli=m_bAbli.toCopy();
		
		for(var each0 : _info.m_actionAniVec)
		{
			if(each0.isEmpty())
				continue;
			String fs[]=each0.split("/");
			m_actionAni.put(Integer.parseInt(fs[0]), Integer.parseInt(fs[1]));
		}
		m_activeTime=(int) (_info.m_activeTime+Math.random()*2000);
		m_attConscious=_info.m_attack;
		m_attInstinct=_info.m_attack;
		m_effect=_info.m_effect;
		m_group=_info.m_group;
		m_level=_info.m_level;
		m_resurrectionTime=_info.m_resurrectionTime;
		m_returnLen=_info.m_returnLen;
		m_searchLen=_info.m_searchLen;
		
		
		m_counterAttack=_info.m_counterAttack;
		m_instinctEscape=_info.m_escape;
		m_revenge=_info.m_revenge;
		m_tramp=_info.m_tramp;
		
		m_escapeHp=_info.m_escapeHp;
		m_size=_info.m_size.toCopy();
		
		for(CDropInfo each1 : _info.m_dropVec)
		{
			if(each1.m_drop/10000.0>=Math.random()*_dropRate)
				PushInven(new CInventoryInfo(each1.m_itemOff, each1.m_amount));
		}
		
		
		m_pPt = new CPaintBillbord(m_size,"res/none.png");
		super.PushCComponent(m_pPt);
		
		m_pco=new CCollider(m_pPt);
		super.PushCComponent(m_pco);
		m_pco.SetCollision(true);
		
		m_pRb=new CRigidBody();
		super.PushCComponent(m_pRb);
		SendAbilityRefrash();
		
		OptionParsing(_info.m_option);
		
		
		
	}
	
	int GetProtozoaType()
	{
		return DfPType.Monster;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.name="CMonster";
		pac.Push(super.Serialize());


		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		
	}
}
