import React, { Component } from 'react';
import numbro from 'numbro';
import '../App.css';

class Cell extends Component {

  render() {
    const total = this.props.numbers ? this.props.numbers.reduce((a,b) => Number(a) + Number(b), 0) : 0  
    const formattedTotal = total ? numbro(total).format({average: true}) : 0;

    const input = this.props.numbers
    ?  
    <input key={this.props.index} onChange={this.props.handleChange} name="total" type="string" value={formattedTotal} disabled/>
    : 
    <input key={this.props.index} name={`_${this.props.index}`} onChange={this.props.handleChange} type="number"/>

    return (
        <div className="cell">
            {input}
        </div>
    );
  }
}

export default Cell;
