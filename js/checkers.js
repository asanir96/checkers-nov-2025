'use strict'

const gBoard = [
    ['', 'w', '', 'w', '', 'w', '', 'w'],
    ['w', '', 'w', '', 'w', '', 'w', ''],
    ['', 'w', '', 'w', '', 'w', '', 'w'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['b', '', 'b', '', 'b', '', 'b', ''],
    ['', 'b', '', 'b', '', 'b', '', 'b'],
    ['b', '', 'b', '', 'b', '', 'b', '']
]
var gActivePiecePos = null
var gPossiblePathPos = []
const piece = { pos: { x: 0, y: 0 }, color: 'white' }
function onInit() {
    // gBoard = createBoard()
    renderBoard('.board', gBoard)

}


function renderBoard(boardContSelector, board) {
    const elBoardCont = document.querySelector(boardContSelector)
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var classList = `square square-${i}-${j} `

            classList += (i + j) % 2 === 0 ? 'black-square' : 'white-square'
            var currPiece = board[i][j]

            strHTML += `<div class="${classList}" 
                            onmousehover= "onHover(this)"
                            onclick = "movePiece(this,${i},${j})">`

            if (currPiece === 'w') var pieceStrHTML = `<div class = "piece white-piece" onclick="onPieceClick(this,${i},${j})"> </div>`
            else if (currPiece === 'b') var pieceStrHTML = `<div class = "piece black-piece" onclick="onPieceClick(this,${i},${j})"> </div>`
            else var pieceStrHTML = ''

            strHTML += `${pieceStrHTML} </div>`
        }
    }

    elBoardCont.innerHTML = strHTML
}

function onPieceClick(elPiece, i, j) {
    if (gActivePiecePos) {
        var elPrevActivePiece = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j} .piece`)
        elPrevActivePiece.classList.remove('active')
    }
    gPossiblePathPos = []
    clearActiveSquares()
    gActivePiecePos = { i, j }

    var elPiece = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j} .piece`)
    elPiece.classList.add('active')
    gBoard[i][j]
    markPossibleSquares(i, j, gBoard[i][j])
}

function movePiece(elSquare, i, j) {
    if (!(elSquare.classList.contains('active') || elSquare.classList.contains('eat-move-land-square'))) return

    const selectedPos = { i, j }
    const activePiece = gBoard[gActivePiecePos.i][gActivePiecePos.j]
    
    gBoard[gActivePiecePos.i][gActivePiecePos.j] = ''
    gBoard[i][j] = activePiece
    gActivePiecePos = null


    var chosenPath
    for (var i = 0; i < gPossiblePathPos.length; i++) {
        if (containsObject(gPossiblePathPos[i], selectedPos)) {
            chosenPath = gPossiblePathPos[i]
        }
    }


    if (chosenPath) {
        for (var i = 0; i < chosenPath.length; i++) {
            var currRivalPiecePos = chosenPath[i].eatPos
            gBoard[currRivalPiecePos.i][currRivalPiecePos.j] = ''
        }
    }
    renderBoard('.board', gBoard)
}


function createBoard(size) {
    for (var i = 0; i < size; i++) {
        if (i % 2 !== 0) {
            evenPiece = 'white'
            oddSquareClassName = 'black'
        } else {
            evenSquareClassName = 'black'
            oddSquareClassName = 'white'
        }

        for (var j = 0; j < size; j++) {
        }
    }
}

function clearActiveSquares() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elSquare = document.querySelector(`.square-${i}-${j}`)
            elSquare.classList.remove('active')
            elSquare.classList.remove('eat-move-land-square')
            elSquare.classList.remove('eat')

            var elPiece = elSquare.querySelector('.piece')
            if (elPiece) elPiece.classList.remove('eaten-move')
        }
    }
}

function markPossibleSquares(i, j, piece) {
    const dir = piece === 'w' ? 1 : -1
    const squareNegPos = getNeighborPos(gBoard, i, j)
    const possibleEatPos = []
    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currPos = squareNegPos[idx]
        var currNeg = gBoard[currPos.i][currPos.j]

        var dist = getSquareDist(currPos, { i, j }, piece)
        var absDist = getAbsDist(dist)

        var currLandPos = { i: (currPos.i + dist.i), j: (currPos.j + dist.j) }

        if (dir * currPos.i <= dir * i) {
            continue

        } else if (absDist === 2 && currNeg === '') {

            var elCurrNegSquare = document.querySelector(`.square-${currPos.i}-${currPos.j}`)
            elCurrNegSquare.classList.add('active')

        } else if (currNeg !== piece && currNeg !== '' && gBoard[currLandPos.i][currLandPos.j] === '') {
            gPossiblePathPos.push(markPossibleCaptureMoves(currPos, currLandPos, [], currNeg))
        } else {
            continue
        }
    }
}

function markPossibleDiagSquares() {

}

function getPossibleEatPos(board, pos) {
    const squareNegPos = getNeighborPos(gBoard, pos.i, pos.j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currPos = squareNegPos[idx]
        var currNeg = gBoard[currPos.i][currPos.j]
        if (currNeg === piece || getSquareDist({ i, j }, currPos) > 1) {
            continue
        }

        if (currNeg !== '') {
            getPossibleEatPos()

        }

        var elCurrNegSquare = document.querySelector(`.square-${currPos.i}-${currPos.j}`)
        elCurrNegSquare.classList.add('active')
    }

}

function isEatPossible() {

}

function markPossibleCaptureMoves(rivalNegPos, landingPos, pathPos, piece) {

    pathPos.push({ 'eatPos': rivalNegPos, 'landPos': landingPos })

    var elCurrNegSquare = document.querySelector(`.square-${rivalNegPos.i}-${rivalNegPos.j}`)
    elCurrNegSquare.classList.add('eat')

    var elCurrNegPiece = elCurrNegSquare.querySelector('.piece')
    elCurrNegPiece.classList.add('eaten-move')

    var elCurrNegLandSquare = document.querySelector(`.square-${landingPos.i}-${landingPos.j}`)
    elCurrNegLandSquare.classList.add('eat-move-land-square')

    const negPos = getNeighborPos(gBoard, landingPos.i, landingPos.j)

    for (var idx = 0; idx < negPos.length; idx++) {

        var currNextPos = negPos[idx]
        var currNextNeg = gBoard[currNextPos.i][currNextPos.j]

        var dist = getSquareDist(currNextPos, { i: landingPos.i, j: landingPos.j }, piece)
        var currNexLandPos = { i: (currNextPos.i + dist.i), j: (currNextPos.j + dist.j) }

        if (currNexLandPos.i >= gBoard.length ||
            currNexLandPos.j >= gBoard.length ||
            currNexLandPos.i < 0 ||
            currNexLandPos.j < 0)
            continue

        if (currNextPos.i === rivalNegPos.i && currNextPos.j === rivalNegPos.j) continue

        if (currNextNeg === piece && gBoard[currNexLandPos.i][currNexLandPos.j] === '') {
            markPossibleCaptureMoves(currNextPos, currNexLandPos, pathPos, piece)
        }

    }

    return pathPos
}