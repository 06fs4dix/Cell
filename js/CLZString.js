var CLZString=function()
{
}
CLZString.CompressBase64=function(_str)
{
	return LZString.compressToBase64(_str);
}
CLZString.DecompressBase64=function(_str)
{
	return LZString.decompressFromBase64(_str);
}