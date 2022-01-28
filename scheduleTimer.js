
/**
 * 获取开学时间
 */
async function getStartDate() {
    const nowDate = new Date();
    const month = nowDate.getMonth();
    if (month >= 6) {
        return new Date(nowDate.getFullYear(), 8, 1).getTime();
    } else {
        return new Date(nowDate.getFullYear(), 2, 1).getTime();
    }
}


/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer() {
    return {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: String(await getStartDate()), // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: true, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: true, // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 2, // 晚间课程节数：[0, 10]之间的整数
        sections: [
            {
                section: 1,
                startTime: "08:00",
                endTime: "08:45"
            },
            {
                section: 2,
                startTime: "08:55",
                endTime: "09:40"
            },
            {
                section: 3,
                startTime: "10:00",
                endTime: "10:45"
            },
            {
                section: 4,
                startTime: "10:55",
                endTime: "11:40"
            },
            {
                section: 5,
                startTime: "14:30",
                endTime: "15:15"
            },
            {
                section: 6,
                startTime: "15:25",
                endTime: "16:10"
            },
            {
                section: 7,
                startTime: "16:30",
                endTime: "17:15"
            },
            {
                section: 8,
                startTime: "17:25",
                endTime: "18:10"
            },
            {
                section: 9,
                startTime: "19:00",
                endTime: "19:45"
            },
            {
                section: 10,
                startTime: "19:55",
                endTime: "20:40"
            },
        ],
    }
}
