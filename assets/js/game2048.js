(function () {
  var modal = document.getElementById('game-modal');
  if (!modal) return;

  var boardEl = document.getElementById('game-board');
  var scoreEl = document.getElementById('game-score');
  var statusEl = document.getElementById('game-status');
  var restartBtn = document.getElementById('game-restart');

  var SIZE = 4;
  var grid, score, finished;

  function newGame() {
    grid = [];
    for (var r = 0; r < SIZE; r++) {
      grid.push([0, 0, 0, 0]);
    }
    score = 0;
    finished = false;
    statusEl.hidden = true;
    spawn();
    spawn();
    render();
  }

  function emptyCells() {
    var cells = [];
    for (var r = 0; r < SIZE; r++)
      for (var c = 0; c < SIZE; c++)
        if (!grid[r][c]) cells.push([r, c]);
    return cells;
  }

  function spawn() {
    var cells = emptyCells();
    if (!cells.length) return;
    var cell = cells[Math.floor(Math.random() * cells.length)];
    grid[cell[0]][cell[1]] = Math.random() < 0.9 ? 2 : 4;
  }

  // 한 줄을 왼쪽으로 밀며 병합. 변화 여부를 반환.
  function slideRow(row) {
    var vals = row.filter(Boolean);
    var out = [];
    for (var i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) {
        out.push(vals[i] * 2);
        score += vals[i] * 2;
        if (vals[i] * 2 === 2048 && !finished) win();
        i++;
      } else {
        out.push(vals[i]);
      }
    }
    while (out.length < SIZE) out.push(0);
    var moved = false;
    for (var j = 0; j < SIZE; j++) {
      if (row[j] !== out[j]) moved = true;
      row[j] = out[j];
    }
    return moved;
  }

  function move(dir) {
    // dir: 0=left 1=up 2=right 3=down — 보드를 회전시켜 왼쪽 슬라이드로 통일
    var moved = false;
    for (var i = 0; i < dir; i++) rotate();
    for (var r = 0; r < SIZE; r++) {
      if (slideRow(grid[r])) moved = true;
    }
    for (var k = 0; k < (4 - dir) % 4; k++) rotate();
    if (moved) {
      spawn();
      render();
      if (!finished && !canMove()) gameOver();
    }
    return moved;
  }

  function rotate() {
    // 반시계 90도 회전
    var next = [];
    for (var r = 0; r < SIZE; r++) {
      next.push([0, 0, 0, 0]);
      for (var c = 0; c < SIZE; c++) {
        next[r][c] = grid[c][SIZE - 1 - r];
      }
    }
    grid = next;
  }

  function canMove() {
    if (emptyCells().length) return true;
    for (var r = 0; r < SIZE; r++)
      for (var c = 0; c < SIZE; c++) {
        if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
        if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true;
      }
    return false;
  }

  function gameOver() {
    finished = true;
    statusEl.textContent = 'Game Over — 다시 시작해보세요!';
    statusEl.hidden = false;
  }

  function win() {
    finished = true;
    statusEl.textContent = '🎉 2048 달성! 계속 이어서 즐길 수 있어요.';
    statusEl.hidden = false;
  }

  function render() {
    boardEl.innerHTML = '';
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var v = grid[r][c];
        var cell = document.createElement('div');
        cell.className = 'game-cell' + (v ? ' game-cell--v' + Math.min(v, 2048) : '');
        if (v) {
          cell.textContent = v;
          cell.dataset.len = String(v).length;
        }
        boardEl.appendChild(cell);
      }
    }
    scoreEl.textContent = score;
  }

  function open() {
    if (!grid) newGame();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-easter="2048"]').forEach(function (el) {
    el.addEventListener('click', open);
  });

  restartBtn.addEventListener('click', newGame);

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
  });

  var DIRS = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key in DIRS) {
      e.preventDefault();
      move(DIRS[e.key]);
    }
  });

  // 모바일 스와이프
  var touchX = null, touchY = null;
  boardEl.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  boardEl.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = touchY = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 2 : 0);
    } else {
      move(dy > 0 ? 3 : 1);
    }
  });
})();
