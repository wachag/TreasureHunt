var blockSize = 64
var maxColumn = 10
var maxRow = 15
var maxIndex = maxColumn * maxRow
var board = new Array(maxIndex)
var component
var xOffs = 0
var yOffs = 0
//Index function used instead of a 2D array
function index(column, row) {
    return column + (row * maxColumn)
}

function startNewGame() {
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
    for (var i = 0; i < 10; i++) {
        var passed = false
        while (!passed) {
            var x = Math.floor(Math.random() * maxColumn)
            var y = Math.floor(Math.random() * maxRow)
            if (board[index(x, y)] != -1) {
                board[index(x, y)] = -1
                passed = true
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
        board[index(column, row)] = dynamicObject
    } else {
        return false
    }
    return true
}

function showBlock(column, row, stepIfMarked) {
    if (column >= maxColumn || column < 0 || row >= maxRow || row < 0)
        return 0
    if (board[index(column, row)] == null)
        return 0
    if (board[index(column, row)].dataHidden == 0)
        return 0
    if (board[index(column, row)].marked == 1 & !stepIfMarked)
        return 0
    board[index(column, row)].dataHidden = 0
    if (board[index(column, row)].text == -1)
        return -1
    if (board[index(column, row)].text == "0") {
        for (var a = column - 1; a <= column + 1; a++)
            for (var b = row - 1; b <= row + 1; b++) {
                showBlock(a, b,stepIfMarked)
            }
    }
}

function handleClick(xPos, yPos, rightPressed) {
    var column = Math.floor((xPos - xOffs) / blockSize)
    var row = Math.floor((yPos - yOffs) / blockSize)
    if (column >= maxColumn || column < 0 || row >= maxRow || row < 0)
        return 0
    if (board[index(column, row)] == null)
        return 0
    if (rightPressed) {
        if (board[index(column, row)].dataHidden == 0 &&board[index(column, row)].marked == 0)return

        if (board[index(column, row)].marked == 0)
            board[index(column, row)].marked = 1
        else
            board[index(column, row)].marked = 0
        return
    }
    if (showBlock(column, row,1) == -1)
        console.log("DIE!")
}
function handleDoubleClick(xPos, yPos) {
    var column = Math.floor((xPos - xOffs) / blockSize)
    var row = Math.floor((yPos - yOffs) / blockSize)
    console.log("Double")
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

                if (showBlock(a, b, 0) == -1)
                    console.log("DIE!")
}
