const head = document.querySelector('.head');
const container = document.querySelector('.website .container');
function topSite() {
    let data = JSON.parse(localStorage.getItem("topSite"));
    const tempArr = [];
    for (let key in data) {
        if (data[key] == '') {
            data[key] = key;
        }
        tempArr[tempArr.length] =
            `<a href="${key}">
            <div class="moreoperator iconfont icon-gengduo-shuxiang"></div>
            <div class="morebox">
                <div>修改快捷方式</div>
                <div>移除</div>
            </div>
            <div class="rectangle">
                <div class="circle">
                    <img src="${key}/favicon.ico" alt="" onerror="this.src='./image/ip.png';this.onerror=null;" width="24px" height:"24px">
                </div>
                <div class="text">${data[key]}</div>
            </div>
        </a>`;
    }
    tempArr.splice(3, 0, '<div class="addwebsite"><div class="rectangle"><div class="circle  iconfont icon-tianjia"></div><div class="text">添加快捷方式</div></div></div>')
    container.innerHTML = tempArr.join('');
    // 控制是否允许设置morewebsite按钮
    container.ableAddMoreWebsite = 1;
    const allA = document.querySelectorAll('.website a');
    // 给所有a盒子添加所有事件
    allA.forEach((element) => {
        setAEvent(element);
    })
    // 数量超过8个时设置morewebsite按钮
    setMorewebsite();

    const addwebsite = document.querySelector('.website .addwebsite');
    addwebsite.onclick = function () {
        const masklayerBox = document.querySelector('.masklayerbox')
        const form = masklayerBox.children[0].children[0].children[0];
        form.children[0].innerHTML = '添加快捷方式';
        form.children[2].innerHTML =
            `<label for="masklayerbox-input1">名称:</label>
        <input class="masklayerbox-input" id="masklayerbox-input1" type="text">
        <br><br><br>
        <label for="masklayerbox-input2">网址:</label>
        <input class="masklayerbox-input" id="masklayerbox-input2" type="text">
        <button class="masklayerbox-btn">确认</button>`;
        masklayerBox.style.display = 'block';
        // 给确认按钮添加点击事件
        const masklayerboxBtn = document.querySelector('.masklayerbox-btn');
        const masklayerboxInputs = document.querySelectorAll('.masklayerbox-input')
        const masklayerboxInfo = document.querySelector('.masklayerbox-info');
        // 获取本地的url
        let localurls = JSON.parse(localStorage.getItem("topSite"));
        let url = null;
        masklayerboxInputs[1].oninput = function () {
            url = httpFormat(masklayerboxInputs[1].value);
            if (localurls.hasOwnProperty(url)) {
                masklayerboxInfo.style.display = 'block'
            } else {
                masklayerboxInfo.style.display = 'none'
            }
        }
        masklayerboxBtn.onclick = function (event) {
            if(url==null){
                event.preventDefault();
                return;
            }
            // 获取input框中的内容
            let name = masklayerboxInputs[0].value;

            // 本地不存在相同的则保存在本地
            if (!localurls.hasOwnProperty(url)) {
                if (name == '') {
                    name = url;
                }
                // container添加网址
                // 创建一个网址盒子
                let a = document.createElement('a');
                a.href = url;
                a.innerHTML =
                    `<div class="moreoperator iconfont icon-gengduo-shuxiang"></div>
                            <div class="morebox">
                                <div>修改快捷方式</div>
                                <div>移除</div>
                            </div>
                            <div class="rectangle">
                                <div class="circle">
                                    <img src="${url}/favicon.ico" alt="" onerror="this.src='./image/ip.png';this.onerror=null;" width="24px" height:"24px">
                                </div>
                            <div class="text">${name}</div>
                        </div>`;
                // 数量小于4添加在addwebsite按钮前面否则添加在后面
                if (container.children.length < 4) {
                    container.insertBefore(a, container.children[container.children.length - 1]);
                } else {
                    container.appendChild(a);
                }
                // 给a盒子添加所有事件
                setAEvent(a);
                // 添加后数量才超过8个时设置morewebsite按钮
                setMorewebsite();

                // 保存添加后的数据到本地
                data[url] = name;
                localStorage.setItem('topSite', JSON.stringify(data));
                // 隐藏添加盒子(带有遮罩层)
                masklayerBox.style.display = 'none';

            }
            // 阻止表单提交
            event.preventDefault();
        }
    }
}
topSite();


function setMorewebsite() {
    if (container.ableAddMoreWebsite && container.children.length > 8) {
        container.ableAddMoreWebsite = 0;
        let div = document.createElement('div');
        div.className = 'morewebsite';
        div.innerHTML = '<div class="rectangle"><div class="circle  iconfont icon-24gf-ellipsis"></div><div class="text">更多</div></div>';
        container.insertBefore(div, container.children[7]);
        const morewebsite = document.querySelector('.website .morewebsite');
        morewebsite.onclick = function () {
            container.style.height = Math.ceil(container.children.length / 4) * container.children[0].offsetHeight + 'px';
            morewebsite.style.display = 'none'
            container.onmouseleave = function () {
                container.style.height = 2 * container.children[0].offsetHeight + 'px';
                morewebsite.style.display = 'block'
                container.onmouseleave = null;
            }
        }
        let temp = parseInt(getComputedStyle(head, null)['height']) - Math.ceil(container.children.length / 4 - 2) * container.children[0].offsetHeight
        head.style.height = temp + 'px';
        container.style.position = 'absolute';
        container.style.left = '9px';
        container.style.right = '0';
        container.style.height = 2 * container.children[0].offsetHeight + 'px';
    }
}


function setAEvent(element) {
    element.children[0].onclick = function (event) {
        element.children[1].style.display = 'block';
        // 阻止a链接跳转
        event.preventDefault();
    }
    element.children[1].children[0].onclick = function (event) {
        event.preventDefault();
    }
    element.children[1].children[1].onclick = function (event) {
        let index = [].indexOf.call(element.parentNode.children, element)
        let localurlsIndex = index;
        let localurls = JSON.parse(localStorage.getItem('topSite'));
        if(localurlsIndex > 7){
            localurlsIndex-=2;
        }else if(localurlsIndex > 3){
            localurlsIndex--;
        }
        // 将本地topSite对象的属性转换为数组根据localurlsIndex删除对应属性
        for (const key in localurls) {
            if(localurlsIndex == 0){
                delete localurls[key];
            }
            localurlsIndex--;
        }

        // 删除的元素在父节点中下标位置小于4
        if (index < 4) {
            // 修改addwebsite位置
            // 总数量大于4addwebsite按钮移动到下标3的位置
            if (container.children.length > 4) {
                let addwebsite = document.querySelector('.website .addwebsite');
                if (container.children.length > 5) {
                    container.insertBefore(addwebsite, container.children[5]);
                } else {
                    container.appendChild(addwebsite);
                }
            }
        }
        localStorage.setItem('topSite',JSON.stringify(localurls));
        element.parentNode.removeChild(element);
        // 移除后如果长度大于9
        if (container.children.length > 9) {
            // 修改morewebsite位置
            let morewebsite = document.querySelector('.website .morewebsite');
            container.insertBefore(morewebsite, container.children[8]);
        }
        // 移除后如果长度为9则head高度可以随着子元素变化
        if (container.children.length == 9) {
            // 允许添加morewebsite按钮(未添加)
            container.ableAddMoreWebsite = 1;
            container.style.position = 'relative'
            container.style.left = '0';
            container.style.height = 'auto';
            head.style.height = 'auto';
            // 移除更多按钮
            const morewebsite = document.querySelector('.website .morewebsite');
            morewebsite.parentNode.removeChild(morewebsite);
        }
        event.preventDefault();
    }
}
// httpFormat('http://');
// 格式化网址http://xxxx
function httpFormat(url) {
    let result = url;
    let reg = /^https?:\/\//;
    if (!reg.test(url)) {
        result = 'https://' + url;
    }
    return result;
}