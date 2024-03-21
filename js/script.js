const score = document.getElementById('score');
const timer = document.getElementById('timer');
const canvas = document.getElementById('canvas');
const btn_start = document.getElementById('start-menu');
const instruction = document.getElementById('game-menu');
const game = document.getElementById('game');
const menu_name = document.getElementById('name-menu');
const menu_name_btn = document.getElementById('btn-name');
const menu_name_input = document.getElementById('name');
const nama = document.getElementById('nama');
const text = document.getElementById('phytons');
const slider = document.getElementById('slider');
const rewind = document.getElementById('rewind');
const cancel = document.getElementById('cancel')
const exit = document.getElementById('exit');
const pause = document.getElementById('pause');
const play = document.getElementById('play');
const restart = document.getElementById('restart');
const snake = new SnakeGame({
  canvas : canvas,
  width : 960,
  height : 600,
  score : score,
  timer : timer,
  blockQuantity : {
      x: 48,
      y: 30,
  },
  snakeLength : 1,
  snakeColor : 'lightgreen',
  snakeDirection : 'right',
  foodColor : 'red',
  foodQuantity : 1,
  foodTimeGenerate:5000,
  text: text,
  restart:restart,
});


btn_start.addEventListener('click',function(){
    instruction.classList.add('hide');
    menu_name.classList.add('show');
})

menu_name_btn.addEventListener('click',function(){
   if(menu_name_input.value !== ""){
    menu_name.classList.remove('show');
    game.classList.add('show');
    rewind.classList.add('show');
    pause.classList.add('show');
    nama.innerText = `Player: ${menu_name_input.value}`;
    localStorage.setItem('name',menu_name_input.value);
    snake.nama = menu_name_input.value;
    snake.Init()
    snake.start();
   }else{
    alert("Masukkan Nama!");
   }
})

window.addEventListener('load',function(){
  if(localStorage.getItem('name') !== null){
    instruction.classList.add('hide');
    game.classList.add('show');
    rewind.classList.add('show')
    pause.classList.add('show');
    snake.nama = localStorage.getItem('name');
    snake.Init();
    snake.start();
    nama.innerText = `Player: ${localStorage.getItem('name')}`;
  }
});

rewind.addEventListener('click', function(){
  if(snake.gameStatus == 'play'){
    slider.classList.add('show');
    cancel.classList.add('show');
    pause.classList.remove('show');
    snake.gameStatus = 'sendpause';
    slider.value = snake.snakeHistory.length;
  }else if(snake.gameStatus == 'pause'){
    snake.gameStatus = 'sendresume';
    snake.snakeTemporary = snake.snake;
    slider.classList.remove('show');
    cancel.classList.remove('show');
    pause.classList.add('show');
  }
});

cancel.addEventListener(('click'),function(){
  snake.snake = snake.snakeTemporary;
  snake.gameStatus = 'play';
  slider.classList.remove('show');
  cancel.classList.remove('show');
})

slider.addEventListener('input', (e) => {
  let val = e.target.value;
  snake.snake = snake.snakeHistory[val] == undefined ? snake.snake : snake.snakeHistory[val];
  snake.food = snake.foodHistory[val] == undefined ? snake.food : snake.foodHistory[val];
  snake.bomb = snake.bombHistory[val] == undefined ? snake.bomb : snake.bombHistory[val];
});

exit.addEventListener('click',() => {
  localStorage.removeItem('name');
  localStorage.removeItem('highscore');
  window.location.reload();
});

pause.addEventListener('click',() => {
 if(snake.gameStatus !== "over") {
  snake.gameStatus = "sendpause";
  play.classList.add('show');
 }
})

play.addEventListener('click', () => {
  if(snake.gameStatus !== "over"){
    snake.gameStatus = "sendresume";
    play.classList.remove('show');
  }
});

restart.addEventListener('click',() => {
  window.location.reload();
})