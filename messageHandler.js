const cards = require('./data/cards');
const clients = require('./data/clients');
const tablets = require('./data/tablets');
const rpis = require('./data/raspberries');
const Session = require('./session');
const sessions = [];

let io = null;

module.exports = {
    register: (mqttClient, socketServer) => {
        io = socketServer;
        mqttClient.on('message', (topic, data) => {
            let device = null;
            const pattern = /(.+)\/(\d{1,2})/;
            if (pattern.test(topic)) {
                let result = pattern.exec(topic);
                topic = result[1];
                device = parseInt(result[2]);
            }
            switch (topic) {
                case 'global': console.log('MQTT Global >> ', data); break;
                case 'cardreader': cardreaderHandler(device, data); break;
                case 'flowsensor': flowSensorHandler(device, data); break;
                case 'active-sessions': console.log(sessions); break;
            }

            function cardreaderHandler(device, data) {
                data = data.toString();
                console.log(`Cardreader #${device} >> ${data}`);
                let card = null;
                let index = cards.map((card) => card.number).indexOf(data); // Busca cartão
                if (index > -1) {
                    let client = null;
                    card = cards[index];
                    index = clients.map((client) => client.cardId).indexOf(card.id); // Busca cliente associado ao cartão
                    if (index > -1) {
                        client = clients[index];
                        // Atualiza last login (salva no banco de dados)
                        // Apagar sessao atual buscando o dispositivo
                        index = sessions.map(s => s.device).indexOf(device);
                        if (index > -1) {
                            sessions.splice(sessions[index], 1);
                        }
                        console.log(`Cliente ${client.name} logado`);
                        io.emit('cardreader', device, card, client);
                        mqttClient.publish('solenoid/' + device, 'open');
                        sessions.push(new Session(device, client)); // Cria e habilita nova sessão
                        // Salvar no banco ultima sessao no dispositivo ao deslogar
                    } else {
                        console.log('Cartão não possui cliente cadastrado');
                        io.emit('cardreader', device, null, null);
                        // Encontrar ID par do tablet com base no ID do raspberry                    
                    }
                } else {
                    console.log('Cartão não localizado');
                    io.emit('cardreader', device, null, null);
                    // Encontrar ID par do tablet com base no ID do raspberry
                    // Enviar evento para o tablet e atualizar tela dizendo que o cartão é inválido
                }
            }

            function flowSensorHandler(device, data) {
                let index = sessions.map(s => s.device).indexOf(device);
                if (index > -1) {
                    let session = sessions[index];
                    io.emit('update balance', device, session);
                    if (session.checkLimit()) {
                        console.log('Volume máximo atingido no dispositivo', device);
                        mqttClient.publish('solenoid/' + device, false);
                    } else {
                        session.updateVolume(parseFloat(data));
                    }
                }
                // Se sim, Validar saldo do cliente e conferir valores positivo e minimo
                // Converter o saldo para mls
            }

        });
    },
    killSession: (sessionClient) => {
        let index = sessions.map(s => s.client.id).indexOf(sessionClient.id);
        let session = sessions[index];
        sessions.splice(session, 1);
        // Salva os dados do cliente
    },
    getSessions: function () {
        return sessions;
    },
    sessions: sessions,
}