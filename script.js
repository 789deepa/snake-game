const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50
const blockWidth = 50

let highScore = localStorage.getItem("highScore") || 0;
let score = 0
let time = `00-00`

highScoreElement.innerHTML = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

let food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)}

const blocks = []; //copy of array
let snake = [{
    x:1,y:3
}]

let direction = 'right';

// for(let i =0; i<rows*cols; i++){
//     const block = document.createElement('div');
//     block.classList.add("block");
//     board.appendChild(block);
// }

// logic - snake will move 3 fps (3 frames)

//bcaz of this loop, it'll give us co-ordinates of each block(row, col runs same no. of times)
for (let row = 0; row<rows; row++){
    for (let col = 0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`;
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if(direction === "left"){
        head = {x:snake[0].x, y: snake[0].y - 1}
    } else if(direction === "right"){
        head = {x:snake[0].x, y: snake[0].y + 1}
    } else if(direction === "up"){
        head = {x:snake[0].x - 1, y: snake[0].y}
    } else {
        head = {x:snake[0].x + 1, y: snake[0].y}
    }
    
    //wall collision logic
    if(head.x < 0 || head.x >= rows || head.y <0 || head.y >= cols ){
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGame.style.display = "none";
        gameOver.style.display = "flex";
        return;
    }

    //food consume logic
    if(head.x == food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)}
        blocks[`${food.x}-${food.y}`].classList.add("food")

        snake.unshift(head)
        score += 10;
        scoreElement.innerText = score;

        if(score > highScore){
            highScore = score;
            //storing score into local storage
            localStorage.setItem("highScore", highScore.toString())
        }
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach(segment => {
       blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

startButton.addEventListener("click", ()=>{
    modal.style.display = "none";
    intervalId = setInterval(()=> {
        render()
    }, 300)

    //timer logic 
    timerIntervalId = setInterval(()=>{ 
        //destructuring 
        let [min, sec] = time.split("-").map(Number)

        if(sec == 59){
            min+=1
            sec=0
        } else {
            sec+=1
        }

        time = `${min}-${sec}`
        timeElement.innerHTML = time
    }, 1000)
})

restartButton.addEventListener("click", restartGame)

//restart game
function restartGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    score = 0;
    time = `00-00`;

    scoreElement.innerHTML = score;
    timeElement.innerHTML = time;
    highScoreElement.innerHTML = highScore;

    modal.style.display = "none";
    direction = "down";
    snake = [{x:1, y:3}]
    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)}
    intervalId = setInterval(()=> {
        render()
    }, 400)
}




addEventListener("keydown", (event) => {
    if(event.key == "ArrowUp"){
        direction="up";
    }else if(event.key == "ArrowDown"){
        direction="down";
    } else if(event.key == "ArrowLeft"){
        direction="left";
    } else {
        direction="right";
    }
})
