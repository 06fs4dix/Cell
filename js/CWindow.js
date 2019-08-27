var m_handle=null;
var m_renderer=null;
var m_meshMgr = null;
var m_renMgr = null;
var m_texMgr = null;
var m_shader = null;
var g_resize=false;
$(window).on('resize', function()
{
	if(CRoot.m_fullScreen)
	{
		CRoot.m_windowWidth=$( window ).width();
		CRoot.m_windowHeight=$( window ).height();
		
		CRoot.m_realWidth=CRoot.m_windowWidth;
		CRoot.m_realHeight=CRoot.m_windowHeight;
		
		m_handle[0].clientWidth=CRoot.m_windowWidth;
		m_handle[0].clientHeight=CRoot.m_windowHeight;
	
		m_handle[0].width=CRoot.m_windowWidth;
		m_handle[0].height=CRoot.m_windowHeight;
		
		gl.canvas.width=CRoot.m_windowWidth;
		gl.canvas.height=CRoot.m_windowHeight;
		gl.viewport(0, 0, CRoot.m_windowWidth, CRoot.m_windowHeight);
	}
	g_resize=true;
});
var CWindow=function() 
{
	CRoot.m_windowWidth=$( window ).width();
	CRoot.m_windowHeight=$( window ).height();
	
	CRoot.m_realWidth=CRoot.m_windowWidth;
	CRoot.m_realHeight=CRoot.m_windowHeight;
}
CWindow.Init=function(_canvasJqObj)
{
	
	if(CRoot.m_fullScreen)
	{
		CRoot.m_windowWidth=$( window ).width()+16;
		CRoot.m_windowHeight=$( window ).height();
		
		CRoot.m_realWidth=CRoot.m_windowWidth;
		CRoot.m_realHeight=CRoot.m_windowHeight;
		
		_canvasJqObj[0].clientWidth=CRoot.m_windowWidth;
		_canvasJqObj[0].clientHeight=CRoot.m_windowHeight;

		_canvasJqObj[0].width=CRoot.m_windowWidth;
		_canvasJqObj[0].height=CRoot.m_windowHeight;
		
	}
	else
	{
		//CRoot.m_windowWidth=$( window ).width();
		//CRoot.m_windowHeight=$( window ).height();
		
		CRoot.m_realWidth=CRoot.m_windowWidth+16;
		CRoot.m_realHeight=CRoot.m_windowHeight;
		
		_canvasJqObj[0].clientWidth=CRoot.m_windowWidth;
		_canvasJqObj[0].clientHeight=CRoot.m_windowHeight;
		
		_canvasJqObj[0].width=CRoot.m_windowWidth;
		_canvasJqObj[0].height=CRoot.m_windowHeight;
		
		_canvasJqObj.width(CRoot.m_realWidth);
		_canvasJqObj.height(CRoot.m_realHeight);
		
	}
	

	
	
	m_handle=_canvasJqObj;
	m_renderer=new CRendererGL();
	m_renderer.Init(m_handle);
	m_renMgr = new CRenderMgrGL();
	m_meshMgr = new CMeshMgrGL();
	m_texMgr = new CTextureMgrGL();
	m_shader = new CShaderGL();
	m_shader.Init();

	
	
	//20181012 doc에서만 키입력이 먹혀서 이렇게 함 _canvasJqObj는 안되더라
	$(document).keydown(function(key)
	{
		g_keyPress[key.keyCode]=true;
	});
	$(document).keyup(function(key)
	{
		g_keyPress[key.keyCode]=false;
	});
	_canvasJqObj.mousemove(function(e)
	{
		g_touchPosX[0]=e.offsetX;
		g_touchPosY[0]=e.offsetY;
	});
	_canvasJqObj.mousedown(function(e) 
	{
		switch(e.button) {
	      case 0: g_keyPress[Df.Key.LButton]=true; break;
	      case 2: g_keyPress[Df.Key.RButton]=true; break;
	      case 3: // middle mouse
	    }
		
		g_touchPosX[0]=e.offsetX;
		g_touchPosY[0]=e.offsetY;
	});
	_canvasJqObj.mouseup(function(e) 
	{
		switch(e.button) {
	      case 0: g_keyPress[Df.Key.LButton]=false; break;
	      case 2: g_keyPress[Df.Key.RButton]=false; break;
	      case 3: // middle mouse
	    }
		
		g_touchPosX[0]=e.offsetX;
		g_touchPosY[0]=e.offsetY;
	});
	
	_canvasJqObj.touchstart(function(event)
	{
		//ChatAdd("touchstart");
		var e = event.originalEvent; 
		g_touchCount=e.targetTouches.length;
		for(var i=0;i<g_touchCount;++i)
		{
			g_touchPosX[i] = e.targetTouches[i].pageX- e.target.offsetLeft; 
			g_touchPosY[i] = e.targetTouches[i].pageY- e.target.offsetTop; 
			
			
			g_keyPress[Df.Key.LButton]=true;
		}
	
	});
	_canvasJqObj.touchmove(function(event)
	{
		
		event.preventDefault(); 
		event.stopPropagation();
		var e = event.originalEvent; 
		g_touchCount=e.targetTouches.length;
		for(var i=0;i<g_touchCount;++i)
		{
			g_touchPosX[i] = e.targetTouches[i].pageX- e.target.offsetLeft; 
			g_touchPosY[i] = e.targetTouches[i].pageY- e.target.offsetTop; 
		}
		
	});
	_canvasJqObj.touchend(function(event)
	{
		event.preventDefault(); 
		event.stopPropagation();

		var e = event.originalEvent; 
		g_touchCount=e.targetTouches.length;
		for(var i=0;i<g_touchCount;++i)
		{
			g_touchPosX[i] = e.targetTouches[i].pageX- e.target.offsetLeft; 
			g_touchPosY[i] = e.targetTouches[i].pageY- e.target.offsetTop; 
		}
		if(g_touchCount==0)
			g_keyPress[Df.Key.LButton]=false;
		
	});
	_canvasJqObj.on('wheel', function(e)
	{
		CInput.SetWheel(e.originalEvent.deltaY);
    });
}
CWindow.Update=function(_delay)
{
	CInput.Update(_delay);
}
var g_dum_init;
var g_dum_update;
var g_dum_render;
var timer=new CTimer();
function updateScreen(time) 
{
	CInput.Unlock();
	CWindow.Update(0);
	CInput.Lock();
	g_dum_update.Call(timer.Delay());
	g_dum_render.Call();
	if(g_resize)
		g_resize=false;
	requestAnimationFrame(updateScreen);
}


CWindow.CallBackProcess=function(_load,_init,_update,_render,_canvasJqObj)
{
	g_dum_init=_init;
	g_dum_update=_update;
	g_dum_render=_render;
	//setInterval(RealTime, 0);
	//setTimeout(function(){ QuestWindow(_a,_q);}, 5000);
	
	CWindow.Init(_canvasJqObj);
	_load.Call();
	
	var fun=function()
	{ 
		if (CUtil.LoadCompleteChk())
		{	
			g_dum_init.Call();
			requestAnimationFrame(updateScreen);
//			setInterval(function()
//			{
//				//var timer=new CTimer();
//				CInput.Unlock();
//				CWindow.Update(0);
//				CInput.Lock();
//				g_dum_update.Call(timer.Delay());
//				g_dum_render.Call();
//				if(g_resize)
//					g_resize=false;
//			
//			}, 0);
			
			
		}
		else
		{
			setTimeout(fun, 500);
		}
			
	};
	setTimeout(fun, 500);
	
	
	
//	
//	var timer=new CTimer();
//	while (true)
//	{
//		_update.Call(timer.Delay());
//		_render.Call();
//	}
}
CWindow.Ren=function(){	return m_renderer;	}
CWindow.MMgr=function(){	return m_meshMgr;	}
CWindow.RMgr=function(){	return m_renMgr;	}
CWindow.TMgr=function(){	return m_texMgr;	}
CWindow.Sha=function(){	return m_shader;	}