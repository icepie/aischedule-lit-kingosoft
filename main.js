const watch = require('node-watch')
const ws = require('nodejs-websocket')
const ini = require('ini')
const path = require("path")
const fs = require('fs')
const { VM } = require('vm2')
const { execSync } = require('child_process');

/**
 * 获取配置信息
 */
const getConfig = () => {
  try {
    const configString = fs.readFileSync('./config.ini').toString()
    const config = ini.parse(configString)
    return config
  } catch (_) {
    console.log('配置文件不存在')
    process.exit(1)
  }
}



/**
 * 获取三文件对应文件名
 * @param {Object} config 配置信息
 */
const getFileNameMap = config => (new Map([
  ['provider', config.fileAddress.provider],
  ['parser', config.fileAddress.parser],
  ['timer', config.fileAddress.timer],
]))


/**
 * 获取三文件对应文件名
 * @param {Object} config 配置信息
 */
const getWatchNameMap = config => (new Map([
  [path.basename(config.watchAddress.provider, '.ts'), 'provider'],
  [path.basename(config.watchAddress.parser, '.ts'), 'parser'],
  [path.basename(config.watchAddress.timer, '.ts'), 'timer'],
]))

// 获取必要的cheerio
const cheerioStr = fs.readFileSync(`./cheerio.js`, 'utf-8')
// 读取配置文件
const config = getConfig()

// 创建用户文件与文件类型映射
const fileNameMap = getFileNameMap(config)
// 监听文件
const watchNameMap = getWatchNameMap(config)

/**
 * 返回消息到panel
 * @param {Object} cmd 指令
 * @param {Object} content 要发送的信息内容
 */
const sendResponse = (conn, cmd, content) => {
  try {
    const msg = {
      from: 'IDE',
      to: cmd === 'runParser' ? 'content' : 'panel',
      cmd,
      content,
    }
    if (!conn.readyState) return

    conn.sendText(JSON.stringify(msg))
    console.log('send successfuly')
  } catch (_) { }
}

/**
 * 监听文件回调函数
 * @param {Object} conn 链接对象
 * @param {String} fileName 更新的文件地址
 */
const watchFile = (conn, fileName) => {
  console.log(fileName, ": 已经更新")

  console.log("tsc...")

  // 运行 npm tsc

  try {
    const tscRte = execSync("tsc").toString()
    console.log(tscRte)
  } catch (e) {
    console.log(e.stdout.toString())
    return
  }

  const file = watchNameMap.get(path.basename(fileName, '.ts'))

  // 防止犯病读到别的文件
  if (!file) return false
  try {
    const data = fs.readFileSync(fileNameMap.get(file), 'utf8')
    const msg = {
      ok: true,
      message: '',
      data,
      file,
    }
    sendResponse(conn, 'watchFile', msg)
  } catch (error) {
    console.error(error)
    return
  }
}

/**
 * 运行Parser
 * @param {Object} conn 连接对象
 * @param {String} providerRes provider的返回值
 * @param {String} parserCode parser的代码
 * @returns 
 */
const runParser = (conn, providerRes, parserCode) => {
  console.time('runParser')
  // 如果不满足条件返回结果
  if (!providerRes || !parserCode) {
    const msg = {
      ok: false,
      message: '无可执行内容',
      data: null,
    }
    return sendResponse(conn, 'runParser', msg)
  }
  // 查询违法字符串
  if (providerRes.indexOf('child_process') > 0
    || providerRes.indexOf('__proto__') > 0
    || providerRes.indexOf('constructor') > 0
    || providerRes.indexOf('require(') > 0
    || providerRes.indexOf('execSync') > 0
    || providerRes.indexOf('spawn') > 0
    || providerRes.indexOf('spawnSync') > 0
    || providerRes.indexOf('execFile') > 0
    || providerRes.indexOf('execFileSync') > 0
    || providerRes.indexOf('fork') > 0
  ) {
    const msg = {
      ok: false,
      message: 'providerRes 含有非法内容',
      data: null,
    }
    return sendResponse(conn, 'runParser', msg)
  }
  // 查询违法字符串
  if (parserCode.indexOf('child_process') > 0
    || parserCode.indexOf('__proto__') > 0
    || parserCode.indexOf('constructor') > 0
    || parserCode.indexOf('require(') > 0
    || parserCode.indexOf('execSync') > 0
    || parserCode.indexOf('spawn') > 0
    || parserCode.indexOf('spawnSync') > 0
    || parserCode.indexOf('execFile') > 0
    || parserCode.indexOf('execFileSync') > 0
    || parserCode.indexOf('fork') > 0
  ) {
    const msg = {
      ok: false,
      message: 'parserCode 含有非法内容',
      data: null,
    }
    return sendResponse(conn, 'runParser', msg)
  }
  // 正式运行
  try {
    const vm = new VM({
      timeout: 3000,
      sandbox: {
        console
      },
    })
    let exec = cheerioStr.replace(`"<body>aaa<body>"`, `String.raw\`${providerRes}\``)
    exec = exec.replace(`console.log(r.text())`, `
      let $=r;
      let cheerio=n(145)
      ${parserCode};
      let parserRes = scheduleHtmlParser(String.raw\`${providerRes}\`);
      if (typeof parserRes !== 'string'){
        parserRes = JSON.stringify(parserRes)
      };
      throw Error(parserRes);
    `)
    vm.run(exec)
  } catch (err) {
    console.log(err.message)
    const msg = {
      ok: true,
      message: '',
      data: err.message,
    }
    console.timeEnd('runParser')
    return sendResponse(conn, 'runParser', msg)
  }
}

/**
 * 开始观察文件并发送
 * @param {Object} conn 链接对象
 */
const manageStartWatchFile = conn => {
  // 监听代码所在文件夹
  watch([config.watchAddress.provider, config.watchAddress.parser, config.watchAddress.timer],
    { recursive: true, delay: 300 },
    (_, fileName) => {
      watchFile(conn, fileName)
    })
}

/**
 * 处理来自Panel的消息
 * @param {Object} conn ws链接对象
 * @param {*} msg 消息内容
 */
const manageMsgFromPanel = (conn, msg) => {
  msg = JSON.parse(msg)
  console.log('接收到消息', msg)
  // 过滤消息
  if (msg.to !== 'IDE') return false
  // 运行parser
  if (msg.cmd === 'runParser') {
    return runParser(conn, msg.content.providerRes, msg.content.parser)
  }
  // 监听文件
  if (msg.cmd === 'watchFile') {
    return manageStartWatchFile(conn)
  }
  // 其他情况
  return false
}


// 创建Ws服务
ws.createServer(connection => {
  connection.on('text', result => {
    manageMsgFromPanel(connection, result)
  })
  connection.on('connect', code => {
    console.log('开启连接', code)
  })
  connection.on('close', function (code) {
    console.log('关闭连接', code)
  })
  connection.on('error', function (code) {
    console.log('异常关闭', code)
  })
}).listen(2333, '127.0.0.1')

console.log('server is running on 127.0.0.1:2333')