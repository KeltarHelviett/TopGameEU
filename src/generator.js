const wall  = 1;
const empty = 0;

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.addXY = function (x, y) {
    return new Point(this.x + x, this.y + y);
};

Point.prototype.equals = function (point) {
    return this.x == point.x && this.y == point.y;
};

function inBorders(pos, width, height) {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}

function randomLabyrinth(width, height) {
    var labWidth  = 2 * width - 1;
    var labHeight = 2 * height - 1;
    var labyrinth = new Array(labHeight);
    var visited = new Array(height);
    for (var i = 0; i < height; i++) {
        visited[i] = new Array(width);
        for (var j = 0; j < width; j++) {
            visited[i][j] = false;
        }
    }

    var up    = function (curPos) { return curPos.addXY( 0, -2); };
    var down  = function (curPos) { return curPos.addXY( 0,  2); };
    var left  = function (curPos) { return curPos.addXY(-2,  0); };
    var right = function (curPos) { return curPos.addXY( 2,  0); };
    var middlePos = function (start, end) {
        var mX = Math.floor((start.x + end.x) / 2);
        var mY = Math.floor((start.y + end.y) / 2);
        return new Point(mX, mY);
    };
    var isVisited = function (pos) {
        return visited[Math.floor(pos.y / 2)][Math.floor(pos.x / 2)];
    };
    var visit = function (pos) {
        visited[Math.floor(pos.y / 2)][Math.floor(pos.x / 2)] = true;
    };
    var ableToMove = function (curPos, dir) {
        return inBorders(dir(curPos), labWidth, labHeight) && !isVisited(dir(curPos));
    };
    var hasFreeNeighbours = function (pos) {
        return ableToMove(pos, up) || ableToMove(pos, down) || ableToMove(pos, left) || ableToMove(pos, right);
    };
    var getNewPos = function (curPos) {
        var freePos = [];
        if (ableToMove(curPos, up)) {
            freePos.push(up(curPos));
        }
        if (ableToMove(curPos, down)) {
            freePos.push(down(curPos));
        }
        if (ableToMove(curPos, left)) {
            freePos.push(left(curPos));
        }
        if (ableToMove(curPos, right)) {
            freePos.push(right(curPos));
        }
        if (freePos.length == 0) {
            return null;
        }
        return freePos[randomInt(freePos.length)];
    };

    var emptyPoints = 0;
    for (i = 0; i < labHeight; i++) {
        labyrinth[i] = new Array(labWidth);
        for (j = 0; j < labWidth; j++) {
            var color = wall;
            if (i % 2 == 0 && j % 2 == 0) {
                color = empty;
                emptyPoints++;
            }
            labyrinth[i][j] = color;
        }
    }
    var route = [];
    var pos = new Point(0, 0);
    visit(pos);
    route.push(pos);
    emptyPoints--;
    while (emptyPoints > 0) {
        while (hasFreeNeighbours(pos)) {
            var newPos = getNewPos(pos);
            visit(newPos);
            route.push(newPos);
            var mid = middlePos(pos, newPos);
            labyrinth[mid.y][mid.x] = empty;
            emptyPoints--;
            pos = newPos;
        }
        while (route.length > 0) {
            pos = route[route.length - 1];
            route.pop();
            if (hasFreeNeighbours(pos)) {
                break;
            }
        }
    }
    return labyrinth;
}

function routeData(startPos, endPos, map, freeCell) {
    var height = map.length;
    var width  = map[0].length;
    var routeData = new Array(height);
    var visited   = new Array(height);
    for (var i = 0; i < height; i++) {
        routeData[i] = new Array(width);
        visited[i]   = new Array(width);
        for (var j = 0; j < width; j++) {
            routeData[i][j] = null;
            visited[i][j] = false;
        }
    }
    var ableToMove = function (pos) {
        return inBorders(pos, width, height) && map[pos.y][pos.x] == freeCell
            && !visited[pos.y][pos.x];
    };
    routeData[startPos.y][startPos.x] = 0;
    visited[startPos.y][startPos.x] = true;
    var queue = [];
    queue.push(startPos);
    while (queue.length > 0) {
        var pos = queue[0];
        queue.shift();
        if (ableToMove(pos.addXY(1, 0))) {
            routeData[pos.y][pos.x + 1] = routeData[pos.y][pos.x] + 1;
            visited[pos.y][pos.x + 1] = true;
            queue.push(pos.addXY(1, 0));
        }
        if (ableToMove(pos.addXY(0, 1))) {
            routeData[pos.y + 1][pos.x] = routeData[pos.y][pos.x] + 1;
            visited[pos.y + 1][pos.x] = true;
            queue.push(pos.addXY(0, 1));
        }
        if (ableToMove(pos.addXY(-1, 0))) {
            routeData[pos.y][pos.x - 1] = routeData[pos.y][pos.x] + 1;
            visited[pos.y][pos.x - 1] = true;
            queue.push(pos.addXY(-1, 0));
        }
        if (ableToMove(pos.addXY(0, -1))) {
            routeData[pos.y - 1][pos.x] = routeData[pos.y][pos.x] + 1;
            visited[pos.y - 1][pos.x] = true;
            queue.push(pos.addXY(0, -1));
        }
        if (pos.equals(endPos)) {
            break;
        }
    }
    return routeData;
}

function backtrace (endPos, routeData) {
    var width = routeData[0].length;
    var height = routeData.length;
    var curPos = endPos;
    var distance = routeData[curPos.y][curPos.x];
    var ableToMove = function (from, to) {
        return inBorders(to, width, height) && routeData[to.y][to.x] != null
            && routeData[to.y][to.x] < routeData[from.y][from.x];
    };
    var answer = [endPos];
    while (distance > 0) {
        if (ableToMove(curPos, curPos.addXY(1, 0))) {
            curPos = curPos.addXY(1, 0);
        }
        else if (ableToMove(curPos, curPos.addXY(0, 1))) {
            curPos = curPos.addXY(0, 1);
        }
        else if (ableToMove(curPos, curPos.addXY(-1, 0))) {
            curPos = curPos.addXY(-1, 0);
        }
        else {
            curPos = curPos.addXY(0, -1);
        }
        distance = routeData[curPos.y][curPos.x];
        answer.unshift(curPos);
    }
    return answer;
}

function findRoute(startPos, endPos, map, freeCell) {
    return backtrace(endPos, routeData(startPos, endPos, map, freeCell));
}

function routesToTubeData(width, height, routes) {
    var tubeSize = function (tubeData) {
        var result = 0;
        for (var i = 0; i < tubeData.length; i++) {
            if (tubeData[i]) {
                result++
            }
        }
        return result;
    };
    var sameLine = function (posA, posB) {
        return posA.x == posB.x || posA.y == posB.y
    };
    var countMatches = function (dataA, dataB) {
        var result = 0;
        for (var i = 0; i < dataA.length; i++) {
            if (dataA[i] == dataB[i]) {
                result++;
            }
        }
        return result;
    };
    var or = function (dataA, dataB) {
        var result = [false, false, false ,false];
        for (var i = 0; i < dataA.length; i++) {
            result[i] = dataA[i] || dataB[i];
        }
        return result;
    };
    var getTubeData = function (prevPos, curPos, nextPos) {
        if (sameLine(prevPos, nextPos)) {
            if (prevPos.y == nextPos.y) {
                return [false, true, false, true];
            }
            else {
                return [true, false, true, false];
            }
        }
        else {
            if (prevPos.y < curPos.y || nextPos.y < curPos.y) { //  |_  or _|
                if (prevPos.x < curPos.x || nextPos.x < curPos.x) { // _|
                    return [true, false, false, true];
                }
                else { // |_
                    return [true, true, false, false];
                }
            }
            else {
                if (prevPos.x > curPos.x || nextPos.x > curPos.x) { // Г case
                    return [false, true, true, false];
                }
                else {
                    return [false, false, true, true];
                }
            }
        }
    };

    var tubeData = new Array(height);
    var level = new Array(height);
    for (var i = 0; i < height; i++) {
        tubeData[i] = new Array(width);
        level[i] = new Array(width);
        for (var j = 0; j < width; j++) {
            tubeData[i][j] = [false, false, false, false]; // top right bot left
            level[i][j] = "";
        }
    }
    for (i = 0; i < routes.length; i++) {
        for (j = 1; j < routes[i].length - 1; j++) {
            var prevPos = routes[i][j - 1];
            var curPos  = routes[i][j];
            var nextPos = routes[i][j + 1];
            var newData = getTubeData(prevPos, curPos, nextPos);
            var curData = tubeData[curPos.y][curPos.x];
            if (tubeSize(curData) == 0) {
                tubeData[curPos.y][curPos.x] = newData;
                continue;
            }
            if (countMatches(curData, newData) == 0 || tubeSize(curData) == 4) {
                continue;
            }
            tubeData[curPos.y][curPos.x] = or(curData, newData);
        }
    }
    return tubeData;
}

function randomLevel(width, height, complexity) {
    var contain = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    };
    var randomDistinctArray = function (max) {
        var result = [];
        while (result.length < complexity) {
            var rndVal = randomInt(max);
            while (contain(result, rndVal) || labyrinth[rndVal] == wall) {
                rndVal = randomInt(max);
            }
            result.push(rndVal);
        }
        return result;
    };
    var labCoords = function (point) {
        return new Point(point.x * 2, point.y * 2);
    };
    var levelCoords = function (point) {
        return new Point(Math.floor(point.x / 2), Math.floor(point.y / 2));
    };
    var labyrinth = randomLabyrinth(width, height);
    var startPoints = randomDistinctArray(height);
    var endPoints = randomDistinctArray(height);
    var routes = new Array(complexity);
    for (var i = 0; i < complexity; i++) {
        routes[i] = [];
        var startPoint = labCoords(new Point(0, startPoints[i]));
        var endPoint = labCoords(new Point(width - 1, endPoints[i]));
        var temp = findRoute(startPoint, endPoint, labyrinth, empty);
        for (var j = 0; j < temp.length; j++) {
            if (temp[j].x % 2 == 0 && temp[j].y % 2 == 0) {
                routes[i].push(levelCoords(temp[j]));
            }
        }
    }
    return {
        tubeData: routesToTubeData(width, height, routes),
        startPoints: startPoints,
        endPoints: endPoints
    };
}

function FileLevel(pathToFile) {

}