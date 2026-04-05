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
                gBoard[i][j] = _createPiece(false, i <= 2 ? 'w' : 'b')
            }
        }
    }
}

function _createPiece(isQueen, color) {
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