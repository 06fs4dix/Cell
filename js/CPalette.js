var g_vf2d=null;
var g_vfVoxel=null;
var g_vfSimple=null;
var g_vfSkin=null;
var g_vfForwardLight=null;

var g_root2d=new CMeshData();

var CPalette=function() 
{
}
CPalette.Load=function()
{
	CUtil.ShaderLoad("resFile/ForwardLight.sl");
	
	CUtil.TextureLoad("resFile/none.png", 0, 0);
	CUtil.ShaderLoad("resFile/CPaint2D.sl");
	
	CUtil.ShaderLoad("resFile/CVoxel.sl");
	CUtil.TextureLoad("resFile/tile.png", DfTexture.Linear, DfTexture.Clamp,true);
	
	CUtil.ShaderLoad("resFile/Simple.sl");

	CUtil.ShaderLoad("resFile/Skin.sl");
	
	
	
}
CPalette.Init=function()
{
	
	g_vf2d = CRes.get("CPaint2D");
	if (g_vf2d == null)
	{
		CMsg.E("먼저 팔레트 로드를 호출해 주세요!");
	}

	var half = d_Mesh2DSize / 2.0;
	var info= CWindow.MMgr().GetPlane(new CVec4(0, 0, 1, half));
	CWindow.MMgr().MeshCreateModify(g_root2d, g_vf2d, 6, 0, info.vertex, info.uv,
		null, null, null, null, null, null, null, null, 0);


	//voxel
	g_vfVoxel = CRes.get("CVoxel");
	
	
	g_vfSimple = CRes.get("Simple");
	
	g_vfSkin = CRes.get("Skin");
	
	g_vfForwardLight = CRes.get("ForwardLight");
	
	var tex=CImgPro.Square(1, 1,new CVec4(0, 0, 0, 1));
	CWindow.TMgr().Create(tex);
	CRes.set(this.GetBlackTex(), tex);
}
CPalette.GetVf2D=function()
{
	return g_vf2d;
}
CPalette.GetVfVoxel=function()
{
	return g_vfVoxel;
}
CPalette.Get2DMeshData=function()
{
	return g_root2d;
}
CPalette.GetVfForwardLight=function()
{
	return g_vfForwardLight;
}
CPalette.GetVfSimple=function()
{
	return g_vfSimple;
}
CPalette.GetVfSkin=function()
{
	return g_vfSkin;
}
CPalette.GetNoneTex=function()
{
	return "resFile/none.png";
}
CPalette.GetVoxelTex=function()
{
	return "resFile/tile.png";
}
CPalette.GetBlackTex=function()
{
	return "Black.tex";
}