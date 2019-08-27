


class CComponent extends ISerialize
{
	GetCComponentType() { return Df.CComponent.Null; }
	GetKey() { return ""; }
	Serialize()
	{
		var pac=new CPacket();
		pac.Push(this.GetCComponentType());
		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
	}
};

