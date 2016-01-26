<!DOCTYPE html>
<!--
filemtime对文件进行监听，获得文件最后修改的时间，以此方式在js文件最后加入时间戳
-->
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>filemtime</title>
		<?php
			//申明js脚本文件路径
			$base_xx_js = './base_xx.js';
			$jquery     = "../../jquery1.10.2.min.js";
		?>
		<script type="text/javascript" src="<?=$jquery ?>?v=<?=filemtime( $jquery ); ?>"></script>
		<script type="text/javascript" src="<?=$base_xx_js ?>?v=<?=filemtime( $base_xx_js ); ?>"></script>
	</head>
	<body>
		<pre>
			filemtime对文件进行监听，获得文件最后修改的时间，以此方式在js文件最后加入时间戳
		</pre>
	</body>
</html>