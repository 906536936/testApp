<?php 
	class ConectionMysql {
		private $server   = "192.168.24.31";
		private $user     = "wampsql";
		private $pwd      = "wampsql";
		private $db       = "wampsql";
		private $chartset = "utf-8";
		private $link ;

		/**
		 * [__construct 构造函数]
		 */
		public function __construct(){
			$this->connect();
		}

		/**
		 * [connect 连接数据库]
		 * @return [type] [description]
		 */
		private function connect(){
			
			// 创建连接
			if (!$this->link) {
				$this->link = mysql_connect($this->server,$this->user,$this->pwd);
			}

			// 指定数据库
			mysql_select_db($this->db,$this->link);

			//指定数据路传输编码
			mysql_query("SET NAMES utf-8");
		}

		public function query($sql){
			$result = mysql_query($sql);

			if (!$result) {
			    $message  = 'Invalid query: ' . mysql_error() . "\n";
			    $message .= 'Whole query: ' . $sql;
			    die($message);
			}

			return $result;
		}

		public function executeSql($sql) {
			
		}

		/**
		 * [__destruct 析构函数，关闭资源]
		 */
		public function __destruct(){
			mysql_close($this->link);
		}

	}
?>