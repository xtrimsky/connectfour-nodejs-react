import React, { Component } from 'react';

import './Welcome.style.css';

export default class Welcome extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div className={Welcome}>
        <h1>
            Connect Four
        </h1>
        <h2>
            2 Players game built by Andrei Pervychine using ReactJS
        </h2>
        <a className="playerSelect" href="/games/1">PLAYER 1</a>
        <a className="playerSelect" href="/games/2">PLAYER 2</a>
      </div>
    );
  }
}