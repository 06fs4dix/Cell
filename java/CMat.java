package cell;

public class CMat implements ISerialize
{
	float arr[][]=new float[4][4];
	CMat()
	{
		arr[0][0] = 1.0f; arr[0][1] = 0.0f; arr[0][2] = 0.0f; arr[0][3] = 0.0f;
		arr[1][0] = 0.0f; arr[1][1] = 1.0f; arr[1][2] = 0.0f; arr[1][3] = 0.0f;
		arr[2][0] = 0.0f; arr[2][1] = 0.0f; arr[2][2] = 1.0f; arr[2][3] = 0.0f;
		arr[3][0] = 0.0f; arr[3][1] = 0.0f; arr[3][2] = 0.0f; arr[3][3] = 1.0f;
	}
	CMat(float _x, float _y, float _z)
	{
		arr[0][0] = 1.0f; arr[0][1] = 0.0f; arr[0][2] = 0.0f; arr[0][3] = 0.0f;
		arr[1][0] = 0.0f; arr[1][1] = 1.0f; arr[1][2] = 0.0f; arr[1][3] = 0.0f;
		arr[2][0] = 0.0f; arr[2][1] = 0.0f; arr[2][2] = 1.0f; arr[2][3] = 0.0f;
		arr[3][0] =_x; arr[3][1] = _y; arr[3][2] = _z; arr[3][3] = 1.0f;
	}

	CVec3 GetPos()
	{
		return new CVec3(arr[3][0], arr[3][1], arr[3][2]);
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();

		for (int i = 0; i < 4; ++i)
		{
			for (int j = 0; j < 4; ++j)
			{
				pac.Push(arr[i][j]);
			}
		}

		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		for (int i = 0; i < 4; ++i)
		{
			for (int j = 0; j < 4; ++j)
			{
				arr[i][j] = pac.GetFloat(j + i * 4);
			}
		}
	}
	CMat toCopy()
	{
		CMat dum=new CMat();
		for (int y = 0; y < 4; ++y)
		{
			for (int x = 0; x < 4; ++x)
			{
				dum.arr[y][x] = this.arr[y][x];
			}
		}
		return dum;
	}
	void toCopy(CMat _obj)
	{
		
		for (int y = 0; y < 4; ++y)
		{
			for (int x = 0; x < 4; ++x)
			{
				this.arr[y][x]=_obj.arr[y][x];
			}
		}
	}
}
