package cell;

import java.util.Map;
import java.util.Vector;


public class CQuestion implements ISerialize
{
	int m_offset;
	String m_key;
	String m_subject;
	CCommunityAction m_action=new CCommunityAction();
	CVPAndOr m_vpao=new CVPAndOr();
	
	public CPacket Serialize() 
	{
		CPacket pac=new CPacket();
		pac.name="CQuestion";
		pac.Push(m_offset);
		pac.Push(m_key);
		pac.Push(m_subject);
		pac.Push(m_action);
		pac.Push(m_vpao);

		return pac;
	}
	
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		
		m_offset=Integer.parseInt(pac.value.get(0));
		m_key=pac.value.get(1);
		m_subject=pac.value.get(2);
		m_action.Deserialize(pac.value.get(3));
		m_vpao.Deserialize(pac.value.get(4));
	}
}
class CQueSC
{
	static public Vector<CQuestion> m_questionVec=new Vector<CQuestion>();
	static public String m_script="";
	static public Vector<CQuestion> GetQuestionVec(CNpc _npc,Map<String,Integer> _vMap)
	{
		Vector<CQuestion> rVal=new Vector<CQuestion>();
		for(CQuestion each0 :m_questionVec)
		{
			if(!each0.m_key.equals(_npc.GetRKey()))
				continue;
			
			if(!each0.m_vpao.Process(_vMap))
				continue;
				
				
			
			rVal.add(each0);
		}
		return rVal;
	}
	static public void Init()
	{

		if(m_script.isEmpty())
			m_script=CDbMgr.GetText("Question");
		if(m_script.isEmpty())
			return;
		CPacket pac=new CPacket();
		pac.Deserialize(m_script);
		for(String each0 : pac.value)
		{
			CQuestion question=new CQuestion();
			question.Deserialize(each0);
			m_questionVec.add(question);
		}
	}
}