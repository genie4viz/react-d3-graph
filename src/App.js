import React, { Component, useState  } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Section, Box } from 'react-bulma-components';
import StackChart from './components/StackChart';
import './App.css';
import GuageChart from './components/GuageChart';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data_stack: [
          {label:"A?", "Satisfied":30, "Not Satisfied":38},
          {label:"B?", "Satisfied":45, "Not Satisfied":43},
          {label:"C?", "Satisfied":40, "Not Satisfied":40}   
      ],
      data_guage: {branche: 25, market: 45, current: 70, color: "#df072c"},
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
      {branche: 25, market: 45, current: 10, color: "#df072c"};
    
    this.setState({
      data_stack: new_data_stack,
      data_guage: new_data_guage
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
          <Button onClick={this.handleChange}>Change Input</Button>
        </Section>
      </div>
    );
  }
}

export default App;
