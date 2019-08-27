package cell;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import javax.activation.DataSource;

import dal.CUtil;
import dal.LZString;

public class CDb 
{
	public CDb() throws ClassNotFoundException, SQLException
	{
		m_info.LocalSetting0();
		Init();
		
	}
	public CDb(int _type) throws ClassNotFoundException, SQLException
	{
		m_info.Setting(_type);
		Init();
	}
	protected void finalize()
	{
		try {
			Close();
		} catch (SQLException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public static String m_rowTok="#323";
	public static String m_coloumTok="~728";
	
	
	Connection m_conn=null;
	//PreparedStatement m_pstmt=null;
	Statement m_stmt=null;
	ResultSet m_result=null;
	//DataSource m_ds=null;
	String m_qurry;
	
	public CDbInfo m_info=new CDbInfo();
	
	
	
	
	
	public void Init() throws SQLException, ClassNotFoundException
	{
		
			if(m_info.m_sqlType==null)
				throw new SQLException("sqlType Null");
			else if(m_info.m_sqlType.equals("mysql"))
			{
				Class.forName("com.mysql.cj.jdbc.Driver");
				
				//m_conn=DriverManager.getConnection("jdbc:mysql://112.155.48.37:3306/dal","root","apmsetup");
				m_conn=DriverManager.getConnection("jdbc:mysql://"+m_info.m_ip+":"+m_info.m_port+"/"+
				m_info.m_dbName+"?serverTimezone=Asia/Seoul&useSSL=false",m_info.m_id,m_info.m_ps);
				//m_conn=DriverManager.getConnection("jdbc:mysql://218.54.20.103:3307/dal","root","apmsetup");
				if(m_conn==null)
					 throw new SQLException("Connection Null");
				
				
				m_stmt=m_conn.createStatement();
				if(m_stmt==null)
					 throw new SQLException("Statement Null");
			}
			else if(m_info.m_sqlType.equals("mysql5"))
			{
				Class.forName("com.mysql.jdbc.Driver");
				
				//m_conn=DriverManager.getConnection("jdbc:mysql://112.155.48.37:3306/dal","root","apmsetup");
				m_conn=DriverManager.getConnection("jdbc:mysql://"+m_info.m_ip+":"+m_info.m_port+"/"+m_info.m_dbName+
						"?serverTimezone=Asia/Seoul&useSSL=false",m_info.m_id,m_info.m_ps);
				//m_conn=DriverManager.getConnection("jdbc:mysql://218.54.20.103:3307/dal","root","apmsetup");
				if(m_conn==null)
					 throw new SQLException("Connection Null");
				
				
				m_stmt=m_conn.createStatement();
				if(m_stmt==null)
					 throw new SQLException("Statement Null");
			}
			
			else if(m_info.m_sqlType.equals("mssql"))
			{
				Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
				//m_conn=DriverManager.getConnection("jdbc:sqlserver://218.54.20.190:1433;"+"databaseName=RYL_Users;"+"user=game_jupsok;"+"password=0000;");
				m_conn=DriverManager.getConnection("jdbc:sqlserver://"+m_info.m_ip+":"+m_info.m_port+";"+"databaseName="+
				m_info.m_dbName+";"+"user="+m_info.m_id+";"+"password="+m_info.m_ps+";");
				if(m_conn==null)
					 throw new SQLException("Connection Null");
				
				
				m_stmt=m_conn.createStatement();
				if(m_stmt==null)
					 throw new SQLException("Statement Null");
			}
			else
				throw new SQLException("Init Null");
			
		
	}
	public void Close() throws SQLException
	{
		if(m_conn!=null)
			m_conn.close();
		m_conn=null;
		if(m_stmt!=null)
			m_stmt.close();
		m_stmt=null;
		if(m_result!=null)
			m_result.close();
		m_result=null;
	}
	public void Excute(boolean _fExeuteTUpdate) throws SQLException
	{
		if(m_stmt==null)
			 throw new SQLException("Statement Null");
		
		if(!_fExeuteTUpdate)
			m_result = m_stmt.executeQuery(m_qurry);
		else
			m_stmt.executeUpdate(m_qurry);
		
		//System.out.println(m_qurry);
	}
	public synchronized void Send(String _qurry) throws SQLException
	{
		//System.out.println(_qurry);
		
		
		m_qurry=_qurry;
		Excute(true);
		if(m_info.m_backup)
		{
			m_qurry="insert into back_up_qurry values(null,null,'"+LZString.compressToBase64(_qurry)+"')";
			Excute(true);
		}

		
	}
	public synchronized String Recv(String _qurry) throws SQLException
	{
		//System.out.println(_qurry);
		String rVal="";
		
		if(m_conn==null)
			 throw new SQLException("Connection Null");
		m_qurry=_qurry;
		//System.out.println(_qurry);
		Excute(false);
		boolean fChk=false;
		while(m_result.next())
		{
			if(fChk)
				rVal+=m_coloumTok;
			fChk=true;
			ResultSetMetaData rsmd = m_result.getMetaData();
			int columnsNumber = rsmd.getColumnCount();
			//int rowCount=m_result.getRow();
			boolean empyt=false;
			//System.out.println("columnsNumber : "+columnsNumber);
			for(int i=0;i<columnsNumber;++i)
			{
				if(i!=0)
					rVal+=m_rowTok;
				String data=m_result.getString(i+1);
				if(data!=null && !data.equals("null"))
					rVal+=data;
				else if(columnsNumber>1)
					empyt=true;
			}
			if(empyt)
				rVal+=m_rowTok+" ";
			
		}
		
		

		return rVal;
	}
	
	
}
class CDbInfo
{
	public String m_sqlType=null;
	public String m_id=null;
	public String m_ps=null;
	public String m_dbName=null;
	public String m_ip=null;
	public String m_port=null;
	public boolean m_backup=false;
	
	public void Setting(int _type)
	{
		if(_type==0)
			LocalSetting0();
		else if(_type==1)
			UpdateSetting1();
		else if(_type==2)
			HomeSetting2();
		else if(_type==3)
			TestSetting3();
	
	}
	public void  LocalSetting0()
	{
		m_backup=true;
		m_sqlType="mysql";
		m_id="root";
		m_ps="dgient3511";
		m_dbName="dal";
		m_ip="127.0.0.1";
		m_port="3306";
	}
	public void  UpdateSetting1()
	{
		m_sqlType="mysql";
		m_id="root";
		m_ps="dgient3511";
		m_dbName="dal";
		m_ip="update.rowplayon.com";
		m_port="3306";
	}
	public void  HomeSetting2()
	{
		m_sqlType="mysql";
		m_id="root";
		m_ps="dgient3511";
		m_dbName="dal";
		m_ip="home.rowplayon.com";
		m_port="3306";

	}
	public void  TestSetting3()
	{
		m_sqlType="mysql";
		m_id="root";
		m_ps="dgient3511";
		m_dbName="dal";
		m_ip="test.rowplayon.com";
		m_port="3306";
		
	}
}