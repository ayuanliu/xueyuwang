// 怪物与子弹
/*
    碰撞检测
        arr1            被检测的对象        (例如怪物)
        arr2            碰撞的物体          (例如子弹)
        callback        回调参数会传入结果
*/
export function collide1(arr1, arr2, callback) {
    let result = [[], []];
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i].offsetTop < arr2[j].offsetTop &&
                arr1[i].offsetTop + arr1[i].offsetHeight > arr2[j].offsetTop &&
                arr1[i].offsetLeft < arr2[j].offsetLeft &&
                arr1[i].offsetLeft + arr1[i].offsetWidth > arr2[j].offsetLeft) {
                // 碰撞
                result[0].push(i);
                result[1].push(j);
                break;
            }
        }
    }
    callback && callback(result);
}
// 角色与子弹
export function collide2(obj, arr, callback) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (obj.offsetTop < arr[i].offsetTop &&
            obj.offsetTop + obj.offsetHeight > arr[i].offsetTop &&
            obj.offsetLeft < arr[i].offsetLeft &&
            obj.offsetLeft + obj.offsetWidth > arr[i].offsetLeft) {
            // 碰撞
            result.push(i);
            callback && callback(result);
            return true;
        }
    }
    return false;
}
// AABB碰撞
// 角色与怪物
export function collide3(obj, arr, callback) {
    // 碰撞检测
    for (var i = 0; i < arr.length; i++) {
        let top1 = obj.offsetTop;
        let left1 = obj.offsetLeft;
        let right1 = left1 + obj.offsetWidth;
        let bottom1 = top1 + obj.offsetHeight;

        let top2 = arr[i].offsetTop;
        let left2 = arr[i].offsetLeft;
        let right2 = left2 + arr[i].offsetWidth;
        let bottom2 = top2 + arr[i].offsetHeight;

        let width = obj.offsetWidth + arr[i].offsetWidth;
        let height = obj.offsetHeight + arr[i].offsetHeight
        // 用来交换将大值给2小值给1
        let temp = 0;
        if (top1 > top2) {
            temp = top1;
            top1 = top2;
            top2 = temp;
        } if (left1 > left2) {
            temp = left1;
            left1 = left2;
            left2 = temp;
        } if (right1 > right2) {
            temp = right1;
            right1 = right2;
            right2 = temp;
        } if (bottom1 > bottom2) {
            temp = bottom1;
            bottom1 = bottom2;
            bottom2 = temp;
        }
        // 判断在怪物碰撞到角色
        if (right2 - left1 < width && bottom2 - top1 < height) {
            callback&&callback();
            return true;
        }
    }
    return false;
}