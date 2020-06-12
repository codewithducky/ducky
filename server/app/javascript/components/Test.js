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
    let base = `
    <!DOCTYPE html>
    <html lang="">

        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>my COMP1720 sketch</title>
          <style> body {padding: 0; margin: 0;} </style>

        <!-- this is the main p5 library -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js"></script>

        <!-- this is the p5 sound library -->
        <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.js"></script> -->

        <!-- this is the p5 DOM library -->
        <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.js"></script> -->

             </head>
             <body>
              <!-- here's where we include the actual sketch file -->
              <script>
              `
    + this.state.code +
    `
              </script>

              </div>
             </body>
           </html>

    `;

    const regex = /createCanvas\((.*), (.*)\)/g;
    const matches = regex.exec(this.state.code);

    let width = "640";
    let height = "480";

    if (matches != null) {
      width = matches[1];
      height = matches[2];
    }

     return <div>
        <Editor
        value={this.state.code}
        onValueChange={(code) => this.setState({code})}
        highlight={(code) => sanitizeHTML(code)}
        />

        <iframe scrolling="no" srcDoc={base} width={width} height={height} style={{width, height}}>
        </iframe>
      </div>
  }
}

export default Test;

function sanitizeHTML(text) {
  var element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
}
