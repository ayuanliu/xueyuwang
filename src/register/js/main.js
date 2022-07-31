window.onload = function () {
    // document.body.style.zoom = 0.8;
    verifyFormat();
}
// 验证账号与密码的格式等
function verifyFormat() {
    let UserName = document.querySelector('#UserName');
    let PassWord = document.querySelector('#PassWord');
    let confirm = document.querySelector('#confirm');
    let loadIn = document.querySelector('#loadIn');
    let loadingInfo = document.querySelector('#loadingInfo');
    let curAbleRegister = [0, 0, 0];
    UserName.onfocus = function () {
        this.placeholder = '';
        this.autocomplete = 'off';
        matchReg(1, this.value);
        loadingInfo.style.display = 'block';
    }
    UserName.onblur = function () {
        // 在这验证账号的格式是否正确
        this.placeholder = '请输入账号';
        loadingInfo.style.display = 'none';
    }
    UserName.oninput = function () {
        curAbleRegister[0] = matchReg(1, this.value);
    }
    PassWord.onfocus = function () {
        this.placeholder = '';
        matchReg(2, this.value);
        loadingInfo.style.display = 'block';
    }
    PassWord.onblur = function () {
        // 在这验证密码的格式是否正确
        this.placeholder = '请输入密码';
        loadingInfo.style.display = 'none';
    }
    PassWord.oninput = function () {
        curAbleRegister[1] = matchReg(2, this.value);
        // 密码格式正确还需要验证两次的密码是否一致
        if (curAbleRegister[1]) {
            if (confirm.value !== PassWord.value) {
                curAbleRegister[2] = 0;
            } else {
                curAbleRegister[2] = 1;
            }
        }
    }
    confirm.onfocus = function () {
        this.placeholder = '';
        if (confirm.value != '') {
            if (PassWord.value == confirm.value) {
                loadingInfo.style.color = 'green';
                loadingInfo.innerHTML = '密码一致';
            } else {
                loadingInfo.style.color = 'red';
                loadingInfo.innerHTML = '两次密码不一致';
            }
        } else {
            loadingInfo.style.color = 'red';
            loadingInfo.innerHTML = '请确认密码';
        }
        loadingInfo.style.display = 'block';
    }
    confirm.onblur = function () {
        this.placeholder = '请确认密码';
        loadingInfo.style.display = 'none';
    }
    confirm.oninput = function () {
        if (confirm.value != '') {
            if (PassWord.value == confirm.value) {
                loadingInfo.style.color = 'green';
                loadingInfo.innerHTML = '密码一致';
                curAbleRegister[2] = 1;
            } else {
                loadingInfo.style.color = 'red';
                loadingInfo.innerHTML = '两次密码不一致';
                curAbleRegister[2] = 0;
            }
        } else {
            loadingInfo.style.color = 'red';
            loadingInfo.innerHTML = '请确认密码';
        }
    }
    loadIn.onclick = function () {
        for (let i = 0; i < curAbleRegister.length; i++) {
            if (curAbleRegister[i] == 0) {
                if (i == 0) {
                    loadingInfo.innerHTML = '账号必须为8-10位数字,且1或2开头';
                    loadingInfo.style.color = 'red';
                    loadingInfo.style.display = 'block';
                    return;
                } else if (i == 1) {
                    loadingInfo.innerHTML = '密码必须以字母开头,且10-12位';
                    loadingInfo.style.color = 'red';
                    loadingInfo.style.display = 'block';
                    return;
                } else if (i == 2) {
                    loadingInfo.innerHTML = '两次密码不一致';
                    loadingInfo.style.color = 'red';
                    loadingInfo.style.display = 'block';
                    return;
                }
            }
        }
        let uName = UserName.value;
        let pW = PassWord.value;
        const p = new Promise((resolve, reject) => {
            // 注册
            sendAJAX('GET', '/users', undefined, function (result) {
                let users = JSON.parse(result.data);
                for (let i = 0; i < users.length; i++) {
                    if (uName === users[i].uName) {
                        console.log('账号已存在');
                        return;
                    }
                }
                resolve();
            })
        });
        p.then((value) => {
            // 发送POST请求
            sendAJAX('POST', '/users', `id=&uName=${uName}&pW=${pW}`, function () {
                console.log('注册成功');
            })
        })
    }
}
/*
    参数
        flag            表示正则匹配的是账号还是密码等等
        val             表示要匹配的值
    返回值
        0               表示当前类型格式不正确
        1               表示当前类型格式正确
*/
function matchReg(flag, val) {
    let loadingInfo = document.querySelector('#loadingInfo');
    switch (flag) {
        case 1:
            var rg = /^[12][0-9]{7,9}$/;
            if (rg.test(val)) {
                loadingInfo.style.color = 'green';
                loadingInfo.innerHTML = '账号格式正确';
                return flag;
            } else {
                loadingInfo.style.color = 'red';
                loadingInfo.innerHTML = '账号必须为8-10位数字,且1或2开头';
                return 0;
            }
        case 2:
            var rg = /^[a-zA-z][\S]{9,11}$/;
            if (rg.test(val)) {
                loadingInfo.style.color = 'green';
                loadingInfo.innerHTML = '密码格式正确';
                return flag;
            } else {
                loadingInfo.style.color = 'red';
                loadingInfo.innerHTML = '密码必须以字母开头,且10-12位';
                return 0;
            }
    }
}