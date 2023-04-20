import { ref, computed } from "vue";
import { findFestival } from "@/utils/date";

export const useCalendar = () => {
  const currentDate = ref({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate()
  });

  const daysOfWeek = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const daysInMonth = computed(() => {
    let { year, month } = currentDate.value;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: any[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      let festivals = Object.values(findFestival(year, month, i)).filter(v =>
        Boolean(v)
      );

      days.push({ day: i, festivals, content: "" });
    }

    return days;
  });

  /**
   * 需要填充上个月的天数
   */

  const lastMonthDay = computed(() => {
    let { year, month } = currentDate.value;
    let lastMonth = month - 1;

    let firstDayinWeek = new Date(year, lastMonth, 1).getDate();
    let days: any[] = [];

    for (let i = 0; i < firstDayinWeek; i++) {
      let festivals = Object.values(findFestival(year, lastMonth, i)).filter(
        v => Boolean(v)
      );

      days.push({
        day: i,
        festivals
      });
    }

    return days;
  });

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

  return {
    currentDate,
    daysOfWeek,
    daysInMonth,
    isToday,
    isSelected,
    lastMonthDay,
    selectDay,
    month
  };
};
