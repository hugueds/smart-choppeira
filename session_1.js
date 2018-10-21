const Session = function(device, client) {
    this.client = client;
    this.device = device;
    this.started = Date.now();
    this.initialBalance = client.balance;
    this.maxVolume = function(balance) { // Assumindo o litro = 1000ml = 10 reais, cada 100ml = 1 real, 1 ml = 0,01 real
        return balance * 0.003
    }(this.initialBalance);
    this.updateVolume = function(vol) {
        this.volume += vol;
        this.client.balance -= (vol * 100) // (vol * 0.1)
    }
    this.volume = 0;
    this.checkLimit = function() {
        console.log(this.client.balance)
        if (this.client.balance <= 0) {            
            this.client.balance = 0;
            return true;
        }        
    }
}



module.exports = Session;