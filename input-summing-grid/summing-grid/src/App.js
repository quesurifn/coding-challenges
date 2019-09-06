import React, { Component } from 'react';
import Cell from './components/Cell';

import './App.css';

class App extends Component {
  constructor() {
    super()
    // Change to add or remove rows
    this.numberOfBoxes = 4; 
    this.state = {
      numbers: []
    }

    this.handleChange = this.handleChange.bind(this);
    
  }

  handleChange(e) {
    const { numbers } = this.state;

    let newNumbersArray = [...numbers];
    newNumbersArray[parseInt(e.target.name.replace("_", ""), 10)] = e.target.value;

    this.setState({ numbers: newNumbersArray});
  }

  render() {

    const arrayStub = Array.from({length: this.numberOfBoxes}, () => Math.floor(Math.random() * this.numberOfBoxes));
    const boxes = arrayStub.map((e, idx) => {
      if(idx === (arrayStub.length - 1) ) {
        return <Cell index={idx} numbers={this.state.numbers} />
      } else { 
        return <Cell index={idx} handleChange={this.handleChange} />
      }
    })
  
    return (
      <div className="App">
        <div className="container">
         {boxes}
        </div>
      </div>
    );
  }
}

export default App;
