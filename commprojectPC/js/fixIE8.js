/**
 * @useage:     
 *  <!--[if IE 8]>
 *      <script type="text/javascript" src="../js/fixIE8.js"></script>
 *  <![endif]-->
 */
/*----------------IE8Label不能点击-----------------begin*/
var lb = document.getElementsByTagName('label');
for (i = 0; i < lb.length; i++) {
    lb[i].onclick = function() {
        var lbfor = this.getAttribute('for') ? this.getAttribute('for') : this.getAttribute('HTMLfor') + '';
        if (lbfor != "" && lbfor != "null" && lbfor != null) {
            var target_ =  document.getElementById(lbfor);
            if(target_ != null && typeof target_ != "undefined"){
                target_.click();
                target_.focus();
            }
        }

    }
}

/**
 * [checkboxIE8 解决IE下，input[type=checkbox]:checked+label选择器无效的问题]
 * @param  {[type]} that [description]
 * @return {[type]}      [description]
 */
 function checkboxIE8(that) {
    if ($(that).prop("checked") == true) {
        $(that).next("label").addClass("selectInput");
    } else {
        $(that).next("label").removeClass("selectInput");
    }
}
/*----------------IE8Label不能点击-----------------end*/


/**
 * [placeHoder 解决IE9及以下版本IE不支持placeerhoder的问题]
 * @tips: placeholder类为placeholder的样式
 * @return {[type]} [description]
 */
function placeHoder(){
    if (!('placeholder' in document.createElement('input'))) {
        $('input[placeholder],textarea[placeholder]').each(function() {
            var that = $(this),
                text = that.attr('placeholder');
            if (that.val() === "") {
                that.val(text).addClass('placeholder');
            }
            that.focus(function() {
                if (that.val() === text) {
                    that.val("").removeClass('placeholder');
                }
            })
            .blur(function() {
                if (that.val() === "") {
                    that.val(text).addClass('placeholder');
                }
            })
            .closest('form').submit(function() {
                if (that.val() === text) {
                    that.val('');
                }
            });
        });
    }
}
