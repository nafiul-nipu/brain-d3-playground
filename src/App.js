import './App.css';
import { ChordContainer } from './ChordContainer';
import { Container, Row, Col } from 'react-bootstrap'
import { ReactComponent as Brain } from './brain.svg';

function App() {
  return (
    <Container fluid>
      <Row>
        <Col md='12' className='svg-container'>
          <ChordContainer />
          <Brain className='bottom-svg' />

        </Col>

      </Row>
    </Container>

  );
}

export default App;
