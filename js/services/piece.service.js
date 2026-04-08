'use strict'
var gPossiblePaths
var gPossibleQueenPaths


function createPiece(isQueen, color) {
    return { id: makeid(), isQueen, color }
}

function getPiece(pieceId) {
    const pieces = gBoard.reduce((acc, row) => {
        acc.push(...row.filter(cell => cell !== ''))
        return acc
    }, [])
    return pieces.find(pieces => pieces.id === pieceId)
}

function updatePiece(pieceId, property, value) {
    const piece = getPiece(pieceId)
    piece[property] = value
}


function createPossiblePaths(i, j, piece) {
    clearPaths()
    const board = getBoard()
    const inaugurationRow = getInaugurationRow()

    const dir = piece.color === 'w' ? 1 : -1
    const squareNegPos = getNeighborPos(board, i, j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currStep = _createStep({ i, j }, squareNegPos[idx])

        var delta = getSquareDelta(currStep.to, { i, j }, piece)
        var absDelta = getAbsDelta(delta)

        if (!_isStepPossible(board, currStep, dir, { i, j })) {
            continue

        } else if (_isStepRegular(board, absDelta, currStep, inaugurationRow, piece)) {
            gPossiblePaths.push([currStep])

        } else if (_isStepEat(board, piece, currStep, delta)) {
            currStep.eatPos = { i: currStep.to.i, j: currStep.to.j }
            currStep.to.i += delta.i
            currStep.to.j += delta.j

            // const nextPos
            gPossiblePaths.push(_getEatPath(currStep, [], board[currStep.eatPos.i][currStep.eatPos.j]))
        } else {
            continue
        }

        if (gPossiblePaths.some(path => path[0].eatPos)) gPossiblePaths = gPossiblePaths.filter(path => path[0].eatPos)
    }
}


function getPossiblePaths() {
    return gPossiblePaths
}

function _getEatPath(step, pathPos, piece) {
    const board = getBoard()
    pathPos.push(_createStep(step.from, step.to, step.eatPos))
    step.from = step.to
    step.to = null
    const negPos = getNeighborPos(board, step.from.i, step.from.j)

    for (var idx = 0; idx < negPos.length; idx++) {
        // var currStep = _createStep(previousStep.to, negPos[idx])
        step.to = negPos[idx]
        var delta = getSquareDelta(negPos[idx], step.from, piece)

        var nextStep = _createStep(step.to, { i: step.to.i + delta.i, j: step.to.j + delta.j })

        if (_isStepOutOfBounds(board, nextStep)) continue
        if (step.to.i === step.eatPos.i && step.to.j === step.eatPos.j) continue

        if (board[step.to.i][step.to.j].color === piece.color && board[nextStep.to.i][nextStep.to.j] === '') {
            step.eatPos = step.to
            step.from = nextStep.from
            step.to = nextStep.to
            _getEatPath(step, pathPos, piece)
        }

    }

    return pathPos
}

function clearPaths() {
    gPossiblePaths = []
}

function createPossibleQueenPaths(i, j, piece) {
    clearPaths()
    const board = getBoard()

    const dir = piece.color === 'w' ? 1 : -1
    const squareNegPos = getNeighborPos(board, i, j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currPos = squareNegPos[idx]
        var currNeg = board[currPos.i][currPos.j]

        var delta = getSquareDelta(currPos, { i, j }, piece)
        var absDelta = getAbsDelta(delta)

        var currLandPos = { i: currPos.i, j: currPos.j }

        if (dir * currPos.i <= dir * i) {
            continue

        } else if (absDelta === 2 && currNeg === '' ||
            currPos.i === inaugurationRow[piece.color]
        ) {
            gPossibleQueenPaths.push([{ 'to': currLandPos }])

        } else if (_isStepPossibleEat(piece, currNeg, currLandPos, delta)) {
            // } else if (currNeg.color !== piece.color && currNeg !== '' && gBoard[currLandPos.i + dist.i][currLandPos.j + dist.j] === '') {
            currLandPos.i += delta.i
            currLandPos.j += delta.j
            gPossiblePaths.push(_getEatPath(currPos, currLandPos, [], currNeg))
        } else {
            continue
        }
        console.log()
        if (gPossiblePaths.some(path => path[0].eatPos)) gPossiblePaths = gPossiblePaths.filter(path => path[0].eatPos)
    }
}

function _isStepOutOfBounds(board, step) {
    return step.to.i >= board.length ||
        step.to.j >= board.length ||
        step.to.i < 0 ||
        step.to.j < 0
}
function _isStepRegular(board, absDelta, step, inaugurationRow, piece) {
    const pos = step.to
    const neg = board[pos.i][pos.j]

    return absDelta === 2 && neg === '' ||
        pos.i === inaugurationRow[piece.color]
}

function _isStepPossible(board, step, moveDirection, currPiecePos) {
    const piece = board[step.to.i][step.to.j]

    if (!piece.isQueen) return moveDirection * step.to.i > moveDirection * currPiecePos.i
    else return true
}

function _isStepEat(board, piece, step, delta) {
    const pos = step.to
    const neg = board[pos.i][pos.j]
    if (piece.isQueen) {
        return (neg.color !== piece.color &&
            neg !== '' &&
            gBoard[pos.i + delta.i][pos.j + delta.j] === '')
    }
    else {
        return (neg.color !== piece.color &&
            neg !== '' &&
            gBoard[pos.i + delta.i][pos.j + delta.j] === '')
    }
}

function _createStep(from, to, eatPos) {
    const step = { from, to }
    step.eatPos = eatPos ? eatPos : null

    return step
}

function updateStep(step, posToUpdate, delta) {
    step[posToUpdate].i += delta.i
    step[posToUpdate].j += delta.j
}

function getAbsDelta(delta) {
    var absDelta = 0
    for (var dimDelta in delta) {
        absDelta += Math.abs(delta[dimDelta])
    }

    return absDelta
}

function getSquareDelta(square1Pos, square2pos, piece) {
    const dJ = (square1Pos.j - square2pos.j)
    const dI = (square1Pos.i - square2pos.i)

    return { i: dI, j: dJ }
}

function createQueenPaths(i, j, piece) {
    clearPaths()
    const board = getBoard()
    const inaugurationRow = getInaugurationRow()

    const dir = piece.color === 'w' ? 1 : -1
    const squareNegPos = getNeighborPos(board, i, j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currStep = _createStep({ i, j }, squareNegPos[idx])
        var delta = getSquareDelta(currStep.to, currStep.from, piece)
        console.log('currStep', currStep)
        if (board[currStep.to.i][currStep.to.j] === '') {
            var currPath = addSquaresToQueenPath(currStep, delta, board, [])
            gPossiblePaths.push(currPath)
        }
    }
}

function addSquaresToQueenPath(previousStep, delta, board, path) {

    var step = _createStep(previousStep.from, previousStep.to)
    console.log('addSquaresToQueenPath --> board[step.to.i][step.to.j]', board[step.to.i][step.to.j])
    console.log('addSquaresToQueenPath --> path]', path)
    while (
        step.to.i >= 0 &&
        step.to.i < board.length &&
        step.to.j >= 0 &&
        step.to.j < board[0].length &&
        board[step.to.i][step.to.j] === ''
    ) {
        path.push(step)
        previousStep = step
        step = _createStep(previousStep.to, { i: previousStep.to.i + delta.i, j: previousStep.to.j + delta.j })
        console.log('addSquaresToQueenPath --> step.i', step.to.i)
        console.log('addSquaresToQueenPath --> step.j', step.to.j)
    }
    return path
}