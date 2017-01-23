 /*
  * @author    zhanglun
  * @e-mail    906536936@qq.com
  * @Date      2015-10-01
  * @copyright everyone for free
  */

/*----------------------------------------------------
    DOM 结构：
    <div class="pages">
        <div class="pageBar">
            <span class="pageBar-index pageBar-pageDisable">首页</span>
            <span class="pageBar-prePage pageBar-pageDisable">上一页</span>
            <div class="pageBar-pages">
                <span class="pageBar-page pageBar-pageNumFocus" value="1">1</span>
                <span class="pageBar-page" value="2">2</span>
                <span class="pageBar-page" value="3">3</span>
                <span class="pageBar-page" value="4">4</span>
            </div>
            <span class="pageBar-nextPage">下一页</span>
            <span class="pageBar-lastPage">末页</span>
            <input class="pageBar-gotoPage" type="text"><label class="pageBar-allPage">/4页</label>
        </div>
    </div>
----------------------------------------------------*/
;
(function($) {
    var defaultOptions = {
        numberSize: 5,                          //显示几个页码数
        pageSize: 15,                           //一页信息条数
        showSelectPageSize: false,              //显示一页有多少条数据的select
        storePageSize: true,                    //设置分页条后是否记住保存至cookie中.依赖jQuery.cookie.js
        url: "",                                //请求的url
        pagesIndex: 'pageidx',                  //第几页，用于传给后台的参数
        pagesNumber: 'pagenum',                 //一页条数的字段
        currentPage: 1,                         //当前页
        inputVale: "",                            
        total: 'total',                         //ajax返回的请求中保存
        success: function(data, pagsIndex) {
        },
        error: function(pagsIndex) {
        }
    };
    var options = {};
    var $pageBar = {};

    var method = {
        /**
         * [modifyPara 修改请求url中的参数]
         * @param  {{key:value}} para  [参数以及其值]
         * @param  {boolean} execute [是否逻辑执行,true修改后立即执行，否则下次翻页时执行]
         * @return {[type]}         [description]
         */
        modifyPara: function(para, execute, callback) {
            var url_ = this.options.url;
            
            //将url中的参数替换
            for (var key in para) {
                
                if (url_.indexOf(key) > -1) {
                    url_ = url_.replace(key + "=" + util.getArgs(url_, key), key + "=" + para[key]);
                }

            }

            //更新url
            this.options.url = url_;
            options = this.options;
            
            //对否理解执行
            if (execute) {

                //立即执行则从第一页开始请求
                options.currentPage = 1;

                //渲染页码
                pagesUtil.drawPage("page");
                
                //请求数据
                pagesUtil.requestData.call(this, options.currentPage, callback);
            }
        },
        /**
         * [init 初始化分页插件]
         * @param  {[type]} setting [description]
         * @return {[type]}         [description]
         */
        init: function(setting) {
            $(this).empty();

            $pageBar = $(this);

            //初始化参数并进行容错
            options = pagesUtil.initOptions.call(this, setting);

            var self = this;
            this.options = options;

            //第一次请求数据，请求成功再次设置参数
            pagesUtil.requestData.call(self, 1, function() {
                
                //生成分页菜单
                var $pages = pagesUtil.executePages.call(self, options);

                //添加事件响应
                pagesUtil.addFun.call(self, options);
            });
        }
    };
    var pagesUtil = {
        /**
         * [initOptions 初始化参数并进行容错]
         * @param  {object} opt [用户设置的参数]
         * @return {object}     [合并的参数]
         */
        initOptions: function(opt) {
            var temp = {};

            //合并参数
            temp = $.extend({}, defaultOptions, opt);   

            //如果设置了记住每页的条数，
            //首先判断cookie中是否存在一页条数，如果存在，则需要以cookie中的值为一页条数
            if (temp.showSelectPageSize && temp.storePageSize) {
                var pageSize = util.getCookieByName("pagesize_pages_js");
                
                // cookie中的一页条数有效，则使用该值作为一页的条数
                if (pageSize != "" && !!pageSize) {
                    temp.pageSize = pageSize;
                }
            }

            //总共的页数
            temp.totalPage = 1;                         

            //总共的数据条数
            temp.pageNumber = 1;    

            //返回初始化后台的参数                    
            return temp;
        },
        /**
         * [executePages 组装页码，首页，末页dom元素]
         * @param  {[type]} opt [description]
         * @return {[type]}     [description]
         */
        executePages:function(opt){
            var before = "",
                after  = "";

            //当前页为第一页则上一页及首页按钮不能点击
            if (opt.currentPage == 1) {
                
                before = "<span class='pageBar-index pageBar-pageDisable' >首页</span>" +
                         "<span class='pageBar-prePage pageBar-pageDisable'>上一页</span>";

            } else {

                before = "<span class='pageBar-index' >首页</span>"+
                         "<span class='pageBar-prePage'>上一页</span>";

            }

            //当前页为最后一页，则下页及末页不可点击
            if (opt.currentPage == opt.totalPage) {
                
                after = "<span class='pageBar-nextPage pageBar-pageDisable'>下一页</span>"+
                        "<span class='pageBar-lastPage pageBar-pageDisable'>末页</span>";

            } else {
                
                after = "<span class='pageBar-nextPage'>下一页</span>"+
                        "<span class='pageBar-lastPage'>末页</span>";

            }

            //跳转到第几页的输入框
            var input = "<input class='pageBar-gotoPage' type='text'/>"+
                        "<label class='pageBar-allPage'>/" + 
                            opt.totalPage + 
                        "页</label>";

            var pagesStr = "<div class='pageBar-pages'>";

            for (var i = 0; i < opt.numberSize && i < opt.totalPage; i++) {
                
                //默认第一页不可点击
                if (0 == i) {
                    pagesStr = pagesStr + 
                               "<span  class='pageBar-page pageBar-pageNumFocus' value='" + (opt.currentPage + i) + "'>" + 
                                   (opt.currentPage + i) + 
                               "</span>";

                } else {
                    
                    pagesStr = pagesStr + 
                               "<span  class='pageBar-page' value='" + (opt.currentPage + i) + "'>" + 
                                   (opt.currentPage + i) + 
                               "</span>";
                
                }

            }

            pagesStr += "</div>";

            //用于选择一页显示多少条的插件
            //根据 opt.showSelectPageSize 判断是否显示
            //次数仍然可扩展，option的数据可由外部参数决定，由于当前项目不需要此功能
            //所以后期可根据需求扩展
            var pageSizeSelect = opt.showSelectPageSize ?  
                                "<select class='pageSizeSelect'>"+
                                    "<option value='20'>20个/页</option>"+
                                    "<option value='30'>30个/页</option>"+
                                    "<option value='50'>50个/页</option>"+
                                 "</select>" : 
                                 "";

            //组装dom
            $pageBar.html(before + pagesStr + after + input +pageSizeSelect);

            $pageBar.find(".pageSizeSelect option[value="+opt.pageSize+"]").prop("selected",true);
            
            //返回翻页条jQuery对象
            return $pageBar;

        },
        /**
         * [addFun 为页码元素添加事件]
         * @param {options} opt [options]
         */
        addFun:function(opt){
            var self = $(this);
            
            //防止分页条被select中
            $(self).on({
                selectstart: function() {
                    return false;
                }
            });

            var that = this;

            //首页
            self.find(".pageBar-index").unbind("click.pages").bind("click.pages", function() {
               
                //当前页为第一页，或者当前页具有不可点击的样式pageBar-pageDisable，则不做处理
                if (options.currentPage == 1 || $(this).hasClass('pageBar-pageDisable')) {
                    return;
                }

                //设置当前页为第一页
                options.currentPage = 1;

                // 绘制首页为当前页的 页码dom
                pagesUtil.drawPage("index");

                //请求数据
                pagesUtil.requestData.call(that, 1, function() {});
            });

            //上一页
            self.find(".pageBar-prePage").unbind("click.pages").bind("click.pages", function() {

                //当前页为第一页，或者当前页具有不可点击的样式pageBar-pageDisable，则不做处理
                if (options.currentPage == 1 || $(this).hasClass('pageBar-pageDisable')) {
                    return;
                }

                //确定当前页
                var number = options.currentPage = options.currentPage - 1;

                //绘制上一页为当前页时的dom元素
                pagesUtil.drawPage("prePage");

                //请求数据
                pagesUtil.requestData.call(that, number, function() {});
            });

            //最后一页
            self.find(".pageBar-lastPage").unbind("click.pages").bind("click.pages", function() {
                
                //当前页为最后一页，或者当前页具有不可点击的样式pageBar-pageDisable，则不做处理
                if (options.currentPage == options.totalPage || $(this).hasClass('pageBar-pageDisable')) {
                    return;
                }

                //确定当前页为最后一页
                options.currentPage = options.totalPage;

                //绘制最后一页为当前页时的dom元素
                pagesUtil.drawPage("lastPage");

                //请求数据
                pagesUtil.requestData.call(that, options.totalPage, function() {});

            });

            // 下一页
            self.find(".pageBar-nextPage").unbind("click.pages").bind("click.pages", function() {
                
                //当前页为最后一页，或者当前页具有不可点击的样式pageBar-pageDisable，则不做处理
                if (options.currentPage == options.totalPage || $(this).hasClass('pageBar-pageDisable')) {
                    return;
                }

                //确定当前页
                var number = options.currentPage = options.currentPage + 1;

                //绘制下一页为当前页时的dom元素
                pagesUtil.drawPage("nextPage");

                //请求数据
                pagesUtil.requestData.call(that, number, function() {});

            });

            //设置一页的条数
            self.on({
                change:function(e){
                   
                    var pageSize = $(this).find(":selected").attr("value");
                     
                    //获取设置的一页的条数
                    opt.pageSize = pageSize - 0;
                    
                    if (opt.storePageSize) {
                        //如果需要让每一个分页条都记住一页的条数，则需要保存在cookie中，
                        //需要加载jquery.cookie.js
                        util.storeInfoInCookie("pagesize_pages_js", opt.pageSize);
                    }

                    //设置一页的条数后，需要重新初始化
                    method.init.call(that,opt);
                }
            },".pageSizeSelect");

            // 数字元素
            self.on({
                click: function(e) {
                    if ($(this).hasClass('pageBar-pageNumFocus') 
                        || $(this).hasClass('pageBar-pageDisable')) {

                        return;
                    } else {
                        
                        //在页码可点击的情况下，确定点击的页码
                        var number = options.currentPage = parseInt($(this).text());

                        //如果点击的是分页条数上的页数，则页码焦点变化，页码数不变
                        pagesUtil.drawPage("page");

                        //请求数据
                        pagesUtil.requestData.call(that, number, function() {});
                    }
                }
            },"span.pageBar-page");

            //输入页数跳转
            self.on({
                keyup: function() {
                    
                    //只能输入数字
                    var value = $(this).val().toString().replace(/\D/g, "");
                    $(this).val(value);
                },
                keydown: function(event) {
                   
                    //获取输入的数字，按键值
                    var pageValue = $(this).val(),
                        eve       = window.event || event,
                        keycode   = eve.keyCode || eve.which;

                    //回车
                    if (keycode == 13) { 
                        
                        //输入空或者不合法的数字（小于0，大于最大页），则给出提示，不出处理
                        if (pageValue == '' || pageValue < 0 || pageValue > options.totalPage) {
                            alert("该页码不存在！");
                            return;

                        //输入的数字合法
                        } else {
                            //根据输入的数字确定当前页
                            options.currentPage = pageValue - 0;
                            
                            //当前页为输入的值，则需要重新确定第一页及最后一页的数字，
                            //重新绘制页码
                            pagesUtil.drawPage("gotoPage");

                            //请求数据
                            pagesUtil.requestData.call(that, pageValue, function() {});
                        }
                    }
                }
            },"input.pageBar-gotoPage");

        },
        /**
         * [requestData 请求数据]
         * @param  {integer}   number[要查询的页数]
         * @param  {function} fn     [请求数据成功需要做的操作]
         * @return {null}            [null]
         */
        requestData: function(number, fn) {
            var self = this;
            var url_ = options.url;

            if (url_.indexOf("?") == -1) {
                url_ += "?";
            } else {
                url_ += "&";
            }

            //组装url，主要加上参数：第几页，一页的条数
            url_ += options.pagesIndex + "=" + number + "&" + 
                    options.pagesNumber + "=" + options.pageSize;
            
            //请求数据
            util.ajax.call(this, url_, function(data) {
               
                //确定总共的数据条数，如果tatal为0，则设置为一条
                //避免确定页数时出错
                options.pageNumber = data["" + options.total] || 1;
                
                // 总共页数
                options.totalPage = Math.floor((options.pageNumber - 1) / options.pageSize) + 1;
                
                // 更新参数
                self.options = options;
               
                //执行回调
                if (fn && typeof fn === "function") {
                    fn.call(self);
                }

                //将获取到的数据及当前页传递出去
                options.success(data, number);

            //请求失败
            }, function(xmlhttp, error) {

                //将错误参数传递出去
                options.error(xmlhttp, error, number);

            });
        },
        /**
         * [drawPage 请求数据成功后，在刷新页码]
         * @param  {string} action [表示进行操作后刷新页码]
         * @return {[type]}        [description]
         */
        drawPage:function(action){
            
            //获取分页条jQuery对象
            options.pages = options.pages || $("span.pageBar-page");
            
            //根据不同的动作，绘制不同的页码
            switch(action){
                case 'page':
                    break;
                
                //用户点击了第一页后
                case 'index':

                    options.pages.each(function(index) {
                        // 从第一页开始，更新页码数即可    
                        $(this).attr("value", options.currentPage + index)
                               .text(options.currentPage + index);
                    });
                    break;

                //用户点击了上一页
                case 'prePage':
                    
                    //点击上一页后需要现显示的页（即现在的当前页）码数不在当前分页条上，
                    //则重现绘制页码数
                    if ($("span[value='" + options.currentPage + "']").length == 0) {

                        //当前页放在第一位，依次递增，更新页码数
                        options.pages.each(function(index) {
                            var page_ = options.currentPage + index;

                            $(this).attr("value", page_).text(page_);
                        });
                    }

                    break;

                //点击下一页或最后一页
                case 'nextPage':
                case 'lastPage':

                    // 需要现显示的页（即现在的当前页）码数不在当前分页条上，
                    // 则需要重新确定 分页条上的第一位及最后一位的页码数字，
                    // 重现绘制页码数
                    if ($("span[value='" + options.currentPage + "']").length == 0) {
                        var length = options.pages.length;
                        
                        //确定第一位的数字
                        var start  = options.currentPage - length + 1;
                        
                        options.pages.each(function(index) {
                            $(this).attr("value", start + index).text(start + index);
                        });
                    }
                    break;

                //输入数字后跳转
                case 'gotoPage':
                    var high = $(".pageBar-page:last").text()-0;
                    var low  = $(".pageBar-page:first").text()-0;

                    //当需要跳转的页在分页条上不可见时
                    //选取currentpage附近的options.numberSize个数
                    if (low > options.currentPage || options.currentPage > high) { 
                        var arr = [];
                        
                        arr.push(options.currentPage);
                       
                        //以currentPage为中心选取nubersize个数字
                        for (var i = 1; arr.length < options.numberSize; i++) {
                            var temp = options.currentPage - 0 + i;

                            if (temp <= options.totalPage && temp > 0) {
                                arr.push(temp);
                            }

                            temp = options.currentPage - 0 - i;

                            if (arr.length < options.pageSize && temp <= options.totalPage 
                                && temp > 0) {
                            
                                arr.push(temp);
                            }
                        }
                       
                        // 从小到大排序
                        arr.sort(function(a, b) {
                            return a - b;
                        });

                        //更新页码
                        options.pages.each(function(index, val) {
                            $(this).text(arr[index]);
                            $(this).attr("value", arr[index]);
                        });
                    }
                    break;
            }

            //当前页为第一页，则上一页及首页按钮不可点击
            if (options.currentPage == 1) {
                $pageBar.find(".pageBar-index").addClass("pageBar-pageDisable");
                $pageBar.find(".pageBar-prePage").addClass("pageBar-pageDisable");
            } else {
                $pageBar.find(".pageBar-index").removeClass("pageBar-pageDisable");
                $pageBar.find(".pageBar-prePage").removeClass("pageBar-pageDisable");
            }
            
            // 当前页为最后页，则下一页及末页按钮不可点击
            if (options.currentPage == options.totalPage) {
                $pageBar.find(".pageBar-lastPage").addClass("pageBar-pageDisable");
                $pageBar.find(".pageBar-nextPage").addClass("pageBar-pageDisable");
            } else {
                $pageBar.find(".pageBar-lastPage").removeClass("pageBar-pageDisable");
                $pageBar.find(".pageBar-nextPage").removeClass("pageBar-pageDisable");
            }

            // 让当前页获取焦点
            $pageBar.find(".pageBar-pageNumFocus").removeClass('pageBar-pageNumFocus');
            $pageBar.find("span[value='" + options.currentPage + "']").addClass('pageBar-pageNumFocus');
        }
    };

    //普通工具类
    var util = {
        /**
         * [ajax 进行ajax请求]
         * @param  {[type]} _url     [description]
         * @param  {[type]} _success [description]
         * @param  {[type]} _error   [description]
         * @return {[type]}          [description]
         */
        ajax:function(_url,_success,_error){
            var self = this;
            
            //取消上一次的请求
            if (!!self.xhr && !!self.xhr.abort) {
                self.xhr.abort();
            }

            //解决部分跨域问题
            jQuery.support.cors = true;
            
            self.xhr = $.ajax({
                type: 'get',
                url: _url,
                cache: false,
                timeout: 30000,
                dataType: "json",
                success: function(r) {
                    _success.call(self, r);
                },
                error: function(XmlHttp, msg) {
                    _error(XmlHttp, msg);
                }
            });
        },
        /**
         * [getArgs 取出url参数字符串中对应key的参数]
         * @param  {[type]} argsStr  [包含参数的和值的url]
         * @param  {[type]} argsAame [key]
         * @return {[type]}          [description]
         */
        getArgs: function(argsStr, argsAame) {
            if (argsStr == null) return null;
            var pattern = new RegExp("(?:[&?])" + argsAame + "=([^&]*)(?:&|$)", "ig");
            var result = pattern.exec(argsStr);
            if (result != null && result[1] != null) {
                return result[1];
            }
            return null;
        },
        /**
         * [storeInfoInCookie 将某个键值对存储在cookie中]
         * @param  {[type]} argname  [description]
         * @param  {[type]} argValue [description]
         * @return {[type]}          [description]
         */
        storeInfoInCookie:function(argname,argValue){
            var $cookie_ = $.cookie || top.$.cookie;
            if( typeof($cookie_ ) == "function"){
                $cookie_(argname,argValue,{expiress:3});
                return true;
            }else{
                alert("分页插件需要使用jquery.cookie.js文件，请加载！");
                return false;
            }
        },
        /**
         * [getCookieByName 获取cookie中的值]
         * @param  {[type]} argname [description]
         * @return {[type]}         [description]
         */
        getCookieByName:function(argname){
            var $cookie_ = $.cookie || top.$.cookie;
            if( typeof($cookie_ ) == "function"){
                return $cookie_(argname);
            }else{
                alert("分页插件需要使用jquery.cookie.js文件，请加载！");
                return "";
            }
        }
    };
   
    var pages = {
        showPages: function(options) {
            method.init.call(this, options);
            
            this.options = options;
            
            this.modifyPara = method.modifyPara;
            
            return this;
        }
    };

    $.extend($.fn,pages);
})(jQuery);