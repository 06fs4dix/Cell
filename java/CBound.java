package cell;

class DfBound
{
	static int Box = 0;
	static int Circle = 1;
	static int Count = 2;
	static int Null = 3;
};


public class CBound implements ISerialize
{
	CVec3 min = new CVec3(100000, 100000, 100000);
	CVec3 max = new CVec3(-100000, -100000, -100000);
	int boundType= DfBound.Null;


	void ResetBoxMinMax(CVec3 _vec)
	{
		boundType = DfBound.Box;
		min.x = CMath.Min(min.x, _vec.x);
		min.y = CMath.Min(min.y, _vec.y);
		min.z = CMath.Min(min.z, _vec.z);

		max.x = CMath.Max(max.x, _vec.x);
		max.y = CMath.Max(max.y, _vec.y);
		max.z = CMath.Max(max.z, _vec.z);
	}
	//최대 사이즈 하나만 넣으면 민,맥스 세팅
	void InitSphere(float _val)
	{
		boundType = DfBound.Circle;
		min.x = -_val;
		min.y = -_val;
		min.z = -_val;

		max.x = _val;
		max.y = _val;
		max.z = _val;
	}
	public float GetInRadius()
	{
		float maxX = min.x > 0 ? (max.x - min.x)*0.5f : (max.x + CMath.Abs(min.x))*0.5f;
		float maxY = min.y > 0 ? (max.y - min.y)*0.5f : (max.y + CMath.Abs(min.y))*0.5f;
		float maxZ = min.z > 0 ? (max.z - min.z)*0.5f : (max.z + CMath.Abs(min.z))*0.5f;

		return CMath.Max(CMath.Max(maxX, maxY), maxZ);
	}
	float GetOutRadius()
	{
		float ra=GetInRadius();
		if (boundType == DfBound.Circle)
			return ra;
		return CMath.Vec3Lenght(new CVec3(ra, ra, ra));
	}
	CVec3 GetCenterPos()
	{
		var L_cen=new CVec3();

		if (max.x < 0 || min.x > 0)
			L_cen.x = (max.x - min.x)*0.5f;
		else
			L_cen.x = (max.x + min.x);

		if (max.y < 0 || min.y > 0)
			L_cen.y = (max.y - min.y)*0.5f;
		else
			L_cen.y = (max.y + min.y);

		if (max.z < 0 || min.z > 0)
			L_cen.z = (max.z - min.z)*0.5f;
		else
			L_cen.z = (max.z + min.z);

		return L_cen;
	}
	CVec3 GetRadiusLen()
	{
		var L_cen = new CVec3();
		
		if (max.x < 0)
			L_cen.x = (CMath.Abs(this.min.x) - CMath.Abs(this.max.x)) / 2;
		else
			L_cen.x = (this.max.x - this.min.x) / 2;

		if (max.z < 0)
			L_cen.z = (CMath.Abs(this.min.z) - CMath.Abs(this.max.z)) / 2;
		else
			L_cen.z = (this.max.z - this.min.z) / 2;

		if (max.y < 0)
			L_cen.y = (CMath.Abs(this.min.y) - CMath.Abs(this.max.y)) / 2;
		else
			L_cen.y = (this.max.y - this.min.y) / 2;

		return L_cen;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(boundType);
		pac.Push(min);
		pac.Push(max);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		boundType = pac.GetInt32(0);
		pac.GetISerialize(1, min);
		pac.GetISerialize(2, max);
		
	}
	CBound toCopy()
	{
		CBound dummy=new CBound();
		dummy.min = min.toCopy();
		dummy.max = max.toCopy();
		return dummy;
	}
	float XSize()
	{
		return this.max.x + CMath.Abs(this.min.x);
	}
	float YSize()
	{
		return this.max.y + CMath.Abs(this.min.y);
	}

};