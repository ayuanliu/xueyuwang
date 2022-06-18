// 公共数据
/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小
*/
var borderWidth = 4;
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    角色部分
        shootFlag 是否运行射击 这里用来作开关
*/
var shootFlag = 0;
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    怪物部分
        MonsterFlag         是否允许创建怪物 这里用来作开关
        MonsterSetDirection 创建的怪物出现位置有多少种情况 这里为4种
        MonsterArr          存放怪物的数组
        MonsterArrnum       数组中怪物的数目
        MonsterArea         怪物在一种出现位置情况下的区域大小
*/
var MonsterFlag = 0;
var MonsterSetDirection = 0;
var MonsterArr = new Array();
var MonsterArrnum = 0;
var MonsterArea = 100;
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    子弹部分
        bulletArr           存放子弹的数组
        bulletArrnum        数组中子弹的数目
*/
var bulletArr = new Array();
bulletArr.num = 0;
var bulletMArr = new Array();
bulletMArr.num = 0;
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    雨滴部分
        
*/
var rainArr = new Array();
rainArr.num = 0;
var rainSelect = 0;
/*--------------------------------------------------------*/
// 显示子弹
/*--------------------------------------------------------*/
/*
    参数:
        speedBullet:        子弹移动速度
        callback:           为子弹爆裂效果
*/
function showBullet(speedBullet,bulletArr,callback) {
    // 遍历数组将数组中的所有子弹前进当bullet.boom等于0的时候爆炸
    for (var i = 0; i < bulletArr.length; i++) {
        if (bulletArr[i].DirectionY && bulletArr[i].DirectionX) {
            bulletArr[i].style.left = bulletArr[i].offsetLeft + speedBullet * bulletArr[i].DirectionX - borderWidth + "px";
            bulletArr[i].style.top = bulletArr[i].offsetTop + speedBullet * bulletArr[i].DirectionY - borderWidth + "px";
        } else if (bulletArr[i].DirectionX) {
            bulletArr[i].style.left = bulletArr[i].offsetLeft + speedBullet * bulletArr[i].DirectionX - borderWidth + "px";
        } else if (bulletArr[i].DirectionY) {
            bulletArr[i].style.top = bulletArr[i].offsetTop + speedBullet * bulletArr[i].DirectionY - borderWidth + "px";
        }
        callback && callback(bulletArr[i]);
        // 判断子弹是否抵达边界 第一颗子弹到达边界i为-1所以上面爆裂出问题
        if (bulletArr[i].offsetTop <= 0 || bulletArr[i].offsetTop >= document.body.offsetHeight || bulletArr[i].offsetLeft <= 0 || bulletArr[i].offsetLeft >= document.body.offsetWidth) {
            document.body.removeChild(bulletArr[i]);
            bulletArr.splice(i, 1);
            i--;
            bulletArr.num--;
        }

    }
}
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
// 定时器注册
var characterControlTimer = 0;
var MoveTimer = 0;
var effects = 0;
/*--------------------------------------------------------*/

// 分数
/*--------------------------------------------------------*/
var menuScore = 0;