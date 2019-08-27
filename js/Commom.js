
String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
String.prototype.toInt = function(){
    return parseInt(Number(this));
}
String.prototype.equals = function(_data){
    return _data==this;
}

String.prototype.replaceAll = function(org, dest) {return this.split(org).join(dest);}
String.prototype.isEmpty = function(_data)
{
	if(this.length==0)
		return true;
	return false;
}

Array.prototype.add = function(_val) {return this.push(_val);}
Array.prototype.push_back = function(_val) {return this.push(_val);}
Array.prototype.size = function() {return this.length;}
Array.prototype.clear = function() {this.length=0;}
Array.prototype.empty = function() {return this.length==0;	}
Float32Array.prototype.empty = function() {return this.length==0;	}


Array.prototype.front = function() {return this[0];}
Array.prototype.back = function() {return this[this.length-1];}
Array.prototype.resize = function(_val) {	this.length=_val;}
//TODO 타겟과 스왑이 제대로 안된다!!!!!
Array.prototype.swap = function(_val) 
{	
	//var len=this.length;
	this.length=_val.length;
	for(var i=0;i<_val.length;++i)
		this[i]=_val[i];
}

Uint8Array.prototype.size = function() {return this.length;}

Set .prototype.insert = function(_val) {return this.add(_val);}

Float32Array.prototype.size = function() {return this.length;}
function swap(_a,_b)
{
	var dum=_a;
	_a=_b;
	_b=dum;
}
function PathToId(_val)
{
	var dummuy=_val.replaceAll('/', '_');
	dummuy=dummuy.replaceAll(':', '_');
	dummuy=dummuy.replaceAll(' ', 'q');
	dummuy=dummuy.replaceAll(',', 'q');
	dummuy=dummuy.replaceAll('.', 'q');
	dummuy=dummuy.replaceAll('#', 'q');
	dummuy=dummuy.replaceAll('@', 'q');
	dummuy=dummuy.replaceAll('!', 'q');
	dummuy=dummuy.replaceAll('~', 'q');
	dummuy=dummuy.replaceAll('$', 'q');
	dummuy=dummuy.replaceAll('@', 'q');
	dummuy=dummuy.replaceAll('^', 'q');
	dummuy=dummuy.replaceAll('&', 'q');
	dummuy=dummuy.replaceAll('*', 'q');
	dummuy=dummuy.replaceAll('(', 'q');
	dummuy=dummuy.replaceAll(')', 'q');
	dummuy=dummuy.replaceAll('[', 'q');
	dummuy=dummuy.replaceAll(']', 'q');
	dummuy=dummuy.replaceAll('/', 'q');
	dummuy=dummuy.replaceAll('\\', 'q');
	dummuy=dummuy.replaceAll('|', 'q');
	dummuy=dummuy.replaceAll('|', 'q');
	dummuy=dummuy.replaceAll(':', 'q');
	dummuy=dummuy.replaceAll(';', 'q');
	dummuy=dummuy.replaceAll('"', 'q');
	dummuy=dummuy.replaceAll('\'', 'q');
	dummuy=dummuy.replaceAll('?', 'q');
	dummuy=dummuy.replaceAll('<', 'q');
	dummuy=dummuy.replaceAll('>', 'q');
	dummuy=dummuy.replaceAll('-', 'q');
	dummuy=dummuy.replaceAll('+', 'q');
	dummuy=dummuy.replaceAll('=', 'q');
	dummuy=dummuy.replaceAll('{', 'q');
	dummuy=dummuy.replaceAll('}', 'q');
	dummuy=dummuy.replaceAll('%', 'q');
	return dummuy;
}
function SpTokToNSpTok(_str)
{
	//alert(_str);
	_str=_str.replaceAll("%", "#37;");
	_str=_str.replaceAll("'", "#39;");
	_str=_str.replaceAll("\"", "#34;");
	_str=_str.replaceAll("&", "#38;");
	_str=_str.replaceAll(",", "#44;");
	_str=_str.replaceAll("/", "#47;");
	_str=_str.replaceAll("\\", "#92;");
	
	//alert(_str);
	return _str;
}
function NSpTokToSpTok(_str)
{
	//alert(_str);
	_str=_str.replaceAll("#37;","%");
	_str=_str.replaceAll("#39;","'");
	_str=_str.replaceAll("#34;","\"");
	_str=_str.replaceAll("#38;","&");
	_str=_str.replaceAll("#44;",",");
	_str=_str.replaceAll("#47;","/");
	_str=_str.replaceAll("#92;","\\");
	//
	return _str;
}
class MixinBuilder 
{  
    constructor(superclass) {
        this.superclass = superclass;
    }

    with(...mixins) { 
        //return mixins.reduce((c, mixin) => mixin(c), this.superclass);
        return mixins.reduce(function(c, mixin){
             return mixin(c);
         }, this.superclass) 
    }
}
//let mix = (superclass) => new MixinBuilder(superclass);
let mix=function(superclass){	return new MixinBuilder(superclass);	}
//==============================================================================
function Get_CookieBoolean(_key,_default)
{
	var _value=$.cookie(_key);
	_value = typeof _value !== 'undefined' ? (_value=='true'?true:false) : _default;
	$.cookie(_key,_value);
	return _value;
}
function Get_CookieNumber(_key,_default)
{
	var _value=$.cookie(_key);
	_value = typeof _value !== 'undefined' ? Number(_value) : _default;
	$.cookie(_key,_value);
	return _value;
}
function Get_CookieString(_key,_default)
{
	var _value=$.cookie(_key);
	_value = typeof _value !== 'undefined' ? _value : _default;
	$.cookie(_key,_value);
	return _value;
}