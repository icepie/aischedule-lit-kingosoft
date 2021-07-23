

/**
 * GetUrlRelativePath 获取相对位置函数
 * @return {string}
 */
function GetUrlRelativePath(): string
{
    var url: string = document.location.toString();
    var arrUrl: string[] = url.split("//");

    var start: number = arrUrl[1].indexOf("/");
    var stop: number = arrUrl[1].lastIndexOf("/");
    var relUrl: string = arrUrl[1].substring(start, stop)

    if(relUrl.indexOf("?") != -1){
      relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

/**
 * scheduleHtmlProvider入口函数
 * @return {string}
 */
function scheduleHtmlProvider():string {
    var webpath = GetUrlRelativePath()
    let http = new XMLHttpRequest()
    http.open('GET', webpath + '/wsxk/stu_zxjg_rpt.aspx', false)
    http.send()
    // console.log(http.responseText)

    return http.responseText
}