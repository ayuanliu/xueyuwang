/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
const size = 50;
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
    character.style.top = document.body.offsetHeight / 2 - character.offsetHeight / 2 + "px";
    character.style.left = document.body.offsetWidth / 2 - character.offsetWidth / 2 + "px";
    character.up = 0;
    character.down = 0;
    character.left = 0;
    character.right = 0;
    character.shootDirectionY = 1;
    character.shootDirectionX = 1;
    character.shootFlag = 0;
    character.weapon = 0;
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
        // console.log(event.keyCode);
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
        if (character.shoot === 2) {
            character.shoot = 0;
        }else if(character.shoot === 3){
            character.shoot = 0;
        }
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
    // 将自身位置左上点映射成数组位置
    let lTX = Math.floor((character.offsetTop - borderWidth) / 50);
    let lTY = Math.floor((character.offsetLeft - borderWidth) / 50);
    // 将自身位置右上点映射成数组位置
    let rTX = Math.floor((character.offsetTop - borderWidth) / 50);
    let rTY = Math.floor((character.offsetLeft + size - borderWidth) / 50);
    // 将自身位置左下点映射成数组位置
    let lBX = Math.floor((character.offsetTop + size - borderWidth) / 50);
    let lBY = Math.floor((character.offsetLeft - borderWidth) / 50);
    // 将自身位置右下点映射成数组位置
    let rBX = Math.floor((character.offsetTop + size - borderWidth) / 50);
    let rBY = Math.floor((character.offsetLeft + size - borderWidth) / 50);
    // 如果到达边界则不能移动
    if (character.offsetTop - speed < borderWidth && character.up == -1) {
        return;
    } else if (character.offsetTop + speed + borderWidth + character.offsetHeight > document.body.offsetHeight && character.down == 1) {
        return;
    } else if (character.offsetLeft - speed < borderWidth && character.left == -1) {
        return;
    } else if (character.offsetLeft + speed + borderWidth + character.offsetWidth > document.body.offsetWidth && character.right == 1) {
        return;
    }
    // 如果进入障碍物则不能移动并且回退
    // 障碍物只会在边界内
    if (lTX >= 0 && lTX < 12 && lTY >= 0 && lTY < 23) {
        if (disableMove(lTX, lTY)) {
            return;
        }
        if (disableMove(rTX, rTY)) {
            return;
        }
        if (disableMove(lBX, lBY)) {
            return;
        }
        if (disableMove(rBX, rBY)) {
            return;
        }
    }
    function disableMove(pointX, pointY) {
        // 向上
        if (character.up == -1) {
            // 进行虚拟向上
            let x = Math.floor((character.offsetTop - borderWidth - speed) / 50);
            if (x > 0 && mapArr[x][pointY] == 1) {
                return true;
            }
        }
        // 向下
        if (character.down == 1) {
            // 进行虚拟向下
            let x = Math.floor((character.offsetTop + size - borderWidth + speed) / 50);
            if (x > 0 && mapArr[x][pointY] == 1) {
                return true;
            }
        }
        // 向左
        if (character.left == -1) {
            // 进行虚拟向左
            let y = Math.floor((character.offsetLeft - borderWidth - speed) / 50);
            if (y >= 0 && mapArr[pointX][y] == 1) {
                return true;
            }
        }
        // 向右
        if (character.right == 1) {
            // 进行虚拟向右
            let y = Math.floor((character.offsetLeft + size - borderWidth + speed) / 50);
            if (y > 0 && mapArr[pointX][y] == 1) {
                return true;
            }
        }
        return false;
    }
    character.style.top = character.offsetTop + (character.up + character.down) * speed - borderWidth + "px";
    character.style.left = character.offsetLeft + (character.left + character.right) * speed - borderWidth + "px";
}
/*--------------------------------------------------------*/