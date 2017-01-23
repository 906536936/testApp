/*系统公用的函数，表格头信息等*/

/*-----------------------------全局变量----------------------begin*/
var userid      = top.userid,
    accesstoken = top.accesstoken;

var system_id = 24;                                          //当前子系统id

var COMMON_GLOBAL = {                                       //整个系统的全局变量，为了方式作用域冲突，故设立COMMON_GLOBAL
    SYSTEM_ID: system_id,
    SYSTEM_NAME: "意见反馈管理系统",
    defaultAppPoster :"",
    PAGE_SIZE   : 50,                                       //每一页显示的数据条数，                                   
    DISPLAYTIME : 1000,                                     //提示框显示的时间
    
    MESSAGE : {                                             //提示消息定义
        SERVER_ERROR: "服务器异常",
        ADD_SUCCESS: "新增成功",
        DELETE_SUCCESS: "删除成功",
        WAIT_A_MOMENT: "请稍等...",
        SEND_SUCCESS: "发送成功",
        SAVE_SUCCESS:"保存成功"
    },

    ERROR_CODE : {                                          //错误码
        "10086":"功能未实现",
        "5001":"req_itmreq_c::sendToiusaFailed"
    },

    CLICK_DURATION : 200,                                    //点查询保存，关闭时，两次点击的时间间隔
   
    SUGGESSTION_STATUS: {                                    //意见处理状态
        "1":"待受理",
        "2":"已受理",
        "3":"受理完成"
    }
};

/*-----------------------------全局变量----------------------end*/

//生成表格内容的工具类
var TABLETOOL = {
    columns : [
        [   //index = 0，意见列表 95%
            {'title':"checkbox_label",'width':'5%',   "classname":"clearfix"},
            {'title':"序号",          'width':'5%',   "classname":""},
            {'title':"用户",          "width":"15%",  "classname":""},
            {'title':"内容",          "width":"30%",  "classname":""},
            {'title':"时间",          "width":"20%",  "classname":""},
            {'title':"状态",          "width":"15%",  "classname":""},
            {'title':"操作",          "width":"10%",  "classname":""}
        ],
        [   //index = 1，回复列表 95%
            {'title':"checkbox_label",'width':'5%',   "classname":"clearfix"},
            {'title':"序号",          'width':'5%',   "classname":""},
            {'title':"反馈用户",      "width":"15%",  "classname":""},
            {'title':"反馈内容",      "width":"18%",  "classname":""},
            {'title':"反馈时间",      "width":"15%",  "classname":""},
            {'title':"回复内容",      "width":"18%",  "classname":""},
            {'title':"回复时间",      "width":"15%",  "classname":""},
            {'title':"操作",          "width":"8%",  "classname":""}
        ],
        [   //index = 2，草稿列表 95%
            {'title':"checkbox_label",'width':'5%',   "classname":"clearfix"},
            {'title':"序号",          'width':'5%',   "classname":""},
            {'title':"反馈用户",      "width":"15%",  "classname":""},
            {'title':"反馈内容",      "width":"18%",  "classname":""},
            {'title':"反馈时间",      "width":"15%",  "classname":""},
            {'title':"草稿内容",      "width":"18%",  "classname":""},
            {'title':"保存时间",      "width":"15%",  "classname":""},
            {'title':"操作",          "width":"8%",  "classname":""}
        ]
    ],
    /**
     * [generateHtml 组装表格中一行记录的html代码，不包括操作图标和多选框]
     * @param  {[type]} data   [description]
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    generateHtml: function(data,column){
        var index_ = 0, str_ = [];
        for(var key in data){
            var value = data[key];
            str_.push("<li style='width:"+column[index_].width+"' class='nameEllipsis' title='"+value+"'>"+value+"</li>");
            index_++;
        }
        return str_;
    },

    /**
     * [initTableHead 初始化表头]
     * @param  {number} index  [表头在columns中的索引]
     * @param  {$DOM} $dom     [jQuery对象，可选]
     * @return {[type]}        [description]
     */
    initTableHead: function(index,$head){
        //获得在columns中索引为index的表格的表头定义
        var item   = this.columns[index],
            length = item.length;

        //表头部分
        var $head  = $head || $("div.listtitle");                                   
        $head.html("");

        //一行的容器
        var $tr = $("<ul></ul>",{
            "class": "clearfix",
            css:{
                "margin-right": "16px"
            },
            selectstart: function(){
                return false;
            }
        });

        //全选的checkbox
        var checkbox = "<input type='checkbox' id='allSelect'/><label for='allSelect'></label>",
            str      = "";
        for (var i = 0; i < length; i++) {
        
            //datas为每单个表头需要设置进去的属性和值
            var data    = item[i].datas||{},                                           
                dataStr = "";
            for(var key in data) {                                                  
                dataStr += (key+"="+data[key]);
            }

            //当前这个表头的class名称
            var classname = item[i].classname;          

            //生成title,如果是checkbox则内容为类checkbox，而不是真正的字符串数据
            var title = item[i].title == "checkbox_label" ? checkbox : item[i].title;   

            //如果该表头包含sortable，则会根据该列进行排序
            if (classname.indexOf("sortable") > -1) {                               

                str +=  "<li " + dataStr + " style='width:" + item[i].width + "' class='sortableTh " + classname.replace("sortable", "") + "' >" +
                            "<a class='sortable' href='javascript:void(0)'>" + title + "</a>" +
                        "</li>";

            //如果该表头包含selectable类
            //会根据该列进行下拉选择框，则表头本身会加入样式selectableTh，里面的a会加入selectable样式
            }else if(classname.indexOf("selectable") > -1){                         

                str +=  "<li "+dataStr+" style='width:"+item[i].width+"' class='selectableTh " + classname.replace("selectable","") + "' >" + 
                            "<a class='selectable' href='javascript:void(0)'>" + title + "</a>"+
                        "</li>";

            //普通表头
            }else{                                                                  
                //如果class为空，则不设置样式属性
                if ($.trim(classname) == "") {                                      
                    str += "<li " + dataStr + " style='width:" + item[i].width + "'>" + title + "</li>";
                } else {
                    str += "<li " + dataStr + " style='width:" + item[i].width + "' class='" + classname + "'>" + title + "</li>";
                }
            }
        }

        $tr.html(str).appendTo($head);
    },
    /**
     * [initPageBarTool 初始化分页条事件，使用此方法的页面必选加入page.js和page.css]
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    initPageBarTool: function($tatget,option){
        var option_ = {
            url: "../tempDate/pages.js",
            pagesIndex: 'pageidx',
            pagesNumber: 'pagenum',
            showSelectPageSize: true,
            currentPage: 1,
            pageSize: COMMON_GLOBAL.PAGE_SIZE,
            inputVale: "",
            success: function(data,pagsIndex){},
            error: function(xmlhttp,error,pagsIndex){
                if(xmlhttp.statusText =="timeout"){
                    alertMsg(COMMON_GLOBAL.MESSAGE.SERVER_ERROR);
                    console.log("服务器异常！");
                }else{
                    console.log("请求被取消");
                }
            }
        };
        option_ = $.extend(true,{},option_,option);
        option_.url = encodeURI(option_.url);
        option_.success = function(data,pagsIndex){
            if (data.ret == 0 /*|| data.ret == 10031 || data.ret == 10060*/) {
                if(typeof option.success == "function"){
                    
                    option.success(data,pagsIndex);
                }
            } else {
                COMMON_FN.alertMsg(COMMON_FN.returnMsg(data));
            }
        };

        var $tablecontent = $tatget.parents("body").find("div.mainContent div.tableList");
        $(document).ajaxStart(function(){
            $tablecontent.html("").addClass("loadData");
        })
        .ajaxStop(function(){
            $tablecontent.removeClass("loadData");
        });

        return $tatget.showPages(option_);
    }   
};

// 普通公共方法 
var COMMON_FN = {
    /**
     * [returnMsg 处理ajax返回信息]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    returnMsg: function(res) {
        if (typeof res == "string") {
            //如果同肯失效
            if (res == "10229" || res == "10022") {
                setTimeout(function() {
                    top.$.cookie("accesstoken", null);
                    top.$.cookie("userid", null);
                    top.$.cookie("username", null);
                    top.window.location.href = (window == top ? loginUrl : "../" + loginUrl);
                }, COMMON_GLOBAL.DISPLAYTIME);
            }
            return COMMON_GLOBAL.ERROR_CODE[res] || "未定义的错误，请更新错误码";
        } else if (typeof res == "object") {
            if (res.ret + "" == "10229" || res.ret + "" == "10022") {
                setTimeout(function() {
                    top.$.cookie("accesstoken", null);
                    top.$.cookie("userid", null);
                    top.$.cookie("username", null);
                    top.window.location.href = (window == top ? loginUrl : "../" + loginUrl);
                }, COMMON_GLOBAL.DISPLAYTIME);
            }
            return COMMON_GLOBAL.ERROR_CODE[res.ret] || "未定义的错误，请更新错误码";
        }
    },
    /**
     * [submitValidility 判断按钮能否再次点击，2次点击之间必须间隔COMMON_GLOBAL.CLICK_DURATION]
     * @param  {js object} that [description]
     * @return {[type]}      [description]
     */
    submitValidility : function(that){

        //默认当前对象可点击，able表示可顶级，disable表示不可点击
        that.clickable = that.clickable || "able";
        var flag = null;

        //当前不可点击
        if(that.clickable != "able"){
            flag = false;

        //当前可点击，则设置clickable为disble，使COMMON_GLOBAL.CLICK_DURATION时间以内不可点击
        }else{
            that.clickable = "disable";
            flag = true;
        }
        clearTimeout(this.validtimeout);

        //一段时间之后使按钮可点击
        this.validtimeout = setTimeout(function(){
            that.clickable = "able";
        },COMMON_GLOBAL.CLICK_DURATION);

        return flag;
    },

    /**
     * [alertMsg 弹出消息框 插件位于/plugins/tlayer]
     * @param  {string} msg    [消息]
     * @param  {number} width_ [弹出框的长度，可选]
     * @return {[type]}        [description]
     */
    alertMsg: function(msg,width_,fn) {
       
        $("div.layer-alert-box",top.document).remove();
        top.$.alert({
            context: top.document,
            zIndex: 999999999,
            onInit: function (layerID) {
                $(this).find(".layer-box-html").html(msg);
            },
            header: {
                buttons: [{
                    callback: function (layerID) {
                    }
                }]
            },
            content: {
                height:"150px",
                html: msg,
                icon:"plugins/tlayer/icon.png"
            },
            width:width_||"320px",
            footer: {
                buttons: [{
                    callback: function (layerID) {
                        if(typeof fn == "function"){
                            fn(layerID);
                        }
                    }
                }]
            }
        });
    },
    /**
     * [showMessage 弹出消息框，一段时间后消失，插件位于/plugins/tlayer]
     * @param  {string}   message  [消息]
     * @param  {number}   width_   [弹出框的长度，可选]
     * @param  {Function} callback [回调函数，可选]
     * @return {[type]}            [description]
     */
    showMessage: function(message,width_,callback) {
        $("div.layer-msg-box",top.document).remove();
        top.$.msg({
            context: top.document,
            zIndex: 99999999,
            content: {
                html: message,
                icon:"plugins/tlayer/icon.png",
                height:"100px"
            },
            width:width_||"320px",
            delay:COMMON_GLOBAL.DISPLAYTIME,
            onClose:function(){
                if(callback) callback();
            }
        });
    },

    /**
     * [miniAjax 简易ajax，统一使用此ajax方法进行请求可以方便的管理返回值以及对数据进行处理]
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    miniAjax : function(option){
        var option_ = {
            url: option.url,
            type: option.type,
            cache: false,
            global: false,
            timeout: 30000,
            dataType: option.dataType || "json",
            success: function (res) {
                if(res.ret == 0 || res.ret==10500) {
                    if(typeof option.fn == "function") {
                        option.fn(res);
                    }
                }else{
                    //如果执行不成功，则判断是否存在错误时的回调函数
                    if(typeof option.failcallback == "function"){
                        option.failcallback(res);
                    }else{
                        console.log(res);
                        COMMON_FN.alertMsg(COMMON_FN.returnMsg(res));
                    }
                }
            },
            error: function(xmlhttp, textStatus, errorThrown) {
                if (xmlhttp.statusText == "timeout") {
                    console.log("服务器异常！");
                } else {
                    console.log("请求被取消");
                }
            }
        };

        //如果是post请求，则需要加上accesstoken
        if(option.type.toLowerCase() == "post"){
            var data = option.data ||{};
            data.accesstoken = accesstoken;
            option_.data = JSON.stringify(data);

        }else{
        //如果是get请求，则需要统一进行编码
        //同时去掉特殊字符单引号'，避免数据库因为单引号导致的读写不成功的问题
            
            var data = option.data ||{};
            option_.data = data;

            option_.url = option_.url.replace(/\'/gi,"");
            option_.url = encodeURI(option_.url);
        }

        if (typeof option.contentType != "undefined") {
            option_.contentType = option.contentType;
        }

        $.ajax(option_);
    }

};

$(function(){
    //防止退格键导致的回退
    $("body").bind("keydown",function(e){
        var eee = e || window.event;
        var which = eee.which || eee.charCode;
        var target = BASE_UTIL.EVENT.getEventTarget(e);
        var targetName = target.tagName.toLowerCase();

        if(which == 8 && !(targetName == "input" || targetName == "textarea")){
            BASE_UTIL.EVENT.preventDefaultAction(eee);
        }
    });
});
