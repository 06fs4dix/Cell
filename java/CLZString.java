package cell;

import dal.LZString;

public class CLZString 
{
	static public String CompressBase64(String input)
	{
		return LZString.compressToBase64(input);
	}
	static public String DecompressBase64(String input)
	{
		return LZString.decompressFromBase64(input);
	}
}
