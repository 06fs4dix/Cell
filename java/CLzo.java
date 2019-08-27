package cell;

import java.io.IOException;
import org.anarres.lzo.*;



public class CLzo 
{
	
	public static String Compress(String _str) 
	{
		LzoCompressor1x_1 com=new LzoCompressor1x_1();
		byte arr[]=new byte[_str.length()*4];
		lzo_uintp len=new lzo_uintp();
		len.value=arr.length;
		byte inarr[]=_str.getBytes();
		com.compress(inarr, 0, inarr.length, arr, 0, len);
		
		String out=new String(arr,0,len.value);
	    
		return out;
	}
	public static String CompressBase64(String _str)
	{
		String dum=Compress(_str);
		
		return CBase64.encode(dum.getBytes());
	}
	public static String Decompress(String _str) 
	{
		LzoDecompressor1x dcom=new LzoDecompressor1x();
		byte arr[]=new byte[_str.length()*2000];
		lzo_uintp len=new lzo_uintp();
		len.value=arr.length;
		byte inarr[]=_str.getBytes();
		dcom.decompress(inarr, 0, inarr.length, arr, 0, len);
		
		String out=new String(arr,0,len.value);
	    
		return out;
	}
	public static String DecompressBase64(String _str)
	{
		
		byte decodeByte[]=CBase64.decode(_str);
		
		return Decompress(new String(decodeByte,0,decodeByte.length));
	}
}

