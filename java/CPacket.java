package cell;

import java.util.Map;
import java.util.Vector;

import dal.LZString;




public class CPacket 
{
	public String name = "";
	public Vector<String> value =new Vector<String>();

	public String Serialize()
	{
		String cutTag="";
		String rVal=name+":{";
		String valList="";
		for(String each0 : value)
		{
			if(valList.length()!=0)
				valList+=",";	
			valList+=each0;
			
			if(cutTag.length()!=0)
				cutTag+=",";
			cutTag+=valList.length();
			
		}
		rVal+=valList+"}"+cutTag;
		
		return rVal;
	}
	public void Deserialize(String _str)
	{
		if(_str.isEmpty())
			return;
		value.clear();
		int index=_str.indexOf(":");
		name=_str.substring(0,index);
		name=name.replace("\n","");
		name=name.replace("\r","");
		String lastStr=_str.substring(_str.indexOf("{")+1,_str.lastIndexOf("}"));
		String cutStr=_str.substring(_str.lastIndexOf("}")+1,_str.length());
		String cutStrArr[]=cutStr.split(",");
		int before=0;
		for(String each0 : cutStrArr)
		{
			if(each0.length()==0)
				continue;
			int pst=Integer.parseInt(each0);
			if(pst==0)
				value.add("");
			else
				value.add(lastStr.substring(before,pst));
			before=pst+1;
		}
	}
	public void Push(boolean _data)
	{
		if(_data)
			value.add("true");
		else
			value.add("false");
	}
	public void Push(int _data)
	{
		value.add(Integer.toString(_data));
	}
	public void Push(double _data)
	{
		value.add(Double.toString(_data));
	}
	public void Push(String _data)
	{
		value.add(_data);
	}
	public void Push(CPacket _data)
	{
		value.add(_data.Serialize());
	}
	public void Push(ISerialize _data)
	{
		if(_data==null)
			value.add("null");
		else
			value.add(_data.Serialize().Serialize());
	}
	public <T>void Push(Vector<T> _data)
	{
		
		CPacket pac=new CPacket();
		pac.name="Vector";
		for(T each : _data)
		{
			if(each instanceof ISerialize)
				pac.Push((ISerialize)each);
			else if(each instanceof String)
				pac.Push((String)each);
			//else if(each instanceof CPacket)
			//	pac.Push((CPacket)each);
			else if(each instanceof Integer)
				pac.Push((Integer)each);
		}
		value.add(pac.Serialize());
	}
	public <T1,T2>void Push(Map<T1,T2> _data)
	{
		CPacket pac=new CPacket();
		pac.name="Map";
		for(var each0 : _data.keySet())
		{
			
			T2 val=_data.get(each0);
			if(each0 instanceof String)
				pac.Push((String)each0);
			else if(each0 instanceof Integer)
				pac.Push((Integer)each0);
			
			if(val instanceof ISerialize)
				pac.Push(((ISerialize) val).Serialize());
			else if(val instanceof String)
				pac.Push((String) val);
			else if(val instanceof Integer)
				pac.Push((Integer) val);
		}
		value.add(pac.Serialize());
	}

	public boolean GetBool(int _off)
	{
		if (value.get(_off).equals("true"))
			return true;
		return false;
	}
	public int GetInt32(int _off)
	{
		return Integer.parseInt(value.get(_off));
	}
	public float GetFloat(int _off)
	{
		return Float.parseFloat(value.get(_off));
	}
	public String GetString(int _off)
	{
		return value.get(_off);
	}
	public void GetISerialize(int _off,ISerialize _data)
	{		
		if(value.get(_off).equals("null")==false)
			_data.Deserialize(value.get(_off));
	}
	
//	public <T>void GetVector(int _off,Vector<T> _data)
//	{
//		CPacket pac=new CPacket();
//		pac.Deserialize(value.get(_off));
//		_data.setSize(pac.value.size());
//	
//		for(int i=0;i<pac.value.size();++i)
//		{
//			if(_data.get(i) instanceof ISerialize)
//				GetISerialize(i,(ISerialize)_data.get(i));
//			else if(_data.get(i) instanceof String)
//			{
//				_data.add((T) GetString(i));
//			}
//			else if(<T> instanceof Integer)
//			{
//				_data.add((T) (Integer)GetInt32(i));
//			}
//		}
//	}
}

