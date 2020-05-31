import React from 'react';
import Editor from 'react-simple-code-editor';

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileURL: props.fileURL,
      code: ""
    }
  }

  componentDidMount() {
    fetch(this.state.fileURL)
      .then(r => r.text())
      .then(code => this.setState({code}));
  }

  render() {
    return <div>
        <button>Run</button>
        <Editor
        value={this.state.code}
        onValueChange={(code) => this.setState({code})}
        highlight={(code) => sanitizeHTML(code)}
        />
      </div>
  }
}

export default Test;

function sanitizeHTML(text) {
  var element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
}
