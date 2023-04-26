import { ref, computed, Ref, watch } from "vue";
import { findFestival } from "@/utils/date";
import calendar from "../../utils/calendar.js";

export const useCalendar = () => {
  const currentDate = ref({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  });

  let daysInMonth: Ref<any[]> = ref([]);
  let daysInLastMonth: Ref<any[]> = ref([]);

  const daysOfWeek = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  watch(
    () => currentDate.value,
    () => {
      let { year, month } = currentDate.value;
      const count = new Date(year, month + 1, 0).getDate();
      let lastCount = new Date(year, month - 1, 1).getDate();

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

      for (let i = 0; i < lastCount; i++) {
        let festivals = Object.values(findFestival(year, month - 1, i)).filter(
          v => Boolean(v)
        );
        daysInLastMonth.value.push({
          day: i,
          festivals,
          task: [],
          lunar: calendar.solar2lunar(year, month, i).IDayCn
        });
      }
    },
    { immediate: true }
  );

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
    daysInLastMonth,
    selectDay,
    month
  };
};
