import React, { Component } from 'react';
import GamesBoardColumn from './GamesBoardColumn.js';

import './GamesBoard.style.css';

export default class GamesBoard extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className="GamesBoard">
        <GamesBoardColumn/>
        <GamesBoardColumn/>
        <GamesBoardColumn/>
        <GamesBoardColumn/>
        <GamesBoardColumn/>
        <GamesBoardColumn/>
        <GamesBoardColumn/>
      </div>
    );
  }
}