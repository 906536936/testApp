/**
 * [sortUtil 几种排序  快速排序，选择排序，冒泡排序，插入排序]
 * @type {Object}
 */
var sortUtil = {
	/**
	 * [交换位置]
	 * @param  {Array} arr      [description]
	 * @param  {Number} original [description]
	 * @param  {Number} target   [description]
	 * @return {[type]}          [description]
	 */
	switchPos: function (arr, original, target) {

		if(original === target) {
			return;
		}

		var temp = arr[original];
		arr[original] = arr[target];
		arr[target] = temp;
	},
	/**
	 * [checkArr 检查数组是否合法]
	 * @return {[type]} [description]
	 */
	checkArr: function (arr){
		if (!typeof arr === "object" && arr.prototype.constructor.name === "Array" || arr.length == 0) {
			return [];
		} else {
			return arr.slice(0);
		}
	},
	formatRes: function (originalArr,arr,funName){
		return {
			beforeSort: originalArr,
			aftersort:arr,
			valueOf: function (){
				return "before:" + this.beforeSort + "---------after:" + this.aftersort;
			},
			toString: function (){
				console.log("---------------"+funName+"------------------");
				console.log("before:" + this.beforeSort);
				console.log("after: " + this.aftersort);
				console.log("---------------"+funName+"------------------");
			}
		};
	},
	/**
	 * 冒泡排序
	 * @param  {Array} arr [description]
	 * @return {Array}     [description]
	 */
	bubbleSort: function (originalArr) {

		var arr = this.checkArr(originalArr);

		for (var i = 0, length = arr.length; i < length; i++) {

			// j从1开始可以回避数组长度小于2的情况
			// 已经冒泡到最后的元素不再参与比较
			for (var j = 0,len = length - 1 - i; j < len; j++) {

				if (arr[j] > arr[j +1]) {
					this.switchPos(arr, j, j+1);
				}

			}

		}

		return this.formatRes(originalArr,arr,"bubbleSort");
		
	},
	/**
	 * [qucikSort 快速排序]
	 * @param  {[type]} originalArr [description]
	 * @return {[type]}             [description]
	 */
	qucikSort: function(originalArr) {
		var arr = this.checkArr(originalArr);

		var res = ((function(arr) {

			if (arr.length <= 1) {
				return arr;
			}

			var lowerArr = [],
				highArr  = [],
				callee   = arguments.callee;

			var point = arr[0];

			for (var i = 1, length = arr.length; i < length; i++) {
				if (arr[i] > point) {
					highArr.push(arr[i]);
				} else {
					lowerArr.push(arr[i]);
				}
			}

			return callee.call(this, lowerArr).concat(point).concat(callee.call(this, highArr));


		})(arr));

		return this.formatRes(originalArr,res,"qucikSort");
	},
	/**
	 * [insertSort 插入排序]
	 * @param  {[type]} originalArr [description]
	 * @return {[type]}             [description]
	 */
	insertSort: function(originalArr){
		var arr = this.checkArr(originalArr);

		for (var i = 1; i < arr.length; i++) {

			var temp = arr[i];

			for (var j = i - 1; j > -1; j--) {
				if (temp < arr[j]) {
					arr[j + 1] = arr[j];
				} else {
					break;
				}
			}

			if (j > -1) {
				arr[j + 1] = temp;
			}

		}


		return this.formatRes(originalArr,arr,"insertSort");
	},
	/**
	 * [selectSort 选择排序]
	 * @return {[type]} [description]
	 */
	selectionSort: function(originalArr) {
		var arr = this.checkArr(originalArr);

		for (var i = 0, length = arr.length; i < length; i++) {
			var pos = i;
			for (var j = i + 1; j < length; j++) {
				if (arr[pos] > arr[j]) {
					pos = j;
				}
			}

			this.switchPos(arr, pos,i);
		}

		return this.formatRes(originalArr, arr, "selectionSort");
	}
};

