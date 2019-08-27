package cell;

import java.util.Random;
import java.util.Vector;



public class CCommunity 
{
	
	static int d_MaxVal=0x0fffffff;
	static int d_MinVal=1;
	static int d_C0Val=4;//얼굴 아는 사이
	static int d_C1Val=16;//조금 친해짐
	static int d_C2Val=64;//아는 사이
	
	static int m_offset=0;
	//static Vector<CCommunityCondition> m_dataVec=new Vector<CCommunityCondition>();
//	static CCommunityCondition NewData()
//	{
//		CCommunityCondition temp=new CCommunityCondition();
//		temp.m_offset=m_offset;
//		m_offset++;
//		return temp;
//	}
	static public Vector<CCommunityCondition> m_communityVec=new Vector<CCommunityCondition>();
	static public String m_script="";
	static public void Init()
	{
		
		if(m_script.isEmpty())
			m_script=CDbMgr.GetText("Community");
		
		if(m_script.isEmpty())
			return;
		CPacket pac=new CPacket();
		pac.Deserialize(m_script);
		for(String each0 : pac.value)
		{
			CCommunityCondition com=new CCommunityCondition();
			com.Deserialize(each0);
			m_communityVec.add(com);
		}
	
	
	}
	
	static public CCommunityAction Community(CUser _i,CRobot _you)
	{
		//if(m_offset==0)CRobot
		//	Init();
		
		Vector<CCommunityCondition> condition=new Vector<CCommunityCondition>();
		for(CCommunityCondition each0 : m_communityVec)
		{
			if(!_you.GetRKey().equals(each0.m_key))
				continue;
			
			
			if(each0.m_fItYou==false && _i!=null && !each0.m_vpao.Process(_i.m_vMap))
				continue;
			if(each0.m_fItYou==true && _you!=null && !each0.m_vpao.Process(_you.m_vMap))
				continue;
			
			condition.add(each0);
		}
		
		if(condition.isEmpty())
			return null;
		Random ran=new Random();
		int ranVal=(int) (ran.nextFloat()*condition.size());
		
		CCommunityAction selCa=new CCommunityAction(condition.get(ranVal).m_action);
		
		if(_i!=null && _you.GetProtozoaType()==DfPType.Npc)
		{
			_i.VMapValuePlus(VK.Get(Df.VMap.Cm,condition.get(ranVal).m_offset), 1);
			_i.VMapValuePlus(VK.Get(Df.VMap.Ct,_you.GetRKey()), 1);
			selCa.m_text=CCommunityAction.ActionTextChange(_i,_you,selCa.m_text);
		}
		
		
		
		
		return selCa;
	}
	
}
class CCommunityCondition implements ISerialize
{
	
	int m_offset;
	String m_key=""; 
	
	CVPAndOr m_vpao=new CVPAndOr();
	CCommunityAction m_action=new CCommunityAction();
	boolean m_fItYou=false;
	
	public CPacket Serialize() 
	{
		CPacket pac=new CPacket();
		pac.name="CCommunityCondition";
		pac.Push(m_offset);
		pac.Push(m_key);
		pac.Push(m_vpao);
		pac.Push(m_action);
		pac.Push(m_fItYou);
		
		return pac;
	}
	
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_offset=Integer.parseInt(pac.value.get(0));
		m_key=pac.value.get(1);
		m_vpao.Deserialize(pac.value.get(2));
		m_action.Deserialize(pac.value.get(3));
		m_fItYou=pac.value.get(4).equals("true")?true:false;
	}
}
class CCommunityAction implements ISerialize
{
	enum eAction
	{
		Default,
		Null,
	}
	CCommunityAction()
	{
		
	}
	CCommunityAction(String _text,int _function)
	{
		m_text=_text;
		m_function=_function;
	}
	public CCommunityAction(CCommunityAction cCommunityAction) 
	{
		m_text=cCommunityAction.m_text;
		m_function=cCommunityAction.m_function;
	}
	String m_text="";
	int m_function;//0:end 1:next chat
	static String ActionTextChange(CUser _i,CRobot _you,String _text)
	{
		if(_text.indexOf("%Key%")!=-1)
			_text=_text.replace("%Key%", _i.GetNick());
		return _text;
	}
	
	public CPacket Serialize() {
		CPacket pac=new CPacket();
		pac.name="CCommunityAction";
		pac.Push(m_text);
		pac.Push(m_function);
		return pac;
	}
	
	public void Deserialize(String _str) {
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		
		m_text=pac.value.get(0);
		m_function=Integer.parseInt(pac.value.get(1));
	}
}