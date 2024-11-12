export default class CaptchaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CaptchaScene' });
    }

    preload() {
        // Load assets for CAPTCHA and distractions
        this.load.image('trafficlight1', 'assets/trafficlight1.jpg');
        this.load.image('trafficlight2', 'assets/trafficlight2.jpeg');
        this.load.image('trafficlight3', 'assets/trafficlight3.jpg');
        this.load.image('bicycle', 'assets/bicycle1.jpg');
        this.load.image('stopsign', 'assets/stopsign1.jpg');
        this.load.image('tree', 'assets/tree.jpg');
    }

    create() {
        this.score = 0;
        this.timeLeft = 30; // Set a 30-second timer for the game

        this.instructionText = this.add.text(20, 20, 'Select the traffic lights!', { fontSize: '28px', fill: '#ffffff' });
        this.scoreText = this.add.text(20, 50, 'Score: 0', { fontSize: '28px', fill: '#ffffff' });
        this.timerText = this.add.text(20, 80, `Time Left: ${this.timeLeft}`, { fontSize: '28px', fill: '#ffffff' });

        const imageWidth = 100;
        const imageHeight = 100;

        // Create CAPTCHA and distraction images with initial positions, set to hidden
        this.captchaImages = [
            this.add.image(0, 0, 'trafficlight1').setInteractive().setDisplaySize(imageWidth, imageHeight).setVisible(false),
            this.add.image(0, 0, 'trafficlight2').setInteractive().setDisplaySize(imageWidth, imageHeight).setVisible(false),
            this.add.image(0, 0, 'trafficlight3').setInteractive().setDisplaySize(imageWidth, imageHeight).setVisible(false)
        ];

        this.distractionImages = [
            this.add.image(0, 0, 'bicycle').setInteractive().setDisplaySize(imageWidth, imageHeight).setVisible(false),
            this.add.image(0, 0, 'stopsign').setInteractive().setDisplaySize(imageWidth, imageHeight).setVisible(false),
            this.add.image(0, 0, 'tree').setInteractive().setDisplaySize(imageWidth, imageHeight).setVisible(false)
        ];

        // Set up interaction for CAPTCHA (correct) images
        this.captchaImages.forEach((image) => {
            image.on('pointerdown', () => this.handleCaptchaClick(true));
        });

        // Set up interaction for distraction (incorrect) images
        this.distractionImages.forEach((image) => {
            image.on('pointerdown', () => this.handleCaptchaClick(false));
        });

        // Start a loop to show images at intervals
        this.time.addEvent({
            delay: 1000, // Interval between each image appearance
            callback: this.toggleImages,
            callbackScope: this,
            loop: true
        });

        // Start countdown timer for the game
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    randomPosition() {
        const imageWidth = 100;
        const imageHeight = 100;
        return {
            x: Phaser.Math.Between(imageWidth / 2, this.sys.game.config.width - imageWidth / 2),
            y: Phaser.Math.Between(imageHeight / 2, this.sys.game.config.height - imageHeight / 2)
        };
    }

    toggleImages() {
        // Hide all images first
        [...this.captchaImages, ...this.distractionImages].forEach(image => image.setVisible(false));

        // Show a random selection of CAPTCHA and distraction images
        const randomCaptcha = Phaser.Utils.Array.GetRandom(this.captchaImages);
        const randomDistraction = Phaser.Utils.Array.GetRandom(this.distractionImages);

        // Set random positions and make them visible
        const captchaPosition = this.randomPosition();
        randomCaptcha.setPosition(captchaPosition.x, captchaPosition.y).setVisible(true);

        const distractionPosition = this.randomPosition();
        randomDistraction.setPosition(distractionPosition.x, distractionPosition.y).setVisible(true);
    }

    handleCaptchaClick(isCaptcha) {
        if (isCaptcha) {
            this.score += 10;
            this.instructionText.setText('Good job! You clicked a traffic light.');
        } else {
            this.score -= 5;
            this.instructionText.setText('Oops! That’s not a traffic light.');
        }
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateTimer() {
        this.timeLeft -= 1;
        this.timerText.setText(`Time Left: ${this.timeLeft}`);
        
        // End game when timer reaches zero
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    endGame() {
        // Stop all image toggle and timer events
        this.time.removeAllEvents();
        [...this.captchaImages, ...this.distractionImages].forEach(image => image.disableInteractive());

        // Display "Game Over" message and final score
        this.add.text(400, 300, 'Game Over!', { fontSize: '40px', fill: '#ff0000' }).setOrigin(0.5);
        this.add.text(400, 350, `Final Score: ${this.score}`, { fontSize: '30px', fill: '#ffffff' }).setOrigin(0.5);
    }

    update() {
        // Additional animations or timed events can be added here
    }
}
