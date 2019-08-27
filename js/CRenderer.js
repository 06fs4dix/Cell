function CRenderer() 
{
}
CRenderer.prototype.constructor	=CRenderer;

//네이티브와 비슷하게 작동하려면 전역으로 선언해야 한다
var gl=null;
function CRendererGL() 
{
	
}
CRendererGL.prototype=new CRenderer();
CRendererGL.prototype.constructor	=CRendererGL;
CRendererGL.prototype.Init=function(_handle)
{
	if(CRoot.m_renderer==DfRen.GL_L)
		gl = _handle[0].getContext("webgl",{depth:true});
	else if(CRoot.m_renderer==DfRen.GL_H)
		gl = _handle[0].getContext("webgl2");
	
	//
	if (!gl)
	{	
		CMsg.E("초기화 실패");
		return;
	}
	
	gl.enable(gl.DEPTH_TEST);
	//gl.depthFunc(gl.LESS);
	gl.depthFunc(gl.LEQUAL); 
	
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.depthMask(true);
	//gl.enable(gl.ALPHA_TEST);
	//glAlphaFunc(GL_GREATER, (GLclampf)0.1);
	
	
	
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(255, 0, 0, 255);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
CRendererGL.prototype.Clear=function(pa_r,pa_g,pa_b,pa_a)
{
	var r = pa_r / 255.0, g = pa_g / 255.0, b = pa_b / 255.0, a = pa_a / 255.0;
	
	
	gl.clearColor(r, g, b, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
CRendererGL.prototype.Begin=function()
{

}
CRendererGL.prototype.End=function()
{
	gl.flush();
}
CRendererGL.prototype.SetCull=function(_enable)
{
	if (_enable)
	{
		gl.frontFace(gl.CW);
		gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.FRONT_AND_BACK);
	}
	else
	{
		gl.disable(gl.CULL_FACE);
	}
}
CRendererGL.prototype.SetDepthTest=function(_enable)
{
	if (_enable)
	{
		
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
	}
	else
	{
		gl.disable(gl.DEPTH_TEST);
	}
}
CRendererGL.prototype.SetAlpha=function(_enable)
{
	if (_enable)
	{
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
	else
	{
		gl.disable(gl.BLEND);
		gl.disable(gl.ALPHA_TEST);
	}
}
CRendererGL.prototype.SetDepthWrite=function(_enable)
{
	if (_enable)
	{
		gl.depthMask(true);
	}
	else
	{
		gl.depthMask(false);
	}
}
