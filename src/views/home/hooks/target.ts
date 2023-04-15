import { ref, reactive } from "vue"
import targetApi from "@/network/api/target"
import { SUCCESS } from "@/network/response-status";
import DateHelper from "@/utils/date"

enum Status {
    UNDO = 1,
    FINISH = 2,
    EXPIRE = 3
};

type Target = {
    "id": number,
    "content": string,
    "status": Status,
    "user_id": number,
    "created_at": string,
    "start_at": string,
    "end_at": string,
    "createdAt": string,
    "updatedAt": string
}
let targets = ref<Target[]>([]);

const getTarget = async (params?) => {

    // 默认今天

    let defaultParams = {
        start_at: DateHelper.curStartTime(),
        end_at: DateHelper.curEndTime(),
    };

    let { data, code, msg } = await targetApi.getTarget(params || defaultParams);

    if (SUCCESS(code)) {
        targets.value = data;
    }
}

const addTarget = async (data) => {
    return new Promise(async (resolve, reject) => {
        let { code, msg } = await targetApi.addTarget(data);
        if (SUCCESS(code)) {
            resolve()
        } else {
            reject();
        }
    })

}

export default function () {
    return {
        getTarget,
        addTarget,
        targets
    }
}