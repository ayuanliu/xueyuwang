let value = 0;
let score = document.querySelector('.showData .score');
export function addScore(){
    value++;
    score.innerHTML=value;
}
export function getScore(){
    return value;
}
export function setScore(){
    value = 0;
    score.innerHTML=value;
}