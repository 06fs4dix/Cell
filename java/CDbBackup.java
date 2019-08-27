package cell;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.SQLException;



import dal.CUtil;
import dal.LZString;

public class CDbBackup extends Thread  
{
	static CDbBackup m_ins=null;
	static int m_typeArr[]=null;
	static int m_typeCount[]=null;
	static CDb m_db[]=null;
	static CDb m_local=null;
	static public void Init(int _typeList[])
	{
		if(m_ins==null)
		{
			m_ins=new CDbBackup();
			m_typeArr=_typeList;
			m_typeCount=new int[m_typeArr.length];
			m_db=new CDb[m_typeArr.length];
			m_ins.start();
		}
	}
	public void run()
	{
		while(true)
		{
			try {
				Backup(m_typeArr);
				sleep(5000);
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				//e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				//e.printStackTrace();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				//e.printStackTrace();
			}
			catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
	}
	static public void Backup(int _typeList[]) throws UnknownHostException, SQLException, ClassNotFoundException
	{
		if(m_local==null)
			m_local=new CDb();
		m_local.m_info.m_backup=false;
	
		//for(int each1 : _typeList)
		for(int tOff=0;tOff<_typeList.length;++tOff)
		{
			int each1=_typeList[tOff];
			if(m_typeCount[tOff]<0)
			{
				m_typeCount[tOff]++;
				continue;
			}
				
			CDbInfo info=new CDbInfo();
			info.Setting(each1);
			InetAddress giriAddress = java.net.InetAddress.getByName(info.m_ip);
			InetAddress ip = InetAddress.getLocalHost();
			if(ip.getHostAddress().equals("192.168.0.12"))
				ip=java.net.InetAddress.getByName("home.rowplayon.com");
			
			if(giriAddress.getHostAddress().equals(ip.getHostAddress()))
				continue;
			//System.out.println("2 tar : "+giriAddress.getHostAddress()+" org :"+ip.getHostAddress());
			//CDb db=null;
			try
			{
				if(m_db[tOff]==null)
					m_db[tOff]=new CDb(each1);
				String computerName = InetAddress.getLocalHost().getHostName();
				
				


				String rval=m_db[tOff].Recv("SELECT _offset,_connect,_qurry FROM back_up_qurry "
						+ "WHERE _connect   NOT LIKE '%"+computerName+"%' OR _connect IS NULL");
				
				
				String col[]=rval.split(CDb.m_coloumTok);
				
				for(String each0 : col)
				{
					if(each0.isEmpty())
						continue;
					String row[]=each0.split(CDb.m_rowTok);
					System.out.println(giriAddress+" / "+row[2]);
					
					m_local.Send(LZString.decompressFromBase64(row[2]));
					m_db[tOff].Send("update back_up_qurry set _connect='"+row[1]+computerName+"' where _offset="+row[0]);
				}
				//m_db[tOff].Close();
			}
			catch (Exception e) {
				if(m_db[tOff]!=null)
					m_db[tOff].Close();
				m_typeCount[tOff]++;
				
				if(m_typeCount[tOff]>10)
				{
					m_typeCount[tOff]=-360;
				}
				continue;
			}
			
			
		}//for
		//type0.Close();
	}
}
