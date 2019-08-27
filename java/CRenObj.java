package cell;
class DfCRenObj
{
	public static int CObject = 0;
	public static int CMolecule = 1;
	public static int Count = 2;
	public static int Null = 3;
};
public class CRenObj implements ISerialize
{
	int m_offset;
	protected String m_key="";
	protected String m_keyChange="";
	protected boolean m_remove=false;
	protected boolean m_show = true;
	public boolean GetRemove() { return m_remove;	 }
	public String GetKeyChange() {	return m_keyChange; }
	public void ClearKeyChange() { m_keyChange = new String();	 }
	public void SetShow(boolean _show) {	m_show=_show;	}
	public boolean GetShow()	{	return m_show;	}
	
	
	public String GetKey() { return m_key; }
	public void SetKey(String _key)
	{
		if (m_key.equals(_key))
			return;
		if(m_key.isEmpty()==false)
			m_keyChange = m_key;
		m_key = _key;
	}
	static int ls_off=0;
	public CRenObj()
	{
		
		m_offset = ls_off;
		ls_off++;
	}

	
	public void Render(CCamera _cam) {};
	public void Update(int _delay) {};
	public void LastUpdate(int _delay) {};
	public int GetCRenObjType() {return DfCRenObj.Null;	};
	
	public void Destroy() {};
	public void CanvasDelete() {};
	public int GetOffset() { return m_offset;	 }

	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(m_offset);
		pac.Push(m_key);

		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_offset = pac.GetInt32(0);
		m_key=pac.GetString(1);
	}
};