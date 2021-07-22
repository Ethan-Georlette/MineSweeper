'use strict'
var gfireTop = 35;
var gHintCount = 3;

function lessLife(numOfLivesLeft) {
    var elFire = document.querySelector(`.fire`);
    gfireTop += 45;
    elFire.style.top = `${gfireTop}px`
    for (var i = 0; i < 3; i++) {
        var elCurrLife = document.querySelector(`.life${i + 1}`);
        // if (i === numOfLivesLeft - 1) {
        //     elCurrLife.style.display = 'none';
        // } else {
        elCurrLife.style.top = (gfireTop) + 'px';

    }
}
function startlives() {
    var elFire = document.querySelector(`.fire`);
    for (var i = 0; i < 3; i++) {
        var elCurrLife = document.querySelector(`.life${i + 1}`);
        elCurrLife.style.display = '';
        elCurrLife.style.top = '30px'
    }
    elFire.style.top = '35px'
    elFire.style.display = ''
    gfireTop = 35;
    var elBomb = document.querySelector('.bomb');
    elBomb.style.backgroundImage = 'url("/css/img/bombBackground.png")';
    var elLives = document.querySelector('.lives');
    elLives.style.opacity = '1'

}
function loseGame() {
    var elModal = document.querySelector('.modal');
    elModal.innerHTML = '<h1>GAME OVER maybe next time...</h1>';
    elModal.style.display = '';
    var elBomb = document.querySelector('.bomb');
    elBomb.style.backgroundImage = 'url("/css/img/loseBackground.png")';
    var elLives = document.querySelector('.lives');
    elLives.style.opacity = '0'
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = '<img src="css/img/smiley/Exploding.png"/>'
}
function winGame() {
    var elModal = document.querySelector('.modal');
    var strHtml = '<img class="salute" src="img/saluteWin.png" />'
    strHtml += '<h1>GOOD JOB SOLDIER</h1>'
    strHtml += '<img src="img/saluteWin.png" />'
    elModal.innerHTML = strHtml;
    elModal.style.display = '';
    var elLives = document.querySelector('.lives');
    elLives.style.opacity = '0'
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = '<img src="css/img/smiley/Soldier.png"/>'
}
function changeSmiley(isMine) {
    var elSmiley = document.querySelector('.smiley');
    setTimeout(function () {
        elSmiley.innerHTML = '<img src="css/img/smiley/regular.png"/>'
    }, 500);
    if (isMine) {
        elSmiley.innerHTML = '<img src="css/img/smiley/Exploding.png"/>'
    } else {
        elSmiley.innerHTML = '<img src="css/img/smiley/stressed.png"/>'
    }
}
function startHint() {
    var elHint = document.querySelector('.hints');
    var strHtml = '<h1>'
    for (var i = 0; i < 3; i++) {
        strHtml += `<span onclick="useHint(this)" class="hint hint${i + 1}">💡</span>`
    }
    strHtml += '</h1>'
    elHint.innerHTML = strHtml;
    gGame.ishint = false;
}
function useHint(elHint) {
    // console.log('here');
    if (gGame.isFirstClick) return;
    elHint.classList.toggle('hintLight')
    gGame.ishint = (gGame.ishint) ? false : true;
    // console.log(gGame.ishint);
}
function giveHint(i, j) {
    var neighbors = getNeighbors({ i, j })
    for (var num = 0; num < neighbors.length; num++) {
        var currI = neighbors[num].i
        var currJ = neighbors[num].j
        // console.log(currI, currJ);
        var currCell = gBoard[currI][currJ];
        // console.log(currCell);
        if (currCell.isMarked) continue;
        if (currCell.isShown) continue;
        var elCurrCell = document.querySelector(`.${getCellClass({ i: currI, j: currJ })}`);
        if (currCell.isMine) {
            elCurrCell.innerHTML = MINE_IMG;
        } else {
            elCurrCell.innerText = currCell.minesAroundCount;
        }
    }
    setTimeout(function () {
        for (num = 0; num < neighbors.length; num++) {
            currI = neighbors[num].i
            currJ = neighbors[num].j
            currCell = gBoard[currI][currJ];
            // console.log(currI, currJ);
            if (currCell.isMarked) continue;
            if (currCell.isShown) continue;
            // console.log(currI, currJ);
            var elCurrCell = document.querySelector(`.${getCellClass({ i: currI, j: currJ })}`);
            elCurrCell.innerText = '';
            elCurrCell.innerHTML = '';
        }
    }, 1000)
    hideHint();
}
function hideHint() {
    gHintCount--;
    gGame.ishint = false;
    var elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < elHints.length; i++) {
        if (!i) {
            elHints[i].style.display = 'none';
            elHints[i].classList.remove('hint');
        }
        elHints[i].classList.remove('hintLight');
    }
}
function safeClick(elButton) {
    if (gGame.isFirstClick) return;
    if (!gGame.safeClickCount) return;
    var selectedCell = getEmptyRandCell();
    var elCell = document.querySelector(`.${getCellClass(selectedCell)}`);
    elCell.classList.add('safe');
    setTimeout(function () {
        elCell.classList.remove('safe');
    }, 2000)
    gGame.safeClickCount--;
    elButton.innerText = `Safe click ${gGame.safeClickCount}`

}
function undo() {
    console.log(gGameLog);
    for (var i = gGameLog.length - 1; i > 0; i--) {
        var currLocation = gGameLog.pop();
        if (currLocation === 'stop') return
        var elCurrCell = document.querySelector(`.${getCellClass(currLocation)}`);
        elCurrCell.classList.remove('mine');
        elCurrCell.classList.remove('clicked');
        var currCell = gBoard[currLocation.i][currLocation.j];
        currCell.isShown = false;
        elCurrCell.innerHTML = '';
        elCurrCell.innerText = '';
        // console.log(gGameLog[i]);
    }
}
function placeStopper() {
    gGameLog.push('stop');
}