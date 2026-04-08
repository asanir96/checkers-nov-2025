'use strict'
var gBoard = []
const gBoardSize = 8
var gActivePiecePos
const gInaugurationRow = { b: 0, w: gBoardSize - 1 }

_createBoard()

function _createBoard() {
    for (var i = 0; i < gBoardSize; i++) {
        gBoard[i] = []
        for (var j = 0; j < gBoardSize; j++) {
            gBoard[i][j] = ''
            if ((i + j) % 2 !== 0 && (i <= 2 || i >= 5)) {
                gBoard[i][j] = createPiece(false, i <= 2 ? 'w' : 'b')
            }
        }
    }
}



function getBoard() {
    return gBoard
}

function getInaugurationRow() {
    return gInaugurationRow
}


function updateSquare(pos, content) {
    gBoard[pos.i][pos.j] = content

    if (content !== '' && pos.i === gInaugurationRow[content.color]) {
        updatePiece(content.id, 'isQueen', true)
    }
    clearPaths()

}