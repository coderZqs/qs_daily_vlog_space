import { reactive, ref, computed } from "vue";
import billApi from "@/network/api/bill";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";

let bill = ref([
  { id: 1, amount: 0, content: "包子" },
  { id: 2, amount: 0, content: "快餐" },
  { id: 3, amount: 0, content: "自煮饭菜" }
]);

let date = ref(new Date().getTime());

const useBill = () => {
  const addBill = async () => {
    let { code, msg } = await billApi.addBill({
      details: bill.value,
      created_at: date.value
    });
    if (SUCCESS(code)) {
      return;
    } else {
      message.error(msg);
    }
  };

  const billSummary = computed(() => {
    let count = bill.value.reduce((total, curr) => {
      return Number(total) + Number(curr.amount);
    }, 0);

    return count;
  });

  const getBillByDay = async created_at => {
    let { code, data } = await billApi.getBill({ created_at });
    if (SUCCESS(code)) {
      console.log(data);
      bill.value = JSON.parse(data[0].details);
    }
  };

  return {
    addBill,
    bill,
    billSummary,
    getBillByDay
  };
};

export default useBill;
