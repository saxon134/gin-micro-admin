export default {
    statusStr:statusStr,
    productStr:productStr,
    productAry:productAry,
    bloggerAry:bloggerAry,
    parentTypeStr:parentTypeStr,
    eduTypeAry:eduTypeAry
};

function statusStr(status) {
    status += "";
    switch (status) {
        case "1": return "审核中";
        case "2": return "正常";
        case "3": return "禁用";
        case "4": return "已读";
        case "5": return "过期";
        case "6": return "已禁止";
        case "7": return "结束";
        case "8": return "进行中";
        case "9": return "失败";
        case "10": return "已退款";
        default: return "";
    }
}

function productStr(product) {
    product += "";
    switch (product) {
        case "1": return "创吧与木";
        case "2": return "心悦";
        case "3": return "研塑社";
        case "4": return "萌宠";
        case "5": return "萌物集合";
        case "6": return "淘宝客";
        case "7": return "小说";
        case "8": return "茶艺";
        case "9": return "厨艺";
        case "10": return "童学";
        case "11": return "解梦";
        case "12": return "短视频";
        default: return "";
    }
}

function productAry() {
    return [
        {v:1,n:'创吧与木'},
        {v:2,n:'心悦'},
        {v:3,n:'研塑社'},
        {v:4,n:'萌宠'},
        {v:5,n:'萌物集合'},
        {v:6,n:'淘宝客'},
        {v:7,n:'小说'},
        {v:8,n:'茶艺'},
        {v:9,n:'厨艺'},
        {v:10,n:'童学'},
        {v:11,n:'解梦'},
        {v:12,n:'短视频'}
    ];
}

function bloggerAry() {
    return [
        {id:9999,name:'吸猫酱'},
        {id:9998, name:'舌尖上的跳动'},
        {id:9997, name:'茶一味'},
        {id:9996, name:'恩妮の软萌'},
        {id:9995, name:'父母早教学堂'},
        {id:9994, name:'宝宝食谱'},
    ];
}

function parentTypeStr(type) {
    let ary = [
        "",
        "内容",
        "商品",
        "评论",
        "阅读",
        "服务",
        "集合",
        "广告位",
        "联盟商品",
        "联盟选品库",
        "",
        "用户",
        "朗读",
        "写作",
        "国学",
        "成语",
        "寓言故事",
    ];
    let idx = parseInt(type);
    if (idx > 0 && idx < ary.length) {
        return ary[idx];
    }
    return "";
}

function eduTypeAry() {
    return [
        {v:14, n:'国学'},
        {v:15, n:'成语'},
        {v:16, n:'寓言故事'}
    ];
}