let video;
let button;
let pixelSize = 3; // Start at 3
let lastPixelChangeTime = 0; // Time when pixel size was last changed

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Set up video capture
  video = createCapture(VIDEO);
  video.size(width, height); // Make sure it covers the full canvas
  video.hide(); // Hide the raw video element

  // Create a button to capture the image
  button = createButton('Capture yourself');
  button.position(width / 2 - 50, height - 100);
  button.style('background-color', '0, 0, 0');
  button.style('color', 'black');
  button.style('font-size', '16px');
  button.style('width', '135px'); // Set button width
  button.style('height', '40px'); // Set button height
  
  button.style('cursor', 'pointer');
  button.mousePressed(takeSnapshot);
}

function draw() {
  background(0);

  // Load video pixels
  video.loadPixels();
  
  // Ensure pixelSize is at least 1 to avoid infinite loops
  let size = max(pixelSize, 1);

  // Create pixelation effect
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      let i = 4 * ((y * video.width) + x); // Get the index of the current pixel

      // Ensure you are accessing the video pixel data correctly
      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      // Check for color channel issues
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        // This might happen if the pixels are not fully loaded
        continue; // Skip the pixel if it's an invalid value
      }

      fill(r, g, b);
      noStroke();
      rect(x, y, size, size); // Draw pixel block
    }
  }

  // Check if 10 seconds (10,000 ms) have passed since the last pixel size change
  if (millis() - lastPixelChangeTime >= 3000) {
    pixelSize = max(1, pixelSize - 6); // Decrease pixelSize by 6, but not below 3
    lastPixelChangeTime = millis(); // Update the last change time
  }
}

// Function to increase pixel size and save the snapshot
function takeSnapshot() {
  saveCanvas('snapshot', 'jpg');
  pixelSize += 6; // Increase pixel size by 6 each time
  lastPixelChangeTime = millis(); // Record the current time when the snapshot is taken
}