/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
/*
    怪物部分
        MonsterFlag         是否允许创建怪物 这里用来作开关
        MonsterSetDirection 创建的怪物出现位置有多少种情况 这里为4种
        MonsterArr          存放怪物的数组
        MonsterArea         怪物在一种出现位置情况下的区域大小
*/
const MonsterArr = new Array();
var MonsterFlag = 0;
var MonsterSetDirection = 0;
var MonsterArea = 100;
export function getMonsterArr() {
    return MonsterArr;
}
// 怪物攻击
/*
    参数: 
        monster 怪物
*/
export function monsterShoot(monster, callback) {
    if (monster.shootTimer == undefined) {
        monster.shootTimer = 250;
    }
    if (monster.shootTimer > 0) {
        monster.shootTimer--;
    } else {
        monster.shootTimer = 250;
        // 根据怪物移动方向进行攻击
        monster.shootFlag = 0;
        callback && callback();
    }
}

// 创建怪物
/*--------------------------------------------------------*/
/*
    参数:
        Monsternum: 一次出现怪物最多个数为(Monsternum+1)
*/
export function createMonster(Monsternum) {
    if (!MonsterFlag) {
        MonsterFlag = 1;
        setTimeout(function () {
            // 创建一批怪物放置在随机位置(距离边界200px)并添加进数组方便管理
            for (var i = 0; i < Math.round(Math.random() * Monsternum) + 1; i++) {
                MonsterSetDirection = Math.round(Math.random() * 3);
                var monster = document.createElement("div");
                var bgcSelect = Math.round(Math.random() * 3);
                if (bgcSelect == 0) {
                    monster.className = "monster1";
                } else if (bgcSelect == 1) {
                    monster.className = "monster2";
                } else if (bgcSelect == 2) {
                    monster.className = "monster3";
                } else if (bgcSelect == 3) {
                    monster.className = "monster4";
                }
                document.body.appendChild(monster);

                // 分为4区域产怪
                if (MonsterSetDirection == 0) {
                    monster.style.top = Math.round(Math.random() * 10) / 10 * MonsterArea + "px";
                    monster.style.left = Math.round(Math.random() * (document.body.offsetWidth - monster.offsetWidth - 2 * borderWidth)) + "px";
                } else if (MonsterSetDirection == 1) {
                    monster.style.left = Math.round(Math.random() * 10) / 10 * MonsterArea + (document.body.offsetWidth - MonsterArea - monster.offsetWidth - 2 * borderWidth) + "px";
                    monster.style.top = Math.round(Math.random() * (document.body.offsetHeight - monster.offsetHeight - 2 * borderWidth)) + "px";
                } else if (MonsterSetDirection == 2) {
                    monster.style.top = Math.round(Math.random() * 10) / 10 * MonsterArea + (document.body.offsetHeight - MonsterArea - monster.offsetWidth - 2 * borderWidth) + "px";
                    monster.style.left = Math.round(Math.random() * (document.body.offsetWidth - monster.offsetWidth - 2 * borderWidth)) + "px";
                } else if (MonsterSetDirection == 3) {
                    monster.style.left = Math.round(Math.random() * 10) / 10 * MonsterArea + "px";
                    monster.style.top = Math.round(Math.random() * (document.body.offsetHeight - monster.offsetHeight - 2 * borderWidth)) + "px";
                }
                MonsterArr[MonsterArr.length] = monster;
            }
            MonsterFlag = 0;
        }, 2000);
    }
}
/*--------------------------------------------------------*/

// 显示怪物
/*--------------------------------------------------------*/
/*
    参数:
        character: 角色(需要根据角色位置移动)
        speedMonster: 怪物移动速度
*/
export function monsterMove(character, speedMonster, callback) {
    for (var i = 0; i < MonsterArr.length; i++) {
        MonsterArr[i].shootDirectionX = 0;
        MonsterArr[i].shootDirectionY = 0;
        // 怪物移动
        // 向上移动
        if (MonsterArr[i].offsetTop - character.offsetHeight / 2 + MonsterArr[i].offsetHeight / 2 > character.offsetTop) {
            MonsterArr[i].style.top = MonsterArr[i].offsetTop - borderWidth - speedMonster + "px";
            MonsterArr[i].shootDirectionY = -1;
        }
        // 向下移动
        if (MonsterArr[i].offsetTop - character.offsetHeight / 2 + MonsterArr[i].offsetHeight / 2 < character.offsetTop) {
            MonsterArr[i].style.top = MonsterArr[i].offsetTop - borderWidth + speedMonster + "px";
            MonsterArr[i].shootDirectionY = 1;
        }
        // 向左移动
        if (MonsterArr[i].offsetLeft - character.offsetWidth / 2 + MonsterArr[i].offsetWidth / 2 > character.offsetLeft) {
            MonsterArr[i].style.left = MonsterArr[i].offsetLeft - borderWidth - speedMonster + "px";
            MonsterArr[i].shootDirectionX = -1;
        }
        // 向右移动
        if (MonsterArr[i].offsetLeft - character.offsetWidth / 2 + MonsterArr[i].offsetWidth / 2 < character.offsetLeft) {
            MonsterArr[i].style.left = MonsterArr[i].offsetLeft - borderWidth + speedMonster + "px";
            MonsterArr[i].shootDirectionX = 1;
        }

        if (MonsterArr[i].shootDirectionY == -1) {
            if (MonsterArr[i].shootDirectionX == -1) {
                MonsterArr[i].style.transform = 'rotate(180deg)';
            } else if (MonsterArr[i].shootDirectionX == 0) {
                MonsterArr[i].style.transform = 'rotate(-135deg)';
            }
            else if (MonsterArr[i].shootDirectionX == 1) {
                MonsterArr[i].style.transform = 'rotate(-90deg)';
            }
        } else if (MonsterArr[i].shootDirectionY == 0) {
            if (MonsterArr[i].shootDirectionX == -1) {
                MonsterArr[i].style.transform = 'rotate(135deg)';
            } else if (MonsterArr[i].shootDirectionX == 0) {
                MonsterArr[i].style.transform = 'rotate(0deg)';
            }
            else if (MonsterArr[i].shootDirectionX == 1) {
                MonsterArr[i].style.transform = 'rotate(-45deg)';
            }
        } else if (MonsterArr[i].shootDirectionY == 1) {
            if (MonsterArr[i].shootDirectionX == -1) {
                MonsterArr[i].style.transform = 'rotate(90deg)';
            } else if (MonsterArr[i].shootDirectionX == 0) {
                MonsterArr[i].style.transform = 'rotate(45deg)';
            }
            else if (MonsterArr[i].shootDirectionX == 1) {
                MonsterArr[i].style.transform = 'rotate(0deg)';
            }
        }
        // 怪物攻击
        callback && callback(MonsterArr[i]);
    }
}
/*--------------------------------------------------------*/