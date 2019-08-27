package cell;

import java.util.Vector;

public class CSculpture 
{

}
class CSculptureVoxel extends CEventComponent
{
	protected CCanvasVoxel m_voxel;
	public void InitScu(CCanvasVoxel _voxel)
	{
		m_voxel = _voxel;
	}
	
	public void Update(int _delay)
	{
		CBound bound=m_cobject.GetBound();
		//조형물은 2 벽으로 처리한다
		if(bound!=null)
			m_voxel.NavWrite(m_cobject.GetPos(), bound,2);
	}
}
class CScuSC
{
	
	static String m_script="";
	public static void Init(CCanvas _can,CCanvasVoxel _voxel)
	{
		if (m_script.isEmpty())
			m_script = CDbMgr.GetText("Sculpture");
		if (m_script.isEmpty())
			return;
		CPacket pac = new CPacket();
		pac.Deserialize(m_script);
		
		for(String each0 : pac.value)
		{
			CObject item=new CObject();
			item.Deserialize(each0);
			CSculptureVoxel cv=new CSculptureVoxel();
			cv.InitScu(_voxel);
			item.PushCComponent(cv);
			_can.Push(item);
		}
	}
}

