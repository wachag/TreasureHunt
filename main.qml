import QtQuick 2.3
import QtQuick.Window 2.2
import "TreasureHunt.js" as TreasureHunt


    Rectangle {
        id: screen

        width: 490
        height: 720

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
                       source: "background.jpg"
                       fillMode: Image.PreserveAspectCrop
                   }
            MouseArea {
                           anchors.fill: parent
                           onClicked: TreasureHunt.handleClick(mouse.x, mouse.y)
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
                id: score
                anchors {
                    right: parent.right
                    verticalCenter: parent.verticalCenter
                }
                text: "Score: Who knows?"
            }
        }
    }
