import { mapArr } from "../obstruction/obstruction.js";
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
let lattice = mapArr.lattice;
let routesList = [];
let execute = null;
(function () {
    let obj = {
        route1: ['right', 'right', 'rightUp', 'up', 'up', 'up', 'up', 'leftUp', 'left', 'left', 'left', 'left', 'leftDown', 'down', 'down', 'down', 'down', 'rightDown', 'right', 'right'],
        route2: ['up', 'up', 'leftUp', 'left', 'left', 'left', 'left', 'leftDown', 'down', 'down', 'down', 'down', 'rightDown', 'right', 'right', 'right', 'right', 'rightUp', 'up', 'up'],
        route3: ['left', 'left', 'leftDown', 'down', 'down', 'down', 'down', 'rightDown', 'right', 'right', 'right', 'right', 'rightUp', 'up', 'up', 'up', 'up', 'leftUp', 'left', 'left'],
        route4: ['down', 'down', 'rightDown', 'right', 'right', 'right', 'right', 'rightUp', 'up', 'up', 'up', 'up', 'leftUp', 'left', 'left', 'left', 'left', 'leftDown', 'down', 'down']
    }
    // 转换成二维数组
    routesList = Object.values(obj);
    execute = function (startX, startY, selectedStart) {
        let selectedRoute = routesList[selectedStart];
        let curX = startX, curY = startY;
        let arr = [];
        // 将这条路线转换成坐标
        for (let i = 0; i < selectedRoute.length; i++) {
            let direction = selectedRoute[i];
            switch (direction) {
                case 'up':
                    curX -= 1;
                    break;
                case 'down':
                    curX += 1;
                    break;
                case 'left':
                    curY -= 1;
                    break;
                case 'right':
                    curY += 1;
                    break;
                case 'leftUp':
                    curX -= 1;
                    curY -= 1;
                    break;
                case 'rightUp':
                    curX -= 1;
                    curY += 1;
                    break;
                case 'rightDown':
                    curX += 1;
                    curY += 1;
                    break;
                case 'leftDown':
                    curX += 1;
                    curY -= 1;
                    break;
            }
            arr.push({ X1: curX, Y1: curY });
        }
        // 返回整条路线
        return arr;
    }
})();
let resultRoute = [];
// 环绕次数
let times = 0;
// 正在走攻击路线
let attack = false;
// 蛇boss发动技能后的路线
export function vineCageRoute(monster, character, X1, Y1, X2, Y2, findRoute) {
    if (resultRoute.length > 0) {
        let route = [];
        route[0] = resultRoute.shift();
        // 在环绕的过程中停留在随机一个位置并进行攻击
        if (!attack && resultRoute.length <= 20 && !Math.floor(Math.random() * resultRoute.length)) {
            // 清空先前的路线
            resultRoute = [];
            attack = true;
            // 攻击路线
            resultRoute = attackRoute(monster, X2, Y2, findRoute);
            route[0] = resultRoute.shift();
        }
        // 技能放完了
        if (resultRoute.length == 0 && times >= 3) {
            // 清空怪物技能的状态
            monster.state.skills = '';
            times = 0;
        }
        return route;
    }
    // 计算到环绕起始点的路径
    // 选择环绕起始点
    times++;    // 每环绕一次都会记录下来
    attack = false;
    let starts = [{ X: X2 + 3, Y: Y2 }, { X: X2, Y: Y2 + 3 }, { X: X2 - 3, Y: Y2 }, { X: X2, Y: Y2 - 3 }];
    let min = 999999;
    let startX = 0, startY = 0;
    let selectedStart = 0;

    for (let i = 0; i < starts.length; i++) {
        let { X, Y } = starts[i];
        let temp = Math.sqrt(Math.pow((X1 - X), 2) + Math.pow((Y1 - Y), 2));
        if (temp < min) {
            selectedStart = i;
            min = temp;
            startX = X;
            startY = Y;
        }
    }
    let resultRoute1 = findRoute(X1, Y1, startX, startY);
    // 选择环绕的路径
    let resultRoute2 = execute(startX, startY, selectedStart);
    // 将两个路径合并并且返回
    resultRoute.push.apply(resultRoute, resultRoute1);
    resultRoute.push.apply(resultRoute, resultRoute2);
    if (resultRoute1.length) {
        return resultRoute1
    } else {
        return resultRoute2;
    }
}
function attackRoute(monster, X2, Y2, findRoute) {
    let mappingX = Math.round((monster.offsetTop - borderWidth) / lattice);
    let mappingY = Math.round((monster.offsetLeft - borderWidth) / lattice);
    let starts = [{ X: X2 + 3, Y: Y2 }, { X: X2, Y: Y2 + 3 }, { X: X2 - 3, Y: Y2 }, { X: X2, Y: Y2 - 3 }];
    if (mappingX === X2 + 3 && mappingY === Y2) {
        starts.splice(0, 1);
    } else if (mappingX === X2 && mappingY === Y2 + 3) {
        starts.splice(1, 1);
    } else if (mappingX === X2 - 3 && mappingY === Y2) {
        starts.splice(2, 1);
    } else if (mappingX === X2 && mappingY === Y2 - 3) {
        starts.splice(3, 1);
    }
    let index = Math.floor(Math.random() * starts.length);
    let selected = starts[index];
    return findRoute(mappingX, mappingY, selected.X, selected.Y);
}