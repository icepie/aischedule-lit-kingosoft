
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
        console.log('请先选择一个教务入口！登陆后再点击导入!')
        // return
    }

    // 判断是否在教务页面但未登陆
    if (await IsJwLoginPage()) {
        console.log('请先登陆教务网络管理系统！')
        // return
    }

    // 判断是否在门户页面
    if (await IsSecPage()) {
        if (await IsSecLoginPage()) {
            console.log('请先登陆教务网络管理系统！')
            // return
        }
        if (!await IsJwPage()) {
            // 跳转到教务
            await SecJumpToJw()
            console.log('请先登陆教务网络管理系统！')
            // return
        }
    }

    return GetScheduleData()
}