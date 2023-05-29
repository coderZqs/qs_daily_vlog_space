<template>
  <div class="calendar">
    <div class="pa-2">
      <div class="header flex items-center justify-end">
        <LeftOutlined style="font-size:16px;" class="m-2" @click="prevMonth"></LeftOutlined>
        <span style="margin-top:2px">{{ currentDate.year }} 年 {{ currentDate.month }} 月</span>
        <RightOutlined style="font-size:16px;" class="m-2" @click="nextMonth"></RightOutlined>
      </div>
      <div class="body">
        <div class="weekdays">
          <div v-for="day in daysOfWeek" :key="day" class="flex justify-between items-center">
            <span>{{ day }}</span>
            <a-popover title="设置周任务" placement="bottomRight">
              <template #content></template>
              <menu-fold-outlined />
            </a-popover>
          </div>
        </div>
        <div class="days" style="background: white">
          <div v-for="(item, index) in daysInMonth" :key="index" class="day-item" :class="{
              today: isToday(item.day),
              selected: isSelected(item.day)
            }" :style="{ background: item.bgcolor }">
            <div class="day-number">
              <span class="solar">{{ item.day }}</span>
              <span class="lunar">{{
                item.festivals.length ? item.festivals[0] : item.lunar
              }}</span>
            </div>

            <div @click="enterEditStatus(item, $event)" style="height:100%">
              <a-popover placement="bottomLeft" v-for="(subTask, key) in item.task">
                <template #content>
                  <div class="flex items-center">
                    <CheckOutlined style="font-size: 16px" @click="finishTask(item, subTask)" />
                    <div class="divider"></div>
                    <a-popover placement="bottomLeft" :getPopupContainer="trigger => trigger.parentNode">
                      <template #content>
                        <ColorPicker theme="light" :color="subTask.color" :sucker-hide="true"
                          @changeColor="changeColor($event, subTask, item)" />
                      </template>
                      <div class="flex items-center font-box justify-center cursor-pointer"
                        :style="{ color: subTask.color }">
                        A
                      </div>
                    </a-popover>
                    <div class="divider"></div>
                    <delete-outlined class="cursor-pointer" @click="removeTask(item.task, key, item)" />
                  </div>
                </template>
                <div class="task-list">
                  <p v-if="!subTask.isEdit" @click="subTask.isEdit = true" :style="{
                        color: subTask.color,
                        textDecoration: subTask.status === 1 ? '' : 'line-through'
                      }">
                    {{ subTask.content }}
                  </p>
                  <input :style="{
                    color: subTask.color,
                    textDecoration: subTask.status === 1 ? '' : 'line-through'
                  }" v-else type="text" @blur="saveContent(item)" v-model="subTask.content" />
                </div>
              </a-popover>

              <div class="task-list">
                <input class="add-input" type="text" @blur="addTask(item, $event.target!.value)"
                  v-model="item.addContent" />
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
import { onMounted, ref } from "vue";
import { useCalendar } from "./useCalendar";
import { useData } from "./useData";
import CalendarAPI from "../../network/api/calendar";
import { SUCCESS } from "@/network/response-status";
import { ColorPicker } from "vue-color-kit";
import { CheckOutlined } from "@ant-design/icons-vue";
import "vue-color-kit/dist/vue-color-kit.css";
import { MenuFoldOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons-vue";

let {
  daysOfWeek,
  daysInMonth,
  isToday,
  isSelected,
  daysInLastMonth,
  selectDay,
  currentDate,
  prevMonth,
  nextMonth,
  getList
} = useCalendar();


/**
 * 编辑状态
 * @param item
 */

const enterEditStatus = async (item, e) => {
  currentDate.value.day = item.day;
  if (e.target.tagName == "DIV") {
    console.log(42312)
    let input = e.currentTarget.querySelector(".add-input");
    if (input) {
      input.focus();
    }
  } else {
  }
};

/**
 * 添加内容
 * @param item
 * @param value
 * @param subTask
 */

const addTask = (item, value) => {
  if (value) {
    item.task.push({ content: value, status: 1, color: "black" });
    item.addContent = "";

    saveContent(item);
  }
};

/**
 * 删除
 */

const removeTask = (task, key, item) => {
  task.splice(key, 1)

  saveContent(item);
}

/**
 * 完成任务
 */

const finishTask = (item, subTask) => {
  let status = subTask.status === 1 ? 0 : 1;
  subTask.status = status;

  saveContent(item);
};

/**
 * 保存内容
 * @param item
 */

const saveContent = item => {
  let { year, month, day } = currentDate.value;

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
      bgcolor: ""
    });
  }
};

/**
 * 修改颜色
 * @param subTask
 */

let changeColor = (color, subTask, item) => {
  const { r, g, b, a } = color.rgba;
  subTask.color = `rgba(${r}, ${g}, ${b}, ${a})`;

  saveContent(item);
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
  text-align: right;
}

.weekdays {
  display: grid;
  font-size: 14px;
  grid-template-columns: repeat(7, 1fr);
  margin: 0px 6px;

  div {
    font-weight: 600;
    padding: 4px 8px;
    margin: 0 2px;
    background: #f3f9f1;
  }

}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 4px;
  box-sizing: border-box;
  margin: 4px;
  margin-top: 0px !important;

  .day-item {
    position: relative;
    background: #f3f9f1;
    min-height: 200px;
    box-sizing: border-box;
    margin: 0.1px;
    padding: 8px;

    .day-number {
      display: flex;
      align-items: center;

      .solar {
        font-size: 16px;
        font-weight: 600;
      }

      .lunar {
        font-size: 13px;
        color: gray;
        margin-left: 20px;
      }
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
      padding: 4px;

      p,
      input {
        height: 30px;
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

.font-box {
  width: 20px;
  height: 20px;
  font-size: 18px;
}

.divider {
  margin: 0 12px;
  height: 16px;
  width: 1px;
  background: gray;
}
</style>
