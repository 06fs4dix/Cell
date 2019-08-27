package cell;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import javax.websocket.Session;

interface CSession
{
	public void SetSession(Session _session);
	public Session GetSession();
	public void LiveTimeRefrash();
	public long GetLiveTime();
	public boolean DisplayOut(CVec3 _pos);
	public boolean GetLive();
	public void SetLive(boolean _live);
	//public void PlayerTimeAdd();
}

public class CServerValue 
{
	static int DfInitReady=0;
	static int DfInitLoad=1;
	static int DfInitSuccess=2;
	
	public static boolean m_serverInit=true;
	public int m_init=DfInitReady;
	public Map<String,IPlayer> m_player = Collections
			.synchronizedMap(new HashMap<String,IPlayer>());
	public Map<String,String> m_sessionKey = new HashMap<String,String>();
	public String m_rootPath;
	Vector<String> m_removePlayer=new Vector<String>();
	public int m_dummyCount=0;
	public int m_userCount=0;
	public boolean m_serverSleep=true;
	public Session m_adminSession=null;
	public Vector<CPacketSmart> m_packetQue=new Vector<CPacketSmart>();
	static public boolean m_testMode=false;
	public Set<String> m_joinUser=new HashSet<String>();
	
	void Reset()
	{
		
		m_packetQue.clear();
		try {
			Update(0);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public void PushPacket(CPacketSmart _pac)
	{
		m_packetQue.add(_pac);
	}
	public void PushPacket(Vector<CPacketSmart> _pac)
	{
		m_packetQue.addAll(_pac);
	}
	public void PushIPlater(String _key,IPlayer _player)
	{
		synchronized (m_player)
		{
			m_player.put(_key, _player);
		}
		
	}
	public IPlayer GetIPlayer(String _key)
	{
		if(m_sessionKey.get(_key)==null)
		{
			return m_player.get(_key);
		}

		return m_player.get(m_sessionKey.get(_key));
	}
	public void RemoveIPlayer(String _key)
	{
		synchronized (m_removePlayer)
		{
			m_removePlayer.add(_key);
		}
	}
	public void Update(int _delay) throws IOException
	{
	
		for(var each0 : m_player.values())
		{
			if(each0!=null && each0.isUser())
			{
				CSession se=(CSession)each0;
				if(se.GetLive() && se.GetLiveTime()>1000*15 && CServerValue.m_testMode==false)
				{
					RemoveIPlayer(m_sessionKey.get(((CSession)each0).GetSession().getId()));
				}
			}
		}
		synchronized (m_removePlayer)
		{
			Vector<String> rDum=new Vector<String>();
			rDum.addAll(m_removePlayer);
			if(!m_removePlayer.isEmpty())
				m_removePlayer.clear();
			for(String each0 : rDum)
			{
				IPlayer player=GetIPlayer(each0);
				if(player!=null && player.isUser())
				{
					CSession se=(CSession)player;
					if(se.GetSession().isOpen())
						se.GetSession().close();
				}
				m_player.remove(each0);
				System.out.print("remove que : "+each0);
			}
			
		}
		
		
	}
	public boolean m_save=true;
}
