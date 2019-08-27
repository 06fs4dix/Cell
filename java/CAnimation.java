package cell;

import java.util.Vector;

class CClip implements ISerialize
{
	public int m_time = 0;
	public int m_delay = 0;
	public int m_paintOff = 0;
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.Push(this.m_time);
		pac.Push(this.m_delay);
		pac.Push(this.m_paintOff);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		this.m_time = pac.GetInt32(0);
		this.m_delay = pac.GetInt32(1);
		this.m_paintOff = pac.GetInt32(2);
	}
};
class CClipImg extends CClip
{

	public CClipImg()
	{

	}
	public CClipImg(int _time,int _delay,String _img,CVec2 _size)
	{
		m_time = _time;
		m_delay=_delay;
		m_img = _img;
		m_size=_size;
		
	}
	public String m_img;
	public CVec2 m_size;
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CClipImg";
		pac.Push(super.Serialize().Serialize());
		pac.Push(this.m_img);
		pac.Push(this.m_size);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_img = pac.GetString(1);
		if(pac.value.size()>2)
			pac.GetISerialize(2, m_size);
	}
};
class CClipMesh extends CClip
{

	public CClipMesh()
	{

	}
	public CClipMesh(int _time,int _delay,String _mesh)
	{
		m_time = _time;
		m_delay=_delay;
		m_mesh = _mesh;
	}
	public String m_mesh;

	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CClipMesh";
		pac.Push(super.Serialize().Serialize());
		pac.Push(this.m_mesh);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_mesh = pac.GetString(1);
	}
};
class CClipCoodi extends CClip
{

	public CClipCoodi()
	{

	}
	public CClipCoodi(int _time, int _delay,int _stX, int _stY, int _edX, int _edY)
	{
		m_time = _time;
		m_delay = _delay;
		m_stX = _stX;
		m_stY = _stY;
		m_edX = _edX;
		m_edY = _edY;
	}
	public int m_stX = 0;
	public int m_stY = 0;
	public int m_edX = 0;
	public int m_edY = 0;

	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CClipCoodi";
		pac.Push(super.Serialize().Serialize());
		pac.Push(this.m_stX);
		pac.Push(this.m_stY);
		pac.Push(this.m_edX);
		pac.Push(this.m_edY);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_stX = pac.GetInt32(1);
		this.m_stY = pac.GetInt32(2);
		this.m_edX = pac.GetInt32(3);
		this.m_edY = pac.GetInt32(4);

	}
};
class CClipPhysics extends CClip
{

	CClipPhysics(int _time, int _delay)
	{
		m_time = _time;
		m_delay = _delay;
	}
	boolean m_posUse=false;
	boolean m_rotUse = false;
	boolean m_scaUse = false;
	CVec3 m_pos =new CVec3();
	CVec4 m_rot=new CVec4();
	CVec3 m_sca=new CVec3(1,1,1);
};

class CClipRGBA extends CClip
{
	public CClipRGBA(){	}
	public CClipRGBA(int _time, int _delay, CVec4 _st, CVec4 _ed)
	{
		m_time = _time;
		m_delay = _delay;
		m_st = _st;
		m_ed = _ed;
	}
	//bool m_stUse=true;
	public CVec4 m_st=new CVec4(0,0,0,0);
	public CVec4 m_ed =new CVec4(0,0,0,0);

	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.Push(super.Serialize().Serialize());
		pac.name = "CClipRGBA";
		pac.Push(this.m_st);
		pac.Push(this.m_ed);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1, this.m_st);
		pac.GetISerialize(2, this.m_ed);

	}
};
public class CAnimation extends CComponent
{
	public int GetCComponentType() { return Df.CComponent.CAnimation; }
	public String GetKey() { return m_key; }
	String m_key;
	boolean m_loop = true;
	boolean m_remove = false;
	boolean m_paintAuto=false;
	Vector<CClip> m_clip=new Vector<CClip>();

	boolean Update(CFlow _flow,CObject _obj, int _delay)
	{
		if (_delay == 0 || _flow.m_play==false)
			return false;
		_flow.m_time += _delay * _obj.GetSpeed();
		while (m_clip.size() != 0)
		{
			if (_flow.m_offset >= m_clip.size() && _flow.m_clip.size() == 0)
			{
				if (m_loop)
				{
					_flow.m_offset = 0;
					_flow.m_time = 0;
				}
				else
					break;
			}
			if (_flow.m_offset < m_clip.size() && m_clip.get(_flow.m_offset).m_time < _flow.m_time)
			{
				
				if (m_clip.get(_flow.m_offset) instanceof CClipPhysics)
				{
					CClipPhysics cphy = (CClipPhysics)m_clip.get(_flow.m_offset);
					if(cphy.m_posUse)
						m_pos = _obj.GetPos();
					else if (cphy.m_rotUse)
						m_rot = _obj.GetRot();
					else if (cphy.m_scaUse)
						m_sca = _obj.GetSca();
				}
				_flow.m_clip.add(m_clip.get(_flow.m_offset));
				_flow.m_offset += 1;
			}
			else
				break;
		}

		for (int i = 0; i < _flow.m_clip.size(); ++i)
		{
			//애니메이션 자바에선 사용안하니 끔
//			if (dynamic_cast<CClipImg*>(_flow.m_clip[i]) != null)
//			{
//				CClipImg* cimg = dynamic_cast<CClipImg*>(_flow.m_clip[i]);
//				CPaint2D* p2d = (CPaint2D*)_obj.GetCComponent(Df.CComponent.CPaint).front();
//				p2d.SetTexture(cimg.m_img);
//				p2d.SetTexCodi(CVec4(1, 1, 0, 0));
//				
//			}
//			else if (dynamic_cast<CClipCoodi*>(_flow.m_clip[i]) != null)
//			{
//				CClipCoodi* ccodi = dynamic_cast<CClipCoodi*>(_flow.m_clip[i]);
//				CPaint2D* p2d = (CPaint2D*)_obj.GetCComponent(Df.CComponent.CPaint).front();
//			
//				CTexture *tex = (CTexture*)CRes.get(p2d.GetTexture().front());
//				if (tex != null)
//				{
//					p2d.SetTexCodi(ccodi.m_stX, ccodi.m_stY, ccodi.m_edX, ccodi.m_edY,
//						tex.GetWidth(), tex.GetHeight());
//				}
//
//				
//				
//			}
//			else if (dynamic_cast<CClipRGBA*>(_flow.m_clip[i]) != null)
//			{
//				CClipRGBA* crgba = dynamic_cast<CClipRGBA*>(_flow.m_clip[i]);
//				float pst = _flow.m_time - _flow.m_clip[i].m_time;
//				//float pst;
//				if (_flow.m_clip[i].m_delay != 0)
//					pst = pst / (_flow.m_clip[i].m_delay);
//				else
//					pst = 0;
//				CVec4 last;
//				last.x = CMath.FloatInterpolate(crgba.m_st.x, crgba.m_ed.x, pst); 
//				last.y = CMath.FloatInterpolate(crgba.m_st.y, crgba.m_ed.y, pst);
//				last.z = CMath.FloatInterpolate(crgba.m_st.z, crgba.m_ed.z, pst);
//				last.w = CMath.FloatInterpolate(crgba.m_st.w, crgba.m_ed.w, pst);
//				_obj.SetRGBA(last);
//			}
//			else if (dynamic_cast<CClipPhysics*>(_flow.m_clip[i]) != null)
//			{
//				CClipPhysics* cphy = dynamic_cast<CClipPhysics*>(_flow.m_clip[i]);
//				float pst = _flow.m_time - _flow.m_clip[i].m_time;
//				//float pst;
//				if (_flow.m_clip[i].m_delay != 0)
//					pst = pst / (_flow.m_clip[i].m_delay);
//				else
//					pst = 0;
//				if (cphy.m_posUse)
//				{
//					CVec3 last;
//					last.x = CMath.FloatInterpolate(m_pos.x, cphy.m_pos.x, pst);
//					last.y = CMath.FloatInterpolate(m_pos.y, cphy.m_pos.y, pst);
//					last.z = CMath.FloatInterpolate(m_pos.z, cphy.m_pos.z, pst);
//					_obj.SetPos(last,false);
//				}
//				if (cphy.m_rotUse)
//				{
//					CVec4 last=CMath.QutInterpolate(m_rot, cphy.m_rot, pst);
//					_obj.SetRot(last, false);
//				}
//				if (cphy.m_scaUse)
//				{
//					CVec3 last;
//					last.x = CMath.FloatInterpolate(m_sca.x, cphy.m_sca.x, pst);
//					last.y = CMath.FloatInterpolate(m_sca.y, cphy.m_sca.y, pst);
//					last.z = CMath.FloatInterpolate(m_sca.z, cphy.m_sca.z, pst);
//					_obj.SetSca(last, false);
//				}
//				_obj.PRSReset();
//
//			}

			


			if (_flow.m_clip.get(i).m_time + _flow.m_clip.get(i).m_delay <= _flow.m_time)
			{
				_flow.m_clip.remove(i);
				i--;
			}
			if (_flow.m_clip.size() == 0 && _flow.m_offset >= m_clip.size() && m_remove)
				return true;
		}

		return false;
	}

	CVec3 m_pos;
	CVec4 m_rot;
	CVec3 m_sca;

	
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CAnimation";
		pac.Push(super.Serialize());
		pac.Push(this.m_key);
		pac.Push(this.m_loop);
		pac.Push(this.m_remove);
		pac.Push(this.m_clip);
		pac.Push(this.m_paintAuto);
		
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_key = pac.GetString(1);
		this.m_loop = pac.GetBool(2);
		this.m_remove = pac.GetBool(3);

		var pac2 = new CPacket();
		pac2.Deserialize(pac.GetString(4));
		for (var each0 : pac2.value)
		{
			var pac3 = new CPacket();
			pac3.Deserialize(each0);
			CClip img = null;
			if (pac3.name.equals("CClipImg"))
				img = new CClipImg();
			else if (pac3.name.equals("CClipCoodi"))
				img = new CClipCoodi();
			else if (pac3.name.equals("CClipRGBA"))
				img = new CClipRGBA();
		
			img.Deserialize(each0);
			this.m_clip.add(img);
		}
		if(pac.value.size()>=6)
			this.m_paintAuto = pac.GetBool(5);
	}
}
