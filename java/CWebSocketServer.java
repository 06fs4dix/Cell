package cell;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Collections;
import java.util.ConcurrentModificationException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import dal.LZString;






public class CWebSocketServer extends Thread 
{
	Vector<CPacketSmart> smtPac=new Vector<CPacketSmart>();
	Vector<CPacketSmart> inPac=new Vector<CPacketSmart>();
	public void WInit()
	{
		
	}
	public void WUpdate(int _delay)
	{
		synchronized (GSV().m_player)
		{
			try {
				
				GSV().Update(_delay);
				smtPac.addAll(GSV().m_packetQue);
				GSV().m_packetQue.clear();
				AllSendQue(smtPac);
				smtPac.clear();
				
				
			} catch (IOException  e ) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}catch (ConcurrentModificationException e) {
				// TODO: handle exception
				e.printStackTrace();
			}
			
			
		}
	}
	public void WMessage(Session session,CPacket _packet)
	{
		
	}
	public void WMessage(Session session,String _event,JSONObject _json)
	{
		
	}
	void Sleep()
	{
		
	}
	public void WOpen(Session session) 
	{
		
	}
	public void WClose(IPlayer _user)
	{
		
	}

	public static boolean m_packetShow=false;
	public static boolean m_debug=false;
	public static boolean m_dist=true;
	public static boolean m_script=false;
	public static Set<String> m_joinUser=new HashSet<String>();
	
	public CServerValue GSV()
	{
		return null;
	}
	
	

	synchronized public void Send(Session _session,CPacket _packet)
	{
		try {
			_session.getBasicRemote().sendText(_packet.Serialize());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IllegalStateException e) {
			e.printStackTrace();
		}
	}
	public void Sleep(int time){

		try {

			Thread.sleep(time);

		} catch (InterruptedException e) { }

	}
	int m_thState=0;
	public void run()
	{
		
		
		
	}
	void MessageLoop()
	{
		System.out.println("MessageLoop");
		Vector<CPacketSmart> copyPac=new Vector<CPacketSmart>();
		while(true)
		{
			if(GSV().m_userCount<=0 && GSV().m_serverSleep)
			{
				try {
					sleep(100);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				Sleep();
			}
			
			//TODO 여기서 복사 삭제가 많다
			
			synchronized (inPac) 
			{
				copyPac.addAll(inPac);
				
				if(!inPac.isEmpty())
					inPac.clear();
			}
			
			for(CPacketSmart each1 : copyPac)
			{
				Send(each1);
			}
			if(!copyPac.isEmpty())
				copyPac.clear();
			
			
			try {
				sleep(1);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			
		}
	}
	void GameLoop()
	{
		System.out.println("GameLoop");
		long beforeTime=System.currentTimeMillis();
		
		while(true)
		{
			long delay=System.currentTimeMillis()-beforeTime;
			beforeTime=System.currentTimeMillis();
			
			
			if(GSV().m_userCount<=0 && GSV().m_serverSleep)
			{
				try {
					sleep(100);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				Sleep();
				continue;
			}
			if(delay<1000)
				WUpdate((int) delay);
			try {
				sleep(1);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}//while
	}
	

	public void Message(String message, Session session) throws IOException, SQLException
	{
		if(session!=null && m_packetShow)
			System.out.println("R:"+message);
		CPacket pac=new CPacket();
		pac.Deserialize(message);
		
		if(pac.name.equals("Json"))
		{
			JSONParser jsonParser = new JSONParser();
			try {
				JSONObject jsonObject = (JSONObject) jsonParser.parse(pac.value.get(1));
				WMessage(session,pac.value.get(0),jsonObject);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else if(pac.name.equals("Lz"))
		{
			try {
				this.Message(LZString.decompressFromBase64(pac.value.get(0)),session);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else if(pac.name.equals("Join"))//1차 호출
		{
			GSV().m_joinUser.add(pac.value.get(0));
		}
		else if(pac.name.equals("ConnectPlayer"))//1차 호출
		{
			String id=pac.value.get(0);
			
			
			if(GSV().m_joinUser.contains(id)==false)
			{
				CPacket req0=new CPacket();
				req0.name="Error";
				req0.value.add("정상 접근이 아닙니다");
				Send(session,req0);
				return;
			}
			GSV().m_joinUser.remove(id);
			
			
			
			if(CDbMgr.isConnectUser(id))
			{
				
				CPacket req0=new CPacket();
				req0.name="Error";
				req0.value.add("이미 접속해 있습니다");
				Send(session,req0);
				return;
			}
			
			IPlayer player=null;
			synchronized (GSV().m_player)
			{
				player=GSV().GetIPlayer(id);
			}
			if(CDbMgr.IdPwChk(pac.value.get(0),pac.value.get(1))==false)
			{
				CPacket req0=new CPacket();
				req0.name="Error";
				req0.value.add("누군가가 사용중이거나 or 아이디/패스워드가 틀립니다!");
				req0.Push(1);
				Send(session,req0);
			}
			else if(player!=null)
			{
				CPacket req0=new CPacket();
				req0.name="Error";
				req0.value.add("서버에 이미 접속해 있습니다! 잠시후 접속해 주세요!");
				req0.Push(2);
				Send(session,req0);
			}
			else
			{
				synchronized (GSV().m_player)
				{
					CPacket req0=new CPacket();
					req0.name="ConnectSuccess";
					Send(session,req0);
					
					GSV().m_sessionKey.put(session.getId(), pac.value.get(0));
				}
			}
		}
		else if(pac.name.equals("Live"))
		{
			synchronized (GSV().m_player)
			{
				CSession user=(CSession)GSV().GetIPlayer(session.getId());
				if(user!=null)//아직 생성중에는 널이다
				{
					user.LiveTimeRefrash();
				}
				//System.out.println((session)+" Live");
				CPacket packet=new CPacket();
				packet.name="Live";
				Send(session, packet);
			}
		}
		else if(pac.name.equals("ServerState"))
		{
			
			
			CPacket packet=new CPacket();
			packet.name="ServerState";
			packet.Push(GSV().m_init);
			Send(session, packet);
		}
		else
		{
			
			WMessage(session,pac);
			
		}
		
	}
	public synchronized void Open(Session session) 
	{
		
		if(GSV().m_init==CServerValue.DfInitReady)
		{
			CPacket packet=new CPacket();
			packet.name="ServerState";
			packet.Push(GSV().m_init);
			Send(session, packet);
			
			GSV().m_init=CServerValue.DfInitLoad;
			WInit();
			GSV().m_init=CServerValue.DfInitSuccess;
			start();
			//start();
			CWebSocketServer web=this;
			new Thread(() -> 
			{ 
				web.GameLoop();
			}).start();
			new Thread(() -> 
			{ 
				web.MessageLoop();
			}).start();
			
			
			
		}
		WOpen(session);
		System.out.println("open "+session);
	}
	public  synchronized void Close(Session session) 
	{

		if(GSV().m_adminSession==session)
			GSV().m_adminSession=null;
		synchronized (GSV().m_player)
		{
			System.out.println("close"+session);
			
			
			
			IPlayer player=GSV().GetIPlayer(session.getId());
			String key=GSV().m_sessionKey.get(session.getId());
			if(key!=null)
				GSV().m_sessionKey.remove(session.getId());
			if(player==null)
				return;

			WClose(player);
			if(GSV().m_userCount==0)
			{
				GSV().Reset();
				System.out.println("sleep Mode!");
			}
			((CSession)player).SetLive(false);
			
			

		}
	}
	void AllSendQue(Vector<CPacketSmart> _packetQue)
	{
		if(_packetQue.isEmpty())
			return;
		CPacketSmart pac=new CPacketSmart();
		pac.name="AllSendQue";
		
		for(CPacketSmart each1 : _packetQue)
		{
			if(each1.m_in)
			{
				if(each1.m_thread)
				{
					synchronized (inPac) 
					{
						inPac.add(each1);
					}
				}
				else
					Send(each1);
			}
			else if(each1.m_accepter!=null || each1.m_pos!=null)
				Send(each1);
			else
				pac.Push(each1);
		}
		_packetQue.clear();
		if(pac.value.isEmpty())
			return;
		Send(pac);
		
	}
	public void Send(Vector<CPacketSmart> _packetQue)
	{
		for(CPacketSmart each1 : _packetQue)
		{
			Send(each1);
		}
		if(!_packetQue.isEmpty())
			_packetQue.clear();
	}
	public void Send(CPacketSmart _packet) 
	{
		if(_packet.m_disable)
			return;
		if(m_packetShow)
			System.out.println("S:"+_packet.name);
		try 
		{
			if(!_packet.m_in)
			{
				if(_packet.m_accepter==null)
				{
					//AllUser_Send(_packet);
					for(IPlayer each0 : GSV().m_player.values())
					{
						if(each0.isUser())
						{
							CSession user=(CSession)each0;
							if(user.GetSession()==null)
								continue;
							if(m_dist && _packet.m_pos!=null && user.DisplayOut(_packet.m_pos))
								continue;
							if(user.GetSession().isOpen())
								user.GetSession().getBasicRemote().sendText(_packet.Serialize());
						}
					}//for
					if(GSV().m_adminSession!=null)
						GSV().m_adminSession.getBasicRemote().sendText(_packet.Serialize());
				}
				else
				{
					_packet.m_accepter.GetSession().getBasicRemote().sendText(_packet.Serialize());
				}
			}
			else
			{
				Session se=null;
				if(_packet.m_accepter!=null)
				{
					se=_packet.m_accepter.GetSession();
				}
				
				Message(_packet.Serialize(), se);
			}
		}//try
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IllegalStateException e) 
		{
			GSV().m_adminSession=null;
			e.printStackTrace();
		}
		catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public CPacket Compress(CPacket _pac)
	{
		String str=_pac.Serialize();
		CPacket pac=new CPacket();
		pac.name="Lz";
		pac.value.add(LZString.compressToBase64(str));
		if(str.length()<pac.value.get(0).length())
			return _pac;
		return pac;
	}
	public CPacket Emit(String _event,JSONObject _json)
	{
		CPacket pac=new CPacket();
		pac.name="Json";
		pac.value.add(_event);
		pac.value.add(_json.toJSONString());
		return pac;
	}
}
