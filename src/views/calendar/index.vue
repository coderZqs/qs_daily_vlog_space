<template>
  <div class="calendar">
    <div class="pa-2">
      <div class="header">{{ currentDate.month }} {{ currentDate.year }}</div>
      <div class="body">
        <div class="weekdays">
          <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        </div>
        <div class="days" style="background:#f5f5f5;">
          <div class="last-month-day" v-for="day in lastMonthDay"></div>

          <div v-for="item in daysInMonth" :key="item.day" class="day-item" :class="{
            today: isToday(item.day),
            selected: isSelected(item.day)
          }" @click="selectDay(item.day)">
            <div style="height:100%;width:100%;">
              <!--    <span class="day-number">{{ item.day }}</span>
              <span class="festival">{{ item.festivals[0] }}</span> -->

              <textarea v-model="item.content"></textarea>
            </div>
          </div>

          <div class="next-month-day"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from "vue";
import { findFestival } from "@/utils/date";

export default {
  name: "Calendar",
  setup(props) {
    const state = reactive({
      currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate()
      }
    });

    const selectedDate = ref(props.date);
    const daysOfWeek = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

    /**
     * 当月天数
     */

    const daysInMonth = computed(() => {
      let { year, month } = state.currentDate;
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        let festivals = Object.values(findFestival(year, month, i)).filter(v =>
          Boolean(v)
        );

        days.push({
          day: i,
          festivals,
          content: ""
        });
      }
      return days;
    });

    /**
     * 需要填充上个月的天数
     */

    const lastMonthDay = computed(() => {
      let { year, month } = state.currentDate;
      let lastMonth = month - 1;

      let lastDate = new Date(year, lastMonth + 1, 0).getDay();
      let firstDayinWeek = new Date(year, lastMonth, 1).getDate();


      console.log(firstDayinWeek)
      let days = [];


      for (let i = 0; i < firstDayinWeek; i++) {
        let festivals = Object.values(findFestival(year, lastMonth, i)).filter(
          v => Boolean(v)
        );

        days.push({
          day: i
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
      return monthNames[state.currentDate.year];
    });


    const getToday = () => {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();

      return { year, month, day }
    }

    const isToday = (day) => {
      let { year, month } = getToday();
      let { year: cyear, month: cmonth, day: cday } = state.currentDate;

      if (year === cyear && month === cmonth && day === cday) {
        return true;
      } else {
        return false;
      }
    };

    const isSelected = (day) => day == state.currentDate.day;

    const selectDay = (day) => {
      state.currentDate.day = day;
    }


    return {
      daysOfWeek,
      daysInMonth,
      isToday,
      isSelected,
      lastMonthDay,
      selectDay,
      ...state
    };
  }
};
</script>

<style lang="scss">
.calendar {
  font-family: Arial, sans-serif;
  width: 100%;
}

.header {
  padding: 5px;
  text-align: center;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin: 12px 0;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 4px;
  box-sizing: border-box;
  margin: 4px;

  .day-item {
    position: relative;
    background: white;
    height: 200px;
    box-sizing: border-box;
    padding: 8px;

    .day-number {
      font-size: 20px;
      font-weight: 600;
    }

    .festival {
      position: absolute;
      right: 4px;
      top: 4px;
    }

    textarea {
      width: 100%;
      height: 100%;
      display: block;
      padding: 0;
      border: none;
      outline: none;
    }
  }
}

.today {
  background-color: #9cf;
}

.selected {
  background-color: #6cf;
}
</style>
