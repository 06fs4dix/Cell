const RayBoxRIGHT = 0;
const RayBoxLEFT = 1;
const RayBoxMIDDLE = 2;
const d_EPSILON = 1e-6;
const d_MAX_FLOAT = 3.40282346638528860e+38;
const d_PI=3.141592;
const g_fEpsilon = 0.0001;

function CPlaneOutJoin()
{
	this.tOutfJoin = true;
	this.plane = d_PlaneNull;
	this.len = 0;
};
function s_FACE()
{
	this.Tface=new Array();
	this.Cindex=new Array();
}

var CMath =function()
{
	
}
CMath.Abs=function(_a)
{
	return Math.abs(_a);
}
CMath.Min=function(_a,_b)
{
	return Math.min(_a,_b);
}
CMath.Max=function(_a,_b)
{
	return Math.max(_a,_b);
}
CMath.FrameToMili=function(_frame,_b)
{
	return parseInt((_frame / 30.0)*1000);
}
CMath.Vec2MinusVec2=function(_a,_b)
{
	return new CVec2(_a.x- _b.x, _a.y - _b.y);
}
//Vec
CMath.Vec3PlusVec3=function(_a,_b)
{
	return new CVec3(_a.x+_b.x,_a.y+_b.y,_a.z+_b.z);
}
CMath.Vec3MinusVec3=function(_a,_b)
{
	return new CVec3(_a.x-_b.x,_a.y-_b.y,_a.z-_b.z);
}
CMath.Vec3MulFloat=function(_a,_b)
{
	return new CVec3(_a.x*_b,_a.y*_b,_a.z*_b);
}
CMath.Vec3Lenght=function(_a,_b)
{
	return Math.sqrt(_a.x*_a.x+_a.y*_a.y+_a.z*_a.z); 
}
CMath.Vec3Normalize=function(_a)
{
	if (_a.IsZero())
		return new CVec3(0, -1, 0);
	var dummy=this.Vec3Lenght(_a);
	return new CVec3(_a.x/dummy,_a.y/dummy,_a.z/dummy); 
}
CMath.PosAnPosLen=function(_a,_b)
{
	return this.Vec3Lenght(this.Vec3MinusVec3(_a, _b));
}
//CMath.Vec3Compare=function(_a,_b)
//{
//	if(_a.x==_b.x && _a.y==_b.y && _a.z==_b.z)
//		return true;
//	return false;
//}
CMath.Vec3Dot=function(_a,_b)
{
	return _a.x*_b.x+_a.y*_b.y+_a.z*_b.z;
}
CMath.Vec3Cross=function(_a,_b)
{
	var rVal=new CVec3();

	rVal.x= _a.y * _b.z - _a.z * _b.y;
	rVal.y= _a.z * _b.x - _a.x * _b.z;
	rVal.z= _a.x * _b.y - _a.y * _b.x;
	
	return rVal;
}
//Mat
CMath.MatAxisToRotation=function(axis,radianAngle)
{
	var pa_out=new CMat();
	var L_s= Math.sin(radianAngle);
	var L_c= Math.cos(radianAngle);
	var L_d= 1-L_c;
	pa_out.arr[0][0]=(L_d*(axis.x*axis.x)) + L_c;pa_out.arr[0][1]=(L_d*axis.x*axis.y) + (axis.z*L_s);
	pa_out.arr[0][2]=(L_d*axis.x*axis.z) - (axis.y*L_s);pa_out.arr[0][3]=0;

	pa_out.arr[1][0]=(L_d*axis.x*axis.y) - (axis.z*L_s);pa_out.arr[1][1]=(L_d*(axis.y*axis.y)) + L_c;
	pa_out.arr[1][2]=(L_d*axis.y*axis.z) + (axis.x*L_s);pa_out.arr[1][3]=0;

	pa_out.arr[2][0]=(L_d*axis.x*axis.y) + (axis.y*L_s);pa_out.arr[2][1]=(L_d*axis.y*axis.z)-(axis.x*L_s);
	pa_out.arr[2][2]=(L_d*(axis.z*axis.z)) + L_c;pa_out.arr[2][3]=0;

	pa_out.arr[3][0]=0;pa_out.arr[3][1]=0;pa_out.arr[3][2]=0;pa_out.arr[3][3]=1;
	
	return pa_out;
}
CMath.MatScale=function(pa_vec)
{
	var pa_out=new CMat();
	pa_out.arr[0][0]=pa_vec.x;pa_out.arr[0][1]=0;pa_out.arr[0][2]=0;pa_out.arr[0][3]=0;
	pa_out.arr[1][0]=0;pa_out.arr[1][1]=pa_vec.y;pa_out.arr[1][2]=0;pa_out.arr[1][3]=0;
	pa_out.arr[2][0]=0;pa_out.arr[2][1]=0;pa_out.arr[2][2]=pa_vec.z;pa_out.arr[2][3]=0;
	pa_out.arr[3][0]=0;pa_out.arr[3][1]=0;pa_out.arr[3][2]=0;pa_out.arr[3][3]=1;
	
	return pa_out;
}
CMath.MatMul=function(pa_val1,pa_val2)
{
	var L_matrix=new CMat();
	L_matrix.arr[0][0]=0;
	L_matrix.arr[1][1]=0;
	L_matrix.arr[2][2]=0;
	L_matrix.arr[3][3]=0;
	

	for(var i=0;i<4;++i)
	{
		for(var j=0;j<4;++j)
		{
			for(var k=0;k<4;++k)
			{
				L_matrix.arr[i][j]+=pa_val1.arr[i][k]*pa_val2.arr[k][j];
			}
		}
	}
	return L_matrix;
}
CMath.MatToVec3Normal=function(pa_vec,pa_mat)
{
	var pa_out=new CVec3();

	pa_out.x = (pa_mat.arr[0][0] * pa_vec.x) + (pa_mat.arr[1][0] * pa_vec.y) + (pa_mat.arr[2][0] * pa_vec.z);
	pa_out.y = (pa_mat.arr[0][1] * pa_vec.x) + (pa_mat.arr[1][1] * pa_vec.y) + (pa_mat.arr[2][1] * pa_vec.z);
	pa_out.z = (pa_mat.arr[0][2] * pa_vec.x) + (pa_mat.arr[1][2] * pa_vec.y) + (pa_mat.arr[2][2] * pa_vec.z);

	return pa_out;
}
CMath.MatToVec3Coordinate=function(pa_vec,pa_mat)
{
	var pa_out=new CVec3();
	var x=0,y=0,z=0,w=0;


	x=(pa_mat.arr[0][0]*pa_vec.x) + (pa_mat.arr[1][0]*pa_vec.y) + (pa_mat.arr[2][0]*pa_vec.z) + pa_mat.arr[3][0];
	y=(pa_mat.arr[0][1]*pa_vec.x) + (pa_mat.arr[1][1]*pa_vec.y) + (pa_mat.arr[2][1]*pa_vec.z) + pa_mat.arr[3][1];
	z=(pa_mat.arr[0][2]*pa_vec.x) + (pa_mat.arr[1][2]*pa_vec.y) + (pa_mat.arr[2][2]*pa_vec.z) + pa_mat.arr[3][2];
	w=(pa_mat.arr[0][3]*pa_vec.x) + (pa_mat.arr[1][3]*pa_vec.y) + (pa_mat.arr[2][3]*pa_vec.z) + pa_mat.arr[3][3];

	pa_out.x=x/w;
	pa_out.y=y/w;
	pa_out.z=z/w;
	
	return pa_out;
}
CMath.MatInvert=function(pa_val1)
{
	var tmp=new Array(12);
	var src=new Array(16);
	var det=0.0;
	var dst=new CMat();


	for (var i = 0; i < 4; i++) {
		src[i]        = pa_val1.arr[i][0];
		src[i + 4]    = pa_val1.arr[i][1];
		src[i + 8]    = pa_val1.arr[i][2];
		src[i + 12]   = pa_val1.arr[i][3];
		
		tmp[i]        = 0;
		tmp[i + 4]    = 0;
		tmp[i + 8]    = 0;
	}
	
	tmp[0]  = src[10] * src[15];
	tmp[1]  = src[11] * src[14];
	tmp[2]  = src[9]  * src[15];
	tmp[3]  = src[11] * src[13];
	tmp[4]  = src[9]  * src[14];
	tmp[5]  = src[10] * src[13];
	tmp[6]  = src[8]  * src[15];
	tmp[7]  = src[11] * src[12];
	tmp[8]  = src[8]  * src[14];
	tmp[9]  = src[10] * src[12];
	tmp[10] = src[8]  * src[13];
	tmp[11] = src[9]  * src[12];
	
	dst.arr[0][0]  = tmp[0]*src[5] + tmp[3]*src[6] + tmp[4]*src[7];
	dst.arr[0][0] -= tmp[1]*src[5] + tmp[2]*src[6] + tmp[5]*src[7];
	dst.arr[0][1]  = tmp[1]*src[4] + tmp[6]*src[6] + tmp[9]*src[7];
	dst.arr[0][1] -= tmp[0]*src[4] + tmp[7]*src[6] + tmp[8]*src[7];
	dst.arr[0][2]  = tmp[2]*src[4] + tmp[7]*src[5] + tmp[10]*src[7];
	dst.arr[0][2] -= tmp[3]*src[4] + tmp[6]*src[5] + tmp[11]*src[7];
	dst.arr[0][3]  = tmp[5]*src[4] + tmp[8]*src[5] + tmp[11]*src[6];
	dst.arr[0][3] -= tmp[4]*src[4] + tmp[9]*src[5] + tmp[10]*src[6];
	dst.arr[1][0]  = tmp[1]*src[1] + tmp[2]*src[2] + tmp[5]*src[3];
	dst.arr[1][0] -= tmp[0]*src[1] + tmp[3]*src[2] + tmp[4]*src[3];
	dst.arr[1][1]  = tmp[0]*src[0] + tmp[7]*src[2] + tmp[8]*src[3];
	dst.arr[1][1] -= tmp[1]*src[0] + tmp[6]*src[2] + tmp[9]*src[3];
	dst.arr[1][2]  = tmp[3]*src[0] + tmp[6]*src[1] + tmp[11]*src[3];
	dst.arr[1][2] -= tmp[2]*src[0] + tmp[7]*src[1] + tmp[10]*src[3];
	dst.arr[1][3]  = tmp[4]*src[0] + tmp[9]*src[1] + tmp[10]*src[2];
	dst.arr[1][3] -= tmp[5]*src[0] + tmp[8]*src[1] + tmp[11]*src[2];
	
	tmp[0]  = src[2]*src[7];
	tmp[1]  = src[3]*src[6];
	tmp[2]  = src[1]*src[7];
	tmp[3]  = src[3]*src[5];
	tmp[4]  = src[1]*src[6];
	tmp[5]  = src[2]*src[5];
	tmp[6]  = src[0]*src[7];
	tmp[7]  = src[3]*src[4];
	tmp[8]  = src[0]*src[6];
	tmp[9]  = src[2]*src[4];
	tmp[10] = src[0]*src[5];
	tmp[11] = src[1]*src[4];
	
	dst.arr[2][0]  = tmp[0]*src[13] + tmp[3]*src[14] + tmp[4]*src[15];
	dst.arr[2][0] -= tmp[1]*src[13] + tmp[2]*src[14] + tmp[5]*src[15];
	dst.arr[2][1]  = tmp[1]*src[12] + tmp[6]*src[14] + tmp[9]*src[15];
	dst.arr[2][1] -= tmp[0]*src[12] + tmp[7]*src[14] + tmp[8]*src[15];
	dst.arr[2][2] = tmp[2]*src[12] + tmp[7]*src[13] + tmp[10]*src[15];
	dst.arr[2][2]-= tmp[3]*src[12] + tmp[6]*src[13] + tmp[11]*src[15];
	dst.arr[2][3] = tmp[5]*src[12] + tmp[8]*src[13] + tmp[11]*src[14];
	dst.arr[2][3]-= tmp[4]*src[12] + tmp[9]*src[13] + tmp[10]*src[14];
	dst.arr[3][0] = tmp[2]*src[10] + tmp[5]*src[11] + tmp[1]*src[9];
	dst.arr[3][0]-= tmp[4]*src[11] + tmp[0]*src[9] + tmp[3]*src[10];
	dst.arr[3][1] = tmp[8]*src[11] + tmp[0]*src[8] + tmp[7]*src[10];
	dst.arr[3][1]-= tmp[6]*src[10] + tmp[9]*src[11] + tmp[1]*src[8];
	dst.arr[3][2] = tmp[6]*src[9] + tmp[11]*src[11] + tmp[3]*src[8];
	dst.arr[3][2]-= tmp[10]*src[11] + tmp[2]*src[8] + tmp[7]*src[9];
	dst.arr[3][3] = tmp[10]*src[10] + tmp[4]*src[8] + tmp[9]*src[9];
	dst.arr[3][3]-= tmp[8]*src[9] + tmp[11]*src[10] + tmp[5]*src[8];
	
	det=src[0]*dst.arr[0][0]+src[1]*dst.arr[0][1]+src[2]*dst.arr[0][2]+src[3]*dst.arr[0][3];
	
	det = 1/det;
	for (var j = 0; j < 4; j++)
	{
		dst.arr[j][0]*=det;
		dst.arr[j][1]*=det;
		dst.arr[j][2]*=det;
		dst.arr[j][3]*=det;
	}

	return  dst;
}
CMath.MatTranslation=function(pa_vec)
{
	var pa_out=new CMat();
	pa_out.arr[0][0] = 1; pa_out.arr[0][1] = 0; pa_out.arr[0][2] = 0; pa_out.arr[0][3] = 0;
	pa_out.arr[1][0] = 0; pa_out.arr[1][1] = 1; pa_out.arr[1][2] = 0; pa_out.arr[1][3] = 0;
	pa_out.arr[2][0] = 0; pa_out.arr[2][1] = 0; pa_out.arr[2][2] = 1; pa_out.arr[2][3] = 0;
	pa_out.arr[3][0] = pa_vec.x; pa_out.arr[3][1] = pa_vec.y; pa_out.arr[3][2] = pa_vec.z; pa_out.arr[3][3] = 1;

	return pa_out;
}
CMath.MatRotation=function(pa_rot)
{
	var pa_out=new CMat();
	var L_qut = this.EulerToQut(pa_rot);
	pa_out = this.QutToMatrix(L_qut);
	return pa_out;
}


//Camera
CMath.CameraLookAtLH=function(eyeVec,lookVec,upVec)
{
	var viewMat=new CMat();
	var Zaxis = this.Vec3MinusVec3(lookVec, eyeVec);
	Zaxis=this.Vec3Normalize(Zaxis);
	var Xaxis=new CVec3();
	Xaxis=this.Vec3Cross(upVec, Zaxis);
	if (Xaxis.IsZero())
		CMsg.E("CameraLookAtLH error");//카메라 위치를 바꿔라!
	Xaxis=this.Vec3Normalize(Xaxis);
	var Yaxis=new CVec3();
	Yaxis=this.Vec3Cross(Zaxis, Xaxis);
	viewMat.arr[0][0] = Xaxis.x; viewMat.arr[0][1] = Yaxis.x; viewMat.arr[0][2] = Zaxis.x; viewMat.arr[0][3] = 0;
	viewMat.arr[1][0] = Xaxis.y; viewMat.arr[1][1] = Yaxis.y; viewMat.arr[1][2] = Zaxis.y; viewMat.arr[1][3] = 0;
	viewMat.arr[2][0] = Xaxis.z; viewMat.arr[2][1] = Yaxis.z; viewMat.arr[2][2] = Zaxis.z; viewMat.arr[2][3] = 0;

	viewMat.arr[3][0] = -this.Vec3Dot(Xaxis, eyeVec);
	viewMat.arr[3][1] = -this.Vec3Dot(Yaxis, eyeVec);
	viewMat.arr[3][2] = -this.Vec3Dot(Zaxis, eyeVec);
	viewMat.arr[3][3] = 1;

	return viewMat;
}
CMath.CameraPerspectiveLH=function(width,height,zn,zf)
{
	var projMat=new CMat();
	projMat.arr[0][0] = (2 * zn) / width; projMat.arr[0][1] = 0; projMat.arr[0][2] = 0; projMat.arr[0][3] = 0;
	projMat.arr[1][0] = 0; projMat.arr[1][1] = (2 * zn) / height; projMat.arr[1][2] = 0; projMat.arr[1][3] = 0;
	projMat.arr[2][0] = 0; projMat.arr[2][1] = 0; projMat.arr[2][2] = zf / (zf - zn); projMat.arr[2][3] = 1;
	projMat.arr[3][0] = 0; projMat.arr[3][1] = 0; projMat.arr[3][2] = (zn*zf) / (zn - zf); projMat.arr[3][3] = 0;

	return projMat;
}
CMath.CameraOrthoLH=function(width,height,zn,zf)
{
	var projMat=new CMat();
	projMat.arr[0][0] = 2 / width; projMat.arr[0][1] = 0; projMat.arr[0][2] = 0; projMat.arr[0][3] = 0;
	projMat.arr[1][0] = 0; projMat.arr[1][1] = 2 / height; projMat.arr[1][2] = 0; projMat.arr[1][3] = 0;
	projMat.arr[2][0] = 0; projMat.arr[2][1] = 0; projMat.arr[2][2] = 1 / (zf - zn); projMat.arr[2][3] = 0;
	projMat.arr[3][0] = 0; projMat.arr[3][1] = 0; projMat.arr[3][2] = -zn / (zf - zn); projMat.arr[3][3] = 1;

	return projMat;
}

//PI
CMath.DegreeToRadian=function(pa_val)
{
	return pa_val / 180.0*d_PI;
}
CMath.RadianToDegree=function(pa_val)
{
	return parseInt((180 * pa_val) / d_PI);
}
CMath.EulerToQut=function(pa_radian)
{
	var pa_qut=new CVec4();

	var qpitch=new CVec4();
	var qyaw=new CVec4();
	var qroll=new CVec4();
	qroll = this.QutAxisToRotation(new CVec3(1, 0, 0), pa_radian.x);
	qpitch = this.QutAxisToRotation(new CVec3(0, 1, 0), pa_radian.y);
	qyaw = this.QutAxisToRotation(new CVec3(0, 0, 1), pa_radian.z);
	qroll = this.QutMul(qroll, qyaw);
	pa_qut = this.QutMul(qroll, qpitch);

	return pa_qut;
}
CMath.QutMul=function(pa_val1,pa_val2)
{
	
	var L_qut=new CVec3();
	var L_Oqut=new CVec4();

	var L_vec = this.Vec3Cross(new CVec3(pa_val2.x, pa_val2.y, pa_val2.z), new CVec3(pa_val1.x, pa_val1.y, pa_val1.z));
	L_qut.x = L_vec.x + pa_val1.w*pa_val2.x + pa_val2.w*pa_val1.x;
	L_qut.y = L_vec.y + pa_val1.w *pa_val2.y + pa_val2.w*pa_val1.y;
	L_qut.z = L_vec.z + pa_val1.w * pa_val2.z + pa_val2.w*pa_val1.z;
	L_Oqut.x = L_qut.x; L_Oqut.y = L_qut.y; L_Oqut.z = L_qut.z;
	
	var L_val = this.Vec3Dot(new CVec3(pa_val1.x, pa_val1.y, pa_val1.z),new CVec3(pa_val2.x, pa_val2.y, pa_val2.z));

	L_Oqut.w = pa_val2.w*pa_val1.w - L_val;
	return L_Oqut;
}
CMath.QutInverse=function(pa_val1)
{
	var L_con=new CVec4();

	var L_len = 0;
	L_con = this.QutConjugate(pa_val1);
	L_len = this.QutLenght(pa_val1);
	L_con.x = L_con.x / L_len;
	L_con.y = L_con.y / L_len;
	L_con.z = L_con.z / L_len;
	L_con.w = L_con.w / L_len;
	return L_con;
}
CMath.QutNomalize=function(pa_val1)
{
	var L_con=new CVec4();
	var L_len = 0;
	L_len = this.QutLenght(pa_val1);
	L_con.x = pa_val1.x / L_len;
	L_con.y = pa_val1.y / L_len;
	L_con.z = pa_val1.z / L_len;
	L_con.w = pa_val1.w / L_len;
	return L_con;
}
CMath.QutConjugate=function(pa_val1)
{
	var pa_out=new CVec4();
	pa_out.x = -pa_val1.x;
	pa_out.y = -pa_val1.y;
	pa_out.z = -pa_val1.z;
	pa_out.w = pa_val1.w;
	return pa_out;
}
CMath.QutLenght=function(pa_val1)
{
	return pa_val1.x*pa_val1.x + pa_val1.y*pa_val1.y + pa_val1.z*pa_val1.z + pa_val1.w*pa_val1.w;
}
CMath.QutAxisToRotation=function(axis,radianAngle)
{
	var pa_out=new CVec4();
	pa_out.x = axis.x*Math.sin(radianAngle / 2);
	pa_out.y = axis.y*Math.sin(radianAngle / 2);
	pa_out.z = axis.z*Math.sin(radianAngle / 2);
	pa_out.w = Math.cos(radianAngle / 2);

	return pa_out;
}
CMath.QutToMat=function(pa_val1)
{
	var pa_out=new CMat();
	pa_out.arr[0][0] = 1 - (2 * pa_val1.y*pa_val1.y) - (2 * pa_val1.z*pa_val1.z);
	pa_out.arr[0][1] = (2 * pa_val1.x*pa_val1.y) + (2 * pa_val1.z*pa_val1.w);
	pa_out.arr[0][2] = (2 * pa_val1.x*pa_val1.z) - (2 * pa_val1.y*pa_val1.w);
	pa_out.arr[0][3] = 0;

	pa_out.arr[1][0] = (2 * pa_val1.x*pa_val1.y) - (2 * pa_val1.z*pa_val1.w);
	pa_out.arr[1][1] = 1 - (2 * pa_val1.x*pa_val1.x) - (2 * pa_val1.z*pa_val1.z);
	pa_out.arr[1][2] = (2 * pa_val1.y*pa_val1.z) + (2 * pa_val1.x*pa_val1.w);
	pa_out.arr[1][3] = 0;

	pa_out.arr[2][0] = (2 * pa_val1.x*pa_val1.z) + (2 * pa_val1.y*pa_val1.w);
	pa_out.arr[2][1] = (2 * pa_val1.y*pa_val1.z) - (2 * pa_val1.x*pa_val1.w);
	pa_out.arr[2][2] = 1 - (2 * pa_val1.x*pa_val1.x) - (2 * pa_val1.y*pa_val1.y);
	pa_out.arr[2][3] = 0;

	pa_out.arr[3][0] = 0;
	pa_out.arr[3][1] = 0;
	pa_out.arr[3][2] = 0;
	pa_out.arr[3][3] = 1;

	return pa_out;
}
CMath.QutToEuler=function(pa_qut)
{
	var pa_radian=new CVec3();
	var x, y, z, w;

	x = pa_qut.x;
	y = pa_qut.y;
	z = pa_qut.z;
	w = pa_qut.w;

	var sqx = x * x;
	var sqy = y * y;
	var sqz = z * z;
	var sqw = w * w;


	pa_radian.x = Math.asin(2.0 * (pa_qut.w*pa_qut.x - pa_qut.y*pa_qut.z)); // rotation about x-axis
	pa_radian.y = Math.atan2(2.0 * (pa_qut.x*pa_qut.z + pa_qut.w*pa_qut.y), (-sqx - sqy + sqz + sqw)); // rotation about y-axis
	pa_radian.z = Math.atan2(2.0 * (pa_qut.x*pa_qut.y + pa_qut.w*pa_qut.z), (-sqx + sqy - sqz + sqw)); // rotation about z-axis

	return pa_radian;
}
CMath.QutToMatrix=function(pa_val1)
{
	var pa_out=new CMat();
	pa_out.arr[0][0] = 1 - (2 * pa_val1.y*pa_val1.y) - (2 * pa_val1.z*pa_val1.z);
	pa_out.arr[0][1] = (2 * pa_val1.x*pa_val1.y) + (2 * pa_val1.z*pa_val1.w);
	pa_out.arr[0][2] = (2 * pa_val1.x*pa_val1.z) - (2 * pa_val1.y*pa_val1.w);
	pa_out.arr[0][3] = 0;

	pa_out.arr[1][0] = (2 * pa_val1.x*pa_val1.y) - (2 * pa_val1.z*pa_val1.w);
	pa_out.arr[1][1] = 1 - (2 * pa_val1.x*pa_val1.x) - (2 * pa_val1.z*pa_val1.z);
	pa_out.arr[1][2] = (2 * pa_val1.y*pa_val1.z) + (2 * pa_val1.x*pa_val1.w);
	pa_out.arr[1][3] = 0;

	pa_out.arr[2][0] = (2 * pa_val1.x*pa_val1.z) + (2 * pa_val1.y*pa_val1.w);
	pa_out.arr[2][1] = (2 * pa_val1.y*pa_val1.z) - (2 * pa_val1.x*pa_val1.w);
	pa_out.arr[2][2] = 1 - (2 * pa_val1.x*pa_val1.x) - (2 * pa_val1.y*pa_val1.y);
	pa_out.arr[2][3] = 0;

	pa_out.arr[3][0] = 0;
	pa_out.arr[3][1] = 0;
	pa_out.arr[3][2] = 0;
	pa_out.arr[3][3] = 1;

	return pa_out;
}
CMath.QutDot=function(pa_val1,pa_val2)
{
	return pa_val1.x*pa_val2.x + pa_val1.y*pa_val2.y + pa_val1.z*pa_val2.z + pa_val1.w*pa_val2.w;
}
CMath.Vec4PlusVec4=function(_val1,_val2)
{
	return new CVec4(_val1.x + _val2.x, _val1.y + _val2.y, _val1.z + _val2.z, _val1.w + _val2.w);
}


// ray col
CMath.RayTriangleIS=function(pa_one,pa_two,pa_three,pa_ray)
{
	alert("미구현");
}
CMath.RayBoxIS=function(_min,_max,pa_ray)
{
	var inside = true;
	var quadrant = [0,0,0];
	var i;
	var whichPlane;
	var maxT = [0,0,0];
	var candidatePlane = [0,0,0];
	
	var vecList=pa_ray.GetVecList();
	var pOrigin = [ vecList[2].x ,vecList[2].y ,vecList[2].z ];
	var pBoxMin = [ _min.x,_min.y,_min.z ];
	var pBoxMax = [ _max.x,_max.y,_max.z ];
	var pDir = [ vecList[0].x ,vecList[0].y ,vecList[0].z ];
	var pIntersect = [ 0 ,0 ,0 ];

	//박스 1개의 축씩 넘는지 안인지 체크한다
	//켄디데이타에 최소,최대 거리를 넣는다
	for (i = 0; i < 3; ++i)
	{
		if (pOrigin[i] < pBoxMin[i])
		{
			quadrant[i] = RayBoxLEFT;
			candidatePlane[i] = pBoxMin[i];
			inside = false;
		}
		else if (pOrigin[i] > pBoxMax[i])
		{
			quadrant[i] = RayBoxRIGHT;
			candidatePlane[i] = pBoxMax[i];
			inside = false;
		}
		else
		{
			quadrant[i] = RayBoxMIDDLE;
		}
	}

	//셋다 안이면 내부이다
	if (inside)
	{
		//충돌지점은 자신으로 표현
		pa_ray.SetPosition(new CVec3(pOrigin[0], pOrigin[1], pOrigin[2]));

		//*t = 0.0f;
		return true;
	}


	// Calculate T distances to candidate planes
	for (i = 0; i < 3; i++)
	{
		//중심이아니였음 그리고 너무 작은수는 패스
		if (quadrant[i] != RayBoxMIDDLE
			&& (pDir[i] > d_EPSILON || pDir[i] < -d_EPSILON))
		{
			//(맥시멈-현재위치)/기울기
			maxT[i] = (candidatePlane[i] - pOrigin[i]) / pDir[i];
		}
		//아니면 직각이기때문에 -1
		else
		{
			maxT[i] = -1.0;
		}
	}

	//가장 큰값 찾고
	whichPlane = 0;
	for (i = 1; i < 3; i++)
	{
		if (maxT[whichPlane] < maxT[i])
			whichPlane = i;
	}

	// 0보다 작으면 충돌 아닌상황
	if (maxT[whichPlane] < 0.0)
	{
		return false;
	}


	for (i = 0; i < 3; i++)
	{
		//가장 큰값이 아닌경우
		if (whichPlane != i)
		{
			//충돌지점 구하고
			pIntersect[i] = pOrigin[i] + maxT[whichPlane] * pDir[i];
			//민,맥스랑 비교후 넘어가는 경우도 패스
			if (pIntersect[i] < pBoxMin[i] || pIntersect[i] > pBoxMax[i])
			{
				return false;
			}
		}
		else
		{
			//
			pIntersect[i] = candidatePlane[i];
		}
	}
	pa_ray.SetPosition(new CVec3(pIntersect[0], pIntersect[1], pIntersect[2]));
	return true;
}
CMath.RaySphereIS=function(pa_center,pa_radian,pa_ray)
{
	var l = this.Vec3MinusVec3(pa_center, pa_ray.GetOriginal());
	var s = this.Vec3Dot(l, this.Vec3Normalize(pa_ray.GetDirect()));


	var l2 = this.Vec3Dot(l, l);
	var r2 = Math.pow(pa_radian, 2);

	if (s < 0 && l2 > r2)  //각도가 아예 다른 방향이고 반지름이 더 크다는건 내부에 없다는 의미
	{
		return false;					   // 광선이 구의 반대 방향을 향하거나 구를 지나친 경우
	}
	var s2 = Math.pow(s, 2);
	var m2 = l2 - s2;

	if (m2 > r2)
	{
		return false;					  // 광선이 구를 비껴가는 경우
	}

	var q = Math.sqrt(r2 - m2);
	var distance;

	//// 두 개의 교차점 중 어느것을 구하는가?   
	if (l2 > r2)
	{
		distance = s - q;
	}
	else
	{
		distance = s + q;
	}

	pa_ray.SetPosition(this.Vec3PlusVec3(pa_ray.GetOriginal(), this.Vec3MulFloat(pa_ray.GetDirect(), distance)));

	return true;
}
CMath.ColSphereSphere=function(_posA,_radiusA,_posB,_radiusB)
{
	var vlen = this.Vec3Lenght(this.Vec3MinusVec3(_posA, _posB));
	if (vlen <= _radiusA + _radiusB)
		return (_radiusA + _radiusB)-vlen;
	return -1;
}
CMath.Vec3toPlane=function(pa_vec1,pa_vec2,pa_vec3)
{
	var pa_out=new CVec4();
	var L_temp=new CVec3();
	L_temp=this.Vec3Cross(this.Vec3MinusVec3(pa_vec2,pa_vec1), this.Vec3MinusVec3(pa_vec3,pa_vec1));
	L_temp=this.Vec3Normalize(L_temp);
	pa_out=this.NormalAndVertexFromPlane(L_temp, pa_vec1);
	return pa_out;
}
CMath.NormalAndVertexFromPlane=function(pa_normal,pa_vertex)
{
	var pa_out=new CVec4();
	pa_out.x = pa_normal.x;
	pa_out.y = pa_normal.y;
	pa_out.z = pa_normal.z;
	pa_out.w = -this.Vec3Dot(pa_normal, pa_vertex);

	return pa_out;
}
CMath.PlaneVec3DotCoordinate=function(pa_plane,pa_vec)
{
	return this.Vec3Dot(new CVec3(pa_plane.x, pa_plane.y, pa_plane.z), pa_vec) + pa_plane.w;
}
CMath.PlaneVec3DotNormal=function(pa_plane,pa_vec)
{
	return this.Vec3Dot(new CVec3(pa_plane.x, pa_plane.y, pa_plane.z), pa_vec);
}
CMath.PlaneSphereInside=function(pa_plane,pa_posion,pa_radius,_poj)
{
	var outSize=0;
	var inSize=0;
	if (_poj.tOutfJoin)
	{
		outSize = pa_radius;
		inSize = 0;
	}
	else
	{
		outSize = 0;
		inSize = pa_radius;
	}


	var L_dist = 0;
	L_dist = this.PlaneVec3DotCoordinate(pa_plane.GetBottom(), pa_posion);
	if (L_dist + inSize > outSize)
	{
		_poj.plane = d_PlaneBottom;
		_poj.len = L_dist + inSize;
		return;
	}
	L_dist = this.PlaneVec3DotCoordinate(pa_plane.GetFar(), pa_posion);
	if (L_dist + inSize > outSize)
	{
		_poj.plane = d_PlaneFar;
		_poj.len = L_dist + inSize;
		return;
	}
	L_dist = this.PlaneVec3DotCoordinate(pa_plane.GetLeft(), pa_posion);
	if (L_dist + inSize > outSize)
	{
		_poj.plane = d_PlaneLeft;
		_poj.len = L_dist + inSize;
		return;
	}
	L_dist = this.PlaneVec3DotCoordinate(pa_plane.GetNear(), pa_posion);
	if (L_dist + inSize > outSize)
	{
		_poj.plane = d_PlaneNear;
		_poj.len = L_dist + inSize;
		return;
	}
	L_dist = this.PlaneVec3DotCoordinate(pa_plane.GetRight(), pa_posion);
	if (L_dist + inSize > outSize)
	{
		_poj.plane = d_PlaneRight;
		_poj.len = L_dist + inSize;
		return;
	}
	L_dist = this.PlaneVec3DotCoordinate(pa_plane.GetTop(), pa_posion);
	if (L_dist + inSize > outSize)
	{
		_poj.plane = d_PlaneTop;
		_poj.len = L_dist + inSize;
		return;
	}

	_poj.plane = d_PlaneNull;
	_poj.len = 0;
}

CMath.FloatInterpolate=function(_first,_second,pa_time)
{
	return _first * (1.0 - pa_time) + _second * pa_time;
}
CMath.QutInterpolate=function(pa_first,pa_second,pa_time)
{
	var pa_out=new CVec4();
	
	var		omega, cosom, sinom, scale0, scale1;
	cosom=this.QutDot(pa_first, pa_second); // = cos(θ)
	//float fAngle = acos(fcos);

	if (cosom < 0.0)//내적해서 0보다 작다는건
	{
		cosom *= -1;
		pa_first.x *= -1;
		pa_first.y *= -1;
		pa_first.z *= -1;
		pa_first.w *= -1;
	}
	if ((1.0 - cosom) > 0.0)
	{
		// standard case (slerp)
		omega = acos(cosom);
		sinom = sin(omega);
		scale0 = Math.sin((1.0 - pa_time) * omega) / sinom;
		scale1 = Math.sin(pa_time * omega) / sinom;


	}
	else {
		// "from" and "to" quaternions are very close
		//  ... so we can do a linear interpolation
		scale0 = 1.0 - pa_time;
		scale1 = pa_time;
	}
	// calculate final values
	pa_out.x = scale1 * pa_second.x + scale0 * pa_first.x;
	pa_out.y = scale1 * pa_second.y + scale0 * pa_first.y;
	pa_out.z = scale1 * pa_second.z + scale0 * pa_first.z;
	pa_out.w = scale1 * pa_second.w + scale0 * pa_first.w;

	return pa_out;
}

CMath.CloseToExp=function(fInput,fExponent)
{
	if (fInput > 0.0 && fInput <= 1.0)
		return 0;

	var fResult = Math.log(this.Abs(fInput)) / Math.log(fExponent);

	var nResult = parseInt(fResult);

	var fEpsilon = this.Abs(fResult - parseInt(fResult));

	if (this.Abs(fEpsilon - 0.0) <= g_fEpsilon)
		return parseInt(Math.pow(fExponent, nResult));

	nResult = parseInt(Math.pow(fExponent, nResult + 1));

	if (fInput < 0.0)
		return -nResult;

	return nResult;
}
CMath.MatRotExport=function(pa_viewMat,pa_x,pa_y,pa_z)
{
	var pa_outMat=new CMat();

	
	if (pa_x)
	{
		pa_outMat.arr[1][1] = pa_viewMat.arr[1][1]; pa_outMat.arr[1][2] = pa_viewMat.arr[1][2];
		pa_outMat.arr[2][1] = pa_viewMat.arr[2][1]; pa_outMat.arr[2][2] = pa_viewMat.arr[2][2];
	}
	if (pa_y)
	{
		pa_outMat.arr[0][0] = pa_viewMat.arr[0][0]; pa_outMat.arr[0][2] = pa_viewMat.arr[0][2];
		pa_outMat.arr[2][0] = pa_viewMat.arr[2][0]; pa_outMat.arr[2][2] = pa_viewMat.arr[2][2];
	}
	if (pa_z)
	{
		pa_outMat.arr[0][0] = pa_viewMat.arr[0][0]; pa_outMat.arr[0][1] = pa_viewMat.arr[0][1];
		pa_outMat.arr[1][0] = pa_viewMat.arr[1][0]; pa_outMat.arr[1][1] = pa_viewMat.arr[1][1];
	}
	return pa_outMat;
}
CMath.UvIndexToVertexIndex=function(pa_po_vertex,pa_po_uv,pa_po_normal,pa_po_weight,pa_po_weightIndex,
		RF_index,RF_Tface)
{
	var L_vertexNum = pa_po_vertex.size(3);
	var L_indexNum = RF_index.size()/3;

	//1. 버텍스와 인덱스를 복사해둔다
	//d_VEC_VEC3 L_aVer;
	var L_aUv=new CFloatArray();

	//오지지날 인덱스를 만들어서 절대영역을 만들어 둔다

	var L_aIn=new Array();
	//L_aIn.resize(L_indexNum * 3);
	for (var i = 0; i < L_indexNum * 3; ++i)
	{
		L_aIn.push(RF_index[i]);
	}

	var L_list=new Array();
	for (var i = 0; i < L_vertexNum; ++i)
	{
		L_list.push(new s_FACE());
	}
	//L_list.resize(L_vertexNum);

	for (var i = 0; i < L_indexNum; ++i)
	{
		for (var j = 0; j < L_list[RF_index[i*3 + 0]].Tface.size(); ++j)
		{
			if (L_list[RF_index[i*3]+0].Tface[j] == RF_Tface[i*3 + 0])
			{
				RF_index[i*3 + 0] = L_list[L_aIn[i*3]+0].Cindex[j];
				L_list[L_aIn[i*3 + 0]].Cindex.push_back(RF_index[i*3 + 0]);
				break;
			}
			if (L_list[RF_index[i*3 + 0]].Tface.size() == j + 1)
			{
				pa_po_vertex.Push(pa_po_vertex.V3(RF_index[i * 3 + 0]));
				RF_index[i * 3 + 0] = pa_po_vertex.Size(3) - 1;
				L_list[L_aIn[i*3 + 0]].Cindex.push_back(RF_index[i*3 + 0]);
				break;
			}

		}

		L_list[L_aIn[i*3 + 0]].Tface.push_back(RF_Tface[i*3 + 0]);
		if (L_list[L_aIn[i*3 + 0]].Cindex.empty())
			L_list[L_aIn[i*3 + 0]].Cindex.push_back(L_aIn[i*3 + 0]);
		//======================================================
		for (var j = 0; j < L_list[RF_index[i*3+1]].Tface.size(); ++j)
		{
			if (L_list[RF_index[i*3+1]].Tface[j] == RF_Tface[i*3+1])
			{
				RF_index[i*3+1] = L_list[L_aIn[i*3+1]].Cindex[j];
				L_list[L_aIn[i*3+1]].Cindex.push_back(RF_index[i*3+1]);
				break;
			}
			if (L_list[RF_index[i*3+1]].Tface.size() == j + 1)
			{
				pa_po_vertex.Push(pa_po_vertex.V3(RF_index[i * 3 + 1]));
				RF_index[i * 3 + 1] = pa_po_vertex.Size(3) - 1;
				L_list[L_aIn[i*3+1]].Cindex.push_back(RF_index[i*3+1]);
				break;
			}

		}

		L_list[L_aIn[i*3+1]].Tface.push_back(RF_Tface[i*3+1]);
		if (L_list[L_aIn[i*3+1]].Cindex.empty())
			L_list[L_aIn[i*3+1]].Cindex.push_back(L_aIn[i*3+1]);
		//======================================================
		for (var j = 0; j < L_list[RF_index[i*3+2]].Tface.size(); ++j)
		{
			if (L_list[RF_index[i*3+2]].Tface[j] == RF_Tface[i*3+2])
			{
				RF_index[i*3+2] = L_list[L_aIn[i*3+2]].Cindex[j];
				L_list[L_aIn[i*3+2]].Cindex.push_back(RF_index[i*3+2]);
				break;
			}
			if (L_list[RF_index[i*3+2]].Tface.size() == j + 1)
			{
				pa_po_vertex.Push(pa_po_vertex.V3(RF_index[i * 3 + 2]));
				RF_index[i * 3 + 2] = pa_po_vertex.Size(3) - 1;
				L_list[L_aIn[i*3+2]].Cindex.push_back(RF_index[i*3+2]);
				break;
			}

		}

		L_list[L_aIn[i*3+2]].Tface.push_back(RF_Tface[i*3+2]);
		if (L_list[L_aIn[i*3+2]].Cindex.empty())
			L_list[L_aIn[i*3+2]].Cindex.push_back(L_aIn[i*3+2]);


	}
	//delete [] mpar_uv;
	
	L_vertexNum = pa_po_vertex.Size(3);
	var L_uv=new CFloatArray();
	L_uv.Resize(L_vertexNum*2);





	if (pa_po_vertex.Empty())
		CMsg.E("체크코드");
	var L_nor=new CFloatArray();;
	var L_we=new CFloatArray();;
	var L_weI=new CFloatArray();;
	var L_ref=new CFloatArray();;

	var L_copy = [ false,false,false ];//0노말
	if (!pa_po_normal.Empty())
	{
		L_copy[0] = true;
		L_nor.Resize(L_vertexNum*3);
	}
	if (!pa_po_weight.Empty())
	{
		L_copy[1] = true;
		L_we.Resize(L_vertexNum * 4);
	}
	if (!pa_po_weightIndex.Empty())
	{
		L_copy[2] = true;
		L_weI.Resize(L_vertexNum*4);
	}



	for (var i = 0; i < L_indexNum; ++i)
	{
		L_uv.V2(RF_index[i * 3 + 0] ,pa_po_uv.V2(RF_Tface[i * 3 + 0] ));
		L_uv.V2(RF_index[i * 3 + 1], pa_po_uv.V2(RF_Tface[i * 3 + 1] ));
		L_uv.V2(RF_index[i * 3 + 2], pa_po_uv.V2(RF_Tface[i * 3 + 2] ));
		
		if (L_copy[0])
		{

			L_nor.V3(RF_index[i * 3 + 0], pa_po_normal.V3(L_aIn[i * 3 + 0]));
			L_nor.V3(RF_index[i * 3 + 1], pa_po_normal.V3(L_aIn[i * 3 + 1]));
			L_nor.V3(RF_index[i * 3 + 2], pa_po_normal.V3(L_aIn[i * 3 + 2]));
		}
		if (L_copy[1])
		{
			L_we.V4(RF_index[i * 3 + 0], pa_po_weight.V4(L_aIn[i * 3 + 0]));
			L_we.V4(RF_index[i * 3 + 1], pa_po_weight.V4(L_aIn[i * 3 + 1]));
			L_we.V4(RF_index[i * 3 + 2], pa_po_weight.V4(L_aIn[i * 3 + 2]));
			
		}
		if (L_copy[2])
		{
			L_weI.V4(RF_index[i * 3 + 0], pa_po_weightIndex.V4(L_aIn[i * 3 + 0]));
			L_weI.V4(RF_index[i * 3 + 1], pa_po_weightIndex.V4(L_aIn[i * 3 + 1]));
			L_weI.V4(RF_index[i * 3 + 2], pa_po_weightIndex.V4(L_aIn[i * 3 + 2]));

			
		}


		
	}

	pa_po_uv=L_uv;
	pa_po_normal = L_nor;
	pa_po_weight = L_we;
	pa_po_weightIndex = L_weI;


}
CMath.MatTranspose=function(_mat)
{
	var L_out=new CMat();
	for (var y = 0; y < 4; ++y)
	{
		for (var x = 0; x < 4; ++x)
		{
			if (x == y)
				continue;
			L_out.arr[x][y] = _mat.arr[y][x];
		}
	}

	return L_out;
}
CMath.BoundMulMat=function(_bound,_mat)
{
	var rBound=new CBound();
	rBound.min = this.MatToVec3Normal(_bound.min, _mat);
	rBound.max = this.MatToVec3Normal(_bound.max, _mat);

	return rBound;
}
CMath.ColBoxBoxOBB=function(_boundA,_matA,_boundB,_matB)
{
	var L_center=[new CVec3(),new CVec3()];
	var L_dir=[[new CVec3(),new CVec3(),new CVec3()],[new CVec3(),new CVec3(),new CVec3()]];
	var  L_len=[new CVec3(),new CVec3()];
	var L_rLen=[new CVec3(),new CVec3()];


	L_dir[0][0] = new CVec3(_matA.arr[0][0], _matA.arr[0][1], _matA.arr[0][2]);
	L_dir[0][1] = new CVec3(_matA.arr[1][0], _matA.arr[1][1], _matA.arr[1][2]);
	L_dir[0][2] = new CVec3(_matA.arr[2][0], _matA.arr[2][1], _matA.arr[2][2]);

	L_dir[1][0] = new CVec3(_matB.arr[0][0], _matB.arr[0][1], _matB.arr[0][2]);
	L_dir[1][1] = new CVec3(_matB.arr[1][0], _matB.arr[1][1], _matB.arr[1][2]);
	L_dir[1][2] = new CVec3(_matB.arr[2][0], _matB.arr[2][1], _matB.arr[2][2]);

	L_center[0] = _matA.GetPos();
	L_center[1] = _matB.GetPos();

	L_dir[0][0] = this.Vec3Normalize(L_dir[0][0]);
	L_dir[0][1] = this.Vec3Normalize(L_dir[0][1]);
	L_dir[0][2] = this.Vec3Normalize(L_dir[0][2]);

	L_dir[1][0] = this.Vec3Normalize(L_dir[1][0]);
	L_dir[1][1] = this.Vec3Normalize(L_dir[1][1]);
	L_dir[1][2] = this.Vec3Normalize(L_dir[1][2]);


	L_len[0] = _boundA.GetRadiusLen();
	L_len[1] = _boundB.GetRadiusLen();

	L_rLen[0].x = this.Vec3Lenght(new CVec3(_matA.arr[0][0], _matA.arr[0][1], _matA.arr[0][2]));
	L_rLen[0].y = this.Vec3Lenght(new CVec3(_matA.arr[1][0], _matA.arr[1][1], _matA.arr[1][2]));
	L_rLen[0].z = this.Vec3Lenght(new CVec3(_matA.arr[2][0], _matA.arr[2][1], _matA.arr[2][2]));

	L_rLen[1].x = this.Vec3Lenght(new CVec3(_matB.arr[0][0], _matB.arr[0][1], _matB.arr[0][2]));
	L_rLen[1].y = this.Vec3Lenght(new CVec3(_matB.arr[1][0], _matB.arr[1][1], _matB.arr[1][2]));
	L_rLen[1].z = this.Vec3Lenght(new CVec3(_matB.arr[2][0], _matB.arr[2][1], _matB.arr[2][2]));

	L_len[0].x *= L_rLen[0].x;
	L_len[0].y *= L_rLen[0].y;
	L_len[0].z *= L_rLen[0].z;
	L_len[1].x *= L_rLen[1].x;
	L_len[1].y *= L_rLen[1].y;
	L_len[1].z *= L_rLen[1].z;

	//XZ는 -1~1  Y는 0~2단위라서 절반하면 절반만큼 오차가 생긴다
	//그부분 수정용
	//L_center[0].y+=(pa_A.max.y*L_rLen[0].y)-L_len[0].y;
	//L_center[1].y+=(pa_B.max.y*L_rLen[1].y)-L_len[1].y;

	var L_diff=[new CVec3(),new CVec3()];;
	L_diff[0] = this.Vec3MulFloat(this.Vec3PlusVec3(_boundA.max , _boundA.min),0.5);
	L_diff[1] = this.Vec3MulFloat(this.Vec3PlusVec3(_boundB.max , _boundB.min),0.5);

	L_diff[0]=MatToVec3Normal(L_diff[0], _matA);
	L_diff[1] = this.MatToVec3Normal(L_diff[1], _matB);

	L_center[0] = this.Vec3PlusVec3(L_center[0], L_diff[0]);
	L_center[1] = this.Vec3PlusVec3(L_center[1], L_diff[1]);



	// 여기서 R0 항목은 OBB A의 interval radius, R1 항목은 OBB B의 interval radius, R 항목은 2개의 OBB의 중심 간의 투영된 거리를 나타낸다.
	// D 벡터는 2개의 OBB의 중심을 잇는 벡터를 나타낸다.
	// Cij 는 rotation matrix R에서의 (i,j) 항을 나타낸다.
	var c=[[0,0,0],[0,0,0],[0,0,0]];
	var absC=[[0,0,0],[0,0,0],[0,0,0]];
	var d=[0,0,0];

	var r0=0, r1=0, r=0;
	var i=0;

	var cutoff = 0.999999;
	var existsParallelPair = false;

	var diff = this.Vec3MinusVec3(L_center[0],L_center[1]);


	//3축을 구하고 A0,A1,A2를 구한다
	for (i = 0; i < 3; ++i)
	{
		//A박스 공간에서 B에 r1을 구한다
		c[0][i] = this.Vec3Dot(L_dir[0][0], L_dir[1][i]);
		//내적 공식상 90도를 넘으면 -인데 
		//A기준으로 같은 축을 사용한다는 의미로 양수값을 나오게 했다
		absC[0][i] = this.Abs(c[0][i]);
		if (absC[0][i] > cutoff)
			existsParallelPair = true;
	}
	//A박스축 기준으로 D를 구하고
	d[0] = this.Vec3Dot(diff, L_dir[0][0]);
	r = this.Abs(d[0]);
	r0 = L_len[0].x;
	r1 = L_len[1].x * absC[0][0] + L_len[1].y * absC[0][1] + L_len[1].z * absC[0][2];

	if (r > r0 + r1)//두 값을 더해서 R보다 크면 분리된 상태이다
		return false;



	for (i = 0; i < 3; ++i)
	{
		c[1][i] = this.Vec3Dot(L_dir[0][1], L_dir[1][i]);
		absC[1][i] = this.Abs(c[1][i]);
		if (absC[1][i] > cutoff)
			existsParallelPair = true;
	}
	d[1] = this.Vec3Dot(diff, L_dir[0][1]);
	r = this.Abs(d[1]);
	r0 = L_len[0].y;
	r1 = L_len[1].x * absC[1][0] + L_len[1].y * absC[1][1] + L_len[1].z * absC[1][2];

	if (r > r0 + r1)
		return false;



	for (i = 0; i < 3; ++i)
	{
		c[2][i] = this.Vec3Dot(L_dir[0][2], L_dir[1][i]);
		absC[2][i] = this.Abs(c[2][i]);
		if (absC[2][i] > cutoff)
			existsParallelPair = true;
	}
	d[2] = this.Vec3Dot(diff, L_dir[0][2]);
	r = this.Abs(d[2]);
	r0 = L_len[0].z;
	r1 = L_len[1].x * absC[2][0] + L_len[1].y * absC[2][1] + L_len[1].z * absC[2][2];

	if (r > r0 + r1)
		return false;


	//A공간 계산될걸 기준으로 B0,..구한다
	r = this.Abs(Vec3Dot(diff, L_dir[1][0]));
	r0 = L_len[0].x * absC[0][0] + L_len[0].y * absC[1][0] + L_len[0].z * absC[2][0];
	r1 = L_len[1].x;
	if (r > r0 + r1)
		return false;



	r = this.Abs(this.Vec3Dot(diff, L_dir[1][1]));
	r0 = L_len[0].x * absC[0][1] + L_len[0].y * absC[1][1] + L_len[0].z * absC[2][1];
	r1 = L_len[1].y;

	if (r > r0 + r1)
		return false;



	r = this.Abs(this.Vec3Dot(diff, L_dir[1][2]));
	r0 = L_len[0].x * absC[0][2] + L_len[0].y * absC[1][2] + L_len[0].z * absC[2][2];
	r1 = L_len[1].z;

	if (r > r0 + r1)
		return false;


	//충돌된 상태이다
	if (existsParallelPair == true)
		return true;



	r = this.Abs(d[2] * c[1][0] - d[1] * c[2][0]);
	r0 = L_len[0].y * absC[2][0] + L_len[0].z * absC[1][0];
	r1 = L_len[1].y * absC[0][2] + L_len[1].z * absC[0][1];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[2] * c[1][1] - d[1] * c[2][1]);
	r0 = L_len[0].y * absC[2][1] + L_len[0].z * absC[1][1];
	r1 = L_len[1].x * absC[0][2] + L_len[1].z * absC[0][0];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[2] * c[1][2] - d[1] * c[2][2]);
	r0 = L_len[0].y * absC[2][2] + L_len[0].z * absC[1][2];
	r1 = L_len[1].x * absC[0][1] + L_len[1].y * absC[0][0];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[0] * c[2][0] - d[2] * c[0][0]);
	r0 = L_len[0].x * absC[2][0] + L_len[0].z * absC[0][0];
	r1 = L_len[1].y * absC[1][2] + L_len[1].z * absC[1][1];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[0] * c[2][1] - d[2] * c[0][1]);
	r0 = L_len[0].x * absC[2][1] + L_len[0].z * absC[0][1];
	r1 = L_len[1].x * absC[1][2] + L_len[1].z * absC[1][0];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[0] * c[2][2] - d[2] * c[0][2]);
	r0 = L_len[0].x * absC[2][2] + L_len[0].z * absC[0][2];
	r1 = L_len[1].x * absC[1][1] + L_len[1].y * absC[1][0];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[1] * c[0][0] - d[0] * c[1][0]);
	r0 = L_len[0].x * absC[1][0] + L_len[0].y * absC[0][0];
	r1 = L_len[1].y * absC[2][2] + L_len[1].z * absC[2][1];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[1] * c[0][1] - d[0] * c[1][1]);
	r0 = L_len[0].x * absC[1][1] + L_len[0].y * absC[0][1];
	r1 = L_len[1].x * absC[2][2] + L_len[1].z * absC[2][0];
	if (r > r0 + r1)
		return false;



	r = this.Abs(d[1] * c[0][2] - d[0] * c[1][2]);
	r0 = L_len[0].x * absC[1][2] + L_len[0].y * absC[0][2];
	r1 = L_len[1].x * absC[2][1] + L_len[1].y * absC[2][0];
	if (r > r0 + r1)
		return 0;



	return true;
}


CMath.TwoVec3DirAngle=function(pa_vec1,pa_vec2)
{
	var radian=0;
	pa_vec1 = this.Vec3Normalize(pa_vec1);
	pa_vec2 = this.Vec3Normalize(pa_vec2);

	var L_cro = this.Vec3Cross(pa_vec1, pa_vec2);
	radian = Math.acos(this.Vec3Dot(pa_vec2, pa_vec1));
	var dir = L_cro.x + L_cro.y + L_cro.z;
	if (dir < 0)
		radian = -radian;
	return radian;
}
CMath.TangentCalculate=function(pa_verArr,pa_norArr,pa_uvArr,pa_index,pa_out)
{
	var tan1=new Array();
	var tan2=new Array();
	for(var i=0;i< pa_verArr.Size(3);++i)
	{
		tan1[i]=new CVec3(); 
		tan2[i]=new CVec3();
	}
	
	
	for (var a = 0; a < pa_index.size(); a+=3)
	{
		var i0 = pa_index[a+0];//pa_index->i0;
		var i1 = pa_index[a+1];//pa_index->i1;
		var i2 = pa_index[a+2];//pa_index->i2;

		var v1 = this.Vec3MinusVec3(pa_verArr.V3(i1), pa_verArr.V3(i0));
		var v2 = this.Vec3MinusVec3(pa_verArr.V3(i2), pa_verArr.V3(i0));

		var uv1 = this.Vec2MinusVec2(pa_uvArr.V2(i1), pa_uvArr.V2(i0));
		var uv2 = this.Vec2MinusVec2(pa_uvArr.V2(i2), pa_uvArr.V2(i0));


		var r = 1.0 / (uv1.x * uv2.y - uv2.x * uv1.y);
		var sdir=new CVec3((uv2.y * v1.x - uv1.y * v2.x) * r, (uv2.y * v1.y - uv1.y * v2.y) * r,
			(uv2.y * v1.z - uv1.y * v2.z) * r);
		var tdir=new CVec3((uv1.x * v2.x - uv2.x * v1.x) * r, (uv1.x * v2.y - uv2.x * v1.y) * r,
			(uv1.x * v2.z - uv2.x * v1.z) * r);

		tan1[i0] = this.Vec3PlusVec3(tan1[i0], sdir);
		tan1[i1] = this.Vec3PlusVec3(tan1[i1], sdir);
		tan1[i2] = this.Vec3PlusVec3(tan1[i2], sdir);

		tan2[i0] = this.Vec3PlusVec3(tan2[i0], tdir);
		tan2[i1] = this.Vec3PlusVec3(tan2[i1], tdir);
		tan2[i2] = this.Vec3PlusVec3(tan2[i2], tdir);


	}

	for (var a = 0; a < pa_verArr.size(); a++)
	{
		var n = pa_norArr[a];
		var t = tan1[a];

		var xyz = this.Vec3Normalize(this.Vec3MulFloat(this.Vec3MinusVec3(t, n), this.Vec3Dot(n, t)));


		// Calculate handedness 이게 손좌표계인거 같은데 
		var w = (this.Vec3Dot(this.Vec3Cross(n, t), tan2[a]) < 0.0) ? -1.0 : 1.0;
		pa_out.V4(a, xyz.x, xyz.y, xyz.z, w);
		//pa_out[a].w = (Vec3_Dot(Vec3_Cross_Outer(n, t), tan2[a]) < 0.0F) ? 1.0F : -1.0F;
	}
}
CMath.PolygonNormalToVertexNormal=function(_nor,pa_index,pa_verNum)
{

	var L_out=new Array();
	for(var i=0;i<pa_verNum;++i)
	{
		L_out.push_back(new CVec3());
	}
	


	for (var i = 0; i < pa_index.size(); ++i)
	{
		L_out[pa_index[i]] = this.Vec3PlusVec3(_nor.V3(i), L_out[pa_index[i]]);
	}
	for (var i = 0; i < L_out.size(); ++i)
	{
		L_out[i] = this.Vec3Normalize(L_out[i]);
	}
	_nor.Clear();
	for (var i = 0; i < pa_verNum; ++i)
	{
		_nor.Push(L_out[i]);
	}
}