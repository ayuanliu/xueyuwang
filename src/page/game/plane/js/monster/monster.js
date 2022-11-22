/*--------------------------------------------------------*/
import { mapArr } from "../obstruction/obstruction.js";
import { getRoute } from "./getRoute.js";
import { move } from "./utils.js";
/*
    body部分
        borderWidth 边框的大小      
*/
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
// 网格大小 数组宽(从0开始) 数组高(从0开始)
const { lattice, mapWidth, mapHeight } = mapArr;
/*
    怪物部分
        MonsterFlag         是否允许创建怪物 这里用来作开关
        MonsterSetDirection 创建的怪物出现位置有多少种情况 这里为4种
        MonsterArr          存放怪物的数组
*/
const MonsterArr = new Array();
var MonsterFlag = 0;
var createMonsterTimer = 0;
// 创建怪物
/*--------------------------------------------------------*/
/*
    参数:
        Monsternum: 一次出现怪物最多个数为(Monsternum+1)
*/
let snakeMonsterFlag = 0;
export function createMonster(Monsternum) {
    if (!MonsterFlag) {
        MonsterFlag = 1;
        createMonsterTimer = setTimeout(function () {
            // 创建一批怪物放置在随机位置(距离边界200px)并添加进数组方便管理
            for (let i = 0; i < Math.round(Math.random() * Monsternum) /*+ 1*/; i++) {
                let { mappingX, mappingY, top, left } = setMonster();
                if (mapArr.originMap[mappingX][mappingY] === 0) {
                    let monster = document.createElement("div");
                    let bgcSelect = Math.floor(Math.random() * 4) + 1;
                    monster.className = `monster${bgcSelect}`;
                    document.body.appendChild(monster);
                    monster.style.left = left + 'px';
                    monster.style.top = top + 'px';
                    // 初始化路线为空数组
                    Object.assign(monster, {
                        route: [],
                        _monsterName: 'commonMonsterRoute',
                        mappingX,
                        mappingY
                    })
                    MonsterArr.push(monster);
                }
            }
            MonsterFlag = 0;
        }, 2000);
    }
    // 放置怪物
    function setMonster() {
        let MonsterSetDirection = Math.round(Math.random() * 3);
        let mappingX = Math.round(Math.random() * mapHeight);
        let mappingY = Math.round(Math.random() * mapWidth);
        // 分为4区域产怪
        switch (MonsterSetDirection) {
            case 0:
                mappingX = 0;
                break;
            case 1:
                mappingY = 0;
                break;
            case 2:
                mappingX = mapHeight;
                break;
            case 3:
                mappingY = mapWidth;
                break;
        }
        return { mappingX, mappingY, top: mappingX * lattice, left: mappingY * lattice };
    }
    // ...待解决什么时候添加蛇boss
    if (!snakeMonsterFlag) {
        let { mappingX, mappingY, top, left } = setMonster();
        createSnakeMonster(mappingX, mappingY, top, left);
        snakeMonsterFlag = 1;
    }
    // 创建一个蛇boss 蛇由圆节点连接成
    function createSnakeMonster(mappingX, mappingY, top, left) {
        let snakeArr = [];
        // 初始化创建蛇boss
        // 蛇头
        snakeArr.push(`
            <div class="snakeMonsterHead" style="top:${top}px;left:${left}px;"></div>
        `)
        for (let i = 0; i < 20; i++) {
            snakeArr.push(`
            <div class="snakeMonsterBody" style="top:${top}px;left:${left}px;"></div>
        `)
        }
        document.body.insertAdjacentHTML('beforeend', snakeArr.join(''));
        let head = document.querySelector('.snakeMonsterHead');
        let bodys = document.querySelectorAll('.snakeMonsterBody');
        Object.assign(head, {
            order: 0,
            route: [],
            _monsterName: 'snakeMonsterHeadRoute',
            historyRoute: [],
            mappingX,
            mappingY
        })
        MonsterArr.push(head);
        for (let i = 0; i < bodys.length; i++) {
            let body = bodys[i];
            i == 0 ? body.pre = head : body.pre = bodys[i - 1];
            Object.assign(body, {
                order: i + 1,
                route: [],
                _monsterName: 'snakeMonsterBodyRoute',
                historyRoute: [],
                mappingX,
                mappingY,
            })
            MonsterArr.push(body);
        }
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
    if (monster.shootTimer == undefined) setTimes();
    if (monster.shootTimer > 0) {
        monster.shootTimer--;
    } else {
        setTimes();
        // 根据怪物移动方向进行攻击
        monster.shootFlag = 0;
        // 如果是蛇boss则monster.shoot = 2;
        if (monster._monsterName === 'snakeMonsterHeadRoute') {
            monster.shoot = 2;
        } else {
            monster.shoot = 1;
        }
        // 发动攻击
        callback && callback(monster.shoot);
    }
    function setTimes() {
        if (monster._monsterName === 'snakeMonsterHeadRoute') {
            monster.shootTimer = 200;
        } else {
            monster.shootTimer = 200;
        }
    }
}
// 怪物移动
/*--------------------------------------------------------*/
/*
    参数:
        character: 角色(需要根据角色位置移动)
        speedMonster: 怪物移动速度
        beforeMove:       在怪物移动之前执行
        afterMove:        在怪物移动之后执行
*/
let snakeBodySpace = 8;
export function monsterMove(character, speedMonster, beforeMove, afterMove) {
    // 将自身在的位置映射成数组位置
    for (var i = 0; i < MonsterArr.length; i++) {
        let monster = MonsterArr[i];
        // 走完一格(当怪物的真实坐标的映射等于mappingX时认为走完一格)计算一次路线
        if (monster.mappingX * lattice == monster.offsetTop - borderWidth && monster.mappingY * lattice == monster.offsetLeft - borderWidth) getRoute(monster,character,beforeMove);
        // 蛇boss 头会往下执行 身体则不执行else if下面
        if (monster._monsterName === 'snakeMonsterHeadRoute') {
            monster.historyRoute.unshift({ X1: monster.offsetLeft - borderWidth, Y1: monster.offsetTop - borderWidth });
            if (monster.historyRoute.length > snakeBodySpace) monster.historyRoute.pop();
        } else if (monster._monsterName === 'snakeMonsterBodyRoute') {
            if (monster.pre.historyRoute.length < snakeBodySpace) continue;
            // 收集上一个节点的轨迹
            if (monster.pre.historyRoute.length === snakeBodySpace) {
                let result = monster.pre.historyRoute[monster.pre.historyRoute.length - 1]
                monster.style.left = result.X1 + 'px';
                monster.style.top = result.Y1 + 'px';
                monster.historyRoute.unshift(result);
            }
            if (monster.historyRoute.length > snakeBodySpace) monster.historyRoute.pop();
            continue;
        }
        // 移动(包括了改变方向)
        move(monster,speedMonster);
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