package cell;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Vector;




class DfPAttackType
{
	public static int Nonviolence = 0;
	public static int First = 1;
	public static int Near = 2;
	public static int Weak = 3;
	public static int Null = 4;
};

class DfPActionDetail
{
	public static int Basic = 0;
	public static int Move = 1;
	public static int BasicRight = 2;
	public static int BasicLeft = 3;
	public static int BasicTop = 4;
	public static int BasicBottom = 5;
	public static int MoveRight = 6;
	public static int MoveLeft = 7;
	public static int MoveTop = 8;
	public static int MoveBottom = 9;
	//public static int Count = 5;
	//public static int Null = 6;
};
class DfPAction
{
	public static int Normal = 0;
	public static int Die = 100;
	public static int Attack = 200;
	public static int Escape = 300;
	public static int CoercionMove = 400;
	public static int CoercionAttack = 500;
	public static int Count = 600;
	public static int Null = 601;
};
class DfPType
{
	public static int User = 0;
	public static int Npc = 1;
	public static int Monster = 2;
	public static int Count = 3;
	public static int Null = 4;
};
class DfFindPath
{
	public static int Move = 0;
	public static int Attack = 1;
	public static int CMove = 2;
	public static int CAttack = 3;
	public static int Count = 4;
	public static int Null = 5;
};




class CGroup
{
	public static int UserBegin = 10000;
	public static int UserEnd = 50000;
	
	public static int None = 0;//공격 불가
	public static int Npc = 1;//npc
	public static int Wild = 2;//모두 공격
	public static int Normal = 3;//평범
	
	public static int SameBegin = 4000;//평범
	
	
	public static int AttackChk = 50001;//npc
	public static int AllianceChk = 50002;//모두 공격
	public static int AggressivityChk = 50003;//평범
	
	
	
	static public boolean Chk(int _type,int _i,int _u)
	{
		if(_type==AttackChk)
			return Attack(_i,_u);
		else if(_type==AllianceChk)
			return Alliance(_i,_u);
		else if(_type==AggressivityChk)
			return Aggressivity(_i,_u);
		
		return false;
	}
	//공격가능
	static public boolean Attack(int _a,int _b)
	{
		CGDummy dummy=new CGDummy(_a,_b);
		if(_a==_b)
			return false;
		if(dummy.npc!=-1)
			return false;
		if(_a==CGroup.Wild || _b==CGroup.Wild)
			return true;
		return true;
	}
	//동맹이냐
	static public boolean Alliance(int _a,int _b)
	{
		if(_a==_b)
			return true;
		if(_a==CGroup.Wild || _b==CGroup.Wild)
			return false;
		return false;
	}
	//공격성 : 선제 공격할껀지
	static public boolean Aggressivity(int _a,int _b)
	{
		CGDummy dummy=new CGDummy(_a,_b);
		
		if(_a==_b)
			return false;
		if(dummy.npc!=-1)
			return false;
		if(_a==CGroup.Wild || _b==CGroup.Wild)
			return true;
		
		if(dummy.user==-1)
		{
			return false;
		}
		
		
		return true;
	}
	static class CGDummy
	{
		CGDummy(int _a,int _b)
		{
			if(_a>=UserBegin || _a<=UserBegin)
				user=_a;
			else if(_b>=UserBegin || _b<=UserBegin)
				user=_b;
			if(_a==Npc)
				npc=_a;
			else if(_b==Npc)
				npc=_b;
		}
		int user=-1;
		int npc=-1;
		int mon=-1;
	}
	static int UserChk(int _a,int _b)
	{
		
		
		return -1;
	}
	
}
class CDamage
{
	static int None=0;
	static int Wield=1;
	static int Shot=2;
	static int Skill=3;
	static int Success=4;
	
	static int PA=10;
	static int MA=11;
	static int TD=12;
	

	CDamage(CProtozoa _protozoa,int _type)
	{
		m_ability=_protozoa.GetPAbil();
		m_protozoa=_protozoa;
		m_type=_type;
	}
	CDamage(CAbility _ability,CProtozoa _protozoa,int _type,double _ap,double _pp)
	{
		m_ability=_protozoa.GetPAbil().toCopy();
		
		m_ability.m_PA=(int) (m_ability.m_PA*_pp+_ability.m_PA*_ap);
		m_ability.m_MA=(int) (m_ability.m_MA*_pp+_ability.m_MA*_ap);
		m_ability.m_TD=(int) (m_ability.m_TD*_pp+_ability.m_TD*_ap);
		
		m_ability.m_ELA=(int) (m_ability.m_ELA*_pp+_ability.m_ELA*_ap);
		m_ability.m_POA=(int) (m_ability.m_POA*_pp+_ability.m_POA*_ap);
		m_ability.m_ICA=(int) (m_ability.m_ICA*_pp+_ability.m_ICA*_ap);
		m_ability.m_FIA=(int) (m_ability.m_FIA*_pp+_ability.m_FIA*_ap);
		
		m_protozoa=_protozoa;
		m_type=_type;
	}
	CDamage(CAbility _ability,CProtozoa _protozoa,int _type)
	{
		m_ability=_ability;
		m_protozoa=_protozoa;
		m_type=_type;
	}
//	CDamage(CAbility _ability,CProtozoa _protozoa,int _type,double _ap,double _pp)
//	{
//		
//		m_ability=_ability.m_PA*_ap+;
//		m_protozoa=_protozoa;
//		m_type=_type;
//	}
	int m_type=0;		
	CAbility m_ability;
	CProtozoa m_protozoa;
}
class CProtection
{
	//int m_max;
	int m_value;
	boolean m_td;
	boolean m_pa;
	boolean m_ma;
	CProtection toCopy()
	{
		CProtection dummy=new CProtection();
		
		dummy.m_value=this.m_value;
		dummy.m_td=this.m_td;
		dummy.m_pa=this.m_pa;
		dummy.m_ma=this.m_ma;
		
		return dummy;
	}
	//int m_offset;
	//int m_outSkill;
}
class CState
{
	static int m_unickOff=1000000;
	CState()
	{
		m_unick=m_unickOff;
		m_unickOff++;
	}
	int m_unick=0;
	int m_delay;
	int m_offset;
	CAbility m_ability=null;
	CProtection m_protection=null;
	boolean m_move=true;//이동
	boolean m_attack=true;//공격
	boolean m_basicAttack=true;//기본 공격
	//boolean m_skill=true;
	int m_ableSkill=-1;
	boolean m_send=true;//무브 폐킷을 보낼건지 왠만하면 보내라. 속도가 느려지면 이건 컨트롤 해라
	boolean m_control=true;//조정이 안된다.
	boolean m_skill=true;//스킬 사용이 안된다
	boolean m_intangibility=false;//벽뚤기
	boolean m_ghost=false;//사람충돌
	boolean m_escape=false;//도망 모드
	boolean m_regen=false;//어떤 상태에서든 치료  Regeneration
	CState toCopy()
	{
		CState dummy=new CState();
		dummy.m_unick=this.m_unick;
		dummy.m_delay=this.m_delay;
		dummy.m_offset=this.m_offset;
		dummy.m_ability=this.m_ability;
		if(this.m_protection!=null)
		{
			dummy.m_protection=this.m_protection.toCopy();
		}
		dummy.m_move=this.m_move;
		dummy.m_attack=this.m_attack;
		dummy.m_basicAttack=this.m_basicAttack;
		dummy.m_ableSkill=this.m_ableSkill;
		dummy.m_send=this.m_send;
		dummy.m_control=this.m_control;
		dummy.m_skill=this.m_skill;
		
		dummy.m_intangibility=this.m_intangibility;
		dummy.m_ghost=this.m_ghost;
		dummy.m_escape=this.m_escape;
		dummy.m_regen=this.m_regen;
		
		return dummy;
	}
}
class CStateControl
{
	CStateControl(CState _state)
	{
		m_state=_state.toCopy();
	}
	CState m_state=null;
	boolean m_remove=false;
	int m_time=0;
}
public class CProtozoa extends CObject implements IPlayer
{
	
	String m_nick="";
	long m_HRTime=0;
	int m_HRDelayTime=1000*10;
	int m_HRMaxTime=1000*10;
	int m_HRMinTime=1000;
	int m_level=0;
	Map<String,Integer> m_vMap=new HashMap<String, Integer>();
	Vector<CInventoryInfo> m_inven=new Vector<CInventoryInfo>();
	CAbility m_bAbli=new CAbility();//캐릭터 능력치
	CAbility m_pAbli=new CAbility();//현재 능력치
	CAbility m_mAbli=new CAbility();//최대 능력치
	
	int m_group=CGroup.Normal;
	//CAbility m_ability=new CAbility();
	
	int m_action = DfPAction.Normal;
	int m_state=0;
	CVec2 m_size=new CVec2();
	CRigidBody m_pRb=null;
	CCollider m_pco=null;
	CPaint m_pPt=null;
	Map<Integer, Integer> m_actionAni=new HashMap<Integer, Integer>();
	int m_lastActionAni=-1;
	
	CVec3 m_viewMove=new CVec3(1,0,0);
	CVec3 m_viewTarget=null;
	
	
	
	Vector<CVec3> m_path=new Vector<CVec3>();
	CVec3 m_startPos=new CVec3();
	
	
	
	//이전 ai 정보들
	boolean m_tramp=false;
	public boolean m_rest=false;
	int m_tick=0;
	int m_activeTime=5000;
	
	CProtozoa m_target=null;
	CVec3 m_click=null;
	

	boolean m_attackAction=false;	//공격 버튼을 누르면
	boolean m_specialAction=false;	//특수 공격
	boolean m_move=true;//움직이지 않음 이미 움직이는 중이라면 가능 방향 전환 가능
	boolean m_attack=true;//공격 불가
	boolean m_basicAttack=true;//기본 공격 불가
	int m_ableSkill=-1;
	boolean m_control=true;//아이템,방향전환 불가
	boolean m_skillUse=true;//스킬 사용 불
	
	//int m_lastTargetSearchTime;
	static double d_escape=10000;
	static float d_restLen=DfV.AtomSize*16*2;
	double m_escapeTargetLen=d_escape;//2명중 가장 가까운 사람을 기준으로 피하기
	double m_searchLen=1200;
	double m_escapeHp=0.5;
	
	boolean m_counterAttack=false;//반격
	int m_counterTime=0;
	
	boolean m_instinctEscape=false;//본능적 도망
	boolean m_forcedEscape=false;//강제 도망
	
	Vector<CDamage> m_perpetrator=new Vector<CDamage>();//가해자 때린사람이 맞은사람이 들어감
	Vector<CDamage> m_victim=new Vector<CDamage>();//피해자 맞은 사람이 누구에게 맞았는지 들어감

	int m_attConscious=DfPAttackType.Nonviolence;//임의 액션
	int m_attInstinct=DfPAttackType.Nonviolence;//원초적 본능
	
	boolean m_intangibility=false;//벽이랑 충돌 안함
	boolean m_ghost=false;//사람끼리 충돌 안함
	boolean m_revenge=false;
	boolean m_overlap=false;
	
	int m_attackWaitTime=0;
	int m_bush;
	int m_resurrectionTime=0;//부활
	double m_returnLen=0;
	Vector<CStateControl> m_stateVec=new Vector<CStateControl>();
	CVec3 m_destination=null;
	
	long m_specialTime=0;
	long m_attackExtraTime=0;
	long m_attackTime=0;
	static int m_index=0;
	int m_effect=DfShotType.Arrow;
	Set<CProtozoa> m_collusion=new HashSet<CProtozoa>();
	
	public int GetAction()	{	return m_action;	}
	public CVec3 GetClick()	{	return m_click;	}
	public void SetClick(CVec3 _click)	{	m_click=_click;	}
	public Vector<CDamage> GetVictim()	{	return m_victim;	}
	public void SetAttackExtraTime(int _delay)	{	m_attackExtraTime=_delay;	}
	public CProtozoa GetTarget() {	return m_target;	}
	public int GetLevel()	{	return m_level;	}
	public String GetNick() {	return m_nick;	}
	public boolean GetGhost() {	return m_ghost;	}
	public boolean GetIntan() {	return m_intangibility;	}
	public boolean GetOverlap()	{	return m_overlap;	}
	public void SetOverlap(boolean _eanble)	{	m_overlap=_eanble;	}
	public Vector<CInventoryInfo> GetInven()
	{
		return m_inven;
	}
	public int GetAttackType()
	{
		return m_attConscious;
	}
	public void SetAttackType(int _at)
	{
		if(_at==DfPAttackType.Null)
			m_attConscious=m_attInstinct;
		else
			m_attConscious=_at;
	}
	public void SetCollusion(CProtozoa _target)
	{
		m_collusion.add(_target);
	}
	public Set<CProtozoa> GetCollusion()
	{
		return m_collusion;
	}
	Integer GetActionAniBasic()
	{
		return m_actionAni.get(DfPAction.Normal + DfPActionDetail.Basic);
	}
	void AttackAction()
	{
		m_attackAction=true;
	}
	boolean GetAttackAction()	{	return m_attackAction;	}
	Map<Integer,Long> m_skileTime=new HashMap<Integer,Long>();
	Vector<CSkControl> m_skill=new Vector<CSkControl>();
	Vector<CSkControl> m_pushSkill=new Vector<CSkControl>();
	//true면 에러
	boolean PushSkill(CSkill _sk,int _level,CProtozoa _caster)
	{
		if(GetSkillCount(_sk.m_offset)>=_sk.m_countLimit || 
				SkillEnableChk(_sk.m_cool,true,_sk.m_offset)==false)
			return true;
		
		CSkControl skill=new CSkControl();
		skill.Init(_sk, _level, _caster, this);
		m_pushSkill.add(skill);
		return false;
	}
	void RemoveSkill(int _offset,int _count)
	{
		int count=0;
		for(CSkControl each0 : m_skill)
		{
			if(each0.m_skill.m_offset==_offset)
			{
				each0.m_removeDelay=true;
				count++;
			}
			if(count==_count)
				break;
		}
	}
	void ResetInstinct()
	{
		SetAttackType(DfPAttackType.Null);
		ResetAction(DfPAction.Normal);
		SetTarget(null);
		SendStop(false);
	}
	void ResetData()
	{
		Vector<CStateControl> rem=new Vector<CStateControl>();
		
		for(CStateControl each0 : m_stateVec)
		{
			if(each0.m_remove)
				rem.add(each0);
		}
		for(CStateControl each0 : rem)
		{
			m_stateVec.remove(each0);
		}
		if(rem.isEmpty()==false)
		{
			SendAbilityRefrash();
			SendMoveQue();
		}
		
		m_perpetrator.clear();
		m_victim.clear();
		m_attackAction=false;
		m_specialAction=false;
		m_collusion.clear();
	}
	void PushState(CState _st)
	{
		m_stateVec.add(new CStateControl(_st));
		SendAbilityRefrash();
		SendMoveQue();
	}
	int GetStateCount(int _off)
	{
		int count=0;
		for(var each0 : m_stateVec)
		{
			if(each0.m_state.m_offset==_off)
				count++;
		}
		return count;
	}
	void RemoveState(int _off)
	{
		for(CStateControl each0 : m_stateVec)
		{
			if(_off==each0.m_state.m_offset && each0.m_remove==false)
			{
				each0.m_remove=true;
				break;
			}
				
		}
	}
	int GetSkillCount(int _off)
	{
		int count=0;
		for(var each0 : m_skill)
		{
			if(each0.m_skill.m_offset==_off)
				count++;
		}
		for(var each0 : m_pushSkill)
		{
			if(each0.m_skill.m_offset==_off)
				count++;
		}
		return count;
	}
	public boolean SkillEnableChk(int _cool,boolean _reset,int _offset)
	{
		Long stime=m_skileTime.get(_offset);
		if(stime==null)
		{
			if(_reset)
				m_skileTime.put(_offset,System.currentTimeMillis ( ));
			return true;
		}
		else
		{
			long delay=System.currentTimeMillis ( )-stime;
			if(_cool<delay)
			{
				if(_reset)
					m_skileTime.put(_offset,System.currentTimeMillis ( ));
				return true;
			}
			
		}
			
		return false;
	}
	
	int GetIndex()
	{
		m_index++;
		return m_index;
	}
	int GetEffect()
	{
		return m_effect;
	}
	CProtozoa()
	{

	}
	Vector<CVec3> GetPath()
	{
		return m_path;
	}
	void SetPath(Vector<CVec3> _path)
	{
		m_path=_path;
	}
	void Init()
	{
		m_pRb =(CRigidBody) this.NewCComponent(new CRigidBody());
		
	}
	Vector<CInventoryInfo> AllDropInven()
	{
		Vector<CInventoryInfo> dummy=m_inven;
		m_inven=new Vector<CInventoryInfo>();
		return dummy;
	}
	
	

	int GetGroup()	{	return m_group;	}
	CAbility GetPAbil()	{	return m_pAbli;	}
	CAbility GetMAbil()	{	return m_mAbli;	}
	
	
	
	CVec3 GetViewMove()	{	return m_viewMove;	}//움직이면서 바라보는 위치
	CVec3 GetViewTarget() {return m_viewTarget;}
	CVec3 GetView()
	{
		if(m_viewTarget!=null)
			return m_viewTarget;
		return m_viewMove;
	}
	
	CRigidBody GetPRb() { return m_pRb;	 }
	CCollider GetPCo() { return m_pco;	 }
	CPaint GetPPt()	{	return m_pPt;	}
	public CVec2 GetSize() { return m_size.toCopy(); }
	void SetStartPos(CVec3 _pos) {	m_startPos=_pos;	}
	CThreeVec3 GetDownRay()
	{
		CThreeVec3 thV=new CThreeVec3();
		thV.SetDirect(new CVec3(0,-1,0));
		thV.SetOriginal(m_pos);
		return thV;
	}
	int GetProtozoaType()
	{
		return DfPType.Null;
	}
	int ActionAniFind(int _ani)
	{
		Integer val=m_actionAni.get(_ani);
		
		if (val==null)
		{
			val=m_actionAni.get(DfPAction.Normal + DfPActionDetail.Basic);
			if (val==null)
				return 0;
		}
		return val;
	}

	void ActionAniUpdate()
	{
		CVec3 dir = m_pRb.MoveDir();
		
		
		if (dir.IsZero() == false)
		{
			m_viewMove = dir;
			
		}
		//서버에서 에니 불필요
//		int type = DfPActionDetail.Basic;
//		float dotVal[] = { 0,0,0,0, };
//		float maxDot = 0;
//		
//		dotVal[0] = CMath.Vec3Dot(CVec3.GetLeft3D(), m_view);
//		dotVal[1] = CMath.Vec3Dot(CVec3.GetRight3D(), m_view);
//		dotVal[2] = CMath.Vec3Dot(CVec3.GetUp3D(), m_view);
//		dotVal[3] = CMath.Vec3Dot(CVec3.GetDown3D(), m_view);
//
//		for (var i = 0; i < 4; ++i)
//		{
//			if (dotVal[i]> maxDot)
//			{
//				maxDot = dotVal[i];
//				type = i;
//			}
//		}
//		
//
//
//
//		if (dir.IsZero())
//		{
//			int ani = this.ActionAniFind(this.m_action + DfPActionDetail.BasicRight + type);
//			if(m_lastActionAni != ani)
//			{
//				m_lastActionAni = ani;
//				this.RemoveAllCComponent(Df.CComponent.CAnimation);
//				this.PushCComponent(CAniList.Find(m_lastActionAni));
//			}
//		}
//		else
//		{
//			int ani = this.ActionAniFind(this.m_action + DfPActionDetail.MoveRight + type);
//			if (m_lastActionAni != ani)
//			{
//				m_lastActionAni = ani;
//				this.RemoveAllCComponent(Df.CComponent.CAnimation);
//				this.PushCComponent(CAniList.Find(m_lastActionAni));
//			}
//		}
	}
	
	public void Update(int _delay)
	{
		super.Update(_delay);
		
		if(m_counterTime>0)
			m_counterTime-=_delay;
		
		
		if(m_target!=null && m_target!=this)
		{
			
			if(m_target.GetRemove()==true)//1초간 못 찾으면 없는 것
			{
				SetTarget(null);
				if(m_action==DfPAction.CoercionAttack)
					ResetInstinct();
				ResetAction(DfPAction.Normal);
				
			}
		}
		
		while(!m_path.isEmpty())
		{
			boolean findPath=false;
			Vector<CMovement> moveQue=m_pRb.GetMoveQue();
			for(int i=0;i<moveQue.size();++i)
			{
				if(moveQue.get(i).m_key.equals("path"))
					findPath=true;
			}
			//길찾기가 실행중인데 안 찾고 잇으면
			if(!findPath)
			{
				//찾는다
				CVec3 dir=CMath.Vec3MinusVec3(m_path.firstElement(),m_pos);
				dir.y=0;
				double len=CMath.Vec3Lenght(dir);
				if(len>1)
				{

					dir=CMath.Vec3Normalize(dir);
//					CMoveData movedata=new CMoveData("path", dir, 100);
					float power=m_pAbli.m_MS;
					if(!this.m_move)
						power=0;
					m_pRb.Push(new CMovement("path", dir, power));
					SendMoveQue();
				}
				else
					m_path.remove(m_path.firstElement());

				
				break;
			}
			else
			{
				//근처에 오면 길찾기 중지
				CVec3 dir=CMath.Vec3MinusVec3(m_path.firstElement(),m_pos);
				dir.y=0;
				double len=CMath.Vec3Lenght(dir);
				double moveTick=m_pAbli.m_MS*0.001*_delay;
				if(len<moveTick)
				{
					m_pRb.Remove("path");
					SetPos(m_path.firstElement());
					m_path.remove(m_path.firstElement());
					SendMoveQue();
				}
				else
					break;
			}	
		}//while
		
		
		ActionAniUpdate();  
		ActionProcess(_delay);
		HpUpdate(_delay);
		for(CStateControl each0 : m_stateVec)
		{
			if(each0.m_state.m_delay==0)
				continue;
			if(each0.m_state.m_delay<=each0.m_time)
			{
				each0.m_remove=true;
			}
			each0.m_time+=_delay;
		}
		
	}
	void UpdateSkill(int _delay,Collection<CRenObj> _youse,CCanvasVoxel _voxel)
	{
		m_skill.addAll(m_pushSkill);
		m_pushSkill.clear();
		
		
		
		Vector<CSkControl> remove=new Vector<CSkControl>();
		for(var each0 : m_skill)
		{
			each0.Update(_delay, _youse,_voxel);
			if(each0.m_removeDelay ||  each0.m_removeNow)
				remove.add(each0);
		}
		for(var each0 : remove)
		{
			m_skill.remove(each0);
		}
		ResetData();
		
	}
//	void SetHRMinTime(int _val)
//	{
//		m_HRMinTime=_val;
//		if(m_HRMinTime<1000)
//			m_HRMinTime=1000;
//		if(m_HRMinTime>3000)
//			m_HRMinTime=3000;
//	}
//	void SetHRMaxTime(int _val)
//	{
//		m_HRMaxTime=_val;
//		if(m_HRMinTime>m_HRMaxTime)
//			m_HRMinTime=m_HRMaxTime+1;
//		if(m_HRMinTime>1000*30)
//			m_HRMinTime=4000;
//	}
	void HRDelayMax()
	{
		m_HRDelayTime=m_HRMaxTime;
	}
	public boolean StableChk()
	{
		if(m_HRDelayTime>m_HRMinTime)
			return false;
		return true;
	}
	void HpUpdate(int _delay)
	{
		if(m_pAbli.m_H<=0 && m_action!=DfPAction.Die)
		{
			ResetAction(DfPAction.Die);
			CPacketZone pac=new CPacketZone();
			pac.Die(GetKey());
			PushPacket(pac);
			
			//부활 미적용
//			if(m_resurrectionTime<=0)
//			{
//				
//				
//			}
			
			return;
		}
		long delay=System.currentTimeMillis ( )-m_HRTime;
		boolean rhm=false;
		
		//움직이면 다시 리셋
		if(m_pRb.GetMoveQue().isEmpty()==false)
			HRDelayMax();
		//가만히 있는 상태가 아니면 맥스타임을 서서히 감소
		else if(StableChk()==false)
		{
			m_HRDelayTime-=_delay;			
		}
		
		if(delay>m_HRDelayTime)
		{
			boolean refrash=false;
			m_HRTime=System.currentTimeMillis();
			
			if(m_mAbli.m_H!=m_pAbli.m_H && m_pAbli.m_H>0 && m_pAbli.m_HR>0)
			{
				HpCac(m_pAbli.m_HR, CDamage.None);
				refrash=true;

			}
			if(m_mAbli.m_MP!=m_pAbli.m_MP && m_pAbli.m_MR>0)
			{
				MPCacAnChk(m_pAbli.m_MR);
				refrash=true;
				
				
			}
			if(refrash)
				SendAbilityRefrash();
		}//if
	}
	void SendStop(boolean _AllStop)
	{
		if(!m_path.isEmpty())
			m_path.clear();
		if(_AllStop)
			m_pRb.Clear();
		else
		{
		
			m_pRb.Remove("path");//길찾기
			m_pRb.Remove("move");//?????
			m_pRb.Remove("joy");//조이스틱
		}
		SendMoveQue();
	}
	public void SendMoveQue()
	{
		for(int i=0;i<m_packet.size();++i)
		{
			if(m_packet.get(i).name.equals("SMQ"))
			{
				m_packet.remove(i);
				i--;
			}
		}
		
		CPacketZone smt=new CPacketZone();
		smt.SMQ("CProtozoa",GetKey(), m_pRb, GetPos());
		m_packet.add(smt);

	}
	
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		//pac.Push(super.Serialize());
		
		pac.Push(m_offset);
		pac.Push(m_key);
		
		pac.Push(m_pos);
		pac.Push(m_rot);
		pac.Push(m_sca);
		
		pac.Push(m_actionAni);
		pac.Push(m_bAbli);
		pac.Push(m_pAbli);
		pac.Push(m_mAbli);
		pac.Push(m_size);
		pac.Push(m_nick);
		pac.Push(m_pRb.Serialize());

		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		//super.Deserialize(pac.GetString(0));
		
		m_offset = pac.GetInt32(0);
		m_key=pac.GetString(1);
		
		m_pos.Deserialize(pac.GetString(2));
		m_rot.Deserialize(pac.GetString(3));
		m_sca.Deserialize(pac.GetString(4));
	
		CPacket pac3=new CPacket();
		pac3.Deserialize(pac.GetString(5));
		//for (var each0 : pac3.value)
		for(int i=0;i<pac3.value.size();i+=2)
		{
			m_actionAni.put(pac3.GetInt32(i),pac3.GetInt32(i+1));
		}
		pac.GetISerialize(6, m_bAbli);
		pac.GetISerialize(7, m_pAbli);
		pac.GetISerialize(8, m_mAbli);
		pac.GetISerialize(9, m_size);
		m_nick=pac.GetString(10);
		pac.GetISerialize(11, m_pRb);
		
	}

	public boolean isUser()	{	return false;	}
	boolean SendDamage(CDamage _damege)
	{
//		m_pAbli.m_H-=_val;
//		SendAbilityRefrash();
//		
//		CPacketZone pacText=new CPacketZone();
//		pacText.Text("-"+Integer.toString(_val), this.m_pos,new CVec4(1.0f,0.0f,0.0f,0.0f));
//		m_packet.add(pacText);
				
		double ran=Math.random();
		
		int avoid=m_pAbli.m_A-_damege.m_ability.m_DSR;
		if(avoid>0 && avoid/140.0>=ran)
		{
			return false;
		}
		double cri=1;
		if(_damege.m_ability.m_L/100.0>=ran)
			cri=2;
		
		double PA=0;
		double MA=0;
		
		double rol=100.0;//퍼센티지
		
		double PAD=m_pAbli.m_PD-_damege.m_ability.m_PAP;
		double MAD=m_pAbli.m_MD-_damege.m_ability.m_MAP;
	
		if(PAD<0)
			PAD=0;
		else if(PAD>rol)
			PAD=rol;
		if(MAD<0)
			MAD=0;
		else if(MAD>rol)
			MAD=rol;
		
		
		PA=(_damege.m_ability.m_PA*(1.0-(PAD/rol)))*0.8;
		MA=(_damege.m_ability.m_MA*(1.0-(MAD/rol)))*0.8;
		rol=200.0;
		PA+=(_damege.m_ability.m_PA*(1.0-(PAD/rol)))*0.2;
		MA+=(_damege.m_ability.m_MA*(1.0-(MAD/rol)))*0.2;
		//int FWEPV=0;
		double fwepT=100;
		int FWEPV=0;
		//if(m_pstAbility.m_FID<_damege.m_ability.m_FIA)
		FWEPV+=_damege.m_ability.m_FIA*(1.0-m_pAbli.m_FID/fwepT);
		//if(m_pstAbility.m_ICD<_damege.m_ability.m_ICA)
		FWEPV+=_damege.m_ability.m_ICA*(1.0-m_pAbli.m_ICD/fwepT);
		//if(m_pstAbility.m_ELD<_damege.m_ability.m_ELA)
		FWEPV+=_damege.m_ability.m_ELA*(1.0-m_pAbli.m_ELD/fwepT);
		//if(m_pstAbility.m_POD<_damege.m_ability.m_POA)
		FWEPV+=_damege.m_ability.m_POA*(1.0-m_pAbli.m_POD/fwepT);

	
		
		
		int all=0;
		all+=HpCac((int)(-PA*cri),CDamage.PA);
		all+=HpCac((int)(-MA*cri),CDamage.MA);
		all+=HpCac(-_damege.m_ability.m_TD,CDamage.TD);
		all+=HpCac(-FWEPV,CDamage.None);
		

//		if(m_block.ordinal()!=_damege.m_type)
//		{
//			all+=Set_Hp((int)(-PA*cri),0,0,0);
//			all+=Set_Hp(0,(int)(-MA*cri),0,0);
//			all+=Set_Hp(0,0,-_damege.m_ability.m_TD,0);
//			all+=Set_Hp(0,0,0,-FWEPV);
//		}
//		else
//		{
//			CPacketSmart eff=new CPacketSmart();
//			eff.Effect(CEffect.eType.E0_Fail.ordinal(),m_pos,0);
//			m_packetQue.add(eff);
//			m_block=CDamage.eType.Success;
//		}
		//반격기가 있고, 퍼스트가 아니면 타겟을 그 사람으로 바꾼다
		if(m_counterAttack)
		{
			if(m_attConscious!=DfPAttackType.First)
			{
				if(m_target==null)
				{
					SetTarget(_damege.m_protozoa);
					m_counterTime=4000;
				}
				else if(Math.random()<0.2)
				{
					SetTarget(_damege.m_protozoa);
					m_counterTime=8000;
				}
				ResetAction(DfPAction.Attack);
			}
				
		}
		
		m_victim.add(_damege);
		
		_damege.m_protozoa.m_perpetrator.add(new CDamage(_damege.m_ability, this, _damege.m_type));

		CPacketZone pacText=new CPacketZone();
		pacText.Text(Integer.toString(all), this.m_pos,new CVec4(1.0f,0.0f,0.0f,0.0f),0,1,"");
		m_packet.add(pacText);
		
		CPacketZone pace=new CPacketZone();
		float len=GetBound().GetInRadius()*2;
		pace.EffectCreate(GetPos(), 50, 50, CEffect.Flash0, null, "",
				(float)(Math.random()*len-len*0.5f),(float)(Math.random()*len-len*0.5f));
		PushPacket(pace);
		
		//맞으면 피가 안차게, 1이라도 피해가 가면 안차고 0은 제외(피해자,가해자 둘다
		if(all<0)
		{
			_damege.m_protozoa.HRDelayMax();
			HRDelayMax();
		}
		SendAbilityRefrash();
		if(GetProtozoaType()==DfPType.User)
		{
			CPacketZone pac=new CPacketZone();
			pac.Shake((CUser)this, 50);
			PushPacket(pac);
		}
		return true;
		
		
	}
	public int HpCac(int _val,int _type)
	{
		
		for(int i=0;i<m_stateVec.size();++i)
		{
			
			CStateControl each1=m_stateVec.get(i);
			if(each1.m_state.m_protection==null)
				continue;
			CProtection each0=each1.m_state.m_protection;
			
			if(_val<0 && each0.m_pa && _type==CDamage.PA)
			{
				each0.m_value+=_val;
				if(each0.m_value<0)
					_val=each0.m_value;
				else
					_val=0;
			}
			if(_val<0 && each0.m_ma && _type==CDamage.MA)
			{
				each0.m_value+=_val;
				if(each0.m_value<0)
					_val=each0.m_value;
				else
					_val=0;
			}
			if(_val<0 && each0.m_td && _type==CDamage.TD)
			{
				each0.m_value+=_val;
				if(each0.m_value<0)
					_val=each0.m_value;
				else
					_val=0;
			}
			if(each0.m_value<0)
			{
				each1.m_remove=true;
				each1.m_state.m_protection=null;
				//i=0;
			}
		}
		
		
		if(m_pAbli.m_H<=0)//0은 피회복 금지
			return 0;
		m_pAbli.m_H+=_val;
		if(m_mAbli.m_H<m_pAbli.m_H)
		{
			m_pAbli.m_H=m_mAbli.m_H;
		}
		return _val;
	}
	public boolean MPCacAnChk(int _val)
	{
		if(m_pAbli.m_MP+_val<0)
			return true;
		m_pAbli.m_MP+=_val;
		if(m_mAbli.m_MP<m_pAbli.m_MP)
		{
			m_pAbli.m_MP=m_mAbli.m_MP;
		}
		
		return false;

	}
	void MAbilityRefrash()
	{
		this.m_mAbli=this.m_bAbli.toCopy();
	}
	final void PAbilityRefrash()
	{
		m_HRMaxTime=1000*10;
		m_move=true;
		m_ableSkill=-1;
		m_attack=true;
		m_basicAttack=true;
		m_control=true;
		m_skillUse=true;
		m_intangibility=false;
		m_ghost=false;
		boolean bescape=m_forcedEscape;
		m_forcedEscape=false;
		
		
		int beforeH=this.m_pAbli.m_H;
		int beforeMP=this.m_pAbli.m_MP;
		this.m_pAbli=this.m_mAbli.toCopy();
		
		for(CStateControl each0 : m_stateVec)
		{
			if(each0.m_state.m_ability!=null)
			{
				m_pAbli.m_H+=each0.m_state.m_ability.m_H;
				m_pAbli.m_PA+=each0.m_state.m_ability.m_PA;
				m_pAbli.m_PD+=each0.m_state.m_ability.m_PD;
				m_pAbli.m_MS+=each0.m_state.m_ability.m_MS;
				m_pAbli.m_AS+=each0.m_state.m_ability.m_AS;
				m_pAbli.m_AL+=each0.m_state.m_ability.m_AL;
				
				m_pAbli.m_MA+=each0.m_state.m_ability.m_MA;
				m_pAbli.m_MD+=each0.m_state.m_ability.m_MD;
				m_pAbli.m_MP+=each0.m_state.m_ability.m_MP;
				m_pAbli.m_HR+=each0.m_state.m_ability.m_HR;
				m_pAbli.m_MR+=each0.m_state.m_ability.m_MR;
				m_pAbli.m_A+=each0.m_state.m_ability.m_A;
				m_pAbli.m_DSR+=each0.m_state.m_ability.m_DSR;
				m_pAbli.m_CS+=each0.m_state.m_ability.m_CS;
				m_pAbli.m_TD+=each0.m_state.m_ability.m_TD;
				m_pAbli.m_R+=each0.m_state.m_ability.m_R;
				m_pAbli.m_L+=each0.m_state.m_ability.m_L;
				m_pAbli.m_PAP+=each0.m_state.m_ability.m_PAP;
				m_pAbli.m_MAP+=each0.m_state.m_ability.m_MAP;
				m_pAbli.m_AA+=each0.m_state.m_ability.m_AA;
				
				m_pAbli.m_FIA+=each0.m_state.m_ability.m_FIA;
				m_pAbli.m_ICA+=each0.m_state.m_ability.m_ICA;
				m_pAbli.m_ELA+=each0.m_state.m_ability.m_ELA;
				m_pAbli.m_POA+=each0.m_state.m_ability.m_POA;
				
				m_pAbli.m_FID+=each0.m_state.m_ability.m_FID;
				m_pAbli.m_ICD+=each0.m_state.m_ability.m_ICD;
				m_pAbli.m_ELD+=each0.m_state.m_ability.m_ELD;
				m_pAbli.m_POD+=each0.m_state.m_ability.m_POD;
				
			}
			if(each0.m_state.m_move==false)
				m_move=false;
			if(m_ableSkill==-1)
				m_ableSkill=each0.m_state.m_ableSkill;
			if(each0.m_state.m_attack==false)
				m_attack=false;
			if(each0.m_state.m_basicAttack==false)
				m_basicAttack=false;
			if(each0.m_state.m_control==false)
				m_control=false;
			if(each0.m_state.m_skill==false)
				m_skillUse=false;
			
			if(each0.m_state.m_intangibility)
				m_intangibility=true;
			if(each0.m_state.m_ghost)
				m_ghost=true;
			if(each0.m_state.m_escape)
				m_forcedEscape=true;
			if(each0.m_state.m_regen)
				m_HRMaxTime=m_HRMinTime;
			
		}
		if(bescape==true && m_forcedEscape==false && m_action==DfPAction.Escape)
		{
			ResetAction(DfPAction.Normal);
		}
		if(this.m_pAbli.m_H>beforeH)
			this.m_pAbli.m_H=beforeH;
		
		if(this.m_pAbli.m_MP>beforeMP)
			this.m_pAbli.m_MP=beforeMP;
		if(m_pAbli.m_MS<0 || m_move==false)
			m_pAbli.m_MS=0;
		
	}
	void MovementChange()
	{
		for(var each0 : m_pRb.GetMoveQue())
		{
			if(each0.m_key.equals("joy") || each0.m_key.equals("path"))
			{
				each0.m_power=m_pAbli.m_MS;
			}
		}
		
	}
	void SendAbilityRefrash()
	{
		MAbilityRefrash();
		PAbilityRefrash();
		MovementChange();
		CPacketZone pacHp=new CPacketZone();
		pacHp.AbilityRefresh(m_key, m_pAbli,m_mAbli,m_pos);
		m_packet.add(pacHp);
	}
	
	
	public void ActionProcess(int _delay)
	{
		if(m_action==DfPAction.Die)
		{
			//DieActionProcess();
		}	
		else if(m_action==DfPAction.CoercionMove)
		{
//			if(m_path.isEmpty() && m_destination==null)
//			{
//				ResetAction(eAction2.Normal);
//				m_attackType=m_instinct;
//			}
		}
		else if(m_action==DfPAction.Normal)
		{
			NormalActionProcess();
		}//Normal
		else if(m_action==DfPAction.Escape)
		{
			EscapeActionProcess();
		}
		else if(m_action==DfPAction.Attack || m_action==DfPAction.CoercionAttack)
		{
			AttackActionProcess(_delay);
			
		}
		m_tick+=_delay;
		m_rest=true;
	}
	void EscapeActionProcess()
	{
		if(m_state==0)
		{				
			CVec3 movePos=new CVec3();
			movePos.toCopy(m_pos);
			if(m_target==null)
			{
				SendStop(false);
				return;
			}
			CVec3 dir=CMath.Vec3MinusVec3(m_pos, m_target.m_pos);
			dir.y=0;
			dir=CMath.Vec3Normalize(dir);

			CMat rot=new CMat();
			rot=CMath.MatAxisToRotation(new CVec3(0,1,0), (float)(Math.random()*Math.PI-Math.PI/2));
			dir=CMath.MatToVec3Coordinate(dir, rot);
			movePos=CMath.Vec3PlusVec3(movePos, CMath.Vec3MulFloat(dir, m_pAbli.m_MS));
			
			
			CPacketZone pac=new CPacketZone();
			pac.FindPath(GetKey(), movePos,"",DfFindPath.Move);
			PushPacket(pac);
			
			//SendMoveQue();
			m_state=1;
		}
		else
		{
			//만약 이전에 도망중이였으면 이제 위혐요소가 없으니 움직이지마!
			if(m_action==DfPAction.Escape && m_escapeTargetLen==d_escape)
			{
				ResetAction(DfPAction.Normal);
				SetTarget(null);
			}
			
			if(m_tick>1000)
			{
				SendStop(false);
				m_escapeTargetLen=d_escape;
				ResetAction(DfPAction.Escape);
			}
		}
	
	}
	void NormalActionProcess()
	{
		//길찾기 진행중이다 이때는 아무것도 안건드린다
		//충돌 중일때는 패스
		if(!m_path.isEmpty() )//&& m_pCollusion==null)
		{
			
		}
		//쉴때는 움직이지 않는다
		else if(m_state==0 )
		{
			float len=CMath.Vec3Lenght(CMath.Vec3MinusVec3(m_startPos, m_pos));
			if(len>m_returnLen && m_returnLen!=0)//시작 지점과 너무 멀어지면 그리고 돌아갈 거리가 있을때
			{
				//똑똑한 길찾기 요청한다
				CPacketZone pac=new CPacketZone();
				pac.FindPath(GetKey(), m_startPos,"",DfFindPath.Move);
				m_packet.add(pac);
				m_state=1;
			}
			
			//부랑자 일경우 4방향으로 움직여 보자
			else if(m_tramp && m_rest==false)
			{
				CVec3 movePos=new CVec3();
				movePos=m_pos.toCopy();
				//int rand=(int)(Math.random()*4);
				
				movePos.x+=(Math.random()*64*8)-32*8;
				movePos.z+=(Math.random()*64*8)-32*8;
			
				CPacketZone pac=new CPacketZone();
				pac.FindPath(GetKey(), movePos,"",DfFindPath.Move);
				m_packet.add(pac);
				m_state=1;
			}
			m_tick=0;
		}
		else if(m_state==1)
		{
			if(m_tick>m_activeTime)
			{
				m_state=0;
				ResetAction(DfPAction.Normal);
			}
			
		}
	}
	void AttackActionProcess(int _time)
	{
		m_attackWaitTime+=_time;
//		if(m_attackWaitTime>1000*16 && GetProtozoaType()!=DfPType.User)
//		{
//			CPacketZone pac=new CPacketZone();
//			pac.FindPath(GetKey(), m_startPos,DfFindPath.Move);
//			m_packet.add(pac);
//			m_target=null;
//			HpCac(0,0,0,(int)(m_mAbli.m_H));
//			ResetAction(DfPAction.CoercionMove);
//			//if(m_pstAbility.m_H<m_maxH*0.3)
//			
//		}
//		else 
		if(m_target==null)
		{
			if(GetProtozoaType()!=DfPType.User)
				ResetInstinct();
			else//user는 자동 공격중일수도 있어서 이렇게 처리
			{
				ResetAction(DfPAction.Normal);
				SetTarget(null);
				SendStop(false);
			}
		}
		else
		{
			
			CVec3 MtoP=CMath.Vec3MinusVec3(m_target.m_pos,m_pos);
			double len=CMath.Vec3Lenght(MtoP);
			len-=m_target.GetBound().GetInRadius();
			//al 0은 무조건 그자리에서 멈춘다
			//찾는 범위 or 공격 사거리 안에 있으면
			if(len<m_pAbli.m_AL || m_pAbli.m_AL==0)
			{
				if(m_state==3)
				{
					if(m_attackAction)
						m_state=2;
				}
				else
					m_state=2;
				
				if(!m_pRb.GetMoveQue().isEmpty())
					SendStop(false);
			}
			else if(m_state==2 || m_state==3)
			{
				m_state=0;
			}
			
			if(m_state==0)
			{
				if(m_move)
				{
					
					//MoveToPro(m_target,DfFindPath.Attack);
					//근거리이거나 투시 모드일때는 최단거리로
					if((Math.random()<0.5 && len<DfV.AtomSize) || m_intangibility )
					//if(len<5000  )
					{
						SendStop(false);
						//유령은 y축도 필요
						if(m_intangibility==false)
							MtoP.y=0;
						MtoP=CMath.Vec3Normalize(MtoP);
						
						CMovement movedata= new CMovement("path", MtoP, m_pAbli.m_MS);
						m_pRb.Push(movedata);
						SendMoveQue();
					}
					else
					{
						MoveToPro(m_target,DfFindPath.Attack);
					}
				}
				m_state=1;
				m_tick=0;
			}
			else if(m_state==1)
			{
				//움직이는 대상은 200마다 찾고 움직이지 않는건 2초마다 찾는다
				if(m_tick>400+Math.random()*200 && !m_target.GetPRb().GetMoveQue().isEmpty())
				{
					m_tick=0;
					m_state=0;
				}
				else if(m_tick>900+Math.random()*300)
				{
					m_tick=0;
					m_state=0;
				}
			}
			else if(m_state==2)
			{
				m_destination=null;
				if(AttackChk(false))
				{
					m_attackWaitTime=0;
					CPacketZone pac=new CPacketZone();
					pac.Attack(GetKey());
					m_packet.add(pac);
					
					m_state=3;
				}
				
			}
		}
	}
	void ResetAction(int _action)
	{
		m_attackWaitTime=0;
		m_tick=0;
		m_state=0;
		m_action=_action;
		SendStop(false);

		m_escapeTargetLen=d_escape;
		VMapPushPop(VK.Get(Df.VMap.Ac), _action);
	}
	void Search(CProtozoa _pro)
	{
		//자기 자신 or 죽었으면 리턴
		if(this.m_key.equals(_pro.m_key) || m_action==DfPAction.Die || _pro.m_action==DfPAction.Die)
			return;
		
		
		
		CVec3 MtoP=CMath.Vec3MinusVec3(_pro.m_pos,m_pos);
		double len=CMath.Vec3Lenght(MtoP);
		if(len<d_restLen && _pro.GetProtozoaType()==DfPType.User)
		{
			m_rest=false;
		}
		if(m_target!=null && m_target.GetKey().equals(_pro.GetKey()))
		{
			MtoP=CMath.Vec3Normalize(MtoP);
			m_viewTarget=CMath.Vec3Normalize(MtoP);
		}
		
		//찾는 범위 or 공격 사거리 안에 있으면 or 누가 멀리서 날 건들때
		if(len<m_searchLen || len<m_pAbli.m_AL || m_counterTime>0)
		{
//			if(m_forcedEscape && CGroup.Aggressivity(m_group, _pro.GetGroup()))
//			{
//				if(len<m_escapeTargetLen)
//				{
//					m_escapeTargetLen=len;
//					m_target=_pro;
//
//					
//					if(m_action!=DfPAction.Escape)
//					{
//						ResetAction(DfPAction.Escape);
//					}
//				}
//			}
//			else 
			if(m_action==DfPAction.CoercionMove || m_action==DfPAction.CoercionAttack)
			{
				
			}
			//도망가능? 강제 모드 중이 아닌가? 날 때릴수 있는가?
			else if((m_instinctEscape && CGroup.Aggressivity(m_group, _pro.GetGroup()) &&  m_mAbli.m_H*m_escapeHp>=m_pAbli.m_H)
					|| (m_forcedEscape && CGroup.Aggressivity(m_group, _pro.GetGroup()))
					)
			{
				
				if(len<m_escapeTargetLen)
				{
					m_escapeTargetLen=len;
					SetTarget(_pro);
					//m_viewDir=CMath.Vec3Normalize(MtoP);
					
					if(m_action!=DfPAction.Escape)
					{
						ResetAction(DfPAction.Escape);
					}
				}

				
			}//Escape
			else if(!_pro.m_victim.isEmpty() && m_revenge)
			{
			
				if(CGroup.Alliance(m_group, _pro.GetGroup()) && m_action==DfPAction.Normal)
				{
				CProtozoa pef=null;
				for(CDamage each0 : _pro.m_victim)
				{
					pef=each0.m_protozoa;
					break;
				}
				len=pef.ProToLen(this);
				if(len<m_searchLen || len<m_pAbli.m_AL)
				{
					SetTarget(pef);
					ResetAction(DfPAction.Attack);	
				}
				}
			}
			else
			{
				
				
				//공격 가능한지  , 강제 공격일때는 어택 프로세스 중지
				if(m_attConscious!=DfPAttackType.Nonviolence && CGroup.Aggressivity(m_group, _pro.GetGroup()) && m_action!=DfPAction.CoercionAttack)
				{
					
					if(m_target==null)
					{
						if(m_action==DfPAction.Normal)
						{
							SetTarget(_pro);
							ResetAction(DfPAction.Attack);
						}
					}
					//가까이에 있는애 때림
					else if(m_attConscious==DfPAttackType.Near && m_counterTime<=0)
					{
						double blen=this.ProToLen(m_target);
						double alen=this.ProToLen(_pro);
						
						if(alen<blen)
						{
							SetTarget(_pro);
							ResetAction(DfPAction.Attack);
						}
						
					}
					
				}//eAttackType
			}
			

		}//찾는 범위 밖에 있는데 멀리 있고 공격 태세 였으면 주위에 없다는 이야기니까
		else if(m_target!=null && m_target.GetKey().equals(_pro.GetKey()) && m_action==DfPAction.Attack)
		{
			SetTarget(null);
			SendStop(false);
		}
	}
	public void SendTarget()
	{

	}
	public void SetTarget(CProtozoa _target)
	{
		m_target=_target;
		//m_lastTargetSearchTime=0;
		ResetTargetVeiw();
		SendTarget();
	}
	public void ResetTargetVeiw()
	{
		if(m_target!=null)
		{
			CVec3 MtoP=CMath.Vec3MinusVec3(m_target.m_pos,m_pos);
			MtoP=CMath.Vec3Normalize(MtoP);
			m_viewTarget=CMath.Vec3Normalize(MtoP);
		}
		else
			m_viewTarget=null;
	}
	public double ProToLen(CObject _obj)
	{

		double len=0;
		
		CVec3 MtoP=CMath.Vec3MinusVec3(m_pos,_obj.m_pos);
		len=CMath.Vec3Lenght(MtoP);
		
		return len;
	}
//	public int HpCac(int _pa,int _ma,int _td,int _heal)
//	{
//		
//		for(int i=0;i<m_stateVec.size();++i)
//		{
//			
//			CStateControl each1=m_stateVec.get(i);
//			if(each1.m_state.m_protection==null)
//				continue;
//			CProtection each0=each1.m_state.m_protection;
//			if(_pa<0 && each0.m_pa)
//			{
//				each0.m_value+=_pa;
//				if(each0.m_value<0)
//					_pa=each0.m_value;
//				else
//					_pa=0;
//			}
//			else if(_ma<0 && each0.m_ma)
//			{
//				each0.m_value+=_ma;
//				if(each0.m_value<0)
//					_ma=each0.m_value;
//				else
//					_ma=0;
//			}
//			else if(_td<0 && each0.m_td)
//			{
//				each0.m_value+=_td;
//				if(each0.m_value<0)
//					_td=each0.m_value;
//				else
//					_td=0;
//			}
//			if(each0.m_value<0)
//			{
//				each1.m_remove=true;
//				each1.m_state.m_protection=null;
//				//i=0;
//			}
//		}
//		
//		
//		if(m_pAbli.m_H<=0)//0은 피회복 금지
//			return 0;
//		m_pAbli.m_H+=_pa+_ma+_td+_heal;
//		if(m_mAbli.m_H<m_pAbli.m_H)
//		{
//			m_pAbli.m_H=m_mAbli.m_H;
//		}
//		return _pa+_ma+_td+_heal;
//	}
	boolean GetSp()
	{
		return m_specialAction;
	}
	public boolean SpAction()
	{
		if(m_specialTime==0)
		{
			m_specialTime=System.currentTimeMillis ( );
			return true;
		}
		else if(AttackChk(false)==false)
		{
			long delay=System.currentTimeMillis ( )-m_specialTime;
			if(m_pAbli.m_AS*1.8<delay)
			{
				m_specialTime=System.currentTimeMillis ( );
				//m_attackTime=System.currentTimeMillis ( );
				//m_attackExtraTime=m_pAbli.m_AS;
				m_specialAction=true;
				return true;
			}
			
			
		}
			
		return false;
	}
	public boolean AttackChk(boolean _tResetfChk)
	{
		if(m_attackTime==0)
		{
			if(_tResetfChk)
				m_attackTime=System.currentTimeMillis ( );
			return true;
		}
		else
		{
			long delay=System.currentTimeMillis ( )-m_attackTime;
			//공속이 0은 에러인 상황이라서 5초 딜레이로 함
			if(m_pAbli.m_AS==0)
			{
				if(5000<delay)
				{
					if(_tResetfChk)
						m_attackTime=System.currentTimeMillis ( );
					return true;
				}
			}
			else
			{
				if(m_pAbli.m_AS+m_attackExtraTime<delay)
				{
					if(_tResetfChk)
					{
						m_attackTime=System.currentTimeMillis ( );
						m_attackExtraTime=0;
					}
					return true;
				}
			}
			
		}
			
		return false;
	}
	public boolean InvenInChk(int _itemOff,int _amount)
	{
		for(CInventoryInfo each0 : m_inven)
		{
			if(each0.m_itemOff==_itemOff)
			{
				if(each0.m_amount>=_amount)
					return true;
			}
		}
		return false;
	}
	public int FindItemtoOffset(int _itemOff)
	{
		for(CInventoryInfo each0 : m_inven)
		{
			if(each0.m_itemOff==_itemOff)
			{
				return each0.m_offset;
			}
		}
		return -1;
	}
	CInventoryInfo GetInvenInfo(int _offset)
	{
		for(CInventoryInfo each0 : m_inven)
		{
			if(each0.m_offset==_offset)
				return each0;
		}
		return null;
	}
	public boolean PushInven(CInventoryInfo _inven)
	{
		if(_inven==null ||_inven.m_amount<=0)
			return false;
		CInventoryInfo select=null;
		for(CInventoryInfo each0 : m_inven)
		{
			if(each0.m_itemOff==_inven.m_itemOff)
			{
				if(each0.m_reinforceCount==_inven.m_reinforceCount && 
						each0.m_fCount==_inven.m_fCount && each0.m_iCount==_inven.m_iCount &&
						each0.m_eCount==_inven.m_eCount && each0.m_pCount==_inven.m_pCount)
				{
					if(each0.m_durability==-1 || each0.m_durability==_inven.m_durability)
					{
						select=each0;
						break;
					}
					
				}
			}
		}
		//샐로 만든다
		if(select==null)
		{			
			m_inven.add(_inven);
			select=m_inven.lastElement();
		}
		//비슷한게 잇으면 추가
		else
		{
			select.m_amount+=_inven.m_amount;
		}
		
	
		VMapValuePlus(VK.Get(Df.VMap.It,_inven.m_itemOff),select.m_amount);

		
		return true;
	}
	//인벤 오프셋에 덧셈뻴셈용 하고나서 그 인벤 리턴
	public CInventoryInfo SetInvenOffset(int _invenOff,int _amount)
	{
		CInventoryInfo select=null;
		//아이템을 찾고
		for(CInventoryInfo each0 : m_inven)
		{
			if(each0.m_offset==_invenOff)
			{
				select=each0;
				break;
			}
		}
		//인벤에 없는 아이템이거나 수량보다 적으면 널
		if(select==null || _amount+select.m_amount<0)
			return null;
		
		select.m_amount+=_amount;
		VMapValuePlus(VK.Get(Df.VMap.It,select.m_itemOff),select.m_amount);
		
		//만약 이번에 0개가 되었으면 인벤제거 리턴
		
		
		//만약 양수였으면 현재 찾은거 리턴
		if(_amount>0)
		{
			return null;
		}
		
		if(select.m_amount==0)
		{
			m_inven.remove(select);
		}
		
		CInventoryInfo select2=new CInventoryInfo(select.m_itemOff,-_amount);
		select2.m_reinforceCount=select.m_reinforceCount;
		select2.m_fCount=select.m_fCount;
		select2.m_iCount=select.m_iCount;
		select2.m_eCount=select.m_eCount;
		select2.m_pCount=select.m_pCount;
		select2.m_durability=select.m_durability;
		

		return select2;
	}
	public Map<String, Integer> GetvMap()
	{
		return m_vMap;
	}
	public int GetVMapValue(String _key)
	{
		Integer val=m_vMap.get(_key);
		if(val==null)
			return 0;
		
		return val;
	}
	public boolean VMapInChk(String _key)
	{
		Integer val=m_vMap.get(_key);
		if(val==null || val==0)
			return false;
		
		return true;
	}
	public boolean VMapValueCompare(String _key,int _val)
	{
		Integer val=m_vMap.get(_key);
		if(val!=null && val==_val)
			return true;
		
		return false;
	}
	public void VMapValuePlus(String _key,Integer _val)
	{
		Integer val=0;
		if(m_vMap.get(_key)!=null)
			val=m_vMap.get(_key);
		val+=_val;
		if(val<0)
			val=0;
		if(val<0)
			m_vMap.remove(_key);
		else
			m_vMap.put(_key, val);
	}
	public void VMapPushPop(String _key,Integer _val)
	{
		if(_val<0 && m_vMap.get(_key)!=null)
			m_vMap.remove(_key);
		else
			m_vMap.put(_key, _val);
	}
	public void SendResurrection()
	{
		m_pAbli=m_mAbli.toCopy();
		ResetAction(DfPAction.Normal);
		//m_skill.clear();
		//m_stateVec.clear();
		SendStop(true);
		SendAbilityRefrash();
	}
	public void MoveToPro(CProtozoa _tar,int _dfFindPath)
	{
		CPacketZone pac=new CPacketZone();
		float tick=GetBound().GetInRadius()-_tar.GetBound().GetInRadius();
		CVec3 edPos=_tar.m_pos.toCopy();
		edPos.y+=tick;
		pac.FindPath(GetKey(), edPos,_tar.GetKey(),_dfFindPath);
		m_packet.add(pac);
	}
}

