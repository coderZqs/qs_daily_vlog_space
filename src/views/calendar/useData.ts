import { ref } from "vue";
import CalendarAPI from "../../network/api/calendar";
import { SUCCESS } from "@/network/response-status";

export const useData = () => {
  let calendars = ref([]);

  let get = async params => {
    let { code, data } = await CalendarAPI.getCalendar(params);
    if (SUCCESS(code)) {
      calendars.value = data;
    }
  };

  let update = async data => {
    let { code } = await CalendarAPI.updateCalendar({ ...data });

    if (SUCCESS(code)) {
      return;
    }
  };

  let add = async data => {
    let { code } = await CalendarAPI.updateCalendar({ ...data });

    if (SUCCESS(code)) {
      return;
    }
  };

  return {
    calendars,
    update,
    add,
    get
  };
};
