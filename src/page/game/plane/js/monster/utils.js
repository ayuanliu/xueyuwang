import { mapArr } from "../obstruction/obstruction.js";
const { lattice } = mapArr;
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
// 移动
export function move(monster, speedMonster) {
    let speed = speedMonster;
    if (monster._monsterName === 'snakeMonsterHeadRoute') {
        speed = 2 * speedMonster;
    }
    // 怪物移动 
    // 路线第一个点的坐标
    let routeX1 = monster.route[0].X1;
    let routeY1 = monster.route[0].Y1;
    // 怪物坐标
    let mLeft = monster.offsetLeft;
    let mTop = monster.offsetTop;
    let monsterX = monster.mappingX, monsterY = monster.mappingY;
    let speedx = speed / Math.sqrt(2), speedy = speed / Math.sqrt(2);
    let moveX = routeX1 - monsterX, moveY = routeY1 - monsterY;
    monster.style.left = mLeft - borderWidth + moveY * speedx + 'px';
    monster.style.top = mTop - borderWidth + moveX * speedy + 'px';
    monster.shootDirectionX = moveY;
    monster.shootDirectionY = moveX;
    // 接近(小于一次移动的距离)轨道则进行修正
    correct();
    function correct() {
        if (Math.abs(routeY1 * lattice - monster.offsetLeft + borderWidth) - speedx < 0) {
            monster.style.left = routeY1 * lattice + 'px';
        }
        // 接近(距离小于一次移动)轨道则进行修正
        if (Math.abs(routeX1 * lattice - monster.offsetTop + borderWidth) - speedy < 0) {
            monster.style.top = routeX1 * lattice + 'px';
        }
    }
    // 更新怪物坐标(数组)
    if (monster.offsetTop - borderWidth == routeX1 * lattice) {
        monster.mappingX = routeX1;
    }
    if (monster.offsetLeft - borderWidth == routeY1 * lattice) {
        monster.mappingY = routeY1;
    }
    changeDirection(monster);
}
// 改变飞机朝向
function changeDirection(monster) {
    // 改变怪物朝向
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
}