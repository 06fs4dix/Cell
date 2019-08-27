function CVec2(_x,_y,_z) 
{
	this.x = typeof _x !== 'undefined' ? _x : 0.0;
	this.y = typeof _y !== 'undefined' ? _y : 0.0;
}
CVec2.prototype=new ISerialize();
CVec2.prototype.constructor	=CVec2;

CVec2.prototype.Float32Array=function()
{
	var dum=new Float32Array(2);
	dum[0]=this.x;
	dum[1]=this.y;
	return dum;
}
CVec2.prototype.toCopy=function()
{
	return new CVec3(this.x,this.y);
}
CVec2.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.x);
	pac.Push(this.y);
	return pac;
}
CVec2.prototype.Deserialize=function(_str)
{
	var dummy=new CPacket();
	dummy.Deserialize(_str);
	this.x = dummy.GetFloat(0);
	this.y = dummy.GetFloat(1);
}

//=====================================

class CVec3 extends ISerialize
{
	constructor(_x,_y,_z) 
	{
		super();
		this.x = typeof _x !== 'undefined' ? _x : 0.0;
		this.y = typeof _y !== 'undefined' ? _y : 0.0;
		this.z = typeof _z !== 'undefined' ? _z : 0.0;    
	}

	ToPoint()
	{
		var x0=parseInt(this.x);
		var y0=parseInt(this.y);
		return {x:x0,y:y0};
	}
	StringToVec3(_str)
	{
		var arrs=_str.split(",");
		this.x=Number(arrs[0]);
		this.y=Number(arrs[1]);
		this.z=Number(arrs[2]);
	}
	IsZero()
	{
		if(this.x==0 && this.y==0 && this.z==0)
			return true;
		
		return false;
	}
	toCopy()
	{
		return new CVec3(this.x,this.y,this.z);
	}

	equals(_target)
	{
		if(this.x==_target.x && this.y==_target.y && this.z==_target.z)
			return true;
		
		return false;
	}
	Serialize()
	{
		var pac=new CPacket();
		pac.Push(this.x);
		pac.Push(this.y);
		pac.Push(this.z);
		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		this.x = pac.GetFloat(0);
		this.y = pac.GetFloat(1);
		this.z = pac.GetFloat(2);
	}
	Float32Array()
	{
		var dum=new Float32Array(3);
		dum[0]=this.x;
		dum[1]=this.y;
		dum[2]=this.z;
		return dum;
	}
	Json(_obj)
	{
		this.x = _obj.x;
		this.y = _obj.y;
		this.z = _obj.z;
	}
	static GetLeft2D()
	{
		return new CVec3(-1, 0);
	}
	static GetRight2D()
	{
		return new CVec3(1, 0);
	}
	static GetUp2D()
	{
		return new CVec3(0, -1);
	}
	static GetDown2D()
	{
		return new CVec3(0, 1);
	}
	static SetLeft3D(_vec)
	{
		g_left3d = _vec;
	}
	static SetRight3D(_vec)
	{
		g_right3d = _vec;
	}
	static SetUp3D(_vec)
	{
		g_up3d = _vec;
	}
	static SetDown3D(_vec)
	{
		g_down3d = _vec;
	}

	static GetLeft3D() { return g_left3d; }
	static GetRight3D() { return g_right3d; }
	static GetUp3D() { return g_up3d; }
	static GetDown3D() { return g_down3d; }
};
var g_left3d=new CVec3(0, 0, -1);
var g_right3d=new CVec3(0, 0, 1);
var g_up3d=new CVec3(-1, 0, 0);
var g_down3d=new CVec3(1, 0, 0);
//=====================================
function CVec4(_x,_y,_z,_w) 
{
	this.x = typeof _x !== 'undefined' ? _x : 0.0;
	this.y = typeof _y !== 'undefined' ? _y : 0.0;
	this.z = typeof _z !== 'undefined' ? _z : 0.0;    
	this.w = typeof _w !== 'undefined' ? _w : 1.0;
}
CVec4.prototype=new ISerialize();
CVec4.prototype.constructor	=CVec3;
CVec4.prototype.Float32Array=function()
{
	var dum=new Float32Array(4);
	dum[0]=this.x;
	dum[1]=this.y;
	dum[2]=this.z;
	dum[3]=this.w;
	return dum;
}
CVec4.prototype.SetXYZ=function(_vec3)
{
	this.x = _vec3.x;
	this.y = _vec3.y;
	this.z = _vec3.z;
}
CVec4.prototype.toCopy=function()
{
	return new CVec4(this.x,this.y,this.z,this.w);
}
CVec4.prototype.GetNormal=function()
{
	return new CVec3(this.x,this.y,this.z);
}
CVec4.prototype.GetOff=function(_off)
{
	if (_off == 0)
		return this.x;
	else if (_off == 1)
		return this.y;
	else if (_off == 2)
		return this.z;
	return this.w;
}
CVec4.prototype.SetOff=function(_off,_value)
{
	if (_off == 0)
		this.x = _value;
	else if (_off == 1)
		this.y = _value;
	else if (_off == 2)
		this.z = _value;
	else 
		this.w = _value;
}
CVec4.prototype.IsZero=function()
{
	if(this.x==0 && this.y==0 && this.z==0 && this.w==0)
		return true;
	
	return false;
}
CVec4.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.x);
	pac.Push(this.y);
	pac.Push(this.z);
	pac.Push(this.w);
	return pac;
}
CVec4.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	this.x = pac.GetFloat(0);
	this.y = pac.GetFloat(1);
	this.z = pac.GetFloat(2);
	this.w = pac.GetFloat(3);
}
//==============================================================================
function CThreeVec3() 
{
	this.vecList=new Array();
	this.vecList.push(new CVec3());
	this.vecList.push(new CVec3());
	this.vecList.push(new CVec3());
}
CThreeVec3.prototype=new ISerialize();
CThreeVec3.prototype.constructor	=CThreeVec3;
CThreeVec3.prototype.GetDirect=function(){	return this.vecList[0].toCopy();	}
CThreeVec3.prototype.GetPosition=function(){	return this.vecList[1].toCopy();	}
CThreeVec3.prototype.GetOriginal=function(){	return this.vecList[2].toCopy();	}
CThreeVec3.prototype.GetVecList=function(){	return this.vecList;	}

CThreeVec3.prototype.SetDirect=function(_vec){	this.vecList[0]=_vec.toCopy();	}
CThreeVec3.prototype.SetPosition=function(_vec){	this.vecList[1]=_vec.toCopy();	}
CThreeVec3.prototype.SetOriginal=function(_vec){	this.vecList[2]=_vec.toCopy();	}
CThreeVec3.prototype.toCopy=function()
{
	var dummy=new CThreeVec3();
	for (var i = 0; i < 3; ++i)
		dummy.vecList[i] = this.vecList[i].toCopy();
	return dummy;
}

//==============================================================================
const d_PlaneNear=0;
const d_PlaneFar=1;
const d_PlaneTop=2;
const d_PlaneBottom=3;
const d_PlaneLeft=4;
const d_PlaneRight=5;
const d_PlaneCount=6;
const d_PlaneNull=7;

function JSDfPlane()
{
	this.Near = 0;
	this.Far = 1;
	this.Top = 2;
	this.Bottom = 3;
	this.Left = 4;
	this.Right = 5;
	this.Count = 6;
	this.Null = 7;
};
var DfPlane=new JSDfPlane();

function CSixVec4() 
{
	this.vecList=new Array();
	this.vecList.push(new CVec4());
	this.vecList.push(new CVec4());
	this.vecList.push(new CVec4());
	this.vecList.push(new CVec4());
	this.vecList.push(new CVec4());
	this.vecList.push(new CVec4());
}
CSixVec4.prototype=new ISerialize();
CSixVec4.prototype.constructor	=CThreeVec3;
CSixVec4.prototype.GetNear=function(){	return this.vecList[d_PlaneNear];	}
CSixVec4.prototype.GetFar=function(){	return this.vecList[d_PlaneFar];	}
CSixVec4.prototype.GetTop=function(){	return this.vecList[d_PlaneTop];	}
CSixVec4.prototype.GetBottom=function(){	return this.vecList[d_PlaneBottom];	}
CSixVec4.prototype.GetLeft=function(){	return this.vecList[d_PlaneLeft];	}
CSixVec4.prototype.GetRight=function(){	return this.vecList[d_PlaneRight];	}

CSixVec4.prototype.SetNear=function(_vec){	this.vecList[d_PlaneNear]=_vec;	}
CSixVec4.prototype.SetFar=function(_vec){	this.vecList[d_PlaneFar]=_vec;	}
CSixVec4.prototype.SetTop=function(_vec){	this.vecList[d_PlaneTop]=_vec;	}
CSixVec4.prototype.SetBottom=function(_vec){	this.vecList[d_PlaneBottom]=_vec;	}
CSixVec4.prototype.SetLeft=function(_vec){	this.vecList[d_PlaneLeft]=_vec;	}
CSixVec4.prototype.SetRight=function(_vec){	this.vecList[d_PlaneRight]=_vec;	}




