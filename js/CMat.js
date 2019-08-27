function CMat(_x,_y,_z) 
{
	this.arr=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];   
	
	if(typeof _x !== 'undefined')
		this.arr[3][0]  =_x;
	if(typeof _x !== 'undefined')
		this.arr[3][1]  =_y;
	if(typeof _x !== 'undefined')
		this.arr[3][2]  =_z;
	    
}
CMat.prototype=new ISerialize();
CMat.prototype.constructor	=CMat;
CMat.prototype.Float32Array=function()
{
	var dum=new Float32Array(16);
	dum[0]=this.arr[0][0]; 
	dum[1]=this.arr[0][1]; 
	dum[2]=this.arr[0][2]; 
	dum[3]=this.arr[0][3];
	
	dum[4]=this.arr[1][0]; 
	dum[5]=this.arr[1][1]; 
	dum[6]=this.arr[1][2]; 
	dum[7]=this.arr[1][3];
	
	dum[8]=this.arr[2][0]; 
	dum[9]=this.arr[2][1]; 
	dum[10]=this.arr[2][2]; 
	dum[11]=this.arr[2][3];
	
	dum[12]=this.arr[3][0]; 
	dum[13]=this.arr[3][1]; 
	dum[14]=this.arr[3][2]; 
	dum[15]=this.arr[3][3];

	
	
	return dum;
}
CMat.prototype.GetPos=function()
{
	return new CVec3(this.arr[3][0],this.arr[3][1],this.arr[3][2]);
}
CMat.prototype.Serialize=function()
{
	var pac=new CPacket();
	for (var i = 0; i < 4; ++i)
	{
		for (var j = 0; j < 4; ++j)
		{
			pac.Push(this.arr[i][j]);
		}
	}
	return pac;
}
CMat.prototype.Deserialize=function(_str)
{
	var pac=new CPacket();
	pac.Deserialize(_str);
	for (var i = 0; i < 4; ++i)
	{
		for (var j = 0; j < 4; ++j)
		{
			this.arr[i][j] = pac.GetFloat(j+i*4);
		}
	}
}
CMat.prototype.toCopy=function()
{
	var dum=new CMat();
	for (var y = 0; y < 4; ++y)
	{
		for (var x = 0; x < 4; ++x)
		{
			dum.arr[y][x] = this.arr[y][x];
		}
	}
	return dum;
}
CMat.prototype.Json=function(_obj)
{
	for (var i = 0; i < 4; ++i)
	{
		for (var j = 0; j < 4; ++j)
		{
			this.arr[i][j] = _obj.arr[i][j];
		}
	}
}
