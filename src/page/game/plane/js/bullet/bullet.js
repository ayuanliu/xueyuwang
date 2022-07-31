/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
let borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
/*
    子弹部分
        bulletArr           存放子弹的数组
        bulletArrnum        数组中子弹的数目
*/
const bulletCArr = new Array();
const bulletMArr = new Array();
// 获取角色子弹数组
export function getCBulletArr() {
    return bulletCArr
}
// 获取怪物子弹数组
export function getMBulletArr() {
    return bulletMArr;
}
// 清空角色子弹
export function clearCBullet() {
    for (let i = 0; i < bulletCArr.length; i++) {
        document.body.removeChild(bulletCArr[i]);
    }
    bulletCArr.length = 0;
}
// 清空怪物子弹
export function clearMBullet() {
    for (let i = 0; i < bulletMArr.length; i++) {
        document.body.removeChild(bulletMArr[i]);
    }
    bulletMArr.length = 0;
}
// 添加子弹
/*
    参数:
        obj:            角色
        bulletArr:      添加到的数组
*/
function addbullet(obj, bulletArr) {
    // 判断是否能添加子弹
    if (!obj.shootFlag) {
        obj.shootFlag = 1;
        // 开启定时器
        var timer = setInterval(function () {
            // 创建一个子弹并添加进数组方便管理
            var bullet = document.createElement("div");
            bullet.className = "bullet";
            document.body.appendChild(bullet);
            // 根据角色当前位置以及方向创建子弹 给每个子弹加定时器用于爆炸
            if (obj.shootDirectionY == -1 && obj.shootDirectionX == -1) {
                bullet.DirectionY = -1;
                bullet.DirectionX = -1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionY == -1 && obj.shootDirectionX == 1) {
                bullet.DirectionY = -1;
                bullet.DirectionX = 1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 + obj.offsetWidth / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
            } else if (obj.shootDirectionY == 1 && obj.shootDirectionX == -1) {
                bullet.DirectionY = 1;
                bullet.DirectionX = -1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 + obj.offsetHeight / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionY == 1 && obj.shootDirectionX == 1) {
                bullet.DirectionY = 1;
                bullet.DirectionX = 1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 + obj.offsetHeight / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 + obj.offsetWidth / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
            } else if (obj.shootDirectionX == 1) {
                bullet.DirectionX = 1;
                bullet.DirectionY = 0;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 - bullet.offsetHeight / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionX == -1) {
                bullet.DirectionX = -1;
                bullet.DirectionY = 0;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 - bullet.offsetHeight / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft - bullet.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionY == 1) {
                bullet.DirectionY = 1;
                bullet.DirectionX = 0;
                bullet.style.top = obj.offsetTop + obj.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 - bullet.offsetWidth / 2 - borderWidth + "px";
            } else if (obj.shootDirectionY == -1) {
                bullet.DirectionY = -1;
                bullet.DirectionX = 0;
                bullet.style.top = obj.offsetTop - bullet.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 - bullet.offsetWidth / 2 - borderWidth + "px";
            }
            bulletArr[bulletArr.length] = bullet;
            obj.shootFlag = 0;
            clearInterval(timer);
        }, 100);
    }
}
export function addCBullet(obj) {
    addbullet(obj, bulletCArr);
}
export function addMBullet(obj) {
    addbullet(obj, bulletMArr);
}
// 子弹爆裂
/* 
    参数:
        currentBullet 要爆裂的当前子弹
        directionY1 爆裂后的第一个子弹的Y轴运动方向
        directionX1 爆裂后的第一个子弹的X轴运动方向
        directionY2 爆裂后的第二个子弹的Y轴运动方向
        directionX2 爆裂后的第二个子弹的X轴运动方向
*/
function bulletBoom(currentBullet, directionY1, directionX1, directionY2, directionX2) {
    // 爆裂后的
    var bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.boom = -1;
    bullet.DirectionY = directionY1;
    bullet.DirectionX = directionX1;
    document.body.appendChild(bullet);
    bullet.style.top = currentBullet.offsetTop + "px";
    bullet.style.left = currentBullet.offsetLeft + "px";
    bulletCArr.push(bullet);

    bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.boom = -1;
    bullet.DirectionY = directionY2;
    bullet.DirectionX = directionX2;
    document.body.appendChild(bullet);
    bullet.style.top = currentBullet.offsetTop + "px";
    bullet.style.left = currentBullet.offsetLeft + "px";
    bulletCArr.push(bullet);
}
/*--------------------------------------------------------*/
// 子弹爆炸而且只爆炸1次
/*
    参数:
        bullet      子弹
        distance    多远爆炸
*/
/*--------------------------------------------------------*/
export function bulletIsBoom(bullet, distance) {
    if (bullet.boom == undefined) {
        bullet.boom = distance;
    }
    if (bullet.boom > 0) {
        bullet.boom--;
    }
    if (!bullet.boom) {
        bullet.boom = -1;
        // 爆裂 添加两个子弹 这里如果放在 判断子弹是否抵达边界下边则会出问题因为i--了指向的是上一个 for循环先执行完在i++
        if (bullet.DirectionY == -1) {
            if (bullet.DirectionX == -1) {
                bulletBoom(bullet, -1, 0, 0, -1);
            } else if (bullet.DirectionX == 0) {
                bulletBoom(bullet, -1, -1, -1, 1);
            } else if (bullet.DirectionX == 1) {
                bulletBoom(bullet, -1, 0, 0, 1);
            }
        } else if (bullet.DirectionY == 0) {
            if (bullet.DirectionX == -1) {
                bulletBoom(bullet, -1, -1, 1, -1);
            } else if (bullet.DirectionX == 0) {

            } else if (bullet.DirectionX == 1) {
                bulletBoom(bullet, 1, 1, -1, 1);
            }
        } else if (bullet.DirectionY == 1) {
            if (bullet.DirectionX == -1) {
                bulletBoom(bullet, 0, -1, 1, 0);
            } else if (bullet.DirectionX == 0) {
                bulletBoom(bullet, 1, -1, 1, 1);
            } else if (bullet.DirectionX == 1) {
                bulletBoom(bullet, 1, 0, 0, 1);
            }
        }
    }
}


// 显示子弹
/*--------------------------------------------------------*/
/*
    参数:
        speed:              子弹移动速度
        callback:           为子弹爆裂效果
*/
function showBullet(speed, bulletArr, callback) {
    // 遍历数组将数组中的所有子弹前进当bullet.boom等于0的时候爆炸
    for (var i = 0; i < bulletArr.length; i++) {
        if (bulletArr[i].DirectionY && bulletArr[i].DirectionX) {
            bulletArr[i].style.left = bulletArr[i].offsetLeft + speed * bulletArr[i].DirectionX - borderWidth + "px";
            bulletArr[i].style.top = bulletArr[i].offsetTop + speed * bulletArr[i].DirectionY - borderWidth + "px";
        } else if (bulletArr[i].DirectionX) {
            bulletArr[i].style.left = bulletArr[i].offsetLeft + speed * bulletArr[i].DirectionX - borderWidth + "px";
        } else if (bulletArr[i].DirectionY) {
            bulletArr[i].style.top = bulletArr[i].offsetTop + speed * bulletArr[i].DirectionY - borderWidth + "px";
        }
        callback && callback(bulletArr[i]);
        // 判断子弹是否抵达边界 第一颗子弹到达边界i为-1所以上面爆裂出问题
        if (bulletArr[i].offsetTop <= 0 || bulletArr[i].offsetTop >= document.body.offsetHeight || bulletArr[i].offsetLeft <= 0 || bulletArr[i].offsetLeft >= document.body.offsetWidth) {
            document.body.removeChild(bulletArr[i]);
            bulletArr.splice(i, 1);
            i--;
        }

    }
}
/*--------------------------------------------------------*/
export function cBulletMove(speed, callback) {
    showBullet(speed, bulletCArr, callback)
}
export function mBulletMove(speed, callback) {
    showBullet(speed, bulletMArr, callback)
}