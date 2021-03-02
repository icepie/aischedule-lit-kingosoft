
function isEmpty(val) {
    // null or undefined
    if (val == null) return true;

    if (typeof val === 'boolean') return false;

    if (typeof val === 'number') return !val;

    if (val instanceof Error) return val.message === '';

    switch (Object.prototype.toString.call(val)) {
        // String or Array
        case '[object String]':
        case '[object Array]':
            return !val.length;

        // Map or Set or File
        case '[object File]':
        case '[object Map]':
        case '[object Set]': {
            return !val.size;
        }
        // Plain Object
        case '[object Object]': {
            return !Object.keys(val).length;
        }
    }

    return false;
}
function week2Day(day) {
    switch (day) {
        case "一": return 1;
        case "二": return 2;
        case "三": return 3;
        case "四": return 4;
        case "五": return 5;
        case "六": return 6;
        case "日": return 7;
    }
    return 7
}
// "7-9,10-11" -> [{section:7},{section:8},{section:9},{section:10},{section:11}]
function multisectionText2List(text) {
    let sections = [];
    let splited = text.split(",");
    for (let t of splited) {
        let sec = sectionText2List(t);
        sections = sections.concat(sec);
    }
    return sections;
}
// "7-9" -> [{section:7},{section:8},{section:9}]
function sectionText2List(text) {
    let sections = [];

    let splited = text.split("-");
    if (splited.length == 1) {
        sections.push({ section: Number(text) });
        return sections;
    }
    let start = Number(splited[0]);
    let end = Number(splited[1]);
    for (let i = start; i <= end; i++) {
        sections.push({ section: i });
    }
    return sections;
}

// "7-9,10-11" -> [7,8,9,10,11]
function multiWeekText2List(text) {
    let sections = [];
    let splited = text.split(",");
    for (let t of splited) {
        let sec = weekText2List(t);
        sections = sections.concat(sec);
    }
    return sections;
}
// "7-9" -> [7,8,9]
function weekText2List(text) {
    let sections = [];
    let splited = text.split("-");
    if (splited.length == 1) {
        sections.push(Number(text));
        return sections;
    }
    let start = Number(splited[0]);
    let end = Number(splited[1]);
    for (let i = start; i <= end; i++) {
        sections.push(i);
    }
    return sections;
}

function substringBefore(obj, s) {
    let index = obj.indexOf(s);
    if (index == -1)
        return obj;
    return obj.substring(0, index);
}
function substringBeforeLast(obj, s) {
    let index = obj.lastIndexOf(s);
    return obj.substring(0, index);
}
function substringAfter(obj, s) {
    let index = obj.indexOf(s);
    if (index == -1)
        return obj;
    return obj.substring(index + s.length, obj.length);
}
function substringAfterLast(obj, s) {
    let index = obj.lastIndexOf(s);
    return obj.substring(index +  s.length, obj.length);
}

let sectionTimeSummer = [
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
        startTime: "15:20",
        endTime: "16:05"
    },
    {
        section: 7,
        startTime: "16:25",
        endTime: "17:10"
    },
    {
        section: 8,
        startTime: "17:20",
        endTime: "18:05"
    },
    {
        section: 9,
        startTime: "18:10",
        endTime: "18:55"
    },
    {
        section: 10,
        startTime: "19:30",
        endTime: "20:15"
    },
    {
        section: 11,
        startTime: "20:20",
        endTime: "21:05"
    },
    {
        section: 12,
        startTime: "21:10",
        endTime: "21:55"
    },
]

let sectionTimeWinter = [
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
        startTime: "14:00",
        endTime: "14:45"
    },
    {
        section: 6,
        startTime: "14:50",
        endTime: "15:33"
    },
    {
        section: 7,
        startTime: "15:55",
        endTime: "16:40"
    },
    {
        section: 8,
        startTime: "16:50",
        endTime: "17:35"
    },
    {
        section: 9,
        startTime: "17:40",
        endTime: "18:25"
    },
    {
        section: 10,
        startTime: "19:00",
        endTime: "19:45"
    },
    {
        section: 11,
        startTime: "19:50",
        endTime: "20:35"
    },
    {
        section: 12,
        startTime: "20:40",
        endTime: "21:25"
    },
]
function parser(tbody) {
    let trList = Array.from(tbody.children)
    let 课程 = []
    for (let tr of trList) {
        let nameText = tr.children[1].children[0].innerText;
        let 名称 = substringAfterLast(nameText, "]");
        let 显示教师职称 = false;
        let teacherText = tr.children[4].children[0].innerText
        let 任课教师 = ""
        if (显示教师职称) {
            任课教师 = teacherText
        } else {
            任课教师 = substringBefore(teacherText, "[")
        }

        let 上课安排 = [];
        let scheduleTextSplited = tr.lastElementChild.innerHTML.split("<br>")
        for (let eachScheduleText of scheduleTextSplited) {
            if (isEmpty(eachScheduleText)) {
                continue
            }

            let splited = eachScheduleText.split("/")
            if (isEmpty(splited)) {
                continue
            }
            let 地点 = "";
            if (splited.length > 1) {
                地点 = splited[1];
            }
            if (地点 == "在线课程上课时间见通知") {
                地点 = "在线"
            }
            let timeText = splited[0]
            //                    [1-12周]星期二[7-8节]/专业机房3（开元工科613，611，617）
            let weekText = substringBefore(timeText, "星期")
            let weekDayAndSectionText = substringAfter(timeText, "星期")
            let 周次 = substringBefore(substringAfter(weekText, "["), "周")
            let 星期 = week2Day(weekDayAndSectionText.substring(0, 1))
            let 节次 = substringBefore(substringAfter(weekDayAndSectionText, "["), "节")

            let weeks = multiWeekText2List(周次)
            let sections = multisectionText2List(节次)
            let courseInfo = {
                name: 名称,
                position: 地点,
                teacher: 任课教师,
                weeks: weeks,
                day: 星期,
                sections: sections
            }
            课程.push(courseInfo)
        }

    }
    let sectionTime = sectionTimeSummer
    let today = new Date();
    let month = today.getMonth();
    if (month >= 10 || month < 5) {
        sectionTime = sectionTimeWinter
    }
    let result = {
        courseInfos: 课程,
        sectionTimes: sectionTime
    }
    return JSON.stringify(result);
}


function scheduleHtmlParser(html) {
    let $raw = $('tr[style]').toArray()

    console.log($raw);

    let trList = Array.from($raw)

    for (let tr of trList) {
        console.info(
        "课程: " + tr.children[1].children[0].children[0].data + "\n" +
        "老师: " + tr.children[4].children[0].children[0].data + "\n" +
        "详情: " + tr.children[10].children[0].data
        );
        
    }

    return JSON.parse(html);
}
