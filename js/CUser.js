class CUser extends CProtozoa
{
	constructor()
	{
		super();
		this.m_rad = 50;
		this.m_nick=null;
	}
//	Init()
//	{
//		super.Init();
//		
//		var paint = new CPaintBillbord(new CVec2(this.m_rad*2,this.m_rad*2),CPalette.GetNoneTex());
//		super.PushCComponent(paint);
//		
//		var pt = new CPaintBillbord(new CVec2(this.m_rad*2, this.m_rad*2), "img/shadow.png");
//		pt.SetPos(new CVec3(0,this.m_rad*0.5,10));
//		super.PushCComponent(pt);
//		
//		var bpt= new CPaintBillbord(new CVec2(this.m_rad * 2, 10), CPalette.GetBlackTex());
//		bpt.SetPos(new CVec3(0, -(this.m_rad+10),0));
//		bpt.SetRGBA(new CVec4(1,0,0,0));
//		super.PushCComponent(bpt);
//		
//		this.m_nick = CFont.TextToTexName("싱싱88", 64);
//		var bptN = new CPaintBillbord(new CVec2(this.m_nick.m_xSize, 64), this.m_nick.m_key);
//		bptN.SetPos(new CVec3(0, -(this.m_rad+32+10+10), 0));
//		bptN.SetTexCodi(new CVec4(1, 1, -1, 0));
//		//bptN.SetRGBA(CVec4(1, 0, 0, 0));
//		super.PushCComponent(bptN);
//	}
	Serialize()
	{
		var pac=new CPacket();
		pac.name="CUser";
		pac.Push(super.Serialize());


		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
	}
}