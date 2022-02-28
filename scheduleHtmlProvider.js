/*************************************************************************************
* Author : icepie
* last updated @ 2022/02/25 19:30
* Any question or assistances please contact: mailto:icepie.dev@gmail.com
* this project has been updated to Github:
** https://github.com/icepie/AIschedule-LIT-Kingosoft
***************************************************************************************/
//scheduleHtmlProvider.js:get html data from the website and pass them to parse

// 因为会有跨域问题...所以暂时不用 loadTool

function AIScheduleTools() {

    /**
     * 获取插入组件的基础DOM
     */
    const getBaseDom = () => {
        if (document.body.tagName === 'FRAMESET') return document.getElementsByTagName('html')[0]
        return document.body
    }

    const baseDom = getBaseDom()

    /**
     * 添加Meta禁止缩放
     */
    const addMeta = () => {
        const head = document.getElementsByTagName('head')[0]
        if (head.childNodes.length === 1 || (window?.devicePixelRatio && window.devicePixelRatio !== 1)) {
            const meta = document.createElement('meta')
            meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
            meta.setAttribute("name", "viewport")
            head.appendChild(meta);
        }
    }
    /**
     * 获取最高层z-index
     * @returns {Number} 最高层z-index
     */
    const getMaxZIndex = () => {
        return [...baseDom.querySelectorAll('*')].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0) || 1
    }

    /**
     * 创建课程表div防止被网页内css干扰
     */
    const createDom = () => document.createElement('ai-schedule-div')

    /**
     * 创建选择器
     * @param {String[]} selectList 选择列表
     * @param {Function} onSelect 选择触发器
     * @returns 
     */
    const createSelect = (selectList, onSelect) => {
        const inputWarp = createDom()
        inputWarp.innerText = '请选择'
        inputWarp.style.cssText = `
        display: block;
        width: 100%;
        border: #0d84FF 1px solid;
        background: rgba(0, 0, 0, 0.06);
        box-sizing: border-box;
        position: relative;
      `
        if (baseDom.clientWidth >= 750) {
            inputWarp.style.cssText += `
          font-size: 30px;
          padding: 20px;
          margin: 15px 0 0 0;
          border-radius: 8px;
        `
        } else {
            inputWarp.style.cssText += `
          font-size: 4vw;
          padding: 2.66vw;
          margin: 2vw 0 0 0;
          border-radius: 1.06vw;
        `
        }

        const createSelectItem = text => {
            const selectItem = createDom()
            selectItem.innerText = text
            selectItem.style.cssText = `
          color: #606266;
          box-sizing: border-box;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        `
            if (baseDom.clientWidth >= 750) {
                selectItem.style.cssText += `
            font-size: 30px;
            padding: 0 20px;
            line-height: 40px;
            margin: 20px 0;
          `
            } else {
                selectItem.style.cssText += `
            font-size: 4vw;
            padding: 0 2.6vw;
            line-height: 5.33vw;
            margin: 2.6vw 0;
          `
            }
            selectItem.onclick = e => {
                e.stopPropagation()
                e.preventDefault()
                inputWarp.innerHTML = text
                onSelect()
            }
            return selectItem
        }

        const createSelectWarp = selectList => {
            const selectWarp = createDom()
            selectList.map(text => {
                selectWarp.appendChild(createSelectItem(text))
            })
            selectWarp.style.cssText = `
          position: absolute;
          left: 0;
          margin: 5px 0;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          background-color: #fff;
          box-sizing: border-box;
          z-index: 1;
          width: 100%;
          box-sizing: border-box;
        `
            return selectWarp
        }
        inputWarp.onclick = () => {
            const selectWarp = createSelectWarp(selectList)
            selectWarp.style.top = inputWarp.offsetHeight + 'px'
            inputWarp.appendChild(selectWarp)
        }
        return inputWarp
    }

    /**
     * 创建标题元素
     * @param {String} text 标题内容
     */
    const createTitle = (text = '提示') => {
        const title = createDom()
        title.innerText = text
        title.style.cssText = `
        display: block;
        color: #000;
      `
        if (baseDom.clientWidth >= 750) {
            title.style.cssText += 'font-size: 40px;'
        } else {
            title.style.cssText += 'font-size: 5.3vw;'
        }
        return title
    }

    /**
     * 创建输入框元素
     * @param {String} defaultText 默认内容
     */
    const createInput = (defaultText = '') => {
        const input = document.createElement('input')
        input.style.cssText = `
        outline: none;
        width: 100%;
        text-align: right;
        resize: none;
        border: #0d84FF 1px solid;
        background: rgba(0, 0, 0, 0.06);
        box-sizing: border-box;
      `
        if (baseDom.clientWidth >= 750) {
            input.style.cssText += `
          font-size: 30px;
          padding: 20px;
          margin: 15px 0 0 0;
          border-radius: 8px;
        `
        } else {
            input.style.cssText += `
          font-size: 4vw;
          padding: 2.66vw;
          margin: 2vw 0 0 0;
          border-radius: 1.06vw;
        `
        }
        input.value = defaultText
        return input
    }

    /**
     * 创建错误信息
     */
    const createErrorText = () => {
        const errorText = createDom()
        errorText.style.cssText = `
        display: block;
        text-align: left;
        margin: 1vw 0 5vw 0;
        color: red;
      `
        if (baseDom.clientWidth >= 750) {
            errorText.style.cssText += 'font-size: 20px;'
        } else {
            errorText.style.cssText += 'font-size: 2.6vw;'
        }
        return errorText
    }

    /**
     * 创建内容元素
     * @param {String} text 提示文字
     */
    const createContent = text => {
        const content = createDom()
        content.innerText = text
        content.style.cssText = `
        display: block;
        max-height: 64vw;
        color: #989898;
        margin: 2vw 0 5vw 0;
        user-select: auto;
        overflow: auto;
        text-align: left;
      `
        if (baseDom.clientWidth >= 750) {
            content.style.cssText += 'font-size: 30px;'
        } else {
            content.style.cssText += 'font-size: 4vw;'
        }
        return content
    }
    /**
     * 创建确认按钮元素
     * @param {String} text 确认文字
     */
    const createBtn = (text = '确认', type = 'primary') => {
        const btn = createDom()
        btn.innerText = text
        btn.style.cssText = `
        display:block;
        width: 45%;
        text-align: center;
        box-sizing: border-box;
      `
        if (type === 'primary') {
            btn.style.cssText += `
          background-color: #0d84FF;
          color: #fff;
          float: right;
        `
        } else if (type === 'info') {
            btn.style.cssText += `
          background-color: rgba(0, 0, 0, 0.06);
          color: rgba(0, 0, 0, 0.8);
          float: left;
        `
        }
        if (baseDom.clientWidth >= 750) {
            btn.style.cssText += 'font-size: 20px;'
            btn.style.cssText += 'padding: 20px 20px'
            btn.style.cssText += 'border-radius: 40px;'
        } else {
            btn.style.cssText += 'font-size: 2.6vw;'
            btn.style.cssText += 'padding: 2.6vw 2.6vw'
            btn.style.cssText += 'border-radius: 5vw;'
        }
        return btn
    }

    /**
     * 创建卡片元素
     * @param {Element} child 子元素
     */
    const createCard = (child, isSelect) => {
        const card = createDom()
        card.style.cssText = `
        display: block;
        width: 75%;
        max-width: 500px;
        height: fix-content;
        min-height: 20vw;
        max-height: 80vh;
        background-color: #fff;
        border-radius: 8px;
        box-sizing: border-box;
        position: relative;
      `
        if (!isSelect) {
            card.style.cssText += 'overflow: auto;'
            card.style.cssText += 'margin-top: -20vh;'
        } else {
            card.style.cssText += 'margin-top: -40vh;'
        }
        if (baseDom.clientWidth >= 750) {
            card.style.cssText += 'padding: 37.5px;'
        } else {
            card.style.cssText += 'padding: 5vw;'
        }
        child && child.map(e => e && card.appendChild(e))
        return card
    }
    /**
     * 创建蒙层
     * @param {Element} child 子元素
     */
    const createMask = child => {
        const mask = createDom()
        mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: ${getMaxZIndex() + 1};
      `
        child && mask.appendChild(child)
        return mask
    }
    const AIScheduleAlert = param => new Promise(resolve => {
        let textConfig = {
            contentText: 'AIScheduleAlert V1.2.0216',
            titleText: '提示',
            confirmText: '确认',
        }
        if (typeof param === 'string') {
            textConfig.contentText = param
        } else {
            textConfig = {
                ...textConfig,
                ...param
            }
        }
        addMeta()
        const title = createTitle(textConfig.titleText)
        const content = createContent(textConfig.contentText)
        const btn = createBtn(textConfig.confirmText)
        const card = createCard([title, content, btn])
        const mask = createMask(card)
        baseDom.appendChild(mask)
        btn.onclick = () => {
            baseDom.removeChild(mask)
            resolve()
        }
    })

    const AISchedulePrompt = ({
        titleText,
        tipText,
        defaultText = 'AISchedulePrompt V1.0.2',
        validator,
    }) => new Promise(resolve => {
        addMeta()
        const title = titleText && titleText?.length && titleText?.length <= 10 && createTitle(titleText)
        const content = tipText && createContent(tipText)
        const input = createInput(defaultText)
        const errorText = createErrorText()
        const btn = createBtn()
        const card = createCard([title, content, input, errorText, btn])
        const mask = createMask(card)
        baseDom.appendChild(mask)
        input.focus()
        const submit = () => {
            if (validator) {
                const res = validator(input.value)
                if (res) {
                    errorText.innerText = res
                    input.style.borderColor = 'red'
                    return
                } else {
                    errorText.innerText = ''
                    input.style.borderColor = '#0d84FF'
                }
            }
            baseDom.removeChild(mask)
            resolve(input.value)
        }
        btn.onclick = submit
        input.onkeydown = e => {
            if (e.key === 'Enter') {
                submit()
            }
        }
    })

    const AIScheduleConfirm = param => new Promise(resolve => {
        let textConfig = {
            titleText: '',
            contentText: 'AIScheduleConfirm V1.2.0206',
            cancelText: '取消',
            confirmText: '确认',
        }
        if (typeof param === 'string') {
            textConfig.contentText = param
        } else {
            textConfig = {
                ...textConfig,
                ...param,
            }
        }
        addMeta()
        const title = textConfig.titleText && textConfig.titleText?.length && textConfig.titleText?.length <= 10 && createTitle(textConfig.titleText)
        const content = textConfig.contentText && createContent(textConfig.contentText)
        const confirmBtn = createBtn(textConfig.confirmText, 'primary')
        const cancelBtn = createBtn(textConfig.cancelText, 'info')
        const card = createCard([title, content, cancelBtn, confirmBtn])
        const mask = createMask(card)
        baseDom.appendChild(mask)
        confirmBtn.onclick = () => {
            baseDom.removeChild(mask)
            resolve(true)
        }
        cancelBtn.onclick = () => {
            baseDom.removeChild(mask)
            resolve(false)
        }
    })

    const AIScheduleSelect = ({
        titleText,
        contentText = 'AIScheduleSelect V1.0.0',
        selectList = [
            '选项一',
            '选项二',
            '选项三',
        ],
    } = {}) => new Promise(resolve => {
        addMeta()
        const title = titleText && titleText?.length && titleText?.length <= 10 && createTitle(titleText)
        const content = contentText && createContent(contentText)
        const errorText = createErrorText()
        const select = createSelect(selectList, () => errorText.innerText = '')
        const btn = createBtn()
        const card = createCard([title, content, select, errorText, btn], true)
        const mask = createMask(card)
        baseDom.appendChild(mask)
        btn.onclick = () => {
            if (select.innerText === '请选择') {
                errorText.innerText = '请先选择选项'
                return
            }
            baseDom.removeChild(mask)
            resolve(select.innerText)
        }
    })

    window.AIScheduleComponents = {
        addMeta,
        getMaxZIndex,
        createDom,
        createSelect,
        createTitle,
        createInput,
        createErrorText,
        createContent,
        createBtn,
        createCard,
        createMask,
    }

    window.AIScheduleAlert = AIScheduleAlert
    window.AISchedulePrompt = AISchedulePrompt
    window.AIScheduleConfirm = AIScheduleConfirm
    window.AIScheduleSelect = AIScheduleSelect
    return { AIScheduleAlert, AISchedulePrompt, AIScheduleConfirm, AIScheduleSelect }
}

window.AIScheduleTools = AIScheduleTools

AIScheduleTools()

async function GetUrlRelativePath() {
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var stop = arrUrl[1].lastIndexOf("/");
    var relUrl = arrUrl[1].substring(start, stop)

    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

async function GetUrlHost() {
    return document.location.host;
}

async function IsJwLoginPage() {
    return document.getElementById("m14")
}

async function IsJwPage() {
    return window.location.pathname.includes('.aspx')
}

async function IsIndexPage() {
    return document.location.pathname == "/jwc/jwwlglxt.htm"
}


async function IsSecPage() {
    return document.location.hostname == "sec.lit.edu.cn"
}

async function IsSecLoginPage() {
    if (await IsSecPage()) {
        return document.location.pathname.includes("/authserver/login")
    }
    return false
}

async function GetScheduleData() {
    const webpath = await GetUrlRelativePath()
    let http = new XMLHttpRequest()
    http.open('GET', webpath + '/wsxk/stu_zxjg_rpt.aspx', false)
    http.send()
    return http.responseText
}

async function SecJumpToJw() {
    window.location.href = window.location.origin + "/webvpn/LjIwNi4xNzAuMjE4LjE2Mg==/LjIwOC4xNzMuMTQ4LjE1OC4xNTguMTcwLjk0LjE1Mi4xNTAuMjE2LjEwMi4xOTcuMjA5/cas_njjz.aspx?vpn-0"
}

async function scheduleHtmlProvider() {

    // await loadTool('AIScheduleTools')

    // 判断是否还在主页面
    if (await IsIndexPage()) {
        await AIScheduleAlert('请先选择一个教务入口！登陆后再点击导入!')
        return
    }

    // 判断是否在教务页面但未登陆
    if (await IsJwLoginPage()) {
        await AIScheduleAlert('请先登陆教务网络管理系统！')
        return
    }

    // 判断是否在门户页面
    if (await IsSecPage()) {
        if (await IsSecLoginPage()) {
            await AIScheduleAlert('请先登陆智慧门户!！')
            return
        }
        if (!await IsJwPage()) {
            // 跳转到教务
            await SecJumpToJw()
            await AIScheduleAlert('请先进入教务系统后导入!')
            return
        }
    }

    return await GetScheduleData()
}
