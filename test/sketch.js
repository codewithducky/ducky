// Written by Harrison Shoebridge

function setup() {
  createCanvas(800, 700);
}

function draw() {
  background("red");

  for (let i = 0; i < 10; i++) {
    rect(i * 10, 0, 8, 8);
  }
}