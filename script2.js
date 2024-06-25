const playerModule = (function(){
    function Player(name, marker) {
        this.name = name;
        this.marker = marker;
        this.sayName = function() {
          console.log(`${this.name} has won!`);
        }}

    const player1 = new Player('Ryuk', 'X')
    const player2 = new Player('Gato Toni', 'O')

    return{
        playerName1: function() {player1.sayName()},
        playerName2: function() {player2.sayName()}
        }
    
})();

const gameControls = (function(){
    const cell = document.querySelectorAll('.cell');
    cell.forEach(cell => cell.addEventListener('click', putMarker));
    const playedCells= new Array(9);
    const gameContainer = document.getElementById('gameContainer')
    let blankDiv = document.createElement('div')
    let gameHasFinished = false;
    let round=0;
    let playerWhoWon=0;
    const winningConditions = [
        [0, 1, 2],[3, 4, 5],[6, 7, 8],
        [0, 3, 6],[1, 4, 7],[2, 5, 8],
        [0, 4, 8],[2, 4, 6]  
      ];

      let popUp = document.createRange().createContextualFragment(`
          <div id="popUp">
              <h1 id="winner"></h1>
              <button type="button" id="restart2">Restart</button>    
          </div>`
      )  

    function putMarker(e){
        if(e.target.textContent == false && gameHasFinished === false){
         if (round%2==0){
           e.target.textContent= "X";
           playedCells[parseInt(e.target.dataset.index)-1] = "X";
           round+=1;
         }
         else if (round%2 != 0){
           
        aiMove()
           round++
         }
       
        
         chooseWinner(playedCells)
         aiMove()
    }
   }
   if(round%2 != 0){
    
    
   }

    const chooseWinner= (playedCells) =>{
        if(round >= 5 && gameHasFinished===false){
        let a=" ";
        let b=" ";
        let c=" ";
        for(let i=0 ;i < 8; i++){
          a=winningConditions[i][0];
          b=winningConditions[i][1];
          c=winningConditions[i][2];
     
          if((playedCells[a]==playedCells[b])
            &&(playedCells[b]==playedCells[c])
            &&playedCells[a]
            &&playedCells[b]
            &&playedCells[c]){
                console.log('ryuk el gato')
                if(round%2 !=0){
                    playerModule.playerName1();
                    playerWhoWon=1;
                    console.log(playerWhoWon)
                }
                if(round%2 ==0){
                    playerModule.playerName2();
                    playerWhoWon=2;
                }
                gameHasFinished=true;
                showPopUp();
            }
        }
        }
        if(round==9 && gameHasFinished==false){
            playerWhoWon=3;
            gameHasFinished=true;
            showPopUp();
        }
        return playerWhoWon;
    }

    const restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', restart);
    
    function restart(){
        round=0;
        gameHasFinished=false;
        cell.forEach(cell => cell.textContent = "")
        for(let k = 0; k<8; k++){
        playedCells.pop()}
        playerWhoWon=0;
        removePopUp()
        console.log('gat')
    }

    
    
    function showPopUp(){
        gameContainer.appendChild(blankDiv);
        blankDiv.setAttribute('id', 'popUpWindow')
        blankDiv.appendChild(popUp)
        const restartButtonPopUp = document.getElementById('restart2');
        restartButtonPopUp.addEventListener('click', restart);
        const winnerDiv = document.getElementById('winner')
            if(playerWhoWon === 1){
                winnerDiv.textContent= "Player 1 has won";
            }
            if(playerWhoWon === 2){
                winnerDiv.textContent= "Player 2 has won";
            }
            if(playerWhoWon === 3){
                winnerDiv.textContent= "There was a draw";
            }
    }
    function removePopUp(){
       gameContainer.removeChild(blankDiv);
    }

    // Add this function inside your gameControls module
    function aiMove() {
        let bestScore = Infinity;
        let move;
        for (let i = 0; i < playedCells.length; i++) {
            if (!playedCells[i]) {
                playedCells[i] = "O";
                let score = minimax(playedCells, 0, false);
                playedCells[i] = null;
                if (score < bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        playedCells[move] = "O";
        document.querySelectorAll('.cell')[move].textContent = "O";
        round++;
        checkWin();
    }
    
    // Minimax function adapted for your game
    function minimax(board, depth, isMaximizing) {
        if (checkWinner(board, "X")) return 10;
        if (checkWinner(board, "O")) return -10;
        if (isDraw()) return 0;
    
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

// Modify your putMarker function to call aiMove after a player's move

function checkWinner(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player));
}

function isDraw() {
    return playedCells.every(cell => cell);
}

// Add checkWin function to handle win or draw
function checkWin() {
    if (checkWinner(playedCells, "X")) {
        console.log("X wins");
        gameHasFinished = true;
        return true;
    } else if (checkWinner(playedCells, "O")) {
        console.log("O wins");
        gameHasFinished = true;
        return true;
    } else if (isDraw()) {
        console.log("Draw");
        gameHasFinished = true;
        return true;
    }
    return false;
}



})()
