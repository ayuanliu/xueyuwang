// 将本地网址数据展示在页面中
// 立即执行函数
(function () {
    const head = document.querySelector('.main .head');
    const container = document.querySelector('.website .container');
    let data = JSON.parse(localStorage.getItem("topSite"));
    const tempArr = [];
    for (let key in data) {
        // 网址对应的名字为空则将给该网址一个默认的名称
        if (data[key] == '') {
            data[key] = key;
        }
        // 将本地网址封装成DOM结构   
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
    // 固定添加按钮放在第四个位置
    tempArr.splice(3, 0, '<div class="addwebsite"><div class="rectangle"><div class="circle  iconfont icon-tianjia"></div><div class="text">添加快捷方式</div></div></div>')
    container.innerHTML = tempArr.join('');
    /**************************************************************************/
    // 控制是否允许设置morewebsite按钮
    container.ableAddMoreWebsite = 1;
    const allA = document.querySelectorAll('.website a');
    // 给上面所有a盒子中的所有元素添加各种事件
    allA.forEach((element) => {
        setAEvent(element);
    })
    // 是否创建morewebsite按钮
    ifMoreWebsite();
    // 添加快捷方式盒子
    addWebsitebox();
    // 添加快捷方式按钮
    const addwebsite = document.querySelector('.website .addwebsite');
    addwebsite.onclick = function () {
        const addWebsitebox = document.querySelector('.addWebsitebox')
        addWebsitebox.style.display = 'block';
    }
    // 是否显示morewebsite按钮 
    // 展示在页面中的快捷方式数量超过8个时创建morewebsite按钮
    function ifMoreWebsite() {
        if (container.ableAddMoreWebsite && container.children.length > 8) {
            container.ableAddMoreWebsite = 0;
            let div = document.createElement('div');
            div.className = 'morewebsite';
            div.innerHTML = '<div class="rectangle"><div class="circle  iconfont icon-24gf-ellipsis"></div><div class="text">更多</div></div>';
            container.insertBefore(div, container.children[7]);
            const morewebsite = container.children[7];
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
            // 这里之所以为9 absolute的时候auto相对于body而不是head
            container.style.left = '9px';
            container.style.right = '0';
            container.style.height = 2 * container.children[0].offsetHeight + 'px';
        }
    }
    // 给网站快捷方式添加事件 点击事件...
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
            if (localurlsIndex > 7) {
                localurlsIndex -= 2;
            } else if (localurlsIndex > 3) {
                localurlsIndex--;
            }
            // 将本地topSite对象的属性转换为数组根据localurlsIndex删除对应属性
            for (const key in localurls) {
                if (localurlsIndex == 0) {
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
            localStorage.setItem('topSite', JSON.stringify(localurls));
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
    function addWebsitebox() {
        const addWebsitebox = document.querySelector('.addWebsitebox')
        const form = addWebsitebox.children[0].children[0];
        const close = addWebsitebox.children[0].children[1];
        const info = form.children[1]
        const input1 = form.children[2].children[1]
        const input2 = form.children[2].children[6];
        const addBtn = form.children[2].children[7];
        let data = JSON.parse(localStorage.getItem("topSite"));
        // 获取本地的url
        let localurls = data;
        let url = null;
        input2.oninput = function () {
            url = httpFormat(input2.value);
            if (localurls.hasOwnProperty(url)) {
                info.style.display = 'block'
            } else {
                info.style.display = 'none'
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
        }
        addBtn.onclick = function (event) {
            if (url == null || url == 'https://') {
                event.preventDefault();
                return;
            }
            // 获取input1框中的内容
            let name = input1.value;
            // 本地不存在相同的则保存在本地
            if (!localurls.hasOwnProperty(url)) {
                // 本地url更新localurls更新
                input1.value = null;
                input2.value = null;
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
                ifMoreWebsite();

                // 保存添加后的数据到本地
                data[url] = name;
                localStorage.setItem('topSite', JSON.stringify(data));
                // 隐藏添加盒子(带有遮罩层)
                addWebsitebox.style.display = 'none';
            }
            // 阻止表单提交
            event.preventDefault();
        }
        close.onclick = function () {
            addWebsitebox.style.display = 'none';
        }
    }
})();