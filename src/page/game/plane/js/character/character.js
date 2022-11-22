/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
const bodyHeight = parseInt(getComputedStyle(document.body)['height']);
const bodyWidth = parseInt(getComputedStyle(document.body)['width']);
/*--------------------------------------------------------*/
// 角色的大小
const size = 30;
let character = null;
// 角色初始化
/*--------------------------------------------------------*/
/*
    返回角色对象
*/
export function createCharacter() {
    character = document.createElement("div");
    character.className = "character";
    document.body.appendChild(character);
    character.style.top = bodyHeight / 2 - character.offsetHeight / 2 + "px";
    character.style.left = bodyWidth / 2 - character.offsetWidth / 2 + "px";
    Object.assign(character, {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        shootDirectionY: 1,
        shootDirectionX: 1,
        shootFlag: 0,
        weapon: 0
    })
    control(character);
    return character;
}
/*--------------------------------------------------------*/
// 按键
/*--------------------------------------------------------*/
/*
    参数:
        obj 角色
*/
/*--------------------------------------------------------*/
function updataObj(obj) {
    if (obj.up && obj.left) {
        obj.shootDirectionY = -1;
        obj.shootDirectionX = -1;
        obj.style.transform = 'rotate(180deg)';
    } else if (obj.up && obj.right) {
        obj.shootDirectionY = -1;
        obj.shootDirectionX = 1;
        obj.style.transform = 'rotate(-90deg)';
    } else if (obj.down && obj.left) {
        obj.shootDirectionY = 1;
        obj.shootDirectionX = -1;
        obj.style.transform = 'rotate(90deg)';
    } else if (obj.down && obj.right) {
        obj.shootDirectionY = 1;
        obj.shootDirectionX = 1;
        obj.style.transform = 'rotate(0)';
    } else if (obj.up) {
        obj.shootDirectionY = -1;
        obj.shootDirectionX = 0;
        obj.style.transform = 'rotate(-135deg)';
    } else if (obj.left) {
        obj.shootDirectionY = 0;
        obj.shootDirectionX = -1;
        obj.style.transform = 'rotate(135deg)';
    } else if (obj.down) {
        obj.shootDirectionY = 1;
        obj.shootDirectionX = 0;
        obj.style.transform = 'rotate(45deg)';
    } else if (obj.right) {
        obj.shootDirectionY = 0;
        obj.shootDirectionX = 1;
        obj.style.transform = 'rotate(-45deg)';
    }
}
function control(obj) {
    // 控制角色
    document.onkeydown = function (event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87:
                obj.up = -1;
                break;
            case 83:
                obj.down = 1;
                break;
            case 65:
                obj.left = -1;
                break;
            case 68:
                obj.right = 1;
                break;
            case 74:
                // 普通攻击
                obj.shoot = 1;
                break;
            case 79:
                // 大招清屏
                obj.shoot = 2;
                break;
            case 85:
                // 地狱火
                obj.shoot = 3;
                break;
            case 81:
                // 切换武器
                obj.changeWeapon = 1;
                break;
            case 80:
                alert("暂停");
                break;
        }
        // 改变角色状态
        updataObj(obj);
    }
    document.onkeyup = function (event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87:
                obj.up = 0;
                break;
            case 83:
                obj.down = 0;
                break;
            case 65:
                obj.left = 0;
                break;
            case 68:
                obj.right = 0;
                break;
            case 74:
                obj.shoot = 0;
                break;
            case 79:
                obj.shoot = 0;
                break;
            case 85:
                obj.shoot = 0;
                break;
            case 81:
                obj.changeWeapon = 0;
                break;
        }
        updataObj(obj);
    }
}

// 角色切换武器
export function characterChangeWeapon() {

}
// 角色攻击
/*--------------------------------------------------------*/
/*
    参数:
        obj: 角色
*/
export function characterShoot(callback) {
    if (character.shoot) {
        callback && callback(character.shoot);
        // 技能使用一次会冷却
        // if (character.shoot === 2) {
        //     character.shoot = 0;
        // } else if (character.shoot === 3) {
        //     character.shoot = 0;
        // }
    }
}
/*--------------------------------------------------------*/
// 角色移动
/*--------------------------------------------------------*/
/* 
    参数:
        obj: 角色
        speed: 移动速度
        up: -1表示上移
        down: 1表示下移
        left: -1表示左移
        right: 1表示右移
*/
export function characterMove(mapArr, speed) {
    /*  obj.style.top为不包括定位元素边框的垂直距离
        obj.offsetTop为包括定位元素边框的垂直距离
        为了统一使用减去边框的值
    */
    // lattice一格的大小
    let lattice = mapArr.lattice;
    let cTop = character.offsetTop;
    let cLeft = character.offsetLeft;
    let cHeight = character.offsetHeight;
    let cWidth = character.offsetWidth;
    let { up, left, right, down } = character;
    // 这个是X按数组的坐标方向
    let t = Math.floor((cTop - borderWidth) / lattice);
    let l = Math.floor((cLeft - borderWidth) / lattice);
    let r = Math.floor((cLeft + size - borderWidth) / lattice);
    let b = Math.floor((cTop + size - borderWidth) / lattice);
    // 将自身位置左上点映射成数组位置
    let lTX = t, lTY = l;
    // 将自身位置右上点映射成数组位置
    let rTX = t, rTY = r;
    // 将自身位置左下点映射成数组位置
    let lBX = b, lBY = l;
    // 将自身位置右下点映射成数组位置
    let rBX = b, rBY = r;
    // 如果进入障碍物则不能移动
    if (disableMove()) return;
    function disableMove() {
        let originMap = mapArr.originMap;
        // 向上
        if (character.up == -1) {
            // 进行虚拟向上
            let x = Math.floor((cTop - borderWidth - speed) / lattice);
            if (x >= 0) {
                if (originMap[x][lTY] == 1 || originMap[x][rTY] == 1) return true;
                if (originMap[x][lTY] == 2 || originMap[x][rTY] == 2) return true;
            }
        }
        // 向下
        if (character.down == 1) {
            // 进行虚拟向下
            let x = Math.floor((cTop + size - borderWidth + speed) / lattice);
            if (x >= 0) {
                if (originMap[x][lBY] == 1 || originMap[x][rBY] == 1) return true;
                if (originMap[x][lBY] == 2 || originMap[x][rBY] == 2) return true;
            }
        }
        // 向左
        if (character.left == -1) {
            // 进行虚拟向左
            let y = Math.floor((cLeft - borderWidth - speed) / lattice);
            if (y >= 0) {
                if (originMap[lTX][y] == 1 || originMap[lBX][y] == 1) return true;
                if (originMap[lTX][y] == 2 || originMap[lBX][y] == 2) return true;
            }
        }
        // 向右
        if (character.right == 1) {
            // 进行虚拟向右
            let y = Math.floor((cLeft + size - borderWidth + speed) / lattice);
            if (y >= 0) {
                if (originMap[rTX][y] == 1 || originMap[rBX][y] == 1) return true;
                if (originMap[rTX][y] == 2 || originMap[rBX][y] == 2) return true;
            }
        }
        return false;
    }
    // 如果到达边界则不能移动
    if (cTop - speed < borderWidth && up == -1) {
        return;
    } else if (cTop + speed + borderWidth + cHeight > bodyHeight && down == 1) {
        return;
    } else if (cLeft - speed < borderWidth && left == -1) {
        return;
    } else if (cLeft + speed + borderWidth + cWidth > bodyWidth && right == 1) {
        return;
    }
    // 移动
    character.style.top = cTop + (up + down) * speed - borderWidth + "px";
    character.style.left = cLeft + (left + right) * speed - borderWidth + "px";
}
/*--------------------------------------------------------*/