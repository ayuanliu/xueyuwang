function Linkedlist(data) {
    this.data = data;           // 添加的元素节点(元素存放在这)
    this.next = null;           // 指向下一个节点
    this.line = null;           // 线条
    this.order = 0;             // 在链表中的位置
}
const head = new Linkedlist(undefined);
Linkedlist.num = 0;
/*
    参数:
        data                    要插入的节点(元素)
        n                       插在第几个位置          
*/
Linkedlist.prototype.addPoint = function (data, n) {
    n = parseInt(n);
    if (n > Linkedlist.num + 1) {
        n = Linkedlist.num + 1;
    }
    if (n <= 0) {
        n = 1;
    }
    let nPoint = new Linkedlist(data);
    nPoint.order = n;
    let cur = head;
    // 走到要添加的位置的前一个
    for (let i = 1; i < n; i++) {
        cur = cur.next;
    }
    // 插入节点
    let temp = cur.next;
    nPoint.next = temp;
    cur.next = nPoint;
    // 从插入节点的后面开始都要重新编号
    nPoint.readLinkedlist(function (point) {
        if (point.next != null) {
            point.next.order = point.order + 1;
        }
    })
    // 将添加的节点的前一个节点返回
    Linkedlist.num++;
    return cur;
}
// 删除第n个节点
Linkedlist.prototype.delPoint = function (n, callback) {
    n = parseInt(n);
    if (n > Linkedlist.num) {
        n = Linkedlist.num;
    }
    if (n <= 0) {
        n = 1;
    }
    let cur = head;
    // 走到要删除的位置的前一个
    for (let i = 1; i < n; i++) {
        cur = cur.next;
    }
    let temp = cur.next;
    // 如果删除的那个存在则删除
    if (cur.next != null) {
        cur.next = cur.next.next;
    }
    // 从删除节点的后面开始都要重新编号
    cur.readLinkedlist(function (point) {
        if (point.next != null) {
            point.next.order = point.order + 1;
        }
    })
    Linkedlist.num--;
    // 传入要删除的元素的前一个及被删除的元素
    if(temp!=null){
        callback && callback(cur, temp);
    }
    return cur;
}
// 遍历链表
Linkedlist.prototype.readLinkedlist = function (callback) {
    let temp = this;
    while (temp) {
        callback && callback.call(this, temp);
        temp = temp.next;
    }
}
// 将链表转为数组
Linkedlist.prototype.getArr = function () {
    var readLinkedlistArr = new Array();
    var i = 0;
    this.readLinkedlist((curPoint) => {
        readLinkedlistArr[i++] = curPoint;
    });
    return readLinkedlistArr;
}