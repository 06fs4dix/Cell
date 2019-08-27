package cell;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.Set;
import java.util.Vector;





class DfSkType
{
	static public int Immediately=0;
	static public int Position=1;
	static public int Target=2;
	static public int Passive=3;
	static public int Switch=4;
}
class CSkProcess
{
	void Action(CSkControl _con) {}
	void Update(CSkControl _con,int _delay) {}
	void SendCool(CSkControl _con,int _time)
	{
		if((_con.m_my instanceof CUser)==false)
			return;
		CPacketSmart smt=new CPacketSmart();
		smt.name="Cool";
		smt.Push(_time);
		smt.Push(_con.m_skill.m_offset);
		smt.m_accepter=(CUser)_con.m_my;
		_con.m_my.PushPacket(smt);
	}
}
class CSkTrigger
{
	enum eCondition
	{
		TGroup,
		TIAround,//시전자 주변 (범위형  par 거리
		TILooking,//바라보는곳
		TSelect,
		TCollusion,
		TVictim,//맞을때
		TPerpetrator,//때린게 적중할때
		THpPer,
		TPosAround,
	}

	enum Deployment
	{
		Add,
		Clip,
		Remove,
	}
	static int d_Conut=0x0fffffff;
	Deployment m_tc=Deployment.Add;
	eCondition m_condition;
	//int m_chk=CGroup.None;
	int m_value=0;
	int m_valueEx=0;
	//언제,몇번,한번에 걸리는 시간
	int m_time=0;
	int m_count=d_Conut;
	int m_delay=0;
	CSkProcess m_action;
}
public class CSkill 
{

	//즉발형,클릭후 위치 지정형,클릭후 타겟지정형      ,패시브,on/off형
	int m_skType=DfSkType.Immediately;
	int m_offset;
	int m_cool;
	int m_countLimit=1;
	//static int m_lastPos;
	//static eCondition m_lastAction;

	Vector<CSkTrigger> m_trigger=new Vector<CSkTrigger>();
	//Vector<Object> m_value=new Vector<Object>();
}
class CSkControl 
{
	Object m_value=0;
	int m_level;
	boolean m_removeDelay=false;//나중에 삭제(다른 트리거가 실행해야 할때는 이걸 사용
	boolean m_removeNow=false;//바로 삭제

	int m_allTime;//전체 시간
	int m_triggerCount[]=null;
	int m_triggerDelay[]=null;
	CSkill m_skill;
	CProtozoa m_caster=null;
	CProtozoa m_my=null;
	LinkedList<CProtozoa> m_target=new LinkedList<CProtozoa>();
	CCanvasVoxel m_voxel=null;
	static int ml_offset=30000;
	int m_offset;
	//Map<String,Object> m_valueMap=new Vector<Object>();
	void Init(CSkill _skill,int _level,CProtozoa _caster,CProtozoa _my)
	{
		m_skill=_skill;
		m_level=_level;
		m_caster=_caster;
		m_my=_my;

		m_triggerCount=new int[m_skill.m_trigger.size()];
		m_triggerDelay=new int[m_skill.m_trigger.size()];
		m_offset=ml_offset;
		ml_offset++;
		//m_value=new Object[m_skill.m_value.size()];
	}
	CProtozoa TargetProcess(CSkTrigger _tri,CProtozoa _you)
	{
		if(_you.GetPAbil().m_H<=0 && _tri.m_condition!=CSkTrigger.eCondition.THpPer)
			return null;



		CProtozoa in=null;
		if(_tri.m_condition==CSkTrigger.eCondition.TGroup)
		{
			//CActionDoubleOffset ao=(CActionDoubleOffset)m_value[_tri.m_vOff];
			if(CGroup.Chk(_tri.m_value, m_my.GetGroup(), _you.GetGroup()))
			{
				in=_you;
			}
		}
		else if(_tri.m_condition==CSkTrigger.eCondition.TILooking)
		{
			//CActionDoubleOffset ao=(CActionDoubleOffset)m_value[_tri.m_vOff];
			if(CAttackCondition.AttackLooking(m_my, _you, _tri.m_valueEx/100.0, _tri.m_value))
			{
				in=_you;
			}
		}
		else if(_tri.m_condition==CSkTrigger.eCondition.TIAround)
		{
			//CActionDoubleOffset ao=(CActionDoubleOffset)m_value[_tri.m_vOff];
			if(CAttackCondition.AttackAroundOneself(m_my.GetPos(),_you.GetPos(),_tri.m_value))
			{
				in=_you;
			}
		}
		else if(_tri.m_condition==CSkTrigger.eCondition.TPosAround)
		{
			//CActionDoubleOffset ao=(CActionDoubleOffset)m_value[_tri.m_vOff];
			if(CAttackCondition.AttackAroundOneself((CVec3)this.m_value,_you.GetPos(),_tri.m_value))
			{
				in=_you;
			}
		}
		else if(_tri.m_condition==CSkTrigger.eCondition.THpPer)
		{
			if(((double)_you.GetPAbil().m_H/_you.GetMAbil().m_H)<=_tri.m_value*0.01)
				in=_you;
		}
		//		else if(_tri.m_action==CSkTrigger.eCondition.TPosAround)
		//		{
		//			CActionIntOffset ao=(CActionIntOffset)m_value[_tri.m_vOff];
		//			double len=0;
		//			CVec3 MtoP=CMath.Vec3MinusVec3(_you.m_pos,(CVec3)m_value[ao.m_off[0]]);
		//			len=CMath.Vec3Lenght(MtoP);
		//			
		//			if(len<(double)ao.m_off[1])
		//				in=_you;
		//		}
		return in;
	}
	void Update(int _delay,Collection<CRenObj> _youse,CCanvasVoxel _voxel)
	{
		if(m_voxel==null)
			m_voxel=_voxel;
		for(int i=0;i<m_skill.m_trigger.size();++i)
		{
			CSkTrigger tri=m_skill.m_trigger.get(i);
			if(tri.m_time<=m_allTime && tri.m_count>m_triggerCount[i] &&
					0>=m_triggerDelay[i])
			{
				m_triggerDelay[i]+=tri.m_delay;
				if(tri.m_count!=CSkTrigger.d_Conut)
					m_triggerCount[i]++;

				if(tri.m_condition==CSkTrigger.eCondition.TILooking ||
						tri.m_condition==CSkTrigger.eCondition.TIAround ||
						tri.m_condition==CSkTrigger.eCondition.THpPer ||
						tri.m_condition==CSkTrigger.eCondition.TPosAround)
				{
					if(tri.m_tc==CSkTrigger.Deployment.Add)
					{
						for(CRenObj each0 : _youse)
						{
							CProtozoa each1=(CProtozoa)each0;

							each1=TargetProcess(tri,each1);

							if(each1!=null)
								m_target.addFirst(each1);
						}
					}
					else 
					{
						for(Iterator<CProtozoa> it = m_target.iterator() ; it.hasNext() ;)
						{
							CProtozoa each0=it.next();

							each0=TargetProcess(tri,each0);
							if(tri.m_tc==CSkTrigger.Deployment.Clip && each0==null)
								it.remove();	
							if(tri.m_tc==CSkTrigger.Deployment.Remove && each0!=null)
								it.remove();
						}
					}

				}
				tri.m_action.Action(this);
				
				if(m_removeNow)
					return;
			}
			tri.m_action.Update(this,_delay);
			m_triggerDelay[i]-=_delay;
		}
		m_allTime+=_delay;
	}

}
/*
힐(Heal : 에너지 채움
독(Poision : 도트 데미지
화상 : 회복력 감소
재생(Regeneration) : 강제 회복능력 

속박(Snare-올무: 이동 금지
기절(Stun : 이동,컨트롤,스킬 금지
침묵 : 스킬 사용 금지
수면 : 이동,컨트롤,스킬 금지 때리면 깨어남
공포 : 강제 도망,컨트롤 불가
실명 : 컨트롤 불가
변이 : 
매혹 : 스킬,컨트롤 불가,타게팅 이동
밀기(Knockback: 나에게 멀어짐
당기기 : 나에게로 옴
둔화(Slow : 이동 느려짐 
도발 : 스킬,컨트롤 불가,타게팅 공격
 */
class DfSkOff
{
	static public int MonFindHeal=1;
	static public int Heal=2;
	static public int Snare=3;
	
	
	
	static public int Test=4;
	static public int Poison=5;
	static public int Fire=6;
	static public int Fear=7;
	static public int Regen=8;
	
	static public int CollusionPoison=10;
	
	
	static public int PoisonBite=12;
	static public int ItemGuardianAmulet=13;
	
	static public int ItemPotion=24;
	static public int ShieldBlock=65;
	static public int Dash=66;
	static public int Pull=67;
	static public int QuickShot=68;
	static public int MutiShot=69;
	static public int BackStep=70;
	
	static public int FirePenetrate=71;
	static public int BurnPress=72;
	static public int TargetHeal=73;
	static public int Teleport=74;
	
	static public int Survivor=98;
	static public int Explosion=99;
	static public int Sinping=100;
	static public int RageAttack=101;
	static public int Lightning=102;
	static public int TrackShot=103;
	static public int FastRun=104;
	
	
	static public int Ext_FirePenetrate=20000;
	
	static public int StoneKing=10000;
	static public int GhostAnIntan=10001;
	static public int TransferFear=10002;
	static public int HealingFactor=10003;
	static public int Bloodsucking=10004;
	
	
	
	static public int SpSword=30000;
}
class CSkSC
{
	static Vector<CSkill> m_skVec=new Vector<CSkill>();
	static public CSkill GetSkill(int _off)
	{
		for(CSkill each0 : m_skVec)
		{
			if(each0.m_offset==_off)
				return each0;
		}

		return null;
	}
	static public void Init()
	{
		CSkill sk=new CSkill();
		sk.m_offset=DfSkOff.Test;
		sk.m_cool=1000*10;
		CSkTrigger tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_caster.MPCacAnChk(-20)==false)
				{
					
					CPacketZone pac=new CPacketZone();
					pac.EffectCreate(_con.m_caster.GetPos(), 300.0f, 300.0f, CEffect.BlueCircle, null, "",0,0);
					_con.m_caster.PushPacket(pac);
					_con.m_caster.SendAbilityRefrash();

				}
				else
					_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		tri.m_delay=0;

		sk.m_trigger.add(tri);


		tri=new CSkTrigger();
		tri.m_condition=CSkTrigger.eCondition.TIAround;
		tri.m_value=150;
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				for(var each0 : _con.m_target)
				{
					CPacketZone pac=new CPacketZone();
					pac.EffectCreate(each0.GetPos(), 64, 64, CEffect.BlueCircle, null, "",0,0);
					each0.PushPacket(pac);
				}

				_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		tri.m_time=1000;
		sk.m_trigger.add(tri);
		m_skVec.add(sk);

		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Poison;
		sk.m_cool=0;
		sk.m_countLimit=10;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CDamage dam=new CDamage(_con.m_caster, CDamage.None);
				dam.m_ability=new CAbility();
				dam.m_ability.m_TD=2*_con.m_level+2;
				dam.m_ability.m_POA=2*_con.m_level+2;
				_con.m_my.SendDamage(dam);


				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.ElPoison, null, "",0,0);
				_con.m_my.PushPacket(pac);

			}

		};
		tri.m_count=10;
		tri.m_delay=500;
		sk.m_trigger.add(tri);

		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		tri.m_time=10*500;
		sk.m_trigger.add(tri);

		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Fire;
		sk.m_cool=0;
		sk.m_countLimit=10;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CState state=new  CState();
				state.m_offset=DfSkOff.Fire;
				//_con.m_proVal=state.m_offset;
				state.m_ability=new CAbility();
				state.m_ability.m_HR=-100*_con.m_level;
				_con.m_my.PushState(state);
				
				
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.ElFire, null, "",0,0);
				_con.m_my.PushPacket(pac);

			}

		};
		tri.m_count=20;
		tri.m_delay=500;
		sk.m_trigger.add(tri);
		
		

		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_removeDelay=true;
			}

		};
		tri.m_count=1;
		tri.m_time=20*500;
		sk.m_trigger.add(tri);

		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_removeDelay)
				{
					_con.m_my.RemoveState(DfSkOff.Fire);
				}
			}

		};

		sk.m_trigger.add(tri);
		
		m_skVec.add(sk);

		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Fear;
		sk.m_cool=0;
		sk.m_countLimit=10;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CState state=new  CState();
				state.m_offset=DfSkOff.Fear;
				state.m_escape=true;
				state.m_control=false;
				state.m_skill=false;
				
				state.m_delay=50*_con.m_level;
				_con.m_my.PushState(state);
				
				_con.m_my.SendStop(false);
				
				
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.EFear, null, "",0,0);
				_con.m_my.PushPacket(pac);
				_con.m_removeNow=true;

			}

		};
		sk.m_trigger.add(tri);
		
		
		m_skVec.add(sk);

		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Regen;
		sk.m_cool=0;
		sk.m_countLimit=3;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if((Integer)_con.m_value==0)
				{
					CState state=new  CState();
					state.m_offset=DfSkOff.Regen;
					state.m_regen=true;
					state.m_delay=500*_con.m_level;
					_con.m_value=state.m_delay;
					_con.m_my.PushState(state);
					
					CPacketZone pac=new CPacketZone();
					float len=_con.m_my.GetBound().GetInRadius();
					pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.ERegen, null, "",0,0);
					_con.m_my.PushPacket(pac);
				}
				else
				{
					if((Integer)_con.m_value<=0)
					{
						_con.m_removeNow=true;
					}
					else
					{
						CPacketZone pac=new CPacketZone();
						float len=_con.m_my.GetBound().GetInRadius();
						pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.ERegen, null, "",0,0);
						_con.m_my.PushPacket(pac);
					}
				}
				
				
				
				
				//

			}
			void Update(CSkControl _con,int _delay)
			{
				_con.m_value=((Integer)_con.m_value)-_delay;
			}

		};
		tri.m_delay=500;
		sk.m_trigger.add(tri);
		
		
		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.CollusionPoison;
		sk.m_cool=0;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				Set<CProtozoa> colSet=_con.m_my.GetCollusion();
				for(var each0 : colSet)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
					{
						each0.PushSkill(CSkSC.GetSkill(DfSkOff.Poison), _con.m_level, _con.m_my);
					}
				}
				
				

			}

		};
		sk.m_trigger.add(tri);
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.ItemGuardianAmulet;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;

		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if((double)_con.m_caster.GetPAbil().m_H/_con.m_caster.GetMAbil().m_H<=0.1)
				{
					_con.m_caster.HpCac(_con.m_caster.GetMAbil().m_H, CDamage.None);
					CUser user=(CUser)_con.m_caster;
					user.Pop_SameTypeTakeOff(DfSkOff.ItemGuardianAmulet);

					_con.m_removeNow=true;

				}
			}

		};
		//tri.m_count=1;
		tri.m_delay=0;
		sk.m_trigger.add(tri);
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.PoisonBite;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;

		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				//누군가가 맞으면
				if(_con.m_caster.m_attackAction==true)
				{
					if(Math.random()<0.25)
					{
						for(var each0 :_con.m_caster.m_perpetrator)
						{
							CSkill sk=GetSkill(DfSkOff.Poison);
							each0.m_protozoa.PushSkill(sk, _con.m_caster.GetLevel(), _con.m_caster);
						}
					}
				}
			}

		};
		//tri.m_count=1;
		tri.m_delay=0;
		sk.m_trigger.add(tri);
		m_skVec.add(sk);

		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.ItemPotion;
		sk.m_cool=5000;
		sk.m_skType=DfSkType.Immediately;

		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_removeNow=true;
			}

		};
		//tri.m_count=1;
		tri.m_delay=0;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Heal;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Immediately;

		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_my.HpCac(_con.m_level*25, CDamage.None);
				_con.m_removeNow=true;
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Heal, null, "",0,0);
				_con.m_my.PushPacket(pac);
				_con.m_removeNow=true;
			}

		};
		//tri.m_count=1;
		tri.m_delay=0;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.MonFindHeal;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;

		tri=new CSkTrigger();
		tri.m_condition=CSkTrigger.eCondition.TIAround;
		tri.m_value=1000;
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.GetTarget()==null)
				{
					CProtozoa tar=null;
					float min=100000;
					for(var each0 : _con.m_target)
					{
						if(each0==_con.m_my || (double)each0.GetPAbil().m_H/each0.GetMAbil().m_H>=0.9)
							continue;
						if(CGroup.Alliance(each0.GetGroup(), _con.m_my.GetGroup()))
						{
							float len=CMath.PosAnPosLen(each0.GetPos(), _con.m_my.GetPos());
							if(len<min)
							{
								min=len;
								tar=each0;
							}
						}

					}
					if(tar!=null && (Integer)_con.m_value<=0)
					{
						//_con.m_my.SetTarget(tar);
						if(min<200)
						{
							tar.PushSkill(GetSkill(DfSkOff.Heal), _con.m_level, _con.m_my);
							_con.m_value=5000;
						}
						else
						{
							_con.m_my.MoveToPro(tar, DfFindPath.Move);
							System.out.println("move"+tar.GetKey());
						}

					}
				}
				//_con.m_removeNow=true;
			}
			public void Update(CSkControl _con,int _delay)
			{
				_con.m_value=(Integer)_con.m_value-_delay;
			}
		};
		//tri.m_count=d_
		tri.m_delay=2000;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Snare;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CState state=new  CState();
				state.m_move=false;
				state.m_delay=200*(_con.m_level+1);
				_con.m_my.PushState(state);
				_con.m_my.SendStop(false);
				_con.m_value=1;
				
			}

		};
		tri.m_count=1;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Snare, null, "",0,0);
				_con.m_my.PushPacket(pac);
				
				if((200*(_con.m_level+1))/1000<=(Integer)_con.m_value)
				{
					_con.m_removeNow=true;
				}
				_con.m_value=(Integer)_con.m_value+1;
				
			}

		};
		
		tri.m_delay=1000;
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.StoneKing;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_target.isEmpty())
					return;
				
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
						each0.PushSkill(GetSkill(DfSkOff.Snare), 10, _con.m_my);
				}
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Dark, null, "",0,0);
				_con.m_my.PushPacket(pac);
				_con.m_target.clear();
			}

		};
		//tri.m_count=1;
		tri.m_condition=CSkTrigger.eCondition.TIAround;
		tri.m_value=500;
		tri.m_delay=5000;
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.GhostAnIntan;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CState state=new  CState();
				state.m_intangibility=true;
				state.m_ghost=true;
				_con.m_my.PushState(state);
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.ShieldBlock;
		sk.m_cool=100;
		sk.m_skType=DfSkType.Switch;
		sk.m_countLimit=2;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				
				
				if(_con.m_my.GetSkillCount(DfSkOff.ShieldBlock)>1)
				{
					_con.m_my.RemoveSkill(DfSkOff.ShieldBlock, 1000);
					_con.m_my.RemoveState(DfSkOff.ShieldBlock);
				}
				else
				{
					if(_con.m_my.MPCacAnChk(-1))
					{
						_con.m_removeNow=true;
						return;
					}
					
					CState state=new  CState();
					state.m_offset=DfSkOff.ShieldBlock;
					state.m_ability=new CAbility();
					state.m_ability.m_MS=-400;
					state.m_ability.m_PD=30;
					state.m_ability.m_MD=30;
					state.m_ability.m_PAP=-45;
					state.m_ability.m_MAP=-45;
					_con.m_my.PushState(state);
					
				}
				
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
	
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Dark, null, "",0,0);
				_con.m_my.PushPacket(pac);
				
			}

		};
		tri.m_delay=1000;
		sk.m_trigger.add(tri);
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Dash;
		sk.m_cool=2000;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				SendCool(_con, _con.m_skill.m_cool);
				_con.m_my.GetPRb().Push(new CMovement(DfSkOff.Dash+"",_con.m_my.GetView(),1500));
				CState state=new  CState();
				state.m_offset=DfSkOff.Dash;
				state.m_move=false;
				_con.m_my.PushState(state);
				
				CPacketZone pac=new CPacketZone();
				pac.Sound("dash");
				_con.m_my.PushPacket(pac);
				//_con.m_my.SendMoveQue();
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				Set<CProtozoa> col=_con.m_my.GetCollusion();
				for(var each0 : col)
				{
					CDamage dmg=new CDamage(_con.m_my,CDamage.Skill);
					each0.SendDamage(dmg);
					_con.m_removeDelay=true;
				}
			}

		};
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_removeDelay=true;
			}

		};
		tri.m_count=1;
		tri.m_time=100;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_removeDelay)
				{
					_con.m_my.GetPRb().Remove(DfSkOff.Dash+"");
					_con.m_my.RemoveState(DfSkOff.Dash);
					_con.m_removeNow=true;
				}
			}

		};
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Pull;
		sk.m_cool=3000;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				SendCool(_con, _con.m_skill.m_cool);
				_con.m_my.SendAbilityRefrash();
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
					{
						CVec3 dir=CMath.Vec3MinusVec3(_con.m_my.GetPos(), each0.GetPos());
						dir.y=0;
						dir=CMath.Vec3Normalize(dir);
						each0.GetPRb().Push(new CMovement(DfSkOff.Pull+"",dir,1200));
						each0.SendMoveQue();
					}
					
				}
				
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), 600, 600, CEffect.BlueCircle, null, "",0,0);
				_con.m_my.PushPacket(pac);
			}
			public void Update(CSkControl _con,int _delay)
			{
				_con.m_value=(Integer)_con.m_value+_delay;
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
					{
						Set<CProtozoa> col=each0.GetCollusion();
						
						if((Integer)_con.m_value>200 || col.contains(_con.m_my))
						{
							each0.GetPRb().Remove(DfSkOff.Pull+"");
							each0.SendMoveQue();
						}
					}
				}
				if((Integer)_con.m_value>200)
				{
					_con.m_removeDelay=true;
				}
			}
		};
		tri.m_condition=CSkTrigger.eCondition.TIAround;
		tri.m_count=1;
		tri.m_value=500;
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.QuickShot;
		sk.m_cool=1000;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				SendCool(_con, _con.m_skill.m_cool);
				_con.m_my.SendAbilityRefrash();
				
				CPacketZone pac=new CPacketZone();
				pac.Shot(_con.m_my, -1, _con.m_my.GetPos(), _con.m_my.GetView(), 1000, 
						null, null,false,-1);
				_con.m_my.PushPacket(pac);
				CState state=new  CState();
				state.m_offset=DfSkOff.QuickShot;
				state.m_basicAttack=false;
				state.m_delay=250;
				_con.m_my.PushState(state);
			}

		};
		tri.m_delay=100;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_removeNow=true;
			}

		};
		tri.m_time=100*2;
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.MutiShot;
		sk.m_cool=1000;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				_con.m_my.SendAbilityRefrash();
				SendCool(_con, _con.m_skill.m_cool);
				
				CMat rotMat=CMath.MatAxisToRotation(new CVec3(0,1,0), 0);
				CVec3 dir=_con.m_my.GetView();
				dir=CMath.MatToVec3Coordinate(dir, rotMat);
				
				CPacketZone pac=new CPacketZone();
				pac.Shot(_con.m_my, -1, _con.m_my.GetPos(), dir, 1000, null, null,false,-1);
				_con.m_my.PushPacket(pac);
				
				
				rotMat=CMath.MatAxisToRotation(new CVec3(0,1,0), 3.14f/4);
				dir=_con.m_my.GetView();
				dir=CMath.MatToVec3Coordinate(dir, rotMat);
				
				pac=new CPacketZone();
				pac.Shot(_con.m_my, -1, _con.m_my.GetPos(), dir, 1000, null, null,false,-1);
				_con.m_my.PushPacket(pac);
				
				rotMat=CMath.MatAxisToRotation(new CVec3(0,1,0), -3.14f/4);
				dir=_con.m_my.GetView();
				dir=CMath.MatToVec3Coordinate(dir, rotMat);
				
				pac=new CPacketZone();
				pac.Shot(_con.m_my, -1, _con.m_my.GetPos(), dir, 1000, null, null,false,-1);
				_con.m_my.PushPacket(pac);
				
				
				CState state=new  CState();
				state.m_offset=DfSkOff.MutiShot;
				state.m_basicAttack=false;
				state.m_delay=200;
				_con.m_my.PushState(state);
				_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
	
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.BackStep;
		sk.m_cool=2500;
		sk.m_skType=DfSkType.Immediately;
		sk.m_countLimit=2;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-3))
				{
					_con.m_removeNow=true;
					return;
				}
				SendCool(_con, _con.m_skill.m_cool);
				_con.m_my.SendAbilityRefrash();
				
				_con.m_my.GetPRb().Push(new CMovement(DfSkOff.BackStep+"",
						CMath.Vec3MulFloat(_con.m_my.GetView(),-1),1500));
				CState state=new  CState();
				state.m_offset=DfSkOff.BackStep;
				state.m_move=false;
				state.m_delay=100;
				_con.m_my.PushState(state);
				
				CPacketZone pac=new CPacketZone();
				pac.Sound("dash");
				_con.m_my.PushPacket(pac);

			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_my.GetPRb().Remove(DfSkOff.BackStep+"");
				_con.m_my.SendMoveQue();
				_con.m_removeNow=true;
			}

		};
		tri.m_time=100;
		tri.m_count=1;
		sk.m_trigger.add(tri);
		
		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.FirePenetrate;
		sk.m_cool=2000;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-3))
				{
					_con.m_removeNow=true;
					return;
				}
				_con.m_my.SendAbilityRefrash();
				SendCool(_con, _con.m_skill.m_cool);
				
				CPacketZone pac=new CPacketZone();
				pac.Shot(_con.m_my, DfShotType.Fire, _con.m_my.GetPos(), _con.m_my.GetView(), 800,
						new CProjectileSkill(DfSkOff.Ext_FirePenetrate,_con.m_level) , null,true,-1);
				_con.m_my.PushPacket(pac);
				_con.m_removeNow=true;

			}

		};
		sk.m_trigger.add(tri);
		
		m_skVec.add(sk);
		sk=new CSkill();
		sk.m_offset=DfSkOff.Ext_FirePenetrate;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(CGroup.Attack(_con.m_caster.GetGroup(), _con.m_my.GetGroup()))
				{
					_con.m_my.PushSkill(GetSkill(DfSkOff.Fire), _con.m_level, _con.m_caster);
					
					CDamage dam=new CDamage(_con.m_caster, CDamage.Skill);
					_con.m_my.SendDamage(dam);
					_con.m_removeNow=true;
				}

			}

		};
		sk.m_trigger.add(tri);
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.BurnPress;
		sk.m_cool=500;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-1))
				{
					_con.m_removeNow=true;
					return;
				}
				_con.m_my.SendAbilityRefrash();
				SendCool(_con, _con.m_skill.m_cool);
				
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup())==false)
						continue;
					int count=each0.GetSkillCount(DfSkOff.Fire);
					if(count==0)
						continue;
					each0.RemoveSkill(DfSkOff.Fire, count);
					each0.SendDamage(new CDamage(_con.m_my, CDamage.Skill));
					
					CPacketZone pac=new CPacketZone();
					float len=_con.m_my.GetBound().GetInRadius();
					pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Snare, null, "",0,0);
					_con.m_my.PushPacket(pac);
				}
				_con.m_removeNow=true;
			}

		};
		tri.m_condition=CSkTrigger.eCondition.TIAround;
		tri.m_value=500;
		tri.m_count=1;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.TargetHeal;
		sk.m_cool=1000;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				_con.m_my.SendAbilityRefrash();
				SendCool(_con, _con.m_skill.m_cool);
				
				_con.m_my.GetTarget().HpCac(50*_con.m_level, CDamage.None);
				
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Heal, null, "",0,0);
				_con.m_my.PushPacket(pac);
				_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Teleport;
		sk.m_cool=1000;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				_con.m_my.SendAbilityRefrash();
				SendCool(_con, _con.m_skill.m_cool);
				
				CBound bound=_con.m_my.GetBound();
				float len=bound.GetInRadius();
				float relen=0;
				float movelen=200;
				Vector<Integer> pass=new Vector<Integer>();
				//pass.add(_con.m_my.GetKey().hashCode());
				pass.add(3);
				boolean moveLock=false;
				for(int i=0;i<movelen+len;i+=len)
				{
					CVec3 last=CMath.Vec3MulFloat(_con.m_my.GetViewMove(), i);
					last=CMath.Vec3PlusVec3(last, _con.m_my.GetPos());
					if(_con.m_voxel.Restricted(last, bound, pass)==true)
					{
						moveLock=true;
						break;
					}
					relen+=len;
				}
				
				CVec3 last=CMath.Vec3MulFloat(_con.m_my.GetViewMove(), relen);
				_con.m_my.SetPos(CMath.Vec3PlusVec3(last, _con.m_my.GetPos()));
				_con.m_my.SendMoveQue();
				
				CPacketZone pac=new CPacketZone();
				pac.Sound("teleport");
				_con.m_my.PushPacket(pac);
				
				_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.SpSword;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.GetSp())
				{
					System.out.println("spAttack");
   					CPacketZone pac=new CPacketZone();
					pac.Wield(_con.m_my);
					//_con.m_my.SetAttackExtraTime(_con.m_my.GetMAbil().m_AS);
					_con.m_my.PushPacket(pac);
				}
			}

		};
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.TransferFear;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				for(var each0 : _con.m_my.GetVictim())
				{
					if(CGroup.Attack(_con.m_my.GetGroup(), each0.m_protozoa.GetGroup()))
					{
						each0.m_protozoa.PushSkill(CSkSC.GetSkill(DfSkOff.Fear), 4, _con.m_my);
					}
				}
				
			}

		};
		
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.HealingFactor;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_my.PushSkill(CSkSC.GetSkill(DfSkOff.Regen), 20, _con.m_my);
				
			}

		};
		tri.m_delay=1000*10;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Bloodsucking;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				for(var each : _con.m_my.m_perpetrator)
				{
					if(each.m_protozoa.GetPAbil().m_H<=0)
					{
						_con.m_my.HpCac(15, CDamage.None);
						_con.m_my.SendAbilityRefrash();
						
						CPacketZone pac=new CPacketZone();
						float len=_con.m_my.GetBound().GetInRadius();
						pac.EffectCreate(each.m_protozoa.GetPos(), len, len, CEffect.EBloodsucking, null, "",0,0);
						_con.m_my.PushPacket(pac);
						
						
					}
				}
				
				
			}

		};
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Survivor;
		sk.m_cool=0;
		sk.m_skType=DfSkType.Passive;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				
				CState state=new  CState();
				state.m_offset=DfSkOff.Survivor;
				state.m_ability=new CAbility();
				state.m_ability.m_HR=30;
				_con.m_my.PushState(state);
				
			}
		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_removeDelay)
				{
					_con.m_my.RemoveState(DfSkOff.Survivor);
					_con.m_removeNow=true;
					return;
				}
			
				if(_con.m_my.GetPAbil().m_H/(double)_con.m_my.GetMAbil().m_H<0.2 &&
						(Integer)_con.m_value<=0	)
				{
					CState state=new  CState();
					state.m_offset=0;
					state.m_ability=new CAbility();
					state.m_ability.m_MS=300;
					state.m_regen=true;
					state.m_delay=1000*5;
					_con.m_my.PushState(state);
					
					
					CPacketZone pac=new CPacketZone();
					float len=_con.m_my.GetBound().GetInRadius();
					pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.Heal, null, "",0,0);
					_con.m_my.PushPacket(pac);
					
					_con.m_value=1000*10;
				}
				
				
			}
			void Update(CSkControl _con,int _delay)
			{
				if((Integer)_con.m_value>0)
				{
					_con.m_value=(Integer)_con.m_value-_delay;
				}
			}

		};
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Explosion;
		sk.m_skType=DfSkType.Position;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-10))
				{
					_con.m_removeNow=true;
					return;
				}
				CVec3 pos=_con.m_my.GetClick().toCopy();
				pos.y+=50;
				_con.m_value=pos;
			}
		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CVec3 pos=(CVec3)_con.m_value;
				
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
					{
						CDamage dam=new CDamage(new CAbility(),_con.m_my, CDamage.Skill,0.5,0.5);
						each0.SendDamage(dam);
					}
				}
				CPacketZone pac=new CPacketZone();
				pac.EffectCreate(pos, 300, 300, CEffect.EExplosion, null, "",0,0);
				_con.m_my.PushPacket(pac);
				
				
				
			}
		};
		tri.m_condition=CSkTrigger.eCondition.TPosAround;
		tri.m_value=300;
		tri.m_count=10;
		tri.m_delay=500;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_removeNow=true;
			}
		};
		tri.m_condition=CSkTrigger.eCondition.TPosAround;
		
		
		tri.m_time=500*10;
		sk.m_trigger.add(tri);
		
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.Sinping;
		sk.m_cool=2000;
		sk.m_skType=DfSkType.Immediately;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				this.SendCool(_con, _con.m_skill.m_cool);
				if(_con.m_my.MPCacAnChk(-5))
				{
					_con.m_removeNow=true;
					return;
				}
				if(_con.m_my.GetStateCount(DfSkOff.Sinping)==0)
				{
					CState state=new  CState();
					state.m_offset=DfSkOff.Sinping;
					state.m_ability=new CAbility();
					state.m_ability.m_AL=500;
					state.m_ability.m_L=10;
					state.m_ability.m_PD=-20;
					state.m_ability.m_MD=-20;
					state.m_ability.m_A=-10;
					state.m_move=false;
					_con.m_my.PushState(state);
				}
				else
				{
					CState state=new  CState();
					state.m_offset=0;
					state.m_move=false;
					state.m_delay=500;
					_con.m_my.PushState(state);
					_con.m_my.RemoveState(DfSkOff.Sinping);
				}
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.ESniping, null, "",0,0);
				_con.m_my.PushPacket(pac);
				_con.m_removeNow=true;
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.RageAttack;
		sk.m_cool=5000;
		sk.m_skType=DfSkType.Immediately;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.MPCacAnChk(-2))
				{
					_con.m_removeNow=true;
					return;
				}
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.EFear, null, "",0,0);
				_con.m_my.PushPacket(pac);
			}

		};
		tri.m_count=1;
		tri.m_delay=500;
		sk.m_trigger.add(tri);
		
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				_con.m_my.HpCac(-50, CDamage.None);
				_con.m_my.SendAbilityRefrash();
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
					{
						CDamage dam=new CDamage(_con.m_my, CDamage.Skill);
						each0.SendDamage(dam);
						
						CPacketZone pac=new CPacketZone();
						float len=_con.m_my.GetBound().GetInRadius();
						pac.EffectCreate(each0.GetPos(), len, len, CEffect.EBloodsucking, null, "",0,0);
						_con.m_my.PushPacket(pac);
					}
				}
				
				
				
				_con.m_removeNow=true;
			}

		};
		tri.m_condition=CSkTrigger.eCondition.TILooking;
		tri.m_value=300;
		tri.m_valueEx=0;
		tri.m_time=500;
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
		//=========================================================================
		
		sk=new CSkill();
		sk.m_offset=DfSkOff.Lightning;
		sk.m_skType=DfSkType.Position;
		sk.m_countLimit=3;
		sk.m_cool=1000;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				this.SendCool(_con, _con.m_skill.m_cool);
				if(_con.m_my.MPCacAnChk(-8))
				{
					_con.m_removeNow=true;
					return;
				}
				
				
				CVec3 pos=_con.m_my.GetClick().toCopy();
				pos.y+=20;
				_con.m_value=pos;
				if(CMath.PosAnPosLen(pos, _con.m_my.GetPos())>600)
				{
					_con.m_removeNow=true;
					return;
				}
				
				
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(pos, len, len, CEffect.ECircleUi, null, "",0,0);
				_con.m_my.PushPacket(pac);
				
			}

		};
		tri.m_count=1;
		
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				for(var each0 : _con.m_target)
				{
					if(CGroup.Attack(each0.GetGroup(), _con.m_my.GetGroup()))
					{
						CDamage dam=new CDamage(_con.m_my, CDamage.Skill);
						each0.SendDamage(dam);
					}
				}
				
				CPacketZone pac=new CPacketZone();
				pac.EffectCreate((CVec3)_con.m_value, 128, 512, CEffect.ELightning, null, "",0,-128);
				_con.m_my.PushPacket(pac);
				
				_con.m_removeNow=true;
			}

		};
		tri.m_time=1000;
		tri.m_condition=CSkTrigger.eCondition.TPosAround;
		tri.m_value=300;
		sk.m_trigger.add(tri);
		m_skVec.add(sk);
		//=========================================================================		
		sk=new CSkill();
		sk.m_offset=DfSkOff.TrackShot;
		sk.m_skType=DfSkType.Passive;
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CState state=new  CState();
				state.m_offset=DfSkOff.TrackShot;
				state.m_basicAttack=false;
				_con.m_my.PushState(state);
			}

		};
		tri.m_count=1;
		sk.m_trigger.add(tri);
		
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				if(_con.m_my.GetAttackAction())
				{
					if(_con.m_removeDelay==true)
					{
						_con.m_removeNow=true;
						_con.m_my.RemoveState(DfSkOff.TrackShot);
						return;
					}
					if(_con.m_my.MPCacAnChk(-2)==false)
					{
						CPacketZone smt=new CPacketZone();
						smt.Shot(_con.m_my, DfShotType.Arrow, _con.m_my.GetPos(),
								_con.m_my.GetView(), (float)500, null, _con.m_my.GetTarget(), false,1500);
						_con.m_my.PushPacket(smt);
					}
					
					
				}
			}

		};
		sk.m_trigger.add(tri);
		
		m_skVec.add(sk);
		//=========================================================================
		sk=new CSkill();
		sk.m_offset=DfSkOff.FastRun;
		sk.m_cool=3000;
		sk.m_skType=DfSkType.Immediately;
		tri=new CSkTrigger();
		tri.m_action=new CSkProcess() 
		{
			public void Action(CSkControl _con) 
			{
				CState state=new  CState();
				state.m_offset=DfSkOff.FastRun;
				state.m_ability=new CAbility();
				state.m_ability.m_MS=300;
				state.m_ability.m_HR=-500;
				state.m_ability.m_MR=-500;
				state.m_delay=2000;
				_con.m_my.PushState(state);
				_con.m_my.SendMoveQue();
				
				CPacketZone pac=new CPacketZone();
				float len=_con.m_my.GetBound().GetInRadius();
				pac.EffectCreate(_con.m_my.GetPos(), len, len, CEffect.EBrushRing, null, "",0,0);
				_con.m_my.PushPacket(pac);
				this.SendCool(_con, _con.m_skill.m_cool);
				_con.m_removeNow=true;
			}

		};
		sk.m_trigger.add(tri);


		m_skVec.add(sk);
	}
}