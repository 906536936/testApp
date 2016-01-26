<?php 
	/**
	 * 测试jsonp方法
	 */

	header("Content-type:application/javascript;charset=utf-8");

	$callback = $_REQUEST["callback"];

	$json = array('ret' => 0, "ret_msg" => "success" );

	$josnStr = json_encode( $json );
	
	echo $callback."(".$josnStr.")";

?>