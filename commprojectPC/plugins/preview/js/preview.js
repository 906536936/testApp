window.onload = function(){
    if(top === window){
        initImgContainer();
        initList();
    } 
}

function init(){
   initImgContainer();
   initList();
}

window.onresize = function(){
    initImgContainer();
    initList();
}

var listArr = [
    "pic/1.png","pic/2.png","pic/3.jpg","pic/4.jpg","pic/5.png","pic/6.jpg",
    "JPG/01.jpg","JPG/02.jpg","JPG/03.jpg","JPG/04.jpg","JPG/05.jpg",
    "JPG/06.jpg","JPG/07.jpg","JPG/08.jpg","JPG/09.jpg","JPG/15.jpg",
    "JPG/16.jpg","JPG/17.jpg","JPG/18.jpg","JPG/19.jpg","JPG/20.jpg",
    "JPG/21.jpg","JPG/22.jpg","JPG/23.jpg","JPG/24.jpg","JPG/25.jpg",
    "JPG/26.jpg","JPG/27.jpg","JPG/28.jpg","JPG/29.jpg","JPG/30.jpg",
    "JPG/31.jpg","JPG/32.jpg","JPG/33.jpg","JPG/34.jpg","JPG/35.jpg",
    "JPG/36.jpg","JPG/37.jpg","JPG/38.jpg","JPG/39.jpg","JPG/40.jpg",
    "JPG/41.jpg","JPG/42.jpg","JPG/43.jpg","JPG/44.jpg","JPG/45.jpg"
];

var parmObj = {
    DivId:        "L",             //行DIV的ID名称   
    focusId:      "focus",         //焦点的ID
    arrLength:     listArr.length, //数据总长度
    listSize:      7,              //行数
    rowHeight:     95,             //行高
    focusStartPos: 0,              //显示的第一行焦点Y轴坐标
    direction:     "left"             //方向 top 纵向 left 横向
};

var originalwidth = 0;
var currsize = 95;
var count = 0;
var listObj = null;
var listPos = 0;
var focusPos = 0;
var previewPositionXY = 30;


var previewcontainerW = 0;
var previewcontainerH = 0;


function initImgContainer(){
    var height = $(window).height();
    var width = $(window).width();
    var previewthumbnailheight = $(".previewthumbnail").height();
    $(".previewcontainer").css({"width":width-previewPositionXY*2,"height":height-previewthumbnailheight-previewPositionXY*2,"left":previewPositionXY,"top":previewPositionXY});
    previewcontainerW = width-previewPositionXY*2;
    previewcontainerH = height-previewthumbnailheight-previewPositionXY*2;
}

function initList(){
    createList();
    initlistEvent();
}

function createList(){
    originalwidth = $(window).width() - 60;
    count = Math.ceil(originalwidth/currsize);
    $(".thumbnaillist ul").html("");
    for(var i= 0; i<=count; i++){
      $(".thumbnaillist ul").append('<li id="L'+i+'" class="position" style="top:0px; left:'+(i*currsize)+'px;">'+
            '<span class="verticalAlign"></span>'+
            '<img src="img/tm.gif" height="60" width="80" />'+
            '<div class="imgcover"></div>'+
        '</li>');  
    }

    parmObj.arrLength = listArr.length;
    parmObj.listSize = count;
    listObj = new listSlip(parmObj);
    listObj.listPos = listPos;
    listObj.focusPos = focusPos;
    listObj.startline = 1;
    listObj.endline = count - 2;
    listObj.haveData = showlist;
    listObj.notData = clearlist;
    listObj.initInfo();
    focusMove(0);
}

function showlist(_i,_pos){
    $("#L"+_i).show();
    //var imgsrc = listArr[_pos].imgsrc+"?"+Math.random()*100000;
    var img = new Image();
    var imgsrc = listArr[_pos];
    img.src = imgsrc;
    img.onload = function(){
        var obj = AutoResizeImage(90,90,this.width,this.height);
        $("#L"+_i).attr("data-index",_pos);
        $("#L"+_i).find("img").attr({"src":imgsrc,"width":parseInt(obj.w),"height":parseInt(obj.h)});
    }
}

function clearlist(_i){
    $("#L"+_i).hide();
}

function focusMove(_num){
    if(listObj.listPos+_num > listArr.length-1 || listObj.listPos+_num<0) return;
    listObj.changeFocus(_num);
    listPos = listObj.listPos;
    focusPos = listObj.focusPos;
    // console.log("listPos:"+listPos+" focusPos:"+focusPos);
    $(".imgcover").removeClass("active");
    $("#L"+listObj.currId()).find(".imgcover").addClass("active");
    showImg();
}

function showImg(){
    var imgsrc = listArr[listObj.listPos];
    var imgname = imgsrc.substring(imgsrc.lastIndexOf("/")+1);
    var img = new Image();
    img.src = imgsrc;
    img.onload = function(){
        var obj = AutoResizeImage(previewcontainerW,previewcontainerH,this.width,this.height);
        $(".previewcontainer").find("img").attr({"src":imgsrc,"width":parseInt(obj.w),"height":parseInt(obj.h)});
        $(".imgInfo span").html(imgname+" | "+parseInt(obj.w)+"x"+parseInt(obj.h)); 
        $(".thumbnailpage").html((listObj.listPos+1)+"/"+(listArr.length));
    } 
}


function initlistEvent(){
    $(document).unbind();
    $(document).keydown(function(event){  
        event = event || window.event;
        if(event.keyCode==38){  //上
            focusMove(-1)
        }else if(event.keyCode==40){  //下
            focusMove(1)
        }else if(event.keyCode==37){  //左
            focusMove(-1); 
        }else if(event.keyCode==39){  //右
            focusMove(1); 
        }if(event.keyCode==8){  //返回
            top.closeFrame(); 
            return false;
        }if(event.keyCode==27){  //esc
            top.closeFrame(); 
            return false;
        }

    });

    $(".thumbnailleft,.left").unbind();
    $(".thumbnailleft,.left").bind({
        mouseenter:function(){
            $(this).addClass("hover");
        },
        mouseleave:function(){
            $(this).removeClass("hover");
        },
        click:function(){
           focusMove(-1); 
        }
    });

    $(".thumbnailright,.right").unbind();
    $(".thumbnailright,.right").bind({
        mouseenter:function(){
            $(this).addClass("hover");
        },
        mouseleave:function(){
            $(this).removeClass("hover");
        },
        click:function(){
           focusMove(1); 
        }
    });

    $(".previewclose").unbind();
    $(".previewclose").bind({
        mouseenter:function(){
            $(this).addClass("hover");
        },
        mouseleave:function(){
            $(this).removeClass("hover");
        },
        click:function(){
           top.closeFrame(); 
        }
    });


    $(".open,.close").unbind();
    $(".open,.close").bind({
        mouseenter:function(){
            $(this).addClass("hover");
        },
        mouseleave:function(){
            $(this).removeClass("hover");
        },
        click:function(){
           var isOpen = $(this).hasClass("open");
            if(isOpen){
                $(this).removeClass("open");
                $(this).addClass("close");
                $(".previewthumbnail").css({"height":30});
                $(".thumbnailright,.thumbnailleft").hide();
            }else{
               $(this).removeClass("close");
                $(this).addClass("open"); 
                $(".previewthumbnail").css({"height":130});
                $(".thumbnailright,.thumbnailleft").show();
            } 
            initImgContainer();
            showImg();
        }
    });

    $(".thumbnaillist ul li").unbind();
    $(".thumbnaillist ul li").bind({
        mouseenter:function(){
            $(this).find(".imgcover").addClass("hover");
        },
        mouseleave:function(){
            $(this).find(".imgcover").removeClass("hover");
        },
        click:function(){
            var index = $(this).attr("data-index");
            var num = index-listObj.listPos;
            focusMove(num);
        }
    });






}

//等比缩略图
function AutoResizeImage(_maxwidth,_maxheight,_imgwidth,_imgheight){
    var obj = {w:0,h:0};
    var maxWidth = _maxwidth; 
    var maxHeight = _maxheight; 
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = _imgwidth;
    var h = _imgheight;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth ==0 && maxHeight==0){
      Ratio = 1;
    }else if (maxWidth==0){//
      if (hRatio<1) Ratio = hRatio;
    }else if (maxHeight==0){
      if (wRatio<1) Ratio = wRatio;
    }else if (wRatio<1 || hRatio<1){
      Ratio = (wRatio<=hRatio?wRatio:hRatio);
    }
    if (Ratio<1){
      w = w * Ratio;
      h = h * Ratio;
    }

    obj.w = w;
    obj.h = h;
    return obj;
}




/*
 +------------------------------------------------------------------------------
 * 单行单列对象
 +------------------------------------------------------------------------------
    var parmObj = {
        DivId:        "L",             //行DIV的ID名称   
        focusId:      "focus",         //焦点的ID
        arrLength:     listArr.length, //数据总长度
        listSize:      7,              //行数
        rowHeight:     40,             //行高
        focusStartPos: 85              //显示的第一行焦点Y轴坐标
        direction:     "top"             //方向 top 纵向 left 横向
    };
 +------------------------------------------------------------------------------
*/
function listSlip(_parmObj){
    this.$ = function(_id){return document.getElementById(_id);}
    this.listPos = 0; //数据位置 默认在 0
    this.focusPos = 0; //焦点位置 默认在 0
    this.duration = _parmObj.duration || 2000;
    this.focusStartPos = _parmObj.focusStartPos;//焦点 在显示的第一行焦点Y轴坐标
    this.listSize = _parmObj.listSize; //列表显示的条目数
    this.startline = 0;//起始行 从0开始数
    this.endline   = this.listSize-1;//其实列 从0开始数
    this.firstFlag = true;//按向上的时候是否能滑到 第一条行目的位置
    this.lastFlag = false;//按向下的时候是否能滑到 最后一条行目的位置;
    this.rowHeight = _parmObj.rowHeight;//焦点移动的行高
    this.recordLdiv = []; //记录滑动DIV位置；
    this.arrLength = _parmObj.arrLength;
    this.focusObj = this.$(_parmObj.focusId); //焦点；
    this.rowDivName = _parmObj.DivId; //行DIV的ID名
    this.direction  = typeof(_parmObj.direction)=="undefined"?"top" : _parmObj.direction;
    //this.direction = _parmObj.direction || "top";//方向
    this.firstDivTop = parseInt(this.$(this.rowDivName+0).style[this.direction]);//第一个DIV的位置
    this.topDivTop = parseInt(this.firstDivTop-this.rowHeight); //移动行DIV最上面的位置；
    this.bottomDivTop = parseInt(this.$(this.rowDivName+this.listSize).style[this.direction]);//移动行DIV最下面的位置；
    this.actionCompleteFlag = true;
    this.t0 = -1;
    this.t1 = -1;
    var self = this;
    
    this.haveData = function(){}; //在显示列表信息时，有数据信息就会调用该方法；
    this.notData = function(){}; //在显示列表信息时，无数据信息就会调用该方法；


    /*初始化输出信息*/
    this.initInfo = function(){
        //清除所有信息
        for(var i=0;i<this.listSize+1;i++){
                this.notData(i);
        }
        //还原DIV位置、创建最初的DIV顺序
        for(var i=0;i<this.listSize+1;i++){
           // this.$(this.rowDivName+i).style.webkitTransitionDuration = "0ms";
            this.$(this.rowDivName+i).style[this.direction] = this.firstDivTop+this.rowHeight*i+"px";
           // this.$(this.rowDivName+i).style.webkitTransitionDuration = this.duration+"ms";
            this.recordLdiv[i]=i;
        }
        //输出信息
        var position = this.listPos-this.focusPos;//当前页第一个
        for(var i=0; i<this.listSize+1; i++){
            this.recordLdiv[i]=i;
            if(i+position<this.arrLength){
                this.haveData(i,i+position);
            }
        }
    }
    
    
    /*行DIV移动*/
    this.moveLdiv = function(_num){
        //clearTimeout(this.t0);
        //clearTimeout(this.t1);
        if(!this.actionCompleteFlag) return;
       // self.$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style.webkitTransitionDuration = "0ms";
        var tmp =  _num>0?this.bottomDivTop:this.topDivTop;
        //self.$(this.rowDivName+this.recordLdiv[this.recordLdiv.length-1]).style[this.direction] =tmp+"px";   
        //this.t0 = setTimeout(function(){
            self.$(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]).style[self.direction] = tmp+"px";   
        //     console.log("tmp:"+tmp);
        //     console.log(self.$(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]).style[self.direction]);
        // },10);
        
        var tmpNum = _num;
        this.actionCompleteFlag = false;
        //$(self.rowDivName+self.recordLdiv[self.recordLdiv.length-1]).style.webkitTransitionDuration = self.duration+2000+"ms";
        for(var i=0;i<self.listSize+1;i++){
           // self.$(self.rowDivName+i).style.webkitTransitionDuration = self.duration+"ms";
            self.$(self.rowDivName+i).style[self.direction] =(parseInt(self.$(self.rowDivName+i).style[self.direction]) -  _num*self.rowHeight )+"px";
        }
        self.reLdiv(tmpNum);
        self.actionCompleteFlag = true;
    }
    /*行移动后重新标记位置*/
    this.reLdiv = function(_num){
        if(_num>0){
            var temp = this.recordLdiv[0];
            this.recordLdiv.shift();
            this.recordLdiv.push(temp);
        }
        else {
            var temp = this.recordLdiv[this.recordLdiv.length-1];
            this.recordLdiv.pop();
            this.recordLdiv.unshift(temp);
        }
    }
    /*获取焦点*/
    this.onfocus = function(){
        this.focusObj.style[this.direction] = this.focusStartPos + this.rowHeight*this.focusPos +"px";
    }
    
    /*移动焦点的函数*/ 
    this.changeFocus =  function(_num){
        var focusPosTemp = this.focusPos;
        var listPosTemp = this.listPos;
        this.focusPos += _num;
        this.listPos += _num;
        // console.log(" this.listPos:"+ this.listPos+"  this.focusPos:"+this.focusPos +" this.startline:"+this.startline+" this.endline:"+this.endline);
        if(this.listSize>this.arrLength){
            if(this.listPos<0){this.listPos=0;this.focusPos=0;return;}
            if(this.listPos>this.arrLength-1){this.listPos=this.arrLength-1;this.focusPos=focusPosTemp;return;}
        }else if(this.focusPos<this.startline&&_num<0){
            if(this.firstFlag==true&&this.listPos==this.focusPos){
                if(this.listPos<0){
                    this.listPos=0;this.focusPos=0;
                    return;
                }
                this.onfocus();
                return;
            }else {
                //this.focusPos=focusPosTemp;
                this.focusPos = this.startline;
                if(this.listPos<0){
                    this.listPos=0;
                    return;
                }
            }
            if(this.listPos-this.startline>=0){
                this.haveData(this.recordLdiv[this.recordLdiv.length-1],this.listPos-this.startline);
            }
            else this.notData(this.recordLdiv[this.recordLdiv.length-1]);
            this.moveLdiv(-1);
            return;
        }else if(this.focusPos>this.endline&&_num>0){
            // console.log(this.lastFlag==true && this.listPos+this.listSize-this.endline>this.arrLength);
            if(this.lastFlag==true && this.listPos+this.listSize-this.endline>this.arrLength){
                if(this.listPos>this.arrLength-1){
                    this.listPos=this.arrLength-1;
                    this.focusPos=this.listSize-1;
                    return;
                }
                this.onfocus();
                return;
            }else {
                //this.focusPos = focusPosTemp;
                this.focusPos = this.endline;
                if(this.listPos>this.arrLength-1){
                    this.listPos=this.arrLength-1;
                    return;
                }
            }

            // console.log(this.listPos+this.listSize-this.endline-1<this.arrLength);

            if(this.listPos+this.listSize-this.endline-1<this.arrLength){
               this.haveData(this.recordLdiv[this.recordLdiv.length-1],this.listPos+this.listSize-this.endline-1);
            }else{
               this.notData(this.recordLdiv[this.recordLdiv.length-1]); 
            } 
            this.moveLdiv(1);
            return;
        }
        this.onfocus();
    }
    /* 寻找当前焦点对应的ID ，返回一个ID number */
    this.currId = function(){
        var currId = null;
        currId = this.recordLdiv[this.focusPos];
        return currId;
    }
}
