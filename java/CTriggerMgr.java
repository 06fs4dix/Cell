package cell;

import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

public class CTriggerMgr {
	Vector<CTrigger> m_triggerVec=new Vector<CTrigger>();
	Map<String, Object> m_valueMap=new HashMap<String, Object>();
	CZoneValue m_zv=null;
	CTriggerMgr(CZoneValue _zv)
	{
		m_zv=_zv;
	}
	public void PushTrigger(CTrigger _trigger)
	{
		m_triggerVec.add(_trigger);
		m_triggerVec.lastElement().Init(this);
	}
	void Update(int _delay)
	{
		
		for(CTrigger each0 : m_triggerVec)
		{
			for(CRenObj _player : m_zv.m_pzCan.GetObjectMap().values())
			{
				each0.Search((CProtozoa)_player);
			}
			each0.Update(_delay);
		}
	}
}
