
class CClip extends ISerialize
{
	constructor()
	{
		super();
		this.m_time = 0;
		this.m_delay = 0;
		this.m_paintOff=0;
	}
	GetCClipType() {}
	Serialize()
	{
		var pac = new CPacket();
		pac.Push(this.m_time);
		pac.Push(this.m_delay);
		pac.Push(this.m_paintOff);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		this.m_time = pac.GetInt32(0);
		this.m_delay = pac.GetInt32(1);
		if(pac.value.length>2)
			this.m_paintOff = pac.GetInt32(2);
	}
};
class CClipImg extends CClip
{

	constructor(_time,_delay,_img)
	{
		super();
		this.m_time = _time;
		this.m_delay=_delay;
		this.m_img = _img;
		
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.name = "CClipImg";
		pac.Push(super.Serialize().Serialize());
		pac.Push(this.m_img);
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_img = pac.GetString(1);
	}
};
class CClipMesh extends CClip
{

	constructor(_time,_delay,_mesh,_vf)
	{
		super();
		this.m_time = _time;
		this.m_delay=_delay;
		this.m_mesh = _mesh;
		this.m_vf=_vf;
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.name = "CClipMesh";
		pac.Push(super.Serialize().Serialize());
		pac.Push(this.m_mesh);
		pac.Push(this.m_vf);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_mesh = pac.GetString(1);
		this.m_vf = pac.GetInt32(2);
	}
};
class CClipCoodi extends CClip
{
	constructor(_time,_delay,_stX, _stY,_edX,_edY)
	{
		super();
		this.m_time = _time;
		this.m_delay = _delay;
		this.m_stX = _stX;
		this.m_stY = _stY;
		this.m_edX = _edX;
		this.m_edY = _edY;
	}
	Serialize()
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
	Deserialize(_str)
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
class CClipRGBA extends CClip
{
	constructor(_time,_delay,_st,_ed)
	{
		super();
		if(typeof _time == 'undefined')
		{
			this.m_time=0;
			this.m_delay=0;
			this.m_st=new CVec4();
			this.m_ed=new CVec4();
		}
		else
		{
			this.m_time = _time;
			this.m_delay = _delay;
			
			this.m_st = _st;
			this.m_ed = _ed;
		}
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.Push(super.Serialize().Serialize());
		pac.name = "CClipRGBA";
		pac.Push(this.m_st);
		pac.Push(this.m_ed);
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1, this.m_st);
		pac.GetISerialize(2, this.m_ed);

	}
};
class CClipPhysics extends CClip
{
	constructor(_time,_delay)
	{
		super();
		if(typeof _time == 'undefined')
		{
			this.m_time=0;
			this.m_delay=0;
		}
		else
		{
			this.m_time = _time;
			this.m_delay = _delay;
		}
		
		
		this.m_posLocal=false;
		this.m_posAdd=false;
		this.m_posUse=false;
		this.m_rotUse = false;
		this.m_scaUse = false;
		this.m_pos =new CVec3();
		this.m_rot=new CVec4();
		this.m_sca=new CVec3(1,1,1);
	}
	
};
class CClip3D extends CClip
{

	constructor(_time,_delay,_st,_speed)
	{
		super();
		this.m_time = _time;
		this.m_delay=_delay;
		this.m_st=_st;
		this.m_speed=_speed;
		this.m_ipSt=0;
		this.m_ipEd=0;
	}
	Set(_delay,_st,_inter)
	{
		if (_inter > 0 && this.m_st != _st)
		{
			this.m_ipSt = 0;
			this.m_ipEd = _inter;
		}

		this.m_delay = _delay;
		this.m_st = _st;
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.Push(super.Serialize().Serialize());
		pac.name = "CClip3D";
		pac.Push(this.m_st);
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1, this.m_st);
	}
};
class CClipPaint extends CClip
{

	constructor(_time,_delay,_cpaint,_size)
	{
		super();
		this.m_time = _time;
		this.m_delay=_delay;
		this.m_cpaint=_cpaint;
		this.m_size=_size;
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.Push(super.Serialize().Serialize());
		pac.name = "CClipPaint";
		pac.Push(this.m_cpaint);
		pac.Push(this.m_size);
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_cpaint = pac.GetInt32(1);
		pac.GetISerialize(2, this.m_size);
	}
};
class CAnimation extends CComponent
{
	constructor()
	{
		super();
		this.m_key="";
		this.m_loop = true;
		this.m_remove = false;
		
		this.m_clip=new Array();

		this.m_pos=new CVec3();
		this.m_rot=new CVec4();
		this.m_sca=new CVec3();
	}

	GetCComponentType() { return Df.CComponent.CAnimation; }
	GetKey() { return this.m_key; }
	

	Update(_flow,_obj,_delay)
	{
		if (_delay == 0 || _flow.m_play==false)
			return false;
		_flow.m_time += _delay * _obj.GetSpeed();
		while (this.m_clip.size() != 0)
		{
			if (_flow.m_offset >= this.m_clip.size() && _flow.m_clip.size() == 0)
			{
				if (this.m_loop)
				{
					_flow.m_offset = 0;
					_flow.m_time = 0;
				}
				else
					break;
			}
			if (_flow.m_offset < this.m_clip.size() && this.m_clip[_flow.m_offset].m_time < _flow.m_time)
			{
				var cphy =this.m_clip[_flow.m_offset] instanceof CClipPhysics?this.m_clip[_flow.m_offset]:null;
				if (cphy != null)
				{
					if(cphy.m_posUse)
					{
						if (cphy.m_posLocal)
						{
							var p2d = _obj.GetCComponent(Df.CComponent.CPaint)[cphy.m_paintOff];
							this.m_pos = p2d.GetPos();
						}
						else
							this.m_pos = _obj.GetPos();
					}
					else if (cphy.m_rotUse)
						this.m_rot = _obj.GetRot();
					else if (cphy.m_scaUse)
						this.m_sca = _obj.GetSca();
				}
				_flow.m_clip.push_back(this.m_clip[_flow.m_offset]);
				_flow.m_offset += 1;
			}
			else
				break;
		}

		for (var i = 0; i < _flow.m_clip.size(); ++i)
		{
			//_flow.m_clip[i].m_delay -= _delay;

			if (_flow.m_clip[i] instanceof CClipImg)
			{
				var cimg = _flow.m_clip[i];
				var p2d = _obj.GetCComponent(Df.CComponent.CPaint)[cimg.m_paintOff];
				if (p2d != null && p2d instanceof CPaint2D)
				{
					p2d.SetTexture(cimg.m_img);
					p2d.SetTexCodi(new CVec4(1, 1, 0, 0));
				}
			}
			else if (_flow.m_clip[i] instanceof CClipMesh)
			{
				var cimg = _flow.m_clip[i];
				var p3d = _obj.GetCComponent(Df.CComponent.CPaint)[cimg.m_paintOff];
				if (p3d != null && p3d instanceof CPaint3D)
				{
					p3d.SetMesh(cimg.m_mesh);
				}
				
			}
			else if (_flow.m_clip[i] instanceof CClipCoodi)
			{
				var ccodi = _flow.m_clip[i];
				var p2d = _obj.GetCComponent(Df.CComponent.CPaint)[ccodi.m_paintOff];
				if (p2d != null && p2d instanceof CPaint2D)
				{
					var tex = CRes.get(p2d.texture.front());
					if (tex != null)
					{
						p2d.SetTexCodi(ccodi.m_stX, ccodi.m_stY, ccodi.m_edX, ccodi.m_edY,
							tex.GetWidth(), tex.GetHeight());
					}
				}

			}
			else if (_flow.m_clip[i] instanceof CClipRGBA)
			{
				var crgba = _flow.m_clip[i];
				var pst = _flow.m_time - _flow.m_clip[i].m_time;
				var pt = _obj.GetCComponent(Df.CComponent.CPaint)[crgba.m_paintOff];
				if (pt != null)
				{
					//float pst;
					if (_flow.m_clip[i].m_delay != 0)
						pst = pst / (_flow.m_clip[i].m_delay);
					else
						pst = 0;
					var last=new CVec4();
					last.x = CMath.FloatInterpolate(crgba.m_st.x, crgba.m_ed.x, pst); 
					last.y = CMath.FloatInterpolate(crgba.m_st.y, crgba.m_ed.y, pst);
					last.z = CMath.FloatInterpolate(crgba.m_st.z, crgba.m_ed.z, pst);
					last.w = CMath.FloatInterpolate(crgba.m_st.w, crgba.m_ed.w, pst);
					pt.SetRGBA(last);
				}
			}
			else if (_flow.m_clip[i] instanceof CClipPhysics)
			{
				var cphy = _flow.m_clip[i];
				var pst = _flow.m_time - _flow.m_clip[i].m_time;
				//float pst;
				if (_flow.m_clip[i].m_delay != 0)
					pst = pst / (_flow.m_clip[i].m_delay);
				else
					pst = 0;
				if (cphy.m_posUse)
				{
					var last=new CVec3();
					
					if (cphy.m_posAdd)
					{
						last.x = CMath.FloatInterpolate(0, cphy.m_pos.x, pst);
						last.y = CMath.FloatInterpolate(0, cphy.m_pos.y, pst);
						last.z = CMath.FloatInterpolate(0, cphy.m_pos.z, pst);

						if (cphy.m_posLocal)
						{
							var p2d = _obj.GetCComponent(Df.CComponent.CPaint)[cphy.m_paintOff];
							p2d.SetPos(CMath.Vec3PlusVec3(this.m_pos, last));
						}
							
						else
							_obj.SetPos(CMath.Vec3PlusVec3(this.m_pos, last), false);
					}
					else
					{
						last.x = CMath.FloatInterpolate(this.m_pos.x, cphy.m_pos.x, pst);
						last.y = CMath.FloatInterpolate(this.m_pos.y, cphy.m_pos.y, pst);
						last.z = CMath.FloatInterpolate(this.m_pos.z, cphy.m_pos.z, pst);
						_obj.SetPos(last,false);
					}
					
				}
				if (cphy.m_rotUse)
				{
					var last=CMath.QutInterpolate(this.m_rot, cphy.m_rot, pst);
					_obj.SetRot(last, false);
				}
				if (cphy.m_scaUse)
				{
					var last=new CVec3();
					last.x = CMath.FloatInterpolate(this.m_sca.x, cphy.m_sca.x, pst);
					last.y = CMath.FloatInterpolate(this.m_sca.y, cphy.m_sca.y, pst);
					last.z = CMath.FloatInterpolate(this.m_sca.z, cphy.m_sca.z, pst);
					_obj.SetSca(last, false);
				}
				_obj.PRSReset();

			}
			else if (_flow.m_clip[i] instanceof CClip3D)
			{
				var cimg = _flow.m_clip[i];
				var p3d = _obj.GetCComponent(Df.CComponent.CPaint)[cimg.m_paintOff];
				
				
				if (p3d != null && p3d instanceof CPaint3D)
				{
					var mcir = p3d.GetTree();
					var lmesh = CRes.get(p3d.GetMesh());
					if(lmesh==null || mcir==null)
						return;
					
					var mdr = lmesh.meshTree;

					var bcopy = false;
					var node=new Array();
					node.push_back(new CMeshNode(mdr.m_root, mcir.m_root));
					if (cimg.m_ipEd != 0)
					{
						if (cimg.m_ipSt == 0)
						{
							bcopy = true;
						}
						cimg.m_ipSt += _delay * _obj.GetSpeed();
						if (cimg.m_ipSt > cimg.m_ipEd)
						{
							cimg.m_ipEd = 0;
							cimg.m_ipSt = 0;
							_flow.m_time = 0;
						}
					}
					while (node.empty() == false)
					{
						if (cimg.m_ipEd != 0)
						{
							if (bcopy)
							{
								node.front().mpi.data.bpos = node.front().mpi.data.pos;
								node.front().mpi.data.brot = node.front().mpi.data.rot;
								node.front().mpi.data.bsca = node.front().mpi.data.sca;
							}
							CAnimation.TreeUpdateInter(cimg.m_st, node.front().md.data, node.front().mpi.data, node.front().sum,cimg.m_ipSt/cimg.m_ipEd);
						}
						else
							CAnimation.UpdateTree(_flow.m_time*cimg.m_speed+cimg.m_st, node.front().md.data, node.front().mpi.data, node.front().sum);


						if (node.front().md.childe != null)
						{
							node.push_back(new CMeshNode(node.front().md.childe, node.front().mpi.childe));
							node.back().sum = node.front().mpi.data.pst;
						}

						if (node.front().md.colleague != null)
						{
							node.push_back(new CMeshNode(node.front().md.colleague, node.front().mpi.colleague));
							node.back().sum = node.front().sum;
						}

						node.splice(0,1);

					}
				}//if
			}
			else if (_flow.m_clip[i] instanceof CClipPaint)
			{
				var cpt = _flow.m_clip[i];
				
				if (cpt.m_cpaint == DfCPaint.Null)
					_obj.RemoveAllCComponent(Df.CComponent.CPaint);
				else if(cpt.m_paintOff >= _obj.GetCComponent(Df.CComponent.CPaint).size())
				{
					if (cpt.m_cpaint == DfCPaint.D2)
					{
						_obj.PushCComponent(new CPaint2D(cpt.m_size, ""));
					}
					else if (cpt.m_cpaint == DfCPaint.Billbord)
					{
						_obj.PushCComponent(new CPaintBillbord(cpt.m_size, ""));
					}
					else if (cpt.m_cpaint == DfCPaint.D3)
					{
						_obj.PushCComponent(new CPaint3D(""));
					}
					else
						CMsg.E("unknow");
				}
			
				
			}
			


			if (_flow.m_clip[i].m_time + _flow.m_clip[i].m_delay <= _flow.m_time)
			{
				_flow.m_clip.splice(i,1);
				i--;
			}
			if (_flow.m_clip.size() == 0 && _flow.m_offset >= this.m_clip.size() && this.m_remove)
				return true;
		}

		return false;
	}
	Serialize()
	{
		var pac = new CPacket();
		pac.name="CAnimation";
		pac.Push(super.Serialize());
		pac.Push(this.m_key);
		pac.Push(this.m_loop);
		pac.Push(this.m_remove);
		pac.Push(this.m_clip);
		
		
		return pac;
	}
	Deserialize(_str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		this.m_key = pac.GetString(1);
		this.m_loop = pac.GetBool(2);
		this.m_remove = pac.GetBool(3);

		var pac2 = new CPacket();
		pac2.Deserialize(pac.GetString(4));
		for (let each0 of pac2.value)
		{
			var pac3 = new CPacket();
			pac3.Deserialize(each0);
			var img = null;
			if (pac3.name.equals("CClipImg"))
				img = new CClipImg();
			else if (pac3.name.equals("CClipCoodi"))
				img = new CClipCoodi();
			else if (pac3.name.equals("CClipRGBA"))
				img = new CClipRGBA();
			else if (pac3.name.equals("CClipMesh"))
				img = new CClipMesh();
			else if (pac3.name.equals("CClipPaint"))
				img = new CClipPaint();
			else if (pac3.name.equals("CClip3D"))
				img = new CClip3D();
		
			img.Deserialize(each0);
			this.m_clip.push_back(img);
		}
		
		

	}
	static TreeUpdateInter(_delay,_md,_mci,_all,_pst)
	{
		var delay = _delay * 46186158;

		var pos=new CVec3();
		var rot=new CVec3();
		var sca=new CVec3();

		var akf = null;
		if (_md.keyFramePos.size() > 1)
		{
			for (var i = 1; i < _md.keyFramePos.size(); ++i)
			{
				if (delay < _md.keyFramePos[i].key)
				{
					akf = _md.keyFramePos[i];
					break;
				}
			}
		}

		if (akf != null)
		{
		
			_mci.pos.x = CMath.FloatInterpolate(_mci.bpos.x, akf.value.x, _pst);
			_mci.pos.y = CMath.FloatInterpolate(_mci.bpos.y, akf.value.y, _pst);
			_mci.pos.z = CMath.FloatInterpolate(_mci.bpos.z, akf.value.z, _pst);
		}


		
		akf = null;
		if (_md.keyFrameRot.size() > 1)
		{
			for (var i = 1; i < _md.keyFrameRot.size(); ++i)
			{
				if (delay < _md.keyFrameRot[i].key)
				{
					akf = _md.keyFrameRot[i];
					break;
				}
			}
		}

		if (akf != null)
		{
			_mci.rot.x = CMath.FloatInterpolate(_mci.brot.x, akf.value.x, _pst);
			_mci.rot.y = CMath.FloatInterpolate(_mci.brot.y, akf.value.y, _pst);
			_mci.rot.z = CMath.FloatInterpolate(_mci.brot.z, akf.value.z, _pst);

		}

		akf = null;
		if (_md.keyFrameSca.size() > 1)
		{
			for (var i = 1; i < _md.keyFrameSca.size(); ++i)
			{
				if (delay < _md.keyFrameSca[i].key)
				{
					akf = _md.keyFrameSca[i];
					break;
				}
			}
		}

		if (akf != null)
		{
			_mci.sca.x = CMath.FloatInterpolate(_mci.bsca.x, akf.value.x, _pst);
			_mci.sca.y = CMath.FloatInterpolate(_mci.bsca.y, akf.value.y, _pst);
			_mci.sca.z = CMath.FloatInterpolate(_mci.bsca.z, akf.value.z, _pst);
		}
		_mci.PRSReset();
		_mci.pst = CMath.MatMul(_mci.pst, _all);
	}
	static UpdateTree(_delay,_md,_mci,_all)
	{	
		var delay = _delay * 46186158;
		var bkf = null;
		var akf = null;
		if (_md.keyFramePos.size() > 1)
		{
			for (var i = 1; i < _md.keyFramePos.size(); ++i)
			{
				if (delay < _md.keyFramePos[i].key)
				{
					bkf = _md.keyFramePos[i - 1];
					akf = _md.keyFramePos[i];
					break;
				}
			}
		}
		
		if (bkf != null)
		{
			var pst = (delay - bkf.key) / (akf.key - bkf.key*1.0);

			_mci.pos.x = CMath.FloatInterpolate(bkf.value.x, akf.value.x, pst);
			_mci.pos.y = CMath.FloatInterpolate(bkf.value.y, akf.value.y, pst);
			_mci.pos.z = CMath.FloatInterpolate(bkf.value.z, akf.value.z, pst);
		}
		

		bkf = null;
		akf = null;
		if (_md.keyFrameRot.size() > 1)
		{
			for (var i = 1; i < _md.keyFrameRot.size(); ++i)
			{
				if (delay < _md.keyFrameRot[i].key)
				{
					bkf = _md.keyFrameRot[i - 1];
					akf = _md.keyFrameRot[i];
					break;
				}
			}
		}
		
		if (bkf != null)
		{
			var pst = (delay - bkf.key) / (akf.key - bkf.key*1.0);
			_mci.rot.x = CMath.FloatInterpolate(bkf.value.x, akf.value.x, pst);
			_mci.rot.y = CMath.FloatInterpolate(bkf.value.y, akf.value.y, pst);
			_mci.rot.z = CMath.FloatInterpolate(bkf.value.z, akf.value.z, pst);
			//_mci.rot = CMath.QutInterpolate(bkf.value, akf.value, pst);
		}


		bkf = null;
		akf = null;
		if (_md.keyFrameSca.size() > 1)
		{
			for (var i = 1; i < _md.keyFrameSca.size(); ++i)
			{
				if (delay < _md.keyFrameSca[i].key)
				{
					bkf = _md.keyFrameSca[i - 1];
					akf = _md.keyFrameSca[i];
					break;
				}
			}
		}
		
		if (bkf != null)
		{
			var pst = (delay - bkf.key) / (akf.key - bkf.key*1.0);

			_mci.sca.x = CMath.FloatInterpolate(bkf.value.x, akf.value.x, pst);
			_mci.sca.y = CMath.FloatInterpolate(bkf.value.y, akf.value.y, pst);
			_mci.sca.z = CMath.FloatInterpolate(bkf.value.z, akf.value.z, pst);
		}
		_mci.PRSReset();
		_mci.pst = CMath.MatMul(_mci.pst, _all);

		
	}
	NewClip(_clip)
	{
		this.m_clip.push_back(_clip);
		return _clip;
	}
};

class CAniListDummy
{
	constructor()
	{
		this.m_ani=new Array();
	}
	Parse(_str)
	{
		this.m_ani.clear();
		var pac=new CPacket();
		pac.Deserialize(_str);
		var pac2=new CPacket();
		pac2.Deserialize(pac.GetString(0));
		
		for(var i=0;i<pac2.value.size();++i)
		{
			var ani = new CAnimation();
			ani.Deserialize(pac2.value[i]);
			
			for (var j = 0; j < ani.m_clip.size(); ++j)
			{
				if (ani.m_clip[j] instanceof CClipImg)
				{
					var imgStr = ani.m_clip[j].m_img;
					CUtil.TextureLoad(imgStr);
				}
				else if (ani.m_clip[j] instanceof CClipMesh)
				{
					var cm = ani.m_clip[j];
					if(cm.m_vf== DfCPaint.D3)
						CUtil.MeshLoad(cm.m_mesh, CPalette.GetVfSimple(),true);
					else
						CUtil.MeshLoad(cm.m_mesh, CPalette.GetVfSkin(), true);
					
				}

			}
			
			this.m_ani.push_back(ani);
			
		}
	}

	Find(_off)
	{
		if( typeof _value =="string")
		{
			for (var each0 of this.m_ani)
			{
				if (each0.GetKey().equals(_name))
				{
					return  each0;
				}
			}
			return null;
		}
		
		return this.m_ani[_off];
	}
	GetAni()	{	return this.m_ani;	}
}
var CAniSC=new CAniListDummy();