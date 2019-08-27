class CCameraControl3D 
{
	constructor(_cam)
	{
		this.m_cam=_cam;
		this.lX=0;
		this.lY=0;
		this.first=true;
		this.m_mode=1;
		this.m_pos=new CVec3();
		this.m_posRate=new CVec3();
		this.m_zoom=1500;
		this.m_rotX=0;
		this.m_rotY=0;
		this.m_shakeTime=0;
	}
	SetRotX(_val)	{	this.m_rotX=_val;}
	SetRotY(_val)	{	this.m_rotY=_val;}
	SetZoom(_val)	{	this.m_zoom=_val;}
	SetShakeTime(_val)	{	this.m_shakeTime=_val;}
	GetZoom()	{	return this.m_zoom;	}
	SetPos(_pos) {	this.m_posRate = _pos;	}
	Update(_delay)
	{
		var movX = this.lX - CInput.PosX(0);
		var movY = this.lY - CInput.PosY(0);
		this.lX = CInput.PosX(0);
		this.lY = CInput.PosY(0);
		if (CInput.KeyUp(Df.Key.Num0))
		{
			if (this.m_mode == 0)
				this.m_mode = 1;
			else
				this.m_mode = 0;
		}
		if (this.m_mode == 0)
		{
			if (CInput.KeyDown(Df.Key.Q))
				this.m_cam.ZAxisZoom(10);
			if (CInput.KeyDown(Df.Key.E))
				this.m_cam.ZAxisZoom(-10);
			if (CInput.KeyDown(Df.Key.Z))
				this.m_cam.ZAxisZoom(100);
			if (CInput.KeyDown(Df.Key.X))
				this.m_cam.ZAxisZoom(-100);
		
			if (CInput.KeyUp(Df.Key.Wheel))
			{
				var val=CInput.Wheel();
				if(val>5)
					val=5;
				else if(val<-5)
					val=-5;
					
				this.m_cam.ZAxisZoom(-CInput.Wheel()*20);
				
			}
			if (CInput.KeyDown(Df.Key.E))
				this.m_cam.ZAxisZoom(-10);
			
			if (CInput.KeyDown(Df.Key.Y))
			{
				var eye = this.m_cam.GetEye();
				var look = this.m_cam.GetLook();

				eye.x += 10;
				look.x += 10;
				this.m_cam.Init(eye, look);
			}
			var moveSpeed = 10;
			if (CInput.KeyDown(Df.Key.W))
			{
				this.m_cam.FrontMove(-moveSpeed);
				//console.log(frame.Get());
			}
				
			if (CInput.KeyDown(Df.Key.S))
				this.m_cam.FrontMove(moveSpeed);
			if (CInput.KeyDown(Df.Key.A))
				this.m_cam.CrossMove(-moveSpeed);
			if (CInput.KeyDown(Df.Key.D))
				this.m_cam.CrossMove(moveSpeed);
			
		
		
			
		
			if (CInput.KeyDown(Df.Key.LButton))
			{
				if (this.first==false)
				{
					this.m_cam.FrontMove(movY * 2);
					this.m_cam.CrossMove(movX * 2);
					//alert("call");
		
				}
				this.first = false;
			}
			else if (CInput.KeyDown(Df.Key.RButton))
			{
				if (this.first == false)
				{
					this.m_cam.XAxisRotation(-movY * 0.005);
					this.m_cam.YAxisRotation(-movX * 0.005);
					
				}
				this.first = false;
		
			}
			else
				this.first = true;
			this.m_cam.Reset3D();
		}
		else
		{
			var rate=_delay/1000;
			rate*=4;
			this.m_pos = CMath.Vec3PlusVec3(CMath.Vec3MulFloat(this.m_posRate, rate), CMath.Vec3MulFloat(this.m_pos, 1.0-rate));
			if (CInput.KeyUp(Df.Key.Wheel))
				this.m_zoom += CInput.Wheel() * 20;
				//m_cam.CharacterByRotation(m_pos, 0, 0, CInput.Wheel() * 20);
			var x = 0, y = 0;
			if (CInput.KeyDown(Df.Key.RButton))
			{
				if (this.first == false)
				{
					
					x = -movX * 0.005;
					y = -movY * 0.005;
				}
				this.first = false;

			}
			else
				this.first = true;
			var pos = this.m_pos;
			if (this.m_shakeTime > 0)
			{
				pos.x += (CRand.RandInt() % 100 - 50)*0.1;
				pos.y += (CRand.RandInt() % 100 - 50)*0.1;
				pos.z += (CRand.RandInt() % 100 - 50)*0.1;
			}
			
			this.m_cam.CharacterByRotation(pos, y+this.m_rotY, x+this.m_rotX, this.m_zoom);
			this.m_rotX=0;
			this.m_rotY=0;
			this.m_cam.Reset3D();
			if(_delay>0)
				this.m_shakeTime -= _delay;
		}
		
	}
	
}


