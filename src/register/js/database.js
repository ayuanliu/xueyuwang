let root = null;
export function Node(nodeValue) {
    this.nodeValue = nodeValue;
    this.childNodes = [];
    this.flag = 0;
}
export function createRoot() {
    root = new Node(undefined);
    return root;
}
// 判断是否存在于树中
Node.isInTree = function (arr) {
    let temp = root;
    for (let i = 0; i < arr.length; i++) {
        if (temp.childNodes[arr[i]] != null) {
            temp = temp.childNodes[arr[i]];
        } else {
            return false;
        }
    }
    if (temp.flag) {
        return true;
    } else {
        return false;
    }

}

// 将数组插入树中
/*
    参数:
        arr                插入的数组
*/
Node.prototype.insertTree = function (arr) {
    let temp = this;
    for (let i = 0; i < arr.length; i++) {
        if(!temp.childNodes[arr[i]]){
            temp.childNodes[arr[i]] = new Node(arr[i]);
        }
        temp = temp.childNodes[arr[i]];
    }
    temp.flag = 1;
}

// 遍历root
Node.prototype.readTree = function () {
    let temp = this;
    for (let i = 0; i < temp.childNodes.length; i++) {
        if (temp.childNodes[i]) {
            console.log(temp.childNodes[i].nodeValue);
            temp.childNodes[i].readTree();
        }
    }
}