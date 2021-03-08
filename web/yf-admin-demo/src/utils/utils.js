export default {
    notNull:notNull,
    notEmpty:notEmpty,
    isString:isString,
    timeDesc:timeDesc,
    timeStr:timeStr,
    nextYearYesterday:nextYearYesterday
}

function notNull(target) {
    return (!(target === null || typeof(target) === "undefined" || isNaN(target)))
}
function notEmpty(target) {
    if (!notNull(target)) {
        return false;
    }

    if (Object.prototype.toString.call(target) === "[object String]") {
        if (target === "") {
            return false;
        }
    }
    else if (Object.prototype.toString.call(target) === "[object Array]") {
        if (target.length === 0) {
            return false;
        }
    }
    else if (Object.prototype.toString.call(target) === '[object Object]') {
        for (let key in target) {
            return true;
        }
        return false;
    }
    return true;
}

function isString (target, isEmpty) {
    if (notNull(target) === false) {return false}

    if ((Object.prototype.toString.call(target) === "[object String]")) {
        if (isEmpty) {
            return target !== ""
        }
        return true;
    }
    return false;
}

function isArray (target, isEmpty) {
    if (notNull(target) === false) {return false}

    if ((Object.prototype.toString.call(target) === "[object Array]")) {
        if (isEmpty) {
            return target.length > 0;
        }
        return true;
    }
    return false;
}
function isFunction (target) {
    return typeof target === "function";
}

/** time可以是时间戳（秒单位）或者日期类型，time如果是字符串，格式应该是： 2019-07-23T16:31:30+08:00 */
function timeStr (date, formate) {
    let year, month, day, hour, minute, second;
    let objType = Object.prototype.toString.call(date);
    if (objType === "[object Date]") {
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();
    }
    else if (objType === "[object Number]") {
        if (date <= 0) {return "-"}

        let d = new Date(parseInt(date) * 1000);
        if (d) {
            year = d.getFullYear();
            month = d.getMonth() + 1;
            day = d.getDate();
            hour = d.getHours();
            minute = d.getMinutes();
            second = d.getSeconds();
        }
    } else if (objType === "[object String]") {
        try {
            year = parseInt(date.substr(0,4));
            month = parseInt(date.substr(5,2));
            day = parseInt(date.substr(8,2));
            hour = parseInt(date.substr(11,2));
            minute = parseInt(date.substr(14,2));
            second = parseInt(date.substr(18,2));
        } catch (res) {
            return ""
        }
    }

    if (!year || year < 1900) {
        return "-"
    }

    if (month < 10) {month = '0' + month}
    if (day < 10) {day = '0' + day}
    if (hour < 10) {hour = '0' + hour}
    if (minute < 10) {minute = '0' + minute}
    if (second < 10) {second = '0' + second}

    if (!formate) {formate = 'Y.M.D H:M'}
    formate += '';
    switch (formate) {
        case 'Y-M-D H:M:S':
            return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":" + second);
        case 'Y-M-D H:M':
            return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute);
        case 'Y.M.D H:M':
            return (year + '.' + month + '.' + day + ' ' + hour + ':' + minute);
        case 'Y年M月D日 H:M':
            return (year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute);
        case 'Y.M.D':
            return (year + '.' + month + '.' + day);
        case 'Y-M-D':
            return (year + '-' + month + '-' + day);
        case 'Y/M/D':
            return (year + '/' + month + '/' + day);
        case 'Y年M月D日':
            return (year + '年' + month + '月' + day + '日');
        case 'M月D日 H:M':
            return (month + '月' + day + '日' + " " + hour + ":" + minute);
        case 'M.D H:M':
            return (month + '.' + day + " " + hour + ":" + minute);
        case 'M月D日':
            return (month + '月' + day + '日');
        case 'M-D':
            return (month + '-' + day);
        case 'H:M':
            return (hour + ':' + minute);
        default:break;
    }
    return "";
};

/** time可以是时间戳（秒单位）或者日期类型，time如果是字符串，格式应该是： 2019-07-23T16:31:30+08:00 */
function timeDesc (time) {
    let objType = Object.prototype.toString.call(time);
    let timeStamp = 0;
    if (objType === "[object Date]") {
        timeStamp = parseInt(time.getTime()/1000)
    }
    else if (objType === "[object String]") {
        try {
            let s = "";
            let ary = time.split("T");
            if (ary && ary.length > 0) {
                s = ary[0];

                let ary2 = ary[1].split('+');
                if (ary2 && ary2.length >= 2) {
                    s +=  " " + ary2[0];

                    s = s.replace(/-/g,"/");
                    timeStamp = parseInt(new Date(s).getTime() / 1000);
                }
            }

        } catch (err) {
            return ""
        }
    }
    else if (objType === "[object Number]") {

    }

    if (timeStamp === 0) {return ""}

    // 获取当前时间戳
    let currentTime = parseInt(new Date().getTime()/1000);
    let diffTime     = currentTime - timeStamp;

    if (diffTime <= 60) {
        if (diffTime <= 30) {
            return '刚刚';
        } else {
            return '1分钟前';
        }
    }
    else if (diffTime > 60 && diffTime < 60 * 60) {
        return parseInt((diffTime - 60) / 60.0) + 1 + "分钟前" ;
    }
    else if (diffTime >= 60 * 60 && diffTime < 60 * 60 * 24) {
        return parseInt((diffTime - 3600) / 3600) + 1 + '小时前';
    }
    else {
        //超过1天
        return parseInt((diffTime - 3600 * 24) / (3600 * 24)) + 1 + '天前';
    }
}

function nextYearYesterday(date){
    if (Object.prototype.toString.call(date) !== "[object Date]") {
        date = new Date();
    }

    date.setFullYear(date.getFullYear()+1);
    date.setDate(date.getDate()-1);
    return date;
}