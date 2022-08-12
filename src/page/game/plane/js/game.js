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
            createCharacter()     角色初始化返回角色对象
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
import { createRain, moveRain, clearRain } from './effect/rain.js'
import { collide1, collide2, collide3, collide4 } from './collide/collide.js'
import { createCharacter, characterShoot, characterMove } from './character/character.js'
import { addCConvolutionBullet, getCBulletArr, getMBulletArr } from './bullet/bullet.js'
import { addCBullet, addMBullet } from './bullet/bullet.js'
import { bulletIsBoom } from './bullet/bullet.js'
import { clearCBullet, clearMBullet } from './bullet/bullet.js'
import { cBulletMove, mBulletMove } from './bullet/bullet.js'
import { createMonster, monsterShoot, monsterMove, getMonsterArr, clearMonster, clearCreateMonsterTimer } from './monster/monster.js'
import { addScore, outInShowData, sendScore, setScore, updataCurWeapon } from './showData/showData.js'
import { initObstruction, mapArr, obstructArr } from './obstruction/obstruction.js'
import { findRoute } from './findRoute/findRoute.js'
import { fullScreenBombing, hellfire, skills } from './skill/skill.js'
/*----------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------*/
let bulletArr = getCBulletArr();
let bulletMArr = getMBulletArr();
let MonsterArr = getMonsterArr();
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
// 测试
let flag = 1;
export function gameLoad() {
    // 加载地图
    initObstruction();
    // 创建雨滴 单独开启了一个定时器专门创建 返回定时器
    const effects = createRain();
    // 创建角色 此时能控制角色但不能移动
    const character = createCharacter();
    // 每一帧移动单独开启一个定时器
    MoveTimer = setInterval(function () {
        // 改变武器
        if (character.changeWeapon == 1) {
            character.weapon++;
            if (character.weapon >= 2) {
                character.weapon = 0;
            }
            updataCurWeapon(character.weapon);
            character.changeWeapon = 0;
        }
        // 创建怪物
        // if(flag){
        createMonster(1, mapArr);
        // flag = 0;
        // }
        characterMove(mapArr, 3);
        characterShoot(function (flag) {
            if (flag === 1) {
                if (character.weapon == 0) {
                    addCBullet(character);
                } else if (character.weapon == 1) {
                    addCConvolutionBullet(character);
                }
            } else if (flag === 2) {
                // 全屏轰炸
                fullScreenBombing(character,function () {
                    // 先将分数加上
                    addScore(MonsterArr.length);
                    // 清空怪物和怪物的子弹
                    clearMonster();
                    clearMBullet();
                });


            } else if (flag == 3) {
                // 添加地狱火
                hellfire(character);
            }
        });

        cBulletMove(6, function (bullet) {
            //     // 该回调会传入当前遍历到的子弹
            //     // 在这可以添加子弹的特殊效果
            bulletIsBoom(bullet, 25);
        });
        mBulletMove(2, function () { });
        // 雨滴移动
        moveRain();
        monsterMove(character, 1, findRoute, function (monster) {
            monsterShoot(monster, function () {
                addMBullet(monster);
            });
        });


        let gameOver = 0;
        // 碰撞检测
        // 怪物和子弹
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
        // 障碍物和角色子弹
        collide1(obstructArr, bulletArr, function (result) {
            // 去除碰撞后角色子弹
            // 数组去重
            const s2 = [...new Set(result[1])];
            // 降序目的是为了下面使用splice的时候不用考虑数组变化了导致下标对不上
            s2.sort(function (a, b) {
                return b - a;
            })
            for (let i = 0; i < s2.length; i++) {
                document.body.removeChild(bulletArr[s2[i]]);
                bulletArr.splice(s2[i], 1);
            }
        })
        // 障碍物和怪物子弹
        collide1(obstructArr, bulletMArr, function (result) {
            // 去除碰撞后的怪物子弹
            // 数组去重
            const s2 = [...new Set(result[1])];
            // 降序目的是为了下面使用splice的时候不用考虑数组变化了导致下标对不上
            s2.sort(function (a, b) {
                return b - a;
            })
            for (let i = 0; i < s2.length; i++) {
                document.body.removeChild(bulletMArr[s2[i]]);
                bulletMArr.splice(s2[i], 1);
            }
        })
        // 怪物和地狱火
        collide4(skills, MonsterArr, function (result) {
            // 去除碰撞后的怪物子弹
            // 数组去重
            const s2 = [...new Set(result[1])];
            // 降序目的是为了下面使用splice的时候不用考虑数组变化了导致下标对不上
            s2.sort(function (a, b) {
                return b - a;
            })
            for (let i = 0; i < s2.length; i++) {
                document.body.removeChild(MonsterArr[s2[i]]);
                MonsterArr.splice(s2[i], 1);
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
            clearInterval(MoveTimer);
            clearInterval(effects);
            clearCreateMonsterTimer();
            // 发送得分给后台
            sendScore();
            // 弹出结束框
            let gameoverbg = document.querySelector('.gameoverbg');
            gameoverbg.style.display = "block";
            let back = document.querySelector('.gameover button')
            back.onclick = function () {
                // 清除场景
                // 怪物清空
                clearMonster();
                // 怪物子弹清空
                clearMBullet();
                // 角色移除
                let character = document.querySelector('.character');
                document.body.removeChild(character);
                // 角色子弹清空
                clearCBullet();
                // 雨滴清空
                clearRain();
                outInShowData();
                // 分数置零
                setScore();
                let startMenu = document.querySelector('.startMenu');
                gameoverbg.style.display = "none";
                startMenu.style.display = "block";
            }
        }
    }, 30);
}