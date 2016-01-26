<?php 
	class Person{
		public $name;
		public $age;

		//php中this关键字之前需要加上$
		public function __construct(){
			$this->name = "alan";
			$this->age = "18";
		}
		
		// treated as constructor in PHP 5.3.0-5.3.2
        // treated as regular method as of PHP 5.3.3
		public function Person(){
		}


		public function sayHello(){
			echo "name is =".$this->name;
		}	
	}

?>