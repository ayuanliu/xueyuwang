// 引入
/*----------------------------------------------------------------------------------------------------------------*/
/*
    模块
        发送数据
        雨滴特效: 
            createRain()          创建雨滴
            moveRain()            雨滴移动
            clearRain()           清空雨滴           
        碰撞检测:
            collide1            怪物与子弹
            collide2            角色与子弹
            collide3            角色与怪物
        角色:
            characterInit()     角色初始化返回角色对象
            characterShoot()    角色射击
            characterMove()     角色移动
        子弹:
            getCBulletArr       角色子弹
            getMBulletArr       怪物子弹
            addCBullet          添加角色子弹
            addMBullet          添加怪物子弹
            bulletIsBoom        子弹爆裂
            clearCBullet        清空角色子弹
            clearMBullet        清空怪物子弹
            showCBullet         显示角色子弹
            showMBullet         显示怪物子弹
*/
import { sendScore } from './ajax.js'
import { createRain, moveRain, clearRain } from './effect/rain.js'
import { collide1, collide2, collide3 } from './collide/collide.js'
import { characterInit, characterShoot, characterMove } from './character/character.js'
import { getCBulletArr, getMBulletArr } from './bullet/bullet.js'
import { addCBullet, addMBullet } from './bullet/bullet.js'
import { bulletIsBoom } from './bullet/bullet.js'
import { clearCBullet, clearMBullet } from './bullet/bullet.js'
import { cBulletMove, mBulletMove } from './bullet/bullet.js'
import { createMonster, monsterShoot, monsterMove, getMonsterArr } from './monster/monster.js'
import { addScore, getScore, setScore } from './showData/showData.js'
/*----------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------*/
let bulletArr = getCBulletArr();
let bulletMArr = getMBulletArr();
let MonsterArr = getMonsterArr();
/*--------------------------------------------------------*/


/*--------------------------------------------------------*/
export function gameLoad() {

    // 为创建雨滴单独开启一个定时器
    effects = createRain();

    // 创建角色
    var character = characterInit();
    // 角色移动单独开启定时器
    characterControlTimer = character.timer;

    // 每一帧移动单独开启一个定时器
    MoveTimer = setInterval(function () {
        // 创建怪物
        createMonster(5);
        characterMove(3);
        characterShoot(function () {
            addCBullet(character);
        });

        cBulletMove(6, function (bullet) {
            // 该回调会传入当前遍历到的子弹
            // 在这可以添加子弹的特殊效果
            bulletIsBoom(bullet, 25);
        });
        mBulletMove(2, function () { });
        // 雨滴移动
        moveRain();
        monsterMove(character, 1, function (monster) {
            monsterShoot(monster, function () {
                addMBullet(monster);
            });
        });


        let gameOver = 0;
        // 碰撞检测
        collide1(MonsterArr, bulletArr, function (result) {
            // 去除碰撞后的怪物和子弹
            // 数组去重
            const s1 = [...new Set(result[0])];
            const s2 = [...new Set(result[1])];
            // 降序目的是为了下面使用splice的时候不用考虑数组变化了导致下标对不上
            s1.sort(function (a, b) {
                return b - a;
            })
            s2.sort(function (a, b) {
                return b - a;
            })
            for (let i = 0; i < s1.length; i++) {
                document.body.removeChild(MonsterArr[s1[i]]);
                MonsterArr.splice(s1[i], 1);
            }
            for (let i = 0; i < s2.length; i++) {
                document.body.removeChild(bulletArr[s2[i]]);
                bulletArr.splice(s2[i], 1);
                // showScore();
                // 碰到子弹的怪物删除后分数+1
                addScore();
            }
        })
        if (collide2(character, bulletMArr, function () { })) {
            // 结束游戏
            gameOver = 1;
        } else if (collide3(character, MonsterArr, function () { })) {
            // 结束游戏
            gameOver = 1;
        }
        // 游戏结束
        if (gameOver) {
            // 清除所有的定时器
            clearInterval(characterControlTimer);
            clearInterval(MoveTimer);
            clearInterval(effects);
            // 发送得分给后台
            sendScore(getScore());
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
                clearMBullet();
                // 角色移除
                let character = document.querySelector('.character');
                document.body.removeChild(character);
                // 角色子弹清空
                clearCBullet();
                // 雨滴清空
                clearRain();
                // 分数置零
                setScore();
                MonsterArr.length = 0;
                let startMenu = document.querySelector('.startMenu');
                gameoverbg.style.display = "none";
                startMenu.style.display = "block";
            }
        }
    }, 15);
}