$(function(){
	var $result = $(".result");
	var $tbody = $(".info_table tbody");

	var str = "";
	for(var key in apiConfig){
		var url = apiConfig[""+key].url.split("?");

		apiConfig[key].url = url[0]+"?"+accesstoken+"&"+(url[1]||"");

		str +=  "<tr>"+
					"<td>" + apiConfig[key].name + ":</td>" +
					"<td>" + apiConfig[key].url + "</td>"+
					"<td apikey='"+key+"'><span class='btn btnFocus'>发送请求</span></td>"+
				"</tr>";

	}
	$tbody.html(str);

	$("body").on({
		click:function(){
			var item = apiConfig[""+$(this).parent().attr("apikey")];
				apiUrl = item.url,
				ajaxType = item.type;

			$.ajax({
				url: apiUrl,
				type: ajaxType,
				cache: false,
				success: function(res){
					console.log(res);
					$result.text(JSON.stringify(res));
				},
				error: function(){
					alert("服务器异常或请求超时！");
				}
			});
		}
	},".btn");
});