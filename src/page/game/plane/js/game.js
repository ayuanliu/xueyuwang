// 按键
/*--------------------------------------------------------*/
/*
    参数:
        obj 角色
*/
function characterControl(obj) {
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
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
// 菜单初始化
/*--------------------------------------------------------*/
function menuInit() {
    var menu = document.createElement("div");
    menu.className = "menu";
    menu.score = 0;
    menu.innerHTML = "<div class='scorebox'>" +
        "<div class='sc'>分数:</div>" +
        "<div class='score'>" + menu.score + "</div>" +
        "</div>";
    document.body.appendChild(menu);
    return menu;
}
/*--------------------------------------------------------*/
// 角色初始化
/*--------------------------------------------------------*/
function characterInit() {
    var character = document.createElement("div");
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
    return character;
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
function characterMove(obj, speed, up, down, left, right) {
    /*  obj.style.top为不包括定位元素边框的垂直距离
        obj.offsetTop为包括定位元素边框的垂直距离
        为了统一使用减去边框的值
    */
    // 如果到达边界则不能移动
    if (obj.offsetTop <= borderWidth && up == -1) {
        return;
    } else if (obj.offsetTop + borderWidth + obj.offsetHeight >= document.body.offsetHeight && down == 1) {
        return;
    } else if (obj.offsetLeft <= borderWidth && left == -1) {
        return;
    } else if (obj.offsetLeft + borderWidth + obj.offsetWidth >= document.body.offsetWidth && right == 1) {
        return;
    }
    obj.style.top = obj.offsetTop + (up + down) * speed - borderWidth + "px";
    obj.style.left = obj.offsetLeft + (left + right) * speed - borderWidth + "px";
    let gameOver = 0;
    // 碰撞检测
    for (var i = 0; i < bulletMArr.length; i++) {
        // 判断怪物发射的子弹都碰撞到角色
        if (obj.offsetTop < bulletMArr[i].offsetTop &&
            obj.offsetTop + obj.offsetHeight > bulletMArr[i].offsetTop &&
            obj.offsetLeft < bulletMArr[i].offsetLeft &&
            obj.offsetLeft + obj.offsetWidth > bulletMArr[i].offsetLeft) {
            // 清除所有的定时器
            // 角色移动
            clearInterval(characterControlTimer);
            // 怪物移动
            clearInterval(MoveTimer);
            // 雨滴特效
            clearInterval(effects);
            // 结束游戏
            gameOver = 1;
        }
    }
    // 碰撞检测
    for (var i = 0; i < MonsterArr.length; i++) {
        // 判断在怪物碰撞到角色
        if (obj.offsetTop < MonsterArr[i].offsetTop + MonsterArr[i].offsetHeight &&
            obj.offsetTop + obj.offsetHeight > MonsterArr[i].offsetTop &&
            obj.offsetLeft < MonsterArr[i].offsetLeft + MonsterArr[i].offsetWidth &&
            obj.offsetLeft + obj.offsetWidth > MonsterArr[i].offsetLeft) {
            // 清除所有的定时器
            clearInterval(characterControlTimer);
            clearInterval(MoveTimer);
            clearInterval(effects);
            // 结束游戏
            gameOver = 1;
        }
    }
    // 游戏结束
    if (gameOver) {
        // 弹出结束框
        let gameoverbg = document.querySelector('.gameoverbg');
        gameoverbg.style.display = "block";
        let back = document.querySelector('.gameover button')
        back.onclick = function () {
            // 清除场景
            // 怪物清空
            for (let i = 0; i < MonsterArr.length; i++) {
                document.body.removeChild(MonsterArr[i]);
            }
            // 怪物子弹清空
            for (let i = 0; i < bulletMArr.length; i++) {
                document.body.removeChild(bulletMArr[i]);
            }
            // 角色移除
            let character = document.querySelector('.character');
            document.body.removeChild(character);
            // 角色子弹清空
            for (let i = 0; i < bulletArr.length; i++) {
                document.body.removeChild(bulletArr[i]);
            }
            // 雨滴清空
            for(let i = 0; i < rainArr.length; i++){
                document.body.removeChild(rainArr[i]);
            }
            MonsterArrnum = 0;
            bulletArr.num = 0;
            bulletMArr.num = 0;
            rainArr.num = 0;
            MonsterArr.length = 0;
            bulletMArr.length = 0;
            bulletArr.length = 0;
            rainArr.length = 0;
            let startMenu = document.querySelector('.startMenu');
            gameoverbg.style.display = "none";
            startMenu.style.display = "block";
        }
    }
}
/*--------------------------------------------------------*/
// 角色攻击
/*--------------------------------------------------------*/
/*
    参数:
        obj: 角色
*/
function characterShoot(obj, bulletArr) {
    if (obj.shoot) {
        addbullet(obj, bulletArr);
    }
}
/*
    参数:
        obj: 角色
*/
function addbullet(obj, bulletArr) {
    // 判断是否能添加子弹
    if (!obj.shootFlag) {
        obj.shootFlag = 1;
        // 开启定时器
        var timer = setInterval(function () {
            // 创建一个子弹并添加进数组方便管理
            var bullet = document.createElement("div");
            bullet.className = "bullet";
            document.body.appendChild(bullet);
            // 根据角色当前位置以及方向创建子弹 给每个子弹加定时器用于爆炸
            if (obj.shootDirectionY == -1 && obj.shootDirectionX == -1) {
                bullet.DirectionY = -1;
                bullet.DirectionX = -1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionY == -1 && obj.shootDirectionX == 1) {
                bullet.DirectionY = -1;
                bullet.DirectionX = 1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 + obj.offsetWidth / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
            } else if (obj.shootDirectionY == 1 && obj.shootDirectionX == -1) {
                bullet.DirectionY = 1;
                bullet.DirectionX = -1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 + obj.offsetHeight / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 * (1 - Math.sqrt(2) / 2) - bullet.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionY == 1 && obj.shootDirectionX == 1) {
                bullet.DirectionY = 1;
                bullet.DirectionX = 1;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 + obj.offsetHeight / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 + obj.offsetWidth / 2 * Math.sqrt(2) / 2 - borderWidth + "px";
            } else if (obj.shootDirectionX == 1) {
                bullet.DirectionX = 1;
                bullet.DirectionY = 0;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 - bullet.offsetHeight / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionX == -1) {
                bullet.DirectionX = -1;
                bullet.DirectionY = 0;
                bullet.style.top = obj.offsetTop + obj.offsetHeight / 2 - bullet.offsetHeight / 2 - borderWidth + "px";
                bullet.style.left = obj.offsetLeft - bullet.offsetWidth - borderWidth + "px";
            } else if (obj.shootDirectionY == 1) {
                bullet.DirectionY = 1;
                bullet.DirectionX = 0;
                bullet.style.top = obj.offsetTop + obj.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 - bullet.offsetWidth / 2 - borderWidth + "px";
            } else if (obj.shootDirectionY == -1) {
                bullet.DirectionY = -1;
                bullet.DirectionX = 0;
                bullet.style.top = obj.offsetTop - bullet.offsetHeight - borderWidth + "px";
                bullet.style.left = obj.offsetLeft + obj.offsetWidth / 2 - bullet.offsetWidth / 2 - borderWidth + "px";
            }
            bulletArr[bulletArr.num++] = bullet;
            obj.shootFlag = 0;
            clearInterval(timer);
        }, 100);
    }
}
/*--------------------------------------------------------*/
// 创建怪物
/*--------------------------------------------------------*/
/*
    参数:
        Monsternum: 一次出现怪物最多个数为(Monsternum+1)
*/
function createMonster(Monsternum) {
    if (!MonsterFlag) {
        MonsterFlag = 1;
        var timer = setInterval(function () {
            // 创建一个怪物放置在随机位置(距离边界200px)并添加进数组方便管理
            for (var i = 0; i < Math.round(Math.random() * Monsternum) + 1; i++) {
                MonsterSetDirection = Math.round(Math.random() * 3);
                var monster = document.createElement("div");
                var bgcSelect = Math.round(Math.random() * 3);
                if (bgcSelect == 0) {
                    monster.className = "monster1";
                } else if (bgcSelect == 1) {
                    monster.className = "monster2";
                } else if (bgcSelect == 2) {
                    monster.className = "monster3";
                } else if (bgcSelect == 3) {
                    monster.className = "monster4";
                }
                document.body.appendChild(monster);

                // 分为4区域产怪
                if (MonsterSetDirection == 0) {
                    monster.style.top = Math.round(Math.random() * 10) / 10 * MonsterArea + "px";
                    monster.style.left = Math.round(Math.random() * (document.body.offsetWidth - monster.offsetWidth - 2 * borderWidth)) + "px";
                } else if (MonsterSetDirection == 1) {
                    monster.style.left = Math.round(Math.random() * 10) / 10 * MonsterArea + (document.body.offsetWidth - MonsterArea - monster.offsetWidth - 2 * borderWidth) + "px";
                    monster.style.top = Math.round(Math.random() * (document.body.offsetHeight - monster.offsetHeight - 2 * borderWidth)) + "px";
                } else if (MonsterSetDirection == 2) {
                    monster.style.top = Math.round(Math.random() * 10) / 10 * MonsterArea + (document.body.offsetHeight - MonsterArea - monster.offsetWidth - 2 * borderWidth) + "px";
                    monster.style.left = Math.round(Math.random() * (document.body.offsetWidth - monster.offsetWidth - 2 * borderWidth)) + "px";
                } else if (MonsterSetDirection == 3) {
                    monster.style.left = Math.round(Math.random() * 10) / 10 * MonsterArea + "px";
                    monster.style.top = Math.round(Math.random() * (document.body.offsetHeight - monster.offsetHeight - 2 * borderWidth)) + "px";
                }
                MonsterArr[MonsterArrnum++] = monster;
            }
            MonsterFlag = 0;
            clearInterval(timer);
        }, 2000);
    }
}
/*--------------------------------------------------------*/
// 显示接口
/*--------------------------------------------------------*/
function show(character, speedBullet, bulletArr, speedMonster) {
    showBullet(speedBullet, bulletArr, function (bulletArr) {
        bulletIsBoom(bulletArr, 25);
    });
    showMonster(character, speedMonster, function (monster) {
        showMBullet(monster);
    });
    showBullet(2, bulletMArr);
}
/*--------------------------------------------------------*/
// 显示分数
/*--------------------------------------------------------*/
function showScore() {
    menuScore.nodeValue++;
}
/*--------------------------------------------------------*/
// 显示怪物
/*--------------------------------------------------------*/
/*
    参数:
        speedMonster: 怪物移动速度
*/
function showMonster(character, speedMonster, callback) {
    for (var i = 0; i < MonsterArr.length; i++) {
        MonsterArr[i].shootDirectionX = 0;
        MonsterArr[i].shootDirectionY = 0;
        // 怪物移动
        // 向上移动
        if (MonsterArr[i].offsetTop - character.offsetHeight / 2 + MonsterArr[i].offsetHeight / 2 > character.offsetTop) {
            MonsterArr[i].style.top = MonsterArr[i].offsetTop - borderWidth - speedMonster + "px";
            MonsterArr[i].shootDirectionY = -1;
        }
        // 向下移动
        if (MonsterArr[i].offsetTop - character.offsetHeight / 2 + MonsterArr[i].offsetHeight / 2 < character.offsetTop) {
            MonsterArr[i].style.top = MonsterArr[i].offsetTop - borderWidth + speedMonster + "px";
            MonsterArr[i].shootDirectionY = 1;
        }
        // 向左移动
        if (MonsterArr[i].offsetLeft - character.offsetWidth / 2 + MonsterArr[i].offsetWidth / 2 > character.offsetLeft) {
            MonsterArr[i].style.left = MonsterArr[i].offsetLeft - borderWidth - speedMonster + "px";
            MonsterArr[i].shootDirectionX = -1;
        }
        // 向右移动
        if (MonsterArr[i].offsetLeft - character.offsetWidth / 2 + MonsterArr[i].offsetWidth / 2 < character.offsetLeft) {
            MonsterArr[i].style.left = MonsterArr[i].offsetLeft - borderWidth + speedMonster + "px";
            MonsterArr[i].shootDirectionX = 1;
        }

        if (MonsterArr[i].shootDirectionY == -1) {
            if (MonsterArr[i].shootDirectionX == -1) {
                MonsterArr[i].style.transform = 'rotate(180deg)';
            } else if (MonsterArr[i].shootDirectionX == 0) {
                MonsterArr[i].style.transform = 'rotate(-135deg)';
            }
            else if (MonsterArr[i].shootDirectionX == 1) {
                MonsterArr[i].style.transform = 'rotate(-90deg)';
            }
        } else if (MonsterArr[i].shootDirectionY == 0) {
            if (MonsterArr[i].shootDirectionX == -1) {
                MonsterArr[i].style.transform = 'rotate(135deg)';
            } else if (MonsterArr[i].shootDirectionX == 0) {
                MonsterArr[i].style.transform = 'rotate(0deg)';
            }
            else if (MonsterArr[i].shootDirectionX == 1) {
                MonsterArr[i].style.transform = 'rotate(-45deg)';
            }
        } else if (MonsterArr[i].shootDirectionY == 1) {
            if (MonsterArr[i].shootDirectionX == -1) {
                MonsterArr[i].style.transform = 'rotate(90deg)';
            } else if (MonsterArr[i].shootDirectionX == 0) {
                MonsterArr[i].style.transform = 'rotate(45deg)';
            }
            else if (MonsterArr[i].shootDirectionX == 1) {
                MonsterArr[i].style.transform = 'rotate(0deg)';
            }
        }



        // 怪物攻击
        callback && callback(MonsterArr[i]);
        if (collide(MonsterArr, i, bulletArr)) {
            i--;
        }
    }
}
/*--------------------------------------------------------*/
// 子弹爆炸而且只爆炸1次
/*
    参数:
        bulletArr 子弹
        boom 多远爆炸
*/
/*--------------------------------------------------------*/
function bulletIsBoom(bulletArr, boom) {
    if (bulletArr.boom == undefined) {
        bulletArr.boom = boom;
    }
    if (bulletArr.boom > 0) {
        bulletArr.boom--;
    }
    if (!bulletArr.boom) {
        bulletArr.boom = -1;
        // 爆裂 添加两个子弹 这里如果放在 判断子弹是否抵达边界下边则会出问题因为i--了指向的是上一个 for循环先执行完在i++
        if (bulletArr.DirectionY == -1) {
            if (bulletArr.DirectionX == -1) {
                bulletBoom(bulletArr, -1, 0, 0, -1);
            } else if (bulletArr.DirectionX == 0) {
                bulletBoom(bulletArr, -1, -1, -1, 1);
            } else if (bulletArr.DirectionX == 1) {
                bulletBoom(bulletArr, -1, 0, 0, 1);
            }
        } else if (bulletArr.DirectionY == 0) {
            if (bulletArr.DirectionX == -1) {
                bulletBoom(bulletArr, -1, -1, 1, -1);
            } else if (bulletArr.DirectionX == 0) {

            } else if (bulletArr.DirectionX == 1) {
                bulletBoom(bulletArr, 1, 1, -1, 1);
            }
        } else if (bulletArr.DirectionY == 1) {
            if (bulletArr.DirectionX == -1) {
                bulletBoom(bulletArr, 0, -1, 1, 0);
            } else if (bulletArr.DirectionX == 0) {
                bulletBoom(bulletArr, 1, -1, 1, 1);
            } else if (bulletArr.DirectionX == 1) {
                bulletBoom(bulletArr, 1, 0, 0, 1);
            }
        }
    }
}
/* 
    子弹爆裂
        参数:
            currentBullet 要爆裂的当前子弹
            directionY1 爆裂后的第一个子弹的Y轴运动方向
            directionX1 爆裂后的第一个子弹的X轴运动方向
            directionY2 爆裂后的第二个子弹的Y轴运动方向
            directionX2 爆裂后的第二个子弹的X轴运动方向
*/
function bulletBoom(currentBullet, directionY1, directionX1, directionY2, directionX2) {
    // 爆裂后的
    var bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.boom = -1;
    bullet.DirectionY = directionY1;
    bullet.DirectionX = directionX1;
    document.body.appendChild(bullet);
    bullet.style.top = currentBullet.offsetTop + "px";
    bullet.style.left = currentBullet.offsetLeft + "px";
    bulletArr.push(bullet);
    bulletArr.num++;

    bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.boom = -1;
    bullet.DirectionY = directionY2;
    bullet.DirectionX = directionX2;
    document.body.appendChild(bullet);
    bullet.style.top = currentBullet.offsetTop + "px";
    bullet.style.left = currentBullet.offsetLeft + "px";
    bulletArr.push(bullet);
    bulletArr.num++;
}
/*--------------------------------------------------------*/
// 怪物攻击
/*
    参数: 
        monster 怪物
*/
function showMBullet(monster) {
    if (monster.shootTimer == undefined) {
        monster.shootTimer = 250;
    }
    if (monster.shootTimer > 0) {
        monster.shootTimer--;
    } else {
        monster.shootTimer = 250;
        // 根据怪物移动方向进行攻击
        monster.shootFlag = 0;
        addbullet(monster, bulletMArr);
    }
}
// 碰撞检测
function collide(objArr, num, bulletArr) {
    // 碰撞检测
    for (var i = 0; i < bulletArr.length; i++) {
        // 先判断在怪物上面的子弹都未碰撞
        if (objArr[num].offsetTop < bulletArr[i].offsetTop &&
            objArr[num].offsetTop + objArr[num].offsetHeight > bulletArr[i].offsetTop &&
            objArr[num].offsetLeft < bulletArr[i].offsetLeft &&
            objArr[num].offsetLeft + objArr[num].offsetWidth > bulletArr[i].offsetLeft) {
            // 删除子弹和怪物
            document.body.removeChild(objArr[num]);
            document.body.removeChild(bulletArr[i]);
            objArr.splice(num, 1);
            bulletArr.splice(i, 1);
            MonsterArrnum--;
            bulletArr.num--;
            showScore();
            return true;
        }
    }
    return false;
}
// 雨滴移动
function rainMove() {
    for (var i = 0; i < rainArr.length; i++) {
        rainArr[i].style.top = rainArr[i].offsetTop - borderWidth + 10 + "px";
        if (rainArr[i].offsetTop + borderWidth + rainArr[i].offsetHeight > document.body.offsetHeight) {
            document.body.removeChild(rainArr[i]);
            rainArr.splice(i, 1);
            i--;
            rainArr.num--;
        }
    }
}