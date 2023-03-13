import './App.css';
import { ChordContainer } from './components/ChordContainer';
import { Container, Row, Col } from 'react-bootstrap'
import { ReactComponent as Brain } from './data/brain.svg';
import { useState } from 'react';
import { useFullNetwork } from './components/useFullNetwork';
import { useFullNetworkPerEvent } from './components/useFullNetworkEvent';
import { ChordContainerNetwork } from './components/chordContainerNetwork';

function App() {
  const [sample, selectedSample] = useState('sample1')
  const fullNetwork = useFullNetwork({ sample: sample })
  const fullNetworkEvent = useFullNetworkPerEvent({ sample: sample })

  // console.log(fullNetwork)
  // console.log(fullNetworkEvent[91])

  function onSampleChange(event) {
    // let sampleName = event.target.value;
    selectedSample(event.target.value)
  }

  return (
    <Container fluid>
      <Row>
        <Col md='2' className='svg-container'>
          <select value={sample} onChange={onSampleChange}>
            <option value={'sample1'}>Sample1</option>
            <option value={'sample2'}>Sample2</option>
            <option value={'sample3'}> Sample3</option>
          </select>

        </Col>
        <Col md='10' className='svg-container'>
          {/* <ChordContainer networkdata={fullNetwork} /> */}
          <ChordContainerNetwork
            network={fullNetwork}
            networkEvent={fullNetworkEvent[91]}
          />
          <Brain className='bottom-svg' />

        </Col>

      </Row>
    </Container>

  );
}

export default App;
