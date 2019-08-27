package cell;



public class CVec 
{
	static public CVec3 V3(float _x,float _y,float _z)
	{
		return new CVec3(_x,_y,_z);
	}
}


class CVec2 implements ISerialize
{
	public CVec2(){}
	public CVec2(float _x,float _y){	x=_x;y=_y;	}

	public float x,y;


	public CVec2 toCopy()
	{
		return new CVec2(x, y);
	}
	public boolean equals(CVec2 _target)
	{
		if (x == _target.x && y == _target.y)
			return true;

		return false;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(x);
		pac.Push(y);

		return pac;
	}
	
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		x = pac.GetFloat(0);
		y = pac.GetFloat(1);
	}
}
class CVec3 implements ISerialize
{
	public CVec3(){}
	public CVec3(float _x,float _y){	x=_x;y=_y;	}
	public CVec3(float _x,float _y,float _z)
	{
		x=_x;y=_y;z=_z;
	}
	public float x,y,z;
	public void toInteger()
	{
		x = (float)((int)x);
		y = (float)((int)y);
		z = (float)((int)z);
	}
	public boolean IsZero()
	{
		if (x == 0 && y == 0 && z == 0)
			return true;

		return false;
	}
	public CVec3 toCopy()
	{
		return new CVec3(x, y, z);
	}
	public void toCopy(CVec3 _obj)
	{
		this.x=_obj.x;
		this.y=_obj.y;
		this.z=_obj.z;
	}
	public boolean equals(CVec3 _target)
	{
		if (x == _target.x && y == _target.y && z == _target.z)
			return true;

		return false;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(x);
		pac.Push(y);
		pac.Push(z);
		return pac;
	}
	
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		x = pac.GetFloat(0);
		y = pac.GetFloat(1);
		z = pac.GetFloat(2);
	}
	static CVec3 GetLeft2D() { return new CVec3(-1, 0); }
	static CVec3 GetRight2D() { return new CVec3(1, 0); }
	static CVec3 GetUp2D() { return new CVec3(0, -1); }
	static CVec3 GetDown2D() { return new CVec3(0, 1); }
	
	static public void SetLeft3D(CVec3 _vec)
	{
		Global.left3d = _vec;
	}
	static public void SetRight3D(CVec3 _vec)
	{
		Global.right3d = _vec;
	}
	static public void SetUp3D(CVec3 _vec)
	{
		Global.up3d = _vec;
	}
	static public void SetDown3D(CVec3 _vec)
	{
		Global.down3d = _vec;
	}

	static public CVec3 GetLeft3D() { return Global.left3d; }
	static public CVec3 GetRight3D() { return Global.right3d; }
	static public CVec3 GetUp3D() { return Global.up3d; }
	static public CVec3 GetDown3D() { return Global.down3d; }
}
class CVec4 implements ISerialize
{
	public CVec4(){}
	public CVec4(float _x,float _y,float _z,float _w)
	{
		x=_x;y=_y;z=_z;w=_w;
	}
	public float x,y,z,w=1;
	void SetXYZ(CVec3 _vec3)
	{
		x = _vec3.x;
		y = _vec3.y;
		z = _vec3.z;
	}
	public boolean IsZero()
	{
		if (x == 0 && y == 0 && z == 0 && w==0)
			return true;

		return false;
	}
	public CVec4 toCopy()
	{
		return new CVec4(x, y, z, w);
	}
	
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(x);
		pac.Push(y);
		pac.Push(z);
		pac.Push(w);
		return pac;
	}
	
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		x = pac.GetFloat(0);
		y = pac.GetFloat(1);
		z = pac.GetFloat(2);
		w = pac.GetFloat(3);
	}
	public CVec3 GetNormal()
	{
		return new CVec3(x,y,z);
	}
}
class CThreeVec3
{

	CVec3 vecList[]=new CVec3[3];
	CVec3 [] GetVecList()	{	return vecList;}
	CVec3 GetDirect() { return vecList[0].toCopy(); }
	CVec3 GetPosition() { return vecList[1].toCopy(); }
	CVec3 GetOriginal() { return vecList[2].toCopy(); }

	void SetDirect(CVec3 _vec) {	vecList[0] = _vec.toCopy();	}
	void SetPosition(CVec3 _vec) { vecList[1] = _vec.toCopy(); }
	void SetOriginal(CVec3 _vec) { vecList[2] = _vec.toCopy(); }

	
	CThreeVec3()
	{
		vecList[0]=new CVec3();
		vecList[1]=new CVec3();
		vecList[2]=new CVec3();
	}
	CThreeVec3 toCopy()
	{
		CThreeVec3 dummy=new CThreeVec3();
		for (int i = 0; i < 3; ++i)
			dummy.vecList[i] = this.vecList[i].toCopy();
		return dummy;
	}
};


class DfPlane
{
	public static int Near = 0;
	public static int Far = 1;
	public static int Top = 2;
	public static int Bottom = 3;
	public static int Left = 4;
	public static int Right = 5;
	public static int Count = 6;
	public static int Null = 7;
};


class CPlaneOutJoin
{
	public boolean tOutfJoin = true;
	public int plane = DfPlane.Null;
	public float len = 0;
};

class CSixVec4
{
	CSixVec4()
	{
		for(int i=0;i<DfPlane.Count;++i)
		{
			vecList[i]=new CVec4();
		}
	}
	public CVec4 vecList[]=new CVec4[DfPlane.Count];

	CVec4 GetNear() { return vecList[DfPlane.Near];	 }
	CVec4 GetFar() { return vecList[DfPlane.Far]; }
	CVec4 GetTop() { return vecList[DfPlane.Top]; }
	CVec4 GetBottom() { return vecList[DfPlane.Bottom]; }
	CVec4 GetLeft() { return vecList[DfPlane.Left]; }
	CVec4 GetRight() { return vecList[DfPlane.Right]; }

	void SetNear(CVec4 _vec) { vecList[DfPlane.Near] = _vec; }
	void SetFar(CVec4 _vec) { vecList[DfPlane.Far] = _vec; }
	void SetTop(CVec4 _vec) { vecList[DfPlane.Top] = _vec; }
	void SetBottom(CVec4 _vec) { vecList[DfPlane.Bottom] = _vec; }
	void SetLeft(CVec4 _vec) { vecList[DfPlane.Left] = _vec; }
	void SetRight(CVec4 _vec) { vecList[DfPlane.Right] = _vec; }
};