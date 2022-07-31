/*--------------------------------------------------------*/
/*
    body部分
        borderWidth 边框的大小      
*/
const borderWidth = parseInt(getComputedStyle(document.body)['border-width']);
/*--------------------------------------------------------*/
let character = null;
// 角色初始化
/*--------------------------------------------------------*/
/*
    返回角色对象
*/
export function characterInit() {
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
    character.timer = setInterval(function () {
        control(character);
    }, 10);
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
function control(obj) {
    // 在这进行所有的游戏
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
                obj.shoot = 1;
                break;
            case 80:
                alert("暂停");
                break;
        }

    }
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
        }
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
        callback&&callback();
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
export function characterMove(speed) {
    /*  obj.style.top为不包括定位元素边框的垂直距离
        obj.offsetTop为包括定位元素边框的垂直距离
        为了统一使用减去边框的值
    */
    // 如果到达边界则不能移动
    if (character.offsetTop <= borderWidth && character.up == -1) {
        return;
    } else if (character.offsetTop + borderWidth + character.offsetHeight >= document.body.offsetHeight && character.down == 1) {
        return;
    } else if (character.offsetLeft <= borderWidth && character.left == -1) {
        return;
    } else if (character.offsetLeft + borderWidth + character.offsetWidth >= document.body.offsetWidth && character.right == 1) {
        return;
    }
    character.style.top = character.offsetTop + (character.up + character.down) * speed - borderWidth + "px";
    character.style.left = character.offsetLeft + (character.left + character.right) * speed - borderWidth + "px";
}
/*--------------------------------------------------------*/