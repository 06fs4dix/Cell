package cell;

import java.util.Vector;

class DfCPaint
{
	public static int D2 = 0;
	public static int Billbord = 1;
	public static int D3 = 2;
	public static int Count = 3;
	public static int Null = 4;
};
class DfCPaintPriority
{
	public static int BackGround = 2000;
	public static int Normal = 3000;
	public static int Alpha = 4000;
	

	public static int PCount = 1000;
	public static int Null = 500;
};
public class CPaint extends CComponent
{
	CMat fMat=new CMat();
	protected CVec4 RGBA=new CVec4(0,0,0,0);
	int priority= DfCPaintPriority.Normal;
	//const CVertexFormat * vf = null;
	
	
	public int GetPriority() { return priority; }
	public void SetPriority(int _val) {	priority = _val;	}
	public int GetCComponentType() { return Df.CComponent.CPaint; }
	public String GetKey() { return new String(); }
	public CPaint() {};
	public int GetCPaintType() {	return DfCPaint.Null;	}
	public void Render() {}
	public CBound GetBound() {	return null;	}
	public CMat GetLMat()	{	return null;	}
	public void SetVfValue(String _name,CVec4 _vec) {}
	public void SetVfValue(String _name,CMat _mat) {}
	public void SetRGBA(CVec4 _RGBA) { RGBA = _RGBA; }
	public CVec4 GetRGBA()	{	return RGBA;}
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.Push(super.Serialize());
		pac.Push(fMat);
		pac.Push(RGBA);
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1,fMat);
		pac.GetISerialize(2,RGBA);
	}
	//virtual const CVertexFormat& GetVf() = 0;
};
class CPaint2D extends CPaint
{
	static int d_Mesh2DSize = 10;
	protected float animationVisible = 1.0f;
	protected CVec2 size=new CVec2();
	protected CVec3 pivot=new CVec3();
	protected CVec3 pos=new CVec3();
	protected CVec4 rot=new CVec4();
	
	protected Vector<String> texture=new Vector<String>();
	protected CVec4 texCodi =new CVec4(1, 1, 0, 0);
	protected CMat localMat=new CMat();
	
	protected void PRSReset()
	{
		CBound bound = GetBound();
		CVec3 bSca = GetScale();

		CVec3 lpos= pos.toCopy();
		lpos.x += bound.max.x*bSca.x*pivot.x;
		lpos.y += bound.max.y*bSca.y*pivot.y;
		lpos.z += bound.max.z*bSca.z*pivot.z;


		//localMat = CMath.MatScale(bSca);
		CMat scaMat=new CMat();
		CMat rotMat=new CMat();
		scaMat = CMath.MatScale(bSca);
		rotMat = CMath.QutToMatrix(rot);

		localMat = CMath.MatMul(scaMat, rotMat);
		
		
		//CMat mat;
		localMat.arr[3][0] = lpos.x;
		localMat.arr[3][1] = lpos.y;
		localMat.arr[3][2] = lpos.z;

	}
	public int GetCPaintType()	{	return DfCPaint.D2;	}
	public CPaint2D() {};
	public CPaint2D(CVec2 _size, String _texture)
	{
		size = _size;
		texture.add(_texture);
		PRSReset();
	}
//	public void Render()
//	{
//		CWindow.RMgr().SetValue(CPalette.GetVf2D(), "texCodi", texCodi);
//		CWindow.RMgr().SetTexture(CPalette.GetVf2D(),texture.front() );
//		CWindow.RMgr().VDrawMeshData(CPalette.GetVf2D(), CPalette.Get2DMeshData());
//	}
	public CVec3 GetHalf(CMat _wMat)
	{
		CVec3 pos=new CVec3((size.x * 0.5f)*pivot.x, (size.y * 0.5f)*pivot.y, 1);
		pos = CMath.MatToVec3Normal(pos, _wMat);
		return pos;
	}
	public CVec3 GetScale()
	{
		return new CVec3(size.x / d_Mesh2DSize, size.y / d_Mesh2DSize, 1);
	}
	public CBound GetBound()
	{
		CVec3 bSca = GetScale();
		CBound bound=new CBound();

		bound.min.x = -d_Mesh2DSize * 0.5f;
		bound.min.y = -d_Mesh2DSize * 0.5f;
		bound.min.z = -0.5f;

		bound.max.x = d_Mesh2DSize * 0.5f;
		bound.max.y = d_Mesh2DSize * 0.5f;
		bound.max.z = 0.5f;

		return bound;
	}
	public CVec2 GetSize() { return size.toCopy();	 };
	public void SetTexture(String _tex)
	{
		texture.clear();
		texture.add(_tex);
	}
	public Vector<String> GetTexture() {	return texture;	}
	public void SetTexCodi(int _stX, int _stY, int _edX, int _edY, int _imgW, int _imgH)
	{
		texCodi.z = (float)_stX / _imgW;
		texCodi.w = (float)_stY / _imgH;

		texCodi.x = (_edX - _stX) / (float)_imgW;
		texCodi.y = (_edY - _stY) / (float)_imgH;
	}
	public void SetTexCodi(CVec4 _texDodi) { texCodi = _texDodi.toCopy(); }
	public void SetPivot(CVec3 _pivot)
	{
		pivot = _pivot;
		PRSReset();
	}
	public void SetSize(CVec2 _size)
	{
		size = _size;
		PRSReset();
	}
	public void SetPos(CVec3 _pos)
	{
		pos = _pos;
		PRSReset();
	}
	public void SetRot(CVec4 _rot)
	{
		rot = _rot;
		PRSReset();
	}
	//CMat mat;
	public CMat GetLMat() {	return localMat;	};
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CPaint2D";
		pac.Push(super.Serialize());
		pac.Push(size);
		pac.Push(pivot);
		pac.Push(pos);
		pac.Push(rot);
		
		pac.Push(texture);
		pac.Push(texCodi);
		
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		pac.GetISerialize(1,size);
		pac.GetISerialize(2,pivot);
		pac.GetISerialize(3,pos);
		pac.GetISerialize(4,rot);
		
		
		CPacket pac2=new CPacket();
		pac2.Deserialize(pac.GetString(5));
		for (var each0 : pac2.value)
		{
			texture.add(each0);
		}
		pac.GetISerialize(6,texCodi);
		PRSReset();
	}
};
class CPaintBillbord extends CPaint2D
{
	public int GetCPaintType() { return DfCPaint.Billbord; }
	public CPaintBillbord() {}
	public CPaintBillbord(CVec2 _size, String _texture) 
	{
		super(_size, _texture);
	}
//	public CMat GetLMat()
//	{
//		return new CMat();
//	}
//	public CBound GetBound()
//	{
//		CVec3 bSca = GetScale();
//		CBound bound=new CBound();
//
//		bound.min.x = -d_Mesh2DSize * 0.5f;
//		bound.min.y = -d_Mesh2DSize * 0.5f;
//		bound.min.z = -0.5f;
//
//		bound.max.x = d_Mesh2DSize * 0.5f;
//		bound.max.y = d_Mesh2DSize * 0.5f;
//		bound.max.z = 0.5f;
//		float maxVal = CMath.Max(bSca.x, bSca.y);
//		maxVal = CMath.Max(bSca.x, bSca.y);
//		bound.min.x *= maxVal;
//		bound.max.x *= maxVal;
//		bound.min.y *= maxVal;
//		bound.max.y *= maxVal;
//
//		return bound;
//	}
	public CPacket Serialize()
	{
		var pac = new CPacket();
		pac.name = "CPaintBillbord";
		pac.Push(super.Serialize());
		
		
		return pac;
	}
	public void Deserialize(String _str)
	{
		var pac = new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		
	}
};
class CPaint3D extends CPaint
{
	String mesh;
	CPaint3D()
	{
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.name = "CPaint3D";
		pac.Push(super.Serialize());
		pac.Push(mesh);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		super.Deserialize(pac.GetString(0));
		mesh=pac.GetString(1);
		//SetMesh(mesh);
	}
};
