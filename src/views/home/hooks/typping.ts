
let introduceGroup = ref([]);
let timer = null;

let introduceControl = async () => {
    let content = [
        { t: "嘿", watting: 2000 },
        { t: "恭喜你发现了神秘的新大陆", watting: 2000 },
        { t: "这里是一个程序员的个人网站", watting: 2000 },
        { t: "他叫青顺", watting: 2000 },
        { t: "注意是青不是清", watting: 2000 },
        { t: "他的目标是成为一名高级前端工程师", watting: 2000 },
        { t: "最喜欢的歌是《轨迹》", watting: 2000, category: "music" },
        { t: "最喜欢的歌手是《五月天》", watting: 2000 },
        { t: "就像很多人一样", watting: 2000 },
        { t: "他常常有很多奇怪的想法", watting: 2000 },
        { t: "也常常会迷茫", watting: 2000 },
        { t: "他是一个有趣的人", watting: 2000 },
        { t: "好吧，至少他是这么觉得的", watting: 2000 },
        { t: "他会把一些有趣的事情记录在这里", watting: 2000 },
        { t: "也会把坏情绪丢在这里", watting: 2000 },
        { t: "他总是随着心情记录，不按时不保量", watting: 2000 },
        { t: "没办法，谁叫这个网站是他创建的呢（得意）", watting: 2000 },
    ];

    let isShowIntroduce = ref(false);

    let index = 0;
    let contentIndex = 0;
};



/**
* 打字效果
*/

let typpingAnimate = (target, pointer, speed) => {
    let key = 0;
    return new Promise((resolve) => {
        timer = setInterval(async () => {
            if (pointer) {
                if (!target[index]) {
                    target[index] = {
                        t: "",
                        watting: pointer.watting,
                        category: pointer.category,
                    };
                }

                if (pointer.t.length > key - 1) {
                    target[index] = {
                        ...pointer,
                        t: pointer.t.substr(0, key),
                    };
                    key += 1;
                } else {
                    clearTimeout(timer);
                    resolve();
                }
            }
        }, speed);
    });
};

/**
* 等待X秒再进行下一次打字机效果
*/

const loading = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, time);
    });
};

/**
* 按空格跳过本次打字效果
*/

window.addEventListener("keydown", async (e) => {
    if (e.code === "Space") {
        if (content.length <= contentIndex) {
            return;
        }

        clearInterval(timer);
        introduceGroup.value = [];
        typpingAnimate(introduceGroup.value, content[contentIndex], 50);
        contentIndex++;
    }
});