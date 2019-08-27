package cell;

import dal.LZString;

public class CPacketSmart extends CPacket
{
	public boolean m_disable=false;
	public CSession m_accepter=null;//널은 전체 유저다
	public boolean m_in=false;
	public CVec3 m_pos=null;//누가 보내는지
	public boolean m_thread=false;
	public void Compress()
	{
		String str=this.Serialize();
		name="Lz";
		value.clear();
		value.add(LZString.compressToBase64(str));
	}
}