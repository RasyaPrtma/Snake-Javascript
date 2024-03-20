class SnakeGame{
    constructor(object){
        this.canvas = object.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = object.width;
        this.canvas.height = object.height;
        this.timestamp = 0;
        this.historyTime = []
        this.pauseTime = 0;
        this.selisihPause = 0;
        this.gameStatus = 'play';
        this.score = object.score;
        this.timer = object.timer;
    
        this.blockQuantity = object.blockQuantity;
        this.block = [];
        this.sizeBlock = {
          w: this.canvas.width / this.blockQuantity.x,
          h: this.canvas.height / this.blockQuantity.y
        }
    
        this.snake = [];
        this.snakeTemporary = [];
        this.snakeHistory = [];
        this.snakeLength = object.snakeLength;
        this.snakeColor = object.snakeColor;
        this.snakeDirection = object.snakeDirection;
        this.snakeDx = this.sizeBlock.w;
        this.snakeDy = 0;
        this.snakeSpeed = 500;
    
        this.food = [];
        this.foodHistory = [];
        this.foodColor = object.foodColor;
        this.foodQuantity = object.foodQuantity;
        this.TimeGenerateFood = object.foodTimeGenerate;
    
        this.timePassed = 0;
        this.startTime = 0;
        this.nama = "";
        this.text = object.text;
        this.resume = object.play;
      }

      Init(){
        // Create A Block For Snake
        for(let i = 0; i < this.blockQuantity.y; i++){
            let row = [];
            for(let j = 0; j < this.blockQuantity.x; j++){
                let background = (i%2 === 0 && j%2 === 1) || (i%2 === 1 && j%2 === 0) ? '#1c4e6b' : '#133954';
                row.push({
                    background,
                    x: j * this.sizeBlock.w,
                    y: i * this.sizeBlock.h
                })
            }
            this.block.push(row);
        }

        // Create A Snake 
       for(let i = 0; i < this.snakeLength;i++){
        let blocks = this.block[this.blockQuantity.y / 2][this.blockQuantity.x / 2 - i];
        this.snake.push({
          x : blocks.x,
          y : blocks.y
        })
       }

      //  Create A Food
      for(let i = 1; i < this.foodQuantity; i++){
        if(this.gameStatus == 'play'){
          return this.generateFood();
        }
      }

      this.events();
      }

      drawBlock(){
        this.block.forEach(row => {
            row.forEach(col => {
                this.ctx.fillStyle = col.background;
                this.ctx.fillRect(col.x,col.y,this.sizeBlock.w,this.sizeBlock.h);
            })
        })
      }

      drawSnake(){
        this.snake.forEach(snake => {
          this.ctx.fillStyle = this.snakeColor;
          this.ctx.fillRect(snake.x,snake.y,this.sizeBlock.w,this.sizeBlock.h);
        })
      }
      
      drawFood(){
        this.food.forEach(food => {
          this.ctx.fillStyle = this.foodColor;
          this.ctx.fillRect(food.x,food.y,this.sizeBlock.w,this.sizeBlock.h);
        })
      }

      draw(){
        this.drawBlock();
        if(this.gameStatus !== 'over'){
          this.drawSnake();
          this.drawFood();
        }
      }

      updateSnake(){
        let newBody =   {
          x: this.snake[0].x + this.snakeDx,
          y: this.snake[0].y + this.snakeDy
        }

        this.snake.unshift(newBody); 
        
        if(newBody.x < 0) this.snake[0].x = this.canvas.width;
        else if(newBody.y < 0) this.snake[0].y = this.canvas.height;
        else if (newBody.x + this.sizeBlock.w > this.canvas.width) this.snake[0].x = 0;
        else if (newBody.y + this.sizeBlock.h > this.canvas.height) this.snake[0].y = 0;

        if(!this.isSnakeEatFood()) this.snake.pop();

        this.snake.forEach((snakes,index) => {
          if(index > 0){
            if(newBody.x === snakes.x && newBody.y === snakes.y) this.gameOver();
          }
        })
        this.snakeTemporary = this.snake;
      }

      updateScore(){
        this.score.innerText = this.snake.length - 1;
      }

      updateTimer(timestamp){
        const showTime = timestamp - this.selisihPause
        let seconds = Math.floor((showTime / 1000) % 60);
        let minutes = Math.floor((showTime / (1000 * 60)) % 60);
        let hours = Math.floor((showTime / (1000 * 60 * 60) % 60));
        this.timer.innerText = `${hours<24?0:''}${hours}:${minutes<60?0:''}${minutes}:${seconds<10?0:''}${seconds}`;
      }

      update(timestamp){
        if(this.gameStatus == 'play'){
          this.updateSnake();
          this.updateScore();
          let gameTime = timestamp - this.startTime;
          this.updateTimer(gameTime);
        }
      }

      isSnakeEatFood(){
        let body = this.snake[0];
        let eaten = false;
        let foodEatenIndex = null;
        
        this.food.forEach((food,index) => {
          if(body.x == food.x && body.y == food.y){
            eaten = true;
            foodEatenIndex = index;
            this.snakeSpeed -= 20;
            this.TimeGenerateFood -= 100;
            return true;
          }
        });

        if(foodEatenIndex !== null) this.food.splice(foodEatenIndex,1);
        return eaten;
      }

      generateFood(){
        let food = this.block[this.randInt(1,this.blockQuantity.y-2)][this.randInt(1,this.blockQuantity.x-2)];
        this.food.push(food);
      }

      saveFoodPosition(){
        if(this.foodHistory.length > 10){
          this.foodHistory.shift();
        }
        let newFood = this.food.slice();
        this.foodHistory.push(newFood);
      }

      saveSnakeHistory(){
        if(this.snakeHistory.length > 10){
          this.snakeHistory.shift();
        }
        let newSnake = this.snake.slice();
        this.snakeHistory.push(newSnake);
      }

      gameOver(){
        let highscore = localStorage.getItem('highscore') == undefined ? 0 : localStorage.getItem('highscore');

        if(this.snake.length > highscore) localStorage.setItem('highscore', this.snake.length);

        highscore = localStorage.getItem('highscore');
        
        alert(`Game Over, ${this.nama} You Score : ${this.score.innerText}, Your Best Score : ${highscore}`);
        this.gameStatus = 'over';
        this.text.innerHTML = "GAME OVER";
        this.food = [];
      }

      render(timestamp){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.timestamp = timestamp;
        if (this.gameStatus == 'sendpause') {
          this.pauseTime = timestamp
          this.gameStatus = 'pause'
        }
        if (this.gameStatus == 'sendresume') {
          console.log('resume sent')
          this.selisihPause += timestamp - this.pauseTime
          this.gameStatus = 'play'
        }
        this.draw();
    
        if(timestamp - this.timePassed  > this.snakeSpeed && this.gameStatus == 'play'){
              this.timePassed = timestamp;
              this.update(timestamp);
        }
            requestAnimationFrame((timestamp) => {
              this.render(timestamp);
          })
    }

      start(){
        requestAnimationFrame((timestamp) => {
          this.startTime = timestamp;
          this.render(0);
        })
      }

      events(){
        document.addEventListener('keyup', (e) => {
          if(this.gameStatus === 'pause')return;
          if((e.key == 'w' || e.key == 'ArrowUp') && this.snakeDirection !== 'down'){
            this.snakeDy = -this.sizeBlock.h;
            this.snakeDx = 0;
            this.snakeDirection = 'up';
            this.update(this.timestamp.valueOf());
          }else if((e.key == 's' || e.key == 'ArrowDown') && this.snakeDirection !== 'up'){
            this.snakeDy = this.sizeBlock.h;
            this.snakeDx = 0;
            this.snakeDirection = 'down';
            this.update(this.timestamp.valueOf());
          }else if((e.key == 'd' || e.key == 'ArrowRight') && this.snakeDirection !== 'left'){
            this.snakeDy = 0;
            this.snakeDx = this.sizeBlock.w;
            this.snakeDirection = 'right';
            this.update(this.timestamp.valueOf())
          }else if((e.key == 'a' || e.key == 'ArrowLeft') && this.snakeDirection !== 'right'){
            this.snakeDy = 0;
            this.snakeDx = -this.sizeBlock.w;
            this.snakeDirection = 'left';
            this.update(this.timestamp.valueOf())
          }
        })

        setInterval(() => {
          if(this.gameStatus == 'play'){
            if(this.food.length > 5){
              return;
            };
            this.generateFood();
          }
        }, this.TimeGenerateFood);

        setInterval(() => {
          if(this.gameStatus == 'play'){
            this.saveFoodPosition();
            this.saveSnakeHistory();
          }
        },1000)
      }
      randInt(min,max){
        return Math.floor(Math.random() * max) + min;
      }

};
