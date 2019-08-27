class CCamera 
{
	constructor()
	{
		this.m_eye=new CVec3();
		this.m_look=new CVec3();
		this.m_up=new CVec3(0,1,0);
		this.m_view=new CVec3();
		this.m_cross=new CVec3();
		this.m_viewMat=new CMat();
		this.m_projMat=new CMat();
		this.m_gimballock=0.999;
		this.m_projectFar=15000.0;
		this.m_projectNear=1.0;
		this.m_t2Df3D=false;
		
//		this.dummyEye=new CVec3(0,3000,0);
//		this.dummyLook=new CVec3(10,1000,10);
	}
	GetEye()	{	return this.m_eye;	}
	GetLook()	{	return this.m_look;	}
	GetUp()	{	return this.m_up;	}
	GetView()	{	return this.m_view;	}
	GetCross()	{	return this.m_cross;	}
	GetFront()	{	return CMath.Vec3Cross(this.m_up,this.m_cross);	}
	
	SetFar(_val) { this.m_projectFar = _val; }
	SetNear(_val) { this.m_projectNear = _val; }
	
	SetEye(pa_vec)	{	this.m_eye=pa_vec;	}
	SetLook(pa_vec)	{	this.m_look=pa_vec;	}
	SetUp(pa_vec)	{	this.m_up=pa_vec;	}

	GetFar() { return this.m_projectFar;	 }
	GetViewMat()	{	return this.m_viewMat;	}
	GetProjMat()	{	return this.m_projMat;	}
	Init(pa_eye,pa_look)
	{
		//this.m_t2Df3D=false;
		//this.m_projectFar=15000.0;
		//this.m_gimballock=0.999;
			 
		this.m_eye=pa_eye;
		this.m_look=pa_look;
		this.m_up=new CVec3(0,1,0);
		this.ViewAndCrossVector3Set();
	}
	Reset3D()
	{
		
//		this.dummyEye.x+=1;
//		this.dummyEye.z+=1;
//		
//		this.dummyLook.x+=1;
//		this.dummyLook.z+=1;
		
		
		this.m_viewMat=CMath.CameraLookAtLH(this.m_eye,this.m_look,this.m_up);
		this.m_projMat=CMath.CameraPerspectiveLH(1,(CRoot.m_realHeight*1.0)/ CRoot.m_realWidth,this.m_projectNear,this.m_projectFar);
		this.m_t2Df3D=false;
		this.ViewAndCrossVector3Set();
	}
	Reset2D()
	{
		this.m_viewMat=CMath.CameraLookAtLH(this.m_eye,this.m_look,this.m_up);
		this.m_projMat=CMath.CameraOrthoLH(CRoot.m_realWidth,CRoot.m_realHeight, 0.01, 200);
		this.m_t2Df3D=true;
		this.ViewAndCrossVector3Set();
	}
	ViewAndCrossVector3Set()
	{
		this.m_view= CMath.Vec3Normalize(CMath.Vec3MinusVec3(this.m_look,this.m_eye));
		this.m_cross= CMath.Vec3Cross(this.m_up, this.m_view);
		this.m_cross= CMath.Vec3Normalize(this.m_cross);
	}
	XAxisRotation(pa_radian)
	{
		var L_temp=new CMat();

		L_temp=CMath.MatAxisToRotation(this.m_cross, pa_radian);
		var L_look=new CVec3();
		L_look=CMath.MatToVec3Coordinate(this.m_view, L_temp);
		var len = CMath.Vec3Dot(new CVec3(0, 1, 0), L_look);
		if (len<-this.m_gimballock || len>this.m_gimballock)
			return;

		//이거 꼼수다 룩은 방향 벡터이기때문에 그냥 최대 멀리 보내버렸다 2012.02.23
		this.m_look = CMath.Vec3MulFloat(L_look,10000);
		this.m_look = CMath.Vec3PlusVec3(this.m_look,this.m_eye);
		this.ViewAndCrossVector3Set();
	}
	YAxisRotation(pa_radian)
	{
		var L_temp=new CMat();;

		L_temp = CMath.MatAxisToRotation(this.m_up, pa_radian);
		var L_look=new CVec3();
		L_look = CMath.MatToVec3Coordinate(this.m_view, L_temp);
		//이거 꼼수다 룩은 방향 벡터이기때문에 그냥 최대 멀리 보내버렸다 2012.02.23
		this.m_look = CMath.Vec3MulFloat(L_look, 10000);
		this.m_look = CMath.Vec3PlusVec3(this.m_look, this.m_eye);
	}
	ZAxisRotation(pa_radian)
	{
		var L_temp=new CMat();

		L_temp = CMath.MatAxisToRotation(this.m_view, pa_radian);
		var L_look=new CVec3();
		this.m_up = CMath.MatToVec3Coordinate(this.m_up, L_temp);
		
	}
	FrontMove(_val)
	{
		var L_move = new CVec3(0, 0, 0);

		var newCro=CMath.Vec3Cross(this.m_up, this.m_cross);
		L_move = CMath.Vec3MulFloat(newCro, _val);

		this.m_eye = CMath.Vec3PlusVec3(this.m_eye,L_move);
		this.m_look = CMath.Vec3PlusVec3(this.m_look, L_move);
	}
	CrossMove(_val)
	{
		var L_move = CMath.Vec3MulFloat(this.m_cross, _val);

		this.m_eye = CMath.Vec3PlusVec3(this.m_eye, L_move);
		this.m_look = CMath.Vec3PlusVec3(this.m_look, L_move);
	}
	EyeMoveAndViewCac(pa_newEye)
	{
		this.m_eye = pa_newEye;
		this.m_look = CMath.Vec3PlusVec3(this.m_eye,this.m_view);
	}
	ZAxisZoom(pa_radian)
	{
		var L_temp = this.m_view;
		L_temp=CMath.Vec3MulFloat(L_temp, pa_radian);

		this.m_eye = CMath.Vec3PlusVec3(this.m_eye, L_temp);
		this.m_look = CMath.Vec3PlusVec3(this.m_look, L_temp);
	}
	GetRay(_x,_y)
	{
		var ray=new CThreeVec3();

		var left=0;
		var top = 0;
		var right = CRoot.m_realWidth;
		var bottom = CRoot.m_realHeight;

		var L_vec=new CVec3();
		var L_inView=new CMat();
		if (this.m_t2Df3D == false)
		{
			L_vec.x = ((((_x - left)* 2.0) / right - 1.0) - this.m_projMat.arr[2][0]) / this.m_projMat.arr[0][0];//클리피과 뷰포트는 안빼버렸음
			L_vec.y = (-(((_y - top)* 2.0) / bottom - 1.0) - this.m_projMat.arr[2][1]) / this.m_projMat.arr[1][1];
			L_vec.z = 1.0;

			L_inView=CMath.MatInvert(this.m_viewMat);

			ray.SetDirect(new CVec3(L_vec.x * L_inView.arr[0][0] + L_vec.y * L_inView.arr[1][0] + L_vec.z * L_inView.arr[2][0],
				L_vec.x * L_inView.arr[0][1] + L_vec.y * L_inView.arr[1][1] + L_vec.z * L_inView.arr[2][1],
				L_vec.x * L_inView.arr[0][2] + L_vec.y * L_inView.arr[1][2] + L_vec.z * L_inView.arr[2][2]));
			
			ray.SetDirect(CMath.Vec3Normalize(ray.GetDirect()));

			ray.SetOriginal(new CVec3(L_inView.arr[3][0], L_inView.arr[3][1], L_inView.arr[3][2]));
			
		}
		else
		{
			//직교


			L_vec.x = ((((_x - left)* 2.0) / right - 1.0) - this.m_projMat.arr[2][0]) / this.m_projMat.arr[0][0];//클리피과 뷰포트는 안빼버렸음
			L_vec.y = (-(((_y - top)* 2.0) / bottom - 1.0) - this.m_projMat.arr[2][1]) / this.m_projMat.arr[1][1];

			L_vec.z = 1.0;

			var L_d = L_vec.toCopy();
			var L_o = L_vec.toCopy();
			L_o.z = 0;
			
			var L_m=new CMat()
			var L_mi=new CMat();
		
			
			L_mi=CMath.MatInvert(this.m_viewMat);

			ray.SetDirect(CMath.MatToVec3Coordinate(L_d, L_mi));
			ray.SetOriginal(CMath.MatToVec3Coordinate(L_o, L_mi));
			ray.SetDirect(CMath.Vec3MinusVec3(ray.GetDirect(),ray.GetOriginal()));
		}

		return ray;
	}
	GetPlane()
	{
		var plane=new CSixVec4();
		var L_vtx=[new CVec3(),new CVec3(),new CVec3(),new CVec3(),
			new CVec3(),new CVec3(),new CVec3(),new CVec3()];
		L_vtx[0].x = -1.0;	L_vtx[0].y = -1.0;	L_vtx[0].z = 0.0;
		L_vtx[1].x = 1.0;	L_vtx[1].y = -1.0;	L_vtx[1].z = 0.0;
		L_vtx[2].x = 1.0;	L_vtx[2].y = -1.0;	L_vtx[2].z = 1.0;
		L_vtx[3].x = -1.0;	L_vtx[3].y = -1.0;	L_vtx[3].z = 1.0;
		L_vtx[4].x = -1.0;	L_vtx[4].y = 1.0;	L_vtx[4].z = 0.0;
		L_vtx[5].x = 1.0;	L_vtx[5].y = 1.0;	L_vtx[5].z = 0.0;
		L_vtx[6].x = 1.0;	L_vtx[6].y = 1.0;	L_vtx[6].z = 1.0;
		L_vtx[7].x = -1.0;	L_vtx[7].y = 1.0;	L_vtx[7].z = 1.0;

		var L_vp=new CMat();
		L_vp=CMath.MatMul(this.m_viewMat,this.m_projMat);
		L_vp=CMath.MatInvert(L_vp);
		//D3DXMatrixInverse(&matInv, NULL, pmatViewProj );

		for (var i = 0; i < 8; i++)
			L_vtx[i]=CMath.MatToVec3Coordinate(L_vtx[i], L_vp);


		plane.SetTop(CMath.Vec3toPlane(L_vtx[4], L_vtx[7], L_vtx[6]));// 상 평면(top)
		plane.SetBottom(CMath.Vec3toPlane(L_vtx[0], L_vtx[1], L_vtx[2]));// 하 평면(bottom)

		plane.SetNear(CMath.Vec3toPlane(L_vtx[0], L_vtx[4], L_vtx[5]));// 근 평면(near)
		plane.SetFar(CMath.Vec3toPlane(L_vtx[2], L_vtx[6], L_vtx[7]));// 원 평면(far)

		plane.SetLeft(CMath.Vec3toPlane(L_vtx[0], L_vtx[3], L_vtx[7]));// 좌 평면(left)
		plane.SetRight(CMath.Vec3toPlane(L_vtx[1], L_vtx[5], L_vtx[6]));// 우 평면(right)
			

		return plane;
	}
	CharacterByRotation(pa_chaPos,pa_xAxisRadian,pa_yAxisRadian,pa_zome)
	{
		
		if (pa_xAxisRadian != 0)
		{
			this.XAxisRotation(pa_xAxisRadian);
			this.ViewAndCrossVector3Set();
		}
			
		if (pa_yAxisRadian != 0)
		{
			this.YAxisRotation(pa_yAxisRadian);
			this.ViewAndCrossVector3Set();
		}
			


		this.m_eye = pa_chaPos;
		this.m_look = CMath.Vec3PlusVec3(this.m_eye, this.m_view);

		this.Reset3D();

		this.ZAxisZoom(-pa_zome);
	}
}

