var clouds = [];

window.onload = function () {
    tuneLandscape();
    createClouds();
    timer(1,random(2,8),0);
};
window.onresize = function () {
    tuneLandscape();
};

function timer(startTime,randomCoefficient,pushed) {

    if (startTime == 9) {
        startTime = 1;
        randomCoefficient = random(2,8);
    }

    else if (startTime % randomCoefficient  == 0) {
            clouds[pushed].style.transition = '80s';
            clouds[pushed].style.transitionTimingFunction = 'linear';
            pushCloud(clouds[pushed]);
        
            startTime = 1;
            randomCoefficient = random(2,8);
            pushed++;
        
            if (pushed == clouds.length){
                mixCloudsArr(clouds);
                pushed = 0;
            }
    }
    else {
        startTime++;
    }
    
    setTimeout(function () {
        timer(startTime,randomCoefficient,pushed);
    }, 3000);

}

function mixCloudsArr(CloudsArr) {
    for (var i = 0; i < CloudsArr.length; i++) {
        var r = (random(2,7) * 50)*-1;
        var num = Math.floor(Math.random() * (i + 1));
        var d = CloudsArr[num];
        CloudsArr[num] = CloudsArr[i];
        CloudsArr[i] = d;
    }
}

function createClouds() {
    for (var i = 1; i <= 9; ++i) {
        var cloud = document.createElement('div');
        cloud.style.background = "url('clouds/cloud" + i + ".png')";
        cloud.style.backgroundRepeat = 'no-repeat';
        cloud.style.top = random(0,3) * 10 + 'px';
        cloud.className = 'cloud';
        document.getElementById("skyBlockId").appendChild(cloud);
        clouds.push(cloud);
    }
    mixCloudsArr(clouds);
}

function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
    };

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function pushCloud(cloud) {
    cloud.style.left = window.innerWidth + 2 + 'px';

    var transitionEvent = whichTransitionEvent();
    transitionEvent && cloud.addEventListener(transitionEvent, function() {
        if (parseInt(cloud.style.left) >= window.innerWidth) {
            cloud.style.transition = '0s';
            cloud.style.left = '-100px';
        }
    });
}

function tuneLandscape() {
    tuneSkyBlock();
    tuneGroudBlock()
}

function tuneSkyBlock() {
    var skyBlock = document.getElementById("skyBlockId");
    skyBlock.style.height = window.innerHeight * 0.3 + "px";
    tuneSkyBlockObjects(skyBlock);
}

function tuneSkyBlockObjects(parent) {
}

function tuneGroudBlock() {
    var grounBlock = document.getElementById("groundBlockId");
    grounBlock.style.height = window.innerHeight * 0.7 + "px";

    with (document.getElementById("skyBlockId")) {
        grounBlock.style.top =  parseInt(style.height) + "px";
    }
    tuneBoard();
}

function tuneBoard() {
}

function random(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
};

