package cell;



public class CComponent implements ISerialize
{
	public int GetCComponentType() { return Df.CComponent.Null; }
	public String GetKey() { return new String(); }
	public CPacket Serialize() {return new CPacket();}
	public void Deserialize(String _str) {	}
}
