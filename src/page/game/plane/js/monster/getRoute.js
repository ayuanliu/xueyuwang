import { mapArr } from "../obstruction/obstruction.js";
import { routeStrategy } from "./routeStrategy.js";
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
const { lattice } = mapArr;
export function getRoute(monster, character, findRoute) {
    // 目标坐标
    let cMappingX = Math.round((character.offsetTop - borderWidth) / lattice);
    let cMappingY = Math.round((character.offsetLeft - borderWidth) / lattice);
    // 计算移动路线 传入怪物坐标及目标坐标
    if (findRoute) {
        // 根据不同怪物获得不同的路线
        // 有这个函数
        if (routeStrategy[monster._monsterName]) {
            monster.route = routeStrategy[monster._monsterName](findRoute, monster, character, cMappingX, cMappingY)
        }
    }
}