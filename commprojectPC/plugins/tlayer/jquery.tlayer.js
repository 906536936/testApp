;(function ($, window, undefined) {

    //把以下变量保存成局部变量
    var _top = top || window,
        document = window.document,
        navigator = window.navigator,
        location = window.location;

    //初始化弹窗
    _top.tlayer = _top.tlayer || {},
    window.tlayer = $.tlayer = _top.tlayer;
    var _tlayer = $.tlayer;

    //弹出框的方法
    var methods = {
        /**
         * 初始化弹出框
         * @return {Object} 弹出框的参数设置
         */
        init: function (options) {

            var tlayer = _tlayer;

            tlayer.globalSettings = tlayer.globalSettings || {};

            /**
             * 以下参数为公用参数，更多参数设置可在相应的弹出层中查看
             */
            var settings = $.extend({

                layerID         : false,        //自定义弹出框的id
                zIndex          : 1000,         //弹出框的层级，数值越大弹出框的层级越高
                showMask        : true,         //是否显示背景透明层
                bindEsc         : false,        //是否绑定Esc键关闭弹出框
                maskClass       : false,        //背景透明层的class属性，通过该class可自定义该层样式
                width           : "0px",        //整个弹出框的宽度，自带单位
                height          : "0px",        //整个弹出框的高度，自带单位
                animation       : "fade",       //动画效果 fade淡入(fadeIn)淡出(fadeOut), slide滑入(slideDown)滑出(slideUp), display显示(show)隐藏(hide)
                duration        : 300,          //显示和隐藏的时间
                context         : document,     //上下文对象，弹出框将被追加到哪个上下文中，默认当前文档
                onInit          : false,        //弹出框初始化时的回调函数
                onEsc           : false,        //当弹出框触发Esc按钮时执行的回调函数
                auto            : true,         //默认自动显示，否则使用$.tLayer("show", layerID);

                /**
                 * 弹出框分为：头部区域(header)、内容区域(content)和底部区域(footer)三部分组成
                 * 以下分别为各部分的参数设置说明
                 */
                
                header          : false,        //弹出框的头部参数设置。值为false时表示弹出框无头部
                /**
                 * 如果header存在，可按照以下格式设置相关参数 
                 *                
                 *  {             
                 *      text            : false,    //头部标题
                 *      height          : "30px",   //头部的高度，自带单位
                 *      buttons         : [         //头部按钮设置  
                 *          //第一个按钮
                 *          {
                 *              width           : "30px",   //按钮的宽度，自带单位
                 *              buttonText      : false,    //按钮文字
                 *              buttonBGImg     : false,    //按钮的背景图
                 *              buttonId        : false,    //按钮的id，可用于用户自定义设置按钮的样式
                 *              callback        : false,    //按钮点击时执行的操作
                 *          }
                 *          //多个按钮与第一个按钮的设置相同
                 *      ]       
                 *  }
                 *
                 */
                
                content         : {             //弹出框内容区域的设置  
                    
                    height      : "0px",        //头部的高度，自带单位

                    //当src和html属性同时存在，优先级依次降低
                   
                    src         : false,        //如果内容区域是通过绝对或相对路径来显示内容，
                                                //那么将会使用iframe来显示
                   
                    html        : false,        //一段文字或一段html代码
                    icon        : false         //文字或html代码前带的icon图标
                },        

                footer          : false         //弹出框的底部参数设置。值为false时表示弹出框无底部
                /**
                 * 如果footer存在，可按照以下格式设置相关参数
                 *
                 * {
                 *     height       : "35px"    //底部的高度，单位px
                 *     buttons      : [         //底部按钮设置
                 *         {
                 *             width           : "90px",   //按钮的宽度，自带单位
                 *             buttonText      : false,    //按钮文字
                 *             buttonBGImg     : false,    //按钮的背景图
                 *             buttonID        : false,    //按钮的id，可用于用户自定义设置按钮的样式
                 *             callback        : false,    //按钮点击时执行的操作
                 *         }
                 *     ]
                 * }
                 * 
                 */

            }, tlayer.globalSettings, options || {});

            //当前弹出框使用情况
            tlayer.layerData = $.extend({
                layers          : {},       //弹出框的集合
                layerLength     : 0,        //当前激活的弹出框的个数
                stack           : []        //弹出框堆栈
            }, tlayer.layerData || {});

            //组装一个弹出框，并返回该弹出框
            return layerUtil.excuteLayer.call(tlayer, settings);
        },
        /**
         * 设置tLayer全局settings的参数值
         * @return 无返回
         */
        global: function (options) {
            var tlayer = _tlayer;
            tlayer.globalSettings = tlayer.globalSettings || {};

            $.extend(tlayer.globalSettings, options || {});
        },
        /**
         * 关闭layerID对应的弹出窗口，并且销毁该窗口
         * @param  {String} layerID layer弹出框的id，不传代表关闭顶层弹窗
         * @param  {Function} fn    关闭弹窗之后的回调函数
         */
        close: function (layerID, fn) {
            var stack = _tlayer.layerData.stack;
            layerID = layerID || stack.pop();

            layerUtil.hideLayer(layerID, function () {

                //执行回调
                if (util.isFunction(fn)) {
                    fn.call(this, layerID);
                }

                //销毁该layer
                var layerData = _tlayer.layerData,
                    layers = layerData.layers;

                layers[layerID].layer.remove();

                //出栈
                util.removeOf.call(layerData.stack, layerID);

                //彻底销毁layer
                delete layers[layerID];

            });
        },
        /**
         * 显示layerID对应的弹出窗口
         * @param  {String} layerID layer弹出框的id
         * @param  {Function} fn    显示之后的回调函数
         * @return 无返回
         */
        show: function (layerID, fn) {

            layerUtil.showLayer(layerID, function () {
                if (util.isFunction(fn)) {
                    fn.call(this, layerID);
                }
            });
        },
        /**
         * 隐藏layerID对应的弹出窗口
         * @param  {String} layerID layer弹出框的id，不传代表隐藏顶层弹窗
         * @param  {Function} fn    隐藏之后的回调函数
         * @return 无返回
         */
        hide: function (layerID, fn) {
            var stack = _tlayer.layerData.stack;
            layerID = layerID || stack.pop();

            layerUtil.hideLayer(layerID, function () {
                if (util.isFunction(fn)) {
                    fn.call(this, layerID);
                }
            });
        },
        /**
         * [getContent 扩展方法，获得弹出框内容的iframe的window对象]
         * @type {jQuery 对象}
         * @fixer 张伦 2014-12-10
         * @useage {$.tLayer("getContent", layerID);}
         */
        getContent:function(layerID){
            var tlayer = _tlayer;
            //判断是否存在layer，否则不执行下面的操作
            if (!tlayer || !tlayer.layerData.layers[layerID]) { return false; }
            var layerData = tlayer.layerData,
                layer = layerData.layers[layerID],
                $layer = layer.layer;
            return $layer.find("iframe")[0].contentWindow;
        }
    };

    //弹出框工具函数
    var layerUtil = {

        /**
         * 组装一个弹出框
         * @param  {Object} settings 弹出框的参数设置
         * @return {Object} 返回弹出框的JQ对象
         */
        excuteLayer: function (settings) {
            var tlayer = this,
                layerData = tlayer.layerData;

            //生成弹出框的唯一id标识
            var layerID = settings.layerID || "tlayer_" + (layerData.layerLength);
            
            //若已存在该layer，则不允许再生成一个
            if (layerData.layers[layerID]) { return layerID; }

            layerData.layerLength++;

            //生成弹出框的容器
            var $layer = $("<div />", {
                "id"        : layerID,
                "class"     : "layer-box-wraper",
                "style"     : "z-index:"+settings.zIndex
            });

            layerData.layers[layerID] = {
                "layer"     : $layer,
                "settings"  : settings,
                "status"    : 0
            };

            //获取弹出框各个部分的HTML代码
            var mask    = layerUtil.mask.call(this, layerID),
                header  = layerUtil.header.call(this, layerID),
                content = layerUtil.content.call(this, layerID);
                footer  = layerUtil.footer.call(this, layerID);

            var style = ' style="width:'+settings.width+';'+
                               'height:'+settings.height+';"';
                               /*'margin-top:'+('-'+Math.round(parseInt(settings.height)/2)+'px;')+
                               'margin-left:'+('-'+Math.round(parseInt(settings.width)/2)+'px;"');*/

            //组合弹出框HTML代码
            var layer = mask+
                        '<div class="layer-box-container">'+
                            '<div class="layer-box-table" style="width:'+settings.width+';">'+
                                '<div class="layer-box-inner layer-box-table-cell"'+style+'>'+
                                    header+content+footer+   
                                '</div>'+
                            '</div>'
                        '</div>';

            $layer.append(layer);

            return $layer;
        },
        /**
         * 将layerID对应的弹出框追加到相应的document上下文对象下
         * @param  {String} layerID layer弹出框的id
         * @return 无返回
         */
        appendLayer: function (layerID) {
            var tlayer = _tlayer,
                layerData = tlayer.layerData,
                $layer = layerData.layers[layerID].layer,
                settings = layerData.layers[layerID].settings;
        
            //追加弹出框到响应的上下文对象上
            $(settings.context).find("body").append($layer);

            //给弹出框的所有按钮绑定click事件
            layerUtil.bindBtnClick(layerID);

            //执行初始化onInit
            if (util.isFunction(settings.onInit)) {
                settings.onInit.call($layer.get(0), layerID);
            }
        },
        /**
         * 生成背景层HTML代码
         * @param  {String} layerID layer弹出框的id
         * @return {String} 返回背景层的HTML代码
         */
        mask: function (layerID) {
            var tlayer = this,
                layerData = this.layerData,
                settings = layerData.layers[layerID].settings;

            var maskHTML = !settings.showMask ? '' :
                                '<div class="layer-box-mask'+(settings.maskClass ? ' '+settings.maskClass : '')+'">&nbsp;</div>';
            
            return maskHTML;
        },
        /**
         * 生成头部HTML代码
         * @param  {String} layerID layer弹出框的id
         * @return {String} 返回头部的HTML代码
         */
        header: function (layerID) {
            var tlayer = this,
                layerData = this.layerData,
                settings = layerData.layers[layerID].settings;

            var h = settings.header;

            //不需要头部区域
            if (!h) { return ""; }

            var height = h.height || "30px";

            //生成头部区域HTML
            var headerHTML  =   '<div class="layer-box-header" style="height:'+height+';line-height:'+height+';">'+
                                    '<h4>'+(h.text || "")+'</h4>'+
                                    layerUtil.buttons.call(this,layerID, h.buttons, "header")+
                                '</div>';

            return headerHTML;

        },
        /**
         * 生成内容区域的HTML代码
         * @param  {String} layerID layer弹出框的id
         * @return {String} 返回内容区域的HTML代码
         */
        content: function (layerID) {
            var tlayer = this,
                layerData = this.layerData,
                settings = layerData.layers[layerID].settings;

            var c = settings.content,
                h = settings.header,
                f = settings.footer;

            var height = parseInt(settings.height) - (parseInt(h.height || 0) + parseInt(f.height || 0));

            var style = ' style="height:'+(parseInt(c.height || height)-30)+'px;"';

            var contentHTML = '<div class="layer-box-content-wraper">'+
                                    '<div'+style+' class="layer-box-content-inner">';

            if (c.src) {
                //内容区域是通过一个外链来获取的，则使用iframe
                contentHTML += '<iframe class="layer-box-content layer-box-iframe" frameborder="0" scrolling="no" src="'+c.src+'"></iframe>';
            
            } else {
                //内容区域是一段html字符串
                var html = c.html || "&nbsp;",
                    icon = c.icon;

                //显示icon
                /*----------------------2015.0202 张伦 修改代码-----begin*/
                if (icon && icon!= "") {
                    var image = settings.context.createElement("img");
                    image.src = icon;
                    icon = image.src;
                }
                /*----------------------2015.0202 张伦 修改代码-----end*/
                
                var bgImg = icon ? ' style="background-image:url('+icon+');"' : '';
                //若显示icon，那么layer-box-content会有margin-left:25px的属性
                contentHTML += '<div'+bgImg+' class="layer-box-content layer-box-html'+(icon ? ' pl25' : '')+'">'+html+'</div>';
            }

            contentHTML += '</div></div>';

            return contentHTML;
        },
        /**
         * 生成底部HTML代码
         * @param  {String} layerID layer弹出框的id
         * @return {String} 返回底部的HTML代码
         */
        footer: function (layerID) {
            var tlayer = this,
                layerData = this.layerData,
                settings = layerData.layers[layerID].settings;

            var f = settings.footer;

            //不需要底部区域
            if (!f) { return ""; }

            var height = f.height || "35px";

            //生成头部区域HTML
            var footerHTML  =   '<div class="layer-box-footer" style="height:'+height+';line-height:'+height+';">'+
                                    layerUtil.buttons(layerID, f.buttons, "footer")+
                                '</div>';

            return footerHTML;

        },
        /**
         * 生成按钮HTML代码
         * @param  {String} layerID layer弹出框的id
         * @param  {Array}  buttons 按钮的对象集合
         * @param  {String} block   按钮的区域，取值"header"或"footer"
         * @return {String} 返回按钮的HTML代码
         */
        buttons: function (layerID, buttons, block) {
            var bLen = buttons && buttons.length;

            //按钮不存在时
            if (!bLen) { return ""; }

            var buttonsHTML = '<div class="layer-box-block-buttons">';//'</div>'

            /*----------------------2015.0202 张伦 修改代码-----begin*/
            var tlayer = this;                     
            var image = null;
            if(this.layerData){
                layerData = this.layerData,
                settings = layerData.layers[layerID].settings;
                image = settings.context.createElement("img");
            }
            /*----------------------2015.0202 张伦 修改代码-----end*/    

            for (var i = 0; i < bLen; i++) {
                var button = buttons[i];
                if (button.buttonBGImg && image) {//2015.0202 张伦 修改代码 
                    image.src = button.buttonBGImg;
                    button.buttonBGImg = image.src;
                }
                button.buttonID = button.buttonID || layerID+"-"+block+"-"+i;
                var attrs = {
                    "id"            : button.buttonID ? ' id="'+button.buttonID+'"' : '',
                    "cls"           : ' class="layer-button'+(i == 0 ? ' first-child' : '')+(i == (bLen - 1) ? ' last-child' : '')+((i % 2) == 0 ? ' odd' : ' even')+'"',
                    "text"          : button.buttonText || "&nbsp;",
                    "title"         : (button.buttonText ? ' title="'+button.buttonText+'"' : ''),
                    "style"         : ' style="'+(button.width ? 'width:'+button.width+';' : '')+(button.buttonBGImg ? 'text-indent:-9999px;background-image:url('+button.buttonBGImg+')' : '')+'"',
                    "unselectable"  : ' unselectable="on" onselectstart="return false;"'
                };

                buttonsHTML +=  '<div'+attrs.id+attrs.cls+attrs.title+attrs.style+attrs.unselectable+'>'+attrs.text+'</div>';

            }

            buttonsHTML += '</div>';

            return buttonsHTML;
        },
        /**
         * 为所有按钮绑定type事件
         * @param  {String} layerID layer弹出框的id
         * @param  {String} type    事件类型，例如: click, mouseenter, mouseleave等
         * @return 无返回
         */
        bindBtnClick: function (layerID, type) {
            var tlayer = _tlayer,
                layerData = tlayer.layerData,
                $layer = layerData.layers[layerID].layer,
                settings = layerData.layers[layerID].settings;

            type = type || "click";

            //header的button集合
            var hb = settings.header.buttons ? settings.header.buttons : [],

                //footer的button集合
                fb = settings.footer.buttons ? settings.footer.buttons : [],

                //header和footer的button的总集合
                hfb = [].concat(hb, fb);

            for (var i = hfb.length; i > 0; i--) {              
                (function (i) {
                    var b = hfb[i-1];
                    if (util.isFunction(b.callback)) {
                        $layer.find("#"+b.buttonID).bind(type, function () {
                            b.callback.call($layer.get(0), layerID);                                            
                        });
                    }
                } (i));
            }

        },
        /**
         * 绑定ESC键触发关闭layer操作
         * @return 无返回
         */
        bindEsc: function () {

            $(document).bind("keyup", function (e) {
                e = e || window.event;
                var code = e.keyCode || e.which;

                var tlayer = _tlayer;

                if (code == 27 && tlayer && tlayer.layerData) {
                    var layerData = tlayer.layerData,
                        layers = layerData.layers,
                        stack = layerData.stack;

                    if (stack.length != 0) {
                        var layerID = stack[stack.length - 1],
                            layer = layers[layerID],
                            settings = layer.settings;

                        if (layerID && settings.bindEsc) {
                            //关闭layer
                            methods.close(layerID, settings.onEsc);

                            e.stopPropagation();
                            return false;
                        }
                    }
                }
            });

        },
        /**
         * 显示弹出框(动画类型, 例如：show, fadeIn, slideDown等)
         * @param  {String} layerID layer弹出框的id
         * @return 无返回
         */
        showLayer: function (layerID, fn) {
            var tlayer = _tlayer;
            //判断是否存在layer，否则不执行下面的操作
            if (!tlayer || !tlayer.layerData.layers[layerID]) { return false; }

            var layerData = tlayer.layerData,
                layer = layerData.layers[layerID],
                $layer = layer.layer,
                settings = layerData.layers[layerID].settings;

            //判断layer是否已显示，否则不允许再显示
            if (util.inArray(layerID, layerData.stack) > -1) { return false; }

            //显示类型
            var animation = {
                "fade"      : "fadeIn",
                "slide"     : "slideDown",
                "display"   : "show"
            };
            animation = animation[settings.animation];

            var duration = settings.duration;

            /*-----------zhanglun add at 20150413-------------*/
            //  console.log(layerData);
            // console.log(layerData.stack);
            if(typeof layerData.stack != "object" || layerData.stack instanceof Array ==false){
                layerData.stack = [];
            }
            /*------------zhanglun add at 20150413------------*/


            //入栈
            layerData.stack.push(layerID)
            layerUtil.sortByZIndex.call(tlayer);

            $layer[animation](duration, function () {

                if (util.isFunction(fn)) {
                    fn.call($layer.get(0), layerID);
                }

            });

        },
        /**
         * 隐藏弹出框(动画类型, 例如：hide, fadeOut, slideUp等)
         * @param  {String} layerID layer弹出框的id
         * @return 无返回
         */
        hideLayer: function (layerID, fn) {
            var tlayer = _tlayer;

            //判断是否存在layer，否则不执行下面的操作
            if (!tlayer || !tlayer.layerData.layers[layerID]) { return false; }

            var layerData = tlayer.layerData,
                layer = layerData.layers[layerID],
                $layer = layer.layer,
                settings = layerData.layers[layerID].settings;

            if (!$layer.length) { return false; }

            //显示类型
            var animation = {
                "fade"      : "fadeOut",
                "slide"     : "slideUp",
                "display"   : "hide"
            };
            animation = animation[settings.animation];

            var duration = settings.duration;

            $layer[animation](duration, function () {

                if (util.isFunction(fn)) {
                    fn.call($layer.get(0), layerID);
                }

            });

        },
        /**
         * 为header和footer的buttons的callback重写具有隐藏弹出框功能
         * @param  {String} layerID layer弹出框的id
         */
        addHideFn: function (layerID) {
            var block = this,
                bLen = block.buttons.length;

            for (var i = 0; i < bLen; i++) {
                (function (i) {
                    var callback = block.buttons[i].callback;

                    block.buttons[i].callback = function () {
                        methods.close(layerID, callback);
                    };
                } (i));
            }
        },
        /**
         * 设置layer的状态
         * @param {Object} layer layer弹出框
         * @param {Int}    status  layer的状态，-1已销毁，0隐藏，1显示
         */
        setLayerStatus: function (layer, status) {
            layer.status = status;
        },
        /**
         * 获取layer的状态
         * @param {Object} layer layer弹出框
         * @return  {Int}            返回layer的状态值
         */
        getLayerStatus: function (layer) {
            return layer.status;
        },
        /**
         * 根据弹出框的zIndex从小到大排序
         * @return 无返回
         */
        sortByZIndex: function () {
            var tlayer = this,
                layerData = this.layerData,
                layers = layerData.layers;

            layerData.stack.sort(function (a, b) {
                var aZIndex = layers[a].settings.zIndex,
                    bZIndex = layers[b].settings.zIndex;

                return aZIndex - bZIndex;
            });
        }
    };

    //公用工具函数
    var util = {
        /**
         * 获取变量的类型
         * @param  {各类型} variable 变量
         * @return {String}          返回变量的类型, 如：number, array, function, object, string等
         */
        typeOf: function (variable) {
            var type = Object.prototype.toString.call(variable);
            return ((/\[object\s+(.*)\]/ig).exec(type)[1]).toLowerCase();
        },
        /**
         * 判断元素是否存在数组中
         * @param  {各种类型} item 要判断的元素
         * @param  {array}    arr  被判断的数组
         * @return {boolean}       返回布尔值
         */
        inArray: function (item, arr) {
            if ($.inArray) {
                return $.inArray(item, arr);
            } else {
                for (var i = arr.length-1; i > -1; i--) {
                    if (arr[i] == item) {
                        return i;
                    }
                }
                return -1;
            }
        },
        /**
         * 移除arr数组中index下标对应元素
         * @param  {Int} index   要移除的元素的下标
         * @return 返回被移除的元素
         */
        removeAt: function (index) {
            var len = this.length;
            if (index == 0) {
                return this.shift();            
            } else if (index == (len - 1)) {
                return this.pop();
            } else {
                var value = this[index];
                var newArr = [].concat(this.slice(0, index), this.slice((index + 1), len)),
                    newLen = newArr.length;
                for (var i = 0; i < newLen; i++) {
                    this[i] = newArr[i];
                }
                this.length = newLen;
                return value;
            }
        },
        /**
         * 移除数组中的元素
         * @param  {多类型} value 要移除的元素
         * @return {多类型}       返回被移除的元素
         */
        removeOf: function (value) {
            var index = util.inArray(value, this);
            if (index > -1) {
                return util.removeAt.call(this, index);
            }
            return false;
        },
        /**
         * 判断fun是否存在并且是一个函数
         * @param  {Function}  fun 函数名
         * @return {Boolean}       返回布尔值
         */
        isFunction: function (fun) {
            if (fun && typeof fun === "function") {
                return true;
            }
            return false;
        }

    };

    //定义各类弹出框
    var tlayer = {

        /**
         * 弹出一个类似alert的窗口
         * @param  {Object} options alert弹出框的参数设置
         * @return {String}         layer弹出框的id
         */
        alert: function (options) {

            if (util.typeOf(options) == "string") {
                options = {
                    content     : {
                        html    : options || ""
                    }
                };
            }

            //开启深度拷贝
            var settings = $.extend(true, {
                width           : "280px",
                height          : "150px",
                bindEsc         : true,
                content: {
                    height      : "115px",
                    icon        : "icon.png",
                    html        : ""
                },
                footer: {
                    buttons     : [{
                        width       : "100%",
                        buttonText  : "确定",
                        buttonID    : "sure"
                    }]
                }
            }, options || {}, {
                header          : false     //alert弹出框不允许出现头部
            });
            
            //alert弹出框只允许一个按钮出现
            settings.footer.buttons = [settings.footer.buttons[0]];

            var $layer = methods.init(settings);

            if (util.typeOf($layer) == "string") {
                //若$layer为字符串，则表示layer已存在
                return $layer;
            }

            $layer.addClass("layer-alert-box");

            var tlayer      = _tlayer,
                layerID     = $layer.attr("id"),
                settings    = tlayer.layerData.layers[layerID].settings;

            //重写alert的button的callback，使其能在点击时执行隐藏功能
            layerUtil.addHideFn.call(settings.footer, layerID);

            //追加弹出框到上下文对象中
            layerUtil.appendLayer(layerID);

            //是否立即显示弹出框
            if (settings.auto) {
                //显示弹出框
                layerUtil.showLayer(layerID);
            }

            return layerID;
        },
        /**
         * 弹出一个类似confirm的窗口
         * @param  {Object} options confirm弹出框的参数设置
         * @return {String}         layer弹出框的id
         */
        confirm: function (options) {

            if (util.typeOf(options) == "string") {
                options = {
                    content     : {
                        html    : options || ""
                    }
                };
            }

            //开启深度拷贝
            var settings = $.extend(true, {
                width           : "280px",
                height          : "150px",
                bindEsc         : true,
                content: {
                    height      : "115px",
                    icon        : "icon.png",
                    html        : ""
                },
                footer: {
                    buttons     : [{
                        width       : "50%",
                        buttonText  : "确定",
                        buttonID    : "yes"
                    }, {
                        width       : "50%",
                        buttonText  : "取消",
                        buttonID    : "no"
                    }]
                }
            }, options || {}, {
                header          : false     //alert弹出框不允许出现头部
            });

                        
            var buttons = settings.footer.buttons;

            //confirm弹出框底部只允许两个按钮出现
            settings.footer.buttons = [settings.footer.buttons[0], settings.footer.buttons[1]];

            var $layer = methods.init(settings);

            if (util.typeOf($layer) == "string") {
                //若$layer为字符串，则表示layer已存在
                return $layer;
            }

            $layer.addClass("layer-confirm-box");

            var tlayer      = _tlayer,
                layerID     = $layer.attr("id"),
                settings    = tlayer.layerData.layers[layerID].settings;

            //重写confirm的button的callback，使其能在点击时执行隐藏功能
            layerUtil.addHideFn.call(settings.footer, layerID);

            //追加弹出框到上下文对象中
            layerUtil.appendLayer(layerID);

            //是否立即显示弹出框
            if (settings.auto) {
                //显示弹出框
                layerUtil.showLayer(layerID);
            }

            return layerID;
        },
        /**
         * 淡入一个消息框，在一定的时间后淡出
         * @return {Object} options msg弹出框的参数设置
         * @return {String}         layer弹出框的id
         */
        msg: function (options) {

            if (util.typeOf(options) == "string") {
                options = {
                    content     : {
                        html    : options || ""
                    }
                };
            }

            //开启深度拷贝
            var settings = $.extend(true, {
                width           : "200px",
                height          : "70px",
                delay           : 2000,     //msg弹出框特有的延时消失时间，单位ms
                onClose         : false,    //关闭msg弹出框特有的回调函数
                content: {
                    height      : "70px",
                    icon        : "icon.png",
                    html        : ""
                }
            }, options || {}, {
                header          : false,    //msg弹出框不允许出现头部
                footer          : false     //msg弹出框不允许出现底部
            });

            var $layer = methods.init(settings);

            if (util.typeOf($layer) == "string") {
                //若$layer为字符串，则表示layer已存在
                return $layer;
            }

            $layer.addClass("layer-msg-box");

            var tlayer      = _tlayer,
                layerID     = $layer.attr("id"),
                settings    = tlayer.layerData.layers[layerID].settings;

            //追加弹出框到上下文对象中
            layerUtil.appendLayer(layerID);

            //是否立即显示弹出框
            if (settings.auto) {
                //显示弹出框
                layerUtil.showLayer(layerID, function () {
                    //msg弹出框显示停留settings.delay时间（ms）后消失
                    setTimeout(function () {
                        methods.close(layerID, settings.onClose);
                    }, settings.delay);
                });
            }

            return layerID;
        },
        /**
         * 弹出一个loading窗口，不消失
         * @return {Object} options msg弹出框的参数设置
         * @return {String}         layer弹出框的id
         */
        loading: function (options) {
            if (util.typeOf(options) == "string") {
                options = {
                    content     : {
                        html    : options || ""
                    }
                };
            }

            //开启深度拷贝
            var settings = $.extend(true, {
                width           : "200px",
                height          : "70px",
                content: {
                    height      : "70px",
                    icon        : "loading.gif",
                    html        : ""
                }
            }, options || {}, {
                header          : false,    //msg弹出框不允许出现头部
                footer          : false     //msg弹出框不允许出现底部
            });

            var $layer = methods.init(settings);

            if (util.typeOf($layer) == "string") {
                //若$layer为字符串，则表示layer已存在
                return $layer;
            }

            $layer.addClass("layer-loading-box");

            var tlayer      = _tlayer,
                layerID     = $layer.attr("id"),
                settings    = tlayer.layerData.layers[layerID].settings;

            //追加弹出框到上下文对象中
            layerUtil.appendLayer(layerID);

            //是否立即显示弹出框
            if (settings.auto) {
                //显示弹出框
                layerUtil.showLayer(layerID);
            }

            return layerID;
        },
        /**
         * 弹出一个内容弹出框
         * @return {Object} options content弹出框的参数设置
         * @return {String}         layer弹出框的id
         */
        content: function (options) {

            if (options && util.typeOf(options) == "object") {
                //开启深度拷贝
                var settings = $.extend(true, {
                    bindEsc         : true,
                    header          : {
                        height      : "30px",
                        text        : "标题",
                        buttons     : [{
                            buttonID    : "layer-cancel",
                            buttonText  : "关闭",
                            buttonBGImg : "cancel.png"
                        }]
                    }
                }, options || {});

                var $layer = methods.init(settings);

                if (util.typeOf($layer) == "string") {
                    //若$layer为字符串，则表示layer已存在
                    return $layer;
                }

                $layer.addClass("layer-content-box");
                $layer.find(".layer-box-footer").addClass("p020");

                var tlayer      = _tlayer,
                    layerID     = $layer.attr("id"),
                    settings    = tlayer.layerData.layers[layerID].settings;

                //content弹出框顶部只允许一个按钮出现
                settings.header.buttons = [settings.header.buttons[0]];

                //重写content的button的callback，使其能在点击时执行隐藏功能
                layerUtil.addHideFn.call(settings.header, layerID);

                //追加弹出框到上下文对象中
                layerUtil.appendLayer(layerID);

                //是否立即显示弹出框
                if (settings.auto) {
                    //显示弹出框
                    layerUtil.showLayer(layerID);
                }

                return layerID;
            }

            return false;           
        },
        /**
         * 自定义弹出窗口
         * @return {Object} options custom弹出框的参数设置
         * @return {String}         layer弹出框的id
         */
        custom: function (options) {
      
            if (options && util.typeOf(options) == "object") {
                //开启深度拷贝
                var settings = options || {};

                var $layer = methods.init(settings);

                if (util.typeOf($layer) == "string") {
                    //若$layer为字符串，则表示layer已存在
                    return $layer;
                }

                $layer.addClass("layer-content-box");
                $layer.find(".layer-box-footer").addClass("p020");

                var tlayer      = _tlayer,
                    layerID     = $layer.attr("id"),
                    settings    = tlayer.layerData.layers[layerID].settings;

                //追加弹出框到上下文对象中
                layerUtil.appendLayer(layerID);

                //是否立即显示弹出框
                if (settings.auto) {
                    //显示弹出框
                    layerUtil.showLayer(layerID);
                }

                return layerID;
            }

            return false;
        }
    };

    //直接在jQuery对象上扩展方法
    $.extend(tlayer);

    //在methods对象中扩展方法
    $.extend(methods, tlayer);
    
    _top.tLayer = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('方法 ' + method + ' 在window.tLayer中未定义！');
        }
    };

    $.tLayer = window.tLayer = _top.tLayer;

    //绑定esc键关闭layer弹窗
    layerUtil.bindEsc();

} (jQuery, window, undefined));