<?php
	
	$codeString = $_GET["originalstring"];

	//echo $codeString;

	//先把类包含进来，实际路径根据实际情况进行修改。
	require 'ValidateCode.class.php';  

	//实例化一个对象
	$_vc = new ValidateCode();  

	$_vc->doimg($codeString);
?>
<!-- 
	http://webtouch.com/testApp/php/verifyCode/createverifyImg.php?originalstring=1234
 -->