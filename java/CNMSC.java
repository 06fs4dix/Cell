package cell;

import java.util.Vector;

public class CNMSC 
{

	static public Vector<CNMInfo> m_NMInfo = new Vector<CNMInfo>();
	static String m_script = "";

	public static void Init() 
	{

		if (m_script.isEmpty())
			m_script = CDbMgr.GetText("NM");
		if (m_script.isEmpty())
			return;
		CPacket pac = new CPacket();
		pac.Deserialize(m_script);

		for (String each0 : pac.value) {
			CNMInfo item = new CNMInfo();
			item.Deserialize(each0);
			m_NMInfo.add(item);
		}
	}
	public static CNMInfo GetRkey(String _key)
	{
		for(var each0 : m_NMInfo)
		{
			if(each0.m_key.equals(_key))
				return each0;
		}
		return null;
	}
}
