package cell;

import java.util.HashMap;
import java.util.Map;

public class CContainer {

}


class CMap<T1,T2>
{
	Map<T1,T2> m_map=new HashMap<T1, T2>();
	
	public void set(T1 _t1,T2 _t2)
	{
		m_map.put(_t1, _t2);
	}
	public T2 get(T1 t1)
	{
		return m_map.get(t1);
	}
	public void clear()
	{
		m_map.clear();
	}
}
