<?php 
	header("Content-type:text/html;charset=utf-8");

	require 'ConectionMysql.class.php';

	$connect = new ConectionMysql();

	$connect->query("insert into person value('张伦',18,'')");
	$result = $connect->query("select name,age from person");

	$arr = array();

	while (($row =  mysql_fetch_assoc($result))) {

		array_push($arr,array(
			"name" => $row["name"],
			"age"  => $row["age"]
		));
	}

	var_dump($arr);
?>