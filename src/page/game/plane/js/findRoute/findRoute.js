import { mapArr } from "../obstruction/obstruction.js";
import { vineCageRoute } from "./snakeBossRoute.js";
import { ableMoveTo, definedRoute } from "./utils.js";
let originMap = mapArr.originMap;
const copyArr = [];
let list = [];
// 计算8个方向的到目标的最小距离
function calculateRoute(start, X2, Y2) {
    mapArr[start.X1][start.Y1] = -1;
    while (start.X1 != X2 || start.Y1 != Y2) {
        let X1 = start.X1;
        let Y1 = start.Y1;
        let flagu = 0, flagd = 0, flagl = 0, flagr = 0;
        // 上边
        if (X1 - 1 >= 0) {
            // 1表示只可以斜上计算 2表示既可以向上计算又可以向斜上计算
            // mapArr中-1表示已经计算
            if (mapArr[X1 - 1][Y1] !== 1 && mapArr[X1 - 1][Y1] !== -1) {
                flagu = 2;
            } else if (mapArr[X1 - 1][Y1] == -1) {
                flagu = 1;
            }
        }
        // 右边
        if (Y1 + 1 < mapArr[X1].length) {
            if (mapArr[X1][Y1 + 1] !== 1 && mapArr[X1][Y1 + 1] !== -1) {
                flagr = 2;
            } else if (mapArr[X1][Y1 + 1] == -1) {
                flagr = 1;
            }
        }
        // 下边
        if (X1 + 1 < mapArr.length) {
            if (mapArr[X1 + 1][Y1] !== 1 && mapArr[X1 + 1][Y1] !== -1) {
                flagd = 2;
            } else if (mapArr[X1 + 1][Y1] == -1) {
                flagd = 1;
            }
        }
        // 左边
        if (Y1 - 1 >= 0) {
            if (mapArr[X1][Y1 - 1] !== 1 && mapArr[X1][Y1 - 1] !== -1) {
                flagl = 2;
            } else if (mapArr[X1][Y1 - 1] == -1) {
                flagl = 1;
            }

        }
        // 右上最小距离
        if ((flagu == 1 || flagu == 2) && (flagr == 1 || flagr == 2)) {
            if (mapArr[X1 - 1][Y1 + 1] !== 1 && mapArr[X1 - 1][Y1 + 1] != -1) {
                slanting(X1 - 1, Y1 + 1, X2, Y2, Math.sqrt(2), start);
                mapArr[X1 - 1][Y1 + 1] = -1;
            }
        }
        // 右下最小距离
        if ((flagd == 1 || flagd == 2) && (flagr == 1 || flagr == 2)) {
            if (mapArr[X1 + 1][Y1 + 1] !== 1 && mapArr[X1 + 1][Y1 + 1] != -1) {
                slanting(X1 + 1, Y1 + 1, X2, Y2, Math.sqrt(2), start);
                mapArr[X1 + 1][Y1 + 1] = -1;
            }
        }
        // 左下最小距离
        if ((flagd == 1 || flagd == 2) && (flagl == 1 || flagl == 2)) {
            if (mapArr[X1 + 1][Y1 - 1] !== 1 && mapArr[X1 + 1][Y1 - 1] != -1) {
                slanting(X1 + 1, Y1 - 1, X2, Y2, Math.sqrt(2), start);
                mapArr[X1 + 1][Y1 - 1] = -1;
            }
        }
        // 左上最小距离
        if ((flagu == 1 || flagu == 2) && (flagl == 1 || flagl == 2)) {
            if (mapArr[X1 - 1][Y1 - 1] !== 1 && mapArr[X1 - 1][Y1 - 1] != -1) {
                slanting(X1 - 1, Y1 - 1, X2, Y2, Math.sqrt(2), start);
                mapArr[X1 - 1][Y1 - 1] = -1;
            }
        }
        // 上边最小距离
        if (flagu == 2) {
            slanting(X1 - 1, Y1, X2, Y2, 1, start);
            // 已计算标记为-1
            mapArr[X1 - 1][Y1] = -1;
        }
        // 右边最小距离
        if (flagr == 2) {
            slanting(X1, Y1 + 1, X2, Y2, 1, start);
            mapArr[X1][Y1 + 1] = -1;
        }
        // 下边最小距离
        if (flagd == 2) {
            slanting(X1 + 1, Y1, X2, Y2, 1, start);
            mapArr[X1 + 1][Y1] = -1;
        }
        // 左边最小距离
        if (flagl == 2) {
            slanting(X1, Y1 - 1, X2, Y2, 1, start);
            mapArr[X1][Y1 - 1] = -1;
        }
        // 获取本此计算后list中的最小数据
        start = getMin();
    }
    return start;
}
function slanting(X1, Y1, X2, Y2, increment, start) {
    // 计算到达目标的最小距离
    let data = 0;
    let X = Math.abs(X2 - X1);
    let Y = Math.abs(Y2 - Y1);
    if (X > Y) {
        data = Y * Math.sqrt(2) + X - Y
    } else {
        data = X * Math.sqrt(2) + Y - X;
    }
    let walked = start.walked + increment;
    // data等于走过的距离加上距离目标的最小距离
    data += start.walked + increment + data;
    let options = {
        X1,
        Y1,
        walked,
        data,
        pre: start
    }
    insert(options);
}
/*
    参数:
        data 插入的值
*/
// 优先队列(最小值先出)
function insert(options) {
    list.push(options);
    // 插入节点的下标
    let index = list.length - 1;
    // 插入节点父节点的下标
    let pIndex = parseInt((index - 1) / 2);
    // 上滤
    while (index > 0) {
        if (list[pIndex].data > list[index].data) {
            // 交换值
            let temp = null;
            temp = list[index];
            list[index] = list[pIndex];
            list[pIndex] = temp;
            index = pIndex;
            pIndex = parseInt((index - 1) / 2);
        } else {
            break;
        }
    }
}
// 获取最小值该操作会修改数组
function getMin() {
    // 没有元素
    if (list.length == 0) {
        return;
    }
    // 只有一个元素
    if (list.length == 1) {
        return list.pop();
    }
    const result = list[0];
    // 将最后一个元素替换第一个元素
    list[0] = list.pop(list.length - 1);
    // 下滤
    let parent = 0;
    // 左节点索引
    let index = parent * 2 + 1;
    while (index < list.length) {
        // 右节点存在且小于左节点
        if (index != list.length - 1 && list[index].data > list[index + 1].data) {
            // 当前索引指向右节点
            index++;
        }
        if (list[parent].data > list[index].data) {
            // 交换值
            let temp = null;
            temp = list[index];
            list[index] = list[parent];
            list[parent] = temp;
            parent = index;
            index = parent * 2 + 1;
        } else {
            break;
        }
    }
    return result;
}
// 读取最小值该操作不会修改数组
function readMin() {
    // 没有元素
    if (list.length == 0) {
        return;
    }
    return list[0];
}




// 传入怪物坐标及目标坐标
export function findRoute(X1, Y1, X2, Y2, options = {}) {
    // 每次计算路径先初始化mapArr地图
    for (let i = 0; i < originMap.length; i++) {
        for (let j = 0; j < originMap[0].length; j++) {
            mapArr[i][j] = originMap[i][j];
        }
    }
    let { random, skills, monster, character } = options;
    // 清空list(用来存放最小堆)
    list = [];
    const route = [];
    // 蛇发动技能后走这条路线
    if (skills === 'vineCage') {
        return vineCageRoute(monster, character, X1, Y1, X2, Y2, findRoute);
    };
    // 走自定义路线
    if (random) {
        route[0] = definedRoute(X1, Y1);
        return route;
    }
    // 将怪物的起始位置封装成一个对象
    let start = {
        X1,
        Y1,
        walked: 0,
        data: 99999,
        pre: null,
    }
    // 计算路线返回终点
    start = calculateRoute(start, X2, Y2);
    // 利用终点回溯到起始点并将途中经过的点保存形成路线
    traceback(start);
    // 回溯
    function traceback(start) {
        while (start.pre) {
            route.unshift(start);
            start = start.pre;
        }
    }
    // 返回路线
    return route;
}
