import React, { Component } from 'react';
import GamesBoardColumn from './GamesBoardColumn.js';

import './GamesBoard.style.css';

export default class GamesBoard extends Component {
    constructor(props) {
        super(props);
        
        this.gameStates = {
            '_STATE_NO_OPPONENT_ONLINE_': 0,
            '_STATE_WAITING_FOR_OPPONENT_': 1,
            '_STATE_IT_IS_CURRENT_PLAYERS_TURN_': 2,
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
            [0,0,0,0,0,0],
        ];
        
        this.state = {
            currentGameState: this.gameStates['_STATE_IT_IS_CURRENT_PLAYERS_TURN_']
        };
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
        
        //this.setState({
        //    'currentGameState': this.gameStates['_STATE_WAITING_FOR_OPPONENT_']
        //});
        columnClickedData[i] = this.props.playerNumber;
        
        //calling column method to add a new block, the child component will animate and display the block
        var refName = 'column'+columnIndex;
        this.refs[refName].addNewBlock(this.props.playerNumber, i);
    };
    
    renderGameStatusBar(){
        var message = '';
        switch(this.state.currentGameState) {
            case this.gameStates['_STATE_NO_OPPONENT_ONLINE_']:
                message = 'There are no opponents connected.';
                break;
            case this.gameStates['_STATE_WAITING_FOR_OPPONENT_']:
                message = 'Please wait, it is your opponents turn.';
                break;
            default:
                message = 'Your turn to play.';
                break;
        }
        
        return <div className="statusMessage">{message}</div>;
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
        </div>
    );
  }
}