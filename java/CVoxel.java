package cell;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.Vector;

class DfV
{
	public static final int AtomCount = 16;
	public static final int AtomSize = 100;


	public static final int TexNull = 0;
	public static final int TexLight = 1;
	public static final int TexCobbleBlood = 2;
	public static final int TexDirt = 3;
	public static final int TexSand = 4;
	public static final int TexVines = 5;
	public static final int TexIce = 6;
	public static final int TexLava = 7;
	public static final int TexPad = 8;



	public static final int DNull = -1;
	public static final int DFront = 0;
	public static final int DBack = 1;
	public static final int DLeft = 2;
	public static final int DRight = 3;
	public static final int DDown = 4;
	public static final int DUp = 5;
	public static final int DCount = 6;

	public static final float LightRangeMax=16;
	public static final float LightRangeDefault=0.2f;

	public static final CVec3 DFrontVec= new CVec3(0, 0, -1);
	public static final CVec3 DBackVec= new CVec3(0, 0, 1);
	public static final CVec3 DLeftVec= new CVec3(-1, 0, 0);
	public static final CVec3 DRightVec= new CVec3(1, 0, 0);
	public static final CVec3 DDownVec= new CVec3(0, -1, 0);
	public static final CVec3 DUpVec= new CVec3(0, 1, 0);


	public static final int MapX = 8;
	public static final int MapY = 2;
	public static final int MapZ = 8;
	public static final boolean Local = false;
	public static final int ShowCellCount = 1;

	public static final int NavTick = 4;
	public static final int NavSize = 25;
	public static final boolean NavUpdate = true;
};





class CVIndex implements ISerialize
{
	public CVIndex() {}
	public CVIndex(int _x, int _y, int _z)
	{
		x = _x;
		y = _y;
		z = _z;
	}
	public CVIndex(int _offset)
	{
		x = _offset % DfV.MapX;
		int dum = _offset / DfV.MapX;
		z = dum % DfV.MapZ;
		y = dum / DfV.MapZ;
	}
	public int x=-1, y = -1, z = -1;
	public boolean equals(CVIndex _index)
	{
		return x == _index.x && y == _index.y && z == _index.z;
	}
	public int GetMapOffset()
	{
		return x + z * DfV.MapX + y * DfV.MapX*DfV.MapZ;
	}
	public CVIndex toCopy()
	{
		CVIndex dum=new CVIndex();
		dum.x = x;
		dum.y = y;
		dum.z = z;
		return dum;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(x);
		pac.Push(y);
		pac.Push(z);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		x = pac.GetInt32(0);
		y = pac.GetInt32(1);
		z = pac.GetInt32(2);
	}
};

class CVPick implements ISerialize
{
	public CVIndex mi=new CVIndex();
	public CVIndex	ai=new CVIndex();
	public int dir=-1;
	public float value=0;
	public int option=-1;
	//성공하면 투루
	public boolean DirToAi()
	{
		if (DfV.DNull == dir)
			return true;
		switch (dir)
		{
		case DfV.DFront:
			if (ai.z - 1 < 0)
			{
				if (mi.z - 1 >= 0)
				{
					mi.z -= 1;
					ai.z = DfV.AtomCount - 1;
				}
				else
					return false;
			}
			else
				ai.z -= 1;
			break;
		case DfV.DBack:
			if (ai.z + 1 >= DfV.AtomCount)
			{
				if (mi.z + 1 < DfV.MapZ)
				{
					mi.z += 1;
					ai.z = 0;
				}
				else
					return false;
			}
			else
				ai.z += 1;
			break;
		case DfV.DLeft:
			if (ai.x - 1 < 0)
			{
				if (mi.x - 1 >= 0)
				{
					mi.x -= 1;
					ai.x = DfV.AtomCount - 1;
				}
				else
					return false;
			}
			else
				ai.x -= 1;
			break;
		case DfV.DRight:
			if (ai.x + 1 >= DfV.AtomCount)
			{
				if (mi.x + 1 < DfV.MapX)
				{
					mi.x += 1;
					ai.x = 0;
				}
				else
					return false;
			}
			else
				ai.x += 1;
			break;
		case DfV.DDown:
			if (ai.y - 1 < 0)
			{
				if (mi.y - 1 >= 0)
				{
					mi.y -= 1;
					ai.y = DfV.AtomCount - 1;
				}
				else
					return false;
			}
			else
				ai.y -= 1;
			break;
		case DfV.DUp:
			if (ai.y + 1 >= DfV.AtomCount)
			{
				if (mi.y + 1 < DfV.MapY)
				{
					mi.y += 1;
					ai.y = 0;
				}
				else
					return false;
			}
			else
				ai.y += 1;
			break;
		}
		dir = DfV.DNull;
		return true;
	}
	public boolean equals(CVPick _pick)
	{
		if (mi.equals(_pick.mi) && ai.equals(_pick.ai) && dir == _pick.dir)
			return true;
		return false;
	}
	public CVec3 GetPos()
	{
		return new CVec3(mi.x*DfV.AtomCount*DfV.AtomSize + ai.x*DfV.AtomSize + DfV.AtomSize * 0.5f,
			mi.y*DfV.AtomCount*DfV.AtomSize + ai.y*DfV.AtomSize + DfV.AtomSize * 0.5f,
			mi.z*DfV.AtomCount*DfV.AtomSize + ai.z*DfV.AtomSize + DfV.AtomSize * 0.5f);
	}
	void SetPos(CVec3 _pos)
	{
		mi.x = ((int)(_pos.x) / DfV.AtomSize) / DfV.AtomCount;
		mi.y = ((int)(_pos.y) / DfV.AtomSize) / DfV.AtomCount;
		mi.z = ((int)(_pos.z) / DfV.AtomSize) / DfV.AtomCount;

		int ax = (int) (_pos.x - (mi.x* DfV.AtomSize*DfV.AtomCount));
		int ay = (int) (_pos.y - (mi.y* DfV.AtomSize*DfV.AtomCount));
		int az = (int) (_pos.z - (mi.z* DfV.AtomSize*DfV.AtomCount));

		ai.x = ax / DfV.AtomSize;
		ai.y = ay / DfV.AtomSize;
		ai.z = az / DfV.AtomSize;

	}
	public CVPick toCopy()
	{
		CVPick dummy=new CVPick();
		dummy.ai = ai.toCopy();
		dummy.mi = mi.toCopy();
		dummy.dir = dir;
		dummy.option = option;
		dummy.value = value;
		return dummy;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(mi);
		pac.Push(ai);
		pac.Push(dir);
		pac.Push(value);
		pac.Push(option);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		pac.GetISerialize(0, mi);
		pac.GetISerialize(1, ai);
		dir = pac.GetInt32(2);
		value = pac.GetInt32(3);
		option = pac.GetInt32(4);
	}
};

class CVLightData implements ISerialize
{
	public CVLightData() {}
	public CVLightData(String _key,CVIndex _mi, CVIndex _ai,int _range, boolean _tGlobalfLocal)
	{
		key=_key;
		mi = _mi;
		ai = _ai;
		range = _range;
		global = _tGlobalfLocal;
	}
	public String key="";
	public CVIndex mi=new CVIndex();
	public CVIndex ai=new CVIndex();
	public int range=0;//영향력
	public boolean global = false;
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(key);
		pac.Push(mi);
		pac.Push(ai);
		pac.Push(range);
		pac.Push(global);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		key=pac.GetString(0);
		pac.GetISerialize(1, mi);
		pac.GetISerialize(2, ai);
		range = pac.GetInt32(3);
		global = pac.GetBool(4);
	}
};
class CVLightPlane implements ISerialize
{
	public Vector<CVLightData> data=new Vector<CVLightData>();
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(data);
		
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		CPacket pacV=new CPacket();
		pacV.Deserialize(pac.GetString(0));
		for (int i = 0; i < pacV.value.size(); ++i)
		{
			CVLightData lv=new CVLightData();
			lv.Deserialize(pacV.value.get(i));
			data.add(lv);
		}
	}
};
class CAtom implements ISerialize
{
	static int loff=0;
	public CAtom()
	{
		m_offset = loff++;
		for(int i=0;i<6;++i)
		{
			m_light[i]=new CVLightPlane();
		}
		
	}
	public int m_offset;
	public int m_tex = DfV.TexNull;
	public CVLightPlane m_light[]=new CVLightPlane[6];
	//CVIndex m_pos;

	public void PushLight(CVLightData _data, int _dir)
	{
		for (int i=0;i< m_light[_dir].data.size();++i)
		{
			if (m_light[_dir].data.get(i).key.equals(_data.key))
			{
				if (_data.range > m_light[_dir].data.get(i).range)
				{
					m_light[_dir].data.get(i).range = _data.range;
				}
				return;
			}

		}
		m_light[_dir].data.add(_data);
	}
	public void RemoveLight(String _key)
	{
		for (int i = 0; i < 6; ++i)
		{
			for (int j = 0; j < m_light[i].data.size(); ++j)
			{
				if (m_light[i].data.get(j).key.equals(_key))
				{
					m_light[i].data.remove(j);
					return;
				}
			}
		}
	}
	public float GetLightRange(int _dir)
	{
		float range = 0;
		float global = 0;
		for (int i=0;i< m_light[_dir].data.size();++i)
		{
			if (m_light[_dir].data.get(i).global)
				range += m_light[_dir].data.get(i).range*CCanvasVoxel.m_global;
			else
				range += m_light[_dir].data.get(i).range;
		}
		range += global;
		range /= DfV.LightRangeMax;
		if (range > 1.0f)
			range = 1.0f;
		if (range < 0.2f)
			range = 0.2f;
		return range;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(m_tex);
		for(int i=0;i<6;++i)
			pac.Push(m_light[i]);
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		m_tex = pac.GetInt32(0);
		for (int i = 0; i < 6; ++i)
			pac.GetISerialize(1+i, m_light[i]);
	}
	
};
class CCellTex
{
	String m_tex="";
	Vector<String> m_tile=new Vector<String>();
	static CVec2 GetU(int _tex)
	{
		_tex -= 1;
		int x = _tex % 4;
		int y = _tex / 4;
		float uvStX = x * (1 / 4.0f)+0.01f;
		float uvEdX = uvStX+(1 / 4.0f)-0.02f;
		return new CVec2(uvStX, uvEdX);
	}
	static CVec2 GetV(int _tex)
	{
		_tex -= 1;
		int x = _tex % 4;
		int y = _tex / 4;
		float uvStY = y * (1 / 4.0f)+0.01f;
		float uvEdY = uvStY + (1 / 4.0f)-0.02f;
		return new CVec2(uvStY, uvEdY);
	}
};
class CMolecule extends CRenObj
{
	CMolecule()
	{
		for(int x=0;x<DfV.AtomCount;++x)
		{
			for(int y=0;y<DfV.AtomCount;++y)
			{
				for(int z=0;z<DfV.AtomCount;++z)
				{
					m_atom[z][y][x]=new CAtom();
				}
			}
		}
	}
	//int m_offset=0;
	public CMat m_mat=new CMat();
	public CBound m_bound=new CBound();
	public CVIndex m_index=new CVIndex();
	//CMeshData m_meshData=new CMeshData();
	public CAtom m_atom[][][]=new CAtom[DfV.AtomCount][DfV.AtomCount][DfV.AtomCount];
	public boolean m_block=false; 
	//public int m_nav[]=new int[DfV.AtomCount*DfV.AtomCount*DfV.AtomCount];
	
	
	
	
	
	
	
	
	
	//void Render(const CCamera & _cam);
	public void AtomUpdate()
	{
		
	}
	public void AllGround()
	{
		for (int z = 0; z < DfV.AtomCount; ++z)
		{
			for (int x = 0; x < DfV.AtomCount; ++x)
			{
				for (int y = 0; y < DfV.AtomCount; ++y)
				{
					//if(y==0)
						m_atom[z][y][x].m_tex = DfV.TexDirt;
				}
			}
		}
	}
	public void Update(int _delay)
	{
		
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		//pac.Push(m_offset);
		pac.Push(m_mat);
		pac.Push(m_bound);
		pac.Push(m_index);
		for (int z = 0; z < DfV.AtomCount; ++z)
		{
			for (int y = 0; y < DfV.AtomCount; ++y)
			{
				for (int x = 0; x < DfV.AtomCount; ++x)
				{
					pac.Push(m_atom[z][y][x]);
				}
			}
		}
		
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		//m_offset = pac.GetInt32(0);
		pac.GetISerialize(0, m_mat);
		pac.GetISerialize(1, m_bound);
		pac.GetISerialize(2, m_index);
		for (int z = 0; z < DfV.AtomCount; ++z)
		{
			for (int y = 0; y < DfV.AtomCount; ++y)
			{
				for (int x = 0; x < DfV.AtomCount; ++x)
				{
					pac.GetISerialize(3+x+y*DfV.AtomCount+z* DfV.AtomCount*DfV.AtomCount, m_atom[z][y][x]);
				}
			}
		}
		
	}
	static boolean m_process=false;
	int m_write=0;
	int m_find=1;
	static int m_max=2;
	boolean m_navUpdate[]=new boolean[2];
	synchronized static public void SetFind(boolean _enable)
	{
		m_process=_enable;
	}
	int m_nav[][][][][][][]=new int[m_max][DfV.AtomCount][DfV.AtomCount][DfV.AtomCount][DfV.NavTick][DfV.NavTick][DfV.NavTick];
	synchronized void NavUpdate()
	{
		
		
		if(m_process==false)
		{
			m_write++;
			m_find++;
			if(m_write>=m_max)
			{
				m_write=0;
			}
			if(m_find>=m_max)
			{
				m_find=0;
			}
		}
		if(m_navUpdate[m_write]==true)
			return;
			
		m_block=false;
		for (int z = 0; z < DfV.AtomCount; ++z)
		{
			for (int y = 0; y < DfV.AtomCount; ++y)
			{
				for (int x = 0; x < DfV.AtomCount; ++x)
				{
					
					if (m_atom[z][y][x].m_tex != DfV.TexNull)
					{
						for (int nz = 0; nz < DfV.NavTick; ++nz)
						{
							for (int ny = 0; ny < DfV.NavTick; ++ny)
							{
								for (int nx = 0; nx < DfV.NavTick; ++nx)
								{
									m_nav[m_write][z][y][x][nz][ny][nx] = 1;
									m_block=true;
								}
							}
						}
						
					}
					else
					{
						for (int nz = 0; nz < DfV.NavTick; ++nz)
						{
							for (int ny = 0; ny < DfV.NavTick; ++ny)
							{
								for (int nx = 0; nx < DfV.NavTick; ++nx)
								{
									m_nav[m_write][z][y][x][nz][ny][nx] = 0;
								}
							}
						}
					}
						
				}
			}
		}
		m_navUpdate[m_write]=true;
	}
};
class CCell
{
	public CMolecule m = null;
};
class CVLight implements ISerialize
{

	public String key="";
	public CVec3 pos=new CVec3();
	public float power=0;
	public boolean global=false;//해냐0,일반이냐1
	public Vector<CVLightData> atomData=new Vector<CVLightData>();
	CVLight toCopy()
	{
		CVLight dummy=new CVLight();
		dummy.key = this.key;
		dummy.pos = this.pos;
		dummy.power = this.power;
		dummy.global = this.global;
		return dummy;
	}
	public CPacket Serialize()
	{
		CPacket pac=new CPacket();
		pac.Push(key);
		pac.Push(pos);
		pac.Push(power);
		pac.Push(global);
		pac.Push(atomData);
		
		return pac;
	}
	public void Deserialize(String _str)
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		key = pac.GetString(0);
		pac.GetISerialize(1,pos);
		power = pac.GetFloat(2);
		global = pac.GetBool(3);
		CPacket pac2=new CPacket();
		pac2.Deserialize(pac.GetString(4));
		for (var each0 : pac2.value)
		{
			CVLightData ldata=new CVLightData();
			ldata.Deserialize(each0);
			atomData.add(ldata);
		}

	}
};
class CCanvasVoxel extends CCanvas
{
	static float m_global=1.0f;
	//CVIndex m_updateIndex=new CVIndex(0,0,0);
	public Vector<CVIndex> m_updateList=new Vector<CVIndex>();
	public CCell m_map[]=new CCell[DfV.MapX*DfV.MapY* DfV.MapZ];
	Vector<CVLight> m_ligVec=new Vector<CVLight>();
	public CCanvasVoxel(CCamera _cam)
	{
		super(_cam);
		for(int i=0;i<DfV.MapX*DfV.MapY* DfV.MapZ;++i)
		{
			m_map[i]=new CCell();
		}
	}
	
	public void Update(int _delay)
	{
		//super.Update(_delay);
		if(DfV.NavUpdate)
		{
			for(var each0 : m_obj.values())
			{
				CMolecule each1 = (CMolecule)each0;
				each1.NavUpdate();
			}
		}
		
	}
	
	
//	void PosInCellUpdate()
//	{
//		//int tick = 1;
//		m_obj.clear();
//
//		for (int y = 0; y < DfV.MapY; ++y)
//		{
//			for (int z = m_updateIndex.z - DfV.ShowCellCount; z <= m_updateIndex.z + DfV.ShowCellCount; ++z)
//			{
//				for (int x = m_updateIndex.x - DfV.ShowCellCount; x <= m_updateIndex.x + DfV.ShowCellCount; ++x)
//				{
//					if (x < 0 || z < 0 || x >= DfV.MapX || z >= DfV.MapZ)
//						continue;
//
//					
//						CCell cell = m_map[new CVIndex(x, y, z).GetMapOffset()];
//						if (cell.m == null)
//						{
//							CMsg.E("풀 로드후 사용해라");
////							if (DfV.Local)
////							{
////								cell.m = new CMolecule();
////								cell.m.m_index.x = x;
////								cell.m.m_index.y = y;
////								cell.m.m_index.z = z;
////								cell.m.m_mat = new CMat(x * DfV.AtomCount * DfV.AtomSize, y * DfV.AtomCount * DfV.AtomSize, z * DfV.AtomCount * DfV.AtomSize);
////								cell.m.m_bound.min =new CVec3();
////								cell.m.m_bound.max = new CVec3(DfV.AtomCount * DfV.AtomSize, DfV.AtomCount * DfV.AtomSize, DfV.AtomCount * DfV.AtomSize);
////
////								if (y == 0)
////								{
////									cell.m.AllGround();
////								}
////
////								Push(cell.m);
////							}
////							else
////								m_updateList.add(new CVIndex(x, y, z));
//						}
//						else
//							Push(cell.m);
//				}
//			}
//		}//for y
//		
//		for (int i=0;i< m_obj.size();++i)
//		{
//			//CMolecule mo = (CMolecule)m_obj[i];
////			if (mo.m_meshData.vGBuf == null)
////			{
////				//if (DfV.Local)
////				GlobalLightM(mo);
////				mo.AtomUpdate();
////			}
//				
//			
//		}
//		
//
//	}



	public void Init()
	{
		super.Init();
		//m_cam.Init(new CVec3(1, 2000, 1),new CVec3(0, 1, 1));
		//m_cam.Reset3D();

		//PosInCellUpdate();
	}
	//void Update(int _delay);
	
	
	//void Render();
	public CVPick Pick(CThreeVec3 _ray)
	{
		CVec3 L_cen=new CVec3();
		CBound bound=new CBound();
		CVPick lpick=new CVPick();
		lpick.dir = DfV.DNull;
		//int RF_dir=DfV.DNull;
		CVec3 L_pickPos=new CVec3();
		//CVIndex mi, ai;
		float Lmin = Float.MAX_VALUE;
		//for (CRenObj * each0 : m_obj)
		//for (int i=0;i< m_obj.size();++i)
		for(var each0 : m_obj.values())
		{
			CMolecule each1 = (CMolecule)each0;
			CThreeVec3 lray = _ray.toCopy();
			CMat L_inM = CMath.MatInvert(each1.m_mat);

			lray.SetDirect(CMath.MatToVec3Normal(lray.GetDirect(), L_inM));
			lray.SetOriginal(CMath.MatToVec3Coordinate(lray.GetOriginal(), L_inM));


			if (CMath.RayBoxIS(each1.m_bound.min, each1.m_bound.max, lray))
			{

				for (int z = 0; z < DfV.AtomCount; ++z)
				{
					for (int y = 0; y < DfV.AtomCount; ++y)
					{
						for (int x = 0; x < DfV.AtomCount; ++x)
						{
							if (each1.m_atom[z][y][x].m_tex == DfV.TexNull)
								continue;
							int xp = x * DfV.AtomSize;
							int yp = y * DfV.AtomSize;
							int zp = z * DfV.AtomSize;

							
							bound.min.x=0 + xp;bound.min.y=0 + yp;bound.min.z=0 + zp;
							bound.max.x=DfV.AtomSize + xp;bound.max.y=DfV.AtomSize + yp;bound.max.z=DfV.AtomSize + zp;

							//if (CMath.RaySphereIS(pos, d_BoxSize/2.0f, lray))
							if (CMath.RayBoxIS(bound.min, bound.max, lray))
							{
								//each1.m_atom[x][y][z].m_tex = 0;
								float L_len = CMath.Vec3Lenght(
									CMath.Vec3MinusVec3(lray.GetPosition(), lray.GetOriginal()));
								if (L_len < Lmin)
								{
									//_ray.SetPosition(lray.GetPosition());
									_ray.SetPosition(CMath.MatToVec3Coordinate(lray.GetPosition(), each1.m_mat));
									Lmin = L_len;
									lpick.mi = each1.m_index.toCopy();
									lpick.ai.x = x;
									lpick.ai.y = y;
									lpick.ai.z = z;
									 //= CVec3(each1.m_mat.arr[3][0], each1.m_mat.arr[3][1], each1.m_mat.arr[3][2]);
									L_cen.x = DfV.AtomSize / 2.0f + DfV.AtomSize * x;
									L_cen.y = DfV.AtomSize / 2.0f + DfV.AtomSize * y;
									L_cen.z = DfV.AtomSize / 2.0f + DfV.AtomSize * z;

									/*cout << lray.GetPositionRF().x <<"," ;
									cout << lray.GetPositionRF().y << ",";
									cout << lray.GetPositionRF().z << endl;*/
									L_pickPos = CMath.Vec3Normalize(CMath.Vec3MinusVec3(lray.GetPosition(), L_cen));
								}

							}
						}
					}
				}
				float L_len[] = {0,0,0,0,0,0};
				L_len[DfV.DFront] = CMath.Vec3Dot(DfV.DFrontVec, L_pickPos);
				L_len[DfV.DBack] = CMath.Vec3Dot(DfV.DBackVec, L_pickPos);
				L_len[DfV.DLeft] = CMath.Vec3Dot(DfV.DLeftVec, L_pickPos);
				L_len[DfV.DRight] = CMath.Vec3Dot(DfV.DRightVec, L_pickPos);
				L_len[DfV.DUp] = CMath.Vec3Dot(DfV.DUpVec, L_pickPos);
				L_len[DfV.DDown] = CMath.Vec3Dot(DfV.DDownVec, L_pickPos);



				if (lpick.ai.x != -1 && lpick.ai.y != -1 && lpick.ai.z != -1)
				{
					int L_choise = -1;
					float maxVal = -1;
					for (int j = 0; j < DfV.DCount; ++j)
					{
						if (L_len[j] > maxVal)
						{
							L_choise = j;
							maxVal = L_len[j];
						}
					}
					lpick.dir = L_choise;
				}

			}//d_VCount
			//
		}//for
		return lpick;
	}
	//성공하면 true
	public CMolecule FindCMolecule(CVIndex _index)
	{
		int off=_index.GetMapOffset();
		if (off > DfV.MapX*DfV.MapY* DfV.MapZ || off<0)
			return null;
		return m_map[off].m;
	}
	public CAtom FindCAtom(CVPick _pick,boolean _move)
	{
		if (_move && _pick.DirToAi() == false)
			return null;

		CMolecule mol = FindCMolecule(_pick.mi);
		if (mol == null)
			return null;
		return mol.m_atom[_pick.ai.z][_pick.ai.y][_pick.ai.x];
	}
	public boolean SetAtomTex(CVPick _pick, int _tex, boolean _move)
	{
		
		return true;
	}
	
	public CVPick Collision(CVec3 _pos,float _radius)
	{
		CVPick lpick=new CVPick();
		lpick.dir = DfV.DNull;
		//int RF_dir=DfV.DNull;
		CVec3 L_pickPos=new CVec3();
		//CVIndex mi, ai;
		float Lmin = Float.MAX_VALUE;
		for (var each0 : m_obj.values())
		{
			var each1 = (CMolecule)each0;
			if(each1.m_block==false)
				continue;
			float ra = each1.m_bound.GetOutRadius();
			CVec3 mCen= each1.m_mat.GetPos();
			mCen.x += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.y += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.z += DfV.AtomCount * 0.5*DfV.AtomSize;

			if (CMath.ColSphereSphere(mCen, ra, _pos, _radius)!=-1)
			{

		

				int ax = (int) (_pos.x - (each1.m_index.x* DfV.AtomSize*DfV.AtomCount));
				int ay = (int) (_pos.y - (each1.m_index.y* DfV.AtomSize*DfV.AtomCount));
				int az = (int) (_pos.z - (each1.m_index.z* DfV.AtomSize*DfV.AtomCount));

				int axn = ax / DfV.AtomSize;
				int ayn = ay / DfV.AtomSize;
				int azn = az / DfV.AtomSize;
				

				int tick=(int) (_radius/ DfV.AtomSize+1);
				for (int z = azn-tick; z <= azn+tick; ++z)
				{
					for (int y = ayn-tick; y <= ayn+tick; ++y)
					{
						for (int x = axn-tick; x <= axn+tick; ++x)
						{
							if(z<0 || y<0 || x<0 || x>=DfV.AtomCount || y>=DfV.AtomCount || z>=DfV.AtomCount)
								continue;
							
							if (each1.m_atom[z][y][x].m_tex == DfV.TexNull)
								continue;
							int xp = x * DfV.AtomSize;
							int yp = y * DfV.AtomSize;
							int zp = z * DfV.AtomSize;

							CBound bound=new CBound();
							bound.min = new CVec3(0 + xp, 0 + yp, 0 + zp);
							bound.max = new CVec3(DfV.AtomSize + xp, DfV.AtomSize + yp, DfV.AtomSize + zp);

				
							CVec3 L_cen=new CVec3();
							L_cen.x += DfV.AtomSize / 2.0f + DfV.AtomSize * x+each1.m_mat.GetPos().x;
							L_cen.y += DfV.AtomSize / 2.0f + DfV.AtomSize * y+each1.m_mat.GetPos().y;
							L_cen.z += DfV.AtomSize / 2.0f + DfV.AtomSize * z+each1.m_mat.GetPos().z;
							float len = CMath.ColSphereSphere(L_cen, bound.GetInRadius(), _pos, _radius);
							if (len != -1 && len>0.1)
							{

								if (len < Lmin)
								{
									Lmin = len;
									lpick.mi = each1.m_index.toCopy();
									lpick.ai.x = x;
									lpick.ai.y = y;
									lpick.ai.z = z;
									lpick.dir = DfV.DCount;
									lpick.value = (int) len;
								}

							}
						}
					}
				}
			}//d_VCount
		}//for
		return lpick;

	}
	public void CellAttach(CMolecule _mo)
	{
		m_map[_mo.m_index.GetMapOffset()].m = _mo;
		_mo.AtomUpdate();
		Push(_mo);
	}
	public class CAsterInfo implements Comparable<CAsterInfo>
	{
		public CAsterInfo()
		{

		}
		public CAsterInfo(CVec3 _org)
		{
			org = _org;
		}

		public CVec3 org;
		public CVec3 tar;
		public CVec3 bef;
		public int befCost = 100000000;

		public int total=0;//합친값 float로 연산하면 소숫점에서 에러가 나서 
		public int cost = 0;//몇번 옴긴값인지
		@Override
		public int compareTo(CAsterInfo o) {
			return this.total <= o.total ? -1 :  1;
		}


	};
	public void NavWrite(CVec3 _pos, CBound _bound,int _hashKey)
	{
		CBound bd=_bound.toCopy();
		if(bd.boundType==DfBound.Circle || bd.boundType==DfBound.Null)
		{
			float len=bd.GetInRadius();
			//len+=DfV.NavSize;
			bd.min=new CVec3(-len,-len,-len);
			bd.max=new CVec3(len,len,len);
		}
		for (int z = (int) (_pos.z + bd.min.z); z <= _pos.z + bd.max.z; z += DfV.NavSize)
		{
			for (int y = (int) (_pos.y + bd.min.y); y <= _pos.y + bd.max.y; y += DfV.NavSize)
			{
				for (int x = (int) (_pos.x + bd.min.x); x <= _pos.x + bd.max.x; x += DfV.NavSize)
				{
					int mox = ((int)(x) / DfV.AtomSize) / DfV.AtomCount;
					int moy = ((int)(y) / DfV.AtomSize) / DfV.AtomCount;
					int moz = ((int)(z) / DfV.AtomSize) / DfV.AtomCount;

					int ax = (x - (mox* DfV.AtomSize*DfV.AtomCount));
					int ay = (y - (moy* DfV.AtomSize*DfV.AtomCount));
					int az = (z - (moz* DfV.AtomSize*DfV.AtomCount));

					int axn = ax / DfV.AtomSize;
					int ayn = ay / DfV.AtomSize;
					int azn = az / DfV.AtomSize;

					int nx = (ax % DfV.AtomSize)/ DfV.NavSize;
					int ny = (ay % DfV.AtomSize) / DfV.NavSize;
					int nz = (az % DfV.AtomSize) / DfV.NavSize;

					if (mox < 0 || mox >= DfV.MapX || moy < 0 || moy >= DfV.MapY || moz < 0 || moz >= DfV.MapZ ||
						axn < 0 || axn >= DfV.AtomCount || ayn < 0 || ayn >= DfV.AtomCount || azn < 0 || azn >= DfV.AtomCount ||
						nx < 0 || nx >= DfV.NavTick || ny < 0 || ny >= DfV.NavTick || nz < 0 || nz >= DfV.NavTick)
					{
						continue;
					}
					//int ntx = ax % DfV.AtomCount;
					CMolecule  mo = FindCMolecule(new CVIndex(mox, moy, moz));

					mo.m_nav[mo.m_write][azn][ayn][axn][nx][ny][nz] = _hashKey;
					mo.m_navUpdate[mo.m_write]=false;
				}
			}
		}
	}
	
	//1벽 2 조형물 3사람과 조형물
	public boolean Restricted(CVec3 _pos, CBound _bound, Vector<Integer> _passVec)
	{
		boolean pass = true;
		CMolecule mo = null;
		int mox, moy, moz, ax, ay, az, axn, ayn, azn, nx, ny, nz;
		for (int z = (int) (_pos.z + _bound.min.z); z <= _pos.z + _bound.max.z; z += _bound.max.z)
		{
			for (int x = (int) (_pos.x + _bound.min.x); x <= _pos.x + _bound.max.x; x += _bound.max.x)
			{
				mox = ((int)(x) / DfV.AtomSize) / DfV.AtomCount;
				moy = ((int)(_pos.y + _bound.min.y) / DfV.AtomSize) / DfV.AtomCount;
				moz = ((int)(z) / DfV.AtomSize) / DfV.AtomCount;


				ax = (x - (mox* DfV.AtomSize*DfV.AtomCount));
				ay = (int) ((_pos.y + _bound.min.y) - (moy* DfV.AtomSize*DfV.AtomCount));
				az = (z - (moz* DfV.AtomSize*DfV.AtomCount));

				axn = ax / DfV.AtomSize;
				ayn = ay / DfV.AtomSize;
				azn = az / DfV.AtomSize;
				ayn -= 1;
				if(ayn==-1)
				{
					moy-=1;
					ayn=15;
				}
				if(moy<0)
					continue;
				mo = FindCMolecule(new CVIndex(mox, moy, moz));
				if (axn < 0 || ayn < 0 || azn < 0)
					continue;
				if (mo != null && ayn >= 0 && mo.m_atom[azn][ayn][axn].m_tex != DfV.TexNull)
					pass = false;
			}
		}
		if (pass)
			return true;
		
		
		for (int z = (int) (_pos.z + _bound.min.z); z<=_pos.z + _bound.max.z; z += _bound.max.z)
		{
			for (int y = (int) (_pos.y + _bound.min.y); y<=_pos.y + _bound.max.y; y += _bound.max.y)
			{
				for (int x = (int) (_pos.x + _bound.min.x); x<=_pos.x + _bound.max.x; x += _bound.max.z)
				{
					mox = ((int)(x) / DfV.AtomSize) / DfV.AtomCount;
					moy = ((int)(y) / DfV.AtomSize) / DfV.AtomCount;
					moz = ((int)(z) / DfV.AtomSize) / DfV.AtomCount;


					ax = (x - (mox* DfV.AtomSize*DfV.AtomCount));
					ay = (y - (moy* DfV.AtomSize*DfV.AtomCount));
					az = (z - (moz* DfV.AtomSize*DfV.AtomCount));

					axn = ax / DfV.AtomSize;
					ayn = ay / DfV.AtomSize;
					azn = az / DfV.AtomSize;

					nx = (ax % DfV.AtomSize) / DfV.NavSize;
					ny = (ay % DfV.AtomSize) / DfV.NavSize;
					nz = (az % DfV.AtomSize) / DfV.NavSize;

					if (mox < 0 || mox >= DfV.MapX || moy < 0 || moy >= DfV.MapY || moz < 0 || moz >= DfV.MapZ ||
						axn < 0 || axn >= DfV.AtomCount || ayn < 0 || ayn >= DfV.AtomCount || azn < 0 || azn >= DfV.AtomCount ||
						nx < 0 || nx >= DfV.NavTick || ny < 0 || ny >= DfV.NavTick || nz < 0 || nz >= DfV.NavTick)
					{
						return true;
					}

					//int ntx = ax % DfV.AtomCount;
					mo = FindCMolecule(new CVIndex(mox, moy, moz));
					if (mo == null)
						return true;
					
					try {
						
						boolean returnVal = true;

						for (int i = 0; i < _passVec.size(); ++i)
						{
							if (mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz] !=1 && _passVec.get(i)==3)
							{
								returnVal = false;
							}
							else if (mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz] == _passVec.get(i))
							{
								returnVal = false;
							}
						}
						if (mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz] != 0 && returnVal)
						{
							return true;
						}
						
//						if (mo.m_nav[azn][ayn][axn][nx][ny][nz] != 0)
//						{
//							return true;
//						}
					} catch (Exception e) {
						System.out.println("nav:"+azn+","+ayn+","+axn+","+nx+","+ny+","+nz+",");
					}
					
				}
			}
		}

		return false;
	}
	void PassVecCreate(CVec3 _pos, CBound _bound, Vector<Integer> _passVec)
	{
		
		CMolecule mo = null;
		int mox, moy, moz, ax, ay, az, axn, ayn, azn, nx, ny, nz;
		for (int z = (int) (_pos.z + _bound.min.z); z<=_pos.z + _bound.max.z; z += DfV.NavSize)
		{
			for (int y = (int) (_pos.y + _bound.min.y); y<=_pos.y + _bound.max.y; y += DfV.NavSize)
			{
				for (int x = (int) (_pos.x + _bound.min.x); x<=_pos.x + _bound.max.x; x += DfV.NavSize)
				{
					mox = ((int)(x) / DfV.AtomSize) / DfV.AtomCount;
					moy = ((int)(y) / DfV.AtomSize) / DfV.AtomCount;
					moz = ((int)(z) / DfV.AtomSize) / DfV.AtomCount;


					ax = (x - (mox* DfV.AtomSize*DfV.AtomCount));
					ay = (y - (moy* DfV.AtomSize*DfV.AtomCount));
					az = (z - (moz* DfV.AtomSize*DfV.AtomCount));

					axn = ax / DfV.AtomSize;
					ayn = ay / DfV.AtomSize;
					azn = az / DfV.AtomSize;

					nx = (ax % DfV.AtomSize) / DfV.NavSize;
					ny = (ay % DfV.AtomSize) / DfV.NavSize;
					nz = (az % DfV.AtomSize) / DfV.NavSize;

					if (mox < 0 || mox >= DfV.MapX || moy < 0 || moy >= DfV.MapY || moz < 0 || moz >= DfV.MapZ ||
						axn < 0 || axn >= DfV.AtomCount || ayn < 0 || ayn >= DfV.AtomCount || azn < 0 || azn >= DfV.AtomCount ||
						nx < 0 || nx >= DfV.NavTick || ny < 0 || ny >= DfV.NavTick || nz < 0 || nz >= DfV.NavTick)
					{
						continue;
					}

					//int ntx = ax % DfV.AtomCount;
					mo = FindCMolecule(new CVIndex(mox, moy, moz));
					if (mo == null)
						continue;

					if (mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz] != 0 && 
							mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz] != 1 &&
							mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz] != 2)
					{
						boolean inChk = true;
						for (int i = 0; i < _passVec.size(); ++i)
						{
							if (_passVec.get(i) == mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz])
							{
								inChk = false;
								break;
							}
						}
						if(inChk)
							_passVec.add(mo.m_nav[mo.m_find][azn][ayn][axn][nx][ny][nz]);
					}
				}
			}
		}

	}
	CVec3 EmptyPos(CVec3 _pos, CBound _bound,Vector<Integer>  _passVec)
	{
		int tick=0;

		//TODO 바운딩 박스를 이렇게 했다. 큰놈이 작은 놈 찾으면 에러가 있어서
		//그리고 중복으로 빈공간 찾기를 실행한다...
		//작은걸로 하니까 큰놈이 또 문제다....
		CBound dummy=_bound.toCopy();
		dummy.min=CMath.Vec3PlusVec3(dummy.min, new CVec3(-DfV.NavSize,-DfV.NavSize,-DfV.NavSize));
		dummy.max=CMath.Vec3PlusVec3(dummy.max, new CVec3(DfV.NavSize,DfV.NavSize,DfV.NavSize));
		//dummy.InitSphere(DfV.NavSize);
		while (tick < 300)
		{
			for (int z = (int) (_pos.z - tick); z <= _pos.z + tick; z += DfV.NavSize)
			{
				for (int x = (int) (_pos.x - tick); x <= _pos.x + tick; x += DfV.NavSize)
				{
					if (Restricted(new CVec3(x, _pos.y, z), _bound,_passVec) == false)
						return new CVec3(x, _pos.y, z);
				}
			}
			tick += DfV.NavSize;
		}
		
		return new CVec3();
	}
	//TODO 만약 바운딩크기가 25에 딱 맞아 떨이지지 않으면 에러가 생긴다!
	public Vector<CVec3> FindPath(CVec3 _st, CVec3 _ed, CBound _stBound,int _pass)
	{
		CBound bound=new CBound();
		float len=_stBound.GetInRadius();
		len=(int)((len+DfV.NavSize-1)/ DfV.NavSize)* DfV.NavSize;
		bound.InitSphere(len);
		
		CMolecule.SetFind(true);
		Vector<CVec3> _path=new Vector<CVec3>();
		int findCount = 1000;
		Map<String, CAsterInfo> step=new HashMap<String, CAsterInfo>();
		Vector<Integer> passVec=new Vector<Integer>();
		CVec3 st=_st.toCopy();
		CVec3 ed=_ed.toCopy();
		st.y=st.y-_stBound.GetInRadius()+len;
		ed.y=ed.y-_stBound.GetInRadius()+len;
		st.x=(int)(st.x/ DfV.NavSize)* DfV.NavSize;
		st.y=(int)(st.y/ DfV.NavSize)* DfV.NavSize;
		st.z=(int)(st.z/ DfV.NavSize)* DfV.NavSize;
		
		ed.x=(int)(ed.x/ DfV.NavSize)* DfV.NavSize;
		ed.y=(int)(ed.y/ DfV.NavSize)* DfV.NavSize;
		ed.z=(int)(ed.z/ DfV.NavSize)* DfV.NavSize;
		
		//PassVecCreate(st, _stBound, passVec);
		passVec.add(_pass);
		PassVecCreate(ed, bound, passVec);
		
		CVec3 edChk=EmptyPos(ed, bound,passVec);
		if (edChk.IsZero())
			return _path;
		//st=stChk;
		ed = edChk;
		PassVecCreate(st, bound, passVec);
		PassVecCreate(ed, bound, passVec);
		
		CAsterInfo pst = new CAsterInfo(st);
		step.put(pst.org.x+","+pst.org.y+","+pst.org.z, pst);
		PriorityQueue<CAsterInfo> find=new PriorityQueue<CAsterInfo>();


		do
		{
			findCount--;
			//카우트 초가하면 아주 단순한 방식으로 길 찾기 한다
			if (findCount <= 0)
			{
				break;
			}
			Queue<CAsterInfo> visit=new LinkedList<CAsterInfo>();

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, 0, 0)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, 0, 0))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, 0, 0)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, 0, 0))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(0, 0, DfV.NavSize)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(0, 0, DfV.NavSize))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(0, 0, -DfV.NavSize)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(0, 0, -DfV.NavSize))));
			
			//대각선
			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, 0, DfV.NavSize)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, 0, DfV.NavSize))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, 0, DfV.NavSize)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, 0, DfV.NavSize))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, 0, -DfV.NavSize)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, 0, -DfV.NavSize))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, 0, -DfV.NavSize)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, 0, -DfV.NavSize))));
			
			

			//위로
			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize*2, DfV.AtomSize, 0)), bound, passVec))
			{
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, DfV.AtomSize, 0))));
			}

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize*2, DfV.AtomSize, 0)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, DfV.AtomSize, 0))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(0, DfV.AtomSize, DfV.NavSize*2)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(0, DfV.AtomSize, DfV.NavSize))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(0, DfV.AtomSize, -DfV.NavSize*2)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(0, DfV.AtomSize, -DfV.NavSize))));

			//밑으로
			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize*2, -DfV.AtomSize, 0)), bound, passVec))
			{
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(DfV.NavSize, -DfV.AtomSize, 0))));
			}

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize*2, -DfV.AtomSize, 0)), bound, passVec))
			{
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(-DfV.NavSize, -DfV.AtomSize, 0))));
			}

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(0, -DfV.AtomSize, DfV.NavSize*2)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(0, -DfV.AtomSize, DfV.NavSize))));

			if (!Restricted(CMath.Vec3PlusVec3(pst.org,new CVec3(0, -DfV.AtomSize, -DfV.NavSize*2)), bound, passVec))
				visit.add(new CAsterInfo(CMath.Vec3PlusVec3(pst.org,new CVec3(0, -DfV.AtomSize, -DfV.NavSize))));

			while (visit.peek() != null)
			{
				CAsterInfo temp = visit.poll();
				
				if (step.get(temp.org.x+","+temp.org.y+","+temp.org.z) != null)//이미 간곳은 패스
				{
					continue;
				}

				temp.cost = pst.cost + CMath.d_COSTMUL;
				temp.total = temp.cost + CMath.Manhattan(temp.org, ed);
				temp.tar = pst.org;
				if (pst.befCost > temp.total)
				{
					pst.befCost = temp.total;
					pst.bef = temp.org;
				}
				step.put(temp.org.x+","+temp.org.y+","+temp.org.z,temp);
				find.add(temp);
			}
			pst=find.poll();

			if(pst==null)
			{
				//System.out.println("\n find pst null");
				findCount = 0;
				break;
			}
	
			//if (pst.org.equals(ed))
			//TODO y값 높이값은 비교를 빼버렸다. 나중에 수정해야한다
			if(pst.org.x==ed.x && pst.org.z==ed.z )
			{
				break;
			}
		} while (true);//while(!find.isEmpty());

		if (findCount > 0)
		{
			
			while (true)
			{
				
				pst = step.get(pst.tar.x+","+pst.tar.y+","+pst.tar.z);
				if (pst.org.equals(st))
				{
					_path.add(ed);
					break;
				}
				
				_path.add(0,pst.org);
			}
		}
		else
		{
			//System.out.println("\n findOver");
			int lastCost = Integer.MAX_VALUE;
			pst = step.get(st.x+","+st.y+","+st.z);
			while (true)
			{
				if (lastCost > pst.befCost)
				{
					lastCost = pst.befCost;
				}
				else
				{
					break;
				}
					
				if (pst.org.equals(ed))
					break;
			
				_path.add(pst.org);
			}
		}
		CVec3 bDir=new CVec3();
		CVec3 pos=new CVec3();
		for(int i=0;i<_path.size();++i)
		{
			CVec3 dir=CMath.Vec3MinusVec3(pos, _path.get(i));
			dir=CMath.Vec3Normalize(dir);
			if(bDir.equals(dir))
			{
				if(_path.size()>1)
				_path.remove(i-1);
				i--;
			}
			bDir=dir;
			pos=_path.get(i);
			
		}
//		if(_path.size()>2)
//		{
//			//_path.remove(0);
//			_path.add(0, st);
//		}
		CMolecule.SetFind(false);
		return _path;
	}
	//============================================================
	void PushLight(CVLight _light, Set<Integer> _moleculeStep)
	{
		m_ligVec.add(_light.toCopy());
		var lig=m_ligVec.lastElement();
		CVPick pickOrg=new CVPick();
		pickOrg.SetPos(lig.pos);
		pickOrg.value = lig.power;
		//int count = pickOrg.value * 2;
		Vector<CVPick> find=new Vector<CVPick>();
		Set<Integer> atomStep=new HashSet<Integer>();
		
		
		find.add(pickOrg);
		CAtom startAt = FindCAtom(pickOrg,false);
		if (startAt == null)
			return;
		atomStep.add(startAt.m_offset);
		int k=0;
		while (find.size()> k)
		{
			CVPick pst = find.get(k);
			CAtom at0 = FindCAtom(pst, false);
			_moleculeStep.add(pst.mi.GetMapOffset());
			k++;
			//갈수 없거나 널이 아니면 빛이 움직이지 못함
			if (at0 == null || at0.m_tex != DfV.TexNull)
				continue;
			//빛이 너무 멀리 퍼지면 못함
			if (pst.value <= 0)
				continue;

			
			//6면을 가본다
			CVPick pick[]=new CVPick[6];
			for (int i = 0; i < 6; ++i)
			{
				pick[i] = pst.toCopy();
				pick[i].dir = i;
				if (pick[i].DirToAi())
				{
					CAtom at1 = FindCAtom(pick[i], false);
					if (at1 == null)
						continue;
					//가봤는데 벽이면 라이팅을 입힌다
					if (at1.m_tex != DfV.TexNull)
					{
						
						switch (i)
						{
							case DfV.DFront:
							{
								CVLightData ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, (int)pst.value, lig.global);
								at1.PushLight(ldata, DfV.DBack);
								lig.atomData.add(ldata);
								break;
							}
							case DfV.DBack:
							{
								CVLightData ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, (int)pst.value, lig.global);
								at1.PushLight(ldata, DfV.DFront);
								lig.atomData.add(ldata);
								break;
							}
							case DfV.DLeft:
							{
								CVLightData ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, (int)pst.value, lig.global);
								at1.PushLight(ldata, DfV.DRight);
								lig.atomData.add(ldata);
								break;
							}
							case DfV.DRight:
							{
								CVLightData ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, (int)pst.value, lig.global);
								at1.PushLight(ldata, DfV.DLeft);
								lig.atomData.add(ldata);
								break;
							}
							case DfV.DDown:
							{
								CVLightData ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, (int)pst.value, lig.global);
								at1.PushLight(ldata, DfV.DUp);
								lig.atomData.add(ldata);
								break;
							}
							case DfV.DUp:
							{
								CVLightData ldata=new CVLightData(lig.key, pick[i].mi, pick[i].ai, (int)pst.value, lig.global);
								at1.PushLight(ldata, DfV.DDown);
								lig.atomData.add(ldata);
								break;
							}
						}//switch

					}
					boolean stepChk = true;
					if(atomStep.contains(at1.m_offset))
						stepChk=false;

					if (stepChk)
					{
						pick[i].value -= 1;
						find.add(pick[i]);	
						atomStep.add(at1.m_offset);

					}
						
				}//if

			}//for
			
		}
	}
	CVPick GetGround(CVPick _pick)
	{
		
		CVPick downPick = _pick.toCopy();

		//int range = DfV.LightRangeMax;
		
		for (int j = 0; j < DfV.MapY*DfV.AtomCount; ++j)
		{

			CAtom at1 = FindCAtom(downPick, false);
			
			if (at1.m_tex != DfV.TexNull)
			{
				break;
			}
			downPick.dir = DfV.DDown;
			if (downPick.DirToAi() == false)
				break;

		}
		downPick.dir = DfV.DUp;
		downPick.DirToAi();
		return downPick;
	}
	void RemoveLight(String _key, Set<Integer> _moleculeStep)
	{
		for (int i=0;i< m_ligVec.size();++i)
		{
			if (m_ligVec.get(i).key.equals(_key))
			{
				CVPick pick=new CVPick();
				pick.SetPos(m_ligVec.get(i).pos);
				_moleculeStep.add(pick.mi.GetMapOffset());
				for (var each1 : m_ligVec.get(i).atomData)
				{
					CVPick atomPick=new CVPick();
					atomPick.ai = each1.ai.toCopy();
					atomPick.mi = each1.mi.toCopy();
					CAtom  atom2 = FindCAtom(atomPick, false);
					atom2.RemoveLight(m_ligVec.get(i).key);
				}
				m_ligVec.get(i).atomData.clear();
				m_ligVec.remove(i);
				break;
			}
			
		}
		
	}
	void UpdateStep(Set<Integer> _moleculeStep)
	{
		for (var each0 : _moleculeStep)
		{
			CMolecule mo = FindCMolecule(new CVIndex(each0));
			mo.AtomUpdate();
		}
	}
	CVLight FindLight(String _key)
	{
		for (var  each0 : m_ligVec)
		{
			if (each0.key.equals(_key))
			{
				return each0;
			}
		}

		return null;
	}
	void LightResetVecCac(CMolecule _mo, Vector<CVLight> _list)
	{
		
		for (var each0 : m_ligVec)
		{
			float ra = _mo.m_bound.GetOutRadius();
			CVec3 mCen = _mo.m_mat.GetPos();
			mCen.x += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.y += DfV.AtomCount * 0.5*DfV.AtomSize;
			mCen.z += DfV.AtomCount * 0.5*DfV.AtomSize;

			float len = CMath.Vec3Lenght(CMath.Vec3MinusVec3(mCen, each0.pos));
			if (len <= each0.power*DfV.AtomSize)
			{
				CVLight lig=new CVLight();
				lig = each0.toCopy();
				boolean push = true;
				for (var each1 : _list)
				{
					if (each1.key.equals(lig.key))
					{
						push = false;
						break;
					}
				}
				if(push)
					_list.add(lig);
				
			}

		}
	}
	void ResetLight(String _key, Set<Integer> _moleculeStep)
	{
		CVLight lit = FindLight(_key).toCopy();
		
		RemoveLight(_key, _moleculeStep);
		PushLight(lit, _moleculeStep);
	}
	void SetGlobalLight(float _val)
	{
		Vector<CVLight> resetLight=new Vector<CVLight>();
		m_global = _val;
		for (var each0 : m_obj.values())
		{
			
			CMolecule each1 = (CMolecule)each0;
			LightResetVecCac(each1, resetLight);
		}

		
		
		Set<Integer> dummy=new HashSet<Integer>();
		for (var each0 : resetLight)
		{
			RemoveLight(each0.key, dummy);
			PushLight(each0, dummy);
		}
		UpdateStep(dummy);
	}
};

public class CVoxel 
{

}
