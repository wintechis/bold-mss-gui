import React, { Component } from 'react';
import { Group, Stage, Layer, Rect, Line, Circle } from 'react-konva';

const baseURI = 'https://localhost:8443/arena2036/'

class Grid extends React.Component {
  render() {
    let lines = []
    for(let i = 0; i <= this.props.width * 50; i += 50) {
        lines.push(<Line key={i + 1} points={[i,0,i,this.props.height * 50]} stroke="black" strokeWidth={0.5} />)
    }
    for(let j = 0; j <= this.props.height * 50; j += 50) {
      lines.push(<Line key={-j - 1} points={[0,j,this.props.width * 50,j]} stroke="black" strokeWidth={0.5} />)
    }
    return (
      <Layer>
        {lines}
      </Layer>
    )
  }
}

class Product extends React.Component {
  render() {
    let uri = baseURI + 'products/' + this.props.type + '/' + this.props.entity + '/#product'
    return (
      <Group>
        <Circle
          x={this.props.x * 50 + 25}
          y={this.props.y * 50 + 25}
          radius={18}
          fill='orange'
          stroke='black'
          onMouseEnter={() => this.props.setHoverUri(uri)}
          onMouseLeave={() => this.props.setHoverUri('')}
          onMouseUp={() => window.open(uri, '_blank')}
        />
      </Group>
    )
  }
}

class Station extends React.Component {
  render() {
    let uri = baseURI + 'stations/' + this.props.type + '/' + this.props.entity + '/#station'
    return (
      <Group>
        <Rect
          x={this.props.x * 50}
          y={this.props.y * 50}
          width={this.props.width * 50}
          height={this.props.height * 50}
          fill='darkgreen'
          stroke='black'
          onMouseEnter={() => this.props.setHoverUri(uri)}
          onMouseLeave={() => this.props.setHoverUri('')}
          onMouseUp={() => window.open(uri, '_blank')}
        />
      </Group>
    )
  }
}

class Forklift extends React.Component {
  render() {
    let uri = baseURI + 'forklifts/' + this.props.entity + '/#fl'
    return (
      <Group>
        <Rect
          x={this.props.x * 50}
          y={this.props.y * 50}
          width={50}
          height={50}
          fill='#bbbbbb'
          stroke='black'
          onMouseEnter={() => this.props.setHoverUri(uri)}
          onMouseLeave={() => this.props.setHoverUri('')}
          onMouseUp={() => window.open(uri, '_blank')}
        />
        <Circle
          x={this.props.x * 50 + 25}
          y={this.props.y * 50 + 25}
          radius={18}
          fill='#e4e4e4'
          stroke='black'
          onMouseEnter={() => this.props.setHoverUri(uri)}
          onMouseLeave={() => this.props.setHoverUri('')}
          onMouseUp={() => window.open(uri, '_blank')}
        />
      </Group>
    )
  }
}

class SmartphoneConfigurator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cpu: this.props.partList.cpu[0],
      ram: 1,
      memory: 16,
      port: [],
      case: this.props.partList.case[0],
      communication: [],
      sensor: [],
      battery: 2000,
      display: 4
    }
    this.handleRam = this.handleRam.bind(this)
    this.handleCpu = this.handleCpu.bind(this)
    this.handleMemory = this.handleMemory.bind(this)
    this.handlePort = this.handlePort.bind(this)
    this.handleCase = this.handleCase.bind(this)
    this.handleCommunication = this.handleCommunication.bind(this)
    this.handleSensor = this.handleSensor.bind(this)
    this.handleBattery = this.handleBattery.bind(this)
    this.handleDisplay = this.handleDisplay.bind(this)
    this.order = this.order.bind(this)
  }

  handleRam(event) {
    this.setState({
      ram: parseInt(event.target.value)
    })
  }

  handleCpu(event) {
    this.setState({
      cpu: event.target.value
    })
  }

  handleMemory(event) {
    this.setState({
      memory: parseInt(event.target.value)
    })
  }

  handlePort(event) {
    this.setState({
      port: Array.from(event.target.selectedOptions, option => option.value)
    })
  }

  handleCase(event) {
    this.setState({
      case: event.target.value
    })
  }

  handleCommunication(event) {
    this.setState({
      communication: Array.from(event.target.selectedOptions, option => option.value)
    })
  }

  handleSensor(event) {
    this.setState({
      sensor: Array.from(event.target.selectedOptions, option => option.value)
    })
  }

  handleBattery(event) {
    this.setState({
      battery: parseInt(event.target.value)
    })
  }

  handleDisplay(event) {
    this.setState({
      display: parseFloat(event.target.value)
    })
  }

  order() {
    this.props.sendOrder({order: this.state})
    this.setState({
      cpu: this.props.partList.cpu[0],
      ram: 1,
      memory: 16,
      port: [],
      case: this.props.partList.case[0],
      communication: [],
      sensor: [],
      battery: 2000,
      display: 4
    })
  }

  render() {
  let cpus = this.props.partList.cpu.map(cpu => <option key={cpu} label={cpu.split('#')[1]}>{cpu}</option>)
  let ports = this.props.partList.port.map(port => <option key={port} label={port.split('#')[1]}>{port}</option>)
  let cases = this.props.partList.case.map(c => <option key={c} label={c.split('#')[1]}>{c}</option>)
  let communications = this.props.partList.communication.map(comm => <option key={comm} label={comm.split('#')[1]}>{comm}</option>)
  let sensors = this.props.partList.sensor.map(sensor => <option key={sensor} label={sensor.split('#')[1]}>{sensor}</option>)
    return (
      <div>
        <h3>New Smartphone Order:</h3>
        <p>
          <label htmlFor="ram">RAM:</label>
          <select id="ram" value={this.state.ram} onChange={this.handleRam}>
            <option label="1 GB">1</option>
            <option label="2 GB">2</option>
            <option label="3 GB">3</option>
            <option label="4 GB">4</option>
            <option label="5 GB">5</option>
            <option label="6 GB">6</option>
            <option label="7 GB">7</option>
            <option label="8 GB">8</option>
          </select>
        </p>
        <p>
          <label htmlFor="cpu">CPUs:</label>
          <select id="cpu" value={this.state.cpu} onChange={this.handleCpu}>
            {cpus}
          </select>
        </p>
        <p>
          <label htmlFor="memory">Memory:</label>
          <select id="memory" value={this.state.memory} onChange={this.handleMemory}>
            <option label="16 GB">16</option>
            <option label="32 GB">32</option>
            <option label="64 GB">64</option>
            <option label="128 GB">128</option>
          </select>
        </p>
        <p>
          <label htmlFor="ports">Ports:</label>
          <select id="ports" value={this.state.port} onChange={this.handlePort} multiple={true}>
            {ports}
          </select>
        </p>
        <p>
          <label htmlFor="case">Case:</label>
          <select id="case" value={this.state.case} onChange={this.handleCase}>
            {cases}
          </select>
        </p>
        <p>
          <label htmlFor="communications">Communication Units:</label>
          <select id="communications" value={this.state.communication} onChange={this.handleCommunication} multiple={true}>
            {communications}
          </select>
        </p>
        <p>
          <label htmlFor="sensors">Sensor Units:</label>
          <select id="sensors" value={this.state.sensor} onChange={this.handleSensor} multiple={true}>
            {sensors}
          </select>
        </p>
        <p>
          <label htmlFor="battery">Battery:</label>
          <select id="battery" value={this.state.battery} onChange={this.handleBattery}>
            <option label="2000 mAh">2000</option>
            <option label="2500 mAh">2500</option>
            <option label="3000 mAh">3000</option>
            <option label="3500 mAh">3500</option>
            <option label="4000 mAh">4000</option>
            <option label="4500 mAh">4500</option>
          </select>
        </p>
        <p>
          <label htmlFor="display">Display Size:</label>
          <select id="display" value={this.state.display} onChange={this.handleDisplay}>
            <option label="4''">4</option>
            <option label="4.5''">4.5</option>
            <option label="5''">5</option>
            <option label="5.5''">5.5</option>
            <option label="6''">6</option>
            <option label="6.5''">6.5</option>
          </select>
        </p>
        <p>
          <button onClick={this.order}>Order</button>
        </p>
      </div>
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
          fontSize: 'smaller'
        }}
      >
        <h2 style={{margin: '5pt', paddingLeft: '1pt'}}>Order {this.props.entity}</h2>
        <table style={{margin: '5pt', width: '100%'}}>
          <tr>
            <th style={{textAlign: 'left'}}>RAM:</th>
            <td>
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
            <td>
              {this.props.requirements.memory} GB
            </td>
          </tr>
          <tr>
            <th style={{textAlign: 'left'}}>Ports:</th>
            <td>
              {this.props.requirements.ports.map(p => p.split('#')[1]).join(', ')}
            </td>
          </tr>
          <tr>
            <th style={{textAlign: 'left'}}>Case:</th>
            <td>
              {this.props.requirements.case.split('#')[1]}
            </td>
          </tr>
          <tr>
            <th style={{textAlign: 'left'}}>Communication Units:</th>
            <td>
              {this.props.requirements.communication.map(c => c.split('#')[1]).join(', ')}
            </td>
          </tr>
          <tr>
            <th style={{textAlign: 'left'}}>Sensor Units:</th>
            <td>
              {this.props.requirements.sensor.map(s => s.split('#')[1]).join(', ')}
            </td>
          </tr>
          <tr>
            <th style={{textAlign: 'left'}}>Battery:</th>
            <td>
              {this.props.requirements.battery} mAh
            </td>
          </tr>
          <tr>
            <th style={{textAlign: 'left'}}>Display Size:</th>
            <td>
              {this.props.requirements.display}''
            </td>
          </tr>
        </table>
      </div>
    )
  }
}

class App extends Component {
  ws = new WebSocket('ws://localhost:8080/')

  constructor() {
    super()
    this.state = {
      hover: '',
      partList: {
        cpu: [
          'https://localhost:8443/arena2036/products/cpu/#dualcore',
          'https://localhost:8443/arena2036/products/cpu/#quadcore',
          'https://localhost:8443/arena2036/products/cpu/#octocore',
        ],
        port: [
          'https://localhost:8443/arena2036/products/port/#audioJack',
          'https://localhost:8443/arena2036/products/port/#dolbySpeaker'
        ],
        case: [
          'https://localhost:8443/arena2036/products/case/#metal',
          'https://localhost:8443/arena2036/products/case/#plastic'
        ],
        communication: [
          'https://localhost:8443/arena2036/products/communication-unit/#bluetooth',
          'https://localhost:8443/arena2036/products/communication-unit/#gps'
        ],
        sensor: [
          'https://localhost:8443/arena2036/products/sensor-unit/#camera',
          'https://localhost:8443/arena2036/products/sensor-unit/#compass'
        ]
      },
      forklifts: new Map(),
      stations: new Map(),
      products: new Map(),
      orders: new Map()
    }
    this.setHoverUri = this.setHoverUri.bind(this);
    this.step = this.step.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
  }

  componentDidMount() {
    this.ws.onclose = () => window.location.reload()
    this.ws.onerror = () => window.location.reload()
    this.ws.onmessage = (event) => {
      let data = JSON.parse(event.data)
      console.log(data)
      if(data.type === 'forklift') {
        let m = this.state.forklifts
        let fl = Object.assign(m.get(data.id) || {}, data)
        m.set(data.id, fl)
        this.setState({
          forklifts: m
        })
      } else if(data.type === 'station') {
        let m = this.state.stations
        let type = m.get(data.stationType) || new Map()
        let s = Object.assign(type.get(data.id) || {}, data)
        type.set(data.id, s)
        m.set(data.productType, type)
        this.setState({
          stations: m
        })
      } else if(data.type === 'product') {
        let m = this.state.products
        let type = m.get(data.productType) || new Map()
        let s = Object.assign(type.get(data.id) || {}, data)
        type.set(data.id, s)
        m.set(data.productType, type)
        this.setState({
          products: m
        })
      } else if(data.type === 'order') {
        let m = this.state.orders
        let o = Object.assign(m.get(data.id) || {}, data)
        m.set(data.id, o)
        this.setState({
          orders: m
        })
      }
      this.forceUpdate()
    }
  }

  sendOrder(order) {
    this.ws.send(JSON.stringify(order))
  }

  setHoverUri(uri) {
    this.setState({
      hover: uri
    })
  }

  step() {
    this.ws.send(JSON.stringify({step: 1}))
  }

  render() {
    let forklifts = Array.from(this.state.forklifts).map(([_,fl]) => <Forklift
      key={fl.id}
      entity={fl.id}
      x={fl.x}
      y={fl.y}
      setHoverUri={this.setHoverUri}
    />)
    let stations = Array.from(this.state.stations).map(([_,sa]) => Array.from(sa).map(([_,s]) => s)).flat().map((s, idx) => <Station
      key={idx}
      entity={s.id}
      type={s.stationType}
      x={s.x}
      y={s.y}
      width={s.width}
      height={s.height}
      setHoverUri={this.setHoverUri}
    />)
    let products = Array.from(this.state.products).map(([_,pa]) => Array.from(pa).map(([_,p]) => p)).flat().map((p, idx) => <Product
      key={idx}
      entity={p.id}
      type={p.productType}
      x={p.x}
      y={p.y}
      width={p.width}
      height={p.height}
      setHoverUri={this.setHoverUri}
    />)
    let orders = Array.from(this.state.orders).map(([_,o]) => <Order
      key={o.id}
      entity={o.id}
      requirements={o}
      setHoverUri={this.setHoverUri}
    />)
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SmartphoneConfigurator partList={this.state.partList} sendOrder={this.sendOrder}/>
          <Stage width={1002} height={752} offsetX={-1} offsetY={-1} style={{margin: '50px'}}>
            <Grid width={20} height={15} />
            <Layer>
              {stations}
            </Layer>
            <Layer>
              {forklifts}
            </Layer>
            <Layer>
              {products}
            </Layer>
          </Stage>
          <div>
            <h2>Orders:</h2>
            {orders}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20pt"
          }}
        >
          {this.state.hover}
        </div>
      </>
    );
  }
}

export default App;
