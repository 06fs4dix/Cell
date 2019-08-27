function Memcpy(_tar,_tarO,_org,_orgO,_size)
{
	for(var i=0;i<_size;++i)
	{
		 if( typeof _org[_orgO+i] =="string")
			 _tar[_tarO+i]=_org.charCodeAt(_orgO+i);
		 else
			 _tar[_tarO+i]=_org[_orgO+i];
	}
}
function GetArrayBuffer(_org,_orgO,_size)
{
	var dummy=new ArrayBuffer(_size);
	var buf=new Uint8Array(dummy);
	Memcpy(buf,0,_org,_orgO,_size);
	
	return buf;
}
function BufRev(_org,_size)
{
	for(var i=0;i<_size/2;++i)
	{
		var dummy=_org[i];
		_org[i]=_org[_size-1-i];
		_org[_size-1-i]=dummy;
		
	}
}
class CParser
{
	constructor()
	{
		this.m_pstOff=0;//바이트수

		this.m_buffer=null;
		this.m_bufferSize=0;
		
		this.m_fileName="";
	}
	Open(pa_fileName,pa_mode)
	{
		this.m_fileName = pa_fileName;
		this.m_fileName= this.m_fileName.replaceAll("\\", "/");
		var fileName = this.m_fileName;
		if(this.m_buffer==null)
		{
			CMsg.E("file empty!");
			return true;
		}
		return false;
	}
	SetBuffer(pa_buffer,pa_size)
	{
		var dummy=new ArrayBuffer(pa_size);
		this.m_buffer=new Uint8Array(dummy);
		
		Memcpy(this.m_buffer,0, pa_buffer,0, pa_size);
	}

	ParFread(pa_buffer,pa_size)
	{
		CMsg.E("error 제대로 되나 확인안함");
		Memcpy(pa_buffer,0,this.m_buffer,this.m_pstOff , pa_size);
		this.m_pstOff += pa_size;
	}
	ReadInt32()
	{
		var dummy=GetArrayBuffer(this.m_buffer,this.m_pstOff,4);
		BufRev(dummy,4);
		var view=new DataView(dummy.buffer)
		this.m_pstOff += 4;
		return view.getInt32();
	}
	ReadInt64()
	{
		var dummy0=GetArrayBuffer(this.m_buffer,this.m_pstOff,4);
		var dummy1=GetArrayBuffer(this.m_buffer,this.m_pstOff+4,4);
		//BufRev(dummy0,4);
		//BufRev(dummy1,4);
		var view=new DataView(dummy0.buffer)
		var low = view.getUint32(0, true);  // 4294967295
		view=new DataView(dummy1.buffer)
		var high = view.getUint32(0, true);  // 4294967295
		
		this.m_pstOff += 8;
		// calculate negative value
		if ( high & 0x80000000 ) {

			high = ~ high & 0xFFFFFFFF;
			low = ~ low & 0xFFFFFFFF;

			if ( low === 0xFFFFFFFF ) high = ( high + 1 ) & 0xFFFFFFFF;

			low = ( low + 1 ) & 0xFFFFFFFF;

			return - ( high * 0x100000000 + low );

		}

		return high * 0x100000000 + low;
	}
	ReadFloat()
	{
		var dummy=GetArrayBuffer(this.m_buffer,this.m_pstOff,4);
		BufRev(dummy,4);
		var view=new DataView(dummy.buffer)
		this.m_pstOff += 4;
		return view.getFloat32();
	}
	ReadDouble()
	{
		var dummy=GetArrayBuffer(this.m_buffer,this.m_pstOff,8);
		BufRev(dummy,8);
		var view=new DataView(dummy.buffer)
		this.m_pstOff += 8;
		return view.getFloat64();
	}
	ReadChar()
	{
		this.m_pstOff += 1;
		return this.m_buffer[this.m_pstOff-1];
	}
	ReadString(_size)
	{
		var dummy=GetArrayBuffer(this.m_buffer,this.m_pstOff,_size);
		
		//var view=String.fromCharCode.apply(null, dummy);
		var view="";
		for(var i=0;i<dummy.length;++i)
		{
			if(dummy[i]==0)
			{
				break;
			}
			view+=String.fromCharCode(dummy[i]);
		}
		this.m_pstOff += _size;
		
		return view;
	}
	GetOffset() { return this.m_pstOff;	 }
	SetOffset(_size)
	{
		this.m_pstOff = _size;
	}
	Par_NotEof()
	{
		if (this.m_bufferSize != 0 && this.m_bufferSize - 1 >= this.m_pstOff)
		{

			return true;
		}

		return false;
	}

};