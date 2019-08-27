package cell;

public class CRand 
{
	static public String RandStr()
	{
		return ""+RandInt();
	}
	static public int RandInt()
	{
		return (int) (Math.random()*0xffffff);
	}
}
