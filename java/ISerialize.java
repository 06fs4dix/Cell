package cell;

public interface ISerialize 
{
	public CPacket Serialize();
	public void Deserialize(String _str);
}
