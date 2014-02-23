// Setup game variables
var totalCurrency = 0;
var CPS = 0;
var lastSave = new Date();
var AUTO_SAVE_INTERVAL = 4000;
var sound = new Howl({urls:['audio/bobpa.mp3','audio/bobpa.ogg']});
var lastClicks = 0;
var lastClicksPerSecond = 0;
var appView = {};


// Initialize my ko view
$(document).ready(function () {
    try{
        //window.localStorage.setItem("inventory", "");
        load();
        // Apply datamodel binding
        ko.applyBindings(appView);
        // Start gameloop
        requestAnimFrame(gameLoop);
        // Start update money loop
        updateMoney();
    } catch (e) {
        window.status = e.message;
    }
});

// Save tries to save game data using local storage
function save() {
    
    try {
        if (typeof (localStorage) === 'undefined') {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            try {
                window.localStorage.setItem("currency", totalCurrency.toString());
                window.localStorage.setItem("cps", CPS.toString());
                window.localStorage.setItem("inventory", ko.toJSON(appView));
                window.localStorage.setItem("totalClicks", appView.player.totalClicks());
                window.localStorage.setItem("totalMoneySpent", appView.player.totalMoneySpent());
            } catch (e) {
                if (e === QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!');
                }
            }
        }
    } catch (e) {
        window.status = e.message;
    }

    lastSave = new Date();
}

// Load any existing data
function load() {
    try {
        window.status = "loading...";
        if (typeof (localStorage) != 'undefined') {
            var savedCurrency = parseInt(window.localStorage.getItem("currency"));
            var savedCps = parseFloat(window.localStorage.getItem("cps"));
            var inventory = window.localStorage.getItem("inventory");
            var totalClicks = parseInt(window.localStorage.getItem("totalClicks"));
            var totalMoneySpent = parseInt(window.localStorage.getItem("totalMoneySpent"));

            if(!isNaN(totalMoneySpent)){
                appView.player.totalMoneySpent(totalMoneySpent);
            }
            if (!isNaN(savedCurrency)) {
                totalCurrency = savedCurrency;
            }
            if(!isNaN(savedCps)){
                CPS = savedCps;
            }
            if(!isNaN(totalClicks)){
                appView.player.totalClicks(totalClicks);
            }
            if(inventory.length > 10){
                appView.buttons = ko.observableArray([]);
                loadKoData(JSON.parse(inventory).buttons);
            }
        } else {
            //Save a different way
            window.status = "ELSE";
        }

        window.status = "";
    }
    catch (e) {
        window.status = e.message;
    }
}


function reset() {
        totalCurrency = 0;
        CPS = 0;
        // Clear all the local Storage data
        appView.player.totalClicks(0);
        appView.player.totalMoneySpent(0);
        window.localStorage.clear();
        resetKoData();
        save();
        window.location.reload();
}

function cheat() {

        totalCurrency = 2000000000;
        CPS = 100000;
        save();
        updateMoney();

}

// Animate the click circle
// For iPhone use the onTouchStart instead of onMouseDown
function mouseDown(e) {

    var clicks = 1;
    if(lastClicksPerSecond > 8){
        clicks = 6;
    } else if (lastClicksPerSecond > 7){
        clicks = 5;
    } else if (lastClicksPerSecond > 6){
        clicks = 4;
    } else if (lastClicksPerSecond > 5){
        clicks = 3;
    } else if (lastClicksPerSecond > 4){
        clicks = 2;
    } 


    showClick(clicks);
    $("#clickCover").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");
    showClick(clicks,e);
    $("#clickCover").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");

    if(appView.game.soundState()){
        sound.play();
    }
    appView.player.addPlayerClickData(clicks); 
    totalCurrency += clicks;

}

function mouseUp(e) {
    setTimeout(function () { $('#clickCover').removeClass("clickAnimationCircle"); }, 150);
}


function showClick(num, e) {
    var evt = e ? e:window.event;
    var clickX=0, clickY=0;

    if ((evt.clientX || evt.clientY) &&
     document.body &&
     document.body.scrollLeft!=null) {
        clickX = evt.clientX + document.body.scrollLeft;
        clickY = evt.clientY + document.body.scrollTop;
    }
    if ((evt.clientX || evt.clientY) &&
     document.compatMode=='CSS1Compat' && 
     document.documentElement && 
     document.documentElement.scrollLeft!=null) {
        clickX = evt.clientX + document.documentElement.scrollLeft;
        clickY = evt.clientY + document.documentElement.scrollTop;
    }
    if (evt.pageX || evt.pageY) {
        clickX = evt.pageX;
        clickY = evt.pageY;
 }
    var obj = document.createElement("p");
    obj.setAttribute("class", "clickAnimationPlus");
    obj.setAttribute("style", "top:" + clickY + "px;left:" + clickX +"px;");
    obj.innerText = "+" + num;

    document.body.appendChild(obj);

    setTimeout(destroyClick, 300, obj);
}

function destroyClick(obj) {
    document.body.removeChild(obj);
}

// Map the the best option for performance available
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function (callback) {
                window.setTimeout(callback, 1000 / 60);
           };
})();

// Handle app navigation
function locationHashChanged() {
    switch(location.hash)
    {
        case "#about":
            $("#about").removeClass("hidden");
            $("#aboutMenu").addClass("active");

            $("#game").addClass("hidden");
            $("#gameMenu").removeClass("active");

            $("#contact").addClass("hidden");
            $("#contactMenu").removeClass("active");

            /*$('.navbar-collapse').toggle();*/

            break;

        case "#contact":
            $("#about").addClass("hidden");
            $("#aboutMenu").removeClass("active");

            $("#contact").removeClass("hidden");
            $("#contactMenu").addClass("active");

            $("#game").addClass("hidden");
            $("#gameMenu").removeClass("active");

            break;

        case "#":
        default:
            $("#about").addClass("hidden");
            $("#aboutMenu").removeClass("active");

            $("#contact").addClass("hidden");
            $("#contactMenu").removeClass("active");

            $("#game").removeClass("hidden");
            $("#gameMenu").addClass("active");

            break;

    }


}

window.onhashchange = locationHashChanged;


function gameLoop() {
    // Update the knockout view model to refelect player cash
    appView.game.playerCash(totalCurrency);
    appView.game.CPS(CPS);

    // Execute the game loop on the next animation frame
    requestAnimFrame(gameLoop);
    
    var currentTime = new Date();
    var timeSinceSave = currentTime - lastSave
    // Check if the game has been saved in the last 10 seconds
    if(timeSinceSave > AUTO_SAVE_INTERVAL){
        save();
    }
        
}

// Update the player's money every second by their CPS rate
function updateMoney() {
    // Check the player clicks since last update
    var clickRate = appView.player.totalClicks() - lastClicks;

    if(clickRate > appView.player.highestClicksPerSecond()){
        appView.player.highestClicksPerSecond(clickRate);
    }
    appView.player.lastClicksPerSecond(clickRate);
    // Add the auto generated clicks
    totalCurrency += CPS;
    // Update the knockout view model to refelect player cash
    appView.game.playerCash(totalCurrency);
    // Set the last clicks to the players new totalClick number
    lastClicks = appView.player.totalClicks();
    lastClicksPerSecond = clickRate;

    setTimeout(updateMoney, 1000);
}