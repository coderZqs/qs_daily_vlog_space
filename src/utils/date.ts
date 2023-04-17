import calendar from "./calendar.js";
function judgeLunarFestival(y, m, d) {
  /*定义公历节日*/
  var sFtv = new Array(
    "0101 元旦",
    "0214 情人节",
    "0307 女生节",
    "0308 妇女节",
    "0312 植树节",
    "0401 愚人节",
    "0404 清明节",
    "0501 劳动节",
    "0504 青年节",
    "0601 儿童节",
    "0701 建党节",
    "0801 建军节",
    "0910 教师节",
    "1001 国庆节",
    "1031 万圣节",
    "1224 平安夜",
    "1225 圣诞节"
  );

  // 公历节日
  for (let i in sFtv) {
    if (sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
      if (Number(RegExp.$1) == m && Number(RegExp.$2) == d) {
        return RegExp.$4;
      }
    }
  }
}

//定义周历节日
//某月的第几个星期几。 5,6,7,8 表示到数第 1,2,3,4 个星期几
var wFtv = new Array(
  "0420 复活节", //在每年春分月圆之后第一个星期日 耶穌受難節是復活節前一个星期五
  "0520 母亲节", //每年5月的第二个星期日
  "0950 世界心脏日", //最后一个星期日
  "0630 父亲节", //每年公历6月的第三个星期日
  "1144 感恩节" //1月的第四个星期四庆祝感恩节
);
// 周节日
function judgeWeeklyFestival(y, m, d) {
  for (let i in wFtv) {
    if (wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
      if (Number(RegExp.$1) == m) {
        var firstWeek = new Date(y + "/" + m + "/" + "01").getDay();
        let tmp1 = Number(RegExp.$2);
        let tmp2 = Number(RegExp.$3);
        if (tmp1 < 5) {
          var day =
            (firstWeek > tmp2 ? 7 : 0) + 7 * (tmp1 - 1) + tmp2 - firstWeek + 1;
          if (d == day) {
            return RegExp.$5;
          }
        } else {
          tmp1 -= 5;
          var nowMonthTime = new Date(y + "/" + m + "/" + "01").getTime();
          var nextMonthTime = new Date(
            y + "/" + (m + 1) + "/" + "01"
          ).getTime();
          var countDays = (nextMonthTime - nowMonthTime) / 24 / 60 / 60 / 1000;
          let tmp3 = (firstWeek + countDays - 1) % 7; //当月最后一天星期几
          var day = countDays - tmp3 - 7 * tmp1 + tmp2 - (tmp2 > tmp3 ? 7 : 0);
          if (d == day) {
            return RegExp.$5;
          }
        }
      }
  }
}

// 二十四节气
function judgeTerms(y, m, d) {
  var solarTerm = new Array(
    "小寒",
    "大寒",
    "立春",
    "雨水",
    "惊蛰",
    "春分",
    "清明",
    "谷雨",
    "立夏",
    "小满",
    "芒种",
    "夏至",
    "小暑",
    "大暑",
    "立秋",
    "处暑",
    "白露",
    "秋分",
    "寒露",
    "霜降",
    "立冬",
    "小雪",
    "大雪",
    "冬至"
  );
  var sTermInfo = new Array(
    0,
    21208,
    42467,
    63836,
    85337,
    107014,
    128867,
    150921,
    173149,
    195551,
    218072,
    240693,
    263343,
    285989,
    308563,
    331033,
    353350,
    375494,
    397447,
    419210,
    440795,
    462224,
    483532,
    504758
  );
  var mon = m - 1;
  var solarTerms = "";
  // while (solarTerms == "") {
  var sotmp1 = new Date(
    31556925974.7 * (y - 1900) +
      sTermInfo[mon * 2 + 1] * 60000 +
      Date.UTC(1900, 0, 6, 2, 5)
  );
  var sotmp2 = sotmp1.getUTCDate(); //根据世界时返回一个月 (UTC) 中的某一天
  if (sotmp2 == d) {
    solarTerms = solarTerm[mon * 2 + 1];
    return solarTerms;
  }
  sotmp1 = new Date(
    31556925974.7 * (y - 1900) +
      sTermInfo[mon * 2] * 60000 +
      Date.UTC(1900, 0, 6, 2, 5)
  );
  sotmp2 = sotmp1.getUTCDate();
  if (sotmp2 == d) {
    solarTerms = solarTerm[mon * 2];
    return solarTerms;
  }
}

// 判断是否农历生日
function judgeSolarFestival(y, m, d) {
  let festivals = [
    "0101 春节",
    "0115 元宵节",
    "0505 端午节",
    "0707 七夕情人节",
    "0715 中元节",
    "0815 中秋节",
    "0909 重阳节",
    "1208 腊八节",
    "1224 小年"
  ];

  let { lDay, lMonth } = calendar.solar2lunar(y, m, d);

  // 公历节日
  for (let i in festivals) {
    if (festivals[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
      if (Number(RegExp.$1) == lMonth && Number(RegExp.$2) == lDay) {
        return RegExp.$4;
      }
    }
  }
}

/**
 * 查询某一天有什么节日
 */

function findFestival(y, m, d) {
  let lunarF = judgeLunarFestival(y, m, d);
  let weeklyF = judgeWeeklyFestival(y, m, d);
  let solarF = judgeSolarFestival(y, m, d);
  let terms = judgeTerms(y, m, d);

  return { lunarF, weeklyF, solarF, terms };
}

//当天开始时间
const curStartTime = () => {
  let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  return time;
};
//当天结束时间
const curEndTime = () => {
  const time = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
  return time;
};

export {
  findFestival,
  judgeLunarFestival,
  judgeWeeklyFestival,
  judgeSolarFestival,
  curStartTime,
  curEndTime
};
