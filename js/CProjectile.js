function JSDfShotType()
{
	this.Arrow = 0;
	this.Fire = 1;

};
var DfShotType=new JSDfShotType();
class CProjectile extends CObject
{
	constructor()
	{
		super();
		
		this.m_pt=null;
		this.m_co=null;
		this.m_rb=null;
		
		this.m_size=new CVec2();
		this.m_img="";
		this.m_pType=0;
	}
	GetPRb()
	{
		return this.m_rb; 
	}
	GetPType()
	{
		return this.m_pType;
	}
	Update(_delay)
	{
		super.Update(_delay);
		var dir = this.m_rb.MoveDir();

		var dotVal = [0,0,0,0];
		var maxDot = 0;
		if (dir.IsZero() == false)
		{
			this.m_view = dir;
			
		}
		dotVal[0] = CMath.Vec3Dot(CVec3.GetRight3D(), this.m_view);
		dotVal[1] = CMath.Vec3Dot(CVec3.GetLeft3D(), this.m_view);
		dotVal[2] = CMath.Vec3Dot(CVec3.GetUp3D(), this.m_view);
		dotVal[3] = CMath.Vec3Dot(CVec3.GetDown3D(), this.m_view);
		var type=0;
		for (var i = 0; i < 4; ++i)
		{
			if (dotVal[i]> maxDot)
			{
				maxDot = dotVal[i];
				type = i;
			}
		}
		if(type==0)
			this.m_pt.SetRot(CMath.EulerToQut(new CVec3(0, 0,0)));
		else if(type==3)
			this.m_pt.SetRot(CMath.EulerToQut(new CVec3(0, 0,3.14/2)));
		else if(type==1)
			this.m_pt.SetRot(CMath.EulerToQut(new CVec3(0, 0,3.14)));
		else if(type==2)
			this.m_pt.SetRot(CMath.EulerToQut(new CVec3(0, 0,-3.14/2)));
		
	}

	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);


		this.m_offset = pac.GetInt32(0);
		this.m_key=pac.GetString(1);

		this.m_pos.Deserialize(pac.GetString(2));
		this.m_rot.Deserialize(pac.GetString(3));
		this.m_sca.Deserialize(pac.GetString(4));


		pac.GetISerialize(5, this.m_size);
		
		this.m_img=pac.GetString(6);

		
		this.m_pt = new CPaintBillbord(this.m_size,this.m_img);
		super.PushCComponent(this.m_pt);
		
		this.m_rb = new CRigidBody();
		pac.GetISerialize(7, this.m_rb);
		super.PushCComponent(this.m_rb);
		
		this.m_pType=pac.GetInt32(8);
		
		this.PRSReset();
		
	}
	
}
