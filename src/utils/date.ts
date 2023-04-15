//当天开始时间
const curStartTime = () => {
    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    return time;
}
//当天结束时间
const curEndTime = () => {
    const time = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
    return time;
}

export default {
    curStartTime, curEndTime
}