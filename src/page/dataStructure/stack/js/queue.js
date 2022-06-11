// 对队列进行操作 该队列为先加1再取值

// 创建队列
// 需要传入一个最大队列个数该值(从1开始数)
function Queue(maxNum) {
    this.queueArr = new Array();
    this.rear = maxNum - 1;                  //队头
    this.front = maxNum - 1;                 //队尾
    this.maxNum = maxNum;            //设置最大索引值
    this.writeQueue = writeQueue;   //写入数据
    this.readQueue = readQueue;     //读出数据
    this.isNull = isNull;           //判断队列是否为空
    this.isFull = isFull;           //判断队列是否为满
    this.flag = 0;                  //辅助判断队列   可能空/可能满   0可能空/1可能满
    this.getNum = getNum;
}

// 向队列中写入数据
function writeQueue(data) {
    // 如果队列创建成功
    if (this.queueArr) {
        if (this.isFull()) {
            return;
        } else {
            this.rear++;
            // rear走完一圈回0
            if (this.rear == this.maxNum) {
                this.rear = 0;
            }
            // 这里能用this.rear是因为调用该函数的是实例化的对象
            this.queueArr[this.rear] = data;
            // 写数据进队列此时只可能为满
            this.flag = 1;
        }

    } else {
        alert("出错了!");
    }
}

// 向队列中读出一个数据
function readQueue(index) {
    // 使用arguements判断参数个数实现函数重载
    // (会改变队列中数据的读取)
    if (arguments.length == 0) {
        if (this.queueArr) {
            if (this.isNull()) {
                return;
            } else {
                this.front++;
                if (this.front == this.maxNum) {
                    this.front = 0;
                }
                let temp = this.queueArr[this.front];
                // 读出数据此时只可能为空
                this.flag = 0;
                return temp;
            }
        } else {
            alert("出错了!");
        }
    }
    // (不会改变队列中数据的读取)
    if (arguments.length == 1) {
        return this.queueArr[index];
    }
}

// 获取队列中元素的个数
function getNum() {
    if (this.front - this.rear < 0) {
        return -this.front + this.rear;
    } else if (this.front == this.rear && this.flag == 1) {
        return this.maxNum;
    } else if (this.front == this.rear && this.flag == 0) {
        return 0;
    } else {
        return this.maxNum - this.front + this.rear;
    }
}

// 判断队列是否为空
function isNull() {
    if (this.rear == this.front && this.flag == 0) {
        return true;
    } else {
        return false;
    }
}

// 判断队列是否为满
function isFull() {
    if (this.rear == this.front && this.flag == 1) {
        return true;
    } else {
        return false;
    }
}





// 对栈进行操作

// 创建栈
function Stack(maxNum) {
    this.stackArr = new Array();
    this.index = -1;             //索引
    this.maxNum = maxNum;       //设置最大索引
    this.writeStack = writeStack;
    this.readStack = readStack;
    this.isNull = isNull;       //判断栈是否为空
    this.isFull = isFull;       //判断栈是否为满
}

// 向栈中写入数据
function writeStack(data) {
    if (this.stackArr) {
        if (isFull()) {
            return;
        }
        this.index++;
        this.stackArr[this.index] = data;
    }
}
// 向栈中读出数据
function readStack(index) {
    // 改变栈中数据
    if (arguments.length == 0) {
        if (this.stackArr) {
            if (isNull()) {
                return;
            }
            return this.stackArr[this.index--];
        }
    }
    // 不改变栈中数据
    if (arguments.length == 1) {
        return this.stackArr[index];
    }
}

// 判断栈是否为空
function isNull() {
    if (this.index == -1) {
        return true;
    } else {
        return false;
    }
}

// 判断栈是否为满
function isFull() {
    if (this.index == this.maxNum - 1) {
        return true;
    } else {
        return false;
    }
}