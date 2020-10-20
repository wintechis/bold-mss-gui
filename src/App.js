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

class App extends Component {
  constructor() {
    super()
    this.state = {
      hover: '',
      forklifts: new Map(),
      stations: new Map(),
      products: new Map()
    }
    this.setHoverUri = this.setHoverUri.bind(this);
  }

  componentDidMount() {
    var ws = new WebSocket('ws://localhost:8080/');
    ws.onclose = () => window.location.reload()
    ws.onerror = () => window.location.reload()
    ws.onmessage = (event) => {
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
      }
      this.forceUpdate()
    }
  }

  setHoverUri(uri) {
    this.setState({
      hover: uri
    })
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
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
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
