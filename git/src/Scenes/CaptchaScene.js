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
        this.load.image('ad', 'assets/ad.jpg'); 
        this.load.image('restartButton', 'assets/restartButton.jpeg');
    }

    create() {
        this.score = 0;
        this.timeLeft = 30; // Set a 30-second timer for the game
        this.gameOver = false; // Track if the game is over

        // Set up crisp visuals
        this.cameras.main.setRoundPixels(true); // Rounds pixels to avoid blur
        this.scaleMode = Phaser.Scale.NONE;

        // Instruction text without "Ignore the ad" by default
        this.instructionText = this.add.text(20, 20, 'Select the traffic lights!', { fontSize: '18px', fill: '#000000' }).setResolution(2);
        this.scoreText = this.add.text(20, 60, 'Score: 0', { fontSize: '18px', fill: '#000000' }).setResolution(2);
        this.timerText = this.add.text(20, 100, `Time Left: ${this.timeLeft}`, { fontSize: '14px', fill: '#000000' }).setResolution(2);

        // Set up a 3x3 grid with larger images
        this.setupGrid();

        // Create the ad/distraction image, positioned to cover the grid, initially hidden
        this.adImage = this.add.image(400, 400, 'ad').setDisplaySize(450, 450).setVisible(false).setInteractive();
        this.adImage.on('pointerdown', () => this.handleAdClick()); // Handle ad click

        // Start countdown timer for the game
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Set up a timer for the ad/distraction to appear at intervals
        this.time.addEvent({
            delay: 5000, // Every 5 seconds, show the ad
            callback: this.showAd,
            callbackScope: this,
            loop: true
        });

        // Set up a timer to swap all image positions periodically
        this.time.addEvent({
            delay: 4000, // Swap positions every 4 seconds
            callback: this.swapAllImagePositions,
            callbackScope: this,
            loop: true
        });
    }

    setupGrid() {
        const imageSize = 150; // Set uniform size for larger images

        // Define positions for a 3x3 grid layout, centered on the screen
        this.gridPositions = [
            { x: 200, y: 200 },
            { x: 400, y: 200 },
            { x: 600, y: 200 },
            { x: 200, y: 400 },
            { x: 400, y: 400 },
            { x: 600, y: 400 },
            { x: 200, y: 600 },
            { x: 400, y: 600 },
            { x: 600, y: 600 }
        ];

        const imageKeys = [
            'trafficlight1', 'trafficlight2', 'trafficlight3',
            'bicycle', 'stopsign', 'tree', 'bicycle', 'tree', 'stopsign'
        ];

        this.allImages = []; // Combine all CAPTCHA and distraction images into one array

        // Place all images in the grid
        this.gridPositions.forEach((position, index) => {
            const image = this.add.image(position.x, position.y, imageKeys[index])
                .setDisplaySize(imageSize, imageSize)
                .setInteractive();

            this.allImages.push(image);

            // Assign click handlers based on image type
            const isCaptcha = imageKeys[index].includes('trafficlight');
            image.on('pointerdown', () => this.handleCaptchaClick(isCaptcha));
        });
    }

    swapAllImagePositions() {
        // Only swap if the game is not over
        if (this.gameOver) return;

        // Shuffle all grid positions
        Phaser.Utils.Array.Shuffle(this.gridPositions);

        // Apply new positions to all images
        this.allImages.forEach((image, index) => {
            image.setPosition(this.gridPositions[index].x, this.gridPositions[index].y);
        });
    }

    handleCaptchaClick(isCaptcha) {
        if (this.gameOver) return;

        if (isCaptcha) {
            this.score += 10;
            this.instructionText.setText('Good job! You clicked a traffic light.');
        } else {
            this.score -= 5;
            this.instructionText.setText('Oops! That’s not a traffic light.');
        }
        this.scoreText.setText(`Score: ${this.score}`);
    }

    handleAdClick() {
        // Decrease score if the ad is clicked
        this.score -= 5;
        this.instructionText.setText("Don't click the ad! -5 points.");
        this.scoreText.setText(`Score: ${this.score}`);
    }

    showAd() {
        // Do not show ad if the game is over
        if (this.gameOver) return;

        // Show the ad and update the instruction text to include "Ignore the ad."
        this.adImage.setVisible(true);
        this.instructionText.setText("Select the traffic lights! Ignore the ad.");

        // Set a timer to hide the ad and revert the instruction after 2 seconds
        this.time.delayedCall(2000, () => {
            this.adImage.setVisible(false);
            this.instructionText.setText("Select the traffic lights!");
        });
    }

    updateTimer() {
        if (this.gameOver) return;

        this.timeLeft -= 1;
        this.timerText.setText(`Time Left: ${this.timeLeft}`);
        
        // End game when timer reaches zero
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.gameOver = true; // Mark game as over
        this.time.removeAllEvents();
        this.allImages.forEach(image => image.disableInteractive());
        this.adImage.disableInteractive();

        // Display "Game Over" message and final score
        this.add.text(400, 300, 'Game Over!', { fontSize: '50px', fill: '#000000' }).setOrigin(0.5);
        this.add.text(400, 350, `Final Score: ${this.score}`, { fontSize: '40px', fill: '#000000' }).setOrigin(0.5);

        // Create a restart button
        const restartButton = this.add.image(400, 450, 'restartButton').setInteractive().setDisplaySize(200, 80);

        restartButton.on('pointerdown', () => {
            this.scene.restart(); // Restart the scene
        });
    }

    update() {
        // Additional animations or timed events can be added here
    }
}
