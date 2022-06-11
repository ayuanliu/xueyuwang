// 对树进行操作
// 构建树
/* 
    跟踪节点用来跟踪当前位置
    功能:
        修改原型对象中的数据
*/
var protoPtr = Tree.prototype;
// 记录每层最大子节点的个数
var maxChildNumList = new Array();


function Tree(nodeValue) {
    // new Tree()之后就是一个根节点根节点只做连接节点使用
    this.prevNode = null;           //上一个节点
    this.nextNode = new Array();    //用来存放子节点的数组
    this.index = 0;                 //索引
    this.addNode = addNode;         //添加节点函数
    this.nodeValue = nodeValue;     //添加的节点的具体内容
    this.getParent = getParent;       //flag == 1指向父节点同时修改depth
    this.curDepth = 0;          //当前节点的深度
    this.curChildNum = 0;       //当前节点子节点的个数
    this.curOrder = 0;              //当前节点在父节点中的位置
    this.order = 0;                 //当前节点在当前层中的序号
}

// 该函数有一个回调函数并且会将当前遍历的节点作为参数传进
// 后续遍历树this指向调用者先从左往右遍历子节点再遍历父节点(该遍历不包括根节点)
// objPause表示暂停遍历1表示暂停
Tree.prototype.readTree = function (callback) {
    if (arguments.length == 1) {
        if (this.nextNode == 0) {
            return;
        }
        for (let i = 0; i < this.nextNode.length; i++) {
            callback && callback(this.nextNode[i]);
            this.nextNode[i].readTree(callback);
        }
    }
}

// 将树转换为数组
Tree.prototype.getArr = function () {
    var readTreeArr = new Array();
    var i = 0;
    this.readTree((curNode) => {
        readTreeArr[i++] = curNode;
    });
    return readTreeArr;
}

// 逐层遍历树计算每层中最大子节点数
Tree.prototype.getMaxChildNumList = function () {
    this.readTree((curNode) => {
        // 将父节点最大子节点个数添加进数组中
        maxChildNumList[this.curDepth] = this.curChildNum;
        // 如果当前层maxChildNumList为undefined则初始化该层数据为0
        if (maxChildNumList[curNode.curDepth] == undefined) {
            maxChildNumList[curNode.curDepth] = 0;
        }
        if (maxChildNumList[curNode.curDepth] < curNode.curChildNum) {
            maxChildNumList[curNode.curDepth] = curNode.curChildNum
        }
    });
    // 返回每层子节点最大的个数
    return maxChildNumList;
}


var nodeOrderArr = new Array();
// 计算每个节点在当前层的序号并将值给该节点
Tree.prototype.setOrder = function () {
    this.readTree(function (curNode) {
        if (nodeOrderArr[curNode.curDepth] == undefined) {
            nodeOrderArr[curNode.curDepth] = 0;
        }
        nodeOrderArr[curNode.curDepth] = curNode.prevNode.order * maxChildNumList[curNode.prevNode.curDepth] + curNode.curOrder;
        curNode.order = nodeOrderArr[curNode.curDepth];
    })
}

// 经过操作后当前节点在树中深度
// 每添加一个节点都会使得depth++;
// 每调用会使得depth--;
Tree.prototype.depth = {
    value: 0
};




// 添加一个节点进树该节点会指向其父节点并且返回新添加的节点
function addNode(newNode) {
    // 创建新节点
    var tempNode = new Tree(newNode);
    // 当前节点在父节点中的位置
    tempNode.curOrder = this.index;
    // 将新节点加入当前节点的子节点数组中
    this.nextNode[this.index++] = tempNode;
    // 当前节点子节点个数
    this.curChildNum = this.index;
    // 子节点的上一个节点指针指向父节点
    tempNode.prevNode = this;
    protoPtr.depth.value++;
    tempNode.curDepth = protoPtr.depth.value;
    // 返回该节点
    return tempNode;
}

// 删除一个节点
function delNode() {

}

// flag == 1指向父节点同时修改depth
function getParent(flag) {
    if (arguments.length == 1) {
        if (flag) {
            // 向上走
            protoPtr.depth.value--;
            return this.prevNode;
        }
    }
    else {
        return this.prevNode;
    }
}

// 计算当前层节点的最大子节点个数
function layerMaxChildNum(head) {
    // 遍历树

}