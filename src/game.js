/**/
"use strict;"

function copyObject(obj) {
    var copy = Object.create(Object.getPrototypeOf(obj));
    var propNames = Object.getOwnPropertyNames(obj);

    propNames.forEach(function(name) {
        var desc = Object.getOwnPropertyDescriptor(obj, name);
        Object.defineProperty(copy, name, desc);
    });

    return copy;
}

function GameObject(parent, cssClass) {
    this.HTML = document.createElement("div");
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

Tube.prototype = new GameObject();

function Tube(parent) {
    GameObject.call(this, parent, "tube");
    this.branch = {
        t: false,
        r: false,
        b: false,
        l: false
    };
    this.locked = false;
    this.angle = 0;
}

Tube.prototype.rotateRight = function () {
    this.angle += 90;
    this.HTML.style.transform = "rotate(" + this.angle + "deg)";
    let tmp = copyObject(this.branch);
    this.branch.r = tmp.t;
    this.branch.b = tmp.r;
    this.branch.l = tmp.b;
    this.branch.t = tmp.l;
};

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
