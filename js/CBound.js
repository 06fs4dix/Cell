function JSDfBound()
{
	this.Box = 0;
	this.Circle = 1;
	this.Count = 2;
	this.Null = 3;
};
var DfBound=new JSDfBound();


function CBound() 
{
	this.min=new CVec3(100000,100000,100000);
	this.max=new CVec3(-100000,-100000,-100000);
	this.boundType=DfBound.Null;
}
CBound.prototype=new ISerialize();
CBound.prototype.constructor	=CBound;
CBound.prototype.ResetBoxMinMax=function(_vec)
{
	this.boundType=DfBound.Box;
	this.min.x=CMath.Min(this.min.x,_vec.x);
	this.min.y=CMath.Min(this.min.y,_vec.y);
	this.min.z=CMath.Min(this.min.z,_vec.z);
	
	this.max.x=CMath.Max(this.max.x,_vec.x);
	this.max.y=CMath.Max(this.max.y,_vec.y);
	this.max.z=CMath.Max(this.max.z,_vec.z);
}
CBound.prototype.InitSphere=function(_val)
{
	this.boundType=DfBound.Circle;
	this.min.x=-_val;
	this.min.y=-_val;
	this.min.z=-_val;
	
	this.max.x=_val;
	this.max.y=_val;
	this.max.z=_val;
}
//CBound.prototype.Set_Line=function(_val)
//{
//	this.boundType="Line";
//	this.max=this.min=_val;
//}
CBound.prototype.GetInRadius=function()
{
	var maxX = this.min.x > 0 ? (this.max.x - this.min.x)*0.5 : (this.max.x + CMath.Abs(this.min.x))*0.5;
	var maxY = this.min.y > 0 ? (this.max.y - this.min.y)*0.5 : (this.max.y + CMath.Abs(this.min.y))*0.5;
	var maxZ = this.min.z > 0 ? (this.max.z - this.min.z)*0.5 : (this.max.z + CMath.Abs(this.min.z))*0.5;

	return CMath.Max(CMath.Max(maxX, maxY), maxZ);
}
CBound.prototype.GetOutRadius=function()
{
	var ra=this.GetInRadius();
	if (this.boundType == DfBound.Circle)
		return ra;
	return CMath.Vec3Lenght(new CVec3(ra, ra, ra));
}
CBound.prototype.GetCenterPos=function()
{
	var L_cen=new CVec3();

	if (this.max.x < 0 || this.min.x > 0)
		L_cen.x = (this.max.x - this.min.x)*0.5;
	else
		L_cen.x = (this.max.x + this.min.x);

	if (this.max.y < 0 || this.min.y > 0)
		L_cen.y = (this.max.y - this.min.y)*0.5;
	else
		L_cen.y = (this.max.y + this.min.y);

	if (this.max.z < 0 || this.min.z > 0)
		L_cen.z = (this.max.z - this.min.z)*0.5;
	else
		L_cen.z = (this.max.z + this.min.z);

	return L_cen;
}
CBound.prototype.GetRadiusLen=function()
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
CBound.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.boundType);
	pac.Push(this.min);
	pac.Push(this.max);
	return pac;
}
CBound.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	this.boundType = pac.GetInt32(0);
	pac.GetISerialize(1, this.min);
	pac.GetISerialize(2, this.max);
}
CBound.prototype.Json=function(_obj)
{
	this.boundType = _obj.boundType;
	this.min.Json(_obj.min);
	this.max.Json(_obj.max);
}
CBound.prototype.toCopy=function()
{
	var dummy=new CBound();
	dummy.min = this.min.toCopy();
	dummy.max = this.max.toCopy();
	return dummy;
}
CBound.prototype.XSize=function()
{
	return this.max.x + CMath.Abs(this.min.x);
}
CBound.prototype.YSize=function()
{
	return this.max.x + CMath.Abs(this.min.x);
}