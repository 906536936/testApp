/**!
 * @description：与业务无关，避免浏览器的兼容性问题
 * @author：张伦
 */

var BASE_UTIL = {
    /**
     * [I18N 国际化的相关变量]
     * @type {Object}
     */
    I18N:{
        //数字变汉字
        num2word: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    },
    /**
     * [EVENT 事件相关的工具方法]
     * @type {Object}
     */
    EVENT : {
        /**
         * [getEventTarget 获取事件的对象]
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        getEventTarget: function(e) {
            var ee = e || window.event;

            return ee.target || ee.srcElement;
        },
        /**
         * [stopEventPropagation 阻止冒泡事件]
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        stopEventPropagation: function(e) {

            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        },
        /**
         * [getPostion 获取事件的鼠标位置]
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        getPostion: function(e){
            var ee      = e || window.event,
                postion = {};

            postion.x = ee.x || ee.pageX;
            postion.y = ee.y || ee.pageY;
            return postion;
        },
        /**
         * [preventDefaultAction 阻止默认事件]
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        preventDefaultAction: function(e){

            if(e&&e.preventDefault){
                e.preventDefault();
            }else{
                e.returnValue = false;
            }
        },
        /**
         * [获得按键码，比如按下0，得到的是48]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        getCharCode: function(event){

            if (typeof event.charCode == "number") {
                return event.charCode;
            } else {
                return event.keyCode;
            }
        },
        /**
         * [getWhielDirection 获取鼠标的滚动方向]
         * @param  {Object} event [事件对象]
         * @return {[type]}       [description]
         */
        getWhielDirection: function (event) {
            var wheelDelta = "";
            // HTML5及IE的鼠标事件支持wheelDelta属性
            // 向上，则属性值为120，向下则为-120
            if(event.wheelDelta){
                wheelDelta = event.wheelDelta;

            }else if(event.originalEvent && event.originalEvent.wheelDelta) {
                wheelDelta = event.originalEvent.wheelDelta;

            // 火狐中鼠标滚动事件支持detail属性，向上为-3，向下为3
            }else {
                wheelDelta = -event.detail * 40;
            }

            return wheelDelta > 0 ? "UP" : "DOWN";
        }
    },

    /**
     * [UI dom元素相关的工具方法]
     * @type {Object}
     */
    UI : {
        /**
         * [autoResizeImage 根据图片的打下进行等比例的缩放]
         * @param  {number} _maxwidth  [容器最大的长度]
         * @param  {number} _maxheight [容器最大的宽度]
         * @param  {number} _imgwidth  [图片的实际尺寸]
         * @param  {number} _imgheight [图片的实际尺寸]
         * @return {json}              [显示时图片的尺寸]
         */
        autoResizeImage: function(_maxwidth,_maxheight,_imgwidth,_imgheight){
            var obj = {
                w: 0,
                h: 0
            };
            var maxWidth  = _maxwidth,
                maxHeight = _maxheight,
                hRatio    = null,
                wRatio    = null,
                Ratio     = 1,
                w         = _imgwidth,
                h         = _imgheight;

            wRatio = maxWidth / w;
            hRatio = maxHeight / h;

            if (maxWidth == 0 && maxHeight == 0) {
                Ratio = 1;
            } else if (maxWidth == 0) { //
                if (hRatio < 1) Ratio = hRatio;
            } else if (maxHeight == 0) {
                if (wRatio < 1) Ratio = wRatio;
            } else if (wRatio < 1 || hRatio < 1) {
                Ratio = (wRatio <= hRatio ? wRatio : hRatio);
            }

            if (Ratio < 1) {
                w = w * Ratio;
                h = h * Ratio;
            }

            obj.w = w;
            obj.h = h;
            return obj;
        },
        /**
         * [isScroll 判断某个容器是否出现了滚动条]
         * @param  {[type]}  el [dom对象]
         * @return {Boolean}    [description]
         */
        isScroll: function(el) {
            // test targets
            var elems = el ? [el] : [document.documentElement, document.body];
            var scrollX = false,
                scrollY = false;

            for (var i = 0,len = elems.length; i < len; i++) {
                var o = elems[i];
                // test horizontal
                var sl = o.scrollLeft;
                o.scrollLeft += (sl > 0) ? -1 : 1;
                o.scrollLeft !== sl && (scrollX = scrollX || true);
                o.scrollLeft = sl;
                // test vertical
                var st = o.scrollTop;
                o.scrollTop += (st > 0) ? -1 : 1;
                o.scrollTop !== st && (scrollY = scrollY || true);
                o.scrollTop = st;
            }
            // ret
            return {
                scrollX: scrollX,
                scrollY: scrollY
            };
        }
    },

    /**
     * [BASIC js基本方法，与js引擎相关]
     * @type {Object}
     */
    BASIC : {
        /**
         * [getArgs 取出url参数字符串中对应key的参数]
         * @param  {[type]} argsStr  [具体的url]
         * @param  {[type]} argsAame [参数名称]
         * @return {[string]}        [不存在指定参数则返回空字符串]
         */
        getArgs: function(argsStr,argsAame){
            if (argsStr == null) {
                return "";
            }

            var pattern = new RegExp("(?:[&?])" + argsAame + "=([^&]*)(?:&|$)", "ig");
            var result = pattern.exec(argsStr);

            if (result != null && result[1] != null) {
                return result[1];
            }
            return "";
        },
        /**
         * [getDateStrFrmt   根据pattern格式化日期]
         * @param  {[type]} utcString [description]
         * @param  {[type]} pattern   [例如yyyy-MM-dd hh:mm:ss]
         * @return {[type]}           [description]
         */
        getDateStrFrmt: function(utcString, pattern) {
            if (!utcString) return "";
            var res = pattern;
            var d = null;
            if (utcString instanceof Date) {
                d = utcString;

            } else {
                var timeLength = (utcString + "").length;

                //使用的是毫秒数
                if (timeLength == 13 && !/\D/.test(utcString + "")) { 
                    utcString = Math.floor(utcString - 0);

                //使用的秒数
                } else if (timeLength == 10 && !/\D/.test(utcString + "")) { 
                    utcString = Math.floor(utcString - 0) * 1000;
                }

                //时间字符串
                if (typeof utcString == "string") {
                    //火狐浏览器不支持new Date("2014-12-12 12:12:12")的形式，只能使用
                    //                new Date("2014/12/12 12:12:12")
                    utcString = utcString.replace(/-/gi, "/");
                }
                d = new Date(utcString);
            }

            //不合法的日期
            if (isNaN(d.getTime())) { 
                return "";
            }

            var month = d.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }

            var date = d.getDate();
            if (date < 10) {
                date = "0" + date;
            }

            var year = d.getFullYear();
            var hour = d.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }

            var minute = d.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }

            var secomnd = d.getSeconds();
            if (secomnd < 10) {
                secomnd = "0" + secomnd;
            }

            var millsecond = d.getMilliseconds();
            res = res.replace("yyyy", year);
            res = res.replace("MM", month);
            res = res.replace("dd", date);
            res = res.replace("hh", hour);
            res = res.replace("mm", minute);
            res = res.replace("ss", secomnd);
            return res;
        }
    },
    /**
     * [MATH 处理运算]
     * @type {Object}
     */
    MATH: {
        /**
         * [sumBigIntStrings 加大整数相加，入参必须以字符串的形式上]
         * @param  {string} a [description]
         * @param  {string} b [description]
         * @return {[type]}   [description]
         */
        sumBigIntStrings: function(a,b){
            var res='', c=0;
            a = a.split('');
            b = b.split('');
            while (a.length || b.length || c){
                c += ~~a.pop() + ~~b.pop();
                res = c % 10 + res;
                c = c>9;
            }
            return res.replace(/^0+/,'');
        }
    },
    /**
     * [FIlE 文件相关的操作类]
     * @type {Object}
     */
    FILE:{
        /**
         * [getFileName 给定文件的路径，获取]
         * @param  {[type]} filePath [description]
         * @return {[type]}          [description]
         */
        getFileName: function(filePath){
            
            if(typeof filePath != "string" || filePath == ""){
                return {
                    fileName:"",
                    name:"",
                    suffix:""
                };
            }

            var index = filePath.lastIndexOf("/") ;
                index == -1 ? index = 0 : "";
            var fileName = filePath.substr(index);
            return {
                fileName:fileName,
                name:fileName.split(".")[0],
                suffix:fileName.split(".")[1]
            };
        },
        /**
         * [getFileSize 获取图片的尺寸大小]
         * @param  {file} file [文件对象或者文件路径]
         * @param  {function} fn [回调函数，由于是图片加载完成之后才能获取属性，故存在回调]
         * @return {[type]} [description]
         */
        getImgSize: function(file,fn){
            var type_ = typeof file;

            if(type_ != "string" && type_ != "object"){
                console.log("file type error，not a string or file!");
            }

            //不支持FileReader对象
            if (typeof FileReader === 'undefined') {
                console.log("not support FileReader object!");
                return {};  
            }

            //用于构建图片对象
            var imgobj   = new Image(),
                fileSize = {};

            //如果是文件，则通过filereader读取文件，将文件数据读出以base64的方式生成图片
            if(type_ === "object" && file.constructor.name === "File"){
                var reader = new FileReader();

                reader.onload = function(e){
                    console.log(this);
                    getImageSize(this.result);
                };

                reader.readAsDataURL(file);

            //直接是图片地址
            }else{
                var fileUrl = file;
                getImageSize(fileUrl);
            }

            //内部函数，获取图片大小
            function getImageSize(fileSrc){
                imgobj.src = fileSrc;

                imgobj.onload = function(e){
                    fileSize.width = this.width;
                    fileSize.height = this.height;

                    if(typeof fn == "function"){
                        fn(fileSize,imgobj);
                    }
                };
            }
            
        },
        /**
         * [getImgBase64 根据url获取图片的base64 二进制数据]
         * @return {[type]} [description]
         */
        getImgBase64: function(url,fn){
            var type = this.getFileName(url).suffix;
            $.ajax({
                type: "get",
                url: url,
                success:function(res){
                    var blob = new Blob([res],{"type":"image/"+type});

                    var fr = new FileReader();

                    fr.onload = function(){
                        if(typeof fn == "function"){
                            //base64二进制的数据，
                            //文件大小
                            fn(this.result,blob.size);
                        }
                    };

                    fr.readAsDataURL(blob);

                },
                error:function(){
                    console.log(arguments);
                },
                //指定响应格式， 为XMLHttpRequest Leve2 新增的成员
                //用户获取图片文件的二进制文件用于制作blob对象从而获取base64数据和大小
                beforeSend:function(xhr,s){
                    xhr.responseType = "blob";
                }
            });
        },
        /**
         * [getContentSize 根据base64 二进制创建文件，获取大小]
         * @param  {[type]} base64Data [description]
         * @return {[type]}            [description]
         */
        getContentSize: function(base64Data){
            if(typeof File === "undefined"){
                console.log("browser not support File");
                return 0;
            }

            return new File([base64Data],"").size;
        }
    }
    
};

