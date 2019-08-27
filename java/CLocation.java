package cell;

import java.util.Vector;

public class CLocation extends CObject 
{
	void Init()
	{
		CCollider cl=(CCollider)GetCComponent(Df.CComponent.CCollider).get(0);
		cl.SetCollision(true);
	}
	CVec3 GetBoundRandPos()
	{
		CCollider cl=(CCollider)GetCComponent(Df.CComponent.CCollider).get(0);
		CBound bound=cl.GetBound().toCopy();
		bound.min.x = bound.min.x* m_sca.x;
		bound.min.y = bound.min.y* m_sca.y;
		bound.min.z = bound.min.z* m_sca.z;
		
		bound.max.x = bound.max.x* m_sca.x;
		bound.max.y = bound.max.y* m_sca.y;
		bound.max.z = bound.max.z* m_sca.z;
		
		CVec3 pos=new CVec3();
		pos.x=(float) (Math.random()*bound.max.x*2)+bound.min.x;
		pos.y=(float) (Math.random()*bound.max.x*2)+bound.min.x;
		pos.z=(float) (Math.random()*bound.max.x*2)+bound.min.x;
		pos=CMath.Vec3PlusVec3(pos, m_pos);
		
		return pos;
	}
	public void Update(int _delay)
	{
		super.Update(_delay);
		
		for(var each0 : m_bCol)
		{
			each0.VMapPushPop(VK.Get(Df.VMap.Lc, GetKey()), 0);
		}
		
		
		m_bCol.clear();
	}
	Vector<CProtozoa> m_bCol=new Vector<CProtozoa>();
	public void Collision(CComponent _com, CObject _col, float _len)
	{
		
		if(_col instanceof CProtozoa)
		{
			((CProtozoa) _col).VMapPushPop(VK.Get(Df.VMap.Lc, GetKey()), _len<1?1:(int)_len);
			m_bCol.add((CProtozoa) _col);
		}
		

	}
}
class CLocationSC
{
	//static public Vector<CLocation> m_location=new Vector<CLocation>();
	static String m_script="";
	public static void Init(CCanvas _can)
	{
		if (m_script.isEmpty())
			m_script = CDbMgr.GetText("Location");
		if (m_script.isEmpty())
			return;
		CPacket pac = new CPacket();
		pac.Deserialize(m_script);
		
		for(String each0 : pac.value)
		{
			CLocation item=new CLocation();
			item.Deserialize(each0);
			item.Init();
			_can.Push(item);
		}
	}
}
		
		
	