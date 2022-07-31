// 上传分数
export function sendScore(data){
    // 发送AJAX请求上传数据
    sendAJAX('POST','/plane',`id=&score=${data}`,function(){});
}
// 删除第5名之外的数据
function delFifthScore(){
    
}