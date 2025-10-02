(function(){
  // Board layout and game data
  const ladders = {2:38,7:14,8:31,15:26,21:42,28:84,36:44,51:67,71:91,78:98,87:94};
  const snakes  = {16:6,49:11,46:25,62:19,64:60,74:53,89:68,92:88,95:75,99:80};

  let pos = [0,0]; // player positions
  let turn = 0; // 0 -> Player 1, 1 -> Player 2
  let gameOver = false;

  function initBoard(){
    const board = document.getElementById('board');
    board.innerHTML = '';
    // Build 100 cells with serpentine mapping
    for(let i=1; i<=100; i++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      const rowFromBottom = Math.floor((i-1)/10);
      const colInRow = (i-1)%10;
      const colFromLeft = (rowFromBottom % 2 === 0) ? colInRow : (9 - colInRow);
      const rowFromTop = 10 - rowFromBottom;
      cell.style.gridRowStart = rowFromTop;
      cell.style.gridColumnStart = colFromLeft + 1;

      const label = document.createElement('span');
      label.className = 'cell-num';
      label.textContent = i;
      cell.appendChild(label);

      if (ladders[i]){
        const icon = document.createElement('span');
        icon.className = 'icon ladder';
        icon.textContent = '🪜';
        cell.appendChild(icon);
      }
      if (snakes[i]){
        const icon = document.createElement('span');
        icon.className = 'icon snake';
        icon.textContent = '🐍';
        cell.appendChild(icon);
      }

      board.appendChild(cell);
    }
    renderTokens();
  }

  function renderTokens(){
    // clear existing pawns
    document.querySelectorAll('.pawn').forEach(p => p.remove());
    if(pos[0] > 0){
      const c = document.querySelector(`.cell[data-index='${pos[0]}']`);
      if(c){
        const p = document.createElement('div');
        p.className = 'pawn p1';
        c.appendChild(p);
      }
    }
    if(pos[1] > 0){
      const c = document.querySelector(`.cell[data-index='${pos[1]}']`);
      if(c){
        const p = document.createElement('div');
        p.className = 'pawn p2';
        c.appendChild(p);
      }
    }
    // update stats
    document.getElementById('pos1Text').textContent = `Player 1: ${pos[0]}`;
    document.getElementById('pos2Text').textContent = `Player 2: ${pos[1]}`;
  }

  function updateTurnText(){
    document.getElementById('turnText').textContent = `Turn: ${turn===0?'Player 1':'Player 2'}`;
  }

  function showWin(winner){
    const modal = document.getElementById('winModal');
    const msg = document.getElementById('winMessage');
    msg.textContent = `Player ${winner+1} wins!`;
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    gameOver = true;
  }
  function hideWin(){
    const modal = document.getElementById('winModal');
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
  }

  function rollDice(){
    if(gameOver) return;
    const rollBtn = document.getElementById('rollBtn');
    rollBtn.disabled = true;
    const dice = document.getElementById('dice');
    dice.textContent = 'Rolling...';
    setTimeout(() => {
      const value = Math.floor(Math.random()*6) + 1;
      dice.textContent = value;
      movePlayer(value);
      rollBtn.disabled = false;
    }, 800);
  }

  function movePlayer(value){
    const current = turn;
    let newPos = pos[current] + value;
    if(newPos > 100){
      newPos = pos[current];
    } else {
      if (ladders[newPos]) newPos = ladders[newPos];
      if (snakes[newPos]) newPos = snakes[newPos];
    }
    pos[current] = newPos;
    renderTokens();

    if(newPos === 100){
      showWin(current);
      document.getElementById('rollBtn').disabled = true;
    } else {
      turn = 1 - turn;
      updateTurnText();
    }
  }

  function resetGame(){
    pos = [0,0];
    turn = 0;
    gameOver = false;
    document.getElementById('dice').textContent = '1';
    document.getElementById('pos1Text').textContent = 'Player 1: 0';
    document.getElementById('pos2Text').textContent = 'Player 2: 0';
    updateTurnText();
    initBoard();
    hideWin();
    document.getElementById('rollBtn').disabled = false;
  }

  // Init
  initBoard();
  updateTurnText();

  // Event bindings
  document.getElementById('rollBtn').addEventListener('click', rollDice);
  document.getElementById('restartBtn').addEventListener('click', resetGame);
  document.getElementById('playAgainBtn').addEventListener('click', resetGame);
  // optional: click on dice to roll
  document.getElementById('dice').addEventListener('click', () => { if(!gameOver) rollDice(); });
})();
