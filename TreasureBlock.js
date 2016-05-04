
function getBlockTileName(parent) {
    if(parent.dataHidden)
        if(parent.marked)
            return "assets/cave_8_3.png" ;
        else
            return "assets/cave_8_8.png";
    if(parent.text == -1)
        return "assets/cave_7_2.png";
    else
        return "assets/cave_12_1.png";


}

function getPlayerTileName(parent){
    if(parent.isPlayer){
        return "assets/char.png"
    }
    else
        return "assets/nothing.png"
}

function getDoodadTileName(parent) {
    if(parent.marked){
        return "assets/mark.png";
    }else
        if(parent.isRoute){
            return "assets/cave_19_0.png"
        }

    else
        return "assets/nothing.png";
}
