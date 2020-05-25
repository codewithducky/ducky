import React from 'react';
import Editor from 'react-simple-code-editor';

class Test extends React.Component {
  state = {code: "function (hello) { console.log('hello'); }"}

  render() {
    return <div>
        <button>Run</button>
        <Editor
        value={this.state.code}
        onValueChange={(code) => this.setState({code})}
        highlight={(code) => code}
        />
      </div>
  }
}

export default Test;
