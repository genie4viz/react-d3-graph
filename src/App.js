import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Section, Box } from 'react-bulma-components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Section>
          <Box>
            <Button color="primary">My Bulma button</Button>            
          </Box>    
        </Section>
      </div>
    );
  }
}

export default App;
