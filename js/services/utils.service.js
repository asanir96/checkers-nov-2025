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

function makeid(length = 5) {
	var id = ''
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (var i = 0; i < length; i++) {
		id += chars.charAt(getRandomInt(0, chars.length))
	}
	return id
}

function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)
	return Math.floor(Math.random() * (maxFloored - minCeiled)) + minCeiled // The maximum is exclusive and the minimum is inclusive
}
