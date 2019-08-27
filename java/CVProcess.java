package cell;

import java.util.Map;
import java.util.Vector;



public class CVProcess implements ISerialize
{
	enum eCondition
	{
		Never,//false
		Less,//<
		Equal,//==
		Greater,//>
		NotEqual,//!=
		LessEqual,//<=
		GreaterEqual,//>=
		Always;//true
		private static eCondition[] values = null;
	    public static eCondition fromInt(int i) {
	        if(eCondition.values == null) {
	        	eCondition.values = eCondition.values();
	        }
	        return eCondition.values[i];
	    }
	}
	String m_key;
	int m_value=0;
	eCondition m_condition=eCondition.Never;
	
	
	public CPacket Serialize() 
	{
		CPacket pac=new CPacket();
		pac.name="CVProcess";
		pac.Push(m_key);
		pac.Push(m_value);
		pac.Push(m_condition.ordinal());
		
		return pac;
	}
	
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_key=pac.value.get(0);
		m_value=Integer.parseInt(pac.value.get(1));
		m_condition=eCondition.fromInt(Integer.parseInt(pac.value.get(2)));
	}
	boolean Process(Map<String,Integer> _vMap)
	{
		Integer val=_vMap.get(m_key);
		if(val==null)//널은 0으로 생각한다
			val=0;
		
		if(eCondition.Never==m_condition)
			return false;
		else if(eCondition.Less==m_condition)
			return val<m_value;
		else if(eCondition.Equal==m_condition)
			return val==m_value;
		else if(eCondition.Greater==m_condition)
			return val>m_value;
		else if(eCondition.NotEqual==m_condition)
				return val!=m_value;
		else if(eCondition.LessEqual==m_condition)
			return val<=m_value;
		else if(eCondition.GreaterEqual==m_condition)
			return val>=m_value;
		
		return true;
	}
	void StringToData(String _str)
	{
		String arr0[]=_str.split(":");
		m_key=arr0[0];
		String arr1[]=arr0[1].split(",");
		m_value=Integer.parseInt(arr1[0]);
		m_condition=eCondition.fromInt(Integer.parseInt(arr1[1]));
	}
	String DataToStr()
	{
		String all=m_key+":"+m_value+","+m_condition.ordinal();
		return all;
	}
}
class CVPAndOr implements ISerialize
{
	public Vector<CVProcess> m_andVp=new Vector<CVProcess>();
	public Vector<CVProcess> m_orVp=new Vector<CVProcess>();
	boolean Process(Map<String,Integer> _vMap)
	{
		for(CVProcess each1 :m_andVp)
		{
			if(!each1.Process(_vMap))
			{
				return false;
			}
		}
		if(m_orVp.isEmpty())
			return true;
		//하나라도 맞으면 패스 안함
		for(CVProcess each1 :m_orVp)
		{
			
			if(each1.Process(_vMap))
			{
				return true;
			}
		}
		return false;
	}
	public CPacket Serialize() 
	{
		CPacket pac=new CPacket();
		pac.name="CVPAndOr";
		pac.Push(m_andVp);
		pac.Push(m_orVp);
		
		return pac;
	}
	
	public void Deserialize(String _str) 
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		
		CPacket pac0=new CPacket();
		pac0.Deserialize(pac.value.get(0));
		for(String each0 : pac0.value)
		{
			CVProcess vp=new CVProcess();
			vp.Deserialize(each0);
			m_andVp.add(vp);
		}

		CPacket pac1=new CPacket();
		pac1.Deserialize(pac.value.get(1));
		for(String each0 : pac1.value)
		{
			CVProcess vp=new CVProcess();
			vp.Deserialize(each0);
			m_orVp.add(vp);
		}

	}
}
