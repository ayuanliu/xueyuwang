// 蛇的状态
let snakeState = {
    attack: true,
};
let counter = 0;
export const routeStrategy = {
    commonMonsterRoute(findRoute, monster, character, cMappingX, cMappingY) {
        let { mappingX, mappingY } = monster
        return findRoute(mappingX, mappingY, cMappingX, cMappingY)
    },
    snakeMonsterHeadRoute(findRoute, monster, character, cMappingX, cMappingY) {
        let { attack } = snakeState;
        let { mappingX, mappingY } = monster;
        // 攻击状态结束且技能释放完毕
        if (attack && counter >= 30 && !monster.state.skills) {
            attack = false;
            counter = 0;
        } else if (!attack && counter >= 20) {
            attack = true;
            counter = 0;
        }
        counter++;
        snakeState.attack = attack;
        if (attack) {
            if (!monster.state) monster.state = {};
            let skills = monster.state.skills;
            // 技能状态
            if (skills == 'vineCage') {
                // console.log(1);
                // debugger
                // 发动技能 在这进行路线的选择 而且这里的路线是(A*算法的路线+固定路线)
                // 只计算一次路线并且按照路线
                // monster.state.skills = '';
                return findRoute(mappingX, mappingY, character.beVineCage.mappingX, character.beVineCage.mappingY, {
                    monster,
                    character,
                    skills: 'vineCage'
                });
            } else {
                // 返回蛇头下一个要走的路线(A*算法的路线)
                return findRoute(mappingX, mappingY, cMappingX, cMappingY);
            }
        } else {
            // 走固定路线(自动义路线)
            return findRoute(mappingX, mappingY, cMappingX, cMappingY, {
                random: true
            });
        }
    }
};