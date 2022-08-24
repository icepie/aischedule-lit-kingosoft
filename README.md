# AIschedule-LIT-Kingosoft

尝试给洛阳理工学院的青果教务系统适配一下小爱课程表

[![TG Group](https://img.shields.io/badge/TG%20群-lit_edu-blue.svg)](https://t.me/lit_edu)

## 进度

- [X] 开发者工具
- [X] E2E自测 
  - [X] MIUI 系统专版
  - [X] IOS 版本
  - [X] Android 普通版
- [X] 爱课程表开发者工具本地测试
- [X] TypeScript 重构

## 使用

> 已正式上线小爱课程表开放使用啦~

- 设置中学校选择 `洛阳理工学院-青果教务管理系统`
- 再点击从教务导入课程表
- 成功登录教务在线后直接点击导入即可 (无需点击到课表页面)



## 开发

### 环境

- Node.js + Chrome + 小爱课程表开发插件

### 安装依赖

```bash
$ npm i
# or yarn
```

### 运行
```bash
$ npm run start
# or yarn start
```

即可和 `小爱课程表开发插件` 交互

此时直接编辑 `src` 里的 `ts` 源码即可

(简单魔改了一下, 会自动运行 `tsc` 编译同步)

### 构建
```bash
$ npm run build
# or yarn build
```

构建完成在 `dist` 目录下

## 更新日志

- 4361
  - 修复之前版本无法导入的问题 (现在兼容性更强了)
  - 使用 TypeScript 重构
  - 更智能的错误提示
  - 更优雅的导入流程

- 40477
  - 更新教务地址

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




