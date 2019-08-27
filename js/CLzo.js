function ab2str(buf) 
{
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}
function str2ab(str) 
{
	//var buf = new ArrayBuffer(str.length); // 2 bytes for each char
	var bufView = new Uint8Array(str.length);
	for (var i=0, strLen=str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return bufView;
}

var CLzo=function()
{
}
CLzo.Compress=function(_str)
{
	var state= 
	{
			'inputBuffer': str2ab(_str),
			'outputBuffer': null
	};

	lzo1x.compress(state);
		
	return ab2str(state.outputBuffer);
}
CLzo.Decompress=function(_str)
{
	var state= 
	{
			'inputBuffer': str2ab(_str),
			'outputBuffer': null
	};

	lzo1x.decompress(state);
		
	return new TextDecoder().decode(state.outputBuffer);
}
CLzo.CompressBase64=function(_str)
{
	return btoa(CLzo.Compress(_str));
}
CLzo.DecompressBase64=function(_str)
{
	return CLzo.Decompress(atob(_str));
}