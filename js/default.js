// Initialize my ko view
$(document).ready(function () {
    try{
        load();
        // Apply datamodel binding
        ko.applyBindings(koClickView());
        // Start gameloop
        requestAnimFrame(gameLoop);
        // Start update money loop
        updateMoney();
        // Autosave
        setTimeout(save, 10000, koClickView);
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

            } catch (e) {
                if (e === QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!');
                }
            }
        }
    } catch (e) {
        window.status = e.message;
    }

    setTimeout(save, 10000);
}

function load() {
    try {
        window.status = "loading...";
        if (typeof (localStorage) != 'undefined') {
            var savedCurrency = parseInt(window.localStorage.getItem("currency"));
            var savedCps = parseFloat(window.localStorage.getItem("cps"));

            window.status = "savedCurrency = " + savedCurrency;
            if (!isNaN(savedCurrency)) {
                totalCurrency = savedCurrency;
            }
            if(!isNaN(savedCps)){
                CPS = savedCps;
            }
        } else {
            //Save a different way
            window.status = "ELSE";
        }
    }
    catch (e) {
        window.status = e.message;
    }
}

function reset() {

        totalCurrency = 0;
        CPS = 0;
        save();
        updateMoney();

}

function cheat() {

        totalCurrency = 2000000000;
        CPS = 100000;
        save();
        updateMoney();

}


// Setup game variables
var totalCurrency = new Number();
var CPS = new Number();


// Animate the click circle
// For iPhone use the onTouchStart instead of onMouseDown
function mouseDown(e) {
    showClick(1);
    $("#clickCover").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");
    totalCurrency += 1;
}

function mouseUp(e) {
    setTimeout(function () { $('#clickCover').removeClass("clickAnimationCircle"); }, 150);
}

function showClick(num) {

    var obj = document.createElement("p");
    obj.setAttribute("class", "clickAnimationPlus");
    obj.innerText = "+" + num;
    document.getElementById("clickCover").appendChild(obj);
    setTimeout(destroyClick, 300, obj);
}

function destroyClick(obj) {
    document.getElementById("clickCover").removeChild(obj);
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
    $("#totalCurrency").text(accounting.formatMoney(totalCurrency, "$", 0));
    $("#totalCps").text(accounting.formatNumber(CPS, 1, ","));
    requestAnimFrame(gameLoop);
    
}

function updateMoney() {
    totalCurrency += CPS;
    setTimeout(updateMoney, 1000);
}