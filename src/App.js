import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Section, Box } from 'react-bulma-components';
import StackChart from './components/StackChart';
import GuageChart from './components/GuageChart';
import NegativeChart from './components/NegativeChart';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data_stack: [
          {label:"A?", "Satisfied":30, "Not Satisfied":38},
          {label:"B?", "Satisfied":45, "Not Satisfied":43},
          {label:"C?", "Satisfied":40, "Not Satisfied":40}   
      ],
      data_guage: {branche: 25, market: 45, current: 70, color: "#df072c", description:"PE-ratio"},
      data_negative:[
        {
          "year": "2015", 
          "values": [{"label": "OA", "value": 42},{"label": "IA", "value": 23},{"label": "FA", "value": -42},{"label": "CC", "value": -23},{"label": "EBITDA","value": 37}]
        },
        {
          "year": "2016", 
          "values": [{"label": "OA", "value": 42},{"label": "IA", "value": 23},{"label": "FA", "value": -42},{"label": "CC", "value": -23},{"label": "EBITDA","value": 37}]
        },
        {
          "year": "2017", 
          "values": [{"label": "OA", "value": 42},{"label": "IA", "value": 23},{"label": "FA", "value": -42},{"label": "CC", "value": -23},{"label": "EBITDA","value": 37}]
        },
        {
          "year": "2018", 
          "values": [{"label": "OA", "value": 42},{"label": "IA", "value": 23},{"label": "FA", "value": -42},{"label": "CC", "value": -23},{"label": "EBITDA","value": 37}]
        },
        {
          "year": "2019", 
          "values": [{"label": "OA", "value": 42},{"label": "IA", "value": 23},{"label": "FA", "value": -42},{"label": "CC", "value": -23},{"label": "EBITDA","value": 37}]
        },
      ],
      width: 500,
      height: 400
    };    
  };
  
  handleChange = () => {
    let new_data_stack = [
      {label:"BB", "Satisfied":50, "Not Satisfied":48},
      {label:"DD", "Satisfied":45, "Not Satisfied":43},
      {label:"AA", "Satisfied":40, "Not Satisfied":40}   
    ];
    let new_data_guage =
      {branche: 55, market: 85, current: 10, color: "#64ab30", description:"ROIC"};
    let new_data_negative = [
      {
        "year": "2015", 
        "values": [{"label": "OA", "value": 32},{"label": "IA", "value": 63},{"label": "FA", "value": -82},{"label": "CC", "value": -23},{"label": "EBITDA","value": 37}]
      },
      {
        "year": "2016", 
        "values": [{"label": "OA", "value": 12},{"label": "IA", "value": 23},{"label": "FA", "value": -49},{"label": "CC", "value": -33},{"label": "EBITDA","value": 47}]
      },
      {
        "year": "2017", 
        "values": [{"label": "OA", "value": 52},{"label": "IA", "value": 13},{"label": "FA", "value": -12},{"label": "CC", "value": -63},{"label": "EBITDA","value": 17}]
      },
      {
        "year": "2018", 
        "values": [{"label": "OA", "value": 82},{"label": "IA", "value": 28},{"label": "FA", "value": -52},{"label": "CC", "value": -93},{"label": "EBITDA","value": 77}]
      },
      {
        "year": "2019", 
        "values": [{"label": "OA", "value": 32},{"label": "IA", "value": 67},{"label": "FA", "value": -32},{"label": "CC", "value": -13},{"label": "EBITDA","value": 57}]
      },
    ];
    this.setState({
      data_stack: new_data_stack,
      data_guage: new_data_guage,
      data_negative: new_data_negative
    });
  };
 
  render() {    
    return (
      <div className="App">
        <Section>        
          <Box> 
            {this.state.data_stack && (<StackChart data={this.state.data_stack} width={this.state.width} height={this.state.height} />)}            
          </Box>          
          <Box>
            {this.state.data_guage && (<GuageChart data={this.state.data_guage} width={this.state.width} height={this.state.height} />)}
          </Box>
          <Box>
            {this.state.data_negative && (<NegativeChart data={this.state.data_negative} width={this.state.width} height={this.state.height} />)}
          </Box>
          <Button onClick={this.handleChange}>Change data</Button>
        </Section>
      </div>
    );
  }
}

export default App;
