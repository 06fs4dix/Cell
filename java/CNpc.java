package cell;

import java.util.Vector;



public class CNpc extends CRobot
{
	int m_sellTime=1000*60*10+1;
	double m_sellPercent=0.25;
	double m_buyPercent=0.25;
	Vector<Integer> m_workVec=new Vector<Integer>();
	Vector<Integer> m_questionVec=new Vector<Integer>();
	Vector<CDropInfo> m_dropInfo=new Vector<CDropInfo>();
	
	void Init(CNMInfo _info,float _dropRate)
	{
		m_key="CNpc"+GetIndex();
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
		m_activeTime=_info.m_activeTime;
		m_attConscious=_info.m_attack;
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
		
		m_dropInfo=_info.m_dropVec;
		
		
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
	public void Update(int _time)
	{
		super.Update(_time);
		m_sellTime+=_time;

		if(m_sellTime>1000*60*10)
		{
			VMapPushPop(VK.Get(Df.VMap.Rd), (int)(Math.random()*10000));
			m_inven.clear();
			for(CDropInfo each1 : m_dropInfo)
			{
				if(each1.m_drop/10000.0>=Math.random())
					PushInven(new CInventoryInfo(each1.m_itemOff, each1.m_amount));
			}
			
			
			m_sellTime=0;
			int ran=(int) (Math.random()*18);
			if(ran==0)
			{
				m_sellPercent=Math.random()*0.35+0.5;
				m_buyPercent=Math.random()*0.8+0.2;
			}
			else if(ran>=1 && ran<=12)
			{
				m_sellPercent=Math.random()*0.3+0.1;
				m_buyPercent=Math.random()*0.6+0.4;
			}
			else 
			{
				m_sellPercent=Math.random()*0.4+0.2;
				m_buyPercent=Math.random()*0.2+0.8;
			}
			
			m_sellPercent=Math.abs(m_sellPercent);
			
		
			if(m_sellPercent>0.85)
				m_sellPercent=0.85;
			if(m_sellPercent<0.1)
				m_sellPercent=0.1;
		}
	}
	public void SellDisCount(int count)
	{
		if(m_sellPercent>0.5)
			m_sellPercent-=0.05*count;
		if(m_sellPercent<0.2)
			m_sellPercent-=0.001*count;
		else
			m_sellPercent-=0.01*count;
		if(m_sellPercent<0.1)
			m_sellPercent=0.1;
	}
	int GetProtozoaType()
	{
		return DfPType.Npc;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.name="CNpc";
		pac.Push(super.Serialize());


		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		
	}
}
