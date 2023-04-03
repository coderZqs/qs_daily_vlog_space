import { reactive, ref, computed } from "vue"
import billApi from "@/network/api/bill"
import { SUCCESS } from "@/network/response-status"
import { message } from "ant-design-vue"

let bill = ref({
    details: [{ id: 1, amount: 0 }, { id: 2, amount: 0 }, { id: 3, amount: 0 }]
})

let date = ref(new Date().getTime());

const useBill = () => {
    const addBill = async () => {
        let { code, msg } = await billApi.addBill({ details: bill.value.details, created_at: date.value });
        if (SUCCESS(code)) {
            return
        } else {
            message.error(msg);
        }
    }

    const billSummary = computed(() => {
        let count = bill.value.details.reduce((total, curr) => {
            return Number(total) + Number(curr.amount)
        }, 0)

        return count;
    })

    return {
        addBill,
        bill,
        billSummary
    }
}

export default useBill