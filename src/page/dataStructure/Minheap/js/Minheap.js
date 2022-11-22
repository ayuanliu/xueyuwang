/******************************************************/
const minHeap = [];
// 优先队列(最小值先出)
function insert(options) {
    // 插入节点的下标
    let index = minHeap.length;
    // 插入节点父节点的下标
    let pIndex = parseInt((index - 1) / 2);
    minHeap.push(Object.assign(options, {
        index
    }));
    // 记录上滤的节点过程
    let arr = [];
    let obj = { pNode: minHeap[pIndex], node: minHeap[index], process: arr };
    // 上滤
    while (index > 0) {
        if (minHeap[pIndex].data > minHeap[index].data) {
            arr.push({ index, pIndex });
            // 只交换值
            let temp = null;
            temp = minHeap[index].data;
            minHeap[index].data = minHeap[pIndex].data;
            minHeap[pIndex].data = temp;
            index = pIndex;
            pIndex = parseInt((index - 1) / 2);
        } else {
            break;
        }
    }
    return obj;
}
// 获取最小值该操作会修改数组
function popMin() {
    // 记录下滤的节点过程
    let arr = [];
    // 没有元素
    if (minHeap.length == 0) {
        return { data: null, process: [] };
    }
    // 只有一个元素
    if (minHeap.length == 1) {
        return { data: minHeap.pop(), process: [{ replace: 0, alter: 0 }] };
    }
    // 获取到最小值
    const result = minHeap[0];
    let obj = { data: result, process: arr };
    // 将最后一个元素替换第一个元素
    minHeap[0] = minHeap.pop(minHeap.length - 1);
    // 存入数组
    arr.push({ replace: 0, alter: minHeap.length })
    // 下滤
    let parent = 0;
    // 左节点索引
    let index = parent * 2 + 1;
    while (index < minHeap.length) {
        // 右节点存在且小于左节点
        if (index != minHeap.length - 1 && minHeap[index].data > minHeap[index + 1].data) {
            // 当前索引指向右节点
            index++;
        }
        if (minHeap[parent].data > minHeap[index].data) {
            arr.push({ parent, index })
            // 交换值
            let temp = null;
            temp = minHeap[index];
            minHeap[index] = minHeap[parent];
            minHeap[parent] = temp;
            parent = index;
            index = parent * 2 + 1;
        } else {
            break;
        }
    }
    return obj;
}
// 读取最小值该操作不会修改数组
function readMin() {
    // 没有元素
    if (minHeap.length == 0) {
        return;
    }
    return minHeap[0];
}
// 传入父节点获取所有子节点
function getChildren(pNode) {
    let arr = [];
    // 当前节点下标(父节点)
    let curIndex = pNode.index;
    // 计算左子节点下标
    let childLIndex = curIndex * 2 + 1;
    // 如果有左子节点
    if (childLIndex < minHeap.length) {
        arr.push(minHeap[childLIndex]);
        // 如果有右子节点
        if (childLIndex < minHeap.length - 1) {
            arr.push(minHeap[childLIndex + 1]);
        }
    }
    return arr;
}
/******************************************************/

/******************************************************/
// 传入树的根节点及获取子节点的函数(传入父节点返回子节点组成的数组)
function treeInfo(root, getChildren) {
    let treeInfo = new TreeInfo();
    TreeInfo.prototype.treeInfoAdd = function (pNode, node) {
        treeInfoAdd(this, getChildren, pNode, node);
    }
    TreeInfo.prototype.treeInfoDel = function (node) {
        treeInfoDel(node);
    }
    // 如果没有传入根节点
    if (!root) {
        return treeInfo;
    }
    // 需要单独为头节点设置nodeInfo属性
    root.nodeInfo = {
        layer: 0,
        placeInChildren: 0,
        placeInAllChildren: 0,
    }
    // 数据代理
    // 第一次层序遍历
    traverseTree(root, function (pNode, node, index) {
        // 给节点添加属性
        node.nodeInfo = {
            // 所在层数
            layer: pNode.nodeInfo.layer + 1,
            // 在父节点所有子节点中的位置(索引)
            placeInChildren: index,
            // 父节点
            pNode
        };
        // 当前节点上一层最大孩子数
        if (treeInfo.mostChildren[node.nodeInfo.layer - 1] === undefined) {
            treeInfo.mostChildren[node.nodeInfo.layer - 1] = 0;
        }
        if (treeInfo.mostChildren[node.nodeInfo.layer - 1] < index + 1) {
            treeInfo.mostChildren[node.nodeInfo.layer - 1] = index + 1;
            // 当前层最多节点数
            treeInfo.layerMostChildren[node.nodeInfo.layer] = (index + 1) * treeInfo.layerMostChildren[node.nodeInfo.layer - 1]
        }
        // 层数
        if (treeInfo.layers < node.nodeInfo.layer + 1) {
            treeInfo.layers = node.nodeInfo.layer + 1
        }
    });
    // 第二次层序遍历
    traverseTree(root, function (pNode, node, index) {
        // 完善nodeInfo属性(为动态数据)
        Object.defineProperty(node.nodeInfo, 'placeInAllChildren', {
            enumerable: true,
            get() {
                return treeInfo.mostChildren[node.nodeInfo.layer - 1] * pNode.nodeInfo.placeInAllChildren + index
            }
        })
    }, function (curNode) {
        // console.log(curNode)
    })
    return treeInfo;
    /******************************************************/
    function TreeInfo() {
        // 每层父节点最多子节点的个数
        this.mostChildren = [0],
            // 每层最多节点个数
            this.layerMostChildren = [1],
            // 层数
            this.layers = 1
    }

    // 传入根节点进行层序遍历
    function traverseTree(root, callback1, callback2) {
        // 层序遍历
        add(root);
        // 一直读取节点直到读完队列
        // 单独设置头节点
        let curNode = getOut().data;

        while (curNode) {
            // 每读取一个节点都将其子节点添加进队列
            let children = getChildren(curNode);
            children.forEach((item, index) => {
                callback1 && callback1(curNode, item, index);
                add(item);
            });
            callback2 && callback2(curNode);
            // 每次循环取出一个节点
            curNode = getOut();
            if (curNode) {
                curNode = curNode.data;
            }
        }

        /******************************************************/

        /******************************************************/
        // 创建一个链形队列 取出节点在头 添加节点则在末尾
        function Queue(data) {
            // 上一个节点
            this.pre = null;
            // 下一个节点
            this.next = null;
            // 数据
            this.data = data;
        }
        // 记录开头及末尾节点
        Queue.front = null;
        Queue.rear = null;
        // 往末尾添加节点
        function add(data) {
            // 将data封装成一个对象
            let obj = null;
            // 判断data类型
            if (Object.prototype.toString.call(data) === '[object Object]') {
                obj = data;
            } else {
                obj = {
                    data
                };
            }
            // 如果没有节点创建一个节点
            if (Queue.front == null) {
                Queue.front = new Queue(obj);
                Queue.rear = Queue.front;
            } else {
                // 队尾的下一个节点为新添加的节点
                let temp = new Queue(obj);
                Queue.rear.next = temp;
                // 上一个节点为以前的队尾
                temp.pre = Queue.rear;
                // 更新队尾为新添加的节点
                Queue.rear = temp;
            }
        }
        // 删除第一个并返回删除的节点
        function getOut() {
            let result = Queue.front;
            // 如果没有节点
            if (Queue.front == null) {
                return null;
            }
            // 如果只有1个节点
            else if (Queue.front.next == null) {
                Queue.front = null;
                Queue.rear = null;
                result.pre = null;
                result.next = null;
                return result;
            }
            else {
                // 更新头
                Queue.front = Queue.front.next;
                Queue.front.pre = null;
                result.pre = null;
                result.next = null;
                return result;
            }
        }
        // 遍历队列
        function traverseQueue() {
            let index = Queue.front;
            while (index) {
                console.log(index.data);
                index = index.next;
            }
        }
        /******************************************************/
    }

    // 添加一个新的节点则需调用该函数添加该节点的信息及更新树的信息
    /*
        参数:
            pNode           父节点
            node            子节点
    */
    function treeInfoAdd(treeInfo, getChildren, pNode, node) {
        // 如果添加的为根节点
        if (pNode === node) {
            node.nodeInfo = {
                layer: 0,
                placeInChildren: 0,
                placeInAllChildren: 0
            }
        } else {
            let index = getChildren(pNode).length - 1;
            // 为新增节点添加nodeInfo属性
            node.nodeInfo = {
                layer: pNode.nodeInfo.layer + 1,
                placeInChildren: index,
                pNode
            }
            // 当前节点上一层最大孩子数
            if (treeInfo.mostChildren[node.nodeInfo.layer - 1] === undefined) {
                treeInfo.mostChildren[node.nodeInfo.layer - 1] = 0;
            }
            if (treeInfo.mostChildren[node.nodeInfo.layer - 1] < index + 1) {
                treeInfo.mostChildren[node.nodeInfo.layer - 1] = index + 1;
                // 当前层最多节点数
                treeInfo.layerMostChildren[node.nodeInfo.layer] = (index + 1) * treeInfo.layerMostChildren[node.nodeInfo.layer - 1]
            }
            // 层数
            if (treeInfo.layers < node.nodeInfo.layer + 1) {
                treeInfo.layers = node.nodeInfo.layer + 1
            }
            // 完善nodeInfo属性(为动态数据)
            Object.defineProperty(node.nodeInfo, 'placeInAllChildren', {
                enumerable: true,
                get() {
                    return treeInfo.mostChildren[node.nodeInfo.layer - 1] * pNode.nodeInfo.placeInAllChildren + index
                }
            })
        }
        // console.log(pNode,node);
    }
    /*
        参数:
            node                    要删除的节点
    */
    function treeInfoDel(node){
        // 重新计算树的信息
        treeInfo
    }
}

// 数据代理
// 将属性代理到目标对象上
function dataProxy(target, origin) {
    let arr = Object.keys(origin);
    arr.forEach(item => {
        Object.defineProperty(target, item, {
            get() {
                return origin[item];
            },
            set(value) {
                origin[item] = value;
            }
        })
    })
}
/******************************************************/

// 整合所有零件
function create() {
    let info = treeInfo(undefined, getChildren);
    info.addPoint = addPoint;
    info.delPoint = delPoint;
    return info;
    // 在这里将insert与treeInfo进行组装
    function addPoint(options) {
        let nodes = insert(options);
        info.treeInfoAdd(nodes.pNode, nodes.node);
        // 将上滤这个过程记录下来并且返回
        return nodes.process;
    }
    function delPoint() {
        let obj = popMin();
        info.treeInfoDel(obj.node);
        return obj;
    }
}

