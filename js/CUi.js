//var g_hotkeyLock=false;
function JSDfUiEvent()
{
	this.Click = 0;
	this.HotKey = 1;
	this.Press = 2;
	this.LongPressDown = 3;
	this.LongPressUp = 4;
	this.Pick = 5;
	this.Null = 6;
};
var DfUiEvent=new JSDfUiEvent();

var g_eventLock = false;
var g_moveMode = false;
var g_pickMove = null;

class CUi extends CObject
{
	constructor()
	{
		super();
		this.m_mPress = false;
		this.m_hotkey=-1;
		this.m_move=false;
		this.m_long=-1;
		
		
		this.m_lastEvent = DfUiEvent.Null;
		this.m_uiPt = null;
		this.m_uiCl = null;
		this.m_clickEvent=new CEvent();
		this.m_hotkeyEvent=new CEvent();
		this.m_pressEvent=new CEvent();
		this.m_longEvent=new CEvent();
		this.m_clickChk=-1;
	}
	SetLongPress(_enable)
	{
		if (_enable)
			this.m_long = 0;
		else
			this.m_long - 1;
	}
	GetLastEvent() { return this.m_lastEvent; }
	static MoveMode(_enable)
	{
		g_moveMode = _enable;
		if (g_moveMode)
		{
			g_eventLock = false;
			//g_ScaPlus
		}		
		else
			g_eventLock = true;
		this.AddCCollider();
	}
	SetMove(_enable)
	{
		this.m_move = _enable;
		this.AddCCollider();
	}
	

	AddCCollider()
	{
		if (this.m_uiPt == null)
			return;
		if (this.m_uiCl != null)
		{
			this.m_uiCl.Init(this.m_uiPt);
			return;
		}
			
		this.m_uiCl = new CCollider(this.m_uiPt);
		this.m_uiCl.SetPick(true);
		this.m_uiCl.SetColliderType(DfColliderType.Box);
		this.PushCComponent(this.m_uiCl);
	}
	

	SetSize(_width,_height)
	{
		this.m_uiPt.SetSize(new CVec2(_width, _height));
		this.AddCCollider();
	}
	PivotCenter(_enable)
	{
		if (_enable)
			this.m_uiPt.SetPivot(new CVec3(0, 0, 0));
		else
			this.m_uiPt.SetPivot(new CVec3(1, 1, 1));

		this.AddCCollider();
	}
	SetPivot(_pivot)
	{
		this.m_uiPt.SetPivot(_pivot);
	}
	SetClickEvent(_event)
	{
		this.m_clickEvent = _event;
		this.AddCCollider();
	}
	SetPressEvent(_event)
	{
		this.m_pressEvent = _event;
		this.AddCCollider();
	}
	SetLongEvent(_event)
	{
		this.m_longEvent = _event;
		this.AddCCollider();
	}
	SetScreenToWidth(_val)
	{
		this.SetSize(CRoot.m_realWidth*_val, this.m_uiPt.GetSize().y);
	}
	SetScreenToHeight(_val)
	{
		this.SetSize(this.m_uiPt.GetSize().x, CRoot.m_realHeight*_val);
	}
	SetScreenToPosX(_val)
	{
		this.SetPos(new CVec3(CRoot.m_realWidth*_val, this.m_pos.y, this.m_pos.z));
	}
	SetScreenToPosY(_val)
	{
		this.SetPos(new CVec3(this.m_pos.x, CRoot.m_realHeight*_val, this.m_pos.z));
	}
	SetRGBA(_RGBA)
	{
		this.m_uiPt.SetRGBA(_RGBA);
	}
	SetTexture(_tex)
	{
		if (CRes.get(_tex) == null)
			CUtil.TextureLoad(_tex);
		this.m_uiPt.SetTexture(_tex);
	}
	Pick(_com,_pos)
	{
		
		super.Pick(_com, _pos);
		
		
//		if (CInput.KeyUp(Df.Key.LButton))
//		{
//			if (g_eventLock==false && this.m_clickEvent.IsCall())
//				this.m_clickEvent.Call(super.GetOffset());
//			
//			this.m_lastEvent = DfUiEvent.Click;
//
//		}

		if (CInput.KeyDown(Df.Key.LButton))
		{
			if (g_eventLock==false && this.m_pressEvent.IsCall())
				this.m_pressEvent.Call(super.GetOffset());
			if (this.m_long > 1000)
			{
				if (g_eventLock==false && this.m_longEvent.IsCall())
					this.m_longEvent.Call(super.GetOffset());
				this.m_lastEvent = DfUiEvent.LongPressDown;
			}
			else
				this.m_lastEvent = DfUiEvent.Press;
			if(this.m_clickChk==-1)
				this.m_clickChk = 0;
			
		}
		else
		{
			if(this.m_clickChk!=1)
				this.m_lastEvent = DfUiEvent.Pick;
//			else
//				alert("test");
		}
			
		

	}
	Update(_delay)
	{
		
		
		
		super.Update(_delay);
		

		if (this.m_move && g_moveMode)
		{
			if (this.m_lastEvent == DfUiEvent.Press && g_pickMove == null)
			{
				g_pickMove = this;
			}
			else if (g_pickMove != null && g_pickMove == this)
			{
				var pos = this.m_uiPt.GetHalf(this.m_wMat);
				var mpos=new CVec3();
				mpos.x = CInput.PosX(0) - pos.x;
				mpos.y = CInput.PosY(0) - pos.y;
				mpos.z = this.m_pos.z;
				this.SetPos(mpos);

				if (g_pickMove.m_lastEvent == DfUiEvent.Null || g_pickMove.m_lastEvent == DfUiEvent.Pick)
					g_pickMove = null;
			}
		}
		
		if (this.m_lastEvent == DfUiEvent.Press && this.m_long >= 0)
		{
			this.m_long += _delay;
		}
		if ((this.m_lastEvent == DfUiEvent.Null || this.m_lastEvent == DfUiEvent.Pick) && this.m_long > 1000)
		{
			this.m_lastEvent = DfUiEvent.LongPressUp;
			this.m_long = 0;
			this.m_clickChk = 1;
		}
		else
		{
			if (this.m_clickChk == 0 && this.m_long<1000)
			{
				if(this.m_lastEvent == DfUiEvent.Null || this.m_lastEvent == DfUiEvent.Pick)
				{
					if (g_eventLock==false && this.m_clickEvent.IsCall())
						this.m_clickEvent.Call(super.GetOffset());			
					this.m_lastEvent = DfUiEvent.Click;
					this.m_clickChk = 1;
					this.m_long=0;
				}
				else
					this.m_lastEvent = DfUiEvent.Null;
				
			}
			else
			{
				this.m_clickChk = -1;
				this.m_lastEvent = DfUiEvent.Null;
			}
			
		}


		if (g_eventLock==false && this.m_hotkey != -1 && CInput.KeyUp(this.m_hotkey))
		{
			if (this.m_hotkeyEvent.IsCall())
				this.m_hotkeyEvent.Call(super.GetOffset());
		}
		
		//this.m_lastEvent = DfUiEvent.Null;
		
			
		
	}

};
//========================================================================
class CUiText extends CUi
{
	constructor()
	{
		super();
		this.m_text=null;
	}
	Init(_text,_size,_maxX,_maxY)
	{
		this.m_text = CFont.TextToTexName(_text+"", _size,false,_maxX,_maxY);
		var tex = CRes.get(this.m_text.m_key);

		if (this.m_uiPt == null)
		{
			this.m_uiPt = new CPaint2D(new CVec2(tex.GetWidth(), tex.GetHeight()), this.m_text.m_key);
			this.PushCComponent(this.m_uiPt);
			this.PivotCenter(false);
		}
		else
		{
			this.m_uiPt.SetSize(new CVec2(tex.GetWidth(), tex.GetHeight()));
			this.m_uiPt.SetTexture(this.m_text.m_key);
		}
			
	}
};
//========================================================================
class CUiPicture extends CUi
{
	constructor()
	{
		super();
		this.m_tex="";
	}
	Init(_tex)
	{
		this.m_tex = _tex;

		var tex = CRes.get(_tex);

		if (this.m_uiPt == null)
		{
			this.m_uiPt = new CPaint2D(new CVec2(tex.GetWidth(), tex.GetHeight()), this.m_tex);
			this.PushCComponent(this.m_uiPt);
			this.PivotCenter(false);
		}
		else
			this.m_uiPt.SetTexture(this.m_tex);
	}
};
//========================================================================
function JSDfButtonType()
{
	this.Image = 0;
	this.RGBA = 1;
	this.Count = 2;
	this.Null = 3;
};
var DfButtonType=new JSDfButtonType();

class CUiButton extends CUi
{
	constructor()
	{
		super();
		this.m_buttonType = DfButtonType.Null;
		this.m_normal="";
		this.m_overImg="";
		this.m_pressImg="";
		this.m_overRGBA=new CVec4();
		this.m_pressRGBA=new CVec4();
	}
	
	Init(_normal, _over, _press)
	{
		if( typeof _over =="string")
		{
			this.m_buttonType = DfButtonType.Image;
			this.m_normal = _normal;
			this.m_overImg = _over;
			this.m_pressImg = _press;

			var tex = CRes.get(_normal);

			if (this.m_uiPt == null)
			{
				this.m_uiPt = new CPaint2D(new CVec2(tex.GetWidth(), tex.GetHeight()), this.m_normal);
				this.PushCComponent(this.m_uiPt);
				this.PivotCenter(false);
			}
			else
				this.m_uiPt.SetTexture(this.m_normal);

			this.AddCCollider();
		}
		else
		{
			this.m_buttonType = DfButtonType.RGBA;
			this.m_normal = _normal;
			this.m_overRGBA = _over;
			this.m_pressRGBA = _press;

			var tex =CRes.get(_normal);

			if (this.m_uiPt == null)
			{
				this.m_uiPt = new CPaint2D(new CVec2(tex.GetWidth(), tex.GetHeight()), this.m_normal);
				this.PushCComponent(this.m_uiPt);
				this.PivotCenter(false);
			}
			else
				this.m_uiPt.SetTexture(this.m_normal);

			this.AddCCollider();
		}
		
		
	}
	Update(_delay)
	{
		if (this.m_buttonType == DfButtonType.RGBA)
		{
			if (this.m_lastEvent == DfUiEvent.Press)
			{
				this.SetRGBA(this.m_pressRGBA);
			}
			else if (this.m_lastEvent == DfUiEvent.Pick)
			{
				this.SetRGBA(this.m_overRGBA);
			}
			else if (this.m_uiPt.GetRGBA().IsZero() == false)
			{
				this.SetRGBA(new CVec4(0,0,0,0));
			}
		}
		else
		{
			if (this.m_lastEvent == DfUiEvent.Press)
			{
			
				if (this.m_pressImg.equals(this.m_uiPt.GetTexture().front()) == false)
					this.m_uiPt.SetTexture(this.m_pressImg);
			}
			else if (this.m_lastEvent == DfUiEvent.Pick)
			{
			
				if (this.m_overImg.equals(this.m_uiPt.GetTexture().front()) == false)
					this.m_uiPt.SetTexture(this.m_overImg);
			}
			else if (this.m_normal.equals(this.m_uiPt.GetTexture().front()) == false)
			{
				this.m_uiPt.SetTexture(this.m_normal);
			}
		}
		super.Update(_delay);


	}
};
class CUiButtonTxt extends CUiButton
{
	constructor()
	{
		super();
		this.m_text = null;
		this.m_uiTxt = null;
	}
	SetText(_text,_size)
	{
		if (this.m_uiPt == null)
			return;

		this.m_text = CFont.TextToTexName(_text+"", _size);
		var tex = CRes.get(this.m_text.m_key);

		if (this.m_uiTxt == null)
		{
			this.m_uiTxt = new CPaint2D(new CVec2(tex.GetWidth(), tex.GetHeight()), this.m_text.m_key);
			this.PushCComponent(this.m_uiTxt);
		}
		else
			this.m_uiTxt.SetTexture(this.m_text.m_key);

		var lpos = this.m_uiPt.GetHalf(this.m_wMat);
		lpos.z = 1;
		this.m_uiTxt.SetPos(lpos);
	}
	SetSize(_width,_height)
	{
		super.SetSize(_width, _height);
		if (this.m_uiPt == null || this.m_uiTxt==null)
			return;
		var lpos = this.m_uiPt.GetHalf(this.m_wMat);
		lpos.z = 1;
		this.m_uiTxt.SetPos(lpos);
	}
}
class CUiProgressBar extends CUi
{
	constructor()
	{
		super();
		this.m_tex="";
		this.m_max;
		this.m_val;
		this.m_orgUiSize=new CVec2();
		this.m_orgTexSize=new CVec2();
	}
	Init(_tex,_max,_val)
	{
		this.m_tex = _tex;
		this.m_max = _max;
		//this.m_val = _val;
		var tex = CRes.get(_tex);

		if (this.m_uiPt == null)
		{
			this.m_orgUiSize = new CVec2(tex.GetWidth(), tex.GetHeight());
			this.m_orgTexSize = new CVec2(tex.GetWidth(), tex.GetHeight());
			this.m_uiPt = new CPaint2D(this.m_orgUiSize, this.m_tex);
			this.PushCComponent(this.m_uiPt);
			this.PivotCenter(false);
		}
		else
			this.m_uiPt.SetTexture(this.m_tex);
		this.SetVal(_val);
	}
	SetVal(_val)
	{
		if (_val < 0)
			this.m_val = 0;
		else if (_val > this.m_max)
			this.m_val = this.m_max;
		else
			this.m_val = _val;
		var per = this.m_val / this.m_max*1.0;
		this.m_uiPt.SetTexCodi(0, 0, this.m_orgTexSize.x*per, this.m_orgTexSize.y, this.m_orgTexSize.x, this.m_orgTexSize.y);
		this.m_uiPt.SetSize(new CVec2(this.m_orgUiSize.x*per, this.m_orgUiSize.y));
	}
	GetVal() { return this.m_val; }
	GetMax() { return this.m_max; }
	SetSize(_width,_height)
	{
		this.m_orgUiSize = new CVec2(_width, _height);
		this.SetVal(this.m_val);
	}
	SetMax(_val)
	{
		this.m_max = _val;
		this.SetVal(this.GetVal());
	}
}
class CUiProgressBarTxt extends CUiProgressBar
{
	constructor()
	{
		super();
		this.m_text = null;
		this.m_uiTxt = null;
		this.m_uiBack = null;
	}
	Init(_tex,_back,_max,_val)
	{
		super.Init(_tex, _max, _val);

		if (this.m_uiTxt == null)
		{
			this.m_text = CFont.TextToTexName(_val+"/"+_max, this.m_orgUiSize.y);
			var tex =CRes.get(this.m_text.m_key);

			this.m_uiTxt = new CPaint2D(new CVec2(tex.GetWidth(), tex.GetHeight()), this.m_text.m_key);
			this.PushCComponent(this.m_uiTxt);

			this.m_uiBack = new CPaint2D(this.m_orgUiSize, _back);
			this.PushCComponent(this.m_uiBack);
			this.m_uiBack.SetPivot(new CVec3(1,1,1));
			this.m_uiBack.SetPos(new CVec3(0, 0, -1));
		}
		else
		{
			this.m_uiTxt.SetTexture(this.m_text.m_key);
			this.m_uiBack.SetTexture(_back);
		}
			

		

		var lpos = this.m_uiPt.GetHalf(this.m_wMat);
		lpos.x = this.m_orgUiSize.x*0.5;
		this.m_uiTxt.SetPos(lpos);
	}
	SetSize(_width,_height)
	{
		super.SetSize(_width, _height);
		if (this.m_uiPt == null || this.m_uiTxt == null)
			return;
		this.m_uiBack.SetSize(new CVec2(_width, _height));
		var lpos = this.m_uiPt.GetHalf(this.m_wMat);
		lpos.x = this.m_orgUiSize.x*0.5;
		this.m_uiTxt.SetPos(lpos);
	}
	SetVal(_val)
	{
		super.SetVal(_val);
		if (this.m_uiPt == null || this.m_uiTxt == null)
			return;
		this.m_text = CFont.TextToTexName(_val + "/" + this.m_max, this.m_orgUiSize.y);
		var tex = CRes.get(this.m_text.m_key);
		this.m_uiTxt.SetSize(new CVec2(tex.GetWidth(), tex.GetHeight()));
		this.m_uiTxt.SetTexture(this.m_text.m_key);

		var lpos = this.m_uiPt.GetHalf(this.m_wMat);
		lpos.x = this.m_orgUiSize.x*0.5;
		this.m_uiTxt.SetPos(lpos);
	}
};
class CGridSort extends CObject
{
	constructor()
	{
		super();
		this.m_yAxis = true;
		this.m_interval = 32;
		this.m_blank = 0;
	}
	Init(_yAxis,_interval,_blank)
	{
		this.m_yAxis = _yAxis;
		this.m_interval = _interval;
		this.m_blank = _blank;
	}
	PushChilde(_obj)
	{
		super.PushChilde(_obj);
		var addPos = this.m_blank;
		for (var i = 0; i < this.m_childe.size(); ++i)
		{

			if (this.m_yAxis)
			{
				this.m_childe[i].SetPos(CMath.Vec3PlusVec3(this.m_pos,new CVec3(0, addPos)));
			}
			else
				this.m_childe[i].SetPos(CMath.Vec3PlusVec3(this.m_pos,new CVec3(addPos, 0)));
			addPos += this.m_blank + this.m_interval;
		}
	}
};


