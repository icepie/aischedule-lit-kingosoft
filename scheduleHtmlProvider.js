/*************************************************************************************
* Author : icepie
* last updated @ 2021/7/22 01:47
* Any question or assistances please contact: mailto:icepie.dev@gmail.com
* this project has been updated to Github:
** https://github.com/icepie/AIschedule-LIT-Kingosoft
***************************************************************************************/
//scheduleHtmlProvider.js:get html data from the website and pass them to parse


function GetUrlRelativePath()
{
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var stop = arrUrl[1].lastIndexOf("/");
    var relUrl = arrUrl[1].substring(start, stop)

    if(relUrl.indexOf("?") != -1){
      relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}


function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    
    var webpath = GetUrlRelativePath()

    let http = new XMLHttpRequest()
    http.open('GET', webpath + '/wsxk/stu_zxjg_rpt.aspx', false)
    http.send()

    // console.log(http.responseText)

    return http.responseText
}
