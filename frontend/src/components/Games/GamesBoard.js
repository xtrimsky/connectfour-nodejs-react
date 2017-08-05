import React, { Component } from 'react';
import GamesBoardColumn from './GamesBoardColumn.js';
import ConnectFourAPI from '../../API/ConnectFourAPI.js';

import './GamesBoard.style.css';

export default class GamesBoard extends Component {
    constructor(props) {
        super(props);
        
        this.socketIOID = false;
        
        this.API = new ConnectFourAPI(this.onAPIEvent);
        
        this.gameStates = {
            '_STATE_NO_OPPONENT_ONLINE_': 0,
            '_STATE_WAITING_FOR_OPPONENT_': 1,
            '_STATE_IT_IS_CURRENT_PLAYERS_TURN_': 2,
            '_STATE_PLAYER_ID_ALREADY_IN_USE_': 3,
            '_STATE_PLAYER1_WON_THE_GAME': 4,
            '_STATE_PLAYER2_WON_THE_GAME': 5,
        };
        
        //the gamemap is the position of every block, in this array each row is a column, each column is a row
        //0 is an empty slot
        //1 is player1
        //2 is player2
        this.gameMap = [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]
        ];
        
        this.state = {
            currentGameState: this.gameStates['_STATE_NO_OPPONENT_ONLINE_']
        };
    };
    
    verifyGameMap(newMap){
        var i,j;
        for(i = 0; i < newMap.length; i++){
            var columnContentDoesntMatch = false;
            for(j = 0; j < newMap[i].length; j++){
                if(newMap[i][j] !== this.gameMap[i][j]) {
                    columnContentDoesntMatch = true;
                    break;
                }
            }
            
            if(columnContentDoesntMatch) {
                var refName = 'column'+i;
                this.refs[refName].updateColumnData(newMap[i]);
            }
        }
        
        this.gameMap = newMap;
    };
    
    onStateUpdate(data){
        this.socketIOID = data.socket_id;
        this.verifyGameMap(data.gameMap);
        
        var currentPlayer = parseInt(this.props.playerNumber, 10);
        var opponent = currentPlayer === 2 ? 1 : 2;
        var nextPlayer = parseInt(data.next_player, 10);
        var opponentColumn = 'player'+opponent+'_online';
        var playerColumn = 'player'+currentPlayer+'_online';
        
        if(data[playerColumn] === false) {
            this.API.registerPlayer(currentPlayer);
        } else if(data[playerColumn] === this.socketIOID) {
            //we are connected!
            if(data[opponentColumn] === false) {
                this.setState({
                    'currentGameState': this.gameStates['_STATE_NO_OPPONENT_ONLINE_']
                });
            } else {
                var winner = parseInt(data.winner,10);
                if(winner === 0) {
                    //no winners, continuing the game
                    if(nextPlayer === currentPlayer) {
                        this.setState({
                            'currentGameState': this.gameStates['_STATE_IT_IS_CURRENT_PLAYERS_TURN_']
                        });
                    } else {
                        this.setState({
                            'currentGameState': this.gameStates['_STATE_WAITING_FOR_OPPONENT_']
                        });
                    }
                } else {
                    if(winner === 1) {
                        this.setState({
                            'currentGameState': this.gameStates['_STATE_PLAYER1_WON_THE_GAME']
                        });
                    } else if (winner === 2){
                        this.setState({
                            'currentGameState': this.gameStates['_STATE_PLAYER2_WON_THE_GAME']
                        });
                    }
                }
            }
        } else {
            this.setState({
                'currentGameState': this.gameStates['_STATE_PLAYER_ID_ALREADY_IN_USE_']
            });
        }
    };
    
    onBlockPlaced(data){
        var playerNumber = parseInt(data.playerNumber,10);
        var columnClickedData = this.gameMap[data.columnIndex];
        
        var i;
        for(i = 0; i < columnClickedData.length; i++){
            if(columnClickedData[i] === 0) {
                break;
            }
        }
        
        this.gameMap[data.columnIndex][i] = playerNumber;
        
        var refName = 'column'+data.columnIndex;
        this.refs[refName].addNewBlock(playerNumber, i);
    };
    
    onAPIEvent = (eventName, data) => {
        switch(eventName){
            case 'state':
                this.onStateUpdate(data);
                break;
            case 'blockPlaced':
                this.onBlockPlaced(data);
                break;
            default:
        }
    };
    
    handleColumnClick = (columnIndex) => {
        if(this.state.currentGameState !== this.gameStates['_STATE_IT_IS_CURRENT_PLAYERS_TURN_']) {
            return;
        }
        
        
        var columnClickedData = this.gameMap[columnIndex];
        
        //checking if there are spaces available in that column
        if(columnClickedData.includes(0) === false) {
            return;
        }
        
        //finding the next index where the block will go
        var i;
        for(i = 0; i < columnClickedData.length; i++){
            if(columnClickedData[i] === 0) {
                break;
            }
        }
        
        this.setState({
            'currentGameState': this.gameStates['_STATE_WAITING_FOR_OPPONENT_']
        });
        columnClickedData[i] = parseInt(this.props.playerNumber,10);
        
        this.API.playerPlacedBlock(this.props.playerNumber, columnIndex);
        
        //calling column method to add a new block, the child component will animate and display the block
        var refName = 'column'+columnIndex;
        this.refs[refName].addNewBlock(this.props.playerNumber, i);
    };
    
    renderGameStatusBar(){
        var extraStyle = {};
        var message = '';
        switch(this.state.currentGameState) {
            case this.gameStates['_STATE_NO_OPPONENT_ONLINE_']:
                message = 'There are no opponents connected.';
                break;
            case this.gameStates['_STATE_WAITING_FOR_OPPONENT_']:
                message = 'Please wait, it is your opponents turn.';
                break;
            case this.gameStates['_STATE_PLAYER_ID_ALREADY_IN_USE_']:
                message = 'This player ID is already in use, please wait for the player to disconnect.';
                break;
            case this.gameStates['_STATE_PLAYER1_WON_THE_GAME']:
                message = 'PLAYER 1 IS THE WINNER!';
                break;
            case this.gameStates['_STATE_PLAYER2_WON_THE_GAME']:
                message = 'PLAYER 2 IS THE WINNER!';
                break;
            default:
                message = 'Your turn to play.';
                break;
        }
        
        return <div className="statusMessage" style={extraStyle}>{message}</div>;
    };
    
    handleRestartGameCLick = () => {
        window.location.reload();
    };
    
    renderStartAgainButton(){
        if(this.state.currentGameState === this.gameStates['_STATE_PLAYER1_WON_THE_GAME'] || this.state.currentGameState === this.gameStates['_STATE_PLAYER2_WON_THE_GAME']){
            return <a onClick={this.handleRestartGameCLick} className="restartGame">RESTART THE GAME</a>;
        }
        
        return null;
    };

    render() {
        return (
        <div className="GamesBoard">
            <div className="columnsWrapper">
                <GamesBoardColumn ref="column0" columnIndex="0" onChildColumnClick={this.handleColumnClick}/>
                <GamesBoardColumn ref="column1" columnIndex="1" onChildColumnClick={this.handleColumnClick}/>
                <GamesBoardColumn ref="column2" columnIndex="2" onChildColumnClick={this.handleColumnClick}/>
                <GamesBoardColumn ref="column3" columnIndex="3" onChildColumnClick={this.handleColumnClick}/>
                <GamesBoardColumn ref="column4" columnIndex="4" onChildColumnClick={this.handleColumnClick}/>
                <GamesBoardColumn ref="column5" columnIndex="5" onChildColumnClick={this.handleColumnClick}/>
                <GamesBoardColumn ref="column6" columnIndex="6" onChildColumnClick={this.handleColumnClick}/>
            </div>
            
            {this.renderGameStatusBar()}
            {this.renderStartAgainButton()}
        </div>
    );
  }
}