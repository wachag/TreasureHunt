import QtQuick 2.0

Rectangle {
    width: 100
    height: 100
    color: "gray"
    property string text: "?"
    property int dataHidden: 1
    Text {
        anchors.centerIn: parent
        text: parent.dataHidden?"":parent.text

    }

}
