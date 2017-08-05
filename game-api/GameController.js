var method = GameController.prototype;

function GameController(_io) {
    this._io = _io;
    this.gameState = {
        socket_id: 0,
        player1_online: false,
        player2_online: false,
        next_player: 1,
        winner: 0,
        
        //the gamemap is the position of every block, in this array each row is a column, each column is a row
        gameMap: [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]
        ]
    };
    
    var self = this;
    
    this._io.on('connection', function (socket) { self.onConnection(socket); });
    this._io.on('connection', function (socket) { self.onConnection(socket); });
}

method.resetGame = function(){
    this.gameState['winner'] = 0;
    this.gameState['next_player'] = 1;
    this.gameState['gameMap'] =  [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ];
};

method.checkForWinners = function(){
    function doFourValuesMatch(a, b, c, d){
        return (a !== 0) && (b===a) && (c===a) && (d===a);
    }
    
    var map = this.gameState.gameMap;
    
    var winnerFound = false;
    var winner = 0;
    
    //check vertically
    var i,j;
    for(i = 0; i < map.length; i++){
        for(j = 0; j < map[i].length; j++){
            if(typeof map[i][j+3] === 'undefined') {
                break;
            }
            winnerFound = doFourValuesMatch(
                map[i][j], 
                map[i][j+1], 
                map[i][j+2], 
                map[i][j+3]
            );
            
            if(winnerFound) {
                winner = map[i][j];
                break;
            }
        }
        
        if(winnerFound) {
            break;
        }
    }
    
    //check horizontally
    if(!winnerFound){
        for(i = 0; i < map.length; i++){
            for(j = 0; j < map[i].length; j++){
                if(typeof map[i+3] === 'undefined') {
                    break;
                }
                winnerFound = doFourValuesMatch(
                    map[i][j], 
                    map[i+1][j], 
                    map[i+2][j], 
                    map[i+3][j]
                );
                
                if(winnerFound) {
                    winner = map[i][j];
                    break;
                }
            }
            
            if(winnerFound) {
                break;
            }
        }
    }
    
    //check diagonal1
    if(!winnerFound){
        for(i = 0; i < map.length; i++){
            for(j = 0; j < map[i].length; j++){
                if(typeof map[i+3] === 'undefined' || typeof map[i+3][j+3] === 'undefined') {
                    break;
                }
                winnerFound = doFourValuesMatch(
                    map[i][j], 
                    map[i+1][j+1], 
                    map[i+2][j+2], 
                    map[i+3][j+3]
                );
                
                if(winnerFound) {
                    winner = map[i][j];
                    break;
                }
            }
            
            if(winnerFound) {
                break;
            }
        }
    }
    
    //check diagonal2
    if(!winnerFound){
        for(i = 0; i < map.length; i++){
            for(j = 0; j < map[i].length; j++){
                if(typeof map[i-3] === 'undefined' || typeof map[i-3][j+3] === 'undefined') {
                    break;
                }
                winnerFound = doFourValuesMatch(
                    map[i][j], 
                    map[i-1][j+1], 
                    map[i-2][j+2], 
                    map[i-3][j+3]
                );
                
                if(winnerFound) {
                    winner = map[i][j];
                    break;
                }
            }
            
            if(winnerFound) {
                break;
            }
        }
    }
    
    if(winnerFound) {
        this.gameState['winner'] = winner;
    }
};

method.getGameStateForSocket = function(socket){
    var state = this.gameState;
    state['socket_id'] =  socket.id;
    return state;
};

method.onConnection = function(socket){
    var socketID = socket.id;
    
    var self = this;
    socket.on('registerPlayer', function(data){
        self.onRegisterPlayer(socket, data);
    });
    
    socket.on('blockPlaced', function(data){
        var playerColumn = 'player'+data.playerNumber+'_online';
        if(self.gameState[playerColumn] !== socketID) {
            //socket ID doesn't match the player, blocking request.
            return;
        }
        
        self.onBlockPlaced(socketID, parseInt(data.playerNumber,10), parseInt(data.columnIndex,10));
    });
    
    socket.on('disconnect', function(){
        if(self.gameState['player1_online'] == socketID) {
            self.gameState['player1_online'] = false;
            self.emitStateToAll();
        }else if(self.gameState['player2_online'] == socketID) {
            self.gameState['player2_online'] = false;
            self.emitStateToAll();
        }
    });
    
    socket.emit('state', this.getGameStateForSocket(socket));
};

method.onRegisterPlayer = function(socket, playerNumber){
    var playerColumn = 'player'+playerNumber+'_online';
    if(this.gameState[playerColumn] == false) {
        this.gameState[playerColumn] = socket.id;
        this.resetGame();
        this.emitStateToAll();
    }
    
    socket.emit('state', this.getGameStateForSocket(socket));
};

method.onBlockPlaced = function(currentSocketID, playerNumber, columnIndex){
    if(playerNumber !== this.gameState.next_player) {
        //not current player's turn
        return;
    }
    
    if(!this.gameState.gameMap[columnIndex]) {
        return;
    }
    
    var found = false;
    for(var i in this.gameState.gameMap[columnIndex]){
        if(this.gameState.gameMap[columnIndex][i] === 0) {
            //this is the block
            found = i;
            break;
        }
    }
    
    if(found !== false) {
        var opponentNumber = playerNumber == 2 ? 1 : 2;
        this.gameState.gameMap[columnIndex][found] = playerNumber;
        this.gameState['next_player'] = opponentNumber;
        
        this.checkForWinners();
        
        //emitting to other clients letting them know a block was placed
        var self = this;
        this._io.clients((error, clients) => {
          if (error) throw error;
          
          for(var i in clients){
              var socketID = clients[i];
              
              if(currentSocketID !== socketID) {
                var socket = self._io.of('/').connected[clients[i]];
                socket.emit('blockPlaced', {
                    'playerNumber': playerNumber,
                    'columnIndex': columnIndex
                });
              }
          }
          self.emitStateToAll();
        });
    }
};

method.emitStateToAll = function(){
    var self = this;
    this._io.clients((error, clients) => {
      if (error) throw error;
      
      for(var i in clients){
          var socketID = clients[i];
          var socket = self._io.of('/').connected[clients[i]];
          socket.emit('state', self.getGameStateForSocket(socket));
      }
    });
};

module.exports = GameController;