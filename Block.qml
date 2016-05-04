import QtQuick 2.0
import "TreasureBlock.js" as TreasureBlock

Rectangle {
    width: 128
    height: 128

    property string text: "?"
    property int dataHidden: 1
    property int marked: 0
    property int isPlayer: 0
    property int isRoute:0
    Image {
        id: tile
        anchors.fill: parent
        source: TreasureBlock.getBlockTileName(parent)
        fillMode: Image.PreserveAspectCrop
        z: 0
    }
    Image{
        id: doodad
        anchors.fill: parent
        fillMode: Image.PreserveAspectCrop
        source:TreasureBlock.getDoodadTileName(parent);
        z: 10

    }
    Image{
        id: player
        anchors.fill: parent
        fillMode: Image.PreserveAspectCrop
        source:TreasureBlock.getPlayerTileName(parent);
        z: 100

    }


    FontLoader { id: localFont; source: "assets/tscuc.ttf" }
    Text {
        anchors.centerIn: parent
        text: parent.dataHidden?"":(parent.text<1)?"":parent.text
        //font:// This is available in all editors
        color: "red"
        font { family: localFont.name; pixelSize: 40; capitalization: Font.Capitalize }
    }

}
