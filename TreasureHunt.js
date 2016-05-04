Qt.include("pathfinding/pathfinding.js")
var blockSize = 128
var maxColumn = 10
var maxRow = 15
var maxIndex = maxColumn * maxRow
var board = new Array(maxIndex)
var component
var xOffs = 0
var yOffs = 0
var trapsFound = 0
var trapsToFind = 10
var dead = 0
var playerX = 0
var playerY = 0
function isDead() {
    return dead == 1
}


//Index function used instead of a 2D array
function index(column, row) {
    return column + (row * maxColumn)
}
function die() {
    dead = 1
    trapsFoundShow.text = "KABOOM!"
}


function movePlayer(x, y) {
    board[index(playerX, playerY)].isPlayer = 0
    playerX = x
    playerY = y
    board[index(playerX, playerY)].isPlayer = 1
    if (showBlock(playerX, playerY, 1, 5,1) == -1)
        die()
}

function startNewGame() {
    dead = 0
    trapsFoundShow.text = "..."


    playerX = 0
    playerY = 0
    //Delete blocks from previous game
    for (var i = 0; i < maxIndex; i++) {
        if (board[i] != null)
            board[i].destroy()
    }

    //Calculate board size
    maxColumn = Math.floor(gameCanvas.width / blockSize)
    maxRow = Math.floor(gameCanvas.height / blockSize)
    xOffs = (gameCanvas.width - (maxColumn * blockSize)) / 2
    yOffs = (gameCanvas.height - (maxRow * blockSize)) / 2

    maxIndex = maxRow * maxColumn

    //Initialize Board
    board = new Array(maxIndex)
    for (var column = 0; column < maxColumn; column++) {
        for (var row = 0; row < maxRow; row++) {
            board[index(column, row)] = 0
        }
    }
    for (var i = 0; i < trapsToFind; i++) {
        var passed = false
        while (!passed) {
            var x = Math.floor(Math.random() * maxColumn)
            var y = Math.floor(Math.random() * maxRow)
            if (board[index(x, y)] != -1) {
                board[index(x, y)] = -1
                passed = true
            }
            if (x == playerX && y == playerY){
                board[index(x, y)] = 0
                passed = false
            }
        }
        for (var a = x - 1; a <= x + 1; a++)
            for (var b = y - 1; b <= y + 1; b++) {
                if (a >= 0 && a < maxColumn)
                    if (b >= 0 && b < maxRow)
                        if (board[index(a, b)] !== -1)
                            board[index(a, b)]++
            }
    }

    for (var column = 0; column < maxColumn; column++) {
        for (var row = 0; row < maxRow; row++) {
            createBlock(column, row, board[index(column, row)])
        }
    }
    movePlayer(playerX, playerY)
}

function createBlock(column, row, value) {
    if (component == null)
        component = Qt.createComponent("Block.qml")

    // Note that if Block.qml was not a local file, component.status would be
    // Loading and we should wait for the component's statusChanged() signal to
    // know when the file is downloaded and ready before calling createObject().
    if (component.status == Component.Ready) {
        var dynamicObject = component.createObject(gameCanvas)
        if (dynamicObject == null) {
            console.log("error creating block")
            console.log(component.errorString())
            return false
        }
        dynamicObject.x = xOffs + column * blockSize
        dynamicObject.y = yOffs + row * blockSize
        dynamicObject.width = blockSize
        dynamicObject.height = blockSize
        dynamicObject.text = value
        dynamicObject.dataHidden = 1
        dynamicObject.marked = 0
        dynamicObject.isPlayer = 0
        board[index(column, row)] = dynamicObject
    } else {
        return false
    }
    return true
}

function showBlock(column, row, stepIfMarked, distance, stepped) {
    if (distance < 0)
        return
    if (column >= maxColumn || column < 0 || row >= maxRow || row < 0)
        return 0
    if (board[index(column, row)] == null)
        return 0
    if (board[index(column, row)].dataHidden == 0 && !stepped)
        return 0
    if (board[index(column, row)].marked == 1 & !stepIfMarked)
        return 0

    board[index(column, row)].dataHidden = 0
    if (board[index(column, row)].text == -1)
        return -1
    if (board[index(column, row)].text == "0") {
        for (var a = column - 1; a <= column + 1; a++)
            for (var b = row - 1; b <= row + 1; b++) {
                showBlock(a, b, stepIfMarked, distance - 1, 0)
            }
    }
}
function markBlock(column, row) {
    if (board[index(column,
                    row)].dataHidden == 0 && board[index(column,
                                                         row)].marked == 0)
        return

    if (board[index(column, row)].marked == 0) {
        board[index(column, row)].marked = 1
        if (board[index(column, row)].text == -1) {
            trapsFound++
        } else
            trapsFound--
    } else {
        board[index(column, row)].marked = 0
        if (board[index(column, row)].text == -1) {
            trapsFound--
        } else
            trapsFound++
    }
    trapsFoundShow.text = (trapsFound == 10) ? "WIN" : "..." // cheat

    return
}

function handleClick(xPos, yPos, rightPressed) {
    var column = Math.floor((xPos - xOffs) / blockSize)
    var row = Math.floor((yPos - yOffs) / blockSize)
    if (column >= maxColumn || column < 0 || row >= maxRow || row < 0)
        return 0
    if (board[index(column, row)] == null)
        return 0
    if (rightPressed) {
        markBlock(column, row)
        return
    }
    /* check whether there is a path from playerX, playerY to here */
    var dim = Math.max(maxColumn, maxRow)
    var walkability = new Array(dim)
    for (var i = 0; i < dim; i++) {
        walkability[i] = new Array(dim)
        for (var j = 0; j < dim; j++)
            walkability[i][j] = 1 // unwalkable
    }
    for (var ro = 0; ro < maxRow; ro++)
        for (var col = 0; col < maxColumn; col++) {
            walkability[ro][col] = board[index(
                                             col,
                                             ro)].dataHidden // not hidden: walkable
            board[index(col,ro)].isRoute=0
        }
    walkability[row][column] = 0 // dest is walkable
    walkability[playerY][playerX] = 0 // current place is walkable
/*    for (var ro = playerY - 1; ro <= playerY + 1; ro++)
        for (var col = playerX - 1; col <= playerX + 1; col++) {
            if (ro >= 0 && ro <= maxRow && col >= 0 && col <= maxColumn)
                walkability[ro][col] = 0 // neigh
        }*/
    var path = findPath(walkability, [playerY, playerX], [row, column])
    for(var i=0;i<path.length;i++)
        board[index(path[i][1],path[i][0])].isRoute=1
    console.log("Here")
    if (path.length > 0) {
        console.log(JSON.stringify(path))

        movePlayer(column, row)
    }

    //movePlayer(column,row)
}
function handleDoubleClick(xPos, yPos) {
    var column = Math.floor((xPos - xOffs) / blockSize)
    var row = Math.floor((yPos - yOffs) / blockSize)
    if (column >= maxColumn || column < 0 || row >= maxRow || row < 0)
        return 0
    if (board[index(column, row)] == null)
        return 0
    if (board[index(column, row)].dataHidden == 1)
        return 0
    if (board[index(column, row)].marked == 1)
        return 0
    var marked = 0
    for (var a = column - 1; a <= column + 1; a++)
        for (var b = row - 1; b <= row + 1; b++)
            if (a >= maxColumn || a < 0 || b >= maxRow || b < 0)
                continue
            else if (board[index(a, b)].marked == 1)
                marked++
    if (marked == board[index(column, row)].text)
        for (var a = column - 1; a <= column + 1; a++)
            for (var b = row - 1; b <= row + 1; b++)
                if (showBlock(a, b, 0, 0, 0) == -1)
                    die()
}
