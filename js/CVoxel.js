class JSDfV
{
	constructor()
	{
		this.AtomCount = 16;
		this.AtomSize = 100;


		this.TexNull = 0;
		this.TexLight = 1;
		this.TexCobbleBlood = 2;
		this.TexDirt = 3;
		this.TexSand = 4;
		this.TexVines = 5;
		this.TexIce = 6;
		this.TexLava = 7;
		this.TexPad = 8;
		this.TexGress = 9;
		this.TexRedDirt = 10;
		this.TexWood = 11;
		this.TexBlock = 12;
		this.TexSnow = 13;
		this.TexWater = 14;
		this.TexPosion = 15;
		this.TexBadak = 16;

		this.TexXCount = 4;
		this.TexYCount = 4;



		this.DNull = -1;
		this.DFront = 0;
		this.DBack = 1;
		this.DLeft = 2;
		this.DRight = 3;
		this.DDown = 4;
		this.DUp = 5;
		this.DCount = 6;

		this.LightRangeMax=16;
		this.LightRangeDefault=0.2;

		this.DFrontVec=new CVec3(0, 0, -1);
		this.DBackVec=new CVec3(0, 0, 1);
		this.DLeftVec=new CVec3(-1, 0, 0);
		this.DRightVec=new CVec3(1, 0, 0);
		this.DDownVec=new CVec3(0, -1, 0);
		this.DUpVec=new CVec3(0, 1, 0);


		this.MapX = 8;
		this.MapY = 2;
		this.MapZ = 8;
		this.Local = false;
		this.ShowCellCount = 1;
	}
}
this.DfV=new JSDfV();


function CVIndex(_xOff,_y,_z)
{
	if(typeof _xOff == 'undefined')
	{
		this.x=0;
		this.y=0;
		this.z=0;
	}
	else if(typeof _y == 'undefined')
	{
		this.x = parseInt(_xOff % DfV.MapX);
		var dum = parseInt(_xOff / DfV.MapX);
		this.z = parseInt(dum % DfV.MapZ);
		this.y = parseInt(dum / DfV.MapZ);
	}
	else
	{
		this.x=_xOff;
		this.y=_y;
		this.z=_z;
	}
};
CVIndex.prototype=new ISerialize();
CVIndex.prototype.constructor	=CVIndex;
CVIndex.prototype.equals=function(_index)
{
	return this.x == _index.x && this.y == _index.y && this.z == _index.z;
}
CVIndex.prototype.GetMapOffset=function()
{
	return this.x + this.z * DfV.MapX + this.y * DfV.MapX*DfV.MapZ;
}
CVIndex.prototype.toCopy=function()
{
	var dum=new CVIndex();
	dum.x = this.x;
	dum.y = this.y;
	dum.z = this.z;
	return dum;
}
CVIndex.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.x);
	pac.Push(this.y);
	pac.Push(this.z);
	return pac;
}
CVIndex.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	this.x = pac.GetInt32(0);
	this.y = pac.GetInt32(1);
	this.z = pac.GetInt32(2);
}
CVIndex.prototype.Json=function(_obj)
{
	this.x = _obj.x;
	this.y = _obj.y;
	this.z = _obj.z;
}
//==================================================================
function CVPick()
{
	this.mi=new CVIndex();
	this.ai=new CVIndex();
	this.dir=-1;
	this.value=0;
	this.option=-1;
}
CVPick.prototype=new ISerialize();
CVPick.prototype.constructor	=CVPick;
CVPick.prototype.DirToAi=function()
{
	if (DfV.DNull == this.dir)
		return true;
	switch (this.dir)
	{
	case DfV.DFront:
		if (this.ai.z - 1 < 0)
		{
			if (this.mi.z - 1 >= 0)
			{
				this.mi.z -= 1;
				this.ai.z = DfV.AtomCount - 1;
			}
			else
				return false;
		}
		else
			this.ai.z -= 1;
		break;
	case DfV.DBack:
		if (this.ai.z + 1 >= DfV.AtomCount)
		{
			if (this.mi.z + 1 < DfV.MapZ)
			{
				this.mi.z += 1;
				this.ai.z = 0;
			}
			else
				return false;
		}
		else
			this.ai.z += 1;
		break;
	case DfV.DLeft:
		if (this.ai.x - 1 < 0)
		{
			if (this.mi.x - 1 >= 0)
			{
				this.mi.x -= 1;
				this.ai.x = DfV.AtomCount - 1;
			}
			else
				return false;
		}
		else
			this.ai.x -= 1;
		break;
	case DfV.DRight:
		if (this.ai.x + 1 >= DfV.AtomCount)
		{
			if (this.mi.x + 1 < DfV.MapX)
			{
				this.mi.x += 1;
				this.ai.x = 0;
			}
			else
				return false;
		}
		else
			this.ai.x += 1;
		break;
	case DfV.DDown:
		if (this.ai.y - 1 < 0)
		{
			if (this.mi.y - 1 >= 0)
			{
				this.mi.y -= 1;
				this.ai.y = DfV.AtomCount - 1;
			}
			else
				return false;
		}
		else
			this.ai.y -= 1;
		break;
	case DfV.DUp:
		if (this.ai.y + 1 >= DfV.AtomCount)
		{
			if (this.mi.y + 1 < DfV.MapY)
			{
				this.mi.y += 1;
				this.ai.y = 0;
			}
			else
				return false;
		}
		else
			this.ai.y += 1;
		break;
	}
	this.dir = DfV.DNull;
	return true;
}
CVPick.prototype.equals=function(_pick)
{
	if (this.mi.equals(_pick.mi) && this.ai.equals(_pick.ai) && this.dir == _pick.dir)
		return true;
	return false;
}
CVPick.prototype.GetPos=function()
{
	return new CVec3(this.mi.x*DfV.AtomCount*DfV.AtomSize + this.ai.x*DfV.AtomSize + DfV.AtomSize * 0.5,
			this.mi.y*DfV.AtomCount*DfV.AtomSize + this.ai.y*DfV.AtomSize + DfV.AtomSize * 0.5,
			this.mi.z*DfV.AtomCount*DfV.AtomSize + this.ai.z*DfV.AtomSize + DfV.AtomSize * 0.5);
}
CVPick.prototype.SetPos=function(_pos)
{
	this.mi.x = parseInt((_pos.x) / DfV.AtomSize / DfV.AtomCount);
	this.mi.y = parseInt((_pos.y) / DfV.AtomSize / DfV.AtomCount);
	this.mi.z = parseInt((_pos.z) / DfV.AtomSize / DfV.AtomCount);

	var ax = parseInt(_pos.x - (this.mi.x* DfV.AtomSize*DfV.AtomCount));
	var ay = parseInt(_pos.y - (this.mi.y* DfV.AtomSize*DfV.AtomCount));
	var az = parseInt(_pos.z - (this.mi.z* DfV.AtomSize*DfV.AtomCount));

	this.ai.x = parseInt(ax / DfV.AtomSize);
	this.ai.y = parseInt(ay / DfV.AtomSize);
	this.ai.z = parseInt(az / DfV.AtomSize);
}
CVPick.prototype.toCopy=function()
{
	var dummy=new CVPick();
	dummy.ai = this.ai.toCopy();
	dummy.mi = this.mi.toCopy();
	dummy.dir = this.dir;
	dummy.option = this.option;
	dummy.value = this.value;
	return dummy;
}
CVPick.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.mi);
	pac.Push(this.ai);
	pac.Push(this.dir);
	pac.Push(this.value);
	pac.Push(this.option);
	return pac;
}
CVPick.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	pac.GetISerialize(0, this.mi);
	pac.GetISerialize(1, this.ai);
	this.dir = pac.GetInt32(2);
	this.value = pac.GetInt32(3);
	this.option = pac.GetInt32(4);
}
//======================================================================================
function CVLightData(_key,_mi,_ai,_range,_tGlobalfLocal)
{
	if(typeof _mi == 'undefined')
	{
		this.key="";
		this.mi = new CVIndex();
		this.ai = new CVIndex();
		this.range = 0;
		this.global = false;
	}
	else
	{
		this.key=_key;
		this.mi = _mi;
		this.ai = _ai;
		this.range = _range;
		this.global = _tGlobalfLocal;
	}
	
}
CVLightData.prototype=new ISerialize();
CVLightData.prototype.constructor	=CVLightData;
CVLightData.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.key);
	pac.Push(this.mi);
	pac.Push(this.ai);
	pac.Push(this.range);
	pac.Push(this.global);
	return pac;
}
CVLightData.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	this.key=pac.GetString(0);
	pac.GetISerialize(1, this.mi);
	pac.GetISerialize(2, this.ai);
	this.range = pac.GetInt32(3);
	this.global = pac.GetBool(4);
}
CVLightData.prototype.Json=function(_obj)
{
	this.key=_obj.key;
	this.mi.Json(_obj.mi);
	this.ai.Json(_obj.ai);
	
	this.range = _obj.range;
	this.global = _obj.global;
}
//======================================================================================
function CVLightPlane()
{
	this.data = new Array();
}
CVLightPlane.prototype=new ISerialize();
CVLightPlane.prototype.constructor	=CVLightPlane;
CVLightPlane.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.data);
	return pac;
}
CVLightPlane.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	var pacV=new CPacket();
	pacV.Deserialize(pac.value[0]);
	for (var i = 0; i < pacV.value.size(); ++i)
	{
		var lv=new CVLightData();
		lv.Deserialize(pacV.value[i]);
		this.data.push_back(lv);
	}
}
CVLightPlane.prototype.Json=function(_obj)
{
	
	for (var i = 0; i < _obj.data.size(); ++i)
	{
		var lv=new CVLightData();
		lv.Json(_obj.data[i]);
		this.data.push_back(lv);
	}
}
//======================================================================================
var g_off=0;

function CAtom()
{
	this.m_offset = g_off++;
	this.m_tex = DfV.TexNull;
	this.m_light=[new CVLightPlane(),new CVLightPlane(),
		new CVLightPlane(),new CVLightPlane(),
		new CVLightPlane(),new CVLightPlane()];
}
CAtom.prototype=new ISerialize();
CAtom.prototype.constructor	=CAtom;

CAtom.prototype.PushLight=function(_data,_dir)
{
	for (var i=0;i< this.m_light[_dir].data.size();++i)
	{
		if (this.m_light[_dir].data[i].key.equals(_data.key))
		{
			if (_data.range > this.m_light[_dir].data[i].range)
			{
				this.m_light[_dir].data[i].range = _data.range;
			}
			return;
		}

	}
	this.m_light[_dir].data.push_back(_data);
}

CAtom.prototype.RemoveLight=function(_key)
{
	for (var i = 0; i < 6; ++i)
	{
		for (var j = 0; j < this.m_light[i].data.size(); ++j)
		{
			if (this.m_light[i].data[j].key.equals(_key))
			{
				this.m_light[i].data.splice(j,1);
				return;
			}
		}
	}
}
var g_global=1.0;
CAtom.prototype.GetLightRange=function(_dir)
{
	var range = 0;
	var global = 0;
	for (var i=0;i< this.m_light[_dir].data.size();++i)
	{
		if (this.m_light[_dir].data[i].global)
			global += this.m_light[_dir].data[i].range*g_global;
		else
			range += this.m_light[_dir].data[i].range;
	}
	range += global;
	range /= DfV.LightRangeMax;
	if (range > 1.0)
		range = 1.0;
	if (range < 0.2)
		range = 0.2;
	return range;
}
CAtom.prototype.Serialize=function()
{
	var pac=new CPacket();
	pac.Push(this.m_tex);
	for(var i=0;i<6;++i)
		pac.Push(this.m_light[i]);
	return pac;
}
CAtom.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	this.m_tex = pac.GetInt32(0);
	for (var i = 0; i < 6; ++i)
		pac.GetISerialize(1+i, this.m_light[i]);
}
CAtom.prototype.Json=function(_obj)
{

	this.m_tex = _obj.m_tex;
	for (var i = 0; i < 6; ++i)
		this.m_light[i].Json(_obj.m_light[i]);
}
//=================================================================================
//var g_vVer=new Array(DfV.AtomCount*DfV.AtomCount*DfV.AtomCount * 36);
//var g_vUv=new Array(DfV.AtomCount*DfV.AtomCount*DfV.AtomCount * 36);
//var g_vNor=new Array(DfV.AtomCount*DfV.AtomCount*DfV.AtomCount * 36);

var g_vVer=new CFloatArray();
var g_vUv=new CFloatArray();;
var g_vNor=new CFloatArray();;

g_vVer.Resize(DfV.AtomCount*DfV.AtomCount*DfV.AtomCount * 36 * 3);
g_vUv.Resize(DfV.AtomCount*DfV.AtomCount*DfV.AtomCount * 36 * 2);
g_vNor.Resize(DfV.AtomCount*DfV.AtomCount*DfV.AtomCount * 36 * 4);


class CMolecule extends CRenObj
{
	constructor()
	{
		super();
		this.m_mat=new CMat();
		this.m_bound=new CBound();
		this.m_index=new CVIndex();
		this.m_meshData=new CMeshData();
		this.m_atom=new Array(DfV.AtomCount);
		
		for(var i=0;i<DfV.AtomCount;++i)
		{
			this.m_atom[i]=new Array(DfV.AtomCount);
			for(var j=0;j<DfV.AtomCount;++j)
			{
				this.m_atom[i][j]=new Array(DfV.AtomCount);
				for(var k=0;k<DfV.AtomCount;++k)
				{
					this.m_atom[i][j][k]=new CAtom();
				}
			}
		}
	}
	
	Render(_cam)
	{
		CWindow.RMgr().SetValue(CPalette.GetVfVoxel(), "worldMat", this.m_mat);
		CWindow.RMgr().VDrawMeshData(CPalette.GetVfVoxel(), this.m_meshData);
	}
	AtomUpdate()
	{

		var min=new CVec3();
		var max=new CVec3();
		var oth = 0.6;
		var j = 0;
		for (var z = 0; z < DfV.AtomCount; ++z)
		{
			for (var y = 0; y < DfV.AtomCount; ++y)
			{
				for (var x = 0; x < DfV.AtomCount; ++x)
				{

					if (this.m_atom[z][y][x].m_tex == DfV.TexNull)
						continue;

					if (z==1 && y==0 && x==0)
					{
						var u = CCellTex.GetU(this.m_atom[z][y][x].m_tex);
					}
					
					if (x - 1 >= 0 && x + 1 < DfV.AtomCount && y - 1 >= 0 &&
						y + 1 < DfV.AtomCount && z - 1 >= 0 && z + 1 < DfV.AtomCount)
					{
						if (this.m_atom[z - 1][y][x].m_tex != 0 && this.m_atom[z + 1][y][x].m_tex != 0 &&
								this.m_atom[z][y - 1][x].m_tex != 0 && this.m_atom[z][y + 1][x].m_tex != 0 &&
								this.m_atom[z][y][x - 1].m_tex != 0 && this.m_atom[z][y][x + 1].m_tex != 0)
						{
							continue;
						}
					}
					
					var u = CCellTex.GetU(this.m_atom[z][y][x].m_tex);
					var v = CCellTex.GetV(this.m_atom[z][y][x].m_tex);
					
					//this.m_atom[z][y][x].m_pos =new CVIndex(x, y, z);
					for (var i = 0; i < 36; ++i)
					{
						g_vNor.V4(i + j,0, 1, 0, 0.2);
					}
						

					var xp = x * DfV.AtomSize;
					var yp = y * DfV.AtomSize;
					var zp = z * DfV.AtomSize;
					var g = 0;
					min.x=0 + xp;min.y=0 + yp;min.z=0 + zp;
					max.x=DfV.AtomSize + xp;max.y=DfV.AtomSize + yp;max.z=DfV.AtomSize + zp;
					
					//var minN=new CVec3(-DfV.AtomSize, -DfV.AtomSize, -DfV.AtomSize);
					//var maxN=new CVec3(DfV.AtomSize, DfV.AtomSize, DfV.AtomSize);

					//왼쪽

					//if (z - 1 >= 0 && this.m_atom[z - 1][y][x].m_tex == 0)
					{
						g_vVer.V3(g + 0 + j,min.x, min.y, min.z);
						g_vVer.V3(g + 1 + j,max.x, max.y, min.z);
						g_vVer.V3(g + 2 + j,max.x, min.y, min.z);

						g_vVer.V3(g + 3 + j,max.x, max.y, min.z);
						g_vVer.V3(g + 4 + j,min.x, min.y, min.z);
						g_vVer.V3(g + 5 + j,min.x, max.y, min.z);

						g_vUv.V2(g + 0 + j,u.x, v.y);
						g_vUv.V2(g + 1 + j,u.y, v.x);
						g_vUv.V2(g + 2 + j,u.y, v.y);

						g_vUv.V2(g + 3 + j,u.y, v.x);
						g_vUv.V2(g + 4 + j,u.x, v.y);
						g_vUv.V2(g + 5 + j,u.x, v.x);

						g_vNor.X4(g + 0 + j,oth);
						g_vNor.X4(g + 1 + j,oth);
						g_vNor.X4(g + 2 + j, oth);
						g_vNor.X4(g + 3 + j, oth);
						g_vNor.X4(g + 4 + j, oth);
						g_vNor.X4(g + 5 + j, oth);
						for (var i = g; i <= 5 + g; ++i)
						{

							g_vNor.W4(i + j,this.m_atom[z][y][x].GetLightRange(DfV.DFront));
						}

						g += 6;
					}





					//밑
					g_vVer.V3(g + 0 + j, min.x, min.y, min.z);
					g_vVer.V3(g + 1 + j, max.x, min.y, min.z);
					g_vVer.V3(g + 2 + j, max.x, min.y, max.z);

					g_vVer.V3(g + 3 + j, max.x, min.y, max.z);
					g_vVer.V3(g + 4 + j, min.x, min.y, max.z);
					g_vVer.V3(g + 5 + j, min.x, min.y, min.z);

					g_vUv.V2(g + 0 + j, u.x, v.x);
					g_vUv.V2(g + 1 + j, u.x, v.y);
					g_vUv.V2(g + 2 + j, u.y, v.y);

					g_vUv.V2(g + 3 + j, u.y, v.y);
					g_vUv.V2(g + 4 + j, u.y, v.x);
					g_vUv.V2(g + 5 + j, u.x, v.x);
					
					g_vNor.X4(g + 0 + j, oth);
					g_vNor.X4(g + 1 + j, oth);
					g_vNor.X4(g + 2 + j, oth);
					g_vNor.X4(g + 3 + j, oth);
					g_vNor.X4(g + 4 + j, oth);
					g_vNor.X4(g + 5 + j, oth);

					for (var i = g; i <= 5 + g; ++i)
						g_vNor.W4(i + j, this.m_atom[z][y][x].GetLightRange(DfV.DDown));
					g += 6;

					//윗
					g_vVer.V3(g + 0 + j, min.x, max.y, min.z);
					g_vVer.V3(g + 1 + j, max.x, max.y, max.z);
					g_vVer.V3(g + 2 + j, max.x, max.y, min.z);

					g_vVer.V3(g + 3 + j, max.x, max.y, max.z);
					g_vVer.V3(g + 4 + j, min.x, max.y, min.z);
					g_vVer.V3(g + 5 + j, min.x, max.y, max.z);

					g_vUv.V2(g + 0 + j, u.x, v.x);
					g_vUv.V2(g + 1 + j, u.y, v.y);
					g_vUv.V2(g + 2 + j, u.x, v.y);

					g_vUv.V2(g + 3 + j, u.y, v.y);
					g_vUv.V2(g + 4 + j, u.x, v.x);
					g_vUv.V2(g + 5 + j, u.y, v.x);


					g_vNor.X4(g + 0 + j, 1);
					g_vNor.X4(g + 1 + j, 1);
					g_vNor.X4(g + 2 + j, 1);
					g_vNor.X4(g + 3 + j, 1);
					g_vNor.X4(g + 4 + j, 1);
					g_vNor.X4(g + 5 + j, 1);

					for (var i = g; i <= 5 + g; ++i)
						g_vNor.W4(i + j, this.m_atom[z][y][x].GetLightRange(DfV.DUp));
					g += 6;

					//오른쪽
					//if (z + 1 < DfV.AtomCount && this.m_atom[z + 1][y][x].m_tex == 0)
					{
						g_vVer.V3(g + 0 + j, min.x, min.y, max.z);
						g_vVer.V3(g + 1 + j, max.x, min.y, max.z);
						g_vVer.V3(g + 2 + j, max.x, max.y, max.z);

						g_vVer.V3(g + 3 + j, max.x, max.y, max.z);
						g_vVer.V3(g + 4 + j, min.x, max.y, max.z);
						g_vVer.V3(g + 5 + j, min.x, min.y, max.z);

						g_vUv.V2(g + 0 + j, u.y, v.y);
						g_vUv.V2(g + 1 + j, u.x, v.y);
						g_vUv.V2(g + 2 + j, u.x, v.x);

						g_vUv.V2(g + 3 + j, u.x, v.x);
						g_vUv.V2(g + 4 + j, u.y, v.x);
						g_vUv.V2(g + 5 + j, u.y, v.y);

						g_vNor.X4(g + 0 + j, oth);
						g_vNor.X4(g + 1 + j, oth);
						g_vNor.X4(g + 2 + j, oth);
						g_vNor.X4(g + 3 + j, oth);
						g_vNor.X4(g + 4 + j, oth);
						g_vNor.X4(g + 5 + j, oth);

						for (var i = g; i <= 5 + g; ++i)
							g_vNor.W4(i + j, this.m_atom[z][y][x].GetLightRange(DfV.DBack));
						g += 6;
					}


					//앞
					//if (x - 1 >= 0 && this.m_atom[z][y][x-1].m_tex == 0)
					{
						g_vVer.V3(g + 0 + j, min.x, min.y, min.z);
						g_vVer.V3(g + 1 + j, min.x, min.y, max.z);
						g_vVer.V3(g + 2 + j, min.x, max.y, max.z);

						g_vVer.V3(g + 3 + j, min.x, max.y, max.z);
						g_vVer.V3(g + 4 + j, min.x, max.y, min.z);
						g_vVer.V3(g + 5 + j, min.x, min.y, min.z);


						g_vUv.V2(g + 0 + j, u.y, v.y);
						g_vUv.V2(g + 1 + j, u.x, v.y);
						g_vUv.V2(g + 2 + j, u.x, v.x);

						g_vUv.V2(g + 3 + j, u.x, v.x);
						g_vUv.V2(g + 4 + j, u.y, v.x);
						g_vUv.V2(g + 5 + j, u.y, v.y);

						g_vNor.X4(g + 0 + j, 1);
						g_vNor.X4(g + 1 + j, 1);
						g_vNor.X4(g + 2 + j, 1);
						g_vNor.X4(g + 3 + j, 1);
						g_vNor.X4(g + 4 + j, 1);
						g_vNor.X4(g + 5 + j, 1);

						for (var i = g; i <= 5 + g; ++i)
							g_vNor.W4(i + j, this.m_atom[z][y][x].GetLightRange(DfV.DLeft));
						g += 6;
					}

					//뒤
					//if (x + 1 < DfV.AtomCount && this.m_atom[z][y][x+1].m_tex == 0)
					{
						g_vVer.V3(g + 0 + j, max.x, min.y, min.z);
						g_vVer.V3(g + 1 + j, max.x, max.y, max.z);
						g_vVer.V3(g + 2 + j, max.x, min.y, max.z);

						g_vVer.V3(g + 3 + j, max.x, max.y, max.z);
						g_vVer.V3(g + 4 + j, max.x, min.y, min.z);
						g_vVer.V3(g + 5 + j, max.x, max.y, min.z);



						g_vUv.V2(g + 0 + j, u.x, v.y);
						g_vUv.V2(g + 1 + j, u.y, v.x);
						g_vUv.V2(g + 2 + j, u.y, v.y);


						g_vUv.V2(g + 3 + j, u.y, v.x);
						g_vUv.V2(g + 4 + j, u.x, v.y);
						g_vUv.V2(g + 5 + j, u.x, v.x);

						g_vNor.X4(g + 0 + j, 1);
						g_vNor.X4(g + 1 + j, 1);
						g_vNor.X4(g + 2 + j, 1);
						g_vNor.X4(g + 3 + j, 1);
						g_vNor.X4(g + 4 + j, 1);
						g_vNor.X4(g + 5 + j, 1);

						for (var i = g; i <= 5 + g; ++i)
							g_vNor.W4(i + j, this.m_atom[z][y][x].GetLightRange(DfV.DRight));
						g += 6;
					}
					
					j += g;

				}
			}
		}
		var cType = 1;
		if (this.m_meshData.vNum != 0)
			cType = 2;
		if (j == 0)
		{
			this.m_meshData.vNum = j;
		}
		else
		{
			CWindow.MMgr().MeshCreateModify(this.m_meshData, CPalette.GetVfVoxel(), j, 0, g_vVer, g_vUv,
					null, null, null, null, g_vNor, null, null, null, cType);
		}
		
		
	}
	AllGround()
	{
		for (var z = 0; z < DfV.AtomCount; ++z)
		{
			for (var x = 0; x < DfV.AtomCount; ++x)
			{
				for (var y = 0; y < DfV.AtomCount; ++y)
				{
					
					this.m_atom[z][y][x].m_tex = DfV.TexCobbleBlood;
				
				}
			}
		}
	}
	Serialize()
	{
		var pac=new CPacket();
		//pac.Push(m_offset);
		pac.Push(this.m_mat);
		pac.Push(this.m_bound);
		pac.Push(this.m_index);
		for (var z = 0; z < DfV.AtomCount; ++z)
		{
			for (var y = 0; y < DfV.AtomCount; ++y)
			{
				for (var x = 0; x < DfV.AtomCount; ++x)
				{
					pac.Push(this.m_atom[z][y][x]);
				}
			}
		}
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		//this.m_offset = pac.GetInt32(0);
		pac.GetISerialize(0, this.m_mat);
		pac.GetISerialize(1, this.m_bound);
		pac.GetISerialize(2, this.m_index);
		for (var z = 0; z < DfV.AtomCount; ++z)
		{
			for (var y = 0; y < DfV.AtomCount; ++y)
			{
				for (var x = 0; x < DfV.AtomCount; ++x)
				{
					pac.GetISerialize(3+x+y*DfV.AtomCount+z* DfV.AtomCount*DfV.AtomCount, this.m_atom[z][y][x]);
				}
			}
		}
		
	}
	Json(_obj)
	{
		this.m_mat.Json(_obj.m_mat);
		this.m_bound.Json(_obj.m_bound);
		this.m_index.Json(_obj.m_index);
		
		
		for (var z = 0; z < DfV.AtomCount; ++z)
		{
			for (var y = 0; y < DfV.AtomCount; ++y)
			{
				for (var x = 0; x < DfV.AtomCount; ++x)
				{
					 this.m_atom[z][y][x].Json(_obj.m_atom[z][y][x]);
				}
			}
		}
		
	}
	
}



//==================================================================================================
function CCell()
{
	this.m = null;
	this.m_updateList=new Array();
}

var CCellTex=function() 
{
}
CCellTex.GetU=function(_tex)
{
	_tex -= 1;
	var x = parseInt(_tex % DfV.TexXCount);
	var y = parseInt(_tex / DfV.TexYCount);
	var uvStX = x * (1 / DfV.TexXCount)+0.01;
	var uvEdX = uvStX+(1 / DfV.TexYCount)-0.02;
	return new CVec2(uvStX, uvEdX);
}
CCellTex.GetV=function(_tex)
{
	_tex -= 1;
	var x = parseInt(_tex % DfV.TexXCount);
	var y = parseInt(_tex / DfV.TexYCount);
	var uvStY = y * (1 / DfV.TexXCount)+0.01;
	var uvEdY = uvStY+(1 / DfV.TexYCount)-0.02;
	return new CVec2(uvStY, uvEdY);
}
//=================================================================================
class CVLight extends ISerialize
{	
	constructor()
	{
		super();
		this.key="";
		this.pos=new CVec3();
		this.power=0;
		this.global=false;//해냐0,일반이냐1
		this.shader=false;
		this.atomData=new Array();
	}
	
	toCopy()
	{
		var dummy=new CVLight();
		dummy.key = this.key;
		dummy.pos = this.pos.toCopy();
		dummy.power = this.power;
		dummy.global = this.global;
		dummy.shader=this.shader;
		return dummy;
	}
	Serialize()
	{
		var pac=new CPacket();
		pac.Push(this.key);
		pac.Push(this.pos);
		pac.Push(this.power);
		pac.Push(this.global);
		pac.Push(this.shader);
		pac.Push(this.atomData);
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		this.key = pac.GetString(0);
		pac.GetISerialize(1,this.pos);
		this.power = pac.GetFloat(2);
		this.global = pac.GetBool(3);
		this.shader = pac.GetBool(4);
		var pac2=new CPacket();
		pac2.Deserialize(pac.GetString(5));
		for (var each0 of pac2.value)
		{
			var ldata=new CVLightData();
			ldata.Deserialize(each0);
			this.atomData.push_back(ldata);
		}

	}
};
class CCanvasVoxel extends CCanvas
{
	constructor(_cam)
	{
		super(_cam);
		this.m_updateIndex=new CVIndex(0,0,0);
		this.m_map=new Array(DfV.MapX*DfV.MapY* DfV.MapZ);
		for(var i=0;i<DfV.MapX*DfV.MapY* DfV.MapZ;++i)
		{
			this.m_map[i]=new CCell();
		}
		this.m_updateList=new Array();
		this.m_ligVec=new Array();
		this.m_loadCount=0;
		this.m_pos=new CVec3();
		this.m_camMove=true;
		this.m_lightData=new Float32Array(3*40);
	}
	SetPos(_pos)
	{
		this.m_pos = _pos;
		this.m_camMove = false;
	}
	Init()
	{
		this.m_updateIndex=new CVIndex(0,0,0);
		//this.m_map=new Array(DfV.MapX*DfV.MapY* DfV.MapZ);
		this.m_updateList=new Array();
		
		this.m_cam.Init(new CVec3(1, 2000, 1),new CVec3(0, 1, 1));
		this.m_cam.Reset3D();
		

		this.PosInCellUpdate();
	}
	PosInCellUpdate()
	{
		
		var resetLight=new Array();
		this.m_obj.clear();

		for (var y = 0; y < DfV.MapY; ++y)
		{
			for (var z = this.m_updateIndex.z - DfV.ShowCellCount; z <= this.m_updateIndex.z + DfV.ShowCellCount; ++z)
			{
				for (var x = this.m_updateIndex.x - DfV.ShowCellCount; x <= this.m_updateIndex.x + DfV.ShowCellCount; ++x)
				{
					if (x < 0 || z < 0 || x >= DfV.MapX || z >= DfV.MapZ)
						continue;
					var cell = this.m_map[new CVIndex(x, y, z).GetMapOffset()];
					if (cell.m == null)
					{
						if (DfV.Local)
						{
							CMsg.E("web 미지원");
						}
						else
						{
							this.m_updateList.push_back(new CVIndex(x, y, z));
							this.m_loadCount++;
						}
							
						
					}
					else
					{
						this.Push(cell.m);
						this.LightResetVecCac(cell.m, resetLight,false);
					}
						
				}
			}
		}//for y
		var dummy=new Set();
		for (var each0 of resetLight)
		{
			this.RemoveLight(each0.key, dummy);
			this.PushLight(each0, dummy);
		}
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			var mo = each0;
			if(mo.m_meshData.vGBuf==null)
			{
				mo.AtomUpdate();
			}
				
			
		}
	}
	Update()
	{
		var ox, oy, oz;
		
		if (this.m_camMove)
		{
			ox = parseInt((this.m_cam.GetEye().x) / (DfV.AtomCount * DfV.AtomSize));
			oy = parseInt((this.m_cam.GetEye().y) / (DfV.AtomCount * DfV.AtomSize));
			oz = parseInt((this.m_cam.GetEye().z) / (DfV.AtomCount * DfV.AtomSize));
		}
		else
		{
			ox = parseInt((this.m_pos.x) / (DfV.AtomCount * DfV.AtomSize));
			oy = parseInt((this.m_pos.y) / (DfV.AtomCount * DfV.AtomSize));
			oz = parseInt((this.m_pos.z) / (DfV.AtomCount * DfV.AtomSize));
		}

		if (this.m_updateIndex.x != ox || this.m_updateIndex.z != oz)
		{
			this.m_updateIndex.x = ox;
			this.m_updateIndex.z = oz;
			this.PosInCellUpdate();
		}
		this.m_updateIndex.y = oy;
		
		var count = 0;
		for (var each0 of this.m_ligVec)
		{
			if (each0.shader)
			{
				this.m_lightData[count * 3 + 0] = each0.pos.x;
				this.m_lightData[count * 3 + 1] = each0.pos.y;
				this.m_lightData[count * 3 + 2] = each0.pos.z;
				count++;
				if (count > 40)
					break;
			}

		}
	}
	Render()
	{
		CWindow.RMgr().SetShader(CPalette.GetVfVoxel());
		CWindow.RMgr().SetValue(CPalette.GetVfVoxel(), "viewMat", this.m_cam.GetViewMat());
		CWindow.RMgr().SetValue(CPalette.GetVfVoxel(), "projectMat", this.m_cam.GetProjMat());
		CWindow.RMgr().SetValueFloat(CPalette.GetVfVoxel(), "lightData", this.m_lightData,3);
		//CWindow.RMgr().Light_Set(CPalette.GetVfVoxel());
		CWindow.RMgr().SetTexture(CPalette.GetVfVoxel(), CPalette.GetVoxelTex());

		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			each0.Render(this.m_cam);
		}
	}
	FindCMolecule(_index)
	{
		var off=_index.GetMapOffset();
		if (off > DfV.MapX*DfV.MapY* DfV.MapZ || off<0)
			return null;
		return this.m_map[off].m;
	}
	FindCAtom(_pick,_move)
	{
		if (_move && _pick.DirToAi() == false)
			return null;

		var mol = this.FindCMolecule(_pick.mi);
		if (mol == null)
			return null;
		return mol.m_atom[_pick.ai.z][_pick.ai.y][_pick.ai.x];
	}
	
	Collision(_pos,_radius)
	{
		var lpick=new CVPick();
		lpick.dir = DfV.DNull;
		//int RF_dir=DfV.DNull;
		var L_pickPos=new CVec3();
		//CVIndex mi, ai;
		var Lmin = d_MAX_FLOAT;
		for (var each0 of this.m_obj)
		{
			var each1 = each0[1];
			
			var ra = each1.m_bound.GetOutRadius();
			var mCen= each1.m_mat.GetPos();
			mCen.x += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.y += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.z += DfV.AtomCount * 0.5*DfV.AtomSize;

			if (CMath.ColSphereSphere(mCen, ra, _pos, _radius)!=-1)
			{


				
//				var mox = parseInt((_pos.x) / DfV.AtomSize) / DfV.AtomCount;
//				var moy = parseInt((_pos.y) / DfV.AtomSize) / DfV.AtomCount;
//				var moz = parseInt((_pos.z) / DfV.AtomSize) / DfV.AtomCount;
//
//
//				var ax =  parseInt(_pos.x - (mox* DfV.AtomSize*DfV.AtomCount));
//				var ay =  parseInt(_pos.y - (moy* DfV.AtomSize*DfV.AtomCount));
//				var az =  parseInt(_pos.z - (moz* DfV.AtomSize*DfV.AtomCount));
				
				var ax =  parseInt(_pos.x - (each1.m_index.x* DfV.AtomSize*DfV.AtomCount));
				var ay =  parseInt(_pos.y - (each1.m_index.y* DfV.AtomSize*DfV.AtomCount));
				var az =  parseInt(_pos.z - (each1.m_index.z* DfV.AtomSize*DfV.AtomCount));

				var axn = parseInt(ax / DfV.AtomSize);
				var ayn = parseInt(ay / DfV.AtomSize);
				var azn = parseInt(az / DfV.AtomSize);
				

				var tick=parseInt(_radius/ DfV.AtomSize)+1;
				for (var z = azn-tick; z <= azn+tick; ++z)
				{
					for (var y = ayn-tick; y <= ayn+tick; ++y)
					{
						for (var x = axn-tick; x <= axn+tick; ++x)
						{
							if(z<0 || y<0 || x<0 || x>=DfV.AtomCount || y>=DfV.AtomCount || z>=DfV.AtomCount)
								continue;
							if (each1.m_atom[z][y][x].m_tex == DfV.TexNull)
								continue;
							var xp = x * DfV.AtomSize;
							var yp = y * DfV.AtomSize;
							var zp = z * DfV.AtomSize;

							var bound=new CBound();
							bound.min = new CVec3(0 + xp, 0 + yp, 0 + zp);
							bound.max = new CVec3(DfV.AtomSize + xp, DfV.AtomSize + yp, DfV.AtomSize + zp);

				
							var L_cen=new CVec3();
							L_cen.x += DfV.AtomSize / 2.0 + DfV.AtomSize * x+each1.m_mat.GetPos().x;
							L_cen.y += DfV.AtomSize / 2.0 + DfV.AtomSize * y+each1.m_mat.GetPos().y;
							L_cen.z += DfV.AtomSize / 2.0 + DfV.AtomSize * z+each1.m_mat.GetPos().z;
							var len = CMath.ColSphereSphere(L_cen, bound.GetInRadius(), _pos, _radius);
							if (len != -1)
							{
								if (len < Lmin)
								{
									Lmin = len;
									lpick.mi = each1.m_index.toCopy();
									lpick.ai.x = x;
									lpick.ai.y = y;
									lpick.ai.z = z;
									lpick.dir = DfV.DCount;
									lpick.value = len;
								}

							}
						}
					}
				}
			}//d_VCount
		}//for
		return lpick;
	}
	GetGround(_pick)
	{
		var downPick = _pick.toCopy();

		//int range = DfV.LightRangeMax;
		
		for (var j = 0; j < DfV.MapY*DfV.AtomCount; ++j)
		{

			var at1 = this.FindCAtom(downPick, false);
			
			if (at1.m_tex != DfV.TexNull)
			{
				break;
			}
			downPick.dir = DfV.DDown;
			if (downPick.DirToAi() == false)
				break;

		}
		downPick.dir = DfV.DUp;
		downPick.DirToAi();
		return downPick;
	}
	SetAtomTex(_pick,_tex,_moleculeStep,_lightPass)
	{
		var pickOrg = _pick.toCopy();
		var moleculeStep=new Set();
		if (pickOrg.dir != -1)
			pickOrg.DirToAi();
		var resetLight=new Array();
		var atom = this.FindCAtom(pickOrg,false);
		_moleculeStep.insert(pickOrg.mi.GetMapOffset());

		atom.m_tex = _tex;
		if(typeof _lightPass == 'undefined' || _lightPass==true)
		{
			
		}
		else
			return;

		
		if (pickOrg.ai.x % 8 == 0 && pickOrg.ai.z % 8 == 0)
		{

			var dummy = pickOrg.toCopy();
			dummy.mi.y = DfV.MapY - 1;
			dummy.ai.y = DfV.AtomCount - 1;
			dummy = this.GetGround(dummy);
			var lig = this.FindLight("g" + pickOrg.mi.z + "/" + pickOrg.mi.x + "a" + pickOrg.ai.z + "/" + pickOrg.ai.x);
			lig.pos = dummy.GetPos();
			
			//var lig2 = this.FindLight("g" + pickOrg.mi.z + "/" + pickOrg.mi.x + "a" + pickOrg.ai.z + "/" + pickOrg.ai.x);
			_moleculeStep.insert(pickOrg.mi.GetMapOffset());
			_moleculeStep.insert(dummy.mi.GetMapOffset());
		}



		for (var each0 of this.m_ligVec)
		{
			var len = CMath.Vec3Lenght(CMath.Vec3MinusVec3(pickOrg.GetPos(), each0.pos));
			if (len <= each0.power*DfV.AtomSize)
			{
				resetLight.push_back(each0);
				resetLight.back().atomData.clear();
			}

		}
		
		
		for (var each0 of resetLight)
		{
			this.RemoveLight(each0.key, _moleculeStep);
			this.PushLight(each0, _moleculeStep);
		}
		
		return true;
	}
	Pick(_ray)
	{
		var bound=new CBound();
		var L_cen=new CVec3();
		
		var lpick=new CVPick();
		lpick.dir = DfV.DNull;
		//int RF_dir=DfV.DNull;
		var L_pickPos=new CVec3();
		//CVIndex mi, ai;
		var Lmin = d_MAX_FLOAT;
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			var each1 = each0;
			var lray = _ray.toCopy();
			var L_inM = CMath.MatInvert(each1.m_mat);

			lray.SetDirect(CMath.MatToVec3Normal(lray.GetDirect(), L_inM));
			lray.SetOriginal(CMath.MatToVec3Coordinate(lray.GetOriginal(), L_inM));


			if (CMath.RayBoxIS(each1.m_bound.min, each1.m_bound.max, lray))
			{

				for (var z = 0; z < DfV.AtomCount; ++z)
				{
					for (var y = 0; y < DfV.AtomCount; ++y)
					{
						for (var x = 0; x < DfV.AtomCount; ++x)
						{
							if (each1.m_atom[z][y][x].m_tex == DfV.TexNull)
								continue;
							var xp = x * DfV.AtomSize;
							var yp = y * DfV.AtomSize;
							var zp = z * DfV.AtomSize;

							
							bound.min.x=0 + xp;bound.min.y=0 + yp;bound.min.z=0 + zp;
							bound.max.x=DfV.AtomSize + xp;bound.max.y=DfV.AtomSize + yp;bound.max.z=DfV.AtomSize + zp;

							//if (CMath.RaySphereIS(pos, d_BoxSize/2.0f, lray))
							if (CMath.RayBoxIS(bound.min, bound.max, lray))
							{
								
								var L_len = CMath.Vec3Lenght(
									CMath.Vec3MinusVec3(lray.GetPosition(), lray.GetOriginal()));
								if (L_len < Lmin)
								{
									_ray.SetPosition(CMath.MatToVec3Coordinate(lray.GetPosition(), each1.m_mat));
									Lmin = L_len;
									lpick.mi = each1.m_index.toCopy();
									lpick.ai.x = x;
									lpick.ai.y = y;
									lpick.ai.z = z;
									
									L_cen.x = DfV.AtomSize / 2.0 + DfV.AtomSize * x;
									L_cen.y = DfV.AtomSize / 2.0 + DfV.AtomSize * y;
									L_cen.z = DfV.AtomSize / 2.0 + DfV.AtomSize * z;

									/*cout << lray.GetPositionRF().x <<"," ;
									cout << lray.GetPositionRF().y << ",";
									cout << lray.GetPositionRF().z << endl;*/
									L_pickPos = CMath.Vec3Normalize(CMath.Vec3MinusVec3(lray.GetPosition(), L_cen));
									
								}

							}
						}
					}
				}
				var L_len=[0,0,0,0,0,0];
				L_len[DfV.DFront] = CMath.Vec3Dot(DfV.DFrontVec, L_pickPos);
				L_len[DfV.DBack] = CMath.Vec3Dot(DfV.DBackVec, L_pickPos);
				L_len[DfV.DLeft] = CMath.Vec3Dot(DfV.DLeftVec, L_pickPos);
				L_len[DfV.DRight] = CMath.Vec3Dot(DfV.DRightVec, L_pickPos);
				L_len[DfV.DUp] = CMath.Vec3Dot(DfV.DUpVec, L_pickPos);
				L_len[DfV.DDown] = CMath.Vec3Dot(DfV.DDownVec, L_pickPos);



				if (lpick.ai.x != -1 && lpick.ai.y != -1 && lpick.ai.z != -1)
				{
					var L_choise = -1;
					var maxVal = -1;
					for (var j = 0; j < DfV.DCount; ++j)
					{
						if (L_len[j] > maxVal)
						{
							L_choise = j;
							maxVal = L_len[j];
						}
					}
					lpick.dir = L_choise;
				}

			}//DfV.DCount
			//
		}//for
		return lpick;
	}
	PushLight(_light,_moleculeStep)
	{
		this.m_ligVec.push_back(_light);
		if(_light.shader)
			return;
		var lig=this.m_ligVec.back();
		var pickOrg=new CVPick();
		pickOrg.SetPos(lig.pos);
		pickOrg.value = lig.power;
		//int count = pickOrg.value * 2;
		var find=new Array();
		var atomStep=new Set();
		
		//find.reserve(count*count*count);
		//atomStep.clear();
		find.push_back(pickOrg);
		//CAtom *lightAt = FindCAtom(_lightPos, false);
		var startAt = this.FindCAtom(pickOrg,false);
		if (startAt == null)
			return;
		atomStep.insert(startAt.m_offset);
		var k=0;
		while (find.size()> k)
		{
			var pst = find[k];
			var at0 = this.FindCAtom(pst, false);
			_moleculeStep.insert(pst.mi.GetMapOffset());
			k++;
			//갈수 없거나 널이 아니면 빛이 움직이지 못함
			if (at0 == null || at0.m_tex != DfV.TexNull)
				continue;
			//빛이 너무 멀리 퍼지면 못함
			if (pst.value <= 0)
				continue;

			
			//6면을 가본다
			var pick=[new CVPick(),new CVPick(),new CVPick(),new CVPick(),new CVPick(),new CVPick()];
			for (var i = 0; i < 6; ++i)
			{
				pick[i] = pst.toCopy();
				pick[i].dir = i;
				if (pick[i].DirToAi())
				{
					var at1 = this.FindCAtom(pick[i], false);
					if (at1 == null)
						continue;
					//가봤는데 벽이면 라이팅을 입힌다
					if (at1.m_tex != DfV.TexNull)
					{
						
						switch (i)
						{
							case DfV.DFront:
							{
								var ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, pst.value, lig.global);
								at1.PushLight(ldata, DfV.DBack);
								lig.atomData.push_back(ldata);
								break;
							}
							case DfV.DBack:
							{
								var ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, pst.value, lig.global);
								at1.PushLight(ldata, DfV.DFront);
								lig.atomData.push_back(ldata);
								break;
							}
							case DfV.DLeft:
							{
								var ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, pst.value, lig.global);
								at1.PushLight(ldata, DfV.DRight);
								lig.atomData.push_back(ldata);
								break;
							}
							case DfV.DRight:
							{
								var ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, pst.value, lig.global);
								at1.PushLight(ldata, DfV.DLeft);
								lig.atomData.push_back(ldata);
								break;
							}
							case DfV.DDown:
							{
								var ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, pst.value, lig.global);
								at1.PushLight(ldata, DfV.DUp);
								lig.atomData.push_back(ldata);
								break;
							}
							case DfV.DUp:
							{
								var ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, pst.value, lig.global);
								at1.PushLight(ldata, DfV.DDown);
								lig.atomData.push_back(ldata);
								break;
							}
						}//switch

					}
					var stepChk = true;
					if(atomStep.has(at1.m_offset))
						stepChk=false;

					if (stepChk)
					{
						pick[i].value -= 1;
						find.push_back(pick[i]);
						atomStep.insert(at1.m_offset);

					}
						
				}//if

			}//for
			
		}	

	}
	CellAttach(_mo)
	{
		this.m_loadCount--;
		this.m_map[_mo.m_index.GetMapOffset()].m = _mo;
		
		
		
		
		_mo.AtomUpdate();
		this.Push(_mo);
		
		if(this.m_loadCount==0)
		{
			this.SetGlobalLight(g_global);
		}
	}
	//===============================================================================
	RemoveLight(_key,_moleculeStep)
	{
		for (var i=0;i< this.m_ligVec.size();++i)
		{
			if (this.m_ligVec[i].key.equals(_key))
			{
				var pick=new CVPick();
				pick.SetPos(this.m_ligVec[i].pos);

				for (var  each1 of this.m_ligVec[i].atomData)
				{
					var atomPick=new CVPick();
					atomPick.ai = each1.ai;
					atomPick.mi = each1.mi;
					var atom2 = this.FindCAtom(atomPick, false);
					if(atom2==null)
					{
						continue;
						//alert("null");//이게 왜 널이 나와?
						//atom2 = this.FindCAtom(atomPick, false);
						//아직 등록 중일때는 널인게 있을수 잇음
					}
					_moleculeStep.insert(atomPick.mi.GetMapOffset());	
					atom2.RemoveLight(this.m_ligVec[i].key);
				}
				this.m_ligVec[i].atomData.clear();
				this.m_ligVec.splice(i,1);
				break;
			}
			
		}
		
	}
	UpdateStep(_moleculeStep)
	{
		for (var each0 of _moleculeStep)
		{
			var mo = this.FindCMolecule(new CVIndex(each0));
			if(mo!=null)
				mo.AtomUpdate();
		}
	}
	FindLight(_key)
	{
		for (var each0 of this.m_ligVec)
		{
			if (each0.key.equals(_key))
			{
				return each0;
			}
		}

		return null;
	}
	LightResetVecCac(_mo,_list,_global)
	{
		
		for (var each0 of this.m_ligVec)
		{
			if (_global == false && each0.global)
				continue;
			var ra = _mo.m_bound.GetOutRadius();
			var mCen = _mo.m_mat.GetPos();
			mCen.x += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.y += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.z += DfV.AtomCount * 0.5*DfV.AtomSize;

			var len = CMath.Vec3Lenght(CMath.Vec3MinusVec3(mCen, each0.pos));
			if (len <= each0.power*DfV.AtomSize)
			{
				var lig=new CVLight();
				lig = each0.toCopy();
				var push = true;
				for (var each1 of _list)
				{
					
					if (each1.key.equals(lig.key))
					{
						push = false;
						break;
					}
				}
				if(push)
					_list.push_back(lig);
				
			}

		}
	}
	ResetLight(_key,_moleculeStep)
	{
		var lit = this.FindLight(_key).toCopy();

		this.RemoveLight(_key, _moleculeStep);
		this.PushLight(lit, _moleculeStep);
	}
	SetGlobalLight(_val)
	{
		var resetLight=new Array();
		g_global = _val;
		for (var each0 of this.m_obj)
		{
			var each1 = each0[1];
			this.LightResetVecCac(each1, resetLight,true);
		}

		
		
		var dummy=new Set();
		for (var each0 of resetLight)
		{
			this.RemoveLight(each0.key, dummy);
			this.PushLight(each0, dummy);
		}
		this.UpdateStep(dummy);
	}
	PreUpdateList(_showCell,_count)
	{
		var count = 0;
		for (var y = 0; y < DfV.MapY; ++y)
		{
			for (var z = this.m_updateIndex.z - _showCell; z <= this.m_updateIndex.z + _showCell; ++z)
			{
				for (var x = this.m_updateIndex.x - _showCell; x <= this.m_updateIndex.x + _showCell; ++x)
				{
					if (x < 0 || z < 0 || x >= DfV.MapX || z >= DfV.MapZ)
						continue;

					var cell = this.m_map[new CVIndex(x, y, z).GetMapOffset()];
					if (cell.m == null)
					{
						this.m_updateList.push_back(new CVIndex(x, y, z));
						this.m_loadCount++;
						count++;
						if (_count <= count)
							return;
					}
				}
			}
		}//for y
	}

}
