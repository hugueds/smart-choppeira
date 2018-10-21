const mqtt = require('mqtt');
const broker = process.env.BROKER_URL;
const client = mqtt.connect(broker);

// Gravar topicos em banco, realizar forEach para cada topico cadastrado

client.on('connect', () => console.log('Connected to MQTT Broker', broker));

client.subscribe('global', (err, granted) => {
    if (err) {
        console.error(err);
        return false;
    }
    console.log('Subscribed to ', granted);
});

client.subscribe('cardreader/+', (err, granted) => {
    if (err) {
        console.error(err);
        return false;
    }
    console.log('Subscribed to ', granted);
});

client.subscribe('flowsensor/+', (err, granted) => {
    if (err) {
        console.error(err);
        return false;
    }
    console.log('Subscribed to ', granted);
});


module.exports = client;