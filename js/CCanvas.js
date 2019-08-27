class CCanvasPaintVec
{
	constructor()
	{
		this.paint=new Array();
		this.vf=null;
		this.priority=0;
	}
}
var g_cpMap=new Map();
class CCanvas
{
	constructor(_cam)
	{
		this.m_obj=new Map();
		this.m_cam=_cam;
		this.m_colCan=new Array();
	}
	PushColCan(_can) { this.m_colCan.push_back(_can); }
	GetCam(){	return this.m_cam;	}
	GlobalReset(_vf){}
	Update(_delay)
	{
		var removeList=new Array();
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			if (each0.GetRemove())
			{
				removeList.push_back(eachKey[0]);
				continue;
			}
		}
		for (var each0 of removeList)
		{
			this.m_obj.delete(each0);			
		}
		
		
		var keyChangeList=new Array();
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			each0.Update(_delay);
			if (each0.GetKeyChange().isEmpty() == false)
			{
				keyChangeList.add(new CPairStrStr(each0.GetKeyChange(), each0.GetKey()));
				if (this.Find(each0.GetKey()) != null)
					CMsg.E("key already!");
			}
		}
		for (var each0 of keyChangeList)
		{
			this.KeyChange(each0.first, each0.second);
		}

		
		
		//var ray = this.m_cam.GetRay(CInput.PosX(0), CInput.PosY(0));
		var rayVec=new Array();
		for (var i = 0; i < CInput.TouchCount(); ++i)
		{
			rayVec.push_back(this.m_cam.GetRay(CInput.PosX(i), CInput.PosY(i)));
		}
		var plane = this.m_cam.GetPlane();
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			if (each0.GetCRenObjType() == DfCRenObj.CObject)
			{
				var iobj = each0;
					
				var icom = iobj.GetCComponent(Df.CComponent.CCollider);
				for (var k = 0; k < icom.size(); ++k)
				{
					var ic = icom[k];
					ic.m_update.Reset(iobj, rayVec, plane);
					ic.m_update.PushObjectMap(this.m_obj);
					for (var each1 of this.m_colCan)
					{
						ic.m_update.PushObjectMap(each1.GetObjectMap());
					}
					
					ic.Update(_delay);
				}
			}
		
		}

		//이벤트 호출
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			if (each0.GetCRenObjType() == DfCRenObj.CObject)
			{
				var iobj = each0;
					
				var icom = iobj.GetCComponent(Df.CComponent.CCollider);
				for (var k = 0; k < icom.size(); ++k)
				{
					var ic = icom[k];
					if (ic.m_update.pick.IsZero() == false)
					{
						iobj.Pick(ic, ic.m_update.pick);
					}
					if (ic.m_update.out)
					{
						iobj.CameraOut(ic);
					}
					if (ic.m_update.join.empty() == false)
					{
						iobj.CameraJoin(ic, ic.m_update.join);
					}
					for (var j = 0; j < ic.m_update.colObj.size(); ++j)
					{
						iobj.Collision(ic, ic.m_update.colObj[j], ic.m_update.colLen[j]);
					}
				}
			}

		}
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			each0.LastUpdate(_delay);
		}
		
		
		
		
	}//update
	Render()
	{
		var renderOrder=new Array();
		for (var each0 of g_cpMap)
		{
			each0[1].paint.clear();
		}
		var bfv=null;
		for (var eachKey of this.m_obj)
		{
			var each0=eachKey[1];
			
			var ptVec = each0.GetCPaint();
			if (ptVec.empty() || each0.GetShow()==false)
				continue;
			for (var each1 of ptVec)
			{
				var vf = each1.GetVf();
				if(vf==null)
					continue;
				var vfprKey = vf.m_key+ each1.GetPriority();
				if(g_cpMap.get(vfprKey)==null)
				{
					var dum=new CCanvasPaintVec();
					dum.vf=vf;
					dum.priority=each1.GetPriority();
					
					g_cpMap.set(vfprKey,dum);
				}
				var pt=g_cpMap.get(vfprKey);
				if (pt.paint.empty())
					renderOrder.push_back(pt);
				
				pt.paint.push_back(each1);

			}
			
			
			each0.Render(this.m_cam);
		}
		for (var i = 0; i < renderOrder.size(); ++i)
		{
			var minVal= renderOrder[i].priority;
			var minOff=i;
			for (var j = i+1; j < renderOrder.size(); ++j)
			{
				if (renderOrder[j].priority < minVal)
				{
					minVal = renderOrder[j].priority;
					minOff = j;
				}
			}
			if (minOff != i)
			{
				var dummy = renderOrder[i];
				renderOrder[i] = renderOrder[minOff];
				renderOrder[minOff] = dummy;
			}
		}
		
		for (var each0 of renderOrder)
		{
			CWindow.RMgr().SetShader(each0.vf);
			CWindow.RMgr().SetTexture(each0.vf, CPalette.GetNoneTex());
			CWindow.RMgr().SetValue(each0.vf, "viewMat", this.m_cam.GetViewMat());
			CWindow.RMgr().SetValue(each0.vf, "projectMat", this.m_cam.GetProjMat());
			CWindow.RMgr().SetValue(each0.vf, "farClip", this.m_cam.GetFar());
			if (each0.vf.GetUniform("camPos") != null)
				CWindow.RMgr().SetValue(each0.vf, "camPos", this.m_cam.GetEye());
			this.GlobalReset(each0.vf);
			
			for (var each1 of each0.paint)
			{
				CWindow.RMgr().SetShader(each0.vf);
				each1.Render();
			}
			
		}
		
	}
	GetObjectMap() { return this.m_obj; }

	Find(_key)
	{
		return this.m_obj.get(_key);
	}
	Push(_obj)
	{
		if (_obj.GetKey().isEmpty())
		{
			_obj.SetKey(CRand.RandStr());
			
		}
		this.m_obj.set(_obj.GetKey(),_obj);
		_obj.ClearKeyChange();
	}
	New(_dummy)
	{
		_dummy.SetKey(CRand.RandStr());
		_dummy.ClearKeyChange();
		this.m_obj.set(_dummy.GetKey(),_dummy);
		return this.m_obj.get(_dummy.GetKey());
	}
	KeyChange(_org, _tar)
	{
		var obj=this.m_obj.get(_org);
		if (obj==null)
		{
			return;
		}

		obj.SetKey(_tar);
		obj.ClearKeyChange();
		this.m_obj.set(_tar,obj);
		this.m_obj.delete(_org);
	}
	FindNearCObject(_pos,_len)
	{
		var rVal = new Array();
		
		for (var eachKey of this.m_obj)
		{
			var obj = eachKey[1];
			if (obj != null)
			{
				var len=CMath.Vec3Lenght(CMath.Vec3MinusVec3(_pos, obj.GetPos()));
				if (len < _len)
				{
				
					rVal.push_back(obj);
				}
			}
		}
		return rVal;
	}
}
//=========================================================================
class CCanvas2D extends CCanvas
{
	constructor(_cam)
	{
		super(_cam);
	}
	Init()
	{
		var stx = CRoot.m_realWidth*0.5;
		var sty = CRoot.m_realHeight*0.5;
		this.m_cam.Init(new CVec3(stx, sty, 100),new CVec3(stx, sty, 0));
		this.m_cam.ZAxisRotation(3.141592);
		this.m_cam.Reset2D();
	}

}
//=========================================================================
class CCanvas3D extends CCanvas
{
	constructor(_cam)
	{
		super(_cam);
		this.m_ligDirect=new CVec3(0,1,0);
		this.m_ligColor=new CVec3(1,1,1);
		this.m_cutPos=new CVec3();
		this.m_cutLen=0;
	}
	SetCutPos(_pos) { this.m_cutPos = _pos; }
	SetCutLen(_len) { this.m_cutLen = _len; }
	Init()
	{
		this.m_cam.Init(new CVec3(0, 1000, 1),new CVec3(0, 0, 0));
		this.m_cam.Reset3D();
	}
	GlobalReset(_vf)
	{
		if (_vf.GetUniform("ligDirect") != null)
			CWindow.RMgr().SetLight(_vf, this.m_ligDirect, this.m_ligColor);
		if (_vf.GetUniform("maDiffuse") != null)
		{
			var mat=new CMaterial();
			CWindow.RMgr().SetMaterial(_vf, mat);
		}
	}
	SetLigDirect(_dir) { this.m_ligDirect = _dir;	 }
	SetLigColor(_col) { this.m_ligColor = _col; }
	Update(_delay)
	{
		super.Update(_delay);
		if (this.m_cutPos.IsZero() == false)
		{
			for (var eachKey of this.m_obj)
			{
				var obj = eachKey[1];
				if (obj != null)
				{
					var len = CMath.Vec3Lenght(CMath.Vec3MinusVec3(this.m_cutPos, obj.GetPos()));
					if (this.m_cutLen > len)
						obj.SetShow(true);
					else
						obj.SetShow(false);
				}
			}
		}
	}
}