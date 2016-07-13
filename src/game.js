/**/
"use strict;"

function GameObject(parent, cssClass) {
    this.HTML = document.createElement("div");
    this.parent = parent;
    this.HTML.classList.add(cssClass);
}

GameObject.prototype.setPosition = function (x, y) {
    this.HTML.style.left = x * 45 + "px";
    this.HTML.style.top = y * 45 + "px";
};

GameObject.prototype.removeObject = function () {
    this.HTML.remove();
};

GameObject.prototype.attachObject = function () {
    if (this.parent.HTML != undefined) {
        this.parent.HTML.appendChild(this.HTML);
    }
    else{
        this.parent.appendChild(this.HTML);
    }
}

Tube.prototype = new GameObject();

function Tube(parent, branch, tubeType, x, y) {
    GameObject.call(this, parent, "tube");
    this.HTML.classList.add(tubeType);
    this.branch = new Array(4);
    for (let i = 0; i < 4; i++){
        this.branch[i] = branch[i];
    }
    this.locked = false;
    this.angle = 0;
    if (tubeType != "tubeStart" && tubeType != "tubeFinish") {
        this.HTML.onclick = this.rotateRight.bind(this);   
    }
    this.attachObject();
    this.setPosition(x, y);
    this.i = y;
    this.j = x;
}

Tube.prototype.rotateRight = function () {
    this.angle += 90;
    this.HTML.style.transform = "rotate(" + this.angle + "deg)";
    let tmp = this.branch[3];
    for (let i = 3; i > 0; --i){
        this.branch[i] = this.branch[i - 1];
    }
    this.branch[0] = tmp;
    var b = this.parent;
    var win = false;
    for (let i = 0; i < b.begins.length; i++){
        if (!checkWinCondition(b, b.begins[i].i, b.begins[i].j, b.ends[i].i, b.ends[i].j, -1)){
            win = false;
            break;
        }
        else{
            win = true;
        }
    }
    if (win){
        alert("win");
    }
};

Board.prototype = new GameObject();

function Board(width, height, startPoints, finishPoints) {
    GameObject.call(this, document.getElementById("groundBlockId"), "board");
    this.tubes = new Array(height);
    for (let i = 0; i < height; i++){
        this.tubes[i] = new Array(width);
    }
    this.width = width;
    this.height = height;
    this.HTML.style.width  = width * 45 + "px";
    this.HTML.style.height = height * 45 + "px";
    this.begins = [];
    this.ends = [];
    // let tmpB, tmpE;
    // for (let i = 0; i < startPoints.length; i++){
    //     tmpB = this.begins[i] =  startPoints[i];
    //     tmpE = this.ends[i] = finishPoints[i];
    //     this.tubes[tmpB.i][tmpB.j] = new Tube(this.HTML, [true, true, true, true], "tubeStart", tmpB.i, tmpB.j);
    //     this.tubes[tmpE.i][tmpE.j] = new Tube(this.HTML, [true, true, true, true], "tubeFinish", tmpE.i, tmpE.j);
    // }
    for (var i = 0; i < startPoints.length; i++) {
        var tmpA = this.begins[i] = {i: startPoints[i], j: 0 };
        var tmpB = this.ends[i] = {i: finishPoints[i], j: width - 1 };
        this.tubes[tmpA.i][tmpA.j] = new Tube(this.HTML, [true, true, true, true], "tubeStart", tmpA.i, tmpA.j);
        this.tubes[tmpB.i][tmpB.j] = new Tube(this.HTML, [true, true, true, true], "tubeFinish", tmpB.i, tmpB.j);
    }

    this.attachObject();
}

Board.prototype.centrify = function () {
    var newX = Math.floor(window.innerWidth / 2 - this.width / 2 * 45);
    var newY = Math.floor(window.innerHeight / 2 - this.height / 2 * 45);
    this.setPosition(newX, newY);
};

function Game() {
    this.timeLeft;
    this.board;
}

function tubeDataToCSS(tubeData) {
    if (tubeSize(tubeData) == 4) {
        return "tubeX";
    }
    if (tubeSize(tubeData) == 3) {
        return "tubeT";
    }
    if (tubeData[0] == true && tubeData[0] == tubeData[2]
        || tubeData[1] == true && tubeData[1] == tubeData[3]) {
        return "tubeI";
    }
    else if (tubeSize(tubeData) == 0) {
        return "";
    }
    else {
        return "tubeL";
    }
}

Game.prototype.loadLevel = function (width, height, level) {
    if (this.board != null) {
        this.board.removeObject();
    }
    this.board = new Board(width, height, level.startPoints, level.endPoints);
    //this.board.centrify();
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var tubeData = level.tubeData[i][j];
            var cssData = tubeDataToCSS(tubeData);
            if (cssData == "") {

                continue;
            }
            this.board.tubes[i][j] = new Tube(this.board, tubeData, cssData, j, i);
        }
    }
};

function notAbleToMove(offsetX, offsetY, branch, board) {
    return offsetX < 0 || offsetX >= board.width || offsetY < 0 || offsetY >= board.height 
        || board.tubes[offsetY][offsetX] == undefined || board.tubes[offsetY][offsetX].branch[branch] == false;
}

function checkWinCondition(b, si, sj, ei, ej, cameFrom) {
    if (b.tubes[si][sj] == b.tubes[ei][ej]){
        return true;
    }
    for (let i = 0; i < 4; i++){
        if (b.tubes[si][sj].branch[i] == true && i != cameFrom){
            switch (i){
                case 0:
                    if (notAbleToMove(sj, si - 1, 2, b)){
                        break;
                    }
                    return checkWinCondition(b, si - 1, sj, ei, ej, 2);
                case 1:
                    if (notAbleToMove(sj + 1, si, 3, b)){
                        break;
                    }
                    return checkWinCondition(b, si, sj + 1, ei, ej, 3);
                case 2:
                    if (notAbleToMove(sj, si + 1, 0, b)){
                        break;
                    }
                    return checkWinCondition(b, si + 1, sj, ei, ej, 0);
                case 3:
                    if (notAbleToMove(sj - 1, si, 1, b)){
                        break;
                    }
                    return checkWinCondition(b, si, sj - 1, ei, ej, 1);
            }
        }
    }
    return false;
}

Game.prototype.isOver = function() {
    var b = this.board;
    for (let i = 0; i < b.begins.length; i++){
        checkWinCondition(b, b.begins[i].i, b.begins[i].j, b.ends[i].i, b.ends[i].j);
    }
};

Game.prototype.createRandomLevel = function(width, height, complexity) {

};

Game.prototype.solve = function () {

};

Game.prototype.lockUserActions = function () {

};

Game.prototype.unlockUserActions = function () {

};

Game.prototype.restart = function () {

};

Game.prototype.createTestLevel = function () {
    console.log("Creating test level" );
    this.board = new Board(3, 3, 0, [{i: 0, j: 0}], [{i: 2, j: 2}]);
    this.board.setPosition(parseInt(this.board.parent.style.right) / 2, parseInt(this.board.parent.style.bottom) / 2);
    console.log("Creating Tubes");
    this.board.tubes[0][1] = new Tube(this.board, [true, true, true, false], "tubeT", 1, 0);
    this.board.tubes[0][2] = new Tube(this.board, [true, true, true, true], "tubeX", 2, 0);
    this.board.tubes[1][2] = new Tube(this.board, [true, false, true, false], "tubeI", 2, 1);
    
};


var game = new Game();
game.loadLevel(12, 12, randomLevel(12, 12, 3));
