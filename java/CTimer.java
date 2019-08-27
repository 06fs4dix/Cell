package cell;

public class CTimer 
{
	long m_begin=System.currentTimeMillis();
	public int Delay()
	{
		long before=m_begin;
		m_begin=System.currentTimeMillis();
		return (int) (System.currentTimeMillis()-before);
	}

}
class CFrame
{
	static int m_addTime;
	static CTimer m_time=new CTimer();
	static int m_count;
	static int m_lastFrame;

	public static int Get()
	{
		m_addTime += m_time.Delay();
		if (m_addTime > 1000)
		{
			m_addTime -= 1000;
			m_lastFrame = m_count;
			m_count = 0;
		}
		m_count++;

		return m_lastFrame;
	}
};