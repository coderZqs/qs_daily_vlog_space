<template>
  <div class="calendar">
    <div class="pa-2">
      <div class="header">{{ currentDate.month }} {{ currentDate.year }}</div>
      <div class="body">
        <div class="weekdays">
          <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        </div>
        <div class="days" style="background: white">
          <div class="last-month-day" v-for="day in daysInLastMonth"></div>

          <div
            v-for="item in daysInMonth"
            :key="item.day"
            class="day-item"
            :class="{
              today: isToday(item.day),
              selected: isSelected(item.day)
            }"
          >
            <div
              style="height: 100%; width: 100%"
              :style="{ background: item.bgcolor }"
              @click="enterEditStatus(item, $event)"
            >
              <div class="task-list" v-for="subTask in item.task">
                <p v-if="!subTask.isEdit" @click="subTask.isEdit = true">
                  {{ subTask.content }}
                </p>
                <input
                  v-else
                  type="text"
                  @blur="saveContent(item, $event)"
                  v-model="subTask.content"
                />
              </div>

              <div class="task-list">
                <input
                  class="add-input"
                  type="text"
                  @blur="saveContent(item, $event, 'ADD')"
                  v-model="item.addContent"
                />
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
import { onMounted } from "vue";
import { useCalendar } from "./useCalendar";
import { useData } from "./useData";
import CalendarAPI from "../../network/api/calendar";
import { SUCCESS } from "@/network/response-status";

let {
  daysOfWeek,
  daysInMonth,
  isToday,
  isSelected,
  daysInLastMonth,
  selectDay,
  currentDate
} = useCalendar();

const getList = async () => {
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

/**
 * 编辑状态
 * @param item
 */

const enterEditStatus = async (item, e) => {
  currentDate.value.day = item.day;
  if (e.target.tagName == "DIV") {
    let input = e.currentTarget.querySelector(".add-input");
    if (input) {
      input.focus();
    }
  } else {
  }
};

/**
 * 保存内容
 * @param item
 */

const saveContent = (item, $event, status?) => {
  let value = $event.target.value;
  if (value) {
    let { year, month, day } = currentDate.value;

    if (status === "ADD") {
      item.task.push({ content: value, status: 1 });
      item.addContent = "";
    }

    if (item.id) {
      CalendarAPI.updateCalendar({
        task: item.task,
        id: item.id
      });
    } else {
      CalendarAPI.addCalendar({
        task: item.task,
        date: new Date(year, month, day).getTime(),
        countdown: [],
        bgcolor: "#FFFFFF"
      });
    }
  }
};

onMounted(() => {
  getList();

  /*   add({
    task: [
      { content: "哈哈哈哈哈哈", status: 1 },
      { content: "哈哈哈哈哈哈", status: 1 },
      { content: "哈哈哈哈哈哈", status: 1 },
      { content: "哈哈哈哈哈哈", status: 1 }
    ],
    bgcolor: "#F5F5F5",
    countdown: [{ type: 1, describe: "zqszzzzzz" }],
    date: 1681884087452
  }); */
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
    margin: 0.1px;
    padding: 8px;

    .day-number {
      font-size: 20px;
      font-weight: 600;
    }

    input {
      width: 100%;
      height: 100%;
      display: block;
      padding: 0;
      border: none;
      background: transparent;
      outline: none;
    }

    .festival {
      position: absolute;
      right: 4px;
      top: 4px;
    }

    .task-list {
      p,
      input {
        line-height: 30px;
      }

      height: 30px;
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
