import React, { Component } from 'react';
import GamesBoard from './GamesBoard.js';

import './Games.style.css';

/* Games page, displays the player number and the Gamesboard */
export default class Games extends Component {
  render() {
    return (
      <div className={Games}>
        <h1>
          Player {this.props.match.params.number}
        </h1>
        <div className="GamesBoardWrapper">
            <GamesBoard playerNumber={this.props.match.params.number}/>
        </div>
      </div>
    );
  }
}