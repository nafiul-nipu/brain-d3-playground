import './App.css';
import { ChordContainer } from './components/ChordContainer';
import { Container, Row, Col } from 'react-bootstrap'
import { ReactComponent as Brain } from './data/brain.svg';
import { useState } from 'react';
import { useFullNetwork } from './components/useFullNetwork';
import { useFullNetworkPerEvent } from './components/useFullNetworkEvent';
import { ChordContainerNetwork } from './components/chordContainerNetwork';
import { AdjacencyMatrix } from './components/AdjacencyMatrix';
import { AdjacencyContainer } from './components/AdjacencyContainer';

function App() {
  const [sample, selectedSample] = useState('sample1')

  const [selectedOption, setSelectedOption] = useState('container');

  const [selectedKey, setSelectedKey] = useState("");

  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const [eventData, setEventData] = useState(null)

  const [showParagraph, setShowParagraph] = useState(false);

  const handleOptionChange = (event) => {
    if (event.target.value === 'container') {
      setIsNetworkActive(false)
      setShowParagraph(false)
    } else {
      setIsNetworkActive(true)
    }
    setSelectedOption(event.target.value);
  };

  function onSampleChange(event) {
    // let sampleName = event.target.value;
    selectedSample(event.target.value)
    setShowParagraph(false)
  }

  function handleEventDropDown(event) {
    setEventData(fullNetworkEvent[event.target.value])
    setShowParagraph(false)
    setSelectedKey(event.target.value)

  }

  const fullNetwork = useFullNetwork({ sample: sample })
  const fullNetworkEvent = useFullNetworkPerEvent({ sample: sample })

  if (!fullNetworkEvent) {
    return (<div>data loading</div>)
  }
  // console.log(fullNetwork)
  // console.log(fullNetworkEvent[91])

  const options = Object.keys(fullNetworkEvent);

  return (
    <Container fluid>
      <Row>
        <Col md='2' className='svg-container'>
          <Row>
            <Col md='12'>
              <select value={sample} onChange={onSampleChange}>
                <option value={'sample1'}>Sample1</option>
                <option value={'sample2'}>Sample2</option>
                <option value={'sample3'}> Sample3</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col md='12'>
              <select value={selectedOption} onChange={handleOptionChange}>
                <option value="container">Chord Container</option>
                <option value="containerNetwork">Chord Container Network</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col md='12'>
              <select value={selectedKey} onChange={handleEventDropDown}>
                <option value="">Select a key</option>
                {options.map((key) => (
                  <option key={key} value={key} disabled={!isNetworkActive}>
                    {key}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

        </Col>
        <Col md='10' className='svg-container'>
          {selectedOption === 'container' ? (
            <ChordContainer networkdata={fullNetwork} />
          ) : (
            <ChordContainerNetwork
              network={fullNetwork}
              networkEvent={eventData}
              eventKey={selectedKey}
              showParagraph={showParagraph}
              setShowParagraph={setShowParagraph}
              sample={sample}
            />
          )}
          <Brain className='bottom-svg' />
          {/* <AdjacencyMatrix /> */}
          {fullNetwork ? <AdjacencyContainer networkdata={fullNetwork} /> : null}

        </Col>

      </Row>
    </Container>

  );
}

export default App;
