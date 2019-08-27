class CFloatArray
{
	constructor()
	{
		this.m_arr=new Float32Array();
		this.m_size=0;
	}
	Swap(_tar)
	{
		var dummy=this.m_arr;
		this.m_arr=_tar.GetArray();
		_tar.SetArray(dummy);
	}
	SetArray(_arr)	{	this.m_arr=_arr;	}
	GetArray() { return this.m_arr;	 }
	Clear()
	{
		this.m_arr=new Float32Array();
	}
	Empty()
	{
		return this.m_arr.length==0;
	}
	Resize(_count)
	{
		var dummy=this.m_arr;
		this.m_arr=new Float32Array(_count);
		this.m_arr.set(dummy);
		this.m_size=_count;
	}
	Reserve(_count)
	{
		var dummy=this.m_arr;
		this.m_arr=new Float32Array(_count);
		this.m_arr.set(dummy);
	}
	Size(_vCount)
	{
		return this.m_size / _vCount;
	}
	Push(_v)
	{
		if(_v instanceof CVec2)
		{
			this.m_size+=2;
			if(this.m_size>=this.m_arr.length)
				this.Reserve(this.m_size*2);
			
			this.m_arr[this.m_size-2]=_v.x;
			this.m_arr[this.m_size-1]=_v.y;
		}
		else if(_v instanceof CVec3)
		{
			this.m_size+=3;
			if(this.m_size>=this.m_arr.length)
				this.Reserve(this.m_size*2);
			
			this.m_arr[this.m_size-3]=_v.x;
			this.m_arr[this.m_size-2]=_v.y;
			this.m_arr[this.m_size-1]=_v.z;
		}
		else if(_v instanceof CVec4)
		{
			this.m_size+=4;
			if(this.m_size>=this.m_arr.length)
				this.Reserve(this.m_size*2);
			
			this.m_arr[this.m_size-4]=_v.x;
			this.m_arr[this.m_size-3]=_v.y;
			this.m_arr[this.m_size-2]=_v.z;
			this.m_arr[this.m_size-1]=_v.w;
		}
		else
		{
			this.m_size+=1;
			if(this.m_size>=this.m_arr.length)
				this.Reserve(this.m_size*2);
			this.m_arr[this.m_size-1]=_v;
		}
			
	}
	

	//===========================================================

	V1(_off,_v)
	{
		this.m_arr[_off] = _v;
	}
	V2(_off,_v,_y)
	{
		if( typeof _v =="undefined")
			return new CVec2(this.m_arr[_off * 2 + 0], this.m_arr[_off * 2 + 1]);
		else if(_v instanceof CVec2)
		{
			this.m_arr[_off * 2 + 0] = _v.x;
			this.m_arr[_off * 2 + 1] = _v.y;
		}
		else
		{
			this.m_arr[_off * 2 + 0] = _v;
			this.m_arr[_off * 2 + 1] = _y;
		}
	}
	V3(_off,_v,_y,_z)
	{
		if( typeof _v =="undefined")
			return new CVec3(this.m_arr[_off * 3 + 0], this.m_arr[_off * 3 + 1], this.m_arr[_off * 3 + 2]);
		else if(_v instanceof CVec3)
		{
			this.m_arr[_off * 3 + 0] = _v.x;
			this.m_arr[_off * 3 + 1] = _v.y;
			this.m_arr[_off * 3 + 2] = _v.z;
		}
		else
		{
			this.m_arr[_off * 3 + 0] = _v;
			this.m_arr[_off * 3 + 1] = _y;
			this.m_arr[_off * 3 + 2] = _z;
		}
	}
	V4(_off,_v,_y,_z,_w)
	{
		if( typeof _v =="undefined")
			return new CVec4(this.m_arr[_off * 4 + 0], this.m_arr[_off * 4 + 1], this.m_arr[_off * 4 + 2], this.m_arr[_off * 4 + 3]);
		else if(_v instanceof CVec4)
		{
			this.m_arr[_off * 4 + 0] = _v.x;
			this.m_arr[_off * 4 + 1] = _v.y;
			this.m_arr[_off * 4 + 2] = _v.z;
			this.m_arr[_off * 4 + 3] = _v.w;
		}
		else
		{
			this.m_arr[_off * 4 + 0] = _v;
			this.m_arr[_off * 4 + 1] = _y;
			this.m_arr[_off * 4 + 2] = _z;
			this.m_arr[_off * 4 + 3] = _w;
		}
		
		
	}



	//======================================================
	X1(_off)
	{
		return this.m_arr[_off];
	}

	X2(_off)
	{
		return m_arr[_off * 2 + 0];
	}
	Y2(_off)
	{
		return this.m_arr[_off * 2+1];
	}

	
	X3( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 3 + 0];
		this.m_arr[_off * 3 + 0] = _val;
	}
	Y3( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 3 + 1];
		this.m_arr[_off * 3 + 1] = _val;
	}
	Z3( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 3 + 2];
		this.m_arr[_off * 3 + 2] = _val;
	}
	//===========================================================
	X4( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 4 + 0];
		this.m_arr[_off * 4 + 0] = _val;
	}
	Y4( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 4 + 1];
		this.m_arr[_off * 4 + 1] = _val;
	}
	Z4( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 4 + 2];
		this.m_arr[_off * 4 + 2] = _val;
	}
	W4( _off,  _val)
	{
		if( typeof _val =="undefined")
			return this.m_arr[_off * 4 + 3];
		this.m_arr[_off * 4 + 3] = _val;
	}

	//========================================================
	GetOff( _off,  _w)
	{
		if (_off == 0)
			return this.m_arr[_off * 4 + 0];
		else if (_off == 1)
			return this.m_arr[_off * 4 + 1];
		else if (_off == 2)
			return this.m_arr[_off * 4 + 2];
		return this.m_arr[_off * 4 + 3];
	}
	SetOff( _off,  _w,  _val)
	{
		if (_off == 0)
			this.m_arr[_off * 4 + 0]= _val;
		else if (_off == 1)
			this.m_arr[_off * 4 + 1] = _val;
		else if (_off == 2)
			this.m_arr[_off * 4 + 2] = _val;
		else
			this.m_arr[_off * 4 + 3] = _val;
	}
}