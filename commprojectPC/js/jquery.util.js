//通过jQuery对原生放放的扩展
//依赖jQuery

//对数组进行扩展
$.extend(Array.prototype, {
    /**
     * [deleteItem 删除数组中的某项,如果存在多项，则循环删除]
     * @return {[type]} [description]
     */
    deleteItem: function() {
        var index = $.inArray(value, this);
        if (index > -1) {
            this.splice(index, 1);
            arguments.callee.call(this, value);
        } else {
            return this;
        }
    },
});


//对字符串进行扩展
$.extend(String.prototype, {
    /**
     * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
     * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
     *
     * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
     * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
     * 000800 - 00D7FF
       00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
     * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
     *
     * 注: Unicode在范围 D800-DFFF 中不存在任何字符
     *
     {@link <a 
    onclick="javascript:pageTracker._trackPageview('/outgoing/zh.wikipedia.org/wiki/UTF-8');"
      
    href="http://zh.wikipedia.org/wiki/UTF-8">http://zh.wikipedia.org/wiki/UTF-8</a>}
     *
     * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
     * 000000 - 00FFFF  两个字节
     * 010000 - 10FFFF  四个字节
     *
     *
     {@link <a 
    onclick="javascript:pageTracker._trackPageview('/outgoing/zh.wikipedia.org/wiki/UTF-16');"
      
    href="http://zh.wikipedia.org/wiki/UTF-16">http://zh.wikipedia.org/wiki/UTF-16</a>}
     * @param  {String} str
     * @param  {String} charset utf-8, utf-16
     * @return {Number}
     */
    byteLength: function(charset) {
        var str = this.valueOf();
        var total = 0,
            charCode,
            i,
            len;

        charset = charset ? charset.toLowerCase() : '';

        if (charset === 'utf-16' || charset === 'utf16') {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0xffff) {
                    total += 2;
                } else {
                    total += 4;
                }
            }
        } else {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0x007f) {
                    total += 1;
                } else if (charCode <= 0x07ff) {
                    total += 2;
                } else if (charCode <= 0xffff) {
                    total += 3;
                } else {
                    total += 4;
                }
            }
        }

        return total;
    }
});