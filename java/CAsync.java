package cell;

import java.util.Vector;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;


class CAsyncDummy implements Runnable
{
	IAsync m_class;
	int m_delay;
	public CAsyncDummy(IAsync _class,int _delay)
	{
		m_class=_class;
		m_delay=_delay;
	}
	
	public void run() 
	{
		m_class.Update(m_delay);
		
	}
}

public class CAsync 
{
	
	static int m_count=-1;
	static Vector<IAsync> m_task=new Vector<IAsync>();
	static Vector<Future> m_future=new Vector<Future>();
	static ExecutorService m_exec=Executors.newFixedThreadPool(
            Runtime.getRuntime().availableProcessors());


	public static void Async(IAsync _class)
	{
		m_task.add(_class);
	}
	public static void AwaitUpdate(int _delay)
	{
		for (int i = 0; i < m_task.size(); ++i)
		{
			
			CAsyncDummy run = new CAsyncDummy(m_task.get(i),_delay); 
			m_future.add(m_exec.submit(run));


		}
			
		for(int i=0;i< m_future.size();++i)
		{
			try {
				m_future.get(i).get();
			} catch ( ExecutionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		m_future.clear();
		m_task.clear();
	}
}


