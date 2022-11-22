/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
const body = document.body;
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
/*
    skillsbox部分
             
*/
const skill1 = document.querySelector('.skill1');
const skill2 = document.querySelector('.skill2');
const occlusionLeft1 = skill1.children[0].children[0];
const occlusionRight1 = skill1.children[1].children[0];
const occlusionLeft2 = skill2.children[0].children[0];
const occlusionRight2 = skill2.children[1].children[0];
const cooling1 = document.querySelector('.cooling1');
const cooling2 = document.querySelector('.cooling2');
/*--------------------------------------------------------*/

export const skills = []
// 地狱火(4s)
export function hellfire(obj) {
    if (!obj.hellfireFlag) {
        obj.hellfireFlag = 1;
        // 创建一个子弹并添加进数组方便管理
        var hellfire = document.createElement("div");
        hellfire.className = "hellfire";
        document.body.appendChild(hellfire);
        // 根据角色当前位置以及方向创建子弹
        if (obj.shootDirectionY == -1 && obj.shootDirectionX == -1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight / 2 * (1 - Math.sqrt(2) / 2) - hellfire.offsetHeight - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth / 2 * (1 - Math.sqrt(2) / 2) - hellfire.offsetWidth - borderWidth + "px";
        } else if (obj.shootDirectionY == -1 && obj.shootDirectionX == 1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight / 2 * (1 - Math.sqrt(2) / 2) - hellfire.offsetHeight - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth / 2 + obj.offsetWidth / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
        } else if (obj.shootDirectionY == 1 && obj.shootDirectionX == -1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight / 2 + obj.offsetHeight / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth / 2 * (1 - Math.sqrt(2) / 2) - hellfire.offsetWidth - borderWidth + "px";
        } else if (obj.shootDirectionY == 1 && obj.shootDirectionX == 1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight / 2 + obj.offsetHeight / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth / 2 + obj.offsetWidth / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
        } else if (obj.shootDirectionX == 1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight / 2 - hellfire.offsetHeight / 2 - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth - borderWidth + "px";
        } else if (obj.shootDirectionX == -1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight / 2 - hellfire.offsetHeight / 2 - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft - hellfire.offsetWidth - borderWidth + "px";
        } else if (obj.shootDirectionY == 1) {
            hellfire.style.top = obj.offsetTop + obj.offsetHeight - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth / 2 - hellfire.offsetWidth / 2 - borderWidth + "px";
        } else if (obj.shootDirectionY == -1) {
            hellfire.style.top = obj.offsetTop - hellfire.offsetHeight - borderWidth + "px";
            hellfire.style.left = obj.offsetLeft + obj.offsetWidth / 2 - hellfire.offsetWidth / 2 - borderWidth + "px";
        }
        hellfire.isHellfire = 1;
        hellfire.disappear = 8;
        skills[skills.length] = hellfire;
        let flag = 4;
        let deg1 = 0;
        let ideg = 360 / flag;
        occlusionLeft1.children[0].style.float = 'left';
        occlusionRight1.children[0].style.float = 'right';
        cooling1.childNodes[0].innerHTML = flag + 's';
        // 开始立刻进行冷却这样当flag=4时往3秒冷却当flag=3时往2秒冷却...
        function startcool() {
            deg1 += ideg;
            occlusionRight1.style.transition = '1s linear';
            occlusionRight1.style.rotate = deg1 + 'deg';
        }
        startcool();
        let timer = setInterval(function () {
            flag--;
            deg1 += ideg;
            // 等于0冷却结束
            if (flag <= 0) {
                flag = 'OK';
                obj.hellfireFlag = 0;
                clearInterval(timer);
                cooling1.childNodes[0].innerHTML = flag;
                occlusionRight1.style.transition = '0s';
                occlusionRight1.style.rotate = 0 + 'deg';
                occlusionLeft1.style.transition = '0s';
                occlusionLeft1.style.rotate = 0 + 'deg';
                // 交换
                occlusionLeft1.children[0].style.float = 'right';
                occlusionRight1.children[0].style.float = 'left';
                return;
            }
            if (deg1 > 180) {
                occlusionLeft1.style.transition = '1s linear';
                occlusionLeft1.style.rotate = deg1 - 180 + 'deg';
            } else {
                occlusionRight1.style.transition = '1s linear';
                occlusionRight1.style.rotate = deg1 + 'deg';
            }
            cooling1.childNodes[0].innerHTML = flag + 's';
        }, 1000);
    }
}
// 该定时器用来清除超过时间的技能
setInterval(function () {
    for (let i = 0; i < skills.length; i++) {
        if (skills[i].isHellfire) {
            skills[i].disappear--;
            if (skills[i].disappear <= 0) {
                body.removeChild(skills[i]);
                skills.splice(i, 1);
                i--;
            }
        }
    }
}, 1000);
// 全屏轰炸(40s)
export function fullScreenBombing(obj, callback) {
    if (!obj.fullScreenBombing) {
        obj.fullScreenBombing = 1;
        callback && callback();
        let flag = 40;
        let deg1 = 0;
        let ideg = 360 / flag;
        occlusionLeft2.children[0].style.float = 'left';
        occlusionRight2.children[0].style.float = 'right';
        cooling2.childNodes[0].innerHTML = flag + 's';
        // 开始立刻进行冷却这样当flag=4时往3秒冷却当flag=3时往2秒冷却...
        function startcool() {
            deg1 += ideg;
            occlusionRight2.style.transition = '1s linear';
            occlusionRight2.style.rotate = deg1 + 'deg';
        }
        startcool();
        let timer = setInterval(function () {
            flag--;
            deg1 += ideg;
            // 等于0冷却结束
            if (flag <= 0) {
                flag = 'OK';
                obj.fullScreenBombing = 0;
                clearInterval(timer);
                cooling2.childNodes[0].innerHTML = flag;
                occlusionRight2.style.transition = '0s';
                occlusionRight2.style.rotate = 0 + 'deg';
                occlusionLeft2.style.transition = '0s';
                occlusionLeft2.style.rotate = 0 + 'deg';
                // 交换
                occlusionLeft2.children[0].style.float = 'right';
                occlusionRight2.children[0].style.float = 'left';
                return;
            }
            if (deg1 > 180) {
                occlusionLeft2.style.transition = '1s linear';
                occlusionLeft2.style.rotate = deg1 - 180 + 'deg';
            } else {
                occlusionRight2.style.transition = '1s linear';
                occlusionRight2.style.rotate = deg1 + 'deg';
            }
            cooling2.childNodes[0].innerHTML = flag + 's';
        }, 1000);
    }
}

// 藤蔓囚笼
export function vineCage(monster, character, mapArr) {
    let originMap = mapArr.originMap;
    // 将对象周围围住
    let characterLeft = character.offsetLeft - borderWidth, characterTop = character.offsetTop - borderWidth;
    // character坐标映射成数组并且存入character中
    let mappingX = Math.round(characterTop / mapArr.lattice), mappingY = Math.round(characterLeft / mapArr.lattice);
    character.beVineCage = {
        mappingX,
        mappingY
    };
    let arr = [];
    for (let i = mappingX - 3; i <= mappingX + 3; i++) {
        arr.push(`
            <div class="vineCage" style="left:${(mappingY - 3) * mapArr.lattice}px;top:${i * mapArr.lattice}px">1</div>
            <div class="vineCage" style="left:${(mappingY + 3) * mapArr.lattice}px;top:${i * mapArr.lattice}px">1</div>
        `);
        if (mappingY - 3 >= 0) originMap[i][mappingY - 3] = 2;
        if (mappingY + 3 < mapArr[0].length) originMap[i][mappingY + 3] = 2;
    }
    for (let i = mappingY - 3; i <= mappingY + 3; i++) {
        arr.push(`
            <div class="vineCage" style="left:${i * mapArr.lattice}px;top:${(mappingX - 3) * mapArr.lattice}px">1</div>
            <div class="vineCage" style="left:${i * mapArr.lattice}px;top:${(mappingX + 3) * mapArr.lattice}px">1</div>
        `);
        if (mappingX - 3 >= 0) originMap[mappingX - 3][i] = 2;
        if (mappingX + 3 < mapArr.length) originMap[mappingX + 3][i] = 2;
    }
    // 将特效渲染
    body.insertAdjacentHTML('beforeend', arr.join(''));
    upDataState(monster);
    // 改变monster的状态
    function upDataState(monster) {
        if (!monster.state) monster.state = {};
        monster.state.skills = 'vineCage';
    }
}