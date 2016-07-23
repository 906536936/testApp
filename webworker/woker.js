var fibonacci = function (n) {
	// return  n < 2 ? n :arguments.callee(n-1)+arguments.callee(n-2);

    var ss= "A345aeBwtA2qwerC";
    var ss2= "A345aeBwtA2qwerC";

    for(var i = 0;i< 20;i++){ss = ss+ss;}

    ss2 = ss;

    var s1 =  Date.now();
    ss.replace(/[A-Z]/g,function(s,index){return index ===0 ?s:  "_" + s.toLowerCase()});
    var time1 = Date.now() - s1;

    var s2 = Date.now();
    ss2.substr(0,1) + ss2.substr(1).replace(/[A-Z]/g,function(s,index){return "_" + s.toLowerCase()});

    var time2 = Date.now() - s2;

    return time1 +"_" +time2;
}

onmessage = function (event) {
	var n = parseInt(event.data,10);
	postMessage(fibonacci(20));
}

error = function (event) {
	console.log("fileName:"+event.filename+",line numbner:"+event.lineno+",message:"+event.message);
}