package cell;

import java.util.Vector;


class DfShotType
{
	static public int Arrow=0;
	static public int Fire=1;
}
class CProjectileSkill implements ISerialize
{
	int m_skillOffset=-1;
	int m_skillLevel=0;
	CProjectileSkill(){}
	CProjectileSkill(int _off,int _lv)
	{
		m_skillOffset=_off;
		m_skillLevel=_lv;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(m_skillOffset);
		pac.Push(m_skillLevel);

		return pac;
	}
	
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_skillOffset = pac.GetInt32(0);
		m_skillLevel = pac.GetInt32(1);
	}
}
public class CProjectile extends CObject 
{
	CVec2 m_size;
	String m_img;
	CVec3 m_startPos=new CVec3();
	CProtozoa m_owner=null;
	float m_speed;
	boolean m_removeCol=true;
	int m_removeLen=1000;

	//CPlayerTarget m_target;
	CProjectileSkill m_skill=null;
	Vector<CProtozoa> m_penetrate=null;


	//boolean m_only;
	CProtozoa m_track=null;
	int m_trackTime=0;

	
	CPaint m_pt;
	CCollider m_co;
	CRigidBody m_rb;
	int m_pType;
	void CreateArrow(CProtozoa _owner,CVec3 _startPos,int _pType)
	{
		Init();
		m_owner=_owner;
		m_startPos=_startPos;
		m_pType=_pType;
		if(m_pType==DfShotType.Arrow)
			m_img="img/crawl-tiles Oct-5-2010/effect/arrow2.png";
		else
			m_img="img/crawl-tiles Oct-5-2010/effect/bolt04.png";

		SetPos(_startPos);
	}
	CRigidBody GetRb()
	{
		return m_rb;
	}
	public CBound GetBound()
	{
		CBound bound=m_co.GetBound().toCopy();
		bound.min = CMath.MatToVec3Normal(bound.min, m_co.GetLMat());
		bound.min.z=bound.min.y;
		bound.max = CMath.MatToVec3Normal(bound.max, m_co.GetLMat());
		bound.max.z=bound.max.y;
		//m_rad=bound.max.y;
		return bound;
	}
	void Init()
	{
		
		m_size=new CVec2(50,50);
		m_pt = new CPaintBillbord(m_size,"res/none.png");
		super.PushCComponent(m_pt);
		
		m_co=new CCollider(m_pt);
		super.PushCComponent(m_co);
		m_co.SetCollision(true);
		
		m_rb=new CRigidBody();
		super.PushCComponent(m_rb);
		
	}
	public CPacket Serialize() {
		CPacket pac = new CPacket();

		pac.Push(m_offset);
		pac.Push(m_key);

		pac.Push(m_pos);
		pac.Push(m_rot);
		pac.Push(m_sca);

		pac.Push(m_size);
		pac.Push(m_img);
		
		pac.Push(m_rb);
		pac.Push(m_pType);
		

		return pac;
	}
	public void Update(int _delay)
	{
		super.Update(_delay);
		
		if(m_track!=null)
		{
			if(m_track.GetAction()==DfPAction.Die)
			{
				Destroy();
				CPacketZone pac=new CPacketZone();
				pac.RemoveObject(this);
				m_packet.add(pac);
			}
			else if(m_trackTime<=0)
			{
				m_rb.Remove("move");

				CVec3 dir=CMath.Vec3Normalize(CMath.Vec3MinusVec3(m_track.GetPos(), GetPos()));
				m_rb.Push(new CMovement("move",dir,m_speed));
				
				m_trackTime=200;
				CPacketZone smt=new CPacketZone();
				smt.SMQ("CProjectile",GetKey(), m_rb, GetPos());
				m_packet.add(smt);
			}
				
			
			m_trackTime-=_delay;
		}
		
		
		
		if(CMath.Vec3Lenght(CMath.Vec3MinusVec3(m_startPos, GetPos()))>m_removeLen)
		{
			Destroy();
			CPacketZone pac=new CPacketZone();
			pac.RemoveObject(this);
			m_packet.add(pac);
		}
	}

}
class CProjectilePro extends CEventComponent
{

	protected CCanvas m_pzCan;
	protected CCanvasVoxel m_voxel;
	protected CProjectile m_pro;
	//protected float m_rad=50;
	
	public CProjectilePro()
	{
		
	}
	public void InitProjectile(CCanvasVoxel _voxel,CCanvas _pzCan)
	{
		m_pzCan=_pzCan;
		m_voxel = _voxel;
	}
	public void Init()
	{
		m_pro = (CProjectile)m_cobject;
		//m_rad=m_pro.GetPPt().GetBound().max.y;
		
		
		//m_rad=m_pro.GetBound().GetInRadius();
	}
	public void Update(int _delay)
	{
		CBound bound=m_pro.GetBound();
		CVec3 pos = m_pro.GetPos();
		CVPick pick = m_voxel.Collision(pos, bound.GetInRadius());
		if (pick.dir != DfV.DNull)
		{
			m_pro.Destroy();
			CPacketZone pac=new CPacketZone();
			pac.RemoveObject(m_pro);
			m_pro.PushPacket(pac);
			return;
		}
		for(var each0 : m_pzCan.GetObjectMap().values())
		{
			CProtozoa pro=(CProtozoa)each0;
			
			if(CGroup.Attack(m_pro.m_owner.GetGroup(),pro.GetGroup())==false &&
					m_pro.m_skill==null)
					continue;
			
			CBound pBound=pro.GetBound();
			float len=CMath.Vec3Lenght(CMath.Vec3MinusVec3(m_pro.GetPos(), pro.GetPos()));
			//System.out.println(pro.GetKey()+" / "+len);
			if(pBound.GetInRadius()+bound.GetInRadius()>len)
			{
				if(m_pro.m_penetrate!=null)
				{
					boolean in=false;
					for(var each1 : m_pro.m_penetrate)
					{
						//System.out.println(each1.GetKey());
						if(each1==pro)
						{
							in=true;
							break;
						}
					}
					if(in)
						continue;
					m_pro.m_penetrate.add(pro);
				}
				if(m_pro.m_skill!=null)
				{
					pro.PushSkill(CSkSC.GetSkill(m_pro.m_skill.m_skillOffset),
							m_pro.m_skill.m_skillLevel, m_pro.m_owner);
				}
				else
				{
					pro.SendDamage(new CDamage(m_pro.m_owner, CDamage.Shot));
				}
				
				if(m_pro.m_penetrate==null)
				{
					m_pro.Destroy();
					CPacketZone pac=new CPacketZone();
					pac.RemoveObject(m_pro);
					m_pro.PushPacket(pac);
					break;
				}
				
				
			}
		}
		

		
	}
}