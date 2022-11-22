import { createRoot, Node } from "./tree.js";
window.onload = function () {
    const wordbox = document.querySelector('.wordbox');
    // 所有单词组成的数组
    let wordArr = [];
    // 获取到本地数据
    let localData = JSON.parse(localStorage.getItem('words'));
    const tree = null
    // 选择文件后的初始化
    selectFile(function (data) {
        // 创建树
        tree = createRoot();
        const wordDOMArr = [];
        // 将单词以存入wordArr数组中
        wordArr = data.trim().split('\n');
        // 将单词全部存入tree树中
        tree.insertTree(wordArr);
        // 将单词封装成DOM结构并渲染在页面
        for (let i = 0; i < wordArr.length; i++) {
            wordDOMArr[i] = `
                <div class="word">
                    ${wordArr[i]}
                    <div class="times"></div>
                </div>
            `
        }
        wordbox.innerHTML = wordDOMArr.join('');
        console.log(wordArr);
        // 对渲染在页面中的单词进行初始化
        for (let key in localData) {
            // 本地数据在单词数组中的索引
            let index = Node.isInTree(key);
            if (index !== false) {
                // 根据访问的次数去改变页面单词背景颜色
                let times = localData[key];
                wordbox.children[index].children[0].innerHTML = times;
                wordbox.children[index].children[0].style.display = 'block';
                if (times >= 7) {
                    wordbox.children[index].style.backgroundColor = `hsl(90,90%,50%)`
                } 
                else if(times == 5){
                    wordbox.children[index].style.backgroundColor = `hsl(60,${15*times}%,75%)`;
                }
                else if(times == 4){
                    wordbox.children[index].style.backgroundColor = `hsl(60,${15*times}%,75%)`;
                }
                else if(times == 3){
                    wordbox.children[index].style.backgroundColor = `hsl(60,${15*times}%,75%)`;
                }
                else if(times == 2){
                    wordbox.children[index].style.backgroundColor = `hsl(60,${15*times}%,75%)`;
                }
                else if(times == 1){
                    wordbox.children[index].style.backgroundColor = `hsl(60,${15*times}%,75%)`;
                }
            }
        }
    });
    searchbox();
    function searchbox() {
        // DOM
        const searchbtn = document.querySelector('.searchbtn');
        const go = document.querySelector('.go');
        const last = go.children[0];
        const current = go.children[1];
        const total = go.children[2];
        const next = go.children[3];
        const searchbox = searchbtn.children[1];
        const textarea = searchbox.children[0];
        const search = searchbox.children[1];
        const notfoundbtn = document.querySelector('.notfoundbtn');
        const notfoundwords = notfoundbtn.children[1]
        // 搜索到的所有单词在wordArr中的索引组成的数组
        let indexsArr = [];
        // 索引组成的数组的索引
        let indexsArrIndex = 0;
        // 当前单词索引
        let curIndex = 0;
        // 当前单词
        let curWordDOM = null;
        // 未搜索到的所有单词组成的数组
        let notfoundDOMArr = [];
        // 搜索
        search.onclick = function () {
            // 初始化current与total
            current.innerHTML = 0;
            total.innerHTML = 0;
            // 先清空上一次搜索到的单词的索引组成的数组
            indexsArr.length = 0;
            // 清空上一次未搜索到单词(DOM)组成的数组
            notfoundDOMArr.length = 0
            // 第二次点搜索将上一次的选中的单词状态变为不选中状态
            if (curWordDOM) {
                curWordDOM.style.outline = `0px solid yellow`
            }
            // 获取到用户输入的单词
            let data = textarea.value;
            let index = 0;
            data = data.trim();
            // 将用户输入的单词转换成数组
            let searchWords = data.split(/[\n]+/);
            // 将一些特殊单词修改为原型
            for(let i = 0; i < searchWords.length; i++){
                // 复数、第三人称单数
                let reg = /ves$/;
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-3)
                    searchWords.push(temp.concat(f));
                    searchWords.push(temp.concat(fe));
                }
                reg = /es$/;
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-2)
                    searchWords.push(temp)
                }
                reg = /s$/;
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-1)
                    searchWords.push(temp)
                }
                // 现在进行时
                reg = /ing$/
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-3)
                    searchWords.push(temp)
                    searchWords.push(temp.slice(0,temp.length-1))
                }
                // 过去时、过去分词
                reg = /ied$/;
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-3)
                    searchWords.push(temp.concat(y));
                }
                reg = /ed$/;
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-2)
                    searchWords.push(temp)
                }
                reg = /d$/;
                if(reg.test(searchWords[i])){
                    let temp = searchWords[i].slice(0,searchWords[i].length-1)
                    searchWords.push(temp)
                }
            }
            // 对用户输入的单词不合理的进行过滤
            searchWords = searchWords.filter(element => {
                let reg = /^\s+$/
                return !reg.test(element);
            })
            // 更新页面 判断用户输入的单词是否在树中有并更新页面中搜索到的单词的次数
            searchWords.forEach(word => {
                index = Node.isInTree(word);
                // 单词在树中
                if (index !== false) {
                    // 将该单词在单词数组中的索引存入索引数组中
                    indexsArr.push(index);
                    // wordArr[index]为单词(字符串)(对应本地存储key值)
                    // 更新本地数据
                    let times = localData[wordArr[index]];
                    if (times) {
                        // 本地有该key值
                        if (times < 999) {
                            times++;
                        }
                    } else {
                        // 本地没有
                        // 将本地该key对应的值设置为1
                        times = 1;
                        // 该单词的次数第一次出现需要设置为block 可见
                        wordbox.children[index].children[0].style.display = 'block';
                    }
                    localData[wordArr[index]] = times;
                    // 更新页面中次数
                    wordbox.children[index].children[0].innerHTML = times;
                } else {
                    // 单词不在树中
                    notfoundDOMArr.push(`<li>${word}</li>`);
                }
            });
            // 更新搜索到的单词总数
            total.innerHTML = indexsArr.length;
            // 如果搜索到单词
            if (indexsArr.length) {
                // 保存到本地
                localStorage.setItem('words', JSON.stringify(localData));
                // 对搜索到的单词的索引进行升序这样下一个上一个跳转有顺序
                indexsArr.sort(function (a, b) {
                    return a - b;
                })
                // 在这里计算当前单词初始值
                // 获取到当前页面上卷的大小
                // 一行单词的占位
                let wordYDistance = wordbox.children[0].offsetTop * 2 + wordbox.children[0].offsetHeight;
                // 一排单词的占位
                let wordXDistance = wordbox.children[0].offsetLeft * 2 + wordbox.children[0].offsetWidth;
                // 当前行最后一个单词索引
                let curLineLastWord = document.documentElement.scrollTop / wordYDistance * parseInt(wordbox.offsetWidth / wordXDistance);
                // 跳转到当前行 距离 搜索到的单词中最近的那个单词
                for (let i = 0; i < indexsArr.length; i++) {
                    // 当前行最后一个单词索引小于索引数组中第一个单词索引
                    if (i == 0 && curLineLastWord <= indexsArr[i]) {
                        // 跳转到的单词
                        curIndex = indexsArr[i];
                        curWordDOM = wordbox.children[curIndex];
                        current.innerHTML = i + 1;
                        document.documentElement.scrollTop = curWordDOM.offsetTop - 200;
                        document.documentElement.scrollLeft = curWordDOM.offsetLeft - 550;
                        // 跳转到的单词在索引数组中的索引
                        indexsArrIndex = i;
                        break;
                    }
                    // 当前行最后一个单词索引大于索引数组中最后一个单词索引
                    else if (i == indexsArr.length - 1 && curLineLastWord >= indexsArr[i]) {
                        curIndex = indexsArr[i];
                        curWordDOM = wordbox.children[curIndex]
                        current.innerHTML = i + 1;
                        document.documentElement.scrollTop = curWordDOM.offsetTop - 200;
                        document.documentElement.scrollLeft = curWordDOM.offsetLeft - 550;
                        indexsArrIndex = i;
                        break;
                    }
                    // 当前行最后一个单词索引在索引数组中前一个单词索引与后一个单词索引之间
                    else if (curLineLastWord > indexsArr[i] && curLineLastWord < indexsArr[i + 1]) {
                        if (curLineLastWord - indexsArr[i] > indexsArr[i + 1] - curLineLastWord) {
                            curIndex = indexsArr[i + 1];
                            curWordDOM = wordbox.children[curIndex]
                            current.innerHTML = i + 2;
                            document.documentElement.scrollTop = curWordDOM.offsetTop - 200;
                            document.documentElement.scrollLeft = curWordDOM.offsetLeft - 550;
                            indexsArrIndex = i + 1;
                            break;
                        } else {
                            curIndex = indexsArr[i];
                            curWordDOM = wordbox.children[curIndex]
                            current.innerHTML = i + 1;
                            document.documentElement.scrollTop = curWordDOM.offsetTop - 200;
                            document.documentElement.scrollLeft = curWordDOM.offsetLeft - 550;
                            indexsArrIndex = i;
                        }
                    }
                }
                if (curWordDOM) {
                    curWordDOM.style.outline = '5px solid yellow';
                }
            }
            // 未搜索到的单词
            notfoundwords.innerHTML = notfoundDOMArr.join('');
            go.style.display = 'block';
        }
        // 上一个
        last.onclick = function () {
            let oldVal = parseInt(current.innerHTML)
            if (oldVal > 1) {
                // 移动到下一个单词前将当前单词的背景颜色复原
                // 当前单词索引
                curIndex = indexsArr[indexsArrIndex]
                // 当前单词
                curWordDOM = wordbox.children[curIndex]
                curWordDOM.style.outline = '0px solid yellow'
                indexsArrIndex--;
                current.innerHTML = oldVal - 1;
                // 跳转到当前单词的位置
                // 当前单词索引
                curIndex = indexsArr[indexsArrIndex]
                // 当前单词
                curWordDOM = wordbox.children[curIndex]
                document.documentElement.scrollTop = curWordDOM.offsetTop - 200;
                document.documentElement.scrollLeft = curWordDOM.offsetLeft - 550;
                curWordDOM.style.outline = '5px solid yellow'
            }
        }
        // 下一个
        next.onclick = function () {
            let oldVal = parseInt(current.innerHTML)
            if (oldVal < parseInt(total.innerHTML)) {
                // 移动到下一个单词前将当前单词的背景颜色复原
                // 当前单词索引
                curIndex = indexsArr[indexsArrIndex]
                // 当前单词
                curWordDOM = wordbox.children[curIndex]
                curWordDOM.style.outline = '0px solid yellow'
                indexsArrIndex++;
                current.innerHTML = parseInt(current.innerHTML) + 1
                // 跳转到当前单词的位置
                // 当前单词索引
                curIndex = indexsArr[indexsArrIndex]
                // 当前单词
                curWordDOM = wordbox.children[curIndex]
                document.documentElement.scrollTop = curWordDOM.offsetTop - 200;
                document.documentElement.scrollLeft = curWordDOM.offsetLeft - 550;
                curWordDOM.style.outline = '5px solid yellow'
            }
        }
    }
}


function selectFile(callback) {
    const inputFile = document.querySelector('#file');
    inputFile.onchange = function (e) {
        let read = new FileReader()
        let file = e.target.files[0]
        read.readAsText(file);
        read.onload = function () {
            // 将读取的文件的结果传给回调
            callback && callback(read.result)
        }
    }
}