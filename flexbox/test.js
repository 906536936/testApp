
/**
 * Created by alan on 2015/9/28.
 */
/*-------------------------------预付卡管理常量配置----------------------------------begin*/
var PREPAIDCARD_GOLBAL = {
    FARBRICATION_REVIEW_STATUS : {                                                  //制卡信息审核状态
        "1":"待审核","2":"已通过","3":"已驳回"
    },
    MEMBER_STATUS : {                                                               //持卡人状态
        //"0":"无效",
        "1":"启用",
        "2":"停用"
    },
    EDURATION_LEVEL:{                                                               //受教育程度
        "1":"小学及一下",
        "2":"初中",
        "3":"高中",
        "4":"大专",
        "5":"本科",
        "6":"硕士",
        "7":"博士",
        "8":"博士后"
    },
    CHANGE_FLAG: {                                                                  //换卡标志
        "0":"否",
        "1":"是"
    },
    MESSAGE_FLAG:{                                                                  //短信通知标志
        "0":"否",
        "1":"是"
    },
    PREPAIDCARD_STATUS :{                                                           //预付卡的状态
        "0":"未激活",
        "1":"正常",
        "2":"冻结",
        "3":"预作废",
        "4":"作废",
        "5":"已赎回",
        "6":"挂失"
    },
    DEFAUTL_ENDDATE: {                                                              //制卡的有效期，制卡默认的截止日期是5年3个月后，
        YEAR:5,
        MONTH:3
    },
    CARD_COUNT:{                                                                    //“本批次制卡张数”：默认为100，最小值为1，最大值为9999。
        MAX:9999,
        MIN:1,
        DEFAULT:100
    },
    ISSUE_TYPE:{                                                                    //领卡方式
        "1":"自发卡",
        "2":"代发卡"
    },
    GIVE_CARD:{                                                                     //发卡状态
        "0":"未发卡",
        "1":"已发卡"
    },
    FREEZED_REASON:{                                                                //冻结原因
        "1":"交易异常",
        "2":"错帐冻结",
        "3":"司法冻结",
        "4":"密码输入三次错误",
        "5":"换卡冻结",
        "6":"卡到期",
        "7":"临时冻结"
    },
    UNFREEZED_REASON:{                                                              //解冻原因
        "1":"交易异常解冻",
        "2":"错帐冻结解冻",
        "3":"司法冻结解冻",
        "4":"密码输入三次错误自动解冻",
        "5":"换卡冻结解冻",
        "6":"卡到期解冻",
        "7":"临时冻结解冻"
    },
    FREEZED_DURATION:{                                                              //冻结周期
        "1":"24小时",
        "2":"48小时",
        "3":"一周",
        "4":"一个月",
        "5":"三个月",
        "6":"六个月",
        "7":"永久冻结"
    },
    INVALIDATE_REASON:{                                                             //作废原因
        "1":"卡片损坏",
        "2":"卡片升级",
        "3":"卡片过期",
        "4":"商家回收"
    },
    FIRST_STAUTS: {                                                                 //一级领卡状态
        "0":"一级未发卡",
        "1":"一级已发卡"
    },
    SECOND_STATUS:{                                                                 //二级领卡状态
        "0":"二级未发卡",
        "1":"二级已发卡"
    },
    CHILD_FLAG : {
        0:"未绑定","1":"母卡","2":"子卡"
    }
};
/*-------------------------------预付卡管理常量配置----------------------------------end*/
/**
 * [columns 表格的表头，width之和不是100%,否则操作一栏会紧靠右边框]
 * @type {Array}
 */
var columns =[
    [//信息管理与查询 index = 0; 98% (字段不全) (已加弹框)
        {'title':"商户编号",     "width":"10%", "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"商户名称",     "width":"8%", "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"卡号",         "width":"10%", "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"卡类型",       "width":"6%",  "classname":"selectable"},
        {'title':"子公司",       "width":"8%",  "classname":""},
        {'title':"运营商",       "width":"8%",  "classname":""},
        {'title':"项目经理",     "width":"6%",  "classname":""},
        {'title':"项目专员",     "width":"6%",  "classname":""},
        {'title':"市场经理",     "width":"6%",  "classname":""},
        {'title':"市场专员",     "width":"6%",  "classname":""},
        {'title':"持卡人",       "width":"6%",  "classname":""},
        {'title':"生效日期",     "width":"6%",  "classname":""},
        {'title':"截止日期",     "width":"6%",  "classname":""},
        {'title':"状态",         "width":"6%",  "classname":"selectable"}
    ],
    [//制卡信息管理 index = 1; (字段不全) 98%  (已加弹框)
        {'title':"checkbox_label",'width':'3%',  "classname":"clearfix"},
        {'title':"商户编号",      "width":"8%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"商户名称",      "width":"8%",  "classname":""},
        {'title':"卡bin",         "width":"8%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"制卡批号",      "width":"17%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"起始号",        "width":"10%",  "classname":""},
        {'title':"制卡张数",      "width":"6%",  "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"卡类型",        "width":"6%",  "classname":"selectable"},
        {'title':"卡面值",        "width":"6%",  "classname":"sortable",datas:{"sortby":"5"}},
        {'title':"生效日期",      "width":"7%",  "classname":"sortable",datas:{"sortby":"6"}},
        {'title':"截止日期",      "width":"7%",  "classname":"sortable",datas:{"sortby":"7"}},
        {'title':"制卡状态",      "width":"8%",  "classname":"selectable"},
        {'title':"操作",          "width":"6%",  "classname":""}
    ],
    [//卡面关联 index = 2;
        {'title':"checkbox_label",'width':'3%',  "classname":"clearfix"},
        {'title':"商户编号",      "width":"10%", "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡bin",         "width":"8%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"制卡批号",      "width":"8%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"制卡文件名",    "width":"8%",  "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"起始号",        "width":"8%",  "classname":""},
        {'title':"本批次制卡张数","width":"6%",  "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"卡类型",        "width":"6%",  "classname":"selectable"},
        {'title':"卡面值",        "width":"6%",  "classname":"sortable",datas:{"sortby":"5"}},
        {'title':"生效日期",      "width":"6%",  "classname":"sortable",datas:{"sortby":"6"}},
        {'title':"截止日期",      "width":"6%",  "classname":"sortable",datas:{"sortby":"7"}},
        {'title':"制卡状态",      "width":"6%",  "classname":"selectable"},
        {'title':"备注",          "width":"8%",  "classname":""},
        {'title':"操作",          "width":"10%", "classname":""}
    ],
    [//制卡信息导出 index = 3 96%;
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"13%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"商户名称",      "width":"27%",  "classname":""},
        {'title':"卡种名称",      "width":"17%",  "classname":""},
        {'title':"制卡批号",      "width":"21%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"制卡状态",      "width":"10%",  "classname":"selectable"},
        {'title':"操作",          "width":"8%",   "classname":""}
    ],
    [//文件生成 index = 4;
        {'title':"checkbox_label",'width':'3%',  "classname":"clearfix"},
        {'title':"商户编号",      "width":"8%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡bin",         "width":"8%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"卡种名称",      "width":"10%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"制卡批号",      "width":"16%", "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"起始号",        "width":"12%", "classname":""},
        {'title':"制卡张数",      "width":"6%",  "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"卡类型",        "width":"6%",  "classname":"selectable"},
        {'title':"卡面值",        "width":"6%",  "classname":"sortable",datas:{"sortby":"5"}},
        {'title':"生效日期",      "width":"7%",  "classname":"sortable",datas:{"sortby":"6"}},
        {'title':"截止日期",      "width":"7%",  "classname":"sortable",datas:{"sortby":"7"}},
        {'title':"制卡状态",      "width":"6%",  "classname":""},
        {'title':"操作",          "width":"4%",  "classname":""}
    ],
    [//领卡退卡管理 index = 5;
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"10%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"商户名称",      "width":"20%",  "classname":""},
        {'title':"卡号",          "width":"15%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"一级领卡状态",  "width":"10%",  "classname":"selectable"},
        {'title':"二级领卡状态",  "width":"10%",  "classname":"selectable"},
        {'title':"发卡方式",      "width":"8%",   "classname":"selectable"},
        {'title':"市场经理",      "width":"8%",   "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"市场专员",      "width":"8%",   "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"备注",          "width":"8%",  "classname":""}
    ],
    [//开卡激活 index = 6;
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"10%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"商户名称",      "width":"19%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"卡号",          "width":"15%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"卡种类型",      "width":"8%",   "classname":"selectable"},
        {'title':"生效日期",      "width":"8%",   "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"截止日期",      "width":"8%",   "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"状态",          "width":"6%",   "classname":""},
        {'title':"激活日期",      "width":"8%",   "classname":"sortable",datas:{"sortby":"5"}},
        {'title':"备注",          "width":"8%",  "classname":""},
        {'title':"操作",          "width":"6%",  "classname":""}
    ],
    [//卡片升级 index = 7 99% （字段不全）(已加弹框)
        {'title':"checkbox_label",'width':'3%',  "classname":"clearfix"},
        {'title':"商户编号",      "width":"8%", "classname":""},
        {'title':"卡号",          "width":"12%", "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"持卡人",        "width":"6%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"证件类型",      "width":"6%",  "classname":""},
        {'title':"证件号码",      "width":"10%", "classname":""},
        {'title':"手机号",        "width":"6%",  "classname":""},
        {'title':"邮箱",          "width":"9%", "classname":""},
        {'title':"卡类型",        "width":"6%",  "classname":"selectable"},
        {'title':"卡内余额",      "width":"6%",  "classname":""},
        {'title':"迷你付积分余额","width":"9%", "classname":""},
        {'title':"商户积分余额",  "width":"8%", "classname":""},
        {'title':"短信通知",      "width":"6%",  "classname":""},
        {'title':"操作",          "width":"4%",  "classname":""}
    ],
    [//冻结解冻 index= 8 98%
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"13%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡号",          "width":"13%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"持卡人",        "width":"8%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"证件类型",      "width":"8%",  "classname":"selectable"},
        {'title':"证件号码",      "width":"13%",  "classname":""},
        {'title':"手机号",        "width":"10%",  "classname":""},
        {'title':"激活日期",      "width":"8%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"冻结日期",      "width":"8%",  "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"解冻日期",      "width":"8%",  "classname":""},
        {'title':"状态",          "width":"6%",  "classname":"selectable"}
    ],
    [//挂失解挂 index= 9 99%
        {'title':"checkbox_label", 'width':'3%',  "classname":"clearfix"},
        {'title':"商户编号",       "width":"10%", "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡号",           "width":"12%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"制卡批号",       "width":"12%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"卡类型",         "width":"6%",  "classname":""},
        {'title':"持卡人",         "width":"6%",  "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"证件类型",       "width":"6%",  "classname":"selectable"},
        {'title':"证件号码",       "width":"12%", "classname":""},
        {'title':"手机号",         "width":"8%",  "classname":""},
        {'title':"卡内余额",       "width":"6%",  "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"生效日期",       "width":"6%",  "classname":"sortable",datas:{"sortby":"5"}},
        {'title':"截止日期",       "width":"6%",  "classname":"sortable",datas:{"sortby":"6"}},
        {'title':"状态",           "width":"6%",  "classname":"selectable"}
    ],
    [//卡作废 index= 10  99%
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"10%",  "classname":""},
        {'title':"卡号",          "width":"15%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"持卡人",        "width":"8%",   "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"卡类型",        "width":"8%",   "classname":""},
        {'title':"卡内余额",      "width":"8%",   "classname":""},
        {'title':"现金账户余额",  "width":"8%",  "classname":""},
        {'title':"虚拟账户余额",  "width":"8%",  "classname":""},
        {'title':"生效日期",      "width":"8%",   "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"截止日期",      "width":"8%",   "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"卡面值",        "width":"8%",   "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"状态",          "width":"8%",   "classname":"selectable"}
    ],
    [//换卡 index= 11 (字段不全) 99% (已加弹框)
        {'title':"checkbox_label",'width':'3%',  "classname":"clearfix"},
        {'title':"商户编号",      "width":"8%", "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡号",          "width":"10%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"制卡批号",      "width":"16%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"卡类型",        "width":"6%",  "classname":""},
        {'title':"持卡人",        "width":"6%",  "classname":""},
        {'title':"证件类型",      "width":"8%",  "classname":"selectable"},
        {'title':"证件号码",      "width":"12%", "classname":""},
        {'title':"手机号",        "width":"8%",  "classname":""},
        {'title':"卡内余额",      "width":"6%",  "classname":"sortable",datas:{"sortby":"3"}},
        {'title':"生效日期",      "width":"6%",  "classname":""},
        {'title':"截止日期",      "width":"6%",  "classname":""},
        {'title':"状态",          "width":"4%",  "classname":""}
    ],
    [//卡密管理 index= 12 93%
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"15%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡号",          "width":"18%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"持卡人名称",    "width":"15%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"手机号",        "width":"15%",  "classname":""},
        {'title':"证件类型",      "width":"15%",  "classname":"selectable"},
        {'title':"证件号码",      "width":"15%",  "classname":""}
    ],
    [//持卡人管理 index= 13  （字段不全）(已加弹框)
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"卡号",          "width":"12%",  "classname":""},
        {'title':"商户编号",      "width":"10%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"持卡人",        "width":"6%",   "classname":"sortable",datas:{"sortby":"4"}},
        {'title':"手机号",        "width":"8%",   "classname":""},
        {'title':"证件类型",      "width":"8%",   "classname":"selectable"},
        {'title':"证件号码",      "width":"12%",  "classname":""},
        {'title':"性别",          "width":"6%",   "classname":""},
        {'title':"邮箱",          "width":"10%",  "classname":""},
        {'title':"地址",          "width":"10%",  "classname":""},
        {'title':"教育程度",      "width":"8%",   "classname":"selectable"},
        {'title':"状态",          "width":"6%",   "classname":"selectable"}
    ],
    [//子母卡绑定 index=14 99%
        {'title':"checkbox_label",'width':'3%',   "classname":"clearfix"},
        {'title':"商户编号",      "width":"10%",  "classname":"sortable",datas:{"sortby":"0"}},
        {'title':"卡号",          "width":"15%",  "classname":"sortable",datas:{"sortby":"1"}},
        {'title':"持卡人",        "width":"10%",  "classname":"sortable",datas:{"sortby":"2"}},
        {'title':"手机号",        "width":"10%",  "classname":""},
        {'title':"证件类型",      "width":"10%",  "classname":"selectable"},
        {'title':"证件号码",      "width":"15%",  "classname":""},
        {'title':"卡内余额",      "width":"10%",  "classname":""},
        {'title':"绑定情况",      "width":"8%",  "classname":""},
        {'title':"操作",          "width":"8%",  "classname":""}
    ]
];
/**
 * [selecThMap 规定哪些表的表头是可以进行隐藏和显示的]
 * ["1":[1,2,3]表示columns["1"-0]表格中，第2,3,4列可以进行隐藏和显示，0表示第一列,隐藏和显示是是通过在表头右键来实现的]
 * 并不是每个表格都
 * @type {Array}
 */
var selecThMap = [
    [//信息管理与查询 index = 0;
        2,3,4,5,6,7,8,9,11,12,13
    ],
    [//制卡信息管理 index = 1;
        2,3,4,5,6,7,8,9,11
    ],
    [//卡面关联 index = 2;
        2,3,4,5,6,7,8,9,11,12
    ],
    [//制卡信息导出 index = 3;字段较少，不需要隐藏表头

    ],
    [//文件生成 index = 4;
        2,3,4,5,6,7,8,9,11
    ],
    [//领卡退卡管理 index = 5;
        2,3,4,5,6,7,8
    ],
    [//开卡激活 index = 6;
        2,3,4,5,6,7,8,9
    ],
    [//卡片升级 index= 7
        2,3,4,5,6,7,8,9,11,12
    ],
    [//冻结解冻 index= 8
        2,3,4,5,6,7,8,9,10
    ],
    [//挂失解挂 index= 9
        2,3,4,5,6,7,8,9,11,12
    ],
    [//卡作废 index= 10;
        2,3,4,5,6,7,8,9,10,11
    ],
    [//换卡 index= 11
        2,3,4,5,6,7,8,9,11,12
    ],
    [//卡密管理 index= 12 字段较少，不需要隐藏表头

    ],
    [//持卡人管理 index= 13
        2,3,4,5,6,7,8,9,10,11
    ],
    [//子母卡绑定 index=14
        2,3,4,5,6,7,8
    ]
];