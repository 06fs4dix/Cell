package cell;

import java.util.Vector;


class CReinforce implements ISerialize {
	int m_max = 0;
	int m_one = 0;
	int m_two = 0;
	int m_three = 0;
	double m_rate = 0;
	CAbility m_ability = new CAbility();// 능력치

	void Reset() {
		m_ability.m_FIA = 0;
		m_ability.m_ELA = 0;
		m_ability.m_ICA = 0;
		m_ability.m_POA = 0;
		m_ability.m_FID = 0;
		m_ability.m_ELD = 0;
		m_ability.m_ICD = 0;
		m_ability.m_POD = 0;
	}

	void toCopy(CReinforce _val) {
		this.m_max = _val.m_max;
		this.m_one = _val.m_one;
		this.m_two = _val.m_two;
		this.m_three = _val.m_three;
		this.m_rate = _val.m_rate;
		this.m_ability = _val.m_ability;
	}

	public CPacket Serialize() {
		CPacket pac = new CPacket();
		pac.name = "CReinforce";
		pac.Push(m_max);
		pac.Push(m_one);
		pac.Push(m_two);
		pac.Push(m_three);
		pac.Push(m_rate);
		pac.Push(m_ability);
		return pac;
	}

	public void Deserialize(String _str) {
		CPacket pac = new CPacket();
		pac.Deserialize(_str);
		m_max = Integer.parseInt(pac.value.get(0));
		m_one = Integer.parseInt(pac.value.get(1));
		m_two = Integer.parseInt(pac.value.get(2));
		m_three = Integer.parseInt(pac.value.get(3));
		m_rate = Double.parseDouble(pac.value.get(4));
		m_ability.Deserialize(pac.value.get(5));
	}
}

class CItemInfo implements ISerialize {
	int m_offset;
	String m_name;
	String m_img;
	String m_text;
	int m_type;// 종류
	CAbility m_ability;
	int m_gold;
	double m_dropRate = 0;
	Vector<Integer> m_putOnType = new Vector<Integer>();
	int m_level = 0;

	int m_skill;
	int m_set;
	CReinforce m_reinforce = null;

	int m_dropMinLevel;
	int m_dropMaxLevel;
	int m_durabilityMax = -1;
	boolean m_discount=false;

	public CPacket Serialize() {
		CPacket pac = new CPacket();
		pac.name = "CItemInfo";
		pac.Push(m_offset);
		pac.Push(m_name);
		pac.Push(m_img);
		pac.Push(m_text);
		pac.Push(m_type);
		pac.Push(m_gold);
		pac.Push(m_dropRate);
		if (m_ability == null)
			pac.Push("null");
		else
			pac.Push(m_ability);
		pac.Push(m_putOnType);
		pac.Push(m_level);

		pac.Push(m_skill);
		pac.Push(m_set);
		pac.Push(m_reinforce);

		pac.Push(m_dropMinLevel);
		pac.Push(m_dropMaxLevel);

		pac.Push(m_durabilityMax);
		pac.Push(m_discount);
		
		return pac;
	}

	public void Deserialize(String _str) {
		CPacket pac = new CPacket();
		pac.Deserialize(_str);
		m_offset = Integer.parseInt(pac.value.get(0));
		m_name = pac.value.get(1);
		m_img = pac.value.get(2);
		m_text = pac.value.get(3);
		m_type = Integer.parseInt(pac.value.get(4));
		m_gold = Integer.parseInt(pac.value.get(5));
		m_dropRate = Double.parseDouble(pac.value.get(6));
		if (!pac.value.get(7).equals("null")) {
			m_ability = new CAbility();
			m_ability.Deserialize(pac.value.get(7));
		}
		CPacket pac0 = new CPacket();

		pac0.Deserialize(pac.value.get(8));
		for (String each0 : pac0.value) {
			if (each0.isEmpty())
				continue;
			m_putOnType.add(Integer.parseInt(each0));
		}
		m_level = Integer.parseInt(pac.value.get(9));

		m_skill = Integer.parseInt(pac.value.get(10));
		m_set = Integer.parseInt(pac.value.get(11));

		if (pac.value.get(12).equals("null") == false) {
			m_reinforce = new CReinforce();
			m_reinforce.Deserialize(pac.value.get(12));
		}

		m_dropMinLevel = Integer.parseInt(pac.value.get(13));
		m_dropMaxLevel = Integer.parseInt(pac.value.get(14));

		m_durabilityMax = Integer.parseInt(pac.value.get(15));
		m_discount=pac.GetBool(16);
	}
}

class CInventoryInfo implements ISerialize {
	CInventoryInfo() {
	}

	CInventoryInfo(int _itemOff, int _amount) {
		m_offset = GetNewOffset();
		m_itemOff = _itemOff;
		m_amount = _amount;
		CItemInfo info = CItemSC.m_itemInfo.get(m_itemOff);
		m_durability = info.m_durabilityMax;
	}

	CInventoryInfo(int _itemOff, int _amount, int _rein) {
		m_offset = GetNewOffset();
		m_itemOff = _itemOff;
		m_amount = _amount;
		m_reinforceCount = _rein;
		CItemInfo info = CItemSC.m_itemInfo.get(m_itemOff);
		m_durability = info.m_durabilityMax;
	}

	static int l_offset = 0;
	
	static public int GetNewOffset() {
		return l_offset++;
	}

	int m_offset;
	public int m_itemOff;
	public int m_amount;
	public int m_reinforceCount;
	public int m_durability = -1;
	public int m_fCount;
	public int m_iCount;
	public int m_eCount;
	public int m_pCount;

	public CPacket Serialize() {
		CPacket pac = new CPacket();
		pac.name = "CInventoryInfo";
		pac.Push(m_offset);
		pac.Push(m_itemOff);
		pac.Push(m_amount);
		pac.Push(m_reinforceCount);
		pac.Push(m_durability);
		pac.Push(m_fCount);
		pac.Push(m_iCount);
		pac.Push(m_eCount);
		pac.Push(m_pCount);
		return pac;
	}

	public void Deserialize(String _str) {
		CPacket pac = new CPacket();
		pac.Deserialize(_str);
		m_offset = Integer.parseInt(pac.value.get(0));
		m_itemOff = Integer.parseInt(pac.value.get(1));
		m_amount = Integer.parseInt(pac.value.get(2));
		m_reinforceCount = Integer.parseInt(pac.value.get(3));
		m_durability = Integer.parseInt(pac.value.get(4));

		m_fCount = Integer.parseInt(pac.value.get(5));
		m_iCount = Integer.parseInt(pac.value.get(6));
		m_eCount = Integer.parseInt(pac.value.get(7));
		m_pCount = Integer.parseInt(pac.value.get(8));

	}
}

class CDropInfo implements ISerialize {
	CDropInfo() {

	}

	int m_itemOff;
	int m_amount;
	int m_drop;

	public CPacket Serialize() {
		CPacket pac = new CPacket();
		pac.name = "CDropInfo";

		pac.Push(m_itemOff);
		pac.Push(m_amount);
		pac.Push(m_drop);
		return pac;
	}

	public void Deserialize(String _str) {
		CPacket pac = new CPacket();
		pac.Deserialize(_str);

		m_itemOff = Integer.parseInt(pac.value.get(0));
		m_amount = Integer.parseInt(pac.value.get(1));
		m_drop = Integer.parseInt(pac.value.get(2));

	}
}

public class CItem extends CObject {
	int m_live = 1000 * 60 *5;
	CVec2 m_size = new CVec2(32, 32);
	CInventoryInfo m_inven = null;
	CPaint m_pt;
	CCollider m_co;

	public CBound GetBound() 
	{
		CBound bound = m_co.GetBound().toCopy();
		bound.min = CMath.MatToVec3Normal(bound.min, m_co.GetLMat());
		bound.min.z = bound.min.y;
		bound.max = CMath.MatToVec3Normal(bound.max, m_co.GetLMat());
		bound.max.z = bound.max.y;
		// m_rad=bound.max.y;
		return bound;
	}

	CItem(int _itemOff, CVec3 _pos, int _amount) 
	{
		if(_pos==null)
			return;
		m_inven = new CInventoryInfo(_itemOff, _amount);
		m_key = "item" + m_inven.m_offset;

		m_size = new CVec2(64, 64);
		m_pt = new CPaintBillbord(m_size, "res/none.png");
		super.PushCComponent(m_pt);

		m_co = new CCollider(m_pt);
		super.PushCComponent(m_co);
		m_co.SetCollision(true);
		
		SetPos(CMath.Vec3PlusVec3(_pos, new CVec3(0, GetBound().GetInRadius(), 0)));

	}
	CItem(CInventoryInfo _inven, CVec3 _pos) 
	{
		m_inven = _inven;
		m_key = "item" + m_inven.m_offset;

		m_size = new CVec2(64, 64);
		m_pt = new CPaintBillbord(m_size, "res/none.png");
		super.PushCComponent(m_pt);

		m_co = new CCollider(m_pt);
		super.PushCComponent(m_co);
		m_co.SetCollision(true);
		
		SetPos(CMath.Vec3PlusVec3(_pos, new CVec3(0, GetBound().GetInRadius(), 0)));

	}
	CInventoryInfo ItemDestroy()
	{
		if(GetRemove())
			return null;
		Destroy();

		
		return m_inven;
	}

	public CPacket Serialize() {
		CPacket pac = new CPacket();

		pac.Push(m_offset);
		pac.Push(m_key);

		pac.Push(m_pos);
		pac.Push(m_rot);
		pac.Push(m_sca);

		pac.Push(m_size);
		pac.Push(m_inven);

		return pac;
	}

	public void Deserialize(String _str) {
		CPacket pac = new CPacket();
		pac.Deserialize(_str);
		// super.Deserialize(pac.GetString(0));

		m_offset = pac.GetInt32(0);
		m_key = pac.GetString(1);

		m_pos.Deserialize(pac.GetString(2));
		m_rot.Deserialize(pac.GetString(3));
		m_sca.Deserialize(pac.GetString(4));

		pac.GetISerialize(5, m_size);

		m_inven = new CInventoryInfo();
		pac.GetISerialize(6, m_inven);

		m_size = new CVec2(32, 32);
		m_pt = new CPaintBillbord(m_size, "res/none.png");
		super.PushCComponent(m_pt);

		m_co = new CCollider(m_pt);
		super.PushCComponent(m_co);
		m_co.SetCollision(true);
		this.PRSReset();
	}
	public void Update(int _delay)
	{
		super.Update(_delay);
		m_live-=_delay;
		if(m_live<0 && m_remove==false)
		{
			CPacketZone pac=new CPacketZone();
			pac.RemoveObject(this);
			m_packet.add(pac);
		}
	}
	public void LastUpdate(int _delay)
	{
		super.LastUpdate(_delay);
		m_live-=_delay;
		if(m_live<0)
		{
			Destroy();
		}
	}
}


class CItemSC 
{
	static public int Amulet = 0;// 목걸이 0
	static public int Clothes = 1;// 상의
	static public int Weapon = 2;// 무기
	static public int Head = 3;// 모자
	static public int Ring = 4;// 반지
	static public int Hand = 5;// 손
	static public int Pants = 6;// 하의
	static public int Shield = 7;// 방패
	static public int Shoes = 8;// 신발
	static public int Potion = 9;// 포션
	static public int Food = 10;// 음식
	static public int Book = 11;// 책
	static public int Material = 12;// 재료
	static public int Bow = 13;// 활 13
	static public int CrossBow = 14;
	static public int Gun = 15;
	static public int Wand = 16;
	static public int Rod = 17;// 17
	static public int Axe = 18;
	static public int Sword = 19;// 19
	static public int LongSword = 20;
	static public int ShortSword = 21;
	static public int Spear = 22;
	static public int Mace = 23;
	static public int Skill = 24;
	static public int Quiver = 25;
	static public int MagicBook = 26;
	static public int SubHelp = 27;
	static public int Puton = 28;
	
	
	static public int Wield = 29;
	static public int Shot = 30;
	static public int Bond = 31;
	
	static public boolean WieldChk(int _type)
	{
		if(Rod==_type ||
			Axe==_type ||
			Sword==_type ||
			LongSword==_type ||
			ShortSword==_type ||
			Spear==_type ||
			Mace==_type)
			return true;
		return false;
	}
	static public String GetItemTypeStr(int _type)
	{
		if(Amulet==_type)
			return "목걸이";
		else if(Clothes==_type)
			return "장비";
		else if(Weapon==_type)
			return "무기";
		else if(Head==_type)
			return "머리";
		else if(Ring==_type)
			return "반지";
		else if(Hand==_type)
			return "장갑";
		else if(Pants==_type)
			return "";
		else if(Shield==_type)
			return "방패";
		else if(Amulet==_type)
			return "목걸이";
		else if(Shoes==_type)
			return "신발";
		else if(Material==_type)
			return "재료";
		else if(Bow==_type)
			return "활";
		else if(CrossBow==_type)
			return "쇠뇌";
		else if(Sword==_type)
			return "검";
		else if(Wand==_type)
			return "지팡이";
		else if(Rod==_type)
			return "막대";
		else if(Spear==_type)
			return "창";
		else if(Mace==_type)
			return "둔기";
		else if(Skill==_type)
			return "기술";
		
		return "미정의";
	}
	static public int ItemTypeChk(int _type)
	{
		if(Bow==_type ||
			CrossBow==_type ||
			Gun==_type ||
			Wand==_type ||
			Rod==_type ||
			Axe==_type ||
			Sword==_type ||
			LongSword==_type ||
			ShortSword==_type ||
			Spear==_type ||
			Mace==_type)
			return Weapon;
		else if(Amulet==_type ||
				Clothes==_type ||
				Ring==_type ||
				Hand==_type ||
				Shield==_type ||
				Shoes==_type ||
				Head==_type ||
				Quiver==_type ||
				MagicBook==_type ||
				SubHelp==_type)
			return Puton;
		
		return _type;
	}
	
	public static boolean FIEPAttChk(int _type)
	{
		if(Clothes==_type ||
			Shoes==_type ||
			Head==_type ||
			Amulet==_type)
			return false;
		
		return true;
	}
	

	static int ReinforceUp(CInventoryInfo _inv,int _count) 
	{
		CItemInfo item=m_itemInfo.get(_inv.m_itemOff);
		if (item.m_reinforce == null)
			return CPopupMsg.ReinforceFail;

		if (item.m_reinforce.m_max <= _inv.m_reinforceCount)
			return CPopupMsg.ReinforceMax;

		int count = _inv.m_reinforceCount;
		count *= item.m_reinforce.m_one;
		int two = 0, three = 0;

		if (item.m_reinforce.m_two > 0) 
		{
			two = _inv.m_reinforceCount / item.m_reinforce.m_two;
			if (two >= 1)
				count *= 2 * two;
		}
		if (item.m_reinforce.m_three > 0) 
		{
			three = _inv.m_reinforceCount / item.m_reinforce.m_three;
			if (three >= 1)
				count *= 2 * three;
		}

		if ((int) (Math.random() * (count/(float)_count)) == 0)
			_inv.m_reinforceCount++;
		
		return 0;
	}

	static int FIEPUp(CInventoryInfo _inv, int _type) {
		int count = _inv.m_fCount + _inv.m_iCount + _inv.m_eCount + _inv.m_pCount;

		if (count >= 10)
			return CPopupMsg.ReinforceMax;
		int two = count / 4;
		if (two >= 1)
			count *= 2 * two;

		if ((int) (Math.random() * count) != 0)
			return 0;

		int ran = _type;
		if (_type == -1) {
			ran = (int) (Math.random() * 4);

		}
		switch (ran) {
		case 0:
			_inv.m_fCount++;
			break;
		case 1:
			_inv.m_iCount++;
			break;
		case 2:
			_inv.m_eCount++;
			break;
		case 3:
			_inv.m_pCount++;
			break;
		}

		return 0;
	}

	static int m_infoOff = 0;
	static public Vector<CItemInfo> m_itemInfo = new Vector<CItemInfo>();
	static String m_script = "";

	public static void Init() 
	{

		if (m_script.isEmpty())
			m_script = CDbMgr.GetText("ItemSC");
		if (m_script.isEmpty())
			return;
		CPacket pac = new CPacket();
		pac.Deserialize(m_script);

		for (String each0 : pac.value) {
			CItemInfo item = new CItemInfo();
			item.Deserialize(each0);
			m_itemInfo.add(item);
		}
	}
	public static Vector<CItem> GlobalDrop2(CVec3 _pos,int _level,double _rate)
	{
		//CItem item=null;
		Vector<CItem> list=new Vector<CItem>();
		
		for(CItemInfo each0 : m_itemInfo)
		{
			double ram=Math.random();
			if(each0.m_dropMinLevel!=-1 && each0.m_dropMinLevel<=_level &&
					each0.m_dropMaxLevel>=_level && ram*_rate<=each0.m_dropRate)
			{
				CItem item=new CItem(each0.m_offset, _pos, 1);
				//item.CreateItem(each0.m_offset, _pos, 1);
//				while(true)
//				{
//					ram=Math.random();
//					if(ram<0.3)
//						break;
//					if(item.m_inven.m_reinforce==null)
//						item.m_inven.m_reinforce=new CReinforce();
//					item.m_inven.m_reinforce.Up(TypeChk(m_itemInfo.get(item.m_inven.m_itemOff).m_type));
//					break;
//				}
				list.add(item);
			}
		}
		
		
		return list;
	}
}
class CSetItem implements ISerialize
{
	int m_offset;
	int m_skill;
	Vector<Integer> m_itemOff=new Vector<Integer>();
	CAbility m_ability=null;
	String m_text;
	public CPacket Serialize() 
	{
		CPacket pac=new CPacket();
		pac.name="CSetItem";
		pac.Push(m_offset);
		pac.Push(m_skill);
		pac.Push(m_itemOff);
		pac.Push(m_ability);
		pac.Push(m_text);

		return pac;
	}
	public void Deserialize(String _str)  
	{
		CPacket pac=new CPacket();
		pac.Deserialize(_str);
		
		m_offset=Integer.parseInt(pac.value.get(0));
		m_skill=Integer.parseInt(pac.value.get(1));
		
		CPacket pac0=new CPacket();
		pac0.Deserialize(pac.value.get(2));
		for(String each0 : pac0.value)
		{
			if(each0.isEmpty())
				continue;
			m_itemOff.add(Integer.parseInt(each0));
		}
		
		if(!pac.value.get(3).equals("null"))
		{
			m_ability=new CAbility();
			m_ability.Deserialize(pac.value.get(3));
		}
		m_text=pac.value.get(4);
		
	}
}
class CSetItemSC
{
	static public Vector<CSetItem> m_setItem=new Vector<CSetItem>();
	static String m_script="";
	public static void Init()
	{
		if (m_script.isEmpty())
			m_script = CDbMgr.GetText("SetItem");
		if (m_script.isEmpty())
			return;
		CPacket pac = new CPacket();
		pac.Deserialize(m_script);
		
		for(String each0 : pac.value)
		{
			CSetItem item=new CSetItem();
			item.Deserialize(each0);
			m_setItem.add(item);
		}
		
		
	}
	public static Vector<Integer> SetChk(Vector<CInventoryInfo> _inv)
	{
		Vector<Integer> rVal=new Vector<Integer>();
		
		for(CInventoryInfo each0 : _inv)
		{
			
			CItemInfo info=CItemSC.m_itemInfo.get(each0.m_itemOff);
			if(info.m_set==-1)
				continue;
			CSetItem set=m_setItem.get(info.m_set);
			boolean pass=false;
			for(Integer each1 : rVal)
			{
				if(each1==set.m_offset)
				{
					pass=true;
				}
			}
			if(pass)
				continue;
			
			int setCount=0;
			for(Integer each1 : set.m_itemOff)
			{
				for(CInventoryInfo each2 : _inv)
				{
					if(each1==each2.m_itemOff)
					{
						setCount++;
						break;
					}
				}
			}
			
			if(setCount==set.m_itemOff.size())
			{
				
				rVal.add(set.m_offset);
			}
		}
		
		return rVal;
	}
	
}

