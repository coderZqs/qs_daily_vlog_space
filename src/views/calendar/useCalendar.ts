import { ref, computed, Ref, watch } from "vue";
import { findFestival } from "@/utils/date";
import calendar from "../../utils/calendar.js";
import CalendarAPI from "../../network/api/calendar";
import { SUCCESS } from "@/network/response-status";

export const useCalendar = () => {
  const currentDate = ref({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  });

  let daysInMonth: Ref<any[]> = ref([]);

  const daysOfWeek = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];


  const generateCalendar = () => {
    daysInMonth.value = []

    let { year, month } = currentDate.value;
    const count = new Date(year, month + 1, 0).getDate();
    let lastCount = new Date(year, month - 1, 1).getDate();
    let lastDaysCount = new Date(year, month, 0).getDate();

    console.log(lastCount, lastDaysCount)

    for (let i = 0; i < lastCount; i++) {
      let festivals = Object.values(findFestival(year, month - 1, i)).filter(
        v => Boolean(v)
      );

      daysInMonth.value.push({
        day: lastDaysCount - i,
        festivals,
        task: [],
        lunar: calendar.solar2lunar(year, month, i).IDayCn
      });
    }

    for (let i = 1; i <= count; i++) {
      let festivals = Object.values(findFestival(year, month, i)).filter(v =>
        Boolean(v)
      );

      daysInMonth.value.push({
        day: i,
        festivals,
        task: [],
        lunar: calendar.solar2lunar(year, month, i).IDayCn
      });
    }
  }

  const month = computed(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return monthNames[currentDate.value.year];
  });

  /**
   * 获取今天的年月日
   */

  const getToday = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return { year, month, day };
  };

  /**
   * 判断是否今天
   * @returns
   */

  const isToday = day => {
    let { year, month } = getToday();
    let { year: cyear, month: cmonth, day: cday } = currentDate.value;

    if (year === cyear && month === cmonth && day === cday) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * 判断是否选中的
   */

  const isSelected = day => day == currentDate.value.day;

  /**
   * 选择天数
   * @param day
   */

  const selectDay = day => (currentDate.value.day = day);


  /**
   * 上一个月
   */

  const prevMonth = () => {
    currentDate.value.month -= 1;
    getList();
  }

  /**
   * 下一个月
   */

  const nextMonth = () => {
    currentDate.value.month += 1;
    getList();
  }



  const getList = async () => {
    generateCalendar();

    let { year, month } = currentDate.value;

    let lastDayofMonth = new Date(year, month + 1, 0).getDate();
    let { data, code } = await CalendarAPI.getCalendar({
      startTime: new Date(year, month, 1).getTime(),
      endTime: new Date(year, month, lastDayofMonth).getTime()
    });

    if (SUCCESS(code)) {
      daysInMonth.value.forEach(ele => {
        ele.isEdit = false;
        data.forEach(item => {
          let date = new Date(item.date);
          let year = date.getFullYear();
          let month = date.getMonth();
          let day = date.getDate();

          let { year: cyear, month: cMonth } = currentDate.value;

          if (year === cyear && month == cMonth && day === ele.day) {
            ele.id = item.id;
            ele.task = item.task;
            ele.countdown = item.countdown;
            ele.bgcolor = item.bgcolor;
            ele.isEdit = false;
          }
        });
      });
    }
  };

  return {
    currentDate,
    daysOfWeek,
    daysInMonth,
    isToday,
    isSelected,
    selectDay,
    month,
    nextMonth,
    prevMonth,
    getList
  };
};
