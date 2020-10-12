import React, { Component } from 'react';
import { Group, Stage, Layer, Rect, Line, Circle } from 'react-konva';

class Grid extends React.Component {
  render() {
    let lines = []
    for(let i = 0; i <= 1000; i += 50) {
      lines.push(<Line key={i + 1} points={[i,0,i,1000]} stroke="black" strokeWidth={0.5} />)
      lines.push(<Line key={-i - 1} points={[0,i,1000,i]} stroke="black" strokeWidth={0.5} />)
    }
    return (
      <Layer>
        {lines}
      </Layer>
    )
  }
}

class Forklift extends React.Component {
  render() {
    return (
      <Group>
        <Rect
          x={this.props.x * 50}
          y={this.props.y * 50}
          width={50}
          height={50}
          fill='#bbbbbb'
          stroke='black'
        />
        <Circle
          x={this.props.x * 50 + 25}
          y={this.props.y * 50 + 25}
          radius={18}
          fill='#e4e4e4'
          stroke='black'
        />
      </Group>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      forklifts: new Map()
    }
  }

  componentDidMount() {
    var ws = new WebSocket('ws://localhost:8080/');
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data)
      console.log(data)
      if(data.type === 'forklift') {
        let m = this.state.forklifts
        m.set(data.id, data)
        this.setState({
          forklifts: m
        })
      }
      this.forceUpdate()
    }
  }

  render() {
    let forklifts = Array.from(this.state.forklifts).map(([_,fl]) => <Forklift key={fl.id} entity={fl.id} x={fl.x} y={fl.y} />)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"}}
      >
        <Stage width={1002} height={1002} offsetX={-1} offsetY={-1} style={{margin: '50px'}}>
          <Grid />
          <Layer>
            {forklifts}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
