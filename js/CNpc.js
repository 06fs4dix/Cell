class CNpc extends CRobot
{
	constructor()
	{
		super();
		this.m_rad = 50;
		this.m_nick=null;
	}

	Serialize()
	{
		var pac=new CPacket();
		pac.name="CNpc";
		pac.Push(super.Serialize());


		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		
		
	}
}