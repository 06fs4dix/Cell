package cell;

import java.util.Vector;

class s_FACE
{
	public Vector<Integer> Tface=new Vector<Integer>();
	public Vector<Integer> Cindex=new Vector<Integer>();//change Index
};


public class CMath
{
	static int RayBoxRIGHT = 0;
	static int RayBoxLEFT = 1;
	static int RayBoxMIDDLE = 2;
	static float d_EPSILON = 1e-6f;
	static float d_MAX_FLOAT = 3.40282346638528860e+38f;
	static float d_PI=3.141592f;
	static float g_fEpsilon = 0.0001f;
	

	static public int Min(int _a, int _b)
	{
		return _a > _b ? _b : _a;
	}
	static public int Max(int _a, int _b)
	{
		return _a > _b ? _a : _b;
	}
	static public float Min(float _a, float _b)
	{
		return _a > _b ? _b : _a;
	}
	static public float Max(float _a, float _b)
	{
		return _a > _b ? _a : _b;
	}
	static public float Abs(float _val)
	{
		return Math.abs(_val);
	}
	
	
	
	//Vec3=======================================================================
	static public CVec3 Vec3PlusVec3(CVec3 _a, CVec3 _b)
	{
		return new CVec3(_a.x + _b.x, _a.y + _b.y, _a.z + _b.z);
	}
	static public CVec3 Vec3MinusVec3(CVec3 _a, CVec3 _b)
	{
		return new CVec3(_a.x - _b.x, _a.y - _b.y, _a.z - _b.z);
	}
	static public CVec3 Vec3MulFloat(CVec3 _a, float _b)
	{
		return new CVec3(_a.x*_b, _a.y*_b, _a.z*_b);
	}
	static public float Vec3Lenght(CVec3 _a)
	{
		return (float) Math.sqrt(_a.x*_a.x + _a.y*_a.y + _a.z*_a.z);
	}
	static public float PosAnPosLen(CVec3 _a,CVec3 _b)
	{
		return Vec3Lenght(Vec3MinusVec3(_a, _b));
	}
	static public CVec3 Vec3Normalize(CVec3 _a)
	{
		if (_a.IsZero())
			return new CVec3(0, -1, 0);
		float dummy = Vec3Lenght(_a);
	
		return new CVec3(_a.x / dummy, _a.y / dummy, _a.z / dummy);
	}
	static public float Vec3Dot(CVec3 _a, CVec3 _b)
	{
		return _a.x*_b.x + _a.y*_b.y + _a.z*_b.z;
	}
	static public CVec3 Vec3Cross(CVec3 _a, CVec3 _b)
	{
		CVec3 rVal =new CVec3();
	
		rVal.x = _a.y * _b.z - _a.z * _b.y;
		rVal.y = _a.z * _b.x - _a.x * _b.z;
		rVal.z = _a.x * _b.y - _a.y * _b.x;
	
		return rVal;
	}
	
	//Mat=================================================================
	static public CMat MatAxisToRotation(CVec3 axis, float radianAngle)
	{
		CMat rVal =new CMat();
		float L_s = (float) Math.sin(radianAngle);
		float L_c = (float) Math.cos(radianAngle);
		float L_d = 1 - L_c;
		rVal.arr[0][0] = (L_d*(axis.x*axis.x)) + L_c; rVal.arr[0][1] = (L_d*axis.x*axis.y) + (axis.z*L_s);
		rVal.arr[0][2] = (L_d*axis.x*axis.z) - (axis.y*L_s); rVal.arr[0][3] = 0;
	
		rVal.arr[1][0] = (L_d*axis.x*axis.y) - (axis.z*L_s); rVal.arr[1][1] = (L_d*(axis.y*axis.y)) + L_c;
		rVal.arr[1][2] = (L_d*axis.y*axis.z) + (axis.x*L_s); rVal.arr[1][3] = 0;
	
		rVal.arr[2][0] = (L_d*axis.x*axis.y) + (axis.y*L_s); rVal.arr[2][1] = (L_d*axis.y*axis.z) - (axis.x*L_s);
		rVal.arr[2][2] = (L_d*(axis.z*axis.z)) + L_c; rVal.arr[2][3] = 0;
	
		rVal.arr[3][0] = 0; rVal.arr[3][1] = 0; rVal.arr[3][2] = 0; rVal.arr[3][3] = 1;
	
		return rVal;
	}
	static public CMat MatScale(CVec3 pa_vec)
	{
		CMat pa_out =new CMat();
		pa_out.arr[0][0] = pa_vec.x; pa_out.arr[0][1] = 0; pa_out.arr[0][2] = 0; pa_out.arr[0][3] = 0;
		pa_out.arr[1][0] = 0; pa_out.arr[1][1] = pa_vec.y; pa_out.arr[1][2] = 0; pa_out.arr[1][3] = 0;
		pa_out.arr[2][0] = 0; pa_out.arr[2][1] = 0; pa_out.arr[2][2] = pa_vec.z; pa_out.arr[2][3] = 0;
		pa_out.arr[3][0] = 0; pa_out.arr[3][1] = 0; pa_out.arr[3][2] = 0; pa_out.arr[3][3] = 1;
	
		return pa_out;
	}
	
	static public CMat MatMul(CMat pa_val1, CMat pa_val2)
	{
		CMat L_matrix =new CMat();
		L_matrix.arr[0][0] = 0;
		L_matrix.arr[1][1] = 0;
		L_matrix.arr[2][2] = 0;
		L_matrix.arr[3][3] = 0;
	
	
		for (int i = 0; i < 4; ++i)
		{
			for (int j = 0; j < 4; ++j)
			{
				for (int k = 0; k < 4; ++k)
				{
					L_matrix.arr[i][j] += pa_val1.arr[i][k] * pa_val2.arr[k][j];
				}
			}
		}
		return L_matrix;
	}
	static public CVec3 MatToVec3Normal(CVec3 pa_vec, CMat pa_mat)
	{
		CVec3 pa_out=new CVec3();
	
		pa_out.x = (pa_mat.arr[0][0] * pa_vec.x) + (pa_mat.arr[1][0] * pa_vec.y) + (pa_mat.arr[2][0] * pa_vec.z);
		pa_out.y = (pa_mat.arr[0][1] * pa_vec.x) + (pa_mat.arr[1][1] * pa_vec.y) + (pa_mat.arr[2][1] * pa_vec.z);
		pa_out.z = (pa_mat.arr[0][2] * pa_vec.x) + (pa_mat.arr[1][2] * pa_vec.y) + (pa_mat.arr[2][2] * pa_vec.z);
	
		return pa_out;
	}
	static public CVec3 MatToVec3Coordinate(CVec3 pa_vec, CMat pa_mat)
	{
		CVec3 rVal =new CVec3();
		float x, y, z, w;
	
	
		x = (pa_mat.arr[0][0] * pa_vec.x) + (pa_mat.arr[1][0] * pa_vec.y) + (pa_mat.arr[2][0] * pa_vec.z) + pa_mat.arr[3][0];
		y = (pa_mat.arr[0][1] * pa_vec.x) + (pa_mat.arr[1][1] * pa_vec.y) + (pa_mat.arr[2][1] * pa_vec.z) + pa_mat.arr[3][1];
		z = (pa_mat.arr[0][2] * pa_vec.x) + (pa_mat.arr[1][2] * pa_vec.y) + (pa_mat.arr[2][2] * pa_vec.z) + pa_mat.arr[3][2];
		w = (pa_mat.arr[0][3] * pa_vec.x) + (pa_mat.arr[1][3] * pa_vec.y) + (pa_mat.arr[2][3] * pa_vec.z) + pa_mat.arr[3][3];
	
		rVal.x = x / w;
		rVal.y = y / w;
		rVal.z = z / w;
	
		return rVal;
	}
	static public  CMat MatInvert(CMat pa_val1)
	{
		CMat pa_out=new CMat();
		float tmp[]=new float[12];
		float src[]=new float[16];
		float det;
		//float * dst = pa_out->ToPT();
		//float * mat = L_temp.ToPT();
	
		/* transpose matrix */
		for (int i = 0; i < 4; i++) {
			src[i] = pa_val1.arr[i][0];
			src[i + 4] = pa_val1.arr[i][1];
			src[i + 8] = pa_val1.arr[i][2];
			src[i + 12] = pa_val1.arr[i][3];
		}
		/* calculate pairs for first 8 elements (cofactors) */
		tmp[0] = src[10] * src[15];
		tmp[1] = src[11] * src[14];
		tmp[2] = src[9] * src[15];
		tmp[3] = src[11] * src[13];
		tmp[4] = src[9] * src[14];
		tmp[5] = src[10] * src[13];
		tmp[6] = src[8] * src[15];
		tmp[7] = src[11] * src[12];
		tmp[8] = src[8] * src[14];
		tmp[9] = src[10] * src[12];
		tmp[10] = src[8] * src[13];
		tmp[11] = src[9] * src[12];
		/* calculate first 8 elements (cofactors) */
		pa_out.arr[0][0] = tmp[0] * src[5] + tmp[3] * src[6] + tmp[4] * src[7];
		pa_out.arr[0][0] -= tmp[1] * src[5] + tmp[2] * src[6] + tmp[5] * src[7];
		pa_out.arr[0][1] = tmp[1] * src[4] + tmp[6] * src[6] + tmp[9] * src[7];
		pa_out.arr[0][1] -= tmp[0] * src[4] + tmp[7] * src[6] + tmp[8] * src[7];
		pa_out.arr[0][2] = tmp[2] * src[4] + tmp[7] * src[5] + tmp[10] * src[7];
		pa_out.arr[0][2] -= tmp[3] * src[4] + tmp[6] * src[5] + tmp[11] * src[7];
		pa_out.arr[0][3] = tmp[5] * src[4] + tmp[8] * src[5] + tmp[11] * src[6];
		pa_out.arr[0][3] -= tmp[4] * src[4] + tmp[9] * src[5] + tmp[10] * src[6];
		pa_out.arr[1][0] = tmp[1] * src[1] + tmp[2] * src[2] + tmp[5] * src[3];
		pa_out.arr[1][0] -= tmp[0] * src[1] + tmp[3] * src[2] + tmp[4] * src[3];
		pa_out.arr[1][1] = tmp[0] * src[0] + tmp[7] * src[2] + tmp[8] * src[3];
		pa_out.arr[1][1] -= tmp[1] * src[0] + tmp[6] * src[2] + tmp[9] * src[3];
		pa_out.arr[1][2] = tmp[3] * src[0] + tmp[6] * src[1] + tmp[11] * src[3];
		pa_out.arr[1][2] -= tmp[2] * src[0] + tmp[7] * src[1] + tmp[10] * src[3];
		pa_out.arr[1][3] = tmp[4] * src[0] + tmp[9] * src[1] + tmp[10] * src[2];
		pa_out.arr[1][3] -= tmp[5] * src[0] + tmp[8] * src[1] + tmp[11] * src[2];
		/* calculate pairs for second 8 elements (cofactors) */
		tmp[0] = src[2] * src[7];
		tmp[1] = src[3] * src[6];
		tmp[2] = src[1] * src[7];
		tmp[3] = src[3] * src[5];
		tmp[4] = src[1] * src[6];
		tmp[5] = src[2] * src[5];
		tmp[6] = src[0] * src[7];
		tmp[7] = src[3] * src[4];
		tmp[8] = src[0] * src[6];
		tmp[9] = src[2] * src[4];
		tmp[10] = src[0] * src[5];
		tmp[11] = src[1] * src[4];
		/* calculate second 8 elements (cofactors) */
		pa_out.arr[2][0] = tmp[0] * src[13] + tmp[3] * src[14] + tmp[4] * src[15];
		pa_out.arr[2][0] -= tmp[1] * src[13] + tmp[2] * src[14] + tmp[5] * src[15];
		pa_out.arr[2][1] = tmp[1] * src[12] + tmp[6] * src[14] + tmp[9] * src[15];
		pa_out.arr[2][1] -= tmp[0] * src[12] + tmp[7] * src[14] + tmp[8] * src[15];
		pa_out.arr[2][2] = tmp[2] * src[12] + tmp[7] * src[13] + tmp[10] * src[15];
		pa_out.arr[2][2] -= tmp[3] * src[12] + tmp[6] * src[13] + tmp[11] * src[15];
		pa_out.arr[2][3] = tmp[5] * src[12] + tmp[8] * src[13] + tmp[11] * src[14];
		pa_out.arr[2][3] -= tmp[4] * src[12] + tmp[9] * src[13] + tmp[10] * src[14];
	
		pa_out.arr[3][0] = tmp[2] * src[10] + tmp[5] * src[11] + tmp[1] * src[9];
		pa_out.arr[3][0] -= tmp[4] * src[11] + tmp[0] * src[9] + tmp[3] * src[10];
		pa_out.arr[3][1] = tmp[8] * src[11] + tmp[0] * src[8] + tmp[7] * src[10];
		pa_out.arr[3][1] -= tmp[6] * src[10] + tmp[9] * src[11] + tmp[1] * src[8];
		pa_out.arr[3][2] = tmp[6] * src[9] + tmp[11] * src[11] + tmp[3] * src[8];
		pa_out.arr[3][2] -= tmp[10] * src[11] + tmp[2] * src[8] + tmp[7] * src[9];
		pa_out.arr[3][3] = tmp[10] * src[10] + tmp[4] * src[8] + tmp[9] * src[9];
		pa_out.arr[3][3] -= tmp[8] * src[9] + tmp[11] * src[10] + tmp[5] * src[8];
		/* calculate determinant */
		det = src[0] * pa_out.arr[0][0] + src[1] * pa_out.arr[0][1] + src[2] * pa_out.arr[0][2] + src[3] * pa_out.arr[0][3];
		/* calculate matrix inverse */
		det = 1 / det;
		for (int j = 0; j < 4; j++)
		{
			for (int i = 0; i < 4; i++)
			{
				pa_out.arr[j][i] *= det;
			}
		}
		return pa_out;
	}
	static public CMat MatTranslation(CVec3 pa_vec)
	{
		CMat pa_out=new CMat();
		pa_out.arr[0][0] = 1; pa_out.arr[0][1] = 0; pa_out.arr[0][2] = 0; pa_out.arr[0][3] = 0;
		pa_out.arr[1][0] = 0; pa_out.arr[1][1] = 1; pa_out.arr[1][2] = 0; pa_out.arr[1][3] = 0;
		pa_out.arr[2][0] = 0; pa_out.arr[2][1] = 0; pa_out.arr[2][2] = 1; pa_out.arr[2][3] = 0;
		pa_out.arr[3][0] = pa_vec.x; pa_out.arr[3][1] = pa_vec.y; pa_out.arr[3][2] = pa_vec.z; pa_out.arr[3][3] = 1;
	
		return pa_out;
	}
	static public CMat MatRotation(CVec3 pa_rot)
	{
		CMat pa_out=new CMat();
		CVec4 L_qut = EulerToQut(pa_rot);
		pa_out = QutToMatrix(L_qut);
		return pa_out;
	}
	//Camera=====================================================================
	static public CMat CameraPerspectiveLH(float width, float height, float zn, float zf)
	{
		CMat projMat=new CMat();
		projMat.arr[0][0] = (2 * zn) / width; projMat.arr[0][1] = 0; projMat.arr[0][2] = 0; projMat.arr[0][3] = 0;
		projMat.arr[1][0] = 0; projMat.arr[1][1] = (2 * zn) / height; projMat.arr[1][2] = 0; projMat.arr[1][3] = 0;
		projMat.arr[2][0] = 0; projMat.arr[2][1] = 0; projMat.arr[2][2] = zf / (zf - zn); projMat.arr[2][3] = 1;
		projMat.arr[3][0] = 0; projMat.arr[3][1] = 0; projMat.arr[3][2] = (zn*zf) / (zn - zf); projMat.arr[3][3] = 0;
	
		return projMat;
	}
	//직교투영
	static public CMat CameraOrthoLH(float width, float height, float zn, float zf)
	{
		CMat projMat=new CMat();
		projMat.arr[0][0] = 2 / width; projMat.arr[0][1] = 0; projMat.arr[0][2] = 0; projMat.arr[0][3] = 0;
		projMat.arr[1][0] = 0; projMat.arr[1][1] = 2 / height; projMat.arr[1][2] = 0; projMat.arr[1][3] = 0;
		projMat.arr[2][0] = 0; projMat.arr[2][1] = 0; projMat.arr[2][2] = 1 / (zf - zn); projMat.arr[2][3] = 0;
		projMat.arr[3][0] = 0; projMat.arr[3][1] = 0; projMat.arr[3][2] = -zn / (zf - zn); projMat.arr[3][3] = 1;
	
		return projMat;
	}
	//뷰행렬생성
	static public  CMat CameraLookAtLH(CVec3 eyeVec, CVec3 lookVec, CVec3 upVec)
	{
		CMat viewMat=new CMat();
		CVec3 Zaxis = Vec3MinusVec3(lookVec, eyeVec);
		Zaxis = Vec3Normalize(Zaxis);
		CVec3 Xaxis=new CVec3();
		Xaxis = Vec3Cross(upVec, Zaxis);
		if (Xaxis.IsZero())
			CMsg.E("CameraLookAtLH error");//카메라 위치를 바꿔라!
		Xaxis = Vec3Normalize(Xaxis);
		CVec3 Yaxis=new CVec3();
		Yaxis = Vec3Cross(Zaxis, Xaxis);
		viewMat.arr[0][0] = Xaxis.x; viewMat.arr[0][1] = Yaxis.x; viewMat.arr[0][2] = Zaxis.x; viewMat.arr[0][3] = 0;
		viewMat.arr[1][0] = Xaxis.y; viewMat.arr[1][1] = Yaxis.y; viewMat.arr[1][2] = Zaxis.y; viewMat.arr[1][3] = 0;
		viewMat.arr[2][0] = Xaxis.z; viewMat.arr[2][1] = Yaxis.z; viewMat.arr[2][2] = Zaxis.z; viewMat.arr[2][3] = 0;
	
		viewMat.arr[3][0] = -Vec3Dot(Xaxis, eyeVec);
		viewMat.arr[3][1] = -Vec3Dot(Yaxis, eyeVec);
		viewMat.arr[3][2] = -Vec3Dot(Zaxis, eyeVec);
		viewMat.arr[3][3] = 1;
	
		return viewMat;
	}
	//PI================================================================
	static public float DegreeToRadian(int pa_val)
	{
		return pa_val / 180.0f*d_PI;
	}
	static public int RadianToDegree(float pa_val)
	{
		return (int)((180 * pa_val) / d_PI);
	}
	
	//Qut============================================================
	static public CVec4 EulerToQut(CVec3 pa_radian)
	{
		CVec4 pa_qut=new CVec4();
	
		CVec4 qpitch=new CVec4();
		CVec4 qyaw=new CVec4();
		CVec4 qroll=new CVec4();
		qroll = QutAxisToRotation(new CVec3(1, 0, 0), pa_radian.x);
		qpitch = QutAxisToRotation(new CVec3(0, 1, 0), pa_radian.y);
		qyaw = QutAxisToRotation(new CVec3(0, 0, 1), pa_radian.z);
		qroll = QutMul(qroll, qyaw);
		pa_qut = QutMul(qroll, qpitch);
	
		return pa_qut;
	}
	static public CVec4 QutMul(CVec4 pa_val1, CVec4 pa_val2)
	{
		CVec3 L_vec=new CVec3();
		CVec3 L_qut=new CVec3();
		CVec4 L_Oqut=new CVec4();
	
		L_vec = Vec3Cross(new CVec3(pa_val2.x, pa_val2.y, pa_val2.z),new CVec3(pa_val1.x, pa_val1.y, pa_val1.z));
		L_qut.x = L_vec.x + pa_val1.w*pa_val2.x + pa_val2.w*pa_val1.x;
		L_qut.y = L_vec.y + pa_val1.w *pa_val2.y + pa_val2.w*pa_val1.y;
		L_qut.z = L_vec.z + pa_val1.w * pa_val2.z + pa_val2.w*pa_val1.z;
		L_Oqut.x = L_qut.x; L_Oqut.y = L_qut.y; L_Oqut.z = L_qut.z;
		float L_val = 0;
		L_val = Vec3Dot(new CVec3(pa_val1.x, pa_val1.y, pa_val1.z),new CVec3(pa_val2.x, pa_val2.y, pa_val2.z));
	
		L_Oqut.w = pa_val2.w*pa_val1.w - L_val;
		return L_Oqut;
	}
	static public CVec4 QutInverse(CVec4 pa_val1)
	{
		CVec4 L_con=new CVec4();
	
		float L_len = 0;
		L_con = QutConjugate(pa_val1);
		L_len = QutLenght(pa_val1);
		L_con.x = L_con.x / L_len;
		L_con.y = L_con.y / L_len;
		L_con.z = L_con.z / L_len;
		L_con.w = L_con.w / L_len;
		return L_con;
	}
	static public CVec4 QutNomalize(CVec4 pa_val1)
	{
		CVec4 L_con=new CVec4();
		float L_len = 0;
		L_len = QutLenght(pa_val1);
		L_con.x = pa_val1.x / L_len;
		L_con.y = pa_val1.y / L_len;
		L_con.z = pa_val1.z / L_len;
		L_con.w = pa_val1.w / L_len;
		return L_con;
	}
	static public CVec4 QutConjugate(CVec4 pa_val1)
	{
		CVec4 pa_out=new CVec4();
		pa_out.x = -pa_val1.x;
		pa_out.y = -pa_val1.y;
		pa_out.z = -pa_val1.z;
		pa_out.w = pa_val1.w;
		return pa_out;
	}
	static public float QutLenght(CVec4 pa_val1)
	{
		return pa_val1.x*pa_val1.x + pa_val1.y*pa_val1.y + pa_val1.z*pa_val1.z + pa_val1.w*pa_val1.w;
	}
	static public CVec4 QutAxisToRotation(CVec3 axis,float radianAngle)
	{
		CVec4 pa_out=new CVec4();
		pa_out.x = (float) (axis.x*Math.sin(radianAngle / 2));
		pa_out.y = (float) (axis.y*Math.sin(radianAngle / 2));
		pa_out.z = (float) (axis.z*Math.sin(radianAngle / 2));
		pa_out.w = (float) Math.cos(radianAngle / 2);
	
		return pa_out;
	}
	static public CMat QutToMat(CVec4 pa_val1)
	{
		CMat pa_out=new CMat();
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
	static public CVec3 QutToEuler(CVec4 pa_qut)
	{
		CVec3 pa_radian=new CVec3();
		float x, y, z, w;
	
		x = pa_qut.x;
		y = pa_qut.y;
		z = pa_qut.z;
		w = pa_qut.w;
	
		float sqx = x * x;
		float sqy = y * y;
		float sqz = z * z;
		float sqw = w * w;
	
	
		pa_radian.x = (float) Math.asin(2.0f * (pa_qut.w*pa_qut.x - pa_qut.y*pa_qut.z)); // rotation about x-axis
		pa_radian.y = (float) Math.atan2(2.0f * (pa_qut.x*pa_qut.z + pa_qut.w*pa_qut.y), (-sqx - sqy + sqz + sqw)); // rotation about y-axis
		pa_radian.z = (float) Math.atan2(2.0f * (pa_qut.x*pa_qut.y + pa_qut.w*pa_qut.z), (-sqx + sqy - sqz + sqw)); // rotation about z-axis
	
		return pa_radian;
	}
	static public CMat QutToMatrix(CVec4 pa_val1)
	{
		CMat pa_out=new CMat();
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
	//Ray and Collision================================================================
	static public boolean RayTriangleIS(CVec3 pa_one,CVec3 pa_two,
		CVec3 pa_three, CThreeVec3 pa_ray, float pa_dist, boolean pa_ccw)//IS -> Intersection
	{
		CMsg.E("java는 포인터가 없다 수정해");
		float det, u, v, dist;
		CVec3 pvec=new CVec3();
		CVec3 tvec=new CVec3();
		CVec3 qvec=new CVec3();
		CVec3 edge1 = Vec3MinusVec3(pa_two, pa_one);
		CVec3 edge2 = Vec3MinusVec3(pa_three, pa_one);
	
		CVec3 L_dir = Vec3MinusVec3(pa_ray.GetOriginal(), pa_one);
		if (L_dir.x == 0  && L_dir.y == 0 && L_dir.z == 0)
		{
			
			pa_dist = 0.00001f;
			return true;
		}
		else
		{
			L_dir = Vec3Normalize(L_dir);
			det = Vec3Dot(L_dir, Vec3MulFloat(pa_ray.GetDirect(), -1));
			if (det < 0)// pa_ccw)
			{
	
				return false;
			}
		}
		pvec = Vec3Cross(pa_ray.GetDirect(), edge2);
		det = Vec3Dot(edge1, pvec);
		if (det > 0)
		{
			tvec = Vec3MinusVec3(pa_ray.GetOriginal(), pa_one);
		}
		else//이부분 에서 컬링 설정을 할수 있다!
		{
			tvec = Vec3MinusVec3(pa_one, pa_ray.GetOriginal());
			det = -det;
			//L_back=true;
			if (pa_ccw)
			{
				return false;
			}
		}
	
	
		if (det < 0.000001f)
		{
			return false;
		}
	
		u = Vec3Dot(tvec, pvec);
		if (u < 0.0f || u > det)
		{
			return false;
		}
	
		qvec = Vec3Cross(tvec, edge1);
		v = Vec3Dot(pa_ray.GetDirect(), qvec);
		if (v < 0.0f || u + v > det)
		{
			return false;
		}
	
		dist = Vec3Dot(edge2, qvec);
		dist *= (1.0f / det);
		pa_dist = dist;
	
		return true;
	
	}
	
	static public boolean RayBoxIS(CVec3 _min, CVec3 _max, CThreeVec3 pa_ray)
	{
	
	
		boolean inside = true;
		int quadrant[] = {0,0,0};
		int i;
		int whichPlane;
		float maxT[] = {0,0,0};
		float candidatePlane[] = {0,0,0};

		var vecList=pa_ray.GetVecList();
		float pOrigin[] = { vecList[2].x ,vecList[2].y ,vecList[2].z };
		float pBoxMin[] = { _min.x,_min.y,_min.z };
		float pBoxMax[] = { _max.x,_max.y,_max.z };
		float pDir[] = { vecList[0].x ,vecList[0].y ,vecList[0].z };
		float pIntersect[] = { 0 ,0,0 };
	
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
	
			return true;
		}
	
	
		// Calculate T distances to candidate planes
		for (i = 0; i < 3; i++)
		{
			//중심이아니였음 그리고 너무 작은수는 패스
			if (quadrant[i] != RayBoxMIDDLE &&
				 (pDir[i] > d_EPSILON || pDir[i] < -d_EPSILON))
			{
				//(맥시멈-현재위치)/기울기
				maxT[i] = (candidatePlane[i] - pOrigin[i]) / pDir[i];
			}
			//아니면 직각이기때문에 -1
			else
			{
				maxT[i] = -1.0f;
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
		if (maxT[whichPlane] < 0.0f)
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
	//구 피킹 문제가 있는거 같음
	static public boolean RaySphereIS(CVec3  pa_center, float pa_radian, CThreeVec3 pa_ray)
	{
		CVec3 l = Vec3MinusVec3(pa_center, pa_ray.GetOriginal());
		float s = Vec3Dot(l, Vec3Normalize(pa_ray.GetDirect()));
	
	
		float l2 = Vec3Dot(l, l);
		float r2 = (float) Math.pow(pa_radian, 2);
	
		if (s < 0 && l2 > r2)  //각도가 아예 다른 방향이고 반지름이 더 크다는건 내부에 없다는 의미
		{
			return false;					   // 광선이 구의 반대 방향을 향하거나 구를 지나친 경우
		}
		float s2 = (float) Math.pow(s, 2);
		float m2 = l2 - s2;
	
		if (m2 > r2)
		{
			return false;					  // 광선이 구를 비껴가는 경우
		}
	
		float q = (float) Math.sqrt(r2 - m2);
		float distance;
	
		//// 두 개의 교차점 중 어느것을 구하는가?   
		if (l2 > r2)
		{
			distance = s - q;
		}
		else
		{
			distance = s + q;
		}
	
		pa_ray.SetPosition(Vec3PlusVec3(pa_ray.GetOriginal(), Vec3MulFloat(pa_ray.GetDirect(), distance)));
	
		return true;
	}
	static public float ColSphereSphere(CVec3 _posA, float _radiusA,CVec3 _posB, float _radiusB)
	{
		float vlen = Vec3Lenght(Vec3MinusVec3(_posA, _posB));
		if (vlen <= _radiusA + _radiusB)
			return (_radiusA + _radiusB)-vlen;
		return -1;
	}
	
	
	
	static public CVec4 Vec3toPlane(CVec3 pa_vec1,CVec3 pa_vec2,CVec3 pa_vec3)
	{
		CVec4 pa_out=new CVec4();
		CVec3 L_temp=new CVec3();
		L_temp = Vec3Cross(Vec3MinusVec3(pa_vec2, pa_vec1), Vec3MinusVec3(pa_vec3, pa_vec1));
		L_temp = Vec3Normalize(L_temp);
		pa_out = NormalAndVertexFromPlane(L_temp, pa_vec1);
		return pa_out;
	}
	static public CVec4 NormalAndVertexFromPlane(CVec3 pa_normal,CVec3 pa_vertex)
	{
		CVec4 pa_out=new CVec4();
		pa_out.x = pa_normal.x;
		pa_out.y = pa_normal.y;
		pa_out.z = pa_normal.z;
		pa_out.w = -Vec3Dot(pa_normal, pa_vertex);
	
		return pa_out;
	}
	static public float PlaneVec3DotCoordinate( CVec4  pa_plane,  CVec3 pa_vec)
	{
		return Vec3Dot(new CVec3(pa_plane.x, pa_plane.y, pa_plane.z), pa_vec) + pa_plane.w;
	}
	static public float PlaneVec3DotNormal( CVec4  pa_plane,  CVec3 pa_vec)
	{
		return Vec3Dot(new CVec3(pa_plane.x, pa_plane.y, pa_plane.z), pa_vec);
	}
	static public void PlaneSphereInside(CSixVec4  pa_plane,  CVec3  pa_posion, float pa_radius, CPlaneOutJoin  _poj)
	{
	
		float outSize=0;
		float inSize=0;
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
	
	
		float L_dist = 0;
		L_dist = PlaneVec3DotCoordinate(pa_plane.GetBottom(), pa_posion);
		if (L_dist + inSize > outSize && (_poj.plane == DfPlane.Bottom || _poj.plane == DfPlane.Null))
		{
			_poj.plane = DfPlane.Bottom;
			_poj.len = L_dist + inSize;
			return;
		}
		L_dist = PlaneVec3DotCoordinate(pa_plane.GetFar(), pa_posion);
		if (L_dist + inSize > outSize && (_poj.plane == DfPlane.Far || _poj.plane == DfPlane.Null))
		{
			_poj.plane = DfPlane.Far;
			_poj.len = L_dist + inSize;
			return;
		}
		L_dist = PlaneVec3DotCoordinate(pa_plane.GetLeft(), pa_posion);
		if (L_dist + inSize > outSize && (_poj.plane == DfPlane.Left || _poj.plane == DfPlane.Null))
		{
			_poj.plane = DfPlane.Left;
			_poj.len = L_dist + inSize;
			return;
		}
		L_dist = PlaneVec3DotCoordinate(pa_plane.GetNear(), pa_posion);
		if (L_dist + inSize > outSize && (_poj.plane == DfPlane.Near || _poj.plane == DfPlane.Null))
		{
			_poj.plane = DfPlane.Near;
			_poj.len = L_dist + inSize;
			return;
		}
		L_dist = PlaneVec3DotCoordinate(pa_plane.GetRight(), pa_posion);
		if (L_dist + inSize > outSize && (_poj.plane == DfPlane.Right || _poj.plane == DfPlane.Null))
		{
			_poj.plane = DfPlane.Right;
			_poj.len = L_dist + inSize;
			return;
		}
		L_dist = PlaneVec3DotCoordinate(pa_plane.GetTop(), pa_posion);
		if (L_dist + inSize > outSize && (_poj.plane == DfPlane.Top || _poj.plane == DfPlane.Null))
		{
			_poj.plane = DfPlane.Top;
			_poj.len = L_dist + inSize;
			return;
		}
	
		_poj.plane = DfPlane.Null;
		_poj.len = 0;
	
	}
	static public float QutDot( CVec4 pa_val1,  CVec4 pa_val2)
	{
		return pa_val1.x*pa_val2.x + pa_val1.y*pa_val2.y + pa_val1.z*pa_val2.z + pa_val1.w*pa_val2.w;
	}
	static public float FloatInterpolate(float _first, float _second, float pa_time)
	{
		return _first * (1 - pa_time) + _second * _second*pa_time;
	}
	static public CVec4 QutInterpolate(CVec4 pa_first, CVec4 pa_second, float pa_time)
	{
		CVec4 pa_out=new CVec4();
	
		float		omega, cosom, sinom, scale0, scale1;
		cosom = QutDot(pa_first, pa_second); // = cos(θ)
		//float fAngle = acos(fcos);
	
		if (cosom < 0.0f)//내적해서 0보다 작다는건
		{
			cosom *= -1;
			pa_first.x *= -1;
			pa_first.y *= -1;
			pa_first.z *= -1;
			pa_first.w *= -1;
		}
		if ((1.0 - cosom) > 0.0f)
		{
			// standard case (slerp)
			omega = (float) Math.acos(cosom);
			sinom = (float) Math.sin(omega);
			scale0 = (float) (Math.sin((1.0f - pa_time) * omega) / sinom);
			scale1 = (float) (Math.sin(pa_time * omega) / sinom);
	
	
		}
		else {
			// "from" and "to" quaternions are very close
			//  ... so we can do a linear interpolation
			scale0 = 1.0f - pa_time;
			scale1 = pa_time;
		}
		// calculate final values
		pa_out.x = scale1 * pa_second.x + scale0 * pa_first.x;
		pa_out.y = scale1 * pa_second.y + scale0 * pa_first.y;
		pa_out.z = scale1 * pa_second.z + scale0 * pa_first.z;
		pa_out.w = scale1 * pa_second.w + scale0 * pa_first.w;
	
		return pa_out;
	}
	
	
	
	static public int CloseToExp(float fInput, float fExponent)
	{
		if (fInput > 0.0f && fInput <= 1.0f)
			return 0;
	
		float fResult = (float) (Math.log(Abs(fInput)) / Math.log(fExponent));
	
		int nResult = (int)fResult;
	
		float fEpsilon = Abs(fResult - (float)((int)fResult));
	
		if (Abs(fEpsilon - 0.0f) <= g_fEpsilon)
			return (int)Math.pow(fExponent, nResult);
	
		nResult = (int)Math.pow(fExponent, nResult + 1);
	
		if (fInput < 0.0f)
			return -nResult;
	
		return nResult;
	}
	
	static public CMat MatRotExport( CMat  pa_viewMat, boolean pa_x, boolean pa_y, boolean pa_z)
	{
		CMat pa_outMat=new CMat();
	
	
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
//	static public void UvIndexToVertexIndex(Vector<CVec3>  pa_po_vertex, Vector<CVec2>  pa_po_uv,
//			Vector<CVec3>  pa_po_normal, Vector<CVec4>  pa_po_weight, Vector<CVec4>  pa_po_weightIndex,
//		Vector<Integer> RF_index, Vector<Integer>  RF_Tface)
//	{
//		d_INT32 L_vertexNum = pa_po_vertex.size();
//		d_INT32 L_indexNum = RF_index.size() / 3;
//	
//		//1. 버텍스와 인덱스를 복사해둔다
//		//d_VEC_VEC3 L_aVer;
//		vector<CVec2> L_aUv;
//	
//		//오지지날 인덱스를 만들어서 절대영역을 만들어 둔다
//	
//		vector<d_UINT32> L_aIn;
//		L_aIn.resize(L_indexNum * 3);
//		for (int i = 0; i < L_indexNum * 3; ++i)
//		{
//			L_aIn[i] = RF_index[i];
//		}
//	
//		vector<s_FACE> L_list;
//		L_list.resize(L_vertexNum);
//	
//		for (d_INT32 i = 0; i < L_indexNum; ++i)
//		{
//			for (d_INT32 j = 0; j < (d_INT32)L_list[RF_index[i * 3 + 0]].Tface.size(); ++j)
//			{
//				if (L_list[RF_index[i * 3] + 0].Tface[j] == RF_Tface[i * 3 + 0])
//				{
//					RF_index[i * 3 + 0] = L_list[L_aIn[i * 3] + 0].Cindex[j];
//					L_list[L_aIn[i * 3 + 0]].Cindex.push_back(RF_index[i * 3 + 0]);
//					break;
//				}
//				if ((d_INT32)L_list[RF_index[i * 3 + 0]].Tface.size() == j + 1)
//				{
//					pa_po_vertex.push_back(pa_po_vertex[RF_index[i * 3 + 0]]);
//					RF_index[i * 3 + 0] = (d_INT32)pa_po_vertex.size() - 1;
//					L_list[L_aIn[i * 3 + 0]].Cindex.push_back(RF_index[i * 3 + 0]);
//					break;
//				}
//	
//			}
//	
//			L_list[L_aIn[i * 3 + 0]].Tface.push_back(RF_Tface[i * 3 + 0]);
//			if (L_list[L_aIn[i * 3 + 0]].Cindex.empty())
//				L_list[L_aIn[i * 3 + 0]].Cindex.push_back(L_aIn[i * 3 + 0]);
//			//======================================================
//			for (d_INT32 j = 0; j < (d_INT32)L_list[RF_index[i * 3 + 1]].Tface.size(); ++j)
//			{
//				if (L_list[RF_index[i * 3 + 1]].Tface[j] == RF_Tface[i * 3 + 1])
//				{
//					RF_index[i * 3 + 1] = L_list[L_aIn[i * 3 + 1]].Cindex[j];
//					L_list[L_aIn[i * 3 + 1]].Cindex.push_back(RF_index[i * 3 + 1]);
//					break;
//				}
//				if ((d_INT32)L_list[RF_index[i * 3 + 1]].Tface.size() == j + 1)
//				{
//					pa_po_vertex.push_back(pa_po_vertex[RF_index[i * 3 + 1]]);
//					RF_index[i * 3 + 1] = (d_INT32)pa_po_vertex.size() - 1;
//					L_list[L_aIn[i * 3 + 1]].Cindex.push_back(RF_index[i * 3 + 1]);
//					break;
//				}
//	
//			}
//	
//			L_list[L_aIn[i * 3 + 1]].Tface.push_back(RF_Tface[i * 3 + 1]);
//			if (L_list[L_aIn[i * 3 + 1]].Cindex.empty())
//				L_list[L_aIn[i * 3 + 1]].Cindex.push_back(L_aIn[i * 3 + 1]);
//			//======================================================
//			for (d_INT32 j = 0; j < (d_INT32)L_list[RF_index[i * 3 + 2]].Tface.size(); ++j)
//			{
//				if (L_list[RF_index[i * 3 + 2]].Tface[j] == RF_Tface[i * 3 + 2])
//				{
//					RF_index[i * 3 + 2] = L_list[L_aIn[i * 3 + 2]].Cindex[j];
//					L_list[L_aIn[i * 3 + 2]].Cindex.push_back(RF_index[i * 3 + 2]);
//					break;
//				}
//				if ((d_INT32)L_list[RF_index[i * 3 + 2]].Tface.size() == j + 1)
//				{
//					pa_po_vertex.push_back(pa_po_vertex[RF_index[i * 3 + 2]]);
//					RF_index[i * 3 + 2] = (d_INT32)pa_po_vertex.size() - 1;
//					L_list[L_aIn[i * 3 + 2]].Cindex.push_back(RF_index[i * 3 + 2]);
//					break;
//				}
//	
//			}
//	
//			L_list[L_aIn[i * 3 + 2]].Tface.push_back(RF_Tface[i * 3 + 2]);
//			if (L_list[L_aIn[i * 3 + 2]].Cindex.empty())
//				L_list[L_aIn[i * 3 + 2]].Cindex.push_back(L_aIn[i * 3 + 2]);
//	
//	
//		}
//		//delete [] mpar_uv;
//	
//		L_vertexNum = (d_INT32)pa_po_vertex.size();
//		vector<CVec2> L_uv;
//		L_uv.resize(L_vertexNum);
//	
//	
//	
//	
//	
//		if (pa_po_vertex.empty())
//			CMsg.E("체크코드");
//		vector<CVec3> L_nor;
//		vector<CVec4> L_we;
//		vector<CVec4> L_weI;
//	
//		bool L_copy[3] = { 0, };//0노말
//		if (!pa_po_normal.empty())
//		{
//			L_copy[0] = true;
//			L_nor.resize(L_vertexNum);
//		}
//		if (!pa_po_weight.empty())
//		{
//			L_copy[1] = true;
//			L_we.resize(L_vertexNum);
//		}
//		if (!pa_po_weightIndex.empty())
//		{
//			L_copy[2] = true;
//			L_weI.resize(L_vertexNum);
//		}
//	
//	
//	
//		for (d_INT32 i = 0; i < L_indexNum; ++i)
//		{
//			L_uv[RF_index[i * 3] + 0] = pa_po_uv[RF_Tface[i * 3] + 0];
//			L_uv[RF_index[i * 3 + 1]] = pa_po_uv[RF_Tface[i * 3 + 1]];
//			L_uv[RF_index[i * 3 + 2]] = pa_po_uv[RF_Tface[i * 3 + 2]];
//			if (L_copy[0])
//			{
//	
//				L_nor[RF_index[i * 3] + 0] = pa_po_normal[L_aIn[i * 3] + 0];
//				L_nor[RF_index[i * 3 + 1]] = pa_po_normal[L_aIn[i * 3 + 1]];
//				L_nor[RF_index[i * 3 + 2]] = pa_po_normal[L_aIn[i * 3 + 2]];
//			}
//			if (L_copy[1])
//			{
//				CMsg.E("가중치 테스트 안했슴");
//				L_we[RF_index[i * 3] + 0] = pa_po_weight[L_aIn[i * 3] + 0];
//				L_we[RF_index[i * 3 + 1]] = pa_po_weight[L_aIn[i * 3 + 1]];
//				L_we[RF_index[i * 3 + 2]] = pa_po_weight[L_aIn[i * 3 + 2]];
//			}
//			if (L_copy[2])
//			{
//				L_weI[RF_index[i * 3] + 0] = pa_po_weightIndex[L_aIn[i * 3] + 0];
//				L_weI[RF_index[i * 3 + 1]] = pa_po_weightIndex[L_aIn[i * 3 + 1]];
//				L_weI[RF_index[i * 3 + 2]] = pa_po_weightIndex[L_aIn[i * 3 + 2]];
//			}
//		}
//	
//		pa_po_uv.swap(L_uv);
//		if (L_copy[0])
//			pa_po_normal.swap(L_nor);
//		if (L_copy[1])
//			pa_po_weight.swap(L_we);
//		if (L_copy[2])
//			pa_po_weightIndex.swap(L_weI);
//	
//	}
	static public CMat MatTranspose(CMat  _mat)
	{
		CMat L_out=new CMat();
		for (int y = 0; y < 4; ++y)
		{
			for (int x = 0; x < 4; ++x)
			{
				if (x == y)
					continue;
				L_out.arr[x][y] = _mat.arr[y][x];
			}
		}
	
		return L_out;
	}
	static public CBound BoundMulMat( CBound  _bound,  CMat  _mat)
	{
		CBound rBound=new CBound();
		rBound.min = MatToVec3Normal(_bound.min, _mat);
		rBound.max = MatToVec3Normal(_bound.max, _mat);
	
		return rBound;
	}
	static public boolean ColBoxBoxOBB(CBound  _boundA, CMat  _matA, CBound  _boundB, CMat  _matB)
	{
		CVec3 L_center[]=new CVec3[2];
		CVec3 L_dir[][]=new CVec3[2][3];
		CVec3  L_len[]=new CVec3[2];
		CVec3 L_rLen[]=new CVec3[2];
		L_rLen[0]=new CVec3();
		L_rLen[1]=new CVec3();
	
	
		L_dir[0][0] = new CVec3(_matA.arr[0][0], _matA.arr[0][1], _matA.arr[0][2]);
		L_dir[0][1] = new CVec3(_matA.arr[1][0], _matA.arr[1][1], _matA.arr[1][2]);
		L_dir[0][2] = new CVec3(_matA.arr[2][0], _matA.arr[2][1], _matA.arr[2][2]);
	
		L_dir[1][0] = new CVec3(_matB.arr[0][0], _matB.arr[0][1], _matB.arr[0][2]);
		L_dir[1][1] = new CVec3(_matB.arr[1][0], _matB.arr[1][1], _matB.arr[1][2]);
		L_dir[1][2] = new CVec3(_matB.arr[2][0], _matB.arr[2][1], _matB.arr[2][2]);
	
		L_center[0] = _matA.GetPos();
		L_center[1] = _matB.GetPos();
	
		L_dir[0][0] = Vec3Normalize(L_dir[0][0]);
		L_dir[0][1] = Vec3Normalize(L_dir[0][1]);
		L_dir[0][2] = Vec3Normalize(L_dir[0][2]);
	
		L_dir[1][0] = Vec3Normalize(L_dir[1][0]);
		L_dir[1][1] = Vec3Normalize(L_dir[1][1]);
		L_dir[1][2] = Vec3Normalize(L_dir[1][2]);
	
	
		L_len[0] = _boundA.GetRadiusLen();
		L_len[1] = _boundB.GetRadiusLen();
	
		L_rLen[0].x = Vec3Lenght(new CVec3(_matA.arr[0][0], _matA.arr[0][1], _matA.arr[0][2]));
		L_rLen[0].y = Vec3Lenght(new CVec3(_matA.arr[1][0], _matA.arr[1][1], _matA.arr[1][2]));
		L_rLen[0].z = Vec3Lenght(new CVec3(_matA.arr[2][0], _matA.arr[2][1], _matA.arr[2][2]));
	
		L_rLen[1].x = Vec3Lenght(new CVec3(_matB.arr[0][0], _matB.arr[0][1], _matB.arr[0][2]));
		L_rLen[1].y = Vec3Lenght(new CVec3(_matB.arr[1][0], _matB.arr[1][1], _matB.arr[1][2]));
		L_rLen[1].z = Vec3Lenght(new CVec3(_matB.arr[2][0], _matB.arr[2][1], _matB.arr[2][2]));
	
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
	
		CVec3 L_diff[]=new CVec3[2];
		L_diff[0] = Vec3MulFloat(Vec3PlusVec3(_boundA.max, _boundA.min), 0.5f);
		L_diff[1] = Vec3MulFloat(Vec3PlusVec3(_boundB.max, _boundB.min), 0.5f);
	
		L_diff[0] = MatToVec3Normal(L_diff[0], _matA);
		L_diff[1] = MatToVec3Normal(L_diff[1], _matB);
	
		L_center[0] = Vec3PlusVec3(L_center[0], L_diff[0]);
		L_center[1] = Vec3PlusVec3(L_center[1], L_diff[1]);
	
	
	
		// 여기서 R0 항목은 OBB A의 interval radius, R1 항목은 OBB B의 interval radius, R 항목은 2개의 OBB의 중심 간의 투영된 거리를 나타낸다.
		// D 벡터는 2개의 OBB의 중심을 잇는 벡터를 나타낸다.
		// Cij 는 rotation matrix R에서의 (i,j) 항을 나타낸다.
		float c[][]=new float[3][3];
		float absC[][]=new float[3][3];
		float d[]=new float[3];
	
		float r0, r1, r;
		int i;
	
		 float cutoff = 0.999999f;
		boolean existsParallelPair = false;
	
		CVec3 diff = Vec3MinusVec3(L_center[0], L_center[1]);
	
	
		//3축을 구하고 A0,A1,A2를 구한다
		for (i = 0; i < 3; ++i)
		{
			//A박스 공간에서 B에 r1을 구한다
			c[0][i] = Vec3Dot(L_dir[0][0], L_dir[1][i]);
			//내적 공식상 90도를 넘으면 -인데 
			//A기준으로 같은 축을 사용한다는 의미로 양수값을 나오게 했다
			absC[0][i] = Abs(c[0][i]);
			if (absC[0][i] > cutoff)
				existsParallelPair = true;
		}
		//A박스축 기준으로 D를 구하고
		d[0] = Vec3Dot(diff, L_dir[0][0]);
		r = Abs(d[0]);
		r0 = L_len[0].x;
		r1 = L_len[1].x * absC[0][0] + L_len[1].y * absC[0][1] + L_len[1].z * absC[0][2];
	
		if (r > r0 + r1)//두 값을 더해서 R보다 크면 분리된 상태이다
			return false;
	
	
	
		for (i = 0; i < 3; ++i)
		{
			c[1][i] = Vec3Dot(L_dir[0][1], L_dir[1][i]);
			absC[1][i] = Abs(c[1][i]);
			if (absC[1][i] > cutoff)
				existsParallelPair = true;
		}
		d[1] = Vec3Dot(diff, L_dir[0][1]);
		r = Abs(d[1]);
		r0 = L_len[0].y;
		r1 = L_len[1].x * absC[1][0] + L_len[1].y * absC[1][1] + L_len[1].z * absC[1][2];
	
		if (r > r0 + r1)
			return false;
	
	
	
		for (i = 0; i < 3; ++i)
		{
			c[2][i] = Vec3Dot(L_dir[0][2], L_dir[1][i]);
			absC[2][i] = Abs(c[2][i]);
			if (absC[2][i] > cutoff)
				existsParallelPair = true;
		}
		d[2] = Vec3Dot(diff, L_dir[0][2]);
		r = Abs(d[2]);
		r0 = L_len[0].z;
		r1 = L_len[1].x * absC[2][0] + L_len[1].y * absC[2][1] + L_len[1].z * absC[2][2];
	
		if (r > r0 + r1)
			return false;
	
	
		//A공간 계산될걸 기준으로 B0,..구한다
		r = Abs(Vec3Dot(diff, L_dir[1][0]));
		r0 = L_len[0].x * absC[0][0] + L_len[0].y * absC[1][0] + L_len[0].z * absC[2][0];
		r1 = L_len[1].x;
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(Vec3Dot(diff, L_dir[1][1]));
		r0 = L_len[0].x * absC[0][1] + L_len[0].y * absC[1][1] + L_len[0].z * absC[2][1];
		r1 = L_len[1].y;
	
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(Vec3Dot(diff, L_dir[1][2]));
		r0 = L_len[0].x * absC[0][2] + L_len[0].y * absC[1][2] + L_len[0].z * absC[2][2];
		r1 = L_len[1].z;
	
		if (r > r0 + r1)
			return false;
	
	
		//충돌된 상태이다
		if (existsParallelPair == true)
			return true;
	
	
	
		r = Abs(d[2] * c[1][0] - d[1] * c[2][0]);
		r0 = L_len[0].y * absC[2][0] + L_len[0].z * absC[1][0];
		r1 = L_len[1].y * absC[0][2] + L_len[1].z * absC[0][1];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[2] * c[1][1] - d[1] * c[2][1]);
		r0 = L_len[0].y * absC[2][1] + L_len[0].z * absC[1][1];
		r1 = L_len[1].x * absC[0][2] + L_len[1].z * absC[0][0];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[2] * c[1][2] - d[1] * c[2][2]);
		r0 = L_len[0].y * absC[2][2] + L_len[0].z * absC[1][2];
		r1 = L_len[1].x * absC[0][1] + L_len[1].y * absC[0][0];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[0] * c[2][0] - d[2] * c[0][0]);
		r0 = L_len[0].x * absC[2][0] + L_len[0].z * absC[0][0];
		r1 = L_len[1].y * absC[1][2] + L_len[1].z * absC[1][1];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[0] * c[2][1] - d[2] * c[0][1]);
		r0 = L_len[0].x * absC[2][1] + L_len[0].z * absC[0][1];
		r1 = L_len[1].x * absC[1][2] + L_len[1].z * absC[1][0];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[0] * c[2][2] - d[2] * c[0][2]);
		r0 = L_len[0].x * absC[2][2] + L_len[0].z * absC[0][2];
		r1 = L_len[1].x * absC[1][1] + L_len[1].y * absC[1][0];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[1] * c[0][0] - d[0] * c[1][0]);
		r0 = L_len[0].x * absC[1][0] + L_len[0].y * absC[0][0];
		r1 = L_len[1].y * absC[2][2] + L_len[1].z * absC[2][1];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[1] * c[0][1] - d[0] * c[1][1]);
		r0 = L_len[0].x * absC[1][1] + L_len[0].y * absC[0][1];
		r1 = L_len[1].x * absC[2][2] + L_len[1].z * absC[2][0];
		if (r > r0 + r1)
			return false;
	
	
	
		r = Abs(d[1] * c[0][2] - d[0] * c[1][2]);
		r0 = L_len[0].x * absC[1][2] + L_len[0].y * absC[0][2];
		r1 = L_len[1].x * absC[2][1] + L_len[1].y * absC[2][0];
		if (r > r0 + r1)
			return false;
	
	
	
		return true;
	
	}
	public static int d_COSTMUL = 100;
	public static int Manhattan(CVec3 pa_distination, CVec3 pa_point)
	{
		return (int)((Abs(pa_distination.x - pa_point.x) +
			Abs(pa_distination.y - pa_point.y) +
			Abs(pa_distination.z - pa_point.z))*d_COSTMUL);
	}
	public static float TwoVec3DirAngle(CVec3 pa_vec1, CVec3 pa_vec2)
	{
		float radian;
		pa_vec1 = Vec3Normalize(pa_vec1);
		pa_vec2 = Vec3Normalize(pa_vec2);

		CVec3 L_cro = Vec3Cross(pa_vec1, pa_vec2);
		radian = (float) Math.acos(Vec3Dot(pa_vec2, pa_vec1));
		float dir = L_cro.x + L_cro.y + L_cro.z;
		if (dir < 0)
			radian = -radian;
		return radian;
	}
};