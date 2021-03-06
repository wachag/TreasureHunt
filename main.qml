import QtQuick 2.3
import QtQuick.Window 2.2
import "TreasureHunt.js" as TreasureHunt

Window {
    visible: true
    width: 490
    height: 720

    Rectangle {
        visible: true
        id: screen

        width: parent.width
        height: parent.height

        SystemPalette {
            id: activePalette
        }

        Item {
            width: parent.width
            anchors {
                top: parent.top
                bottom: toolBar.top
            }
            Image {
                id: gameCanvas

                anchors.fill: parent
                source: "assets/background.jpg"
                fillMode: Image.PreserveAspectCrop
            }
            MouseArea {
                anchors.fill: parent
                onClicked: if(!TreasureHunt.isDead())TreasureHunt.handleClick(
                               mouse.x, mouse.y, mouse.button == Qt.RightButton)
                onDoubleClicked:if(!TreasureHunt.isDead())TreasureHunt.handleDoubleClick(
                                    mouse.x, mouse.y)
                onPressAndHold: if(!TreasureHunt.isDead())TreasureHunt.handleClick(
                                                              mouse.x, mouse.y, 1)
                acceptedButtons:  Qt.LeftButton | Qt.RightButton

            }
        }

        Rectangle {
            id: toolBar
            width: parent.width
            height: 30
            color: activePalette.window
            anchors.bottom: screen.bottom

            Button {
                anchors {
                    left: parent.left
                    verticalCenter: parent.verticalCenter
                }
                text: "New Game"
                onClicked: TreasureHunt.startNewGame()
            }

            Text {
                id: trapsFoundShow
                anchors {
                    right: parent.right
                    verticalCenter: parent.verticalCenter
                }
                text: "0"
            }
        }
    }
}
