package cell;


public class CProtozoaVoxel extends CEventComponent
{

	protected CCanvasVoxel m_voxel;
	protected CProtozoa m_pro;
	//protected float m_rad=50;
	
	public CProtozoaVoxel()
	{
		
	}
	public void InitProtozoa(CCanvasVoxel _voxel)
	{
		
		m_voxel = _voxel;
	}
	public void Init()
	{
		m_pro = (CProtozoa)m_cobject;
		//m_rad=m_pro.GetPPt().GetBound().max.y;
		
		
		//m_rad=m_pro.GetBound().GetInRadius();
	}
	public void Update(int _delay)
	{
		if(m_pro.GetIntan())
			return;
		CBound bound=m_pro.GetBound();
		//CThreeVec3 ray = m_pro.GetDownRay();
		CVec3 pos = m_pro.GetPos();
		CVPick pick = m_voxel.Collision(pos, bound.GetInRadius());
		if (pick.dir!=DfV.DNull)
		{
			pick = m_voxel.Collision(pos, bound.GetInRadius());
			
			CVec3 dir = CMath.Vec3MinusVec3(m_pro.GetPos(), pick.GetPos());
			float len=CMath.Vec3Lenght(dir);
			dir = CMath.Vec3Normalize(dir);
			if(CMath.Vec3Dot(dir, new CVec3(0,1,0))>0.4)
			{
				m_pro.SetPos(new CVec3(m_pro.GetPos().x, pick.GetPos().y + DfV.AtomSize/2 + bound.GetInRadius(), m_pro.GetPos().z));
				m_pro.SendMoveQue();
			}
			else
			{
				CVPick bePick = pick.toCopy();		
				pick.dir = DfV.DUp;
				pick.DirToAi();
				var atom = m_voxel.FindCAtom(pick, false);
				if (atom.m_tex == DfV.TexNull)
				{
					m_pro.SetPos(new CVec3(m_pro.GetPos().x, bePick.GetPos().y + DfV.AtomSize/2 + bound.GetInRadius(), m_pro.GetPos().z));
					m_pro.SendMoveQue();
					return;
				}
				else
				{
					len-=DfV.AtomSize/2;
					len-=bound.GetInRadius();
					if(len<-0.1)
					{
						//dir = CMath.Vec3Normalize(dir);
						dir.y=0;
						m_pro.SetPos(CMath.Vec3PlusVec3(m_pro.GetPos(), CMath.Vec3MulFloat(dir, -len)));
						//CConsol.Log(m_pro.GetKey()+"충돌"+len);
						m_pro.SendStop(true);
						return;
					}
				}
				
				
			}
			
			
		}
		
		//키제거
		pos.y-=bound.GetInRadius();
		while (true)
		{
			//한셀 내려봄
			pos.y-=DfV.AtomSize;
			pick.SetPos(pos);
			CAtom atom=m_voxel.FindCAtom(pick, false);
			
			
			if (atom.m_tex==DfV.TexNull)
			{				
				pos.y+=bound.GetInRadius();
				pick = m_voxel.Collision(pos, bound.GetInRadius());
				if (pick.dir==DfV.DNull)
				{
					//바운딩이 에매하면 무한루프라서
					if(m_pro.GetPos().equals(pos))
						break;
					m_pro.SetPos(pos);
					m_pro.SendMoveQue();
				}
				else
					break;
//				m_pro.SetPos(pos);
//				m_pro.SendMoveQue();
			}
			else
				break;
		}
		
		m_voxel.NavWrite(m_pro.GetPos(), bound,m_pro.GetKey().hashCode());
	}
}
class CUserVoxel extends CProtozoaVoxel
{
	CUser m_user;
	float m_speed=100;

	public void Init()
	{
		super.Init();
		m_user = (CUser)m_cobject;
	}
	
	public void Update(int _delay)
	{
		super.Update(_delay);
	}
};