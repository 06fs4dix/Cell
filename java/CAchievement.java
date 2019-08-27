package cell;

import java.util.Vector;

class CQuest implements ISerialize
{
	int m_offset;
	String m_img;
	CVPAndOr m_success=new CVPAndOr();
	String m_location;
	boolean m_guide;
	boolean m_cameraMove;
	CCommunityAction m_cmt=new CCommunityAction();
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.name="CQuest";
		pac.Push(m_offset);
		pac.Push(m_img);
		pac.Push(m_success);
		pac.Push(m_location);
		pac.Push(m_guide);
		pac.Push(m_cameraMove);
		pac.Push(m_cmt);

		return pac;
	}
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_offset=Integer.parseInt(pac.value.get(0));
		m_img=pac.value.get(1);
		m_success.Deserialize(pac.value.get(2));
		m_location=pac.value.get(3);
		m_guide=pac.value.get(4).equals("true");
		m_cameraMove=pac.value.get(5).equals("true");
		m_cmt.Deserialize(pac.value.get(6));
	}
}
public class CAchievement implements ISerialize
{
	int m_offset;
	String m_subject;
	String m_img;
	CVPAndOr m_revelation=new CVPAndOr();//¹ßÇö
	String m_zone;
	Vector<CQuest> m_quest=new Vector<CQuest>();
	Vector<CDropInfo> m_item=new Vector<CDropInfo>();
	
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.name="CAchievement";
		pac.Push(m_offset);
		pac.Push(m_subject);
		pac.Push(m_img);
		pac.Push(m_revelation);
		pac.Push(m_zone);
		pac.Push(m_quest);
		pac.Push(m_item);
		
		return pac;
	}
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_offset=Integer.parseInt(pac.value.get(0));
		m_subject=pac.value.get(1);
		m_img=pac.value.get(2);
		m_revelation.Deserialize(pac.value.get(3));
		m_zone=pac.value.get(4);
		CPacket pac2=new CPacket();
		pac2.Deserialize(pac.value.get(5));
		for(String each0 : pac2.value)
		{
			CQuest quest=new CQuest();
			quest.Deserialize(each0);
			m_quest.add(quest);
		}
		CPacket pac3=new CPacket();
		pac3.Deserialize(pac.value.get(6));
		for(String each0 : pac3.value)
		{
			CDropInfo item=new CDropInfo();
			item.Deserialize(each0);
			m_item.add(item);
		}
	}
}
class CAcSc
{
	static public Vector<CAchievement> m_acVec=new Vector<CAchievement>();
	static public String m_script="";
	static public void Init()
	{
		
		if(m_script.isEmpty())
			m_script=CDbMgr.GetText("Ac");
		if(m_script.isEmpty())
			return;
		CPacket pac=new CPacket();
		pac.Deserialize(m_script);
		for(String each0 : pac.value)
		{
			CAchievement ac=new CAchievement();
			ac.Deserialize(each0);
			m_acVec.add(ac);
		}
	}
	static public class CAQInfo
	{
		CAQInfo(int _a,int _q)
		{
			a=_a;
			q=_q;
		}
		int a=-1;
		int q=-1;
	}
	static public CAQInfo Chk(CUser _user)
	{
		if(_user.GetAchievement())
			return null;
		
		for(CAchievement each0 : m_acVec)
		{
			int count=_user.GetVMapValue(VK.Get(Df.VMap.Qt,each0.m_offset));
			if(each0.m_revelation.Process(_user.m_vMap) ||
					count>0)
			{
				
				if(each0.m_quest.size()<count)
				{
					continue;
				}
				else if(each0.m_quest.size()==count)
				{
					_user.VMapPushPop(VK.Get(Df.VMap.Qt,each0.m_offset), each0.m_quest.size()+1);
					for(CDropInfo each1 : each0.m_item)
					{
						if(each1.m_amount<0 && _user.InvenInChk(each1.m_itemOff, -each1.m_amount))
						{
							_user.SetInvenOffset(_user.FindItemtoOffset(each1.m_itemOff), each1.m_amount);
						}
						else
							_user.PushInven(new CInventoryInfo(each1.m_itemOff, each1.m_amount));
					}
				}
				else if(each0.m_quest.size()>count)
				{
					if(each0.m_quest.get(count).m_success.Process(_user.m_vMap)==true)
					{
						if(each0.m_quest.get(count).m_cmt.m_text.isEmpty())
						{
							_user.VMapPushPop(VK.Get(Df.VMap.Qt,each0.m_offset), count+1);
							continue;
						}
						
						return new CAQInfo(each0.m_offset,count);
					}
				}
	
				
			}
		}
		return null;
	}
}