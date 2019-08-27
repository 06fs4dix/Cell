package cell;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.SQLException;

import dal.CUtil;
import dal.LZString;


public class CDbMgr 
{
	static int m_minOff=10000000;
	public static  String GetCMolecule(int _x,int _y,int _z) 
	{
		
		CDb db;
		try {
			db = new CDb();
			return db.Recv("select _text from memo3 where _type='CMolecule CVIndex"+_x+","+_y+","+_z+"' ORDER BY _offset DESC LIMIT 1");
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		
		return null;
	}
	
	public static void SetCMolecule(int _x,int _y,int _z,String  _data)
	{
		String dummy="insert into memo3 values(NULL,'CMolecule CVIndex" + _x + "," + _y + "," + _z + "','" + _data + "',NOW())";
		CDb db;
		try {
			db = new CDb();
			db.Send(dummy);
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}
	public static void SetCMoleculeRAW(int _x,int _y,int _z,String  _data)
	{
		_data=LZString.compressToBase64(_data);
		String dummy="insert into memo3 values(NULL,'CMolecule CVIndex" + _x + "," + _y + "," + _z + "','" + _data + "',NOW())";
		CDb db;
		try {
			db = new CDb();
			db.Send(dummy);
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}
	
	public static boolean isConnectUser(String _id)
	{
		try {
			String computerName = InetAddress.getLocalHost().getHostName();
			CDb db=new CDb();
			String rVal=db.Recv("select _type from memo3 where _type like '%connect88%' and _text='"+_id+"'");
			db.Close();
			if(rVal.equals("connect88_"+computerName))
				return false;
			if(!rVal.isEmpty())
				return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	public static boolean IdPwChk(String _id,String _pw)
	{
		String rVal="";
		try {
			CDb db=new CDb();
			rVal=db.Recv("SELECT DISTINCT _type FROM memo3 WHERE _type LIKE '"+_id+"_user88_%' ORDER BY _offset DESC");
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(rVal.isEmpty())
			return true;
		return rVal.equals(_id+"_user88_"+_pw);
	}
	public static void SetUser(String _id,String _pw,String _text)
	{
		
		try {
			CDb db=new CDb();
			db.Send("insert into memo3 values(NULL,'"+_id+"_user88_"+_pw+"','"+_text+"',NOW())");
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public static String GetUser(String _id,String _pw)
	{
		String rVal="";
		try {
			CDb db=new CDb();
			rVal=db.Recv("SELECT _text FROM memo3 WHERE _type='"+_id+"_user88_"+_pw+"' AND _offset<"+
					m_minOff+" ORDER BY _offset DESC LIMIT 1");
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rVal;
	}
	public static void SetText(String _type,String _text)
	{
		
		try {
			CDb db=new CDb();
			_text=LZString.compressToBase64(_text);
			db.Send("insert into memo3 values(NULL,'"+_type+"','"+_text+"',NOW())");
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public static void SetTextCompress(String _type,String _text)
	{
		
		try {
			CDb db=new CDb();
			db.Send("insert into memo3 values(NULL,'"+_type+"','"+_text+"',NOW())");
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public static String GetText(String _type)
	{
		String rVal="";
		try {
			CDb db=new CDb();

			rVal=db.Recv("SELECT _text FROM memo3 WHERE _type='"+_type+"' AND _offset<"+
						m_minOff+" ORDER BY _offset DESC LIMIT 1");
			rVal=LZString.decompressFromBase64(rVal);
			if(rVal==null)
				rVal="";
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rVal;
	}
	public static String GetComment()
	{
		String rVal="";
		
		
		try {
			CDb db=new CDb();
			rVal=db.Recv("SELECT _offset,_text FROM memo3 WHERE _type LIKE '%comment%' ORDER BY _offset DESC LIMIT 0 , 20");
			db.Close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return rVal;
	}
}
