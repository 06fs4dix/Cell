function JSDfPType()
{
	this.User = 0;
	this.Npc = 1;
	this.Monster = 2;
	this.Count = 3;
	this.Null = 4;
};
var DfPType=new JSDfPType();
function JSDfPActionDetail()
{
	this.Basic = 0;
	this.Move = 1;
	this.BasicRight = 2;
	this.BasicLeft = 3;
	this.BasicTop = 4;
	this.BasicBottom = 5;
	this.MoveRight = 6;
	this.MoveLeft = 7;
	this.MoveTop = 8;
	this.MoveBottom = 9;
};
var DfPActionDetail=new JSDfPActionDetail();
function JSDfPAction()
{
	this.Normal = 0;
	this.Die = 100;
	this.Attack = 200;
	this.Escape = 300;
	this.CoercionMove = 400;
	this.CoercionAttack = 500;
	this.Count = 600;
	this.Null = 601;
};
var DfPAction=new JSDfPAction();

function JSDfFindPath()
{
	this.Move = 0;
	this.Attack = 1;
	this.CMove = 2;
	this.CAttack = 3;
	this.Count = 4;
	this.Null = 5;
};
var DfFindPath=new JSDfFindPath();


class CProtozoa extends CObject
{
	constructor()
	{
		super();
		this.m_action = DfPAction.Normal;
		this.m_pRb=null;
		this.m_pCo=null;
		this.m_actionAni=new Map();
		this.m_lastActionAni=-1;
		this.m_view=new CVec3();
		this.m_bAbil=new CAbility();
		this.m_pAbil=new CAbility();
		this.m_mAbil=new CAbility();
		this.m_size=new CVec2();
		this.m_pPt=null;
		this.m_bPt=null;
		this.m_viewType=0;
		this.m_nick="";
		this.m_bush=-1;
		
		this.m_viewMove=new CVec3(1,0,0);
		this.m_viewTarget=null;
		this.m_target=null;
		
	}
	Init()
	{
		
		
	}
	GetSize()	{	return this.m_size;	}
	GetBush()	{	return this.m_bush;	}
	SetBush(_bush)	{	this.m_bush=_bush;	}
	GetPAbil()	{	return this.m_pAbil;	}
	GetMAbil()	{	return this.m_mAbil;	}
	
	SetTarget(_target)
	{
		this.m_target=_target;
		this.ResetTargetVeiw();
	}
	ResetTargetVeiw()
	{
		if(this.m_target!=null)
		{
			var MtoP=CMath.Vec3MinusVec3(this.m_target.m_pos,this.m_pos);
			MtoP=CMath.Vec3Normalize(MtoP);
			this.m_viewTarget=CMath.Vec3Normalize(MtoP);
		}
		else
			this.m_viewTarget=null;
	}
	GetViewType()	{	return this.m_viewType;	}
	GetViewMove()	{	return this.m_viewMove;	}//움직이면서 바라보는 위치
	GetViewTarget() {return this.m_viewTarget;}
	GetView()
	{
		if(this.m_viewTarget!=null)
			return this.m_viewTarget;
		return this.m_viewMove;
	}
	
	
	GetPRb() { return this.m_pRb;	 }
	GetPCo() { return this.m_pCo;	 }
	GetDownRay()
	{
		var thV=new CThreeVec3();
		thV.SetDirect(new CVec3(0,-1,0));
		thV.SetOriginal(CMath.Vec3PlusVec3(this.m_pos,new CVec3(0,10,0)));
		return thV;
	}
	
	GetProtozoaType()
	{
		return DfPType.Null;
	}
	ActionAniFind(_ani)
	{
		var val=this.m_actionAni.get(_ani);
		if (val==null)
		{
			val=this.m_actionAni.get(DfPAction.Normal + DfPActionDetail.Basic);
			if (val==null)
				return 0;
		}
			
		return val;
	}
	ActionAniUpdate()
	{
		var dir = this.m_pRb.MoveDir();
		
		this.m_viewType = DfPActionDetail.Basic;
		var dotVal = [0,0,0,0];
		var maxDot = 0;
		if (dir.IsZero() == false)
		{
			this.m_viewMove=dir;
			this.m_view = dir;
			
		}
		dotVal[0] = CMath.Vec3Dot(CVec3.GetRight3D(), this.m_view);
		dotVal[1] = CMath.Vec3Dot(CVec3.GetLeft3D(), this.m_view);
		dotVal[2] = CMath.Vec3Dot(CVec3.GetUp3D(), this.m_view);
		dotVal[3] = CMath.Vec3Dot(CVec3.GetDown3D(), this.m_view);

		for (var i = 0; i < 4; ++i)
		{
			if (dotVal[i]> maxDot)
			{
				maxDot = dotVal[i];
				this.m_viewType = i;
			}
		}
		
		if (dir.IsZero())
		{
			var ani = this.ActionAniFind(this.m_action + DfPActionDetail.BasicRight + this.m_viewType);
			if(this.m_lastActionAni != ani)
			{
				this.m_lastActionAni = ani;
				this.RemoveAllCComponent(Df.CComponent.CAnimation);
				this.PushCComponent(CAniSC.Find(this.m_lastActionAni));
			}
		}
		else
		{
			var ani = this.ActionAniFind(this.m_action + DfPActionDetail.MoveRight + this.m_viewType);
			if (this.m_lastActionAni != ani)
			{
				this.m_lastActionAni = ani;
				this.RemoveAllCComponent(Df.CComponent.CAnimation);
				this.PushCComponent(CAniSC.Find(this.m_lastActionAni));
			}
		}
	}
	Update(_delay)
	{
		super.Update(_delay);
		this.ActionAniUpdate();
		this.ResetTargetVeiw();
	}
	Serialize()
	{
		var pac=new CPacket();
		//pac.Push(super.Serialize());
		
		pac.Push(this.m_offset);
		pac.Push(this.m_key);
		
		pac.Push(this.m_pos);
		pac.Push(this.m_rot);
		pac.Push(this.m_sca);
		
		pac.Push(this.m_actionAni);
		pac.Push(this.m_bAbil);
		pac.Push(this.m_pAbil);
		pac.Push(this.m_mAbil);
		pac.Push(this.m_size);
		pac.Push(this.m_nick);
		pac.Push(this.m_pRb);

		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		//super.Deserialize(pac.GetString(0));
	
		this.m_offset = pac.GetInt32(0);
		this.m_key=pac.GetString(1);
		
		this.m_pos.Deserialize(pac.GetString(2));
		this.m_rot.Deserialize(pac.GetString(3));
		this.m_sca.Deserialize(pac.GetString(4));
		
		var pac3=new CPacket();
		pac3.Deserialize(pac.GetString(5));
		for(var i=0;i<pac3.value.length;i+=2)
		{
			this.m_actionAni.set(pac3.GetInt32(i),pac3.GetInt32(i+1));
		}
		pac.GetISerialize(6, this.m_bAbil);
		pac.GetISerialize(7, this.m_pAbil);
		pac.GetISerialize(8, this.m_mAbil);
		pac.GetISerialize(9, this.m_size);
		
		this.m_pRb =this.NewCComponent(new CRigidBody());
		this.m_nick=pac.GetString(10);
		pac.GetISerialize(11, this.m_pRb);
		
		
		if(this.m_pPt==null)
		{
			this.m_pPt = new CPaintBillbord(this.m_size,CPalette.GetNoneTex());
			super.PushCComponent(this.m_pPt);
			
			this.m_pCo=new CCollider(this.m_pPt);
			this.m_pCo.SetCollision(false);
			this.m_pCo.SetPick(true);
			super.PushCComponent(this.m_pCo);
			
//			var pt = new CPaintBillbord(new CVec2(this.m_size.x, this.m_size.y), "img/shadow.png");
//			pt.SetPos(new CVec3(0,this.m_size.x*0.25,-10));
//			super.PushCComponent(pt);
			
			this.m_bPt= new CPaintBillbord(new CVec2(this.m_size.x, 16), CPalette.GetBlackTex());
			this.m_bPt.SetPos(new CVec3(0, -(this.m_size.x*0.5+10),0));
			this.m_bPt.SetRGBA(new CVec4(1,0,0,0));
			super.PushCComponent(this.m_bPt);
			
			var m_nickDummy = CFont.TextToTexName(this.m_nick, 64);
			var bptN = new CPaintBillbord(new CVec2(m_nickDummy.m_xSize, 64), m_nickDummy.m_key);
			bptN.SetPos(new CVec3(0, -(this.m_size.x*0.5+32+16+10), 0));
			//bptN.SetTexCodi(new CVec4(1, 1, -1, 0));
			super.PushCComponent(bptN);
			
			
			
		}
		//this.m_pRb =this.NewCComponent(new CRigidBody());
	}
	WebAblilityBarRefrash(_pAb,_mAb)
	{
		this.m_pAbil=_pAb;
		this.m_mAbil=_mAb;
		var rate=this.m_pAbil.m_H/this.m_mAbil.m_H;
		this.m_bPt.SetSize(new CVec2(this.m_size.x*rate, 16));
	}
}