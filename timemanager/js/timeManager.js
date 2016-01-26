/**
 * [cardUtil 处理时间卡片的工具类]
 * @type {Object}
 */
var cardUtil = {
	/**
	 * [card_data 存储卡片数据 ]
	 * @type {String}
	 */
	card_data: {
		//cardTemplete 卡片模板
		card_templete: "<div class='card'>" +
			"<div class='tools'>" +
			"<span class='move'></span>" +
			"</div>" +
			"<div class='inputContainer'>" +
			"<span class='statusTips'></span>" +
			"<textArea class='taskContent textareaInput'></textArea>" +
			"</div>" +
			"</div>",

		//存储卡片数据
		card_storage: []
	},
	/**
	 * [init_addcard 增加卡片]
	 * @param  {jQuery Object} $target  [卡片父容器]
	 * @return {[type]} [description]
	 */
	card_add: function($target) {

		var id = this.card_data.card_storage.length,
			$card = $(this.card_data.card_templete)
			.attr({
				"cardid": id
			});

		//加入卡片
		$card.appendTo($target);

		//缓存插片dom
		this.card_data.card_storage.push($card);

	}
};

/**
 * [pageSwitchUtil 切换显示模块]
 * @type {Object}
 */
var pageSwitchUtil = {
	//当前显示的页，默认是0，当前页
	currentPageIndex: 0,

	//标志需要显示的模块的 class
	moduleClass: "module-area",

	//模块数量
	moduleCount: 3,
	/**
	 * [scrollIntoPage 在header和footer滚动时切换显示模块]
	 * @param  {[type]}   index [要显示的模块index]
	 * @param  {Function} fn    [回调函数]
	 * @param  {Number}direction[-1/1,-1表示上一模块，1表示下一模块]
	 * @return {[type]}         [description]
	 */
	scrollIntoPage: function(index, fn) {

		$(".show." + this.moduleClass).removeClass('show');
		$(".page-indicator.focus").removeClass('focus');

		this.currentPageIndex = index;

		//切换显示模块同时改变顶部页码导航条指示数
		$("." + this.moduleClass + ":eq(" + this.currentPageIndex + ")").addClass('show');
		$(".page-indicator:eq(" + this.currentPageIndex + ")").addClass('focus');

		if (typeof fn == "function") {
			fn(index);
		}
	}
};

//变量申明
//
var $body = null;

$(function() {

	$body = $("body");

	//事件绑定，添加卡片
	//添加到按钮sibling中的card-container容器中
	$body.on({
		click: function() {
			cardUtil.card_add($(this).prev(".card-container"));
		}
	}, ".add-button");

	//点击页码切换显示模块
	$body.on({
		click: function() {
			var index = $(this).index();

			pageSwitchUtil.scrollIntoPage(index);

		}
	}, ".page-indicator");

	//绑定拖动事件
	$(".card-container,.processing,.done").sortable({
		connectWith: ".card-container,.processing,.done",
		cursor: "move",
		items: ".card",
		opacity: 0.6,
		placeholder: "card-state-highlight",
		delay: 100,
		revert: true,
		update: function(event, ui) {
			var $card = ui.item;
		}
	});


	$body.on({
		focus: function() {
			$(this).parents(".card").addClass('focusCard');
		},
		blur: function() {
			$(this).parents(".card").removeClass('focusCard');
		}
	}, ".taskContent");


});