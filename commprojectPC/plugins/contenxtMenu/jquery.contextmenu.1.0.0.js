/**
 * 基于 jquery的右键菜单
 * @version{1.0.0}
 * @author {张伦}
 * @date   {2014-11-22}
 * @param  {jQuery} 
 * @return {Object} 
 */
 ;(function($){
 	/*插件的默认设置*/
 	var defaultSetting={
 		children : 						 //菜单项数据
 		[
	 		{
	 			title:'item1',  		 //菜单项
	 			icon:'img/edit.png',     //菜单项的图标
	 			hasChildItem:false,		 //是否出存在子菜单
	 			callbackEnable:true,	 //回调函数是否可用
	 			callback:function(e){},  //点击的回调函数
	 			hotkey:"A"			     //设置热键
	 		},
	 		null,
	 		{
	 			title:'item2',
	 			icon:'img/edit.png',
	 			hasChildItem:false,		/*true,
	 			children:[				//如果存在子节点，则格式这样写
	 				{
	 					title:'item21',
			 			icon:'img/edit.png',
			 			hasChildItem:false,
			 			callbackEnable:true,
			 			callback:function(e){
			 				alert("item21");
			 			}
	 				}
	 			],*/
	 			callbackEnable:true,
	 			callback:function(e){    
	 				alert("item2");
	 			},
	 			hotkey:"B"
	 		}
 		],
 		offset:{	 					//菜单离鼠标点击点的距离,不带单位
 			x:5,
 			y:5
 		},
 		zIndex:10,						//右键菜单的层级
 		width:'150px',					//菜单项的长度
 		header:false					//是否显示右键菜单的头部[false:没有头部，如果有则直接写内容]

 	};
 	var _setting_={};
 	
 	/*右键菜单view的方法*/
    var method = {
        demo: function(i) {
            alert("这个是暴露的函数" + i);
        },
 		/**
 		 * [show 显示右键菜单]
 		 * @param  {event，offset} [事件对象，鼠标距离]
 		 * @return {Object} 	   [当前右键对象]
 		 */
        show: function(e) {
            var $self = this.$menu;

            if (!$self) {
                return this;
            }

            var offset = _setting_.offset;
            var position = util.getPostion(e);

            $self.css({
                display: "block",
                top: (position.y + offset.y) + "px",
                left: (position.x + offset.x) + "px"
            });

            util.preventDefaultAction(e);
            return this;
        },
        /**
 		 * [close 关闭右键菜单]
 		 * @return {[type]} [description]
 		 */
        close: function(e) {
            var $self = this.$menu;
            
            if (!$self){ 
                return this;
            }

            $self.remove();

            this.contextItem.length = 0;
            util.preventDefaultAction(e);
        },
 		/**
 		 * [init 初始化右键菜单，包括创建dom，绑定事件]
 		 * @param  {[object]} setting [用户传入的参数]
 		 * @return {$Object}          [返回]
 		 */
 		init:function(setting){

            // 深度拷贝
            var tempSetting = $.extend(true, {}, defaultSetting, setting);

            //对配置进行规范化，减少生成dom的时候的判断错误代码
            var setting = _setting_ = contextmenuUtil.initPara.call(this, tempSetting);

            // 对每一个可激发右键菜单的元素委托contextmenu事件
            var contextMenuArea = this;

 			$(contextMenuArea).each(function(index){

 				var $self=$(this);
 				//对每一个可以激发右键菜单的元素添加特定class
 				$self.addClass('contenxtMenuArea');

 				$self.on({
 					contextmenu:function(e){
 						// 其他的右键菜单消失
                        $(".contextmenu").remove();

                        // 组装右键菜单
                        var $menu = contextmenuUtil.executeMenu.call(contextMenuArea, setting).appendTo('body');

                        // 显示右键菜单
                        method.show.call(contextMenuArea, e);

                        // 进行事件绑定
                        contextmenuUtil.addFun.call(contextMenuArea);

                        //进行热键绑定
                        contextmenuUtil.bindHotkey.call(contextMenuArea);
	 				},
	 				click:function(e){
	 					$(".contextmenu").remove();
	 				}
	 			})
 			});
 			return this;
 		},
 		/**
 		 * [disbaleItem 禁用和解禁菜单项]
 		 * @param  {[item]} itemList [需要禁用、解禁的菜单项]
 		 * @return {[null]}          [null]
 		 */
        setItem: function(para) {
            var defaultSet = {
                itemList: [],
                flag: true
            };

            para = $.extend(true, {}, defaultSet, para);

            var itemList = para.itemList;
            var flag = para.flag;
            var thisCaller = this;

            $.each(itemList, function(index, val) {
                
                var tempThis = itemList[index];
                //传入的是在菜单项位置，格式是：1-1-0，表示的是第二个菜单项的第二个子菜单的第一个子菜单
                
                if (typeof tempThis == 'string') {
                    var item_ = thisCaller.contextItem["contextmenu-item" + tempThis];
                    
                    if (!item_) {
                        console.log(tempThis + "不存在！")
                    } else {
                        item_.callbackEnable = flag;
                        thisCaller.contextItem["contextmenu-item" + tempThis] = item_;
                    }

                } else {
                    console.log(tempThis + "必须为字符串！")
                }
            });
        }
 	};
 	/*创建右键菜单的工具函数*/
 	var contextmenuUtil={
 		/**
 		 * [initPara 对参数进行初始化和规范化]
 		 * @param  {object} para [深度拷贝后的参数]
 		 * @return {object}      [符合要求的参数]
 		 */
 		initPara:function(setting,position){
            this.contextItem = this.contextItem || [];

            //用于记录每个菜单项所在的层次关系
            var position = position || ""; 									
            var index = 0;

            for (var i = 0, length = setting.children.length; i < length; i++) {
                var item = setting.children[i];
                if (item != null) {
                    index++;

                    //规范热键，单个字母
                    item.hotkey = util.getHotKey(item.hotkey);

                    //规范图标
                    if (!item.icon || item.icon == "") {
                        item.icon = "img/edit.png";
                    }

                    //规范层级关系
                    item.position = position + index;

                    //添加id
                    item.id = "contextmenu-item" + item.position;
                    if (item.hasChildItem && item.children && item.children.length > 0) {

                        //以"-"隔开
                        arguments.callee.call(this, item, item.position + "-");
                    }
                    this.contextItem.length++;

                    // 使用数组记录每一项的回调，能否被点击，以及热键值
                    this.contextItem[item.id] = {
                        callback: item.hasChildItem ? null : item.callback,
                        callbackEnable: item.callbackEnable,
                        hotkey: item.hotkey
                    };
                }
            }
 			return setting;
 		},
 		/**
 		 * [executeMenu 组装右键菜单]
 		 * @para   {object} [右键菜单设置]
 		 * @return {string} [组装右键菜单的innerhtml]
 		 */
        executeMenu: function(setting) {
            var header = (setting.header == false) ? "" : contextmenuUtil.head.call(this, setting.header);
            var contenter = contextmenuUtil.content.call(this, setting.children);
            var $menu = $("<div>", {
                class: 'contextmenu',
                css: {
                    'width': setting.width,
                    'z-index': setting.zIndex
                }
            });

            $menu.append(header);
            $menu.append(contenter);

            this.$menu = $menu;

            return $menu;
        },
 		/**
 		 * [header 生成右键菜单头部的html]
 		 * @return {string} [右键菜单头部的html]
 		 */
        head: function(title) {
            var header = "<span class='contextmenu-head'>" + title + "</span>";
            return header;
        },
        /**
 		 * [content 右键菜单的内容部分]
 		 * @return {[string]} [右键菜单内容部分的html]
 		 */
 		content:function(items){

            if (items == null) {
                return "";
            }

            var contenter = "<ul class='contextmenu-list'>";
            for (var i = 0, length = items.length; i < length; i++) {
 				var item=items[i];

                //不存在子节点,内容为null，则为分割线
                if (item === null || item.hasChildItem === null) {
                    contenter += "<li class='contextmenu-divider'></li>";
                } else {

                    var hotkey = item.hotkey;

                    //此处以contextItem中的callbackEnable为准，因为对菜单项的修改保存在这里
                    var callbackEnable = this.contextItem[item.id].callbackEnable;

                    //在条目中加入热键
                    var title = hotkey != -1 ? item.title + "(" + hotkey + ")" : item.title;

                    //如果无法被出发和显示子节点，加上样式
                    var disableClass = callbackEnable ? "normal" : "disbale";

                    //不存在子节点
	 				if (item.hasChildItem == false) {								
	 					contenter += "<li  id='" + item.id + "' class='" + disableClass + "'>" + 
				 						"<a href='javascript:void(0)'>" + 
				 							"<div>" + "<img src='" + item.icon + "' alt=''>" + "</div>" + 
				 							"<span>" + title + "</span>" + 
				 						"</a>" + 
				 					"</li>";

                    //存在子节点 
	 				}else{														
	 					
                        var child = arguments.callee.call(this,item.children||null);
	 					contenter += "<li id='" + item.id + "' class='hasChild " + disableClass + "' >" + 
				 						"<a href='javascript:void(0)'>" + 
				 							"<div>" + "<img src='" + item.icon + "' alt=''>" + "</div>" + 
				 							"<span>" + title + "</span>" + 
				 						"</a>" + 
				 						"<div class='contextmenu'>" + 
				 							child + 
				 						"</div>" + 
				 					"</li>";
	 				}
 				}
 			}
 			contenter+="</ul>";
 			return contenter;
 		},
 		/**
 		 * [addFun 为单独的菜单项绑定事件]
 		 */
        addFun: function() {
            var thisCaller = this;
            var $menu = thisCaller.$menu;

            $menu.delegate('li', {
                click: function(event) {
                    
                    var id = $(this).attr("id");
                    var callbackDefinetion = thisCaller.contextItem[id];

                    if (callbackDefinetion.callbackEnable && callbackDefinetion.callback) {
                        
                        callbackDefinetion.callback.call(thisCaller,$menu,this);
                        method.close.call(thisCaller, event);
                        
                    }

                    util.stopEventPropagation(event);
                },
                mouseover: function(event) {
                    
                    var id = $(this).attr("id");
                    var callbackDefinetion = thisCaller.contextItem[id];

                    //有子节点并且可以出发事件
                    if ($(this).hasClass('hasChild') && callbackDefinetion.callbackEnable) {
                        $(this).find(".contextmenu:first").show();
                    }

                },
                mouseleave: function(event) {
                    if ($(this).hasClass('hasChild')) {
                        $(this).find(".contextmenu:first").hide();
                    }
                }
            });
        },
 		/**
 		 * [callFuntion 执行某个函数]
 		 * @param  {fun} functionName [调用某个函数的名称]
 		 * @param  {type} paraObject  [参数]
 		 * @return {object}           [根据调用的函数决定]
 		 */
 		callFuntion:function(functionName,paraObject){
 			
            if(method.hasOwnProperty(functionName)){
 				method[functionName].call(this,paraObject);
 			}else{
 				alert("所调用的方法不存在:"+functionName);
 			}

 		},
 		/**
 		 * [menuBlur 在没有右键事件的区域单击右键，右键菜单消失]
 		 * @return {null} [description]
 		 */
 		menuBlur:function(){
 			$(document).unbind("click.contextMenuL contextmenu.contextMenuL").on({
 				'click.contextMenuL':function(e){
 					$(".contextmenu").remove();
 				},
 				'contextmenu.contextMenuL':function(e){
 					var target=util.getEventTarget(e);

 					//当前区域无contenxtMenuArea类，则表明当前区域无法触发右键事件
 					if(!$(target).hasClass('contenxtMenuArea')){
 						$(".contextmenu").remove();
 					}
 				}
 			});
 		},
 		/**
 		 * [bindHotkey 对热键进行绑定]
 		 * @return {null} [description]
 		 */
        bindHotkey: function() {
            var thisCaller = this;
            var $menu = thisCaller.$menu;
            var contextItem = thisCaller.contextItem;

            $(document).unbind("keydown.contextMenuL").bind("keydown.contextMenuL", function(e) {
                var key = String.fromCharCode(util.getKeyCode(e)).toUpperCase();

                for (var k in contextItem) {
                    var callbackDefinetion = contextItem[k];
                    if (callbackDefinetion.hotkey == key && callbackDefinetion.callbackEnable && callbackDefinetion.callback) {

                        callbackDefinetion.callback.call(this);
                        method.close.call(thisCaller, e);

                        break;
                    }
                }
            });
        }
 	}
 	/*公用函数，与具体的逻辑功能无关*/
 	var util={
        /**
         * 判断fun是否存在并且是一个函数
         * @param  {Function}  fun 函数名
         * @return {Boolean}       返回布尔值
         */
        isFunction: function(fun) {
            if (fun && typeof fun === "function") {
                return true;
            }
            return false;
        },
        /**
         * 获得浏览器兼容的事件目标对象
         * @param  {Event} e [事件对象]
         * @return {null}   [null]
         */
        getEventTarget: function(e) {
            var ee = e || window.event;
            return ee.target || ee.srcElement;
        },
        /**
         * [stopEventPropagation description]
         * @param  {[Event]} e [事件对象]
         * @return {[null]}   [null]
         */
        stopEventPropagation: function(e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        },
        /**
         * [getPostion 获得鼠标的位置]
         * @param  {[Event]} e [事件对象]
         * @return {[Object]}  [包含鼠标位置的对象]
         */
        getPostion: function(e) {
            var ee = e || window.event;
            var postion = {};
            postion.x = ee.x || ee.pageX;
            postion.y = ee.y || ee.pageY;
            return postion;
        },
        /**
         * [preventDefaultAction 阻止浏览器的默认事件]
         * @param  {[Event]} e [Event]
         * @return {[null]}    [null]
         */
        preventDefaultAction: function(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        /**
         * [getKeyCode 获得键盘的键值]
         * @param  {event} e  [键盘的按键值]
         * @return {number}   [按键的键值]
         */
        getKeyCode: function(e) {
            var ee = e || window.event;
            return ee.keyCode || ee.which;
        },
        /**
         * [letterToNum 字符转换成数字，如果是字符串，则取第一个字符进行转换]
         * @param  {string} str [字符串或是字符]
         * @return {number}     [字符对应的数字]
         */
        getHotKey: function(str) {
            if (!str) return -1;
            var charcode = (str + "").charAt(0);
            var code = charcode.charCodeAt() - 0;
            if (code > 64 && code < 123) {
                return charcode = charcode.toUpperCase();
            } else {
                return -1;
            }
        }
    };
 	//点击无右键菜单的地方的时候，右键菜单消失
 	contextmenuUtil.menuBlur();

    $.fn.contextMenuL = function() {
        var arg1 = arguments[0],
            arg2 = arguments[1];

        //初始化插件
        // 如果方法不存在，检验对象是否为一个对象（JSON对象）或者method方法没有被传入
        if (typeof arg1 == "object" || !arg1) {

            method.init.call(this, arg1);

        } else if (typeof arg1 == "string") {

            // 如果是字符串，则认为是函数名，执行该函数
            contextmenuUtil.callFuntion.call(this, arg1, arg2);

        }

        return this;
    }
 })(jQuery);