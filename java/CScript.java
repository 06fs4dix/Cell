package cell;

import java.util.Vector;

public class CScript 
{

}

class CAniList
{
	static Vector<CAnimation> m_ani;
	
	public static Vector<CAnimation> GetAni() { return m_ani; }
	public static void Parse(String _str)
	{
		m_ani.clear();
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		CPacket pac2=new CPacket();
		pac2.Deserialize(pac.GetString(0));
		for (var i = 0; i < pac2.value.size(); ++i)
		{
			CAnimation ani = new CAnimation();
			ani.Deserialize(pac2.value.get(i));

//			for (var j = 0; j < ani.m_clip.size(); ++j)
//			{
//				if (ani.m_clip.get(j) instanceof CClipImg)
//				{
//					String imgStr =((CClipImg)ani.m_clip.get(j)).m_img;
//					//CUtil.TextureLoad(imgStr);
//					//if (CRes.get(imgStr) == null)
//					//	CMsg.E("Texture Load Fail");
//
//				}
//
//			}
			m_ani.add(ani);
		}
	}
	public static CAnimation Find(String _name)
	{
		for (CAnimation each0 : m_ani)
		{
			if (each0.GetKey().equals(_name))
			{
				return  each0;
			}
		}

		return null;
	}
	public static CAnimation Find(int _off)
	{
		return m_ani.get(_off);
	}
};