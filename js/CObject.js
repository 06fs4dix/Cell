class CObject extends CRenObj
{
	constructor()
	{
		super();
		
		
		this.m_parent = null;
		this.m_childe=new Array();
		this.m_pMat=new CMat();
		
		
		
		this.m_ptVec=new Array();
		this.m_rbVec=new Array();
		this.m_clVec=new Array();
		this.m_enVec=new Array();
		this.m_aniVec=new Array();
		this.m_flow=new Array();

		
		this.m_pos =new CVec3();
		this.m_sca =new CVec3(1,1,1);
		this.m_rot =new CVec4();
		this.m_preRot=null;//web 전용
		this.m_wMat =new CMat();
		this.m_speed=1.0;
	}
	
	GetBound()
	{
		if(this.m_clVec.empty())
			return null;
		var cl=this.m_clVec[0];
		var bound=cl.GetBound().toCopy();
		bound.min = CMath.MatToVec3Normal(bound.min, cl.GetLMat());
		bound.min.z=bound.min.y;
		bound.max = CMath.MatToVec3Normal(bound.max, cl.GetLMat());
		bound.max.z=bound.max.y;

		var maxVal = CMath.Max(bound.max.x, bound.max.y);
		maxVal = CMath.Max(maxVal, bound.max.z);
		bound.min.x = -maxVal;
		bound.max.x = maxVal;
		bound.min.y = -maxVal;
		bound.max.y = maxVal;
		bound.min.z = -maxVal;
		bound.max.z = maxVal;
		
		return bound;
	}
	CallRemoveCComponent(_com)
	{

		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].EICompontRemove(_com);
			}
		}
	}
	GetShow()	{	return this.m_show;	}
	SetShow(_show)	{	this.m_show=_show;	}
	SetPMat(_mat) { this.m_pMat = _mat;	 }
	SetParent(_obj)
	{
		this.m_parent = _obj;
		if (this.m_parent != null)
		{
			this.m_parent.m_childe.push_back(this);
			this.m_parent.PRSReset();
		}
		else
			this.m_pMat =new CMat();
	}
	PushChilde(_obj)
	{ 
		_obj.SetParent(this); 
	}

	RemoveChilde(_obj)
	{
		for (var i = 0; i < this.m_childe.size(); ++i)
		{
			if (this.m_childe[i] == _obj)
			{
				this.m_childe.splice(i,1);
				break;
			}
		}
	}
	
	GetSpeed() {return this.m_speed;	};
	SetSpeed(_speed) {	this.m_speed = _speed;	}
	GetCComponent(_type)
	{
		switch (_type)
		{
			case Df.CComponent.CPaint:	return this.m_ptVec;
			case Df.CComponent.CRigidbody:	return this.m_rbVec;
			case Df.CComponent.CCollider:	return this.m_clVec;
			case Df.CComponent.CEventComponent:	return this.m_enVec;
		}
		return new Array();
	}
	PushCComponent(_com)
	{
		if (_com.GetCComponentType() == Df.CComponent.CPaint)
		{
			this.m_ptVec.push_back(_com);
			this.PRSReset();
		}
		else if (_com.GetCComponentType() == Df.CComponent.CRigidbody)
		{
			this.m_rbVec.push_back(_com);
		}
		else if (_com.GetCComponentType() == Df.CComponent.CCollider)
		{
			this.m_clVec.push_back(_com);
		}
		else if (_com.GetCComponentType() == Df.CComponent.CEventComponent)
		{
			var dum = _com;
			dum.SetCObject(this);
			dum.Init();
			this.PRSReset();
			this.m_enVec.push_back(_com);
		}
		else if (_com.GetCComponentType() == Df.CComponent.CAnimation)
		{
			this.m_aniVec.push_back(_com);
			this.m_flow.push_back(new CFlow());
			this.m_aniVec.back().Update(this.m_flow.back(), this, 1);
		}
	}
	NewCComponent(_dummy)
	{
		this.PushCComponent(_dummy);
		return _dummy;
	}

	GetCComponentKey(_key)
	{
		var com=new Array();
		for (var i = 0; i < m_ptVec.size(); ++i)
		{
			if (this.m_ptVec[i].GetKey().equals(_key))
				com.push_back(this.m_ptVec[i]);
		}
		for (var i = 0; i < m_rbVec.size(); ++i)
		{
			if (this.m_rbVec[i].GetKey().equals(_key))
				com.push_back(this.m_rbVec[i]);
		}
		for (var i = 0; i < m_clVec.size(); ++i)
		{
			if (this.m_clVec[i].GetKey().equals(_key))
				com.push_back(this.m_clVec[i]);
		}
		for (var i = 0; i < m_enVec.size(); ++i)
		{
			if (this.m_enVec[i].GetKey().equals(_key))
				com.push_back(this.m_enVec[i]);
		}
		for (var i = 0; i < m_aniVec.size(); ++i)
		{
			if (this.m_aniVec[i].GetKey().equals(_key))
				com.push_back(this.m_aniVec[i]);
		}
		return com;
	}
	
	RemoveAllCComponent(_type)
	{
		if (_type == Df.CComponent.CPaint)
		{
			for (var i = 0; i < this.m_ptVec.size(); ++i)
			{
				this.CallRemoveCComponent(this.m_ptVec[i]);
			}
			this.m_ptVec.clear();
		}
		else if (_type == Df.CComponent.CRigidbody)
		{
			for (var i = 0; i < this.m_rbVec.size(); ++i)
			{
				this.CallRemoveCComponent(this.m_rbVec[i]);
			}
			this.m_rbVec.clear();
		}
		else if (_type == Df.CComponent.CCollider)
		{
			for (var i = 0; i < this.m_clVec.size(); ++i)
			{
				this.CallRemoveCComponent(this.m_clVec[i]);
			}
			this.m_clVec.clear();
		}
		else if (_type == Df.CComponent.CEventComponent)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.CallRemoveCComponent(this.m_enVec[i]);
			}
			this.m_enVec.clear();
		}
		else if (_type == Df.CComponent.CAnimation)
		{
			for (var i = 0; i < this.m_aniVec.size(); ++i)
			{
				this.CallRemoveCComponent(this.m_aniVec[i]);
			}
			this.m_aniVec.clear();
			this.m_flow.clear();
		}
	}
	
	
	
	GetWMat() 
	{ 
		if (this.m_parent != null)
			return CMath.MatMul(this.m_wMat,this.m_pMat);
		return this.m_wMat.toCopy();
	}
	GetPos() { return this.m_pos.toCopy(); }
	GetRot() { return this.m_rot.toCopy(); };
	GetSca() { return this.m_sca.toCopy(); };
	
	SetPos(_pos,_reset)
	{
		this.m_pos = _pos.toCopy();
	
		if(typeof _reset == 'undefined' || _reset)
			this.PRSReset();
	}
	SetRot(_rot,_reset)
	{
		this.m_rot = _rot.toCopy();
		if(typeof _reset == 'undefined' || _reset)
			this.PRSReset();
	}
	SetSca(_sca,_reset)
	{
		this.m_sca = _sca.toCopy();
		if(typeof _reset == 'undefined' || _reset)
			this.PRSReset();
	}
	PRSReset()
	{
		var scaMat=new CMat();
		var rotMat=new CMat();
		scaMat = CMath.MatScale(this.m_sca);
		rotMat = CMath.QutToMatrix(this.m_rot);

		this.m_wMat = CMath.MatMul(scaMat, rotMat);

		this.m_wMat.arr[3][0] = this.m_pos.x;
		this.m_wMat.arr[3][1] = this.m_pos.y;
		this.m_wMat.arr[3][2] = this.m_pos.z;
		for (var i = 0; i < this.m_childe.size(); ++i)
		{
		
			this.m_childe[i].SetPMat(CMath.MatMul(this.m_wMat, this.m_pMat));

		}
	}
	Render(_cam)
	{
		if (this.m_show == false)
			return;
		
		for (var i = 0; i < this.m_ptVec.size(); ++i)
		{
			var paint = this.m_ptVec[i];
			
			var all =new CMat(); 
			
	
			if (paint.GetCPaintType() == DfCPaint.Billbord)
			{
				all = CMath.MatMul(this.m_wMat, this.m_pMat);
				var inMat = CMath.MatInvert(_cam.GetViewMat());
				var rote = CMath.MatRotExport(inMat, true, true, true);
				//CMat rote = CMath.MatRotExport(inMat, false, false, false);

				//속도 저하로 미리 계산함
				if(this.m_preRot==null)
					this.m_preRot = CMath.MatRotation(new CVec3(3.141592, 0,0));
				rote = CMath.MatMul(this.m_preRot, rote);

				paint.FinalMatCac(all, rote);
			}
			else
			{
				paint.FinalMatCac(this.m_wMat, this.m_pMat);
			}

			//paint.Render();
		}
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].Render();
			}
		}
	}
	Update(_delay)
	{
		if (this.m_rbVec.empty() == false)
		{
			for (var i = 0; i < this.m_rbVec.size(); ++i)
			{
				this.m_pos =this.m_rbVec[i].Update(this.m_pos,_delay);
			}
			this.PRSReset();
		}
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].Update(_delay);
			}
		}
		if (this.m_aniVec.empty() == false)
		{
			var rcom=new Array();
			for (var i = 0; i < this.m_aniVec.size(); ++i)
			{
				if (this.m_aniVec[i].Update(this.m_flow[i], this, _delay))
				{
					rcom.push_back(i);
				}
			}
			for (var i = rcom.size()-1; i >=0 ; --i)
			{
				this.CallRemoveCComponent(this.m_aniVec[rcom[i]]);
				this.m_aniVec.splice(rcom[i],1);
				this.m_flow.splice(rcom[i],1);

			}
		}
	}
	LastUpdate(_delay)
	{

		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].LastUpdate(_delay);
			}
		}
	}
	Collision(_com,_col,_len)
	{
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].ECollision(_com,_col,_len);
			}
		}
	}
	Pick(_com, _pos)
	{
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].EPick(_com, _pos);
			}
		}
	}
	CameraOut(_com)
	{
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].ECameraOut(_com);
			}
		}
	}
	CameraJoin(_com,_joinPlane)
	{
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].ECameraJoin(_com, _joinPlane);
			}
		}
	}
	GetCRenObjType() { return DfCRenObj.CObject; }
	Destroy() 
	{
		this.m_remove = true; 
		if (this.m_parent != null)
		{
			this.m_parent.RemoveChilde(this);
		}
		
		for (var i = 0; i < this.m_childe.size(); ++i)
		{
			this.m_childe[i].SetParent(null);
			this.m_childe[i].Destroy();
		}
	}
	CanvasDelete()
	{
		if (this.m_enVec.empty() == false)
		{
			for (var i = 0; i < this.m_enVec.size(); ++i)
			{
				this.m_enVec[i].CanvasDelete();
			}
		}
	}
	
	GetCPaint()
	{
		if(this.m_show==false)
			return new Array();
		return this.m_ptVec;
	}
	Serialize()
	{
		var pac=new CPacket();
		pac.Push(super.Serialize());
		
		pac.Push(this.m_pos);
		pac.Push(this.m_rot);
		pac.Push(this.m_sca);
		
		pac.Push(this.m_speed);
		pac.Push(this.m_ptVec);
		pac.Push(this.m_rbVec);
		pac.Push(this.m_clVec);
		pac.Push(this.m_aniVec);

		return pac;
	}
	Deserialize(_str)
	{
		var pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		
		this.m_pos.Deserialize(pac.GetString(1));
		this.m_rot.Deserialize(pac.GetString(2));
		this.m_sca.Deserialize(pac.GetString(3));
		this.m_speed = pac.GetFloat(4);
		
		var pac0=new CPacket();
		pac0.Deserialize(pac.GetString(5));
		for (var each0 of pac0.value)
		{
			var pt = null;
			var pacDum = new CPacket();
			pacDum.Deserialize(each0);
			if (pacDum.name.equals("CPaint2D"))
				pt = new CPaint2D();
			else if (pacDum.name.equals("CPaintBillbord"))
				pt = new CPaintBillbord();
			else if (pacDum.name.equals("CPaint3D"))
				pt = new CPaint3D();
			else
				CMsg.E("미정의");
			pt.Deserialize(each0);
			this.PushCComponent(pt);
		}
		pac0.Deserialize(pac.GetString(6));
		for (var each0 of pac0.value)
		{
			var rb = new CRigidBody();
			rb.Deserialize(each0);
			this.PushCComponent(rb);
		}
		pac0.Deserialize(pac.GetString(7));
		for (var each0 of pac0.value)
		{
			var cl = new CCollider();
			cl.Deserialize(each0);
			this.PushCComponent(cl);
		}
		pac0.Deserialize(pac.GetString(8));
		for (var each0 of pac0.value)
		{
			var ani = new CAnimation();
			ani.Deserialize(each0);
			this.PushCComponent(ani);
		}
	}
}