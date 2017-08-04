import React, { Component } from 'react';

import './GamesBoardColumn.style.css';

export default class GamesBoardColumn extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className="GamesBoardColumn">
        <div className="placementSpot"></div>
        <div className="placementSpot"></div>
        <div className="placementSpot"></div>
        <div className="placementSpot"></div>
        <div className="placementSpot"></div>
        <div className="placementSpot"></div>
      </div>
    );
  }
}