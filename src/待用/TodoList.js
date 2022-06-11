window.onload = function () {
    var title = document.getElementById('title');
    var todolist = document.getElementById('todolist');
    title.onkeydown = function (event) {
        if (event.keyCode == 13) {
            if (title.value == '') {
                alert('请输入内容');
            } else {
                var li = document.createElement('li')
                var p = document.createElement('p');
                var input = document.createElement('input');
                input.type = 'checkbox';
                p.innerText = title.value;
                li.appendChild(input);
                li.appendChild(p);
                todolist.appendChild(li);
            }
        }
    }
    
}