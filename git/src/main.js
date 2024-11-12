import CaptchaScene from './Scenes/CaptchaScene.js';

// Game configuration
const config = {
    parent: 'gameContainer', // Make sure this matches the container ID in index.html
    type: Phaser.CANVAS,
    render: {
        pixelArt: true 
    },
    width: 1000,
    height: 800,
    backgroundColor: '#39FF14', // Neon green background color
    scene: [CaptchaScene]
};

const game = new Phaser.Game(config);

