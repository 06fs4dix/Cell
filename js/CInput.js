var g_keyPress=null;
var g_key=new Array(256);
var g_upkey=new Array(256);
var g_firstkey=new Array(256);
var g_touchPosX=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var g_touchPosY=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var g_touchCount=1;
var g_lock = false;
var g_focus=true;
var g_wheel=0;
var CInput=function() 
{
	
}
CInput.SetFocus=function(_enable)
{
	g_focus = _enable;
}
CInput.Update=function(_delay)
{
	//이 코드가 없으면 배열은 생성되는데 값이 없는 형태가 된다
	if(g_keyPress==null)
	{
		g_keyPress=new Array(256);
		for (var i = 0; i < 256; ++i)
		{
			g_keyPress[i]=false;
			g_key[i]=false;
			g_upkey[i]=false;
			g_firstkey[i]=false;
		}
	}
	
	if (g_lock)
		CMsg.E("Unlock plz!");
	if (g_upkey[Df.Key.Wheel] == true)
	{
		g_upkey[Df.Key.Wheel] = false;
		g_key[Df.Key.Wheel] = false;
	}

	if (g_key[Df.Key.Wheel] == true)
	{
		g_upkey[Df.Key.Wheel] = true;
	}
	
	for (var i = 0; i < 256; ++i)
	{
		g_upkey[i] = false;
		if (g_keyPress[i])
		{
			if(g_key[i]==false && g_firstkey[i]==false)
				g_firstkey[i] = true;
			else
				g_firstkey[i] = false;
			g_key[i] = true;
		}
		else if (g_key[i] == true)
		{
			g_key[i] = false;
			g_upkey[i]=true;
			g_firstkey[i]=false;
		}
	}
}

CInput.Lock=function()
{
	g_lock = true;
}
CInput.Unlock=function()
{
	g_lock = false;
}
CInput.KeyDown=function(_key,_first)
{
	if (g_focus==false)
		return false;
	if (typeof _first !== 'undefined'  && _first)
	{
		if (g_key[_key] && g_firstkey[_key] == true)
		{
			return true;
		}
		else
			return false;
		
	}
	return g_key[_key];
}
CInput.KeyUp=function(_key)
{
	if (g_focus==false)
		return false;
	return g_upkey[_key];
}
CInput.PosX=function(_off)
{
	return g_touchPosX[_off];
}
CInput.PosY=function(_off)
{
	return g_touchPosY[_off];
}
CInput.TouchCount=function(_off)
{
	return g_touchCount;
}
CInput.Wheel=function()
{
	return g_wheel;
}
CInput.SetWheel=function(_val)
{
	g_key[Df.Key.Wheel] = true;
	g_wheel = _val;
}