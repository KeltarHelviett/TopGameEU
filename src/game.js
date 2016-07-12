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
    this.parent.appendChild(this.HTML);
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
    this.HTML.onclick = this.rotateRight.bind(this);
    this.attachObject();
    this.setPosition(x, y);
}

Tube.prototype.rotateRight = function () {
    this.angle += 90;
    this.HTML.style.transform = "rotate(" + this.angle + "deg)";
    let tmp = this.branch[3];
    for (let i = 3; i > 0; --i){
        this.branch[i] = this.branch[i - 1];
    }
    this.branch[0] = tmp;
};

Board.prototype = new GameObject();

function Board(width, height, level, startPoints, finishPoints) {
    GameObject.call(this, document.getElementById("groundBlockId"), "board");
    this.tubes = new Array(height);
    for (let i = 0; i < height; i++){
        this.tubes[i] = new Array(width);
    }
    this.width = width;
    this.height = height;
    if (level > 0){
        console.log("Creating level");
    }
    this.HTML.style.width = width * 45 + "px";
    this.HTML.style.top = height * 45 + "px";
    this.begins = [];
    this.ends = [];
    for (let i = 0; i < startPoints.length; i++){
        this.begins[i] = startPoints[i];
        this.begins[i] = finishPoints[i];
    }
    this.attachObject();
}

function Game() {
    this.timeLeft;
    this.board;
}

Game.prototype.loadLevel = function (width, height, level) {
    this.board.removeObject();
    this.board = new Board(width, height, level);
};

Game.prototype.isOver = function() {

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
    this.board = new Board(3, 3, 0, []);
    this.board.setPosition(parseInt(this.board.parent.style.right) / 2, parseInt(this.board.parent.style.bottom) / 2);
    console.log("Creating Tubes");
    this.board.tubes[0][0] = new Tube(this.board.HTML, [true, true, true, false], "tubeT", 0, 0);
    this.board.tubes[0][1] = new Tube(this.board.HTML, [true, true, true, true], "tubeX", 1, 0);
    this.board.tubes[1][1] = new Tube(this.board.HTML, [true, true, false, false], "tubeL", 1, 1);
};

var game = new Game();
game.createTestLevel();
