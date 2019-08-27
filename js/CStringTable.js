var g_st=new Array();

class CST
{
	static get(_str)
	{
		var pos=_str.indexOf("@ST");
		if(pos==-1)
			return _str;
		var off=Number(_str.substr(pos+3,_str.length));
		return g_st[off];
	}
}