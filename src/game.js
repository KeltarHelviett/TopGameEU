/**/
"use strict;"

function GameObject(parent, cssClass) {
    this.HTML = parent.createElement("div");
    this.parent = parent;
    this.HTML.classList.add(cssClass);
}

GameObject.prototype.setPosition = function (x, y) {
    this.HTML.style.left = x + "px";
    this.HTML.style.top = y + "px";
};

GameObject.prototype.removeObject = function () {
    this.HTML.remove();
};

GameObject.prototype.rotateRight = function () {
    /*todo*/
};

Tube.prototype = new GameObject();

function Tube(parent){
    GameObject.call(this, parent, "tube");
    this.branch =  {
        r: false,
        l: false,
        t: false,
        b: false,
    };
    this.locked = false;
}

Board.prototype = new GameObject();

function Board(width, height, level) {
    GameObject.call(this, document.body, "board");
    this.tubes = new Array(height);
    for (let i = 0; i < height; i++){
        this.tubes[i] = new Array(width);
    }
    this.width = width;
    this.height = height;

}

function Game() {
    this.timeLeft;
    this.board;
}

Game.prototype.loadLevel = function (width, height, level) {
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
