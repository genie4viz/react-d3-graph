import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Section, Box } from 'react-bulma-components';
import StackChart from './components/StackChart';
import './App.css';

class App extends Component {
  state = {
    data: [12, 5, 6, 6, 9, 10],
    width: 700,
    height: 500,
    id: "root"
  };
  render() {
    return (
      <div className="App">
        <Section>        
          <Box>
            <StackChart data={this.state.data} width={this.state.width} height={this.state.height} />
            <Button color="primary">My Bulma button</Button>
          </Box>    
        </Section>
      </div>
    );
  }
}

export default App;
