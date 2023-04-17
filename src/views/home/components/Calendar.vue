<template>
  <div class="calendar">
    <div class="header">{{ month }} {{ year }}</div>
    <div class="body">
      <div class="weekdays">
        <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      </div>
      <div class="days">
        <div class="last-month-day" v-for="day in lastMonthDay"></div>

        <div
          v-for="item in daysInMonth"
          :key="item.day"
          :class="{ today: isToday(item.day), selected: isSelected(item.day) }"
          @click="selectDay(item.day)"
        >
          <p>{{ item.day }}</p>
          <div>{{ item.festivals[0] }}</div>
        </div>

        <div class="next-month-day"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { findFestival } from "@/utils/date";

export default {
  name: "Calendar",
  props: {
    date: {
      type: Date,
      default: () => new Date()
    }
  },
  setup(props) {
    const selectedDate = ref(props.date);
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daysInMonth = computed(() => {
      const year = selectedDate.value.getFullYear();
      const month = selectedDate.value.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        let festivals = Object.values(findFestival(year, month, i)).filter(v =>
          Boolean(v)
        );

        days.push({
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          day: i,
          festivals
        });
      }
      return days;
    });

    const lastMonthDay = computed(() => {
      let lastDate = new Date(2023, 3, 17);
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
      return monthNames[selectedDate.value.getMonth()];
    });

    const year = computed(() => selectedDate.value.getFullYear());

    const isToday = day => {
      const today = new Date();
      return (
        day === today.getDate() &&
        selectedDate.value.getMonth() === today.getMonth() &&
        selectedDate.value.getFullYear() === today.getFullYear()
      );
    };

    const isSelected = day => {
      return (
        day === selectedDate.value.getDate() &&
        selectedDate.value.getMonth() === props.date.getMonth() &&
        selectedDate.value.getFullYear() === props.date.getFullYear()
      );
    };

    const selectDay = day => {
      selectedDate.value = new Date(
        selectedDate.value.getFullYear(),
        selectedDate.value.getMonth(),
        day
      );
    };

    return {
      daysOfWeek,
      daysInMonth,
      month,
      year,
      isToday,
      isSelected,
      selectDay
    };
  }
};
</script>

<style lang="scss">
.calendar {
  font-family: Arial, sans-serif;
  width: 500px;
  border: 1px solid #ccc;
}

.header {
  background-color: #f0f0f0;
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
  gap: 5px;
  padding: 5px;
  text-align: center;

  > div {
    height: 60px;
  }
}

.today {
  background-color: #9cf;
}

.selected {
  background-color: #6cf;
}
</style>
