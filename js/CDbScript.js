function DbWrite(_type,_text)
{
	$.ajax({
        url:"CDbMgr.jsp",
        type:'POST',
        data: {
        	'vFun':'SetText',
        	'vPara':_type,
        	'vPara':_text,
        },
        success:function(data){
           
        },
        error:function(jqXHR, textStatus, errorThrown){
            alert("에러 발생~~ \n" + textStatus + " : " + errorThrown);
            
        }
    });
}
function DbRead(_type)
{
	$.ajax({
        url:"CDbMgr.jsp",
        type:'POST',
        data: {
        	'vFun':'GetText',
        	'vPara':_type,
        },
        success:function(data){
           $("#se_txt").val(data);
        },
        error:function(jqXHR, textStatus, errorThrown){
            alert("에러 발생~~ \n" + textStatus + " : " + errorThrown);
            
        }
    });
}

function ReadItemSc()
{
	
}