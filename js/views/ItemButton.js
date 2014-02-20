// Class representing Item Button
function ItemButton(name, price, cps, symbol, owned, basePrice) {
    var self = this;
    self.name = name;
    self.price = ko.observable(price);
    self.cps = cps;
    self.symbol = symbol;
    self.owned = ko.observable(owned);
    self.basePrice = ko.observable(basePrice);

    self.formattedPrice = ko.computed(function () {
        // Use accounting.js to format money
        return accounting.formatMoney(self.price(),"$",0);
    })

    // Check to see if a player can afford an item
    self.canAfford = ko.computed(function(){
        var pCash = appView.game.playerCash();
        if(self.price() <= pCash){
           return true;
        } else {
            return false;
        }
    })

    self.affordProgressValue = ko.computed(function(){
        var pCash = appView.game.playerCash();
        return pCash / self.price();
    })

    self.showProgress = ko.computed(function(){
        var pCash = appView.game.playerCash();
        if(pCash/self.price() < 1){
            return true;
        } else {
            return false;
        }
    })


    // Buying an item increases the price as well
    // Using the compound interest formula
    self.buyItem = function (e) {
        if (totalCurrency >= self.price()) {
            totalCurrency -= self.price();
            CPS += self.cps;
            // Increase the players inventory
            self.owned(self.owned() + 1);
            // Increase the item price
            self.price( self.basePrice() + (self.basePrice() * (.05 * self.owned())) );
        }
    }

    
    // Selling an item comes with a cost
    // Only return 90% of the previous purchase price
    self.sellItem = function (e){
        if(self.owned() > 0){
            // Calculate the refund
            var refund = 0;
            if(self.owned() === 1){
                refund = (self.basePrice() + (self.basePrice() * (.05 * self.owned()))  *.9);
            }else{
                refund = (self.basePrice() + (self.basePrice() * (.05 * self.owned()) - 1)  *.9);
            }
            
            // Give the refund to the player
            totalCurrency += refund;
            // Take the item from the inventory
            self.owned(self.owned() - 1);
            // Set the lower price
            self.price( self.basePrice() + (self.basePrice() * (.05 * self.owned())) );
            // Reduce the CPS
            CPS -= self.cps;
        }
    }
}