function JSDfJoyType()
{
	this.Pad = 0;
	this.A = 1;
	this.B = 2;
	this.C = 3;
	this.D = 4;
	this.E = 5;
	this.Count = 6;
};
var DfJoyType=new JSDfJoyType();
class CJoyPad
{
	constructor()
	{
		this.m_btn=new Array(DfJoyType.Count);
		this.m_dir=new CVec3();
		this.m_lookOn=false;
		this.m_gap = 0.99;
		this.m_padMode=1;//0사용 안함 1누르면 보임 2계속 보임
		this.m_padState=0;
	}
	Load()
	{
		CUtil.TextureLoad("ui/flatDark00.png");
		CUtil.TextureLoad("ui/flatDark35.png");
		CUtil.TextureLoad("ui/flatDarkA.png");
		CUtil.TextureLoad("ui/flatDarkB.png");
		CUtil.TextureLoad("ui/flatDarkC.png");
		CUtil.TextureLoad("ui/flatDarkD.png");
		CUtil.TextureLoad("ui/flatDarkE.png");
	}
	Init(_can)
	{
		if (this.m_btn[DfJoyType.Pad] != null)
		{
			this.m_btn[DfJoyType.Pad].SetPos(new CVec3(16 + 100, CRoot.m_realHeight*0.5));
			this.m_btn[DfJoyType.A].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.3));
			this.m_btn[DfJoyType.B].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.5));
			this.m_btn[DfJoyType.C].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.7));
			this.m_btn[DfJoyType.D].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.9));
			this.m_btn[DfJoyType.E].SetPos(new CVec3(0 + 16, CRoot.m_realHeight*0.9));
			return;
		}
		this.m_btn[DfJoyType.Pad] = _can.New(new CUiButton());
		this.m_btn[DfJoyType.Pad].Init("ui/flatDark00.png", new CVec4(-0.1, -0.1, -0.1, 0), new CVec4(0.1, 0.1, 0.1, 0));
		this.m_btn[DfJoyType.Pad].SetPivot(new CVec3(0,0,0));
		this.m_btn[DfJoyType.Pad].SetSize(200, 200);
		this.m_btn[DfJoyType.Pad].SetPos(new CVec3(16+100,CRoot.m_realHeight*0.5));
		this.m_btn[DfJoyType.Pad].SetMove(true);
		if (this.m_padMode==0 || this.m_padMode==1)
			this.m_btn[DfJoyType.Pad].SetShow(false);
		if (this.m_padMode==0)
			this.m_btn[DfJoyType.Pad].SetPos(new CVec3(-100000,-100000,-100000));


		this.m_btn[DfJoyType.A] = _can.New(new CUiButton());
		this.m_btn[DfJoyType.A].Init("ui/flatDarkA.png", new CVec4(-0.1, -0.1, -0.1, 0), new CVec4(0.1, 0.1, 0.1, 0));
		this.m_btn[DfJoyType.A].SetPivot(new CVec3(-1, 0, 0));
		this.m_btn[DfJoyType.A].SetSize(60, 60);
		this.m_btn[DfJoyType.A].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.3));
		this.m_btn[DfJoyType.A].SetMove(true);

		this.m_btn[DfJoyType.B] = _can.New(new CUiButton());
		this.m_btn[DfJoyType.B].Init("ui/flatDarkB.png", new CVec4(-0.1, -0.1, -0.1, 0), new CVec4(0.1, 0.1, 0.1, 0));
		this.m_btn[DfJoyType.B].SetPivot(new CVec3(-1, 0, 0));
		this.m_btn[DfJoyType.B].SetSize(60, 60);
		this.m_btn[DfJoyType.B].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.5));
		this.m_btn[DfJoyType.B].SetMove(true);

		
		this.m_btn[DfJoyType.C] = _can.New(new CUiButton());
		this.m_btn[DfJoyType.C].Init("ui/flatDarkC.png", new CVec4(-0.1, -0.1, -0.1, 0), new CVec4(0.1, 0.1, 0.1, 0));
		this.m_btn[DfJoyType.C].SetPivot(new CVec3(-1, 0, 0));
		this.m_btn[DfJoyType.C].SetSize(60, 60);
		this.m_btn[DfJoyType.C].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.7));
		this.m_btn[DfJoyType.C].SetMove(true);


		this.m_btn[DfJoyType.D] = _can.New(new CUiButton());
		this.m_btn[DfJoyType.D].Init("ui/flatDarkD.png",new CVec4(-0.1, -0.1, -0.1, 0), new CVec4(0.1, 0.1, 0.1, 0));
		this.m_btn[DfJoyType.D].SetPivot(new CVec3(-1, 0, 0));
		this.m_btn[DfJoyType.D].SetSize(60, 60);
		this.m_btn[DfJoyType.D].SetPos(new CVec3(CRoot.m_realWidth - 16, CRoot.m_realHeight*0.9));
		this.m_btn[DfJoyType.D].SetMove(true);
		
		this.m_btn[DfJoyType.E] = _can.New(new CUiButton());
		this.m_btn[DfJoyType.E].Init("ui/flatDarkE.png",new CVec4(-0.1, -0.1, -0.1, 0), new CVec4(0.1, 0.1, 0.1, 0));
		this.m_btn[DfJoyType.E].SetPivot(new CVec3(1, 0, 0));
		this.m_btn[DfJoyType.E].SetSize(60, 60);
		this.m_btn[DfJoyType.E].SetPos(new CVec3(0 + 16, CRoot.m_realHeight*0.9));
		this.m_btn[DfJoyType.E].SetMove(true);
	}
	Update(_delay)
	{
		if (this.m_padMode==1)
		{
			if (this.m_padState == 3)
				this.m_padState = 0;
			if (this.m_padState == 4)
				this.m_padState = 1;
			var mpos = new CVec3(CInput.PosX(0), CInput.PosY(0),0);
			if (this.m_btn[DfJoyType.A].GetLastEvent() == DfUiEvent.Null &&
				this.m_btn[DfJoyType.B].GetLastEvent() == DfUiEvent.Null &&
				this.m_btn[DfJoyType.C].GetLastEvent() == DfUiEvent.Null &&
				this.m_btn[DfJoyType.D].GetLastEvent() == DfUiEvent.Null &&
				this.m_btn[DfJoyType.E].GetLastEvent() == DfUiEvent.Null &&
				CInput.KeyDown(Df.Key.LButton) && this.m_btn[DfJoyType.Pad].GetShow() == false)

			{
				this.m_btn[DfJoyType.Pad].SetPos(mpos);
				this.m_btn[DfJoyType.Pad].SetShow(true);
				this.m_padState = 1;
			}
			else if (CInput.KeyDown(Df.Key.LButton) == false)
			{
				this.m_btn[DfJoyType.Pad].SetShow(false);
				if (this.m_padState == 1)
					this.m_padState = 0;
				else if (this.m_padState == 2)
					this.m_padState = 3;
			}
			if (mpos.equals(this.m_btn[DfJoyType.Pad].GetPos())==false && this.m_padState==1)
			{
				this.m_padState = 2;
			}
			if (mpos.equals(this.m_btn[DfJoyType.Pad].GetPos())==true && this.m_padState==1)
			{
				this.m_padState = 4;
			}
			
			
			
				
		}
		else
		{
			if (this.m_lookOn == true)
				this.m_padState = 1;
			else
				this.m_padState = 0;
		}
		if (this.m_btn[DfJoyType.A].GetLastEvent() != DfUiEvent.Null ||
			this.m_btn[DfJoyType.B].GetLastEvent() != DfUiEvent.Null ||
			this.m_btn[DfJoyType.C].GetLastEvent() != DfUiEvent.Null ||
			this.m_btn[DfJoyType.D].GetLastEvent() != DfUiEvent.Null ||
			this.m_btn[DfJoyType.E].GetLastEvent() != DfUiEvent.Null)
		{
			this.m_padState = 1;
		}
		
		
		
		if (this.m_lookOn==false && this.m_btn[0].GetLastEvent() == DfUiEvent.Press)
		{
			this.m_lookOn = true;
		}
		
		if (this.m_lookOn==false && this.m_btn[0].GetLastEvent() == DfUiEvent.Press)
		{
			this.m_lookOn = true;
		}
		else if (this.m_lookOn == true &&  CInput.KeyUp(Df.Key.LButton))
		{
			this.m_lookOn = false;
			this.m_dir =new CVec3();
		}
		if (this.m_lookOn && this.m_padMode!=0)
		{
			var pos = this.m_btn[0].GetPos();
			pos.z = 0;
			var mpos=new CVec3(CInput.PosX(0), CInput.PosY(0),0);
			//CVec3 pdir = m_dir.toCopy();

			var pdir = CMath.Vec3MinusVec3(mpos, pos);
			var len = CMath.Vec3Lenght(pdir);
			pdir = CMath.Vec3Normalize(pdir);
			
			
			if (len > 30)
			{
				
				var DV = CMath.Vec3Dot(CVec3.GetDown2D(), pdir);
				var UV = CMath.Vec3Dot(CVec3.GetUp2D(), pdir);
				var LV = CMath.Vec3Dot(CVec3.GetLeft2D(), pdir);
				var RV = CMath.Vec3Dot(CVec3.GetRight2D(), pdir);
				
				pdir = new CVec3();

				pdir = CMath.Vec3PlusVec3(CMath.Vec3MulFloat(CVec3.GetDown3D(), DV), pdir);
				pdir = CMath.Vec3PlusVec3(CMath.Vec3MulFloat(CVec3.GetUp3D(), UV), pdir);
				pdir = CMath.Vec3PlusVec3(CMath.Vec3MulFloat(CVec3.GetLeft3D(), LV), pdir);
				pdir = CMath.Vec3PlusVec3(CMath.Vec3MulFloat(CVec3.GetRight3D(), RV), pdir);
				pdir = CMath.Vec3Normalize(pdir);

				this.m_dir = pdir;
			}
			else
				this.m_dir =new CVec3();

		}
		else
		{
			if (this.m_dir.IsZero()==false)
				this.m_dir =new CVec3();
			
			if (CInput.KeyDown(Df.Key.Left))
			{
				this.m_dir = CMath.Vec3PlusVec3(CVec3.GetLeft3D(), this.m_dir);
			}
			if (CInput.KeyDown(Df.Key.Right))
			{
				this.m_dir = CMath.Vec3PlusVec3(CVec3.GetRight3D(), this.m_dir);
			}
			if (CInput.KeyDown(Df.Key.Up))
			{
				this.m_dir = CMath.Vec3PlusVec3(CVec3.GetUp3D(), this.m_dir);
			}
			if (CInput.KeyDown(Df.Key.Down))
			{
				this.m_dir = CMath.Vec3PlusVec3(CVec3.GetDown3D(), this.m_dir);
			}
			if (this.m_dir.IsZero() == false)
				this.m_dir = CMath.Vec3Normalize(this.m_dir);
		}
	}
	GetDir() { return this.m_dir.toCopy(); }
	GetUi(_type) { return this.m_btn[_type]; }
	LookChk() 
	{
		if (this.m_padState == 0 || this.m_padState == 4)
			return false;
		return true;
	}
}
//============================================
function JSDfInfoType()
{
	this.Munu = 0;
	this.Hp = 1;
	this.Mp = 2;
	this.Exp = 3;
	this.Lv = 4;
	this.Chat = 5;
	this.Count = 6;
};
var DfInfoType=new JSDfInfoType();

class CInfoUi
{
	constructor()
	{
		this.m_ui=new Array(DfInfoType.Count);
	}
	Load()
	{
		CUtil.TextureLoad("ui/normal.png");
		CUtil.TextureLoad("ui/over.png");
		CUtil.TextureLoad("ui/press.png");

		CUtil.TextureLoad("ui/back.png");
		CUtil.TextureLoad("ui/flatDark32.png");
	}
	Init(_can)
	{
		var menuBtn = _can.New(new CUiButton());
		menuBtn.Init("ui/flatDark32.png",new CVec4(-0.1, -0.1, -0.1, 0),new CVec4(0.1, 0.1, 0.1, 0));
		menuBtn.SetPivot(new CVec3(-1, 1, 0));
		menuBtn.SetSize(60, 60);
		menuBtn.SetPos(new CVec3(CRoot.m_realWidth - 8, 8));
		menuBtn.SetMove(true);
		this.m_ui[DfInfoType.Munu] = menuBtn;

		var hpBar = _can.New(new CUiProgressBarTxt());
		hpBar.Init("ui/press.png", "ui/back.png", 100, 50);
		hpBar.SetPos(new CVec3(5, 5));
		hpBar.SetSize(20, 20);
		hpBar.SetScreenToWidth(0.4);
		hpBar.SetScreenToPosX(0.1);
		hpBar.SetMove(true);
		this.m_ui[DfInfoType.Hp] = hpBar;

		var mpBar = _can.New(new CUiProgressBarTxt());
		mpBar.Init("ui/normal.png", "ui/back.png", 100, 50);
		mpBar.SetPos(new CVec3(5, 5));
		mpBar.SetSize(20, 20);
		mpBar.SetScreenToWidth(0.4);
		mpBar.SetScreenToPosX(0.5);
		mpBar.SetMove(true);
		this.m_ui[DfInfoType.Mp] = mpBar;

		var expBar = _can.New(new CUiProgressBarTxt());
		expBar.Init("ui/over.png", "ui/back.png", 100, 50);
		expBar.SetPos(new CVec3(0, 32));
		expBar.SetSize(20, 20);
		expBar.SetScreenToWidth(0.8);
		expBar.SetScreenToPosX(0.1);
		expBar.SetMove(true);
		this.m_ui[DfInfoType.Exp] = expBar;

		var lvTxt = _can.New(new CUiText());
		lvTxt.SetPos(new CVec3(16, 16));
		lvTxt.Init("100", 32);
		lvTxt.SetMove(true);
		this.m_ui[DfInfoType.Lv] = lvTxt;

		var chatTxt = _can.New(new CUiText());
		chatTxt.SetPos(new CVec3(0, 64, -1));
		chatTxt.Init("글자 : 0000000000000000000000000000000000000000000000000000000000000\n글자 : 000000000000\n글자 : 0000000000000000000\n", 20, 300, 100);
		chatTxt.SetRGBA(new CVec4(1, 0.2, 0.2, 0));
		chatTxt.SetMove(true);
		this.m_ui[DfInfoType.Chat] = chatTxt;
	}
	GetUi(_type) { return this.m_ui[_type]; }
}