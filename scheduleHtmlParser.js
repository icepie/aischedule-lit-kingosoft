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

function scheduleHtmlParser(html) {

    // 课程列表
    let courseInfoList = []

    // 找到课表所在位置
    let $raw = $('tr[style]').toArray()
    let trList = Array.from($raw)

    // 遍历处理
    for (let tr of trList) {

        // 课程名称
        courseName = tr.children[1].children[0].children[0].data

        // 课程教师
        courseTeacher = tr.children[4].children[0].children[0].data
        
        // 创建一个存放元数据
        courseInfoRawArray = []

       // 判断课程详情是否存在 
       if (tr.children[10].children.length > 0)
       {          
           // 加入课程第一个补充信息
           courseInfoRawArray.push(tr.children[10].children[0].data)
           
           // 这是以 br 分割的时间节点, 所以这里以JQuery的方式进行遍历
           split = tr.children[10].children[1]
           for (var i=0;split.children.length > i ;split = split.children[1])
           {
               // 加入剩余的补充信息
               courseInfoRawArray.push(split.children[0].data)
           }
       }

        // 遍历处理优雅一点害
        for (let courseInfoRaw of courseInfoRawArray)
        {       
            let splited = courseInfoRaw.split("/")
            
            // 处理上课地点
            let coursePosition = "";
            if (splited.length > 1) {
                coursePosition = splited[1];
            }
            if (coursePosition == "在线课程上课时间见通知") {
                coursePosition = "在线"
            }
            
            // 处理上课时间
            let timeText = splited[0]
            let weekText = substringBefore(timeText, "星期")
            let weekDayAndSectionText = substringAfter(timeText, "星期")
            let week = substringBefore(substringAfter(weekText, "["), "周").replace("双","").replace("单","")

            // 星期
            let courseDay = week2Day(weekDayAndSectionText.substring(0, 1))
            let section = substringBefore(substringAfter(weekDayAndSectionText, "["), "节")
            // 周
            let courseWeeks = multiWeekText2List(week)
            // 节
            let courseSections = multisectionText2List(section)
            
            let courseInfo = {
                name: courseName ,
                position: coursePosition,
                teacher: courseTeacher,
                weeks: courseWeeks,
                day: courseDay,
                sections: courseSections
            }

            courseInfoList.push(courseInfo)
        }
        
    }
    
    // 判断月份 使用对应作息时间
    let sectionTime = sectionTimeSummer
    let today = new Date();
    let month = today.getMonth();
    if (month >= 10 || month < 5) {
        sectionTime = sectionTimeWinter
    }
    
    let result = {
        courseInfos: courseInfoList,
        sectionTimes: sectionTime
    }

    console.info(result)
  
    return result;
}
