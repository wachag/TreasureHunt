import QtQuick 2.0

Rectangle {
    width: 128
    height: 128

    property string text: "?"
    property int dataHidden: 1
    property int marked: 0
    Image {
        anchors.fill: parent
        source: parent.marked?"assets/cave0131.png":(parent.dataHidden? "assets/cave0094.png":(parent.text==-1 ?"assets/cave0114.png": "assets/cave0145.png"))
        fillMode: Image.PreserveAspectCrop
    }
    FontLoader { id: localFont; source: "assets/tscuc.ttf" }
    Text {
        anchors.centerIn: parent
        text: parent.dataHidden?"":(parent.text<1)?"":parent.text
        //font:// This is available in all editors
        color: "red"
        font { family: localFont.name; pixelSize: 20; capitalization: Font.Capitalize }
    }

}
