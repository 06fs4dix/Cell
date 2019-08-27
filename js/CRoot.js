function JSDfRen()
{
	this.GL_H = 0;
	this.GL_L = 1;
	this.Count = 2;
	this.Null = 3;
};
var DfRen=new JSDfRen();


function root() 
{
	this.m_windowWidth=1024;
	this.m_windowHeight=768;

	this.m_realWidth=1024;
	this.m_realHeight=768;

	this.m_fullScreen=false;
	this.m_cursorHide=null;
	this.m_title=null;
	
	this.m_programName="Cell";

	//0지엘 1dx9
	this.m_renderer=DfRen.GL_L;
	
	this.m_platform=1;
	this.m_async=false;
}
var CRoot=new root();