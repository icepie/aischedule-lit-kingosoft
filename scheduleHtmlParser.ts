import Cheerio = cheerio.Cheerio;
import Root = cheerio.Root;

declare const $: Root;

interface Section {
  section: number;
  startTime?: string;
  endTime?: string;
}

interface CourseInfo {
  name: string;
  position: string;
  teacher: string;
  weeks: number[];
  day: number;
  sections: Section[];
}

interface SectionTime {
  section: number;
  startTime: string;
  endTime: string;
}

interface ParserResult {
  courseInfos: CourseInfo[];
  sectionTimes: SectionTime[];
}

/**
 * week2Day 中文天数转换数字
 * @param {string}
 * @return {number}
 */
function dayCN2Day(day: string): number {
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