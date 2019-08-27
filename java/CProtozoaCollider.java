package cell;


public class CProtozoaCollider extends CEventComponent
{
	protected CProtozoa m_pro;
	boolean m_colChk=true;
	public CProtozoaCollider()
	{
		
	}
	
	public void Init()
	{
		m_pro = (CProtozoa)m_cobject;
	
	}
	public void Update(int _delay)
	{

		if(m_colChk==false && m_pro.GetOverlap())
			m_pro.SetOverlap(false);
		m_colChk=false;
	}
	public void Collision(CObject _obj, float _len)
	{
		m_colChk=true;
		if(_len<0.1)
			return;
		if(m_pro.GetGhost())
			return;
		
		
		if(_obj instanceof CProtozoa)
		{
//			if(m_pro.GetOverlap())
//				return;
			
			if(((CProtozoa)_obj).GetGhost())
				return;
			m_pro.SetCollusion((CProtozoa)_obj);
			((CProtozoa) _obj).SetCollusion(m_pro);
		}
		
		CVec3 mPos = CMath.Vec3MinusVec3(m_pro.GetPos(), _obj.GetPos());
		//float len = CMath.Vec3Lenght(mPos);
		mPos.y = 0;
		CVec3 dir = CMath.Vec3Normalize(mPos);
		m_pro.SetPos(CMath.Vec3PlusVec3(m_pro.GetPos(), CMath.Vec3MulFloat(dir, _len)));
		m_pro.SendStop(false);
		
		
		//CConsol.Log("Collision");
		
	}
	
}
