// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

function setup() {
  createCanvas(640, 480);
  background(0);
  Pose.init()
}

function draw() {

  background(0);
  Pose.draw();
}