export function getLeaderboard(callback){
    sendAJAX('GET','/plane',undefined,function(result){
        const arr = result;
        // 将获取到的数据降序
        arr.sort(function(a,b){
            return  b.score - a.score;
        })
        callback&&callback(arr);
    })
}