var fibonacci = function (n) {
	return  n < 2 ? n :arguments.callee(n-1)+arguments.callee(n-2);
};

onmessage = function (event) {
	var n = parseInt(event.data,10);
	postMessage(fibonacci(20));
};

error = function (event) {
	console.log("fileName:"+event.filename+",line numbner:"+event.lineno+",message:"+event.message);
};