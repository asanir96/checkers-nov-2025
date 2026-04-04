'use strict'
function getNeighborPos(mat, row, col) {
    const neighborPos = []
    const cell = mat[row][col]

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === row && j === col) continue

            neighborPos.push({ i, j })
        }
    }
    return neighborPos
}

function getSquareDist(square1Pos, square2pos, piece) {
    const distJ = (square1Pos.j - square2pos.j)
    const distI = (square1Pos.i - square2pos.i)

    return { i: distI, j: distJ }
}


function getAbsDist(dist) {
    var absDist = 0
    for (var dimDist in dist) {
        absDist += Math.abs(dist[dimDist])
    }

    return absDist
}

function containsObject(array, obj) {
    for (var idx = 0; idx < array.length; idx++) {
        if (array[idx].landPos.i === obj.i && array[idx].landPos.j === obj.j) return true
    }
    return false
}

function getSquareDOMpos(pos) {
    const elSquare = document.querySelector(`.square-${pos.i}-${pos.j}`)
    const elPiece = elSquare.querySelector(`.piece`)
    const rect = elSquare.getBoundingClientRect()

    return { x: rect.x, y: rect.y }
    console.log('rect.top', rect)
    console.log('rect.left', rect.left)
    // return {}
    elPiece.style.transform = `translate(${moveX}, ${moveY})`;

}


function getTranslatePos(oldTranslatePos, newTranslatePos) {
    const translatePos = { x: newTranslatePos.x - oldTranslatePos.x, y: newTranslatePos.y - oldTranslatePos.y }
    return translatePos
}