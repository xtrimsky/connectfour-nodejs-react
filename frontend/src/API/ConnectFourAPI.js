import openSocket from 'socket.io-client';
const  socket = openSocket('http://connectfour.pervychine.com:3001');

export default class ConnectFourAPI{
    constructor(_listenerCallback) {
        
        socket.on('state', function(response){
            _listenerCallback('state', response);
        });
        socket.on('blockPlaced', function(response){
            _listenerCallback('blockPlaced', response);
        });
    };
    
    registerPlayer(playerNumber){
        this.emit('registerPlayer', playerNumber);
    };
    
    playerPlacedBlock(playerNumber, columnIndex){
        this.emit('blockPlaced', {
            'playerNumber': playerNumber,
            'columnIndex': columnIndex
        });
    };

    emit(key, message){
        socket.emit(key, message, (response) => {
          console.log(response);
        });
    };
    
    
};

export { ConnectFourAPI };