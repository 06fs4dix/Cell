var g_bushTool=false;

class CBush extends CObject
{
	constructor()
	{
		super();
		this.m_group=-1;
	}
	Init()
	{
		
		
	}
	Pick(_com,_ray)
	{
		
		if (CInput.KeyUp(Df.Key.LButton)==false || g_bushTool==false)
			return;
		var tileType=Number($("#tile_select option:selected").val());
		if(tileType==-5)
			this.Destroy();
		
		//super.Pick(_com,_ray);
		
	}
	GetGroup()
	{
		return this.m_group;
	}
//	Collision(_com,_col,_len)
//	{
//		//super.Collision(_com,_col,_len);
//		_col.SetBush(this.m_group);
//		_col.
//	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		
		this.m_group=pac.GetInt32(1);
		
	}
	Serialize()
	{
		var pac=new CPacket();
		pac.Push(super.Serialize());
		pac.Push(this.m_group);

		return pac;	
	}
}