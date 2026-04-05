'use strict'

var gIntervalID
var gActivePiecePos = null
var isAnimationOn = false
var gPathIdx = 0

function onInit() {
    renderBoard('.board')
}

function renderBoard(boardContSelector) {
    const board = getBoard()

    const elBoardCont = document.querySelector(boardContSelector)
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var classList = `square square-${i}-${j} `

            classList += (i + j) % 2 === 0 ? 'black-square' : 'white-square'
            var currPiece = board[i][j]

            strHTML += `<div class="${classList}" 
                            onmousehover= "onHover(this)"
                            onclick = "onMoveToSquare(this,${i},${j})">`

            if (currPiece.color === 'w') var pieceStrHTML = `<div class = "piece white-piece" onclick="onMarkPossiblePaths(this,${i},${j})"> </div>`
            else if (currPiece.color === 'b') var pieceStrHTML = `<div class = "piece black-piece" onclick="onMarkPossiblePaths(this,${i},${j})"> </div>`
            else var pieceStrHTML = ''

            strHTML += `${pieceStrHTML} </div>`
        }
    }

    elBoardCont.innerHTML = strHTML
}

function onMarkPossiblePaths(elPiece, i, j) {
    const board = getBoard()

    if (isAnimationOn) return

    if (gActivePiecePos) {
        var elPrevActivePiece = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j} .piece`)
        elPrevActivePiece.classList.remove('active')
    }

    clearActiveSquares()
    gActivePiecePos = { i, j }

    elPiece.classList.add('active')
    createPossiblePaths(i, j, board[i][j])
    markPossibleSquares()

}

function onMoveToSquare(elSquare, i, j) {
    const board = getBoard()
    const possiblePaths = getPossiblePaths()

    if (!possiblePaths || !isPosInPaths({ i, j }, possiblePaths) ) return

    const selectedPos = { i, j }
    const activePiece = board[gActivePiecePos.i][gActivePiecePos.j]

    updateSquare(gActivePiecePos, '')

    var chosenPath = possiblePaths.filter(path => path.some(step =>
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
        updateSquare({ i, j }, activePiece)

        const originSquare = document.querySelector(`.square-${gActivePiecePos.i}-${gActivePiecePos.j}`)
        const squareRect = originSquare.getBoundingClientRect()
        const oldTranslatePos = { x: squareRect.x, y: squareRect.y }
        const newTranslatePos = getSquareDOMpos({ i, j })
        const translatePos = getTranslatePos(oldTranslatePos, newTranslatePos)

        renderPiece(gActivePiecePos, translatePos, { i, j })
        gActivePiecePos = null

    }
}

function eatRivalPiece(chosenPath, idx) {
    var currRivalPiecePos = chosenPath[idx].eatPos
    updateSquare(currRivalPiecePos, '')

    var currLandPos = chosenPath[idx].landPos

    var elCurrRivalPiece = document.querySelector(`.square-${currRivalPiecePos.i}-${currRivalPiecePos.j} .piece`)
    elCurrRivalPiece.style.opacity = '0'
    elCurrRivalPiece.style.gridColumn = ''
    elCurrRivalPiece.style.gridRow = ''
    elCurrRivalPiece.style.zIndex = '-10'
}

function clearActiveSquares() {
    const board = getBoard()

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var elSquare = document.querySelector(`.square-${i}-${j}`)
            elSquare.classList.remove('active')
            elSquare.classList.remove('eat-move-land-square')
            elSquare.classList.remove('eat')

            var elPiece = elSquare.querySelector(`.piece`)
            if (elPiece) elPiece.classList.remove('eaten-move')
        }
    }
}

function markPossibleSquares() {
    const possiblePaths = getPossiblePaths()
    console.log(possiblePaths)
    possiblePaths.forEach(path => path.forEach(step => {
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

function renderPiece(oldPos, translatePos, newPos) {
    const board = getBoard()
    const piece = board[newPos.i][newPos.j]

    if (piece.color === 'w') var pieceStrHTML = `<div class = "piece white-piece" onclick="onMarkPossiblePaths(this,${newPos.i},${newPos.j})"> </div>`
    else if (piece.color === 'b') var pieceStrHTML = `<div class = "piece black-piece" onclick="onMarkPossiblePaths(this,${newPos.i},${newPos.j})"> </div>`

    const elOldSquare = document.querySelector(`.square-${oldPos.i}-${oldPos.j}`)
    elOldSquare.classList.remove('active')

    const elPiece = elOldSquare.querySelector(`.piece`)
    elPiece.classList.remove('active')
    elPiece.style.transform = `translate(${translatePos.x}px, ${translatePos.y}px)`;


    const elNewSquare = document.querySelector(`.square-${newPos.i}-${newPos.j}`)

    setTimeout(() => {
        elOldSquare.innerHTML = ''
        elNewSquare.innerHTML = pieceStrHTML
        if (piece.isQueen) renderQueen(newPos, piece)
    }, 300)


}

function hopMove(oldPiecePos, chosenPath, activePiece) {
    updateSquare(oldPiecePos, '')
    updateSquare(chosenPath[gPathIdx].landPos, activePiece)

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

function renderQueen(piecePos, piece) {
    const elPiece = document.querySelector(`.square-${piecePos.i}-${piecePos.j}  .piece`)

    elPiece.classList.add(`${piece.color}-queen`)
}

function isPosInPaths(pos, paths) {
    return paths.some(path => path.some(step =>  step.landPos.i === pos.i && step.landPos.j === pos.j))
}