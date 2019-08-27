package cell;

import java.util.Map;
import java.util.Vector;

class CWork implements ISerialize
{
	public int m_offset;
	public String m_subject;
	public String m_community;
	public Vector<CDropInfo> m_need=new Vector<CDropInfo>();
	public Vector<CDropInfo> m_result=new Vector<CDropInfo>();
	public int m_gold;
	CVPAndOr m_vpao=new CVPAndOr();
	public String m_key;
	
	static int ls_offset=0;
//	public void Push_Need(int _itemOff,int _amount)
//	{
//		CDropInfo info=new CDropInfo();
//		info.m_itemOff=_itemOff;
//		info.m_amount=_amount;
//		m_need.add(info);
//	}
//	public void Push_Result(int _itemOff,int _amount)
//	{
//		CDropInfo info=new CDropInfo();
//		info.m_itemOff=_itemOff;
//		info.m_amount=_amount;
//		m_result.add(info);
//	}
	
	public CPacket Serialize() {
		CPacket pac=new CPacket();
		pac.name="CWork";
		pac.Push(m_offset);
		pac.Push(m_subject);
		pac.Push(m_community);
		pac.Push(m_need);
		pac.Push(m_result);
		pac.Push(m_key);
		pac.Push(m_gold);
		pac.Push(m_vpao);
		return pac;
	}
	
	public void Deserialize(String _str) {
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_offset=Integer.parseInt(pac.value.get(0));
		m_subject=pac.value.get(1);
		m_community=pac.value.get(2);
		
		
		CPacket pac0=new CPacket();
		pac0.Deserialize(pac.value.get(3));
		for(String each0 : pac0.value)
		{
			CDropInfo in=new CDropInfo();
			in.Deserialize(each0);
			m_need.add(in);
		}
		CPacket pac1=new CPacket();
		pac1.Deserialize(pac.value.get(4));
		for(String each0 : pac1.value)
		{
			CDropInfo in=new CDropInfo();
			in.Deserialize(each0);
			m_result.add(in);
		}
		m_key=pac.value.get(5);
		m_gold=Integer.parseInt(pac.value.get(6));
		m_vpao.Deserialize(pac.value.get(7));
		
	
	}
}
class CWorkSC
{
	static public Vector<CWork> m_workVec=new Vector<CWork>();
	static public String m_script="";
	
	static public Vector<Integer> GetWorkVec(String _key,Map<String,Integer> _vMap)
	{
		Vector<Integer> rVal=new Vector<Integer>();
		for(CWork each0 :m_workVec)
		{
			if(!each0.m_key.equals(_key))
				continue;
			
			if(!each0.m_vpao.Process(_vMap))
				continue;
				
				
			
			rVal.add(each0.m_offset);
		}
		return rVal;
	}
	
	static public void Init()
	{
		if(m_script.isEmpty())
			m_script=CDbMgr.GetText("Work");
		
		if(m_script.isEmpty())
			return;
		CPacket pac=new CPacket();
		pac.Deserialize(m_script);
		for(String each0 : pac.value)
		{
			CWork work=new CWork();
			work.Deserialize(each0);
			m_workVec.add(work);
		}
	}
}