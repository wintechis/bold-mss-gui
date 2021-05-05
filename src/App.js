import React, { Component } from 'react';
import { Group, Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';
import { Bindings } from '@comunica/bus-query-operation';
import { DataFactory } from 'rdf-data-factory';
const newEngine = require('@comunica/actor-init-sparql').newEngine;
const myEngine = newEngine();
const factory = new DataFactory();

const baseURI = 'https://localhost:8443/arena2036/'

class Grid extends React.Component {
  render() {
    let lines = []
    for(let i = 0; i <= this.props.width * 30; i += 30) {
        lines.push(<Line key={i + 1} points={[i,0,i,this.props.height * 30]} stroke="black" strokeWidth={0.5} />)
    }
    for(let j = 0; j <= this.props.height * 30; j += 30) {
      lines.push(<Line key={-j - 1} points={[0,j,this.props.width * 30,j]} stroke="black" strokeWidth={0.5} />)
    }
    return (
      <Layer>
        {lines}
      </Layer>
    )
  }
}

class ProductStack extends React.Component {
  render() {
    return (
      <Group>
        <Circle
          x={this.props.x * 30 + 15}
          y={this.props.y * 30 + 15}
          radius={10}
          fill='orange'
          stroke='black'
          strokeWidth={1.5}
        />
        <Text x={this.props.x * 30 + 11} y={this.props.y * 30 + 10} fontSize={14} align="center" text={this.props.ps.length} />
      </Group>
    )
  }
}

class Port extends React.Component {
  render() {
    let color = this.props.input === 'true' ? 'green' : 'red';
    return (
      <Group>
        <Rect
          x={this.props.x * 30}
          y={this.props.y * 30}
          width={30}
          height={30}
          fill={color}
          opacity={0.5}
        />
      </Group>
    )
  }
}

class Station extends React.Component {
  render() {
    return (
      <Group>
        <Rect
          x={this.props.x1 * 30}
          y={this.props.y1 * 30}
          width={(this.props.x2 - this.props.x1 + 1) * 30}
          height={(this.props.y2 - this.props.y1 + 1) * 30}
          fill='blue'
          stroke='black'
          strokeWidth={1.5}
        />
      </Group>
    )
  }
}

class Transporter extends React.Component {
  render() {
    return (
      <Group>
        <Rect
          x={this.props.x * 30}
          y={this.props.y * 30}
          width={30}
          height={30}
          fill='#bbbbbb'
          stroke='black'
          strokeWidth={1.5}
        />
        <Circle
          x={this.props.x * 30 + 15}
          y={this.props.y * 30 + 15}
          radius={10}
          fill='#e4e4e4'
          stroke='black'
          strokeWidth={1.5}
        />
      </Group>
    )
  }
}

class Order extends React.Component {
  render() {
    let uri = baseURI + 'orders/' + this.props.entity + '/#order'
    return (
      <div
        onMouseEnter={() => this.props.setHoverUri(uri)}
        onMouseLeave={() => this.props.setHoverUri('')}
        onMouseUp={() => window.open(uri, '_blank')}
        style={{
          border: '2pt solid',
          padding: '10pt',
          fontSize: 'smaller',
          marginTop: '25px'
        }}
      >
        <h2 style={{margin: '5pt', paddingLeft: '1pt'}}>Order {this.props.entity}</h2>
        <table style={{margin: '5pt', width: '100%'}}>
          <tbody>
            <tr>
              <th style={{textAlign: 'left'}}>RAM:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.ram} GB
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>CPU:</th>
              <td>
                {this.props.requirements.cpu.split('#')[1]}
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Memory:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.memory} GB
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Ports:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.ports.map(p => p.split('#')[1]).join(', ')}
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Case:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.case.split('#')[1]}
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Com. Units:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.communication.map(c => c.split('#')[1]).join(', ')}
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Sensor Units:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.sensor.map(s => s.split('#')[1]).join(', ')}
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Battery:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.battery} mAh
              </td>
            </tr>
            <tr>
              <th style={{textAlign: 'left'}}>Display Size:</th>
              <td style={{textAlign: 'left'}}>
                {this.props.requirements.display}''
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: []
    }
    this.updateProducts = this.updateProducts.bind(this);
  }

  componentDidMount() {
    this.updateProducts();
  }

  componentDidUpdate(oldProps) {
    if(oldProps.step !== this.props.step) {
      this.updateProducts();
    }
  }

  updateProducts() {
    // Get products to App state via Comunica
    myEngine.query(`
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX arena: <http://arena2036.example.org/>
      PREFIX sim: <http://ti.rw.fau.de/sim#>

      SELECT *
      WHERE {
        GRAPH ?product {
          ?product a arena:Product ;
            arena:kind ?kind ;
            arena:locationX ?locationX ;
            arena:locationY ?locationY .
        }
      } 
      `, {
      sources: [`http://localhost:8000/modularSmartphone-${this.props.step}.trig`],
    }).then((result) => {
      let products = []
      result.bindingsStream.on('data', (binding) => {
        products.push({
          'id': binding.get('?product').value,
          'kind': binding.get('?kind').value,
          'x': binding.get('?locationX').value,
          'y': binding.get('?locationY').value,
        })
      });
      result.bindingsStream.on('end', () => this.setState({'products': products}));
    }).catch(console.error);
  }

  render() {
    let prod = [...this.state.products];
    let stacks = [];
    let i = 0;
    while(prod.length > 0) {
      let p = prod.pop();
      let ps = [...prod.filter(pro => pro.x === p.x && pro.y === p.y), p];
      stacks.push(<ProductStack key={i} x={p.x} y={p.y} ps={ps}/>)
      prod = prod.filter(pro => !(pro.x === p.x && pro.y === p.y))
      i++;
    }
    return (
      <>
        {stacks}
      </>
    )
  }
}

class Ports extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    }
    this.updatePorts = this.updatePorts.bind(this);
  }

  componentDidMount() {
    this.updatePorts();
  }

  componentDidUpdate(oldProps) {
    if(oldProps.step !== this.props.step) {
      this.updatePorts();
    }
  }

  updatePorts() {
    // Get ports to App state via Comunica
    myEngine.query(`
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX arena: <http://arena2036.example.org/>
      PREFIX sim: <http://ti.rw.fau.de/sim#>

      SELECT *
      WHERE {
        GRAPH ?station {
          {
            ?station arena:inputPort ?port .

            BIND (TRUE AS ?input)
          } UNION {
            ?station arena:outputPort ?port .

            BIND (FALSE AS ?input)
          }

          ?port a arena:Port ;
            arena:locationX ?locationX ;
            arena:locationY ?locationY .
        }
      } 
      `, {
      sources: [`http://localhost:8000/modularSmartphone-${this.props.step}.trig`],
    }).then((result) => {
      let ports = []
      result.bindingsStream.on('data', (binding) => {
        ports.push({
          'id': binding.get('?port').value,
          'x': binding.get('?locationX').value,
          'y': binding.get('?locationY').value,
          'input': binding.get('?input').value,
        })
      });
      result.bindingsStream.on('end', () => this.setState({'ports': ports}));
    }).catch(console.error);
  }

  render() {
    let ports = this.state.ports.map((t) => <Port key={t.id} id={t.id} input={t.input} x={t.x} y={t.y} />)
    return (
      <>
        {ports}
      </>
    )
  }
}

class Stations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stations: []
    }
    this.updateStations = this.updateStations.bind(this);
  }

  componentDidMount() {
    this.updateStations();
  }

  componentDidUpdate(oldProps) {
    if(oldProps.step !== this.props.step) {
      this.updateStations();
    }
  }

  updateStations() {
    // Get stations to App state via Comunica
    myEngine.query(`
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX arena: <http://arena2036.example.org/>
      PREFIX sim: <http://ti.rw.fau.de/sim#>

      SELECT *
      WHERE {
        GRAPH ?station {
          ?station a arena:Workstation ;
            arena:locationX1 ?locationX1 ;
            arena:locationY1 ?locationY1 ;
            arena:locationX2 ?locationX2 ;
            arena:locationY2 ?locationY2 .
        }
      } 
      `, {
      sources: [`http://localhost:8000/modularSmartphone-${this.props.step}.trig`],
    }).then((result) => {
      let stations = []
      result.bindingsStream.on('data', (binding) => {
        stations.push({
          'id': binding.get('?station').value,
          'x1': binding.get('?locationX1').value,
          'y1': binding.get('?locationY1').value,
          'x2': binding.get('?locationX2').value,
          'y2': binding.get('?locationY2').value,
        })
      });
      result.bindingsStream.on('end', () => this.setState({'stations': stations}));
    }).catch(console.error);
  }

  render() {
    let stations = this.state.stations.map((t) => <Station key={t.id} id={t.id} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}/>)
    return (
      <>
        {stations}
      </>
    )
  }
}

class Transporters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transporters: []
    }
    this.updateTransporters = this.updateTransporters.bind(this);
  }

  componentDidMount() {
    this.updateTransporters();
  }

  componentDidUpdate(oldProps) {
    if(oldProps.step !== this.props.step) {
      this.updateTransporters();
    }
  }

  updateTransporters() {
    // Get transporters to App state via Comunica
    myEngine.query(`
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX arena: <http://arena2036.example.org/>
      PREFIX sim: <http://ti.rw.fau.de/sim#>

      SELECT *
      WHERE {
        GRAPH ?transporter {
          ?transporter a arena:Transporter ;
            arena:locationX ?locationX ;
            arena:locationY ?locationY .
        }
      } 
      `, {
      sources: [`http://localhost:8000/modularSmartphone-${this.props.step}.trig`],
    }).then((result) => {
      let transporters = []
      result.bindingsStream.on('data', (binding) => {
        transporters.push({
          'id': binding.get('?transporter').value,
          'x': binding.get('?locationX').value,
          'y': binding.get('?locationY').value,
        })
      });
      result.bindingsStream.on('end', () => this.setState({'transporters': transporters}));
    }).catch(console.error);
  }

  render() {
    let transporters = this.state.transporters.map((t) => <Transporter key={t.id} id={t.id} x={t.x} y={t.y}/>)
    return (
      <>
        {transporters}
      </>
    )
  }
}

class SelectedItems extends Component {
  render() {
    let items = this.props.selectedItems.map(i => <li key={i}><a href={i}>{i}</a></li>);
    return (
      <div>
        <ul>
          {items}
        </ul>
      </div>
    )
  }
}

class Selection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ids: []
    }
    this.updateSelection = this.updateSelection.bind(this);
  }

  componentDidMount() {
    this.updateSelection();
  }

  componentDidUpdate(oldProps) {
    if(oldProps.step !== this.props.step || oldProps.x !== this.props.x || oldProps.y !== this.props.y) {
      this.updateSelection();
    }
  }

  updateSelection() {
    // Get everything that is in the selected location
    myEngine.query(`
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX arena: <http://arena2036.example.org/>
      PREFIX sim: <http://ti.rw.fau.de/sim#>

      SELECT *
      WHERE {
        GRAPH ?g {
          {
            ?thing arena:locationX ?locationX ;
              arena:locationY ?locationY .
          } UNION {
            ?thing arena:locationX1 ?locationX1 ;
              arena:locationY1 ?locationY1 ;
              arena:locationX2 ?locationX2 ;
              arena:locationY2 ?locationY2 .
              
              FILTER(?locationX1 <= ?locationX && ?locationY1 <= ?locationY && ?locationX2 >= ?locationX && ?locationY2 >= ?locationY)
          }
        }
      } 
      `, {
      sources: [`http://localhost:8000/modularSmartphone-${this.props.step}.trig`],
      initialBindings: new Bindings({
        '?locationX': factory.literal(this.props.x, factory.namedNode('http://www.w3.org/2001/XMLSchema#integer')),
        '?locationY': factory.literal(this.props.y, factory.namedNode('http://www.w3.org/2001/XMLSchema#integer'))
      }), 
    }).then((result) => {
      let things = []
      result.bindingsStream.on('data', (binding) => {
        things.push(binding.get('?thing').value);
      });
      result.bindingsStream.on('end', () => this.props.updateSelectedItems(things));
    }).catch(console.error);
  }

  render() {
    return (
      <Layer>
        <Rect
          x={this.props.x * 30}
          y={this.props.y * 30}
          width={30}
          height={30}
          stroke='red'
          strokeWidth={1.5}
        />
      </Layer>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      step: 0,
      autoplay: false,
      zoom: 0,
      selection: {'x': 0, 'y': 0, 'items': []},
    }
    this.updateAutoplay = this.updateAutoplay.bind(this);
    this.updateSelectedItems = this.updateSelectedItems.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getZoomValue = this.getZoomValue.bind(this);
  }

  updateAutoplay() {
    let newAuto = !this.state.autoplay;
    this.setState({'autoplay': newAuto});
    if(newAuto) {
      this.autoplay = setInterval(
        () => this.setState({'step': parseInt(this.state.step) + 1}),
        500
      );
    } else {
      clearInterval(this.autoplay);
    }
  }

  updateSelectedItems(selectedItems) {
    this.setState({'selection': {'x': this.state.selection.x, 'y': this.state.selection.y, 'items': selectedItems}});
  }

  handleClick(event) {
    let x = Math.floor(event.evt.offsetX / (30 * this.getZoomValue()));
    let y = Math.floor(event.evt.offsetY / (30 * this.getZoomValue()));
    this.setState({'selection': {'x': x, 'y': y, 'items': []}});
  }

  getZoomValue() {
    return Math.pow(1.1, this.state.zoom)
  }

  render() {
    let playOrStop = this.state.autoplay ? 'Stop' : 'Play';
    return (
      <>
        <div
          style={{
            float: 'left',
            width: '75%',
            height: '99vh',
            display: 'flex',
            overflow: 'scroll',
          }}
        >
          <div>
            <Stage width={Math.ceil(1502 * this.getZoomValue())} height={Math.ceil(1502 * this.getZoomValue())} offsetX={-1} offsetY={-1} style={{margin: '30px', maxWidth: '100%'}} scaleX={this.getZoomValue()} scaleY={this.getZoomValue()} onClick={this.handleClick}>
              <Grid width={50} height={50} />
              <Layer>
                <Transporters step={this.state.step} />
              </Layer>
              <Layer>
                <Products step={this.state.step} />
              </Layer>
              <Layer>
                <Stations step={this.state.step} />
                <Ports step={this.state.step} />
              </Layer>
              <Selection step={this.state.step} x={this.state.selection.x} y={this.state.selection.y} updateSelectedItems={this.updateSelectedItems} />
            </Stage>
          </div>
        </div>
        <div
          style={{
            float: 'left',
            width: '25%',
          }}
        >
          <div
            style={{
              margin: '30px'
            }}
          >
            <p>
              <label htmlFor="zoom_input">Zoom:</label>
            </p>
            <input style={{width: '100px', marginRight: '20px'}} id="zoom_input" type="number" value={this.state.zoom} onChange={(event) => this.setState({'zoom': event.target.value})} />
          </div>
          <div
            style={{
              margin: "30px"
            }}
          >
            <p>
              <label htmlFor="step_input">Step:</label>
            </p>
            <input style={{width: '100px', marginRight: '20px'}} id="step_input" type="number" value={this.state.step} min={0} onChange={(event) => this.setState({'step': event.target.value})} />
            <button style={{marginRight: '20px'}} onClick={this.updateAutoplay}>{playOrStop}</button>
            <a target="_blank" rel="noopener noreferrer" href={`http://localhost:8000/modularSmartphone-${this.state.step}.trig`}>RDF</a>
          </div>
          <div
            style={{
              margin: "30px"
            }}
          >
            <p>
              <label>Selected Cell:</label>
            </p>
            <p>
              {this.state.selection.x}, {this.state.selection.y}
            </p>
          </div>
          <div
            style={{
              margin: "30px"
            }}
          >
            <p>
              <label htmlFor="step_input">Artifacts in Selected Cell:</label>
            </p>
            <SelectedItems selectedItems={this.state.selection.items} />
          </div>
        </div>
      </>
    );
  }
}

export default App;
