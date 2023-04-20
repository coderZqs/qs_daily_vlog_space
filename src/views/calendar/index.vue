<template>
  <div class="calendar">
    <div class="pa-2">
      <div class="header">{{ currentDate.month }} {{ currentDate.year }}</div>
      <div class="body">
        <div class="weekdays">
          <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        </div>
        <div class="days" style="background: #f5f5f5">
          <div class="last-month-day" v-for="day in lastMonthDay"></div>

          <div
            v-for="item in daysInMonth"
            :key="item.day"
            class="day-item"
            :class="{
              today: isToday(item.day),
              selected: isSelected(item.day)
            }"
            @click="selectDay(item.day)"
          >
            <div style="height: 100%; width: 100%">
              <div class="item">
                <span>dasdsasasa</span>
                <input type="text" />
              </div>
            </div>
          </div>

          <div class="next-month-day"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useCalendar } from "./useCalendar";
import CalendarAPI from "../../network/api/calendar";
import { SUCCESS } from "@/network/response-status";

let {
  daysOfWeek,
  daysInMonth,
  isToday,
  isSelected,
  lastMonthDay,
  selectDay,
  month,
  currentDate
} = useCalendar();

const calendars = ref([]);

const getList = async () => {
  let { year, month, day } = currentDate.value;

  let lastDayofMonth = new Date(year, month + 1, 0).getDate();
  let { data, code } = await CalendarAPI.getCalendar({
    startTime: new Date(year, month, 1).getTime(),
    endTime: new Date(year, month, lastDayofMonth).getTime()
  });

  if (SUCCESS(code)) {
    calendars.value = data.map(v => {
      return {
        ...v,
        task: JSON.parse(v.task),
        countdown: JSON.parse(v.countdown)
      };
    });
  }
};

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
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
    background: #f3f9f1;
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

    .note-item {
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
