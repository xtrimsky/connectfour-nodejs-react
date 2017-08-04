import React, { Component } from 'react';
import GamesBoard from './GamesBoard.js';

import './Games.style.css';

export default class Games extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className={Games}>
        <h1>
          Player {this.props.match.params.number}
        </h1>
        <div className="GamesBoardWrapper">
        <GamesBoard/>
        </div>
      </div>
    );
  }
}