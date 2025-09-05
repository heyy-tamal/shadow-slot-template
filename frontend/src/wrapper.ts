import { Container } from "pixi.js";

interface GameState {
    playerId: string;
    sessionId: string;
    balance: number;
    currency: string;
    stake: number;
}

interface SpinResult {
    reels: string[][];
    isWin: boolean;
    winAmount: number;
    matchedSymbols: string | null;
    triggeredFeatures: string[];
}

export class Wrapper extends Container {
    private gameState: GameState | null = null;
    private isSpinning: boolean = false;

    constructor() {
        super();
        this.initializeGame();
        this.attachSpinButtonHandler();
    }

    private async initializeGame() {
        try {
            const response = await fetch('http://localhost:3210/api/initResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerId: 'player123', // Default player for demo
                    gameName: 'slot-game',
                    stake: 2.00
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                this.gameState = {
                    playerId: result.data.playerId,
                    sessionId: result.data.sessionId,
                    balance: result.data.balance,
                    currency: result.data.currency,
                    stake: result.data.stake
                };

                this.updateUI();
                console.log('Game initialized:', this.gameState);
            } else {
                console.log('Failed to initialize game:', result.message);
            }
        } catch (error) {
            console.log('Error initializing game:', error);
        }
    }

    private attachSpinButtonHandler() {
        const spinBtn = document.querySelector('.spin-btn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                if (!this.isSpinning && this.gameState) {
                    this.spinReels();
                }
            });
        }
    }

    private async spinReels() {
        if (!this.gameState) {
            console.log('Game not initialized');
            return;
        }

        this.isSpinning = true;
        this.disableSpinButton();

        try {
            const response = await fetch('http://localhost:3210/api/spin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerId: this.gameState.playerId,
                    stake: this.gameState.stake
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                // Update game state
                this.gameState.balance = parseFloat(result.data.balance);

                // Update UI
                this.updateUI();

                // Handle spin result
                this.handleSpinResult(result.data.spinResult);

                console.log('Spin result:', result.data.spinResult);
            } else {
                console.log('Spin failed:', result.message);
                this.showError(result.message);
            }
        } catch (error) {
            console.log('Error during spin:', error);
            this.showError('Network error during spin');
        } finally {
            this.isSpinning = false;
            this.enableSpinButton();
        }
    }

    private handleSpinResult(spinResult: SpinResult) {
        // Display reels result
        this.displayReels(spinResult.reels);

        // Show win/loss message
        if (spinResult.isWin) {
            this.showWin(spinResult.winAmount, spinResult.matchedSymbols);
        } else {
            this.showLoss();
        }

        // Handle special features
        if (spinResult.triggeredFeatures.length > 0) {
            this.handleSpecialFeatures(spinResult.triggeredFeatures);
        }
    }

    private displayReels(reels: string[][]) {
        // For now, just log the reels
        // You can later implement visual reel display with PixiJS
        console.log('Reels result:', reels);

        // Example: Display reels in console in a readable format
        const reelDisplay = reels.map((reel, index) =>
            `Reel ${index + 1}: [${reel.join(' | ')}]`
        ).join('\n');

        console.log('Reels Display:\n' + reelDisplay);
    }

    private showWin(winAmount: number, symbol: string | null) {
        console.log(`🎉 WIN! You won ${this.gameState?.currency}${winAmount.toFixed(2)} with symbol: ${symbol}`);
        // You can add visual effects here later
    }

    private showLoss() {
        console.log('😔 No win this time. Try again!');
        // You can add visual effects here later
    }

    private handleSpecialFeatures(features: string[]) {
        features.forEach(feature => {
            console.log(`🎊 Special feature triggered: ${feature}`);
            // Handle different features
            if (feature === 'WILD_BONUS') {
                console.log('🌟 Wild Bonus activated!');
            }
        });
    }

    private showInsufficientPopup() {
        const popup = document.getElementById('insufficient-popup');
        if (popup) {
            popup.style.display = 'flex';
            const okBtn = document.getElementById('insufficient-ok-btn');
            if (okBtn) {
                okBtn.onclick = () => this.hideInsufficientPopup();
            }
        }
    }

    private hideInsufficientPopup() {
        const popup = document.getElementById('insufficient-popup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    private showError(message: string) {
        console.log('Error:', message);
        if (message && message.toLowerCase().includes('insufficient balance')) {
            this.showInsufficientPopup();
        } else {
            // You can add other error displays here
        }
    }

    private updateUI() {
        if (!this.gameState) return;

        // Update balance
        const balanceElement = document.querySelector('.balance .value');
        if (balanceElement) {
            balanceElement.textContent = `${this.gameState.currency}${this.gameState.balance.toFixed(2)}`;
        }

        // Update stake
        const stakeElement = document.querySelector('.bet .value');
        if (stakeElement) {
            stakeElement.textContent = `${this.gameState.currency}${this.gameState.stake.toFixed(2)}`;
        }

        // Reset total win to 0 (will be updated after spin)
        const totalWinElement = document.querySelector('.total-win .value');
        if (totalWinElement) {
            totalWinElement.textContent = `${this.gameState.currency}0.00`;
        }
    }

    private disableSpinButton() {
        const spinBtn = document.querySelector('.spin-btn') as HTMLElement;
        if (spinBtn) {
            spinBtn.style.opacity = '0.5';
            spinBtn.style.cursor = 'not-allowed';
        }
    }

    private enableSpinButton() {
        const spinBtn = document.querySelector('.spin-btn') as HTMLElement;
        if (spinBtn) {
            spinBtn.style.opacity = '1';
            spinBtn.style.cursor = 'pointer';
        }
    }
}