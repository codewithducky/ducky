// Written by Harrison Shoebridge

function setup() {
  createCanvas(800, x);
}

function draw() {
  background("blue");

  for (let i = 0; i < 10; i++) {
    rect(i * 10, 0, 8, 8);
  }

  console.log('hello');
}