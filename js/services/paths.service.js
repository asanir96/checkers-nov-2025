'use strict'
var gPossiblePaths

function createPossiblePaths(i, j, piece) {
    clearPaths()
    const board = getBoard()
    const inaugurationRow = getInaugurationRow()

    const dir = piece.color === 'w' ? 1 : -1
    const squareNegPos = getNeighborPos(board, i, j)

    for (var idx = 0; idx < squareNegPos.length; idx++) {
        var currPos = squareNegPos[idx]
        var currNeg = board[currPos.i][currPos.j]
        
        var dist = getSquareDist(currPos, { i, j }, piece)
        var absDist = getAbsDist(dist)

        var currLandPos = { i: currPos.i, j: currPos.j }

        if (dir * currPos.i <= dir * i) {
            continue

        } else if (absDist === 2 && currNeg === '' ||
            currPos.i === inaugurationRow[piece.color]
        ) {
            gPossiblePaths.push([{ 'landPos': currLandPos }])

        } else if (currNeg.color !== piece.color && currNeg !== '' && gBoard[currLandPos.i + dist.i][currLandPos.j + dist.j] === '') {
            currLandPos.i += dist.i
            currLandPos.j += dist.j
            gPossiblePaths.push(_getCapturePath(currPos, currLandPos, [], currNeg))
        } else {
            continue
        }
        console.log()
        if (gPossiblePaths.some(path => path[0].eatPos)) gPossiblePaths = gPossiblePaths.filter(path => path[0].eatPos)
    }
}


function getPossiblePaths() {
    return gPossiblePaths
}

function _getCapturePath(rivalNegPos, landingPos, pathPos, piece) {
    const board = getBoard()
    pathPos.push({ 'eatPos': rivalNegPos, 'landPos': landingPos })

    const negPos = getNeighborPos(board, landingPos.i, landingPos.j)

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
            _getCapturePath(currNextPos, currNexLandPos, pathPos, piece)
        }

    }

    return pathPos
}

function clearPaths(){
    gPossiblePaths = []
}