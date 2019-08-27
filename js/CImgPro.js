class CImgPro
{
	static Square(_w,_h,_color)
	{
		var tex=new CTexture();
		tex.CreateByte4(_w, _h);
		var buf = tex.GetByte8();

		for (var i = 0; i < tex.Byte8AllSize(); i+=4)
		{
			buf[i + 0] = 0xff * _color.x;
			buf[i + 1] = 0xff * _color.y;
			buf[i + 2] = 0xff * _color.z;
			buf[i + 3] = 0xff * _color.w;
		}

		return tex;
	}
}
