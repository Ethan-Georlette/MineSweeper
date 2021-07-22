'use strict'
const MINE_IMG = '<img src="img/mine.png" />';
const MARKED_IMG = '<img class="marked" src="img/marked.png" />'
var gBoard = [];
var gGame = {
    isOn: false,
    isFirstClick: true,
    livesCount: 3,
    ishint: false,
    safeClickCount: 3
};
var gSize = 4;
var gTimeVal;
var gGameLog = [];



function initGame() {
    gGameLog = [];
    var elModal = document.querySelector('.modal');
    clearInterval(gTimeVal);
    elModal.style.display = 'none';
    startlives();
    startHint();
    gGame.isOn = true;
    gGame.isFirstClick = true;
    gGame.safeClickCount = 3;
    var elButton = document.querySelector('.safeClick')
    elButton.innerText = `Safe click ${gGame.safeClickCount}`
    gBoard = createBoard(gSize);
    renderBoard(gBoard);
    updatelivesCount();
    console.log(gGame.livesCount);
}
function cellClicked(elCell, i, j) {
    //TODO-When cell is clicked check if mine and neighbors
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    //when first click  all neighbors
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false;
        timerStart(Date.now());
        gBoard = createBoard(gBoard.length, { i, j });
        placeMine(gBoard);
        renderBoard(gBoard);
    }
    if (gGame.ishint) {
        giveHint(i, j);
        return;
    }
    if (currCell.isShown) return;
    if (!currCell.isMarked) {
        if (currCell.isMine) {
            lessLife()
            gGame.livesCount--;
            currCell.isShown = true;
            console.log(gGame.livesCount);
            if (!gGame.livesCount) {
                gameOver();
                return;
            }
            elCell.innerHTML = MINE_IMG;
            elCell.classList.add('mine');
            gGameLog.push({ i, j })
        } else if (!currCell.minesAroundCount) {
            currCell.isShown = true;
            clickNeighbours({ i, j });
            elCell.classList.add('clicked');
            gGameLog.push({ i, j })
        } else {
            currCell.isShown = true;
            elCell.innerText = currCell.minesAroundCount;
            elCell.classList.add('clicked');
            gGameLog.push({ i, j })
        }
        elCell.classList.add('clicked');
        changeSmiley(currCell.isMine);
        currCell.isShown = true;
        checkGameOver();
    }
}
function markCell(elCell, i, j) {
    var currCell = gBoard[i][j];
    if (!currCell.isMarked) {
        elCell.innerHTML = MARKED_IMG;
        currCell.isMarked = true
    } else {
        elCell.innerHTML = '';
        currCell.isMarked = false;
    }
    checkGameOver();
    return;
}
function placeMine(board = gBoard) {
    var numOfMines = 4
    switch (board.length) {
        case 4:
            numOfMines = 2;
            break;
        case 8:
            numOfMines = 12;
            break;
        case 12:
            numOfMines = 30;
            break;
    }
    for (var i = 0; i < numOfMines; i++) {
        var cellLocation = getEmptyRandCell(board);
        // console.log(cellLocation);
        board[cellLocation.i][cellLocation.j].isMine = true;
        updateNeighborMinesCount(cellLocation);
    }
}
function updateNeighborMinesCount(pos) {
    var neighbors = getNeighbors(pos);
    for (var i = 0; i < neighbors.length; i++) {
        var currCell = gBoard[neighbors[i].i][neighbors[i].j]
        currCell.minesAroundCount++;
    }
}
function checkGameOver() {
    var minesCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isShown && !currCell.isMine) return false;
            if (currCell.isMine && !currCell.isShown) {
                minesCells.push({ i, j });
            }
        }
    }
    // mark the mines that werent marked.
    for (i = 0; i < minesCells.length; i++) {
        console.log(!minesCells[i].isMarked);
        if (!minesCells[i].isMarked) {
            currCell = minesCells[i]
            var elCell = document.querySelector(`.${getCellClass(currCell)}`);
            elCell.innerHTML = MARKED_IMG;
        }
    }
    console.log('game-over');
    gameOver(true)
}
function gameOver(isWin = false) {
    gGame.isOn = false;
    clearInterval(gTimeVal)
    var elHiddens = document.querySelectorAll('.hidden');
    for (var i = 0; i < elHiddens.length; i++) {
        elHiddens[i].style.display = 'inline'
    }
    setTimeout(function () {
        if (isWin) {
            winGame();
        } else {
            loseGame();
            // elModal.style.backgroundColor = 'white'
        }
    }, 800)
}
function clickNeighbours(pos) {
    // elCell, i, j
    for (var i = pos.i - 1; i <= pos.i + 1 && i < gBoard.length; i++) {
        if (i < 0) continue;
        for (var j = pos.j - 1; j <= pos.j + 1 && j < gBoard.length; j++) {
            if ((j < 0 || (i === pos.i && j === pos.j)) || gBoard[i][j].isShown) continue;
            var elCurrcell = document.querySelector(`.${getCellClass({ i, j })}`)
            cellClicked(elCurrcell, i, j);
        }
    }
}
function timerStart(startTimer) {
    var elTimer = document.querySelector('.timer');
    gTimeVal = setInterval(function () {
        var time = ((Date.now() - startTimer) / 1000).toFixed(1)
        elTimer.textContent = time + '';
    }, 100)
}
function changeLevel(size) {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    gGame.isOn = true;
    gSize = size;
    initGame();
}
function updatelivesCount() {
    switch (gSize) {
        case '4':
        case 4:
            gGame.livesCount = 2;
            break;
        case '8':
            gGame.livesCount = 3;
            break;
        case '12':
            gGame.livesCount = 3
            break;

    }
}