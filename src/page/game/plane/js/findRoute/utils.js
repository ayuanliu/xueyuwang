import { mapArr } from "../obstruction/obstruction.js";
// 当前位置 返回一个表(包含哪些位置可以去)
/*
    参数:
        mapArr              地图
        X                   传入当前坐标
        Y                   传入当前坐标
*/
export function ableMoveTo(X, Y) {
    let up = null, down = null, left = null, right = null;
    let leftUp = null, rightUp = null, leftDown = null, rightDown = null;
    // 上
    if (X > 0 && mapArr[X - 1][Y] !== 1) {
        up = { X: X - 1, Y: Y };
    }
    // 下
    if (X < mapArr.length - 1 && mapArr[X + 1][Y] !== 1) {
        down = { X: X + 1, Y: Y };
    }
    // 左
    if (Y > 0 && mapArr[X][Y - 1] !== 1) {
        left = { X: X, Y: Y - 1 };
    }
    // 右
    if (Y < mapArr[0].length - 1 && mapArr[X][Y + 1] !== 1) {
        right = { X: X, Y: Y + 1 };
    }
    // 左上
    if (left && up && mapArr[X - 1][Y - 1] !== 1) {
        leftUp = { X: X - 1, Y: Y - 1 };
    }
    // 右上
    if (right && up && mapArr[X - 1][Y + 1] !== 1) {
        rightUp = { X: X - 1, Y: Y + 1 };
    }
    // 左下
    if (left && down && mapArr[X + 1][Y - 1] !== 1) {
        leftDown = { X: X + 1, Y: Y - 1 };
    }
    // 右下
    if (right && down && mapArr[X + 1][Y + 1] !== 1) {
        rightDown = { X: X + 1, Y: Y + 1 };
    }
    return {
        up,
        down,
        left,
        right,
        leftUp,
        rightUp,
        leftDown,
        rightDown
    }
}

// 获取一个随机的路线
/*
    参数:
        X                   传入当前坐标
        Y                   传入当前坐标
*/
export function getRandomRoute(X, Y) {
    let arr = [];
    let index = 0;
    // 在所有能走的位置中挑选一个位置
    let ableMoves = ableMoveTo(X, Y);
    for (let key in ableMoves) {
        if (ableMoves[key]) arr.push(ableMoves[key]);
    }
    index = parseInt(Math.random() * arr.length);
    // 从arr中随机挑出一个移动方向返回
    let result = arr[index];
    // 处理结果
    result = { X1: result.X, Y1: result.Y };
    return result;
}

// 获取一个自定义路线如果自定义路线中部分被墙阻挡则随机走一步
let routesList = [];
let selectedRoute = null;
let execute = null;
(function () {
    let times = 0;
    let obj = {
        sRoute: ['right', 'rightUp', 'leftUp', 'left', 'left', 'leftUp', 'rightUp', 'right'],
        // oRoute1: ['right', 'rightUp', 'up', 'up', 'leftUp', 'left', 'left', 'leftDown', 'down', 'down', 'rightDown', 'right'],
        // oRoute2: ['up', 'leftUp', 'left', 'left', 'leftDown', 'down', 'down', 'rightDown', 'right', 'right', 'rightUp', 'up'],
        // oRoute3: ['left', 'leftDown', 'down', 'down', 'rightDown', 'right', 'right', 'rightUp', 'up', 'up', 'leftUp', 'left'],
        // oRoute4: ['down', 'rightDown', 'right', 'right', 'rightUp', 'up', 'up', 'leftUp', 'left', 'left', 'leftDown', 'down']
    }
    // 转换成二维数组
    routesList = Object.values(obj);
    execute = function (X1, Y1) {
        // 根据执行次数计算路线
        let key = selectedRoute[times++];
        if (times > selectedRoute.length - 1) {
            selectedRoute = null;
            times = 0;
        }
        // 如果X,Y可走则X,Y
        let ableMoves = ableMoveTo(X1, Y1);
        if (ableMoves[key]) {
            let { X, Y } = ableMoves[key]
            return { X1: X, Y1: Y }
        }
    }
})();
export function definedRoute(X1, Y1) {
    // 选择路线
    if (!selectedRoute) {
        // 随机选择一种路线
        let index = parseInt(Math.random() * routesList.length);
        selectedRoute = routesList[index];
    }
    // 每调用一次selectedRoute都会返回自定义路线中的一个路线节点
    let result = execute(X1, Y1);
    if (result) return result;
    // 随机路线
    return getRandomRoute(X1, Y1);
}