# AIschedule-LIT-Kingosoft

尝试给洛阳理工学院的青果教务系统适配一下小爱课程表

[![](https://img.shields.io/badge/dynamic/json?color=blue&label=%E5%BC%80%E5%8F%91%E8%80%85&query=%24.coderName&url=https%3A%2F%2Fopen-schedule.ai.xiaomi.com%2Fapi%2Fcoder%3Ftb_id%3D36075%26amp?style=plastic)](https://blog.icepie.net/)
![](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=%E4%BD%BF%E7%94%A8%E4%BA%BA%E6%95%B0&query=%24.usedNum&url=https%3A%2F%2Fopen-schedule.ai.xiaomi.com%2Fapi%2Fcoder%3Ftb_id%3D36075%26amp?style=plastic)
[![QQ Group](https://img.shields.io/badge/QQ%20群-647027400-red.svg)](https://jq.qq.com/?_wv=1027&k=lz0XyN86)
[![TG Group](https://img.shields.io/badge/TG%20群-lit_edu-blue.svg)](https://t.me/lit_edu)

## 进度

- [X] 开发者工具
- [X] E2E自测 
  - [X] MIUI系统专版
  - [X] IOS版本
  - [X] Android普通版

## 使用

> 已正式上线小爱课程表开放使用啦~
> 
> 因为数据源于 `正选结果` 所以仅仅在开学前几周的选课时间可以导入哦

- 设置中学校选择洛阳理工学院-青果教务系统
- 再点击从教务导入课程表
- 成功登录教务在线后直接点击导入即可 (无需点击到课表页面)

## 更新日志

- 38785
  - 时间格式自识别

- 38596
  - 去掉新格式解析中地点前多余的空格
  - 优化一处变量定义小错误

- 38307
  - 适配青果教务最新格式解析 [d57009c](https://github.com/icepie/AIschedule-LIT-Kingosoft/commit/d57009c1eaf1cb95fcb32b493bb265603fd11002)
  - 优化解析处理方式

- 36075
  - 去除教师职称
  - 真的修复了时间错误 (上次忘记改了)

- 35853
  - 去除课程名称的课程编号
  - 修复课表中的慕课无法解析
  - 慕课课程上课地点将解析为 "在线"
  - 修复错误的节数和上课时间

- 35589
  - 首次实现课表正常解析
  - 上课时间支持自动识别冬夏季

## 最后

应该是咱学校的教务系统第一次上小爱课程表吧, 就当个人学习之余造福一下大家 ~

有问题可以在我的主页找到联系方式的熬

![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/9ead5234-f104-40bc-9c89-827339a013c9.jpg)

