package cell;

import java.util.Vector;


class DfNM
{
	public static int Npc=0;
	public static int Monster=1;
}
public class CNMInfo implements ISerialize
{
	public int m_NMType;

	public String m_key;
	public Vector<String> m_actionAniVec=new Vector<String>();
	public String m_startPos;
	public CVec2 m_size=new CVec2();
	//String m_aiName=null;
	public String m_option=null;
	//CPerception m_perception=new CPerception();
	public int m_level;
	public int m_group;

	public CAbility m_ability=new CAbility();
	public Vector<CDropInfo> m_dropVec=new Vector<CDropInfo>();
	
	public String m_nick;
	public float m_escapeHp;
	public int m_resurrectionTime;
	public int m_activeTime;
	public int m_searchLen;
	public int m_returnLen;
	public boolean m_escape;
	public boolean m_counterAttack;
	public boolean m_tramp;
	public boolean m_revenge;
	public int m_attack;
	public int m_effect;

	
	
//	public CPacket Serialize() 
//	{
//		CPacket pac=new CPacket();
//		pac.name="CNMInfo";
//		pac.Push(m_NMType);
//		pac.Push(m_key);
//		pac.Push(m_motionVec);
//		pac.Push(m_startPos);
//		pac.Push(m_size);
//		pac.Push(m_option);
//		pac.Push(m_ability);
//		pac.Push(m_inventory);
//		//pac.Push(m_perception);
//		pac.Push(m_level);
//		pac.Push(m_group);
//
//		return pac;
//	}
//	
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);

		m_NMType=Integer.parseInt(pac.value.get(0));
		m_key=pac.value.get(1);
		CPacket dum2=new CPacket();
		dum2.Deserialize(pac.value.get(2));
		for(String each0 : dum2.value)
		{
			m_actionAniVec.add(each0);
		}
		m_startPos=pac.value.get(3);
		m_size.Deserialize(pac.value.get(4));
		m_option=pac.value.get(5);
		m_ability.Deserialize(pac.value.get(6));
		CPacket pac0=new CPacket();
		pac0.Deserialize(pac.value.get(7));
		for(String each0 : pac0.value)
		{
			CDropInfo info=new CDropInfo();
			info.Deserialize(each0);
			m_dropVec.add(info);
		}
		//m_perception.Deserialize(pac.value.get(8));
		m_level=Integer.parseInt(pac.value.get(8));
		m_group=Integer.parseInt(pac.value.get(9));
		
		this.m_nick=pac.GetString(10);
		this.m_escapeHp=pac.GetFloat(11);
		this.m_resurrectionTime=pac.GetInt32(12);
		this.m_activeTime=pac.GetInt32(13);
		this.m_searchLen=pac.GetInt32(14);
		this.m_returnLen=pac.GetInt32(15);
		this.m_escape=pac.GetBool(16);
		this.m_counterAttack=pac.GetBool(17);
		this.m_tramp=pac.GetBool(18);
		this.m_revenge=pac.GetBool(19);
		this.m_attack=pac.GetInt32(20);
		this.m_effect=pac.GetInt32(21);
	

	}

	@Override
	public CPacket Serialize() {
		// TODO Auto-generated method stub
		return null;
	}
}

