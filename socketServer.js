const tablets = require('./data/tablets');
const messageHandler = require('./messageHandler.js');
const ipPattern = /^.+?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;

const clients = [];
let server = null;
let io = null;


let teste = 123

function SocketServer(httpServer) {   
    
    return {
        start(httpServer) {           
            
            io = require('socket.io')(httpServer);            
    
            io.on('connection', (socket) => {
    
                const client = socket.handshake.address;
                let ip = 'empty';
    
                if (ipPattern.test(client)) {
                    ip = ipPattern.exec(client)[1];
                }
    
                clients.push(client);
                console.log(`Dispositivo Conectado >> ${client} `);
    
                const message = `New socket connection: ${ip}`;
                const index = tablets.map(tablet => tablet.address).indexOf(ip);
    
                if (index > -1) {
                    const tablet = tablets[index];
                    socket.emit('new connection', message, tablet);
                }
    
                socket.on('end-session', (session) => {
                    messageHandler.killSession(session);
                    console.log('Finalizando sessão', session);
                    // Fecha a valvula
                });
    
                socket.on('disconnect', () => {
                    const index = clients.indexOf(socket.handshake.address);
                    console.log(socket.handshake.address)
                    io.emit('socket disconnected', clients[index]);
                    console.log('Dispositivo Desconectado >>', clients[index]);
                    clients.splice(index, 1);
                });
    
                socket.on('clients', () => {
                    console.log('Connected Clients >>', clients);
                });
    
                socket.on('sessions', () => {
                    const sessions = messageHandler.sessions;
                    console.log('Active Sessions >>', sessions)
                })
    
                socket.on('ping', (data) => {
                    console.log('ping');
                    socket.emit('pong', 'pong')
                });
    
            });        

            return io;
            
        },
        io() {
            return io;
        }
        
    }

  
    


}

module.exports = SocketServer;


// module.exports = SocketServer;