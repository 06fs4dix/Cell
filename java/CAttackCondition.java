package cell;


public class CAttackCondition 
{
	static public boolean AttackAroundOneself(CVec3 _iPos,CVec3 _youPos,double _len)
	{
		CVec3 dir=CMath.Vec3MinusVec3(_iPos, _youPos);
		
		if(CMath.Vec3Lenght(dir)<_len)
		{
			return true;
		}
		return false;
	}
	static public boolean AttackLooking(CProtozoa _i,CProtozoa _you,double _angle,double _len)
	{
		if(_you.GetPAbil().m_H<=0)
			return false;
		CVec3 dirA=CMath.Vec3MinusVec3(_you.GetPos(),_i.GetPos());
		double len=CMath.Vec3Lenght(dirA);
		len-=_you.GetBound().GetInRadius();
		dirA=CMath.Vec3Normalize(dirA);
		double dot=CMath.Vec3Dot(dirA, _i.GetView());
		
		
		if(dot>=_angle && len<_len)
		{
			return true;
		}
		return false;	
	}
}
