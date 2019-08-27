class CRand
{
	static RandStr()
	{
		return ""+CRand.RandInt();
	}
	static RandInt()
	{
		return parseInt(Math.random()*0xfffffff);
	}
}