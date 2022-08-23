interface Timer {
    totalWeek: number; // 总周数：[1, 30]之间的整数
    startSemester: string; // 开学时间：时间戳，13位长度字符串，推荐用代码生成
    startWithSunday: boolean; // 是否是周日为起始日，该选项为true时，会开启显示周末选项
    showWeekend: boolean; // 是否显示周末
    forenoon: number; // 上午课程节数：[1, 10]之间的整数
    afternoon: number; // 下午课程节数：[0, 10]之间的整数
    night: number; // 晚间课程节数：[0, 10]之间的整数
    sections: {
        section: number; // 节次：[1, 30]之间的整数
        startTime: string; // 开始时间：参照这个标准格式5位长度字符串
        endTime: string; // 结束时间：同上
    }[]; // 课程时间表，注意：总长度要和上边配置的节数加和对齐
}

/**
 * 获取开学时间
 */
async function getStartDate(): Promise<number> {
    const nowDate = new Date();
    const month = nowDate.getMonth();
    if (month > 6) {
        return new Date(nowDate.getFullYear(), 8, 1).getTime();
    } else {
        return new Date(nowDate.getFullYear(), 2, 1).getTime();
    }
}


const scheduleTimer = async (providerRes?: string, parserRes?: ParserResult): Promise<Timer> => {

    // console.log(providerRes)

    // console.log(parserRes)

    const result: Timer = {
        totalWeek: 20,
        startSemester: String(await getStartDate()),
        startWithSunday: false,
        showWeekend: parserRes ? (parserRes?.courseInfos.filter((courseInfo) => courseInfo.day === 7).length > 0) : true,
        forenoon: 4,
        afternoon: 4,
        night: 2,
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
    };

    return result
}



