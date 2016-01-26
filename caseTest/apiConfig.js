
//var serverAddr = "http://192.168.18.250:12690";		//公司内部测试
var serverAddr = "http://120.25.104.124:12690";		    //aliyun

var accesstoken = "accesstoken=153289314896147";

var DOWNLOAD_ADDR = serverAddr+"/download";				//下载excel的接口
var apiConfig = {

	/*----------------------合同管理-------------------------------------------*/

	//删除合同    
	deleteContract :{
		url:serverAddr + "/merchant/contractmanager/delete",	        
		type:"get",
		name:"删除合同"
	},
	//查询合同    
	queryContract :{
		url: serverAddr + "/merchant/contractmanager/query?sortby=0&asc=1&pageidx=1&pagenum=50",		        
		type:"get",
		name:"查询合同"
	},    
	queryMerchantInfo:{
		url: serverAddr + "/merchant/merchantinfo/query?sortby=0&asc=1&pageidx=1&pagenum=50",	
		type:"get",
		name:"查询商户"
	} 
};