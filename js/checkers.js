'use strict'

// const gBoard = [
//     ['', 'w', '', 'w', '', 'w', '', 'w'],
//     ['w', '', 'w', '', 'w', '', 'w', ''],
//     ['', 'w', '', 'w', '', 'w', '', 'w'],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['b', '', 'b', '', 'b', '', 'b', ''],
//     ['', 'b', '', 'b', '', 'b', '', 'b'],
//     ['b', '', 'b', '', 'b', '', 'b', '']
// ]
const gBoardSize = 8
var gInaugurationRow
var gBoard
var gIntervalID
var gActivePiecePos = null
var gPossiblePathPos
var isAnimationOn = false
var gPathIdx = 0
const piece = { pos: { x: 0, y: 0 }, color: 'white' }

function onInit() {
    gBoard = createBoard()
    gInaugurationRow = { b: 0, w: gBoardSize - 1 }
    console.table(gBoard)
    renderBoard('.board', gBoard)

}

function createBoard() {
    const board = []
    for (var i = 0; i < gBoardSize; i++) {
        board[i] = []
        for (var j = 0; j < gBoardSize; j++) {
            board[i][j] = ''
            if ((i + j) % 2 !== 0 && (i <= 2 || i >= 5)) {
                board[i][j] = { isQueen: false, color: i <= 2 ? 'w' : 'b' }
            }
        }
    }
    return board
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
                            onclick = "handlePieceMovement(this,${i},${j})">`

            if (currPiece.color === 'w') var pieceStrHTML = `<div class = "piece white-piece" onclick="onPieceClick(this,${i},${j})"> </div>`
            else if (currPiece.color === 'b') var pieceStrHTML = `<div class = "piece black-piece" onclick="onPieceClick(this,${i},${j})"> </div>`
            else var pieceStrHTML = ''

            strHTML += `${pieceStrHTML} </div>`
        }
    }

    elBoardCont.innerHTML = strHTML
}

function onPieceClick(elPiece, i, j) {
    if (isAnimationOn) return
    if (gActivePiecePos) {
        var elPrevActivePiece = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j} .piece`)
        elPrevActivePiece.classList.remove('active')
    }
    gPossiblePathPos = []
    clearActiveSquares()
    gActivePiecePos = { i, j }

    // var elPiece = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j} .piece`)
    elPiece.classList.add('active')
    addPossiblePaths(i, j, gBoard[i][j])
    markPossibleSquares()

}

function handlePieceMovement(elSquare, i, j) {
    if (!(elSquare.classList.contains('active') || elSquare.classList.contains('eat-move-land-square'))) return

    const selectedPos = { i, j }
    const activePiece = gBoard[gActivePiecePos.i][gActivePiecePos.j]

    gBoard[gActivePiecePos.i][gActivePiecePos.j] = ''

    var chosenPath = gPossiblePathPos.filter(path => path.some(step =>
        step.landPos.i === selectedPos.i && step.landPos.j === selectedPos.j
    )
    )[0]



    if (chosenPath[0].eatPos) {
        var oldPiecePos = gActivePiecePos

        isAnimationOn = true
        gIntervalID = setInterval(() => {

            if (oldPiecePos.i === i && oldPiecePos.j === j) {
                clearInterval(gIntervalID)

                isAnimationOn = false
                gPathIdx = 0
                gActivePiecePos = null
                clearActiveSquares()

                return
            }

            hopMove(oldPiecePos, chosenPath, activePiece)
            eatRivalPiece(chosenPath, gPathIdx)

            oldPiecePos = chosenPath[gPathIdx].landPos
            gPathIdx++
        }, 400, gActivePiecePos, i, j)
    } else {
        clearActiveSquares()
        gBoard[i][j] = activePiece

        const originSquare = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j}`)
        const squareRect = originSquare.getBoundingClientRect()
        const oldTranslatePos = { x: squareRect.x, y: squareRect.y }
        const newTranslatePos = getSquareDOMpos({ i, j })
        const translatePos = getTranslatePos(oldTranslatePos, newTranslatePos)

        // setTimeout(() => {
        //     renderPiece(gActivePiecePos, translatePos, { i, j })
        // }, 300, gActivePiecePos, translatePos, i, j)

        renderPiece(gActivePiecePos, translatePos, { i, j })
        gActivePiecePos = null

    }

    console.log('gInaugurationRow[activePiece.color]',gInaugurationRow[activePiece.color])
    if (i === gInaugurationRow[activePiece.color]) {
        activePiece.isQueen = true
    }

    // renderBoard('.board', gBoard)
}


function eatRivalPiece(chosenPath, idx) {
    var currRivalPiecePos = chosenPath[idx].eatPos
    gBoard[currRivalPiecePos.i][currRivalPiecePos.j] = ''

    var currLandPos = chosenPath[idx].landPos

    var elCurrRivalPiece = document.querySelector(`.square-${currRivalPiecePos.i}-${currRivalPiecePos.j} .piece`)
    elCurrRivalPiece.style.opacity = '0'
    elCurrRivalPiece.style.gridColumn = ''
    elCurrRivalPiece.style.gridRow = ''
    elCurrRivalPiece.style.zIndex = '-10'
}

// function createBoard(size) {
//     for (var i = 0; i < size; i++) {
//         if (i % 2 !== 0) {
//             evenPiece = 'white'
//             oddSquareClassName = 'black'
//         } else {
//             evenSquareClassName = 'black'
//             oddSquareClassName = 'white'
//         }

//         for (var j = 0; j < size; j++) {
//         }
//     }
// }

function clearActiveSquares() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elSquare = document.querySelector(`.square-${i}-${j}`)
            elSquare.classList.remove('active')
            elSquare.classList.remove('eat-move-land-square')
            elSquare.classList.remove('eat')

            var elPiece = elSquare.querySelector(`.piece`)
            if (elPiece) elPiece.classList.remove('eaten-move')
        }
    }
}

function addPossiblePaths(i, j, piece) {
    const dir = piece.color === 'w' ? 1 : -1
    const squareNegPos = getNeighborPos(gBoard, i, j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currPos = squareNegPos[idx]
        var currNeg = gBoard[currPos.i][currPos.j]

        var dist = getSquareDist(currPos, { i, j }, piece)
        var absDist = getAbsDist(dist)

        var currLandPos = { i: currPos.i, j: currPos.j }

        if (dir * currPos.i <= dir * i) {
            continue

        } else if (absDist === 2 && currNeg === '' ||
            currPos.i === gInaugurationRow[piece.color]
        ) {
            gPossiblePathPos.push([{ 'landPos': currLandPos }])

        } else if (currNeg.color !== piece.color && currNeg !== '' && gBoard[currLandPos.i + dist.i][currLandPos.j + dist.j] === '') {
            currLandPos.i += dist.i
            currLandPos.j += dist.j
            gPossiblePathPos.push(getCapturePath(currPos, currLandPos, [], currNeg))
        } else {
            continue
        }

        if (gPossiblePathPos.some(path => path[0].eatPos)) gPossiblePathPos = gPossiblePathPos.filter(path => path[0].eatPos)
    }
}

function markPossibleSquares() {
    gPossiblePathPos.forEach(path => path.forEach(step => {
        var elLandSquare = document.querySelector(`.square-${step.landPos.i}-${step.landPos.j}`)
        if (step.eatPos) {
            var elRivalSquare = document.querySelector(`.square-${step.eatPos.i}-${step.eatPos.j}`)
            elRivalSquare.classList.add('eat')

            var elRivalPiece = elRivalSquare.querySelector(`.piece`)
            elRivalPiece.classList.add('eaten-move')

            elLandSquare.classList.add('eat-move-land-square')
        } else {
            elLandSquare.classList.add('active')
        }
    }))
}

function markPossibleDiagSquares() {

}

function getPossibleEatPos(board, pos) {
    const squareNegPos = getNeighborPos(gBoard, pos.i, pos.j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currPos = squareNegPos[idx]
        var currNeg = gBoard[currPos.i][currPos.j]
        if (currNeg.color === piece.color || getSquareDist({ i, j }, currPos) > 1) {
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

function getCapturePath(rivalNegPos, landingPos, pathPos, piece) {

    pathPos.push({ 'eatPos': rivalNegPos, 'landPos': landingPos })

    // var elCurrNegSquare = document.querySelector(`.square-${rivalNegPos.i}-${rivalNegPos.j}`)
    // elCurrNegSquare.classList.add('eat')

    // var elCurrNegPiece = elCurrNegSquare.querySelector(`.piece`)
    // elCurrNegPiece.classList.add('eaten-move')

    // var elCurrNegLandSquare = document.querySelector(`.square-${landingPos.i}-${landingPos.j}`)
    // elCurrNegLandSquare.classList.add('eat-move-land-square')

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

        if (currNextNeg.color === piece.color && gBoard[currNexLandPos.i][currNexLandPos.j] === '') {
            getCapturePath(currNextPos, currNexLandPos, pathPos, piece)
        }

    }

    return pathPos
}

function renderPiece(oldPos, translatePos, newPos) {
    const piece = gBoard[newPos.i][newPos.j]
    if (piece.color === 'w') var pieceStrHTML = `<div class = "piece white-piece" onclick="onPieceClick(this,${newPos.i},${newPos.j})"> </div>`
    else if (piece.color === 'b') var pieceStrHTML = `<div class = "piece black-piece" onclick="onPieceClick(this,${newPos.i},${newPos.j})"> </div>`

    const elOldSquare = document.querySelector(`.square-${oldPos.i}-${oldPos.j}`)
    elOldSquare.classList.remove('active')

    const elPiece = elOldSquare.querySelector(`.piece`)
    elPiece.classList.remove('active')
    elPiece.style.transform = `translate(${translatePos.x}px, ${translatePos.y}px)`;


    const elNewSquare = document.querySelector(`.square-${newPos.i}-${newPos.j}`)

    setTimeout(() => {
        elOldSquare.innerHTML = ''
        elNewSquare.innerHTML = pieceStrHTML
        if (piece.isQueen) renderQueen(newPos,piece)
    }, 300)


}

function hopMove(oldPiecePos, chosenPath, activePiece) {
    gBoard[oldPiecePos.i][oldPiecePos.j] = ''
    gBoard[chosenPath[gPathIdx].landPos.i][chosenPath[gPathIdx].landPos.j] = activePiece

    const elOriginSquare = document.querySelector(`.square-${oldPiecePos.i}-${oldPiecePos.j}`)
    const squareRect = elOriginSquare.getBoundingClientRect()
    const oldTranslatePos = { x: squareRect.x, y: squareRect.y }
    const newTranslatePos = getSquareDOMpos(chosenPath[gPathIdx].landPos)
    const translatePos = getTranslatePos(oldTranslatePos, newTranslatePos)

    renderPiece(oldPiecePos, translatePos, chosenPath[gPathIdx].landPos)
}

function eatMove(oldPiecePos, chosenPath, activePiece) {
    hopMove(oldPiecePos, chosenPath, activePiece)
    eatRivalPiece(chosenPath, gPathIdx)

    oldPiecePos = chosenPath[gPathIdx].landPos
    gPathIdx++
}

function renderQueen(piecePos,piece) {
    const elPiece = document.querySelector(`.square-${piecePos.i}-${piecePos.j}  .piece`)
    console.log('elPiece', elPiece)

    elPiece.classList.add(`${piece.color}-queen`)
}