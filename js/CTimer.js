function CTimer() 
{
	this.m_begin=0;
	this.Delay();
}
CTimer.prototype.constructor	=CTimer;
CTimer.prototype.Delay=function()
{
	if(this.m_begin==0)
	{
		this.m_begin = new Date().getTime();
		return 0;
	}
	var before = this.m_begin;
	this.m_begin = new Date().getTime();
	return this.m_begin - before;
}

function DfFrame() 
{
	this.m_addTime=0;
	this.m_time=new CTimer();
	this.m_count = 0;
	this.m_lastFrame = 0;
}
DfFrame.prototype.constructor	=DfFrame;

DfFrame.prototype.Get=function()
{
	return this.m_lastFrame;
}
DfFrame.prototype.Update=function()
{
	this.m_addTime += this.m_time.Delay();
	if (this.m_addTime > 1000)
	{
		this.m_addTime -= 1000;
		this.m_lastFrame = this.m_count;
		this.m_count = 0;
	}
	this.m_count++;
}
var CFrame=new DfFrame();