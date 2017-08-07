import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './GamesBoardColumn.style.css';

export default class GamesBoardColumn extends Component {
    constructor(props) {
        super(props);
        
        this.animation = {};
        this.addBlockQueue = [];
        this.state = {
            columnHeight: 0,
            animatedBlockPosition: 0,
            greenBlock: null,
            redBlock: null,
            mapClass: ['placementSpot','placementSpot','placementSpot','placementSpot','placementSpot','placementSpot']
        };
    };
    
    componentDidMount() {
        //calculating the size of the current column so that we can animate properly the blocks
        const height = ReactDOM.findDOMNode(this).clientHeight;
        this.setState({ columnHeight: height });
    };
    
    /* this is called when the GamesBoard component needs to update the map (usually at the start of a new round). It updates the content of the columns */
    updateColumnData(newValues){
        var mapClassResult = [];
        
        var i;
        for(i = 0; i < newValues.length; i++){
            if(newValues[i] === 0) {
                //no blocks placed here yet
                mapClassResult.push('placementSpot');
            } else if(newValues[i] === 1) {
                //a green block has been placed here
                mapClassResult.push('placementSpot green');
            } else if(newValues[i] === 2) {
                //a red block has been placed here
                mapClassResult.push('placementSpot red');
            }
        }
        
        this.setState({
            'mapClass': mapClassResult
        });
    };
    
    //method called by parent component to animate a block falling and then displaying it in the correct position
    //playerNumber = (1 or 2), display the color based on the player number
    //finalIndex index where the final block will fall to, the bottom one is 0, the top one is 5
    addNewBlock(playerNumber, finalIndex){
        if(this.animation.animating) {
            //if there is already an animation processing, let's just put it in a queue
            this.addBlockQueue.push({
                'playerNumber': playerNumber,
                'finalIndex': finalIndex
            });
            return;
        }
        
        //calculating the animation data
        this.animation = {
            animating: true,
            finalIndex: finalIndex,
            finalPosition: (this.state.columnHeight/6) * (6-finalIndex-1), //final vertical position in pixels
            color: 'green'
        };
        
        if(playerNumber === '1' || playerNumber === 1) {
            this.animateGreenBlock();
        } else {
            this.animation.color = 'red';
            this.animateRedBlock();
        }
    };
    
    //animation function, being called in a loop until an animation completes
    animateBlockPosition(){
        if(this.state.animatedBlockPosition <= this.animation.finalPosition ){
            this.setState({
                'animatedBlockPosition': (this.state.animatedBlockPosition + 15)
            });
            
            var self = this;
            setTimeout(function(){
                self.animateBlockPosition();
            }, 25);
        } else {
            //we update the map of the current column
            var newMapClass = this.state.mapClass;
            newMapClass[this.animation.finalIndex] = 'placementSpot '+this.animation.color;
            
            this.setState({
              greenBlock: false,
              redBlock: false,
              mapClass: newMapClass,
              animatedBlockPosition: 0
            });
            
            //clear the animation
            this.animation = {};
            
            //anything in the queue?
            //this is if the players are clicking before animations are done
            if(this.addBlockQueue.length > 0) {
                var queueElement = this.addBlockQueue.shift();
                this.addNewBlock(queueElement.playerNumber, queueElement.finalIndex);
            }
        }
    };
  
    animateGreenBlock(){
        this.setState({
            animatedBlockPosition: 0,
            greenBlock: true
        });
        
        this.animateBlockPosition();
    };
    
    animateRedBlock(){
        this.setState({
            animatedBlockPosition: 0,
            redBlock: true
        });
        
        this.animateBlockPosition();
    };
    
    /* 
        this is only for the animated green block
        once the block falls into place this object is removed
    */
    renderGreenBlock(){
        if(!this.state.greenBlock) {
            return;
        }
        
        return <div className="greenBlock" style={{top: this.state.animatedBlockPosition}}></div>;
    };
    
    /* 
        this is only for the animated red block
        once the block falls into place this object is removed
    */
    renderRedBlock(){
        if(!this.state.redBlock) {
            return;
        }
        
        return <div className="redBlock" style={{top: this.state.animatedBlockPosition}}></div>;
    };
    
    render() {
        return (
        <div className="GamesBoardColumn" onClick={() => this.props.onChildColumnClick(this.props.columnIndex)}>
            {this.renderGreenBlock()}
            {this.renderRedBlock()}
            <div className={this.state.mapClass[5]}></div>
            <div className={this.state.mapClass[4]}></div>
            <div className={this.state.mapClass[3]}></div>
            <div className={this.state.mapClass[2]}></div>
            <div className={this.state.mapClass[1]}></div>
            <div className={this.state.mapClass[0]}></div>
        </div>
        );
    }
};