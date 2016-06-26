(function (window) {
    "use strict";
    var $ = function (id) {
        return document.getElementById(id);
    };
    var Tasks = {
        show: function (obj) {
            obj.className = '';
            return this;
        },
        hide: function (obj) {
            obj.className = 'hide';
            return this;
        },
        //存储dom
        $addItemDiv: $('addItemDiv'),
        $addItemInput: $('addItemInput'),
        $txtTaskTitle: $('txtTaskTitle'),
        $taskItemList: $('taskItemList'),
        //初始化
        init: function () {
            var that = this;
            /*注册事件*/
            //打开添加文本框
            that.$addItemDiv.addEventListener('click', function () {
                that.show(that.$addItemInput).hide(that.$addItemDiv);
                that.$txtTaskTitle.focus();
            }, true);
            //回车添加
            that.$txtTaskTitle.addEventListener('keyup', function (event) {
                var ev = event || window.event;
                if (ev.keyCode === 13) {
                    //TODO:写入本地数据
                    that.AppendHtml(that.$txtTaskTitle.value);
                    that.$txtTaskTitle.value = '';
                    that.hide(that.$addItemInput).show(that.$addItemDiv);
                }
                ev.preventDefault();
            }, true);
            //取消
            that.$txtTaskTitle.addEventListener('blur', function () {
                that.$txtTaskTitle.value = '';
                that.hide(that.$addItemInput).show(that.$addItemDiv);
            }, true);
            //TODO:初始化数据，加载本地数据，生成html
        },
        //增加
        Add: function (task) {
            //更新指针
            localStorage.setItem('Tasks:index', ++this.index);
            task.id = this.index;
            localStorage.setItem("task:" + this.index, JSON.stringify(task));
        },
        //修改
        Edit: function (task) {
            localStorage.setItem("task:" + task.id, JSON.stringify(task));
        },
        //删除
        Del: function (task) {
            localStorage.removeItem("task:" + task.id);
        },
        AppendHtml: function (title) {
            var oDiv = document.createElement('div');
            oDiv.className = 'taskItem';
            var oLabel = document.createElement('label');
            oLabel.className = 'on';
            var oSpan = document.createElement('span');
            oSpan.className = 'taskTitle';
            var oText = document.createTextNode(title);
            oSpan.appendChild(oText);
            oDiv.appendChild(oLabel);
            oDiv.appendChild(oSpan);
            //注册事件
            oDiv.addEventListener('click', function () {
                //TODO
            }, true);
            this.$taskItemList.appendChild(oDiv);
        },
        RemoveHtml: function () {

        }
    };
    Tasks.init();
})(window);