import './App.css';
import { ChordContainer } from './ChordContainer';
import { Container, Row, Col } from 'react-bootstrap'

function App() {
  return (
    <Container fluid>
      <Row>
        <Col md='12'>
          <ChordContainer />
        </Col>
      </Row>
    </Container>

  );
}

export default App;
