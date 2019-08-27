package cell;

import java.util.Vector;

public class CRobot extends CProtozoa
{
	String m_rkey;
	Vector<Integer> m_skillOffset=new Vector<Integer>();
	Vector<Integer> m_skillLevel=new Vector<Integer>();
	boolean m_skillStartNormal=false;
	public String GetRKey() {	return m_rkey;	}
	void OptionParsing(String _str)
	{
		String each[]=_str.split(";");
		
		for(String each0 : each)
		{
			if(each0.length()<=0)
				continue;
			String each1[]=each0.split(":");
			if(each1.length<=1)
				continue;
			if(each1[0].equals("Skill"))
			{
				m_skillOffset.add(Integer.parseInt(each1[1]));
			}
			else if(each1[0].equals("SkillLevel"))
			{
				m_skillLevel.add(Integer.parseInt(each1[1]));
			}
		}
	}
	public void Update(int _delay)
	{
		super.Update(_delay);
		for(int i=0;i<m_skillOffset.size();++i)
		{
			CSkill sk=CSkSC.GetSkill(m_skillOffset.get(i));
			if(sk==null)
			{
				CMsg.E("Skill Null");
				return;
			}
			if(GetSkillCount(sk.m_offset)<sk.m_countLimit)
			{
				int level=0;
				if(m_skillLevel.size()>i)
					level=m_skillLevel.get(i);
				PushSkill(sk, level, this);
			}
		}
	}
}
