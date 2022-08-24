
//  模态框
function ShowModal(theTitle: string, theContent: string) {
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
    const getMaxZIndex = (): number => {
        const all = document.getElementsByTagName('*')
        let max = 0
        for (let i = 0; i < all.length; i++) {
            const zindex = Number(window.getComputedStyle(all[i]).getPropertyValue('z-index'))
            if (zindex > max) {
                max = zindex
            }
        }
        return max
    }

    /**
     * 创建课程表div防止被网页内css干扰
     */
    const createDom = () => document.createElement('ai-schedule-div')


    /**
 * 创建标题元素
 * @param {String} text 标题内容
 */
    const createTitle = (text: string = '提示') => {
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
      * 创建内容元素
      * @param {String} text 提示文字
      */
    const createContent = (text: string) => {
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
     * 创建卡片元素
     * @param {Element} child 子元素
     */
    const createCard = (child: any[], isSelect: any) => {
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
    const createMask = (child: any) => {
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

    addMeta()

    baseDom.appendChild(createMask(createCard([createTitle(theTitle), createContent(theContent)], false)))
}


const AIScheduleAlert = (param: string) => new Promise(_resolve => {

    ShowModal("提示", param)

})


async function GetUrlRelativePath() {
    const url = document.location.toString();
    const arrUrl = url.split("//");

    const start = arrUrl[1].indexOf("/");
    const stop = arrUrl[1].lastIndexOf("/");
    let relUrl = arrUrl[1].substring(start, stop)

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

async function SecJumpToJw() {
    window.location.href = window.location.origin + "/webvpn/LjIwNi4xNzAuMjE4LjE2Mg==/LjIwOC4xNzMuMTQ4LjE1OC4xNTguMTcwLjk0LjE1Mi4xNTAuMjE2LjEwMi4xOTcuMjA5/cas_njjz.aspx?vpn-0"
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


/**
 * scheduleHtmlProvider入口函数
 * @return {string}
 */
const scheduleHtmlProvider = async (): Promise<string> => {

    // 判断是否还在主页面
    if (await IsIndexPage()) {

        setTimeout(() => {
            window.location.reload()
        }, 2000)

        await AIScheduleAlert("请先选择一个教务入口！登陆后再点击导入!")
        return ""
    }

    // 判断是否在教务页面但未登陆
    if (await IsJwLoginPage()) {
        setTimeout(() => {
            window.location.reload()
        }, 2000)
        await AIScheduleAlert("请先登陆教务网络管理系统！")

        return ""
    }

    // 判断是否在门户页面
    if (await IsSecPage()) {
        if (await IsSecLoginPage()) {
            setTimeout(() => {
                window.location.reload()
            }, 2000)
            await AIScheduleAlert("请先登陆教务网络管理系统！")

            return ""
        }
        if (!await IsJwPage()) {
            // 跳转到教务
            setTimeout(async () => {
                await SecJumpToJw()
            }, 2000)

            await AIScheduleAlert("请先登陆教务网络管理系统！")
            return ""
        }
    }

    const data = await GetScheduleData()

    if (!data.includes("正选结果")) {
        setTimeout(() => {
            window.location.reload()
        }, 2000)
        await AIScheduleAlert("认证似乎出了点问题，请重新登陆！")
        return ""
    }

    return data
}