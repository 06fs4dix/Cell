package cell;

public class CConsol 
{
	static int m_count=0;
	static String m_before="";
	public static void Log(int _text)
	{
		Log(Integer.toString(_text));
	}
	public static void Log(String _text)
	{
		if(m_before.equals(_text))
		{
			m_count++;
			
		}
		else
		{
			
			m_before=_text;
			System.out.println(" ("+m_count);
			System.out.print(_text);
			
			m_count=0;
		}
			
		
		
		
		
	}
	
	public static void Log(CVec3 _vec)
	{
		Log(_vec.x+","+_vec.y+","+_vec.z);
	}
}
