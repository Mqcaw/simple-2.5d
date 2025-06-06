# simple-2.5d
## Features
- 2.5D Rendering: Simulates a 3D environment using 2D vectors.
- Input control: Allows for movement around the scene.
- Textures: Textrure management for rendering on wall surface.

## Getting Started

### Showcase
<img src="assets/showcase/screenshot_1.png" width="640" height="360">

### Installation
Clone the Repository



``` bash
git clone https://github.com/Mqcaw/simple-2.5d.git
cd simple-2.5d
```

### Usage
- ``` w/a/s/d``` to move
- mouse movement to control the camera view


### Project Structure

``` bash
simple-2.5d/
├── assets/             # assets like textures
├── css/                # styles
├── js/                 # core logic
│   ├── player.js       # creates player constuctor and view casting logic
│   ├── sketch.js       # handles p5 setup and rendering logic
│   └── ...             # other constuctors and logic
├── libraries/          # p5 library
├── index.html          # browser entry point
└── README.md           # project documentation
```


### Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any contributions.

### License
This project is licensed under the ```MIT license```. See the ```LICENSE``` file for details.

### Acknowledgments
[p5.js](https://p5js.org/) for providing the game development library.

Inspired by the classic 2.5D games ```Wolfenstein``` and ```DOOM``` developed by [id Software](https://www.idsoftware.com/en).