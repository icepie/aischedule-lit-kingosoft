import Cheerio = cheerio.Cheerio;
import Root = cheerio.Root;

declare const $: Root;

interface CourseInfo {
    name: string;
    position: string;
    teacher: string;
    weeks: number[];
    day: number;
    sections: number[];
}

interface ParserResult {
    courseInfos: CourseInfo[];
}

// buildDay 构建天
function buildDay(dayStr: string): number {

    // map
    const dayMap = new Map<string, number>([
        ["一", 1],
        ["二", 2],
        ["三", 3],
        ["四", 4],
        ["五", 5],
        ["六", 6],
        ["天", 7],
    ]);

    dayStr = dayStr
        .replace(" ", "")
        .replace("周", "")
        .replace("星期", "")
        .replace("日", "天");

    return dayMap.get(dayStr) || 7;
}

// buildSections 构建节数
function buildSections(sectionStr: string): number[] {
    const ret: number[] = [];
    const se = sectionStr
        .replace("节", "")
        .split("-");
    if (se.length === 2) {
        const s = parseInt(se[0]);
        const e = parseInt(se[1]);
        for (let i = s; i <= e; i++) {
            ret.push(i);
        }
    } else {
        const i = parseInt(se[0]);
        if (!isNaN(i)) {
            ret.push(i);
        }
    }
    return ret;
}


function buildWeeks(weekStr: string): number[] {

    const ret: number[] = [];

    let flag = 0;
    if (weekStr.includes("单")) {
        flag = 1;
    } else if (weekStr.includes("双")) {
        flag = 2;
    }

    weekStr = weekStr
        .replace("周", "")
        .replace("单", "")
        .replace("双", "")
        .replace(" ", "");

    const weekList = weekStr.split(",");

    for (const v of weekList) {
        const se = v.split("-");
        if (se.length === 2) {
            const s = parseInt(se[0]);
            const e = parseInt(se[1]);
            for (let i = s; i <= e; i++) {
                if (flag === 1) {
                    if (i % 2 !== 0) {
                        ret.push(i);
                    }
                } else if (flag === 2) {
                    if (i % 2 === 0) {
                        ret.push(i);
                    }
                } else {
                    ret.push(i);
                }
            }
        } else {
            const i = parseInt(se[0]);
            if (!isNaN(i)) {
                ret.push(i);
            }
        }
    }
    return ret;
}


function trimSuffix(toTrim: string, trim: string): string {
    if (!toTrim || !trim) {
        return toTrim;
    }
    const index = toTrim.lastIndexOf(trim);
    if (index === -1 || (index + trim.length) !== toTrim.length) {
        return toTrim;
    }
    return toTrim.substring(0, index);
}


// trimPrefix('abc', 'ab') -> 'c'
function trimPrefix(toTrim: string, trim: string): string {
    if (!toTrim || !trim) {
        return toTrim;
    }
    const index = toTrim.indexOf(trim);
    if (index !== 0) {
        return toTrim;
    }
    return toTrim.substring(trim.length);
}


/**
 * scheduleHtmlParser入口函数
 * @return {string}
 */
const scheduleHtmlParser = (html: string): ParserResult => {

    let result: ParserResult = {
        courseInfos: []
    }

    console.info("开始解析课表", html);

    // 获取课程表
    const tBody = $(html).find("table#pageRpt").find("table").eq(1).find("tbody");

    // 开始遍历
    tBody.find("tr").each((_, tr) => {

        const trBody = $(tr);
        // 排除表头
        if (trBody.attr("class")) {
            return;
        }

        // 课程名称
        const classNameFull: string[] = trBody.find("td").eq(1).text().split("]");

        // 判断长度
        if (classNameFull.length < 2) {
            return;
        }

        // 课程代码
        // const classCode = classNameFull[0].slice(1);

        // 课程名称
        const className = classNameFull[1];

        // 学分
        // const credit = trBody.find("td").eq(2).text();

        // 教师
        let teacher = "";

        // 教师(可能有多个, 以  &  分隔)
        trBody.find("td").eq(4).find("a").each((_, a) => {
            const t = $(a).text().split("[")[0];
            if (teacher == "") {
                teacher = t;
            } else {
                teacher += " & " + t;
            }
        });

        // 课程时间+地点

        for (const v of trBody.find("td").eq(10).get(0).children) {
            if (!v) continue;

            const timePlace = v.data as string;

            if (!timePlace) {
                continue;
            }

            const timePlaceList = timePlace.split("/");

            if (timePlaceList.length == 0) {
                continue;
            }

            let place = "";

            if (timePlaceList.length > 1) {
                place = timePlaceList[1].trim();
            }

            if (place === "") {
                if (className.startsWith("m")) {
                    place = "MOOC";
                }
                else if (className.includes("体育")) {
                    place = "GYM";
                }
            }

            const timeRawList = trimSuffix(trimPrefix(timePlaceList[0].trim(), "["), "]")
                .replace("[", " ")
                .replace("]", " ")
                .replace("  ", " ")
                .trim()
                .split(" ");

            // 使用格式一: [1-16周]星期一[5-6节]/XB309
            if (timePlaceList[0].startsWith("[")) {

                // 周次
                const weeks = buildWeeks(timeRawList[0]);

                // 星期
                const day = buildDay(timeRawList[1]);

                // 节次
                const sections = buildSections(timeRawList[2]);

                // 添加课程
                result.courseInfos.push({
                    name: className,
                    teacher: teacher,
                    position: place,
                    weeks: weeks,
                    day: day,
                    sections: sections,
                });
            }
            // 使用格式二: 1-16周 星期一 5-6节/ XB309
            else {


                console.log(timeRawList);

                // 星期
                const day = buildDay(timeRawList[0]);

                // 节次
                const sections = buildSections(timeRawList[1]);

                // 周次
                const weeks = buildWeeks(timeRawList.length === 4 ? timeRawList[2] + timeRawList[3] : timeRawList[2]);

                // 添加课程
                result.courseInfos.push({
                    name: className,
                    teacher: teacher,
                    position: place,
                    weeks: weeks,
                    day: day,
                    sections: sections,
                });
            }
        }

    })

    return result
}

