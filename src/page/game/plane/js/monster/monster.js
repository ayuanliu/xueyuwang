/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
// 网格大小
const size = 50;
// 数组宽
const mapWidth = 23;
// 数组高
const mapHeight = 12;
/*
    怪物部分
        MonsterFlag         是否允许创建怪物 这里用来作开关
        MonsterSetDirection 创建的怪物出现位置有多少种情况 这里为4种
        MonsterArr          存放怪物的数组
*/
const MonsterArr = new Array();
var MonsterFlag = 0;
var MonsterSetDirection = 0;
var createMonsterTimer = 0;
// 创建怪物
/*--------------------------------------------------------*/
/*
    参数:
        Monsternum: 一次出现怪物最多个数为(Monsternum+1)
*/
export function createMonster(Monsternum,mapArr) {
    if (!MonsterFlag) {
        MonsterFlag = 1;
        createMonsterTimer = setTimeout(function () {
            // 创建一批怪物放置在随机位置(距离边界200px)并添加进数组方便管理
            for (var i = 0; i < Math.round(Math.random() * Monsternum) + 1; i++) {
                MonsterSetDirection = Math.round(Math.random() * 3);
                let tempX = Math.round(Math.random() * 12);
                let tempY = Math.round(Math.random() * 23);
                let top = 0;
                let left = 0;
                let mappingX = 0;
                let mappingY = 0;
                top = tempX*size;
                left = tempY*size;
                // 分为4区域产怪
                if (MonsterSetDirection == 0) {
                    top = 0;
                    mappingX = 0;
                    mappingY = tempY;

                } else if (MonsterSetDirection == 1) {
                    left = 0;
                    mappingX = tempX;
                    mappingY = 0;
                } else if (MonsterSetDirection == 2) {
                    top = 12 * size;
                    mappingX = 12;
                    mappingY = tempY;
                } else if (MonsterSetDirection == 3) {
                    left = 23 * size;
                    mappingX = tempX;
                    mappingY = 23;
                }
                if (mapArr[mappingX][mappingY] == 0) {
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
                    // 初始化路线为空数组
                    monster.route = [];
                    monster.style.left = left + 'px';
                    monster.style.top = top + 'px';
                    monster.mappingX = mappingX;
                    monster.mappingY = mappingY;
                    MonsterArr[MonsterArr.length] = monster;
                }
            }
            MonsterFlag = 0;
        }, 4000);
    }
}
/*--------------------------------------------------------*/
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



// 显示怪物
/*--------------------------------------------------------*/
/*
    参数:
        character: 角色(需要根据角色位置移动)
        speedMonster: 怪物移动速度
        beforeMove:       在怪物移动之前执行
        afterMove:        在怪物移动之后执行
*/
export function monsterMove(character, speedMonster, beforeMove, afterMove) {
    // 将自身在的位置映射成数组位置

    for (var i = 0; i < MonsterArr.length; i++) {
        let monster = MonsterArr[i];
        // 走完一格计算一次路线
        if (monster.mappingX * size == monster.offsetTop - borderWidth && monster.mappingY * size == monster.offsetLeft - borderWidth) {
            // 目标坐标
            let cMappingX = Math.round((character.offsetTop - borderWidth) / 50);
            let cMappingY = Math.round((character.offsetLeft - borderWidth) / 50);
            // 计算移动路线 传入怪物坐标及目标坐标
            if (beforeMove) {
                monster.route = beforeMove(monster.mappingX, monster.mappingY, cMappingX, cMappingY)
            }
        }
        monster.shootDirectionX = 0;
        monster.shootDirectionY = 0;
        // 怪物移动
        // 路线第一个点的坐标
        let routeX1 = monster.route[0].X1;
        let routeY1 = monster.route[0].Y1;
        // 怪物坐标
        let monsterX = monster.mappingX;
        let monsterY = monster.mappingY;
        // 向上移动
        if (monsterX > routeX1) {
            monster.style.top = monster.offsetTop - borderWidth - speedMonster + "px";
            // 移出轨道则进行修正
            if (Math.abs(routeX1 * 50 - monster.offsetTop + borderWidth) - speedMonster < 0) {
                monster.style.top = routeX1 * 50 + 'px';
            }
            monster.shootDirectionY = -1;
        }
        // 向下移动
        if (monsterX < routeX1) {
            monster.style.top = monster.offsetTop - borderWidth + speedMonster + "px";
            // 移出轨道则进行修正
            if (Math.abs(routeX1 * 50 - monster.offsetTop + borderWidth) - speedMonster < 0) {
                monster.style.top = routeX1 * 50 + 'px';
            }
            monster.shootDirectionY = 1;
        }
        // 向左移动
        if (monsterY > routeY1) {
            monster.style.left = monster.offsetLeft - borderWidth - speedMonster + "px";
            // 移出轨道则进行修正
            if (Math.abs(routeY1 * 50 - monster.offsetLeft + borderWidth) - speedMonster < 0) {
                monster.style.left = routeY1 * 50 + 'px';
            }
            monster.shootDirectionX = -1;
        }
        // 向右移动
        if (monsterY < routeY1) {
            monster.style.left = monster.offsetLeft - borderWidth + speedMonster + "px";
            // 移出轨道则进行修正
            if (Math.abs(routeY1 * 50 - monster.offsetLeft + borderWidth) - speedMonster < 0) {
                monster.style.left = routeY1 * 50 + 'px';
            }
            monster.shootDirectionX = 1;
        }

        // 更新怪物坐标
        if (monster.offsetTop - borderWidth == routeX1 * 50) {
            monster.mappingX = routeX1;
        }
        if (monster.offsetLeft - borderWidth == routeY1 * 50) {
            monster.mappingY = routeY1;
        }



        // 改变飞机朝向
        if (monster.shootDirectionY == -1) {
            if (monster.shootDirectionX == -1) {
                monster.style.transform = 'rotate(180deg)';
            } else if (monster.shootDirectionX == 0) {
                monster.style.transform = 'rotate(-135deg)';
            }
            else if (monster.shootDirectionX == 1) {
                monster.style.transform = 'rotate(-90deg)';
            }
        } else if (monster.shootDirectionY == 0) {
            if (monster.shootDirectionX == -1) {
                monster.style.transform = 'rotate(135deg)';
            } else if (monster.shootDirectionX == 0) {
                monster.style.transform = 'rotate(0deg)';
            }
            else if (monster.shootDirectionX == 1) {
                monster.style.transform = 'rotate(-45deg)';
            }
        } else if (monster.shootDirectionY == 1) {
            if (monster.shootDirectionX == -1) {
                monster.style.transform = 'rotate(90deg)';
            } else if (monster.shootDirectionX == 0) {
                monster.style.transform = 'rotate(45deg)';
            }
            else if (monster.shootDirectionX == 1) {
                monster.style.transform = 'rotate(0deg)';
            }
        }
        // 怪物攻击
        afterMove && afterMove(monster);
    }
}
/*--------------------------------------------------------*/

// 怪物清空
export function clearMonster() {
    for (let i = 0; i < MonsterArr.length; i++) {
        document.body.removeChild(MonsterArr[i]);
    }
    MonsterArr.length = 0;
}

// 清除创建怪物的定时器防止游戏结束定时器未关
export function clearCreateMonsterTimer() {
    clearTimeout(createMonsterTimer);
    MonsterFlag = 0;
}