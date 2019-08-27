class FbxData
{
	constructor()
	{
		this.type=0;
		this.vStr="";
		this.vInt=0;
		this.vLong=0;
		this.vChar="";
		this.vDb=0;
		this.vBool=false;
		this.vVec3=new CVec3();
		this.vAddr=0;
	}
	
	toCopy()
	{
		var dummy=new FbxData();
		dummy.type=this.type;
		dummy.vStr=this.vStr;
		dummy.vInt=this.vInt;
		dummy.vLong=this.vLong;
		dummy.vChar=this.vChar;
		dummy.vDb=this.vDb;
		dummy.vBool=this.vBool;
		dummy.vVec3=this.vVec3.toCopy();
		dummy.vAddr=this.vAddr;
		
		return dummy; 
	}
};

class FbxProperty
{
	constructor()
	{
		this.endOff=0;//이 라인이 끝나는 지점
		this.numProperties=0;//프로펄티 곗수
		this.PropertyListLen=0;//프로펄티 읽는 라인수
		this.nameLen=0;//이름 길이
		this.name="";
	}
	toCopy()
	{
		var dummy=new FbxProperty();
		dummy.endOff=this.endOff;
		dummy.numProperties=this.numProperties;
		dummy.PropertyListLen=this.PropertyListLen;
		dummy.nameLen=this.nameLen;
		dummy.name=this.name;
		
		return dummy;
	}
	
};
function d_PAIR_STR_MATER(_first,_second)
{
	this.first=_first;
	this.second = _second;
};
function d_PAIR_STR_STR(_first,_second)
{
	
	this.first = _first;
	this.second = _second;
};
function d_PAIR_STR_MCI(_first,_second)
{
	this.first = _first;
	this.second = _second;	
};

class Cluster
{
	constructor()
	{
		this.pname="";
		this.name="";
		this.boneIndex=0;
		this.index=new Array();
		this.weight=new Array();
		this.linkMat=new CMat();
	}
	
	//CVec3 linkPos;
};
class WDfConnect
{
	constructor()
	{
		this.Model=0;
		this.Geometry = 1;
		this.Texture = 2;
		this.Material = 3;
		this.ModelGeometry = 4;
		this.Skin = 5;
		this.Cluster = 6;
		this.Null = 7;
	}
};
var DfConnect=new WDfConnect();
class Connection
{
	constructor(_key,_type,_data)
	{
		this.key = _key;
		this.type = _type;
		this.data = _data;
	}
};

var Dfnext=13;
var DfyAxis = true;

class CParserFbx extends CParser
{
	constructor()
	{
		super();
		this.m_path = "resFile/";
		
		this.m_mesh=null;
		
		this.m_conMap=new Map();
		this.m_properties=new Map();
		
		
		this.mpar_fbxVersion=0;
		this.m_data=new FbxData();
		this.m_property=new FbxProperty();
	}
	ReadFData()
	{
		this.m_data.type = this.ReadChar();
		switch (this.m_data.type)
		{
		case 100:	
			this.m_data.vInt = this.ReadInt32();
			this.ReadInt32();
			this.m_data.vAddr = this.ReadInt32();
			break;
		case 105:	
			this.m_data.vInt = this.ReadInt32();
			this.ReadInt32();
			this.m_data.vAddr = this.ReadInt32();
			break;
		
		case 73:	this.m_data.vInt = this.ReadInt32();	break;
		case 68:	this.m_data.vDb = this.ReadDouble();	break;
		case 67:	this.m_data.vChar = this.ReadChar();	break;
		case 83:
		{
			var L_len = this.ReadInt32();
			this.m_data.vStr = this.ReadString(L_len);
		}
		break;
		case 76:	this.m_data.vLong = this.ReadInt64();	break;
		default:
			CMsg.E("파싱 꼬임");
		}
	}
	ReadProperty()
	{
		if (7500 < this.mpar_fbxVersion)
		{
			this.m_property.endOff = this.ReadInt64();
			this.m_property.numProperties = this.ReadInt64();
			this.m_property.PropertyListLen = this.ReadInt64();
			this.m_property.nameLen = this.ReadChar();

			this.m_property.name = this.ReadString(this.m_property.nameLen);
		}
		else
		{
			this.m_property.endOff = this.ReadInt32();
			this.m_property.numProperties = this.ReadInt32();
			this.m_property.PropertyListLen = this.ReadInt32();
			this.m_property.nameLen = this.ReadChar();

			this.m_property.name = this.ReadString(this.m_property.nameLen);
		}

	}
	ReadProperties(_pro)
	{
		this.m_properties.clear();
		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			this.ReadProperty();
			this.ReadFData();
			var tag = this.m_data.vStr;
			this.ReadFData();
			var type = this.m_data.vStr;
			this.ReadFData();
			if (this.mpar_fbxVersion >= 7400)
				this.ReadFData();
			if (type.equals("bool") || type.equals("Bool"))
			{
				this.m_data.vBool = this.m_data.vBool;

			}
			else if (type.equals("Vector3D") || type.equals("Lcl Translation") || type.equals("Lcl Rotation") ||
				type.equals("Lcl Scaling") || type.equals("ColorRGB") || type.equals("Color"))
			{
				var vec3=new CVec3();
				this.ReadFData();
				vec3.x = this.m_data.vDb;
				this.ReadFData();
				vec3.y = this.m_data.vDb;
				this.ReadFData();
				vec3.z = this.m_data.vDb;
				this.m_data.vVec3 = vec3;
			}
			else if (type.equals("enum") || type.equals("double") || type.equals("object") || type.equals("int") ||
				type.equals("Visibility") || type.equals("KString") || type.equals("Number"))
			{
				//m_data.Bool = m_data.Bool;
			}
			else
				CMsg.E("미정의");
			this.m_properties.set(tag,this.m_data.toCopy());

			this.SetOffset(this.m_property.endOff);
		}
		this.SetOffset(_pro.endOff);
	}
	Load(pa_fileName)
	{
		this.m_path= pa_fileName.substr(0, pa_fileName.lastIndexOf("/"))+"/";
		if (this.Open(pa_fileName))
			return;


		if (this.ReadString(18).equals("Kaydara FBX Binary") == false)
		{
			CMsg.E("only support binary");
			return;
		}
		this.m_mesh = new CMesh();
		this.SetOffset(this.GetOffset() + 9);


		this.MPar_BPasing();

		CRes.set(this.m_fileName, this.m_mesh);
		this.m_mesh.weightCopyMat=new Float32Array(this.m_mesh.weightName.size()*4*4);

	}
	MPar_BPasing()
	{

		while (this.m_buffer.size() > this.m_pstOff)
		{
			this.ReadProperty();
			if (this.m_property.name.equals("FBXHeaderExtension"))
				this.MPar_BFBXHeaderExtension(this.m_property.toCopy());
			else if (this.m_property.name.equals("Objects"))
				this.MPar_BObjects(this.m_property.toCopy());
			else if (this.m_property.name.equals("Connections"))
				this.MPar_BConnections(this.m_property.toCopy());
			else if (this.m_property.name.equals("Takes"))
				this.MPar_Takes(this.m_property.toCopy());
			else
			{
				if (this.m_property.endOff == 0)
					break;
				this.SetOffset(this.m_property.endOff);

			}
		}



	}
	
	
	ReadPropertyData()
	{
		var tag="";
		this.ReadProperty();
		this.ReadFData();
		tag = this.m_data.vStr;
		this.ReadFData();
		var type = this.m_data.vStr;
		this.ReadFData();

		if (type.equals("bool") || type.equals("Bool"))
		{
			this.m_data.vBool = this.m_data.vBool;
		}
		else if (type.equals("Vector3D") || type.equals("Lcl Translation") || type.equals("Lcl Rotation") ||
			type.equals("Lcl Scaling") || type.equals("ColorRGB") || type.equals("Color"))
		{
			var vec3=new CVec3();
			this.ReadFData();
			vec3.x = this.m_data.vDb;
			this.ReadFData();
			vec3.y = this.m_data.vDb;
			this.ReadFData();
			vec3.z = this.m_data.vDb;
			this.m_data.vVec3 = vec3;
		}
		else if (type.equals("enum") || type.equals("double") || type.equals("object") || type.equals("int") ||
			type.equals("Visibility") || type.equals("KString") || type.equals("Number"))
		{
			//m_data.Bool = m_data.Bool;
		}
		else
			CMsg.E("미정의");
		return tag;
	}
	
	
	MPar_BFBXHeaderExtension(_pro)
	{
		this.ReadProperty();
		if (this.m_property.name.equals("FBXHeaderVersion") == false)
		{
			CMsg.E("파싱 이상함");
			return;
		}
		this.ReadFData();
		this.ReadProperty();
		this.ReadFData();
		this.mpar_fbxVersion = this.m_data.vInt;
		if (7500 < this.mpar_fbxVersion)
			Dfnext = 25;
		this.ReadProperty();
		this.SetOffset(_pro.endOff);
	}
	MPar_BObjects(_pro)
	{
		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			this.ReadProperty();
			if (this.m_property.name.equals("Model"))
			{
				if (this.mpar_fbxVersion == 6100)
				{

					this.MPar_BModel(this.m_property.toCopy());


				}
				else if (this.mpar_fbxVersion == 7400)
				{
					this.Model7400(m_property.toCopy());
				}
				else
					CMsg.E("not support fbx version!");
			}
			else if (this.m_property.name.equals("Geometry"))
			{
				this.Geometry7400(m_property.toCopy());
			}
			else if (this.m_property.name.equals("Deformer"))
			{
				this.ReadFData();
				var name = this.m_data.vStr;
				this.ReadFData();
				var type = this.m_data.vStr;

				if (this.m_data.vStr.equals("Cluster"))
				{
					var skin = new Cluster();
					skin.name = name;
					skin.pname = type;
					
					var otherBone=false;
					var name = skin.name.substr(skin.name.indexOf(" ") + 1, skin.name.length - skin.name.indexOf(" "));
					var otherName="";
					//두개에 매쉬가 있을경우 nctl이상한게 생기는데 처리용
					if (name.indexOf("_") != -1)
					{
						otherBone = true;
						otherName = name.substr(0, name.indexOf("_"));
					}
						
					
					var wm=new CWeightMat();
					skin.boneIndex = this.m_mesh.weightName.size();
					this.m_mesh.weightName.push_back(name);
					this.m_mesh.weightMat.push_back(wm);
					if (otherBone)
					{
						for (var i = 0; i < this.m_mesh.weightName.size(); ++i)
						{
							if (this.m_mesh.weightName[i].equals(otherName))
							{
								this.m_mesh.weightMat[i].target.push_back(skin.boneIndex);
								break;
							}
						}
					}
					if (this.m_mesh.weightName.size() > MeshBoneMax)
					{
						CMsg.E("weightMat Bone Max!!");
					}
					var con=new Connection(skin.name, DfConnect.Cluster, skin);
					this.m_conMap.set(skin.name,con);
					this.MPar_Skin(this.m_property.toCopy(), skin);
					this.m_mesh.weightMat[skin.boneIndex].mat = skin.linkMat;
					
					

				}
				else
				{
					var con=new Connection(name, DfConnect.Skin, null);
					this.m_conMap.set(name,con);

					this.SetOffset(this.m_property.endOff);
				}
				
			}
			else if (this.m_property.name.equals("Texture"))
			{
				this.ReadFData();
				var name="";
				if (this.mpar_fbxVersion >= 7400)
				{
					name = this.m_data.vLong+""; this.ReadFData(); this.ReadFData();
				}
				else
				{
					name = this.m_data.vStr; this.ReadFData();
				}
				
				var end = this.m_property.endOff;
				while (end - Dfnext > this.m_pstOff)
				{
					this.ReadProperty();
					if (this.m_property.name.equals("FileName"))
					{
						this.ReadFData();

						var fName = this.m_data.vStr.replaceAll("\\", "/");

						var st = fName.lastIndexOf("/");
						if (st != -1)
						{
							st += 1;
							fName = fName.substr(st, fName.length - st);
						}

						var con=new Connection(name, DfConnect.Texture, "");
						con.data = this.m_path + fName;
						this.m_conMap.set(name,con);
					}
					else
						this.SetOffset(this.m_property.endOff);
				}
				this.ReadProperty();
			}
			else if (this.m_property.name.equals("Material"))
			{
				this.ReadFData();
				var name="";
				if (this.mpar_fbxVersion >= 7400)
				{
					name = this.m_data.vLong+""; this.ReadFData(); this.ReadFData();
				}
				else
				{
					name = this.m_data.vStr; this.ReadFData();
				}
				
				var end = this.m_property.endOff;
				while (end - Dfnext > this.m_pstOff)
				{
					this.ReadProperty();
					if (this.m_property.name.equals("Properties60") || this.m_property.name.equals("Properties70"))
					{
						var mater = new CMaterial();
						this.ReadProperties(this.m_property.toCopy());
						mater.ambient = this.m_properties.get("AmbientColor").vVec3;
						mater.diffuse = this.m_properties.get("DiffuseColor").vVec3;
						mater.power = this.m_properties.get("DiffuseFactor").vDb;
						mater.diffuse = this.m_properties.get("Specular").vVec3;

						var con=new Connection(name, DfConnect.Material, mater);

						this.m_conMap.set(name,con);


					}
					else
						this.SetOffset(this.m_property.endOff);
				}
				this.ReadProperty();
			}


			else
			{
				this.SetOffset(this.m_property.endOff);
			}
		}
		this.ReadProperty();
	}
	Geometry7400(_pro)
	{
		CMsg.E("web not def");
	}
	Model7400()
	{
		CMsg.E("web not def");
	}
	MPar_BModel(_pro)
	{
		var L_mb = new CMeshCreateInfo();
		this.ReadFData();
		L_mb.name = this.m_data.vStr; this.ReadFData();
		this.m_mesh.uvIndexMode = true;

		this.ReadProperty(); this.ReadFData();//버전 정보

		this.ReadProperty();//Properties60
		this.ReadProperties(this.m_property.toCopy());
		
		L_mb.pos = this.m_properties.get("Lcl Translation").vVec3;
		if (DfyAxis == true)
		{
			var dummy = L_mb.pos.y;
			L_mb.pos.y = L_mb.pos.z;
			L_mb.pos.z = dummy;
		}
		var rot = this.m_properties.get("Lcl Rotation").vVec3;
		if (DfyAxis == true)
		{
			rot.x = -rot.x;
			var dummy = rot.y;
			rot.y = -rot.z;
			rot.z = -dummy;
		}
		L_mb.rot.x = CMath.DegreeToRadian(rot.x);
		L_mb.rot.y = CMath.DegreeToRadian(rot.y);
		L_mb.rot.z = CMath.DegreeToRadian(rot.z);

		L_mb.sca = this.m_properties.get("Lcl Scaling").vVec3;




		this.ReadProperty(); this.ReadFData();//MultiLayer
		this.ReadProperty(); this.ReadFData();//MultiTake
		this.ReadProperty(); this.ReadFData();//Shading
		this.ReadProperty(); this.ReadFData();//Culling


		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			this.ReadProperty();
			if (this.m_property.name.equals("Vertices"))
			{
				end = this.m_property.endOff;
				while (end > this.m_pstOff)
				{
					var vertex=new CVec3();
					this.ReadFData(); vertex.x = this.m_data.vDb;
					this.ReadFData(); vertex.y = this.m_data.vDb;
					this.ReadFData(); vertex.z = this.m_data.vDb;
					if (DfyAxis)
					{
						var dummy = vertex.y;
						vertex.y = vertex.z;
						vertex.z = dummy;
					}
					L_mb.vertex.Push(vertex);
				}

			}
			else if (this.m_property.name.equals("PolygonVertexIndex"))
			{
				end = this.m_property.endOff;
				while (end > this.m_pstOff)
				{
					var i0=0, i1=0, i2=0;
					this.ReadFData();
					if (this.m_data.vInt < 0)
						i0 = -this.m_data.vInt - 1;
					else
						i0 = this.m_data.vInt;
					this.ReadFData();
					if (this.m_data.vInt < 0)
						i1 = -this.m_data.vInt - 1;
					else
						i1 = this.m_data.vInt;
					this.ReadFData();
					if (this.m_data.vInt < 0)
						i2 = -this.m_data.vInt - 1;
					else
						i2 = this.m_data.vInt;

					if (DfyAxis)
					{
						var dummy = i1;
						i1 = i2;
						i2 = dummy;
					}

					L_mb.index.push_back(i0);
					L_mb.index.push_back(i1);
					L_mb.index.push_back(i2);

				}

			}
			else if (this.m_property.name.equals("LayerElementNormal"))
			{
				this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty();
				end = this.m_property.endOff;
				while (end - Dfnext > this.m_pstOff)
				{
					var vertex=new CVec3();
					this.ReadFData(); vertex.x = this.m_data.vDb;
					this.ReadFData(); vertex.y = this.m_data.vDb;
					this.ReadFData(); vertex.z = this.m_data.vDb;
					if (DfyAxis)
					{
						var dummy = vertex.y;
						vertex.y = vertex.z;
						vertex.z = dummy;
					}
					L_mb.normal.Push(vertex);
				}
				this.ReadProperty();
				CMath.PolygonNormalToVertexNormal(L_mb.normal, L_mb.index, L_mb.vertex.size());
			}
			else if (this.m_property.name.equals("LayerElementUV"))
			{
				this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var utype = this.m_data.vStr;
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty();
				
				if (L_mb.uv.Empty() == false)
				{
					CMsg.E("only uv channel one!!!");
					L_mb.uv.Clear();
					L_mb.uvIndex.clear();
				}
				
				
				end = this.m_property.endOff;
				while (end > this.m_pstOff)
				{
					var uv=new CVec2();
					this.ReadFData(); uv.x = this.m_data.vDb;
					this.ReadFData(); uv.y = this.m_data.vDb;
					
					if (DfyAxis)
					{
						if (uv.y < 1.0 && this.m_mesh.uvRevers==false)
							uv.y = 1.0 - uv.y;
						else
							uv.y = -uv.y;
					}
					if (uv.y > 1.0 || uv.x > 1.0)
						this.m_mesh.uvRevers = true;
					L_mb.uv.Push(uv);

				}
				if (utype.equals("ByPolygonVertex"))
				{
					this.ReadProperty();
					end = this.m_property.endOff;
					//int index = 0;
					while (end - Dfnext > this.m_pstOff)
					{
						this.ReadFData(); L_mb.uvIndex.push_back(this.m_data.vInt);
						var dummy=0;
						this.ReadFData(); dummy = this.m_data.vInt;
						this.ReadFData(); L_mb.uvIndex.push_back(this.m_data.vInt);
						L_mb.uvIndex.push_back(dummy);
					}
				}
				this.ReadProperty();
			}
			else if (this.m_property.name.equals("LayerElementTexture") ||
					this.m_property.name.equals("LayerElementSpecularFactorTextures") ||
					this.m_property.name.equals("LayerElementNormalMapTextures"))
				{
					var off = 0;
					if (this.m_property.name.equals("LayerElementSpecularFactorTextures"))
						off = 1;
					else if (this.m_property.name.equals("LayerElementNormalMapTextures"))
						off = 2;
					if (off == 0)
					{
						var size=L_mb.index.size()/3;
						for (var i = 0; i < size; ++i)
						{

							L_mb.texOff.Push(new CVec3(-1,-1,-1));
						}
					}
						
					this.ReadFData();
					this.ReadProperty(); this.ReadFData();
					this.ReadProperty(); this.ReadFData();
					this.ReadProperty(); this.ReadFData();
					this.ReadProperty(); this.ReadFData();
					this.ReadProperty(); this.ReadFData();
					this.ReadProperty(); this.ReadFData();
					this.ReadProperty();
					var tadd = 0;
					var end = this.m_property.endOff;
					while (end > this.m_pstOff)
					{
						this.ReadFData();
						if (off == 0)
							L_mb.texOff.X3(tadd, CMath.Abs(m_data.vInt));
						else if (off == 1)
							L_mb.texOff.Y3(tadd, CMath.Abs(m_data.vInt));
						else if (off == 2)
							L_mb.texOff.Z3(tadd, CMath.Abs(m_data.vInt));
						tadd++;
					}
					if (tadd == 1)
					{
						for (var i = 1; i < L_mb.texOff.size(); ++i)
						{
							if (off == 0)
								L_mb.texOff.X3(i, L_mb.texOff.X3(0));
							else if (off == 1)
								L_mb.texOff.Y3(i, L_mb.texOff.Y3(0));
							else if (off == 2)
								L_mb.texOff.Z3(i, L_mb.texOff.Z3(0));
						}
					}
					this.ReadProperty();
				}
			else
				this.SetOffset(this.m_property.endOff);
		}
		var con=new Connection(L_mb.name, DfConnect.ModelGeometry, L_mb);
		this.m_conMap.set(L_mb.name,con);
		this.ReadProperty();

	}
	MPar_BConnections(_pro)
	{
		var pairVec=new Array();
		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			var pass = true;
			this.ReadProperty();
			this.ReadFData();
			this.ReadFData();
			var fname="", sname="";
			if (7400 <= this.mpar_fbxVersion)
				fname = this.m_data.vLong+"";
			else
				fname = this.m_data.vStr;
			this.ReadFData();
			if (7400 <= this.mpar_fbxVersion)
				sname = this.m_data.vLong;
			else
				sname = this.m_data.vStr;
			
			if (this.m_conMap.get(fname).type == DfConnect.Geometry)
			{
				CMsg.E("나중에 코딩 마무리 해라 하다가 말았다");
			}
			else if (this.m_conMap.get(fname).type == DfConnect.ModelGeometry)
			{
				var con = this.m_conMap.get(sname);
				if (con!=null && con.type == DfConnect.Cluster)
				{

				}
				else
				{
					var node=null;
					if (this.m_mesh.meshTree.find(sname) == null)
					{
						if (this.m_mesh.meshTree.m_root.key.isEmpty())
						{
							this.m_mesh.meshTree.m_root.key = fname;
							node = this.m_mesh.meshTree.m_root;
							
						}
						else
						{
							node = this.m_mesh.meshTree.m_root;
							node = node.colleagueAdd(fname);
						}

					}
					else
					{
						node = this.m_mesh.meshTree.find(sname);
						node = node.childeAdd(fname);
					}
					node.data=new CMeshData();
					node.data.ci = this.m_conMap.get(fname).data;
				}


			}
			else if (this.m_conMap.get(fname).type == DfConnect.Texture)
			{
				var node=null;
				node = this.m_mesh.meshTree.find(sname);
				//vidio는 널이다
				if (node != null)
				{
					var tex = this.m_conMap.get(fname).data;
					var off = 0;
					for (var i = 0; i < this.m_mesh.texture.size(); ++i)
					{
						if (this.m_mesh.texture[i].equals(tex))
						{
							off = i;
							break;
						}
					}
					if (off == 0)
					{
						this.m_mesh.texture.push_back(tex);
						off = this.m_mesh.texture.size() - 1;
					}
					node.data.textureOff.push_back(off);
				}

			}
			else if (this.m_conMap.get(fname).type == DfConnect.Skin)
			{
				pairVec.push_back(new d_PAIR_STR_MCI(fname, this.m_conMap.get(sname).data));
			}
			else if (this.m_conMap.get(fname).type == DfConnect.Cluster)
			{
				for (var i = 0; i < pairVec.size(); ++i)
				{
					if (pairVec[i].first.equals(sname))
					{
						var skin = this.m_conMap.get(fname).data;
						var cp = pairVec[i].second;
						if (cp.weight.Empty())
						{

							for (var w = 0; w < cp.vertex.Size(3); ++w)
							{
								cp.weightIndex.Push(new CVec4(0,0,0,0));
								cp.weight.Push(new CVec4(0,0,0,0));
							
							}
						}

						//static map<int, CMatTest> testMap;
						for (var s = 0; s < skin.index.size(); ++s)
						{
							for (var w = 0; w < 5; ++w)
							{
								if (w == 5)
									CMsg.E("가중치 오류");
								if (cp.weight.GetOff(skin.index[s],w) == 0)
								{
									cp.weight.SetOff(skin.index[s],w, skin.weight[s]);
									cp.weightIndex.SetOff(skin.index[s],w, skin.boneIndex);
									break;
								}
							}


						}

						break;


					}
				}
			}
			

			this.SetOffset(this.m_property.endOff);

		}

		this.ReadProperty();
	}
	MPar_Takes(_pro)
	{
		this.ReadProperty(); this.ReadFData();
		var stTime=0;
		var edTime=0;
		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			this.ReadProperty(); this.ReadFData();
			if (this.m_property.name.equals("Take"))
			{
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				stTime = this.m_data.vLong;
				this.ReadFData();
				edTime = this.m_data.vLong;
				this.ReadProperty(); this.ReadFData(); this.ReadFData();

				while (_pro.endOff - Dfnext > this.m_pstOff)
				{
					this.ReadProperty();
					if (this.m_property.name.equals("Model"))
						this.MPar_TakesAni(this.m_property.toCopy());
					else
						break;
				}
				this.ReadProperty();

			}

		}
	}
	MPar_TakesAni(_pro)
	{
		this.ReadFData();
		this.ReadProperty(); this.ReadFData();
		var node = this.m_mesh.meshTree.find(this.m_data.vStr);
		if (node == null)
		{
			CMsg.E("파싱 순서가 꼬임. 주석참고error");
			//애니메이션 모델을 먼저 로딩하고 그걸 저장한다음에 다시 파싱해라
			//지금 모델이 뒤늣게 파싱해서 그게 없어서 널이다.
			//그럼 현재 로딩후 저장후 그다음 마지막에 애니를 합쳐주면 된다
			//지금은 귀찬아서 20190212
			return;
		}
		this.ReadProperty(); this.ReadFData();
		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			this.ReadProperty();
			if (this.m_property.name.equals("Channel"))
				this.ReadFData();
			else
				continue;
			if (this.m_data.vStr.equals("T"))
			{
				this.ReadProperty(); this.ReadFData();//X
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;

				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{
					var keyframe=new CKeyFrame();
					this.ReadFData();
					keyframe.key = this.m_data.vLong;

					this.ReadFData();
					keyframe.value.x = this.m_data.vDb;
					this.AniFrameNext();


					node.data.keyFramePos.push_back(keyframe);


				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty();//}

				this.ReadProperty(); this.ReadFData();//Y
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;
				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{

					this.ReadFData();
					var keyframe = node.data.FindKeyFrame(this.m_data.vLong, node.data.keyFramePos);
					this.ReadFData();
					keyframe.value.y = this.m_data.vDb;
					this.AniFrameNext();
				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty();

				this.ReadProperty(); this.ReadFData();//Z
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;
				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{
					this.ReadFData();
					var keyframe = node.data.FindKeyFrame(this.m_data.vLong, node.data.keyFramePos);
					this.ReadFData();
					keyframe.value.z = this.m_data.vDb;
					this.AniFrameNext();
				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty(); //R
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty();

				
				for (var each0 of node.data.keyFramePos)
				{
					if (DfyAxis)
					{
						
						var dummy = each0.value.y;
						each0.value.y = each0.value.z;
						each0.value.z = dummy;
					}


					//each0.value.x -= node.data.ci.pos.x;
					//each0.value.y -= node.data.ci.pos.y;
					//each0.value.z -= node.data.ci.pos.z;
				}
				
			}
			else if (this.m_data.vStr.equals("R"))
			{
				this.ReadProperty(); this.ReadFData();//X
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;

				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{

					var keyframe=new CKeyFrame();
					this.ReadFData();
					keyframe.key = this.m_data.vLong;

					this.ReadFData();
					keyframe.value.x = this.m_data.vDb;
					this.AniFrameNext();
					node.data.keyFrameRot.push_back(keyframe);


				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty();//}

				this.ReadProperty(); this.ReadFData();//Y
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;
				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{

					this.ReadFData();
					var keyframe = node.data.FindKeyFrame(this.m_data.vLong, node.data.keyFrameRot);
					this.ReadFData();
					keyframe.value.y = this.m_data.vDb;
					this.AniFrameNext();
				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty();

				this.ReadProperty(); this.ReadFData();//Z
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;
				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{
					this.ReadFData();
					var keyframe = node.data.FindKeyFrame(this.m_data.vLong, node.data.keyFrameRot);
					this.ReadFData();
					keyframe.value.z = this.m_data.vDb;
					this.AniFrameNext();
				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty(); //R
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty();

				for (var each0 of node.data.keyFrameRot)
				{
					each0.value.x = CMath.DegreeToRadian(each0.value.x);
					each0.value.y = CMath.DegreeToRadian(each0.value.y);
					each0.value.z = CMath.DegreeToRadian(each0.value.z);

					if (DfyAxis)
					{
						each0.value.x = -each0.value.x;
						var dummy = each0.value.y;
						each0.value.y = -each0.value.z;
						each0.value.z = -dummy;

						/*each0.value.x -= node.data.ci.rot.x;
						each0.value.y -= node.data.ci.rot.y;
						each0.value.z -= node.data.ci.rot.z;*/
					}



					//each0.value = CMath.EulerToQut(CVec3(each0.value.x, each0.value.y, each0.value.z));
				}
			}
			else if (this.m_data.vStr.equals("S"))
			{
				this.ReadProperty(); this.ReadFData();//X
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;

				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{

					var keyframe=new CKeyFrame();
					this.ReadFData();
					keyframe.key = this.m_data.vLong;

					this.ReadFData();
					keyframe.value.x = this.m_data.vDb;
					this.AniFrameNext();
					node.data.keyFrameSca.push_back(keyframe);

				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty();//}

				this.ReadProperty(); this.ReadFData();//Y
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;
				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{

					this.ReadFData();
					var keyframe = node.data.FindKeyFrame(this.m_data.vLong, node.data.keyFrameSca);
					this.ReadFData();
					keyframe.value.y = this.m_data.vDb;
					this.AniFrameNext();
				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty();

				this.ReadProperty(); this.ReadFData();//Z
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty(); this.ReadFData();
				var count = this.m_data.vInt;
				this.ReadProperty();
				for (var i = 0; i < count; ++i)
				{
					this.ReadFData();
					var keyframe = node.data.FindKeyFrame(this.m_data.vLong, node.data.keyFrameSca);
					this.ReadFData();
					keyframe.value.z = this.m_data.vDb;
					this.AniFrameNext();
				}
				this.ReadProperty(); this.ReadFData(); this.ReadFData(); this.ReadFData();
				this.ReadProperty(); //R
				this.ReadProperty(); this.ReadFData();
				this.ReadProperty();
				if (DfyAxis)
				{
					for (var each0 of node.data.keyFrameSca)
					{
						var dummy = each0.value.y;
						each0.value.y = each0.value.z;
						each0.value.z = dummy;
					}

				}
			}
			//ReadProperty();
		}//T
		this.ReadProperty();
	}

	MPar_Skin(_pro,_skin)
	{
		while (_pro.endOff - Dfnext > this.m_pstOff)
		{
			this.ReadProperty();
			if (this.m_property.name.equals("Indexes"))
			{
				var end = this.m_property.endOff;
				while (end > this.m_pstOff)
				{

					this.ReadFData();
					_skin.index.push_back(this.m_data.vInt);
				}
			}
			else if (this.m_property.name.equals("Weights"))
			{
				var end = this.m_property.endOff;
				while (end > this.m_pstOff)
				{

					this.ReadFData();
					_skin.weight.push_back(this.m_data.vDb);
				}
			}
			else if (this.m_property.name.equals("Transform"))
			{
				var end = this.m_property.endOff;

				for (var y = 0; y < 4; ++y)
				{
					for (var x = 0; x < 4; ++x)
					{
						this.ReadFData();
						_skin.linkMat.arr[y][x] = this.m_data.vDb;
					}
				}
			
				var org = _skin.linkMat.toCopy();
				var tar = _skin.linkMat;
			

				tar.arr[0][0]= org.arr[0][0];
				tar.arr[0][2] = org.arr[0][1];
				tar.arr[0][1] = org.arr[0][2];

				tar.arr[2][0] = org.arr[1][0];
				tar.arr[2][2] = org.arr[1][1];
				tar.arr[2][1] = org.arr[1][2];

				tar.arr[1][0] = org.arr[2][0];
				tar.arr[1][2] = org.arr[2][1];
				tar.arr[1][1] = org.arr[2][2];

				tar.arr[3][0] = org.arr[3][0];
				tar.arr[3][2] = org.arr[3][1];
				tar.arr[3][1] = org.arr[3][2];

				

				


				//mpar_skinCtin.back().linkMat = CMath.MatInvert(mpar_skinCtin.back().linkMat);
			}
			else
				this.SetOffset(this.m_property.endOff);
		}
		this.SetOffset(_pro.endOff);
	}
	AniFrameNext()
	{
		var pOn = false;
		while (true)
		{
			this.m_data.vChar = 0;
			this.ReadFData();
			if (this.m_data.vChar == 97)
			{
				this.ReadFData();
				if (this.m_data.vChar == 110)
					break;
				this.ReadFData();
				if(pOn)
					this.ReadFData();

				break;//a에서 끝나는게 있다 함부로 지우지 마라!
			}
			else if (this.m_data.vChar == 76)
				break;
			else if (this.m_data.vChar == 110)
				break;
			else if (this.m_data.vChar == 112)
				pOn = true;
			else if (this.m_data.vChar == 114)
			{
				this.ReadFData();
				break;
			}

		}

	}
}