import React, { Component } from 'react';
import GamesBoard from './GamesBoard.js';

import './Games.style.css';

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