﻿function Player(name){
    var self = this;
    self.name = name;
    self.totalClicks = ko.observable(0);
    self.highestClicksPerSecond = ko.observable(0);
    self.lastClicksPerSecond = ko.observable(0);
    self.totalMoneySpent = ko.observable(0);
    self.totalItemsPurchased = ko.observable(0);
    self.clickData = ko.observableArray([]);

    self.addPlayerClickData = function(value){
        self.clickData.push(new Data("click", value));
        self.totalClicks(self.totalClicks() + 1);
    }

    self.formatTotalMoneySpent = ko.computed(function(){
        return accounting.formatMoney(self.totalMoneySpent(),"$",0);
    })
}

var playerStats = {
    name:"",
    totalClicks:""
}

// Viewmodel for the click application.
var appView =  {    
    buttons : ko.observableArray([]),
    game: new Game(),
    player: new Player(),
    playerCash : ko.observable(0),
    CPS: ko.observable(0)
}


//Game inventory data
var clickItems = [
        { name: "Mouse", price: 10, cps: .1, symbol:"img/mouse.png", 
          owned: 0, basePrice:10, hasPlayerSeen:false , maxSellableItems:20,
          attribution: "Francisca Arévalo",
          attributionLink: "http://thenounproject.com/term/rat/15130/" 
        },
        { name: "Dog", price: 100, cps: 1, symbol:"img/dog.png", 
          owned: 0, basePrice:100, hasPlayerSeen:false , maxSellableItems:30,
          attribution: "Marta Michalowska",
          attributionLink: "http://thenounproject.com/term/dog/8126/"
        },
        { name: "Chicken", price: 500, cps: 10, symbol:"img/chicken.png", 
          owned: 0, basePrice:500, hasPlayerSeen:false , maxSellableItems:40,
          attribution: "Adam Zubin",
          attributionLink: "http://thenounproject.com/term/chicken/33759/" 
        },
        { name: "Octopus", price: 3000, cps: 25, symbol:"img/octopus.png", 
          owned: 0, basePrice:3000, hasPlayerSeen:false , maxSellableItems:50,
          attribution: "Jason Grube",
          attributionLink: "http://thenounproject.com/term/octopus/15331/" 
        },
        { name: "Millipede", price: 10000, cps: 100, symbol:"img/Millipede.png", 
          owned: 0, basePrice:10000, hasPlayerSeen:false , maxSellableItems:60,
          attribution: "Rosie Hardwick (modified)",
          attributionLink: "http://thenounproject.com/term/milipede/9436/" 
        },
        { name: "Robot", price: 100000, cps: 1000, symbol:"img/robot.png", 
          owned: 0, basePrice:10000, hasPlayerSeen:false , maxSellableItems:70,
          attribution: "",
          attributionLink: "" 
        }
    ];

var media = [
    {
        localLink:"img/coins.png", 
        attributionLink:"http://thenounproject.com/term/coins/7970/", 
        attribution:"Anton Håkanson"
    },
    {
        localLink:"img/plus-120.png", 
        attributionLink:"http://thenounproject.com/term/plus/2875/", 
        attribution:"P.J. Onori"
    },
    {
        localLink:"img/shrink.png", 
        attributionLink:"http://thenounproject.com/term/shrink/33953/", 
        attribution:"Berkay Sargın"
    },
    {
        localLink:"img/cps.png", 
        attributionLink:"http://thenounproject.com/term/click/12280/", 
        attribution:"Rohan Gupta"
    },
    {
        localLink:"img/tap.png", 
        attributionLink:"http://thenounproject.com/term/tap-and-hold/2936/", 
        attribution:"P.J. Onori"
    }
]

//jykwak: 
//helper function to reset the board
//doesn't work if this function moved below loadKoDat(clickItems); line

function resetKoData() {
    appView.buttons = ko.observableArray([]);
    loadKoData(clickItems);
}

function loadKoData(clickItems){
    for (var i = 0; i < clickItems.length; i++) {
        appView.buttons.push(new ItemButton(clickItems[i].name,
            clickItems[i].price,
            clickItems[i].cps,
            clickItems[i].symbol,
            clickItems[i].owned,
            clickItems[i].basePrice,
            clickItems[i].hasPlayerSeen,
            clickItems[i].maxSellableItems))
    }
}

loadKoData(clickItems);