import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Section, Box } from 'react-bulma-components';
import StackChart from './components/StackChart';
import './App.css';

class App extends Component {
  state = {
    data: [
        {label:"A?", "Satisfied":30, "Not Satisfied":38},
        {label:"B?", "Satisfied":45, "Not Satisfied":43},
        {label:"C?", "Satisfied":40, "Not Satisfied":40}   
    ],
    width: 500,
    height: 500,
    id: "root"
  };
  render() {
    return (
      <div className="App">
        <Section>        
          <Box>
            <StackChart data={this.state.data} width={this.state.width} height={this.state.height} />            
          </Box>    
        </Section>
      </div>
    );
  }
}

export default App;
