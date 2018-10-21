class Session {

    constructor(device, client) {
        this.device = device;
        this.client = client;
        this.started = Date.now();
        this.initialBalance = this.client.balance;
        this.volume = 0;
    }

    maxVolume(balance) {
        return balance * 0.003;
    } 

    updateVolume(vol) {
        this.volume += vol;
        this.client.balance -= (vol * 100);
    }

    checkLimit() {
        console.log(`Current Balance: ${this.client.balance}`);
        if (this.client.balance <= 0) {
            this.client.balance = 0;
            return true;
        }
        return false;
    }

}



module.exports = Session;