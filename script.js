// Tower Climbing Game System
class TowerGame {
    constructor() {
        // Tower Progress
        this.currentFloor = 1;
        this.maxFloor = 1;
        this.totalWins = 0;
        this.floorData = this.generateFloorData();
        
        // Current Game State
        this.gameType = 'ttt'; // 'ttt' or 'c4'
        this.gameActive = false;
        this.currentPlayer = 'X';
        this.board = [];
        
        // Timer System (for floors 26+)
        this.timerActive = false;
        this.timeLeft = 5;
        this.timerInterval = null;
        
        // Tic Tac Toe
        this.tttBoard = Array(9).fill('');
        this.tttWinningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        // Connect 4
        this.c4Board = Array(42).fill(''); // 7x6 grid
        this.c4Columns = 7;
        this.c4Rows = 6;
        
        this.init();
    }

    generateFloorData() {
        const floors = [];
        
        // Floors 1-20: Tic Tac Toe
        for (let i = 1; i <= 20; i++) {
            const difficulty = this.calculateDifficulty(i, 20);
            floors.push({
                number: i,
                type: 'ttt',
                difficulty: difficulty,
                isBoss: i % 5 === 0,
                name: i % 5 === 0 ? `Boss Floor ${i}` : `Floor ${i}`,
                description: this.getDifficultyDescription(difficulty)
            });
        }
        
        // Floors 21-30: Connect 4
        for (let i = 21; i <= 30; i++) {
            const difficulty = this.calculateDifficulty(i - 20, 10);
            floors.push({
                number: i,
                type: 'c4',
                difficulty: difficulty,
                isBoss: i % 5 === 0,
                name: i % 5 === 0 ? `Boss Floor ${i}` : `Floor ${i}`,
                description: this.getDifficultyDescription(difficulty)
            });
        }
        
        return floors;
    }
    
    calculateDifficulty(floor, maxFloors) {
        const progress = floor / maxFloors;
        if (progress <= 0.25) return 1; // Easy
        if (progress <= 0.5) return 2;  // Medium
        if (progress <= 0.75) return 3; // Hard
        return 4; // Extreme
    }
    
    getDifficultyDescription(difficulty) {
        switch(difficulty) {
            case 1: return 'Easy';
            case 2: return 'Medium';
            case 3: return 'Hard';
            case 4: return 'Extreme';
            default: return 'Unknown';
        }
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.showScreen('welcome-screen');
        this.updateTowerMenu();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Tic Tac Toe cells
        document.querySelectorAll('#ttt-board .cell').forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleTTTCellClick(index));
        });
        
        // Connect 4 columns
        document.querySelectorAll('.c4-column').forEach((column, index) => {
            column.addEventListener('click', () => this.handleC4ColumnClick(index));
        });

        // Control buttons
        document.getElementById('enter-tower-btn').addEventListener('click', () => this.showMenu());
        document.getElementById('back-btn').addEventListener('click', () => this.showMenu());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('next-floor-btn').addEventListener('click', () => this.nextFloor());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('menu-btn').addEventListener('click', () => this.showMenu());
        document.getElementById('reset-progress-btn').addEventListener('click', () => this.resetProgress());
    }

    updateTowerMenu() {
        const windFloors = document.getElementById('wind-floors');
        const waterFloors = document.getElementById('water-floors');
        const earthFloors = document.getElementById('earth-floors');
        const fireFloors = document.getElementById('fire-floors');
        const lightningFloors = document.getElementById('lightning-floors');
        const toxinFloors = document.getElementById('toxin-floors');
        
        // Clear existing floors
        [windFloors, waterFloors, earthFloors, fireFloors, lightningFloors, toxinFloors].forEach(container => {
            if (container) container.innerHTML = '';
        });
        
        this.floorData.forEach(floor => {
            const floorBtn = document.createElement('button');
            floorBtn.className = 'floor-btn';
            floorBtn.innerHTML = `
                <div class="floor-number">${floor.number}</div>
                <div class="floor-difficulty">${floor.description}</div>
            `;
            
            // Add state classes
            if (floor.number > this.maxFloor) {
                floorBtn.classList.add('locked');
            } else if (floor.number < this.currentFloor) {
                floorBtn.classList.add('completed');
            } else if (floor.number === this.currentFloor) {
                floorBtn.classList.add('current');
            }
            
            if (floor.isBoss) {
                floorBtn.classList.add('boss');
            }
            
            // Add click handler for unlocked floors
            if (floor.number <= this.maxFloor) {
                floorBtn.addEventListener('click', () => {
                    this.currentFloor = floor.number;
                    this.startFloor(floor.number);
                });
            }
            
            // Add to appropriate themed container
            if (floor.number >= 1 && floor.number <= 5) {
                windFloors.appendChild(floorBtn);
            } else if (floor.number >= 6 && floor.number <= 10) {
                waterFloors.appendChild(floorBtn);
            } else if (floor.number >= 11 && floor.number <= 15) {
                earthFloors.appendChild(floorBtn);
            } else if (floor.number >= 16 && floor.number <= 20) {
                fireFloors.appendChild(floorBtn);
            } else if (floor.number >= 21 && floor.number <= 25) {
                lightningFloors.appendChild(floorBtn);
            } else if (floor.number >= 26 && floor.number <= 30) {
                toxinFloors.appendChild(floorBtn);
            }
        });
        
        this.updateProgressDisplay();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showMenu() {
        this.showScreen('menu-screen');
        this.gameActive = false;
        this.hideModal();
        this.updateTowerMenu();
        this.updateProgressDisplay();
    }

    startFloor(floorNumber) {
        const floor = this.floorData[floorNumber - 1];
        this.currentFloor = floorNumber;
        this.gameType = floor.type;
        this.gameActive = true;
        this.currentPlayer = this.gameType === 'ttt' ? 'X' : 'red';
        
        // Initialize boards
        if (this.gameType === 'ttt') {
            this.tttBoard = Array(9).fill('');
            this.board = this.tttBoard;
        } else {
            this.c4Board = Array(42).fill('');
            this.board = this.c4Board;
        }
        
        this.showScreen('game-screen');
        this.applyTheme();
        this.updateGameUI();
        this.hideModal();
        this.saveProgress();
        
        // Start timer for player's first turn on floors 26+
        if (this.currentFloor > 25 && this.currentPlayer === (this.gameType === 'ttt' ? 'X' : 'red')) {
            this.startTimer();
        }
    }
    
    restartGame() {
        this.startFloor(this.currentFloor);
    }
    
    nextFloor() {
        if (this.currentFloor < 30) {
            this.currentFloor++;
            this.maxFloor = Math.max(this.maxFloor, this.currentFloor);
            this.startFloor(this.currentFloor);
        } else {
            this.showVictoryScreen();
        }
    }

    // Tic Tac Toe Handlers
    handleTTTCellClick(index) {
        if (!this.gameActive || this.gameType !== 'ttt' || this.tttBoard[index] !== '' || this.currentPlayer !== 'X') {
            return;
        }

        this.stopTimer();
        this.makeTTTMove(index, 'X');
        
        if (this.gameActive && this.currentPlayer === 'O') {
            this.updateTurnIndicator('AI thinking...');
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
    }
    
    // Connect 4 Handlers
    handleC4ColumnClick(columnIndex) {
        if (!this.gameActive || this.gameType !== 'c4' || this.currentPlayer !== 'red') {
            return;
        }

        const row = this.getLowestEmptyRow(columnIndex);
        if (row === -1) return; // Column is full
        
        this.stopTimer();
        this.makeC4Move(row, columnIndex, 'red');
        
        if (this.gameActive && this.currentPlayer === 'yellow') {
            this.updateTurnIndicator('AI thinking...');
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
    }
    
    getLowestEmptyRow(col) {
        for (let row = this.c4Rows - 1; row >= 0; row--) {
            const index = row * this.c4Columns + col;
            if (this.c4Board[index] === '') {
                return row;
            }
        }
        return -1; // Column is full
    }

    makeTTTMove(index, player) {
        this.tttBoard[index] = player;
        this.updateTTTBoard();
        
        // Check for wind effect on floors 1-5 after player move
        if (this.currentFloor >= 1 && this.currentFloor <= 5 && player === 'X') {
            setTimeout(() => {
                this.checkWindBlowEffect();
            }, 800);
        }
        
        // Check for water effect on floors 6-10 after player move
        if (this.currentFloor >= 6 && this.currentFloor <= 10 && player === 'X') {
            setTimeout(() => {
                this.checkWaterEffect();
            }, 800);
        }
        
        // Check for earth effect on floors 11-15 after player move
        if (this.currentFloor >= 11 && this.currentFloor <= 15 && player === 'X') {
            setTimeout(() => {
                this.checkEarthEffect();
            }, 800);
        }
        
        // Check for fire effect on floors 16-20 after player move
        if (this.currentFloor >= 16 && this.currentFloor <= 20 && player === 'X') {
            setTimeout(() => {
                this.checkFireEffect();
            }, 800);
        }
        
        // Check for lightning effect on floors 21-25 after player move
        if (this.currentFloor >= 21 && this.currentFloor <= 25 && player === 'X') {
            setTimeout(() => {
                this.checkLightningEffect();
            }, 800);
        }
        
        // Check for toxin effect on floors 26-30 after player move
        if (this.currentFloor >= 26 && this.currentFloor <= 30 && player === 'X') {
            setTimeout(() => {
                this.checkToxinEffect();
            }, 800);
        }
        
        const winner = this.checkTTTWinner();
        if (winner) {
            this.endGame(winner);
            return;
        }

        if (this.isTTTBoardFull()) {
            this.endGame('tie');
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateGameUI();
        
        // Start timer for player's turn on floors 26+
        if (this.currentFloor > 25 && this.currentPlayer === 'X') {
            this.startTimer();
        }
    }
    
    makeC4Move(row, col, player) {
        const index = row * this.c4Columns + col;
        this.c4Board[index] = player;
        this.updateC4Board();
        
        const winner = this.checkC4Winner();
        if (winner) {
            this.endGame(winner);
            return;
        }

        if (this.isC4BoardFull()) {
            this.endGame('tie');
            return;
        }

        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateGameUI();
        
        // Start timer for player's turn on floors 26+
        if (this.currentFloor > 25 && this.currentPlayer === 'red') {
            this.startTimer();
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;

        const floor = this.floorData[this.currentFloor - 1];
        const difficulty = floor.difficulty;
        const isBoss = floor.isBoss;
        
        let move;
        if (this.gameType === 'ttt') {
            move = this.getTTTAIMove(difficulty, isBoss);
            if (move !== -1) {
                this.makeTTTMove(move, 'O');
            }
        } else {
            move = this.getC4AIMove(difficulty, isBoss);
            if (move !== -1) {
                const row = this.getLowestEmptyRow(move);
                if (row !== -1) {
                    this.makeC4Move(row, move, 'yellow');
                }
            }
        }
    }
    
    getTTTAIMove(difficulty, isBoss) {
        // Boss levels have enhanced AI
        const effectiveDifficulty = isBoss ? Math.min(difficulty + 1, 4) : difficulty;
        
        switch (effectiveDifficulty) {
            case 1: return this.getTTTRandomMove();
            case 2: return this.getTTTMediumMove();
            case 3: return this.getTTTHardMove();
            case 4: return this.getTTTExtremeMove();
            default: return this.getTTTRandomMove();
        }
    }
    
    getC4AIMove(difficulty, isBoss) {
        // Boss levels have enhanced AI
        const effectiveDifficulty = isBoss ? Math.min(difficulty + 1, 4) : difficulty;
        
        switch (effectiveDifficulty) {
            case 1: return this.getC4RandomMove();
            case 2: return this.getC4MediumMove();
            case 3: return this.getC4HardMove();
            case 4: return this.getC4ExtremeMove();
            default: return this.getC4RandomMove();
        }
    }

    // TTT AI Algorithms
    getTTTRandomMove() {
        const availableMoves = this.getTTTAvailableMoves();
        if (availableMoves.length === 0) return -1;
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    getTTTAvailableMoves() {
        return this.tttBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    }

    getTTTMediumMove() {
        // First, try to win
        for (let move of this.getTTTAvailableMoves()) {
            const tempBoard = [...this.tttBoard];
            tempBoard[move] = 'O';
            if (this.checkTTTWinnerForBoard(tempBoard) === 'O') {
                return move;
            }
        }

        // Second, try to block player from winning
        for (let move of this.getTTTAvailableMoves()) {
            const tempBoard = [...this.tttBoard];
            tempBoard[move] = 'X';
            if (this.checkTTTWinnerForBoard(tempBoard) === 'X') {
                return move;
            }
        }

        // Otherwise, make random move
        return this.getTTTRandomMove();
    }
    
    getTTTHardMove() {
        return this.getTTTMinimaxMove();
    }
    
    getTTTExtremeMove() {
        // Even more aggressive - always perfect play
        return this.getTTTMinimaxMove();
    }

    getTTTMinimaxMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let move of this.getTTTAvailableMoves()) {
            const tempBoard = [...this.tttBoard];
            tempBoard[move] = 'O';
            const score = this.tttMinimax(tempBoard, 0, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    tttMinimax(board, depth, isMaximizing) {
        const winner = this.checkTTTWinnerForBoard(board);
        
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (this.isTTTBoardFullForBoard(board)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = this.tttMinimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = this.tttMinimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    // Connect 4 AI Algorithms
    getC4RandomMove() {
        const availableColumns = [];
        for (let col = 0; col < this.c4Columns; col++) {
            if (this.getLowestEmptyRow(col) !== -1) {
                availableColumns.push(col);
            }
        }
        if (availableColumns.length === 0) return -1;
        return availableColumns[Math.floor(Math.random() * availableColumns.length)];
    }
    
    getC4MediumMove() {
        // First, try to win
        for (let col = 0; col < this.c4Columns; col++) {
            const row = this.getLowestEmptyRow(col);
            if (row !== -1) {
                const tempBoard = [...this.c4Board];
                const index = row * this.c4Columns + col;
                tempBoard[index] = 'yellow';
                if (this.checkC4WinnerForBoard(tempBoard) === 'yellow') {
                    return col;
                }
            }
        }
        
        // Second, try to block player
        for (let col = 0; col < this.c4Columns; col++) {
            const row = this.getLowestEmptyRow(col);
            if (row !== -1) {
                const tempBoard = [...this.c4Board];
                const index = row * this.c4Columns + col;
                tempBoard[index] = 'red';
                if (this.checkC4WinnerForBoard(tempBoard) === 'red') {
                    return col;
                }
            }
        }
        
        // Otherwise random
        return this.getC4RandomMove();
    }
    
    getC4HardMove() {
        // More strategic - prefer center columns
        const centerCols = [3, 2, 4, 1, 5, 0, 6];
        
        // First, try to win
        for (let col of centerCols) {
            const row = this.getLowestEmptyRow(col);
            if (row !== -1) {
                const tempBoard = [...this.c4Board];
                const index = row * this.c4Columns + col;
                tempBoard[index] = 'yellow';
                if (this.checkC4WinnerForBoard(tempBoard) === 'yellow') {
                    return col;
                }
            }
        }
        
        // Second, block player
        for (let col of centerCols) {
            const row = this.getLowestEmptyRow(col);
            if (row !== -1) {
                const tempBoard = [...this.c4Board];
                const index = row * this.c4Columns + col;
                tempBoard[index] = 'red';
                if (this.checkC4WinnerForBoard(tempBoard) === 'red') {
                    return col;
                }
            }
        }
        
        // Prefer center columns
        for (let col of centerCols) {
            if (this.getLowestEmptyRow(col) !== -1) {
                return col;
            }
        }
        
        return this.getC4RandomMove();
    }
    
    getC4ExtremeMove() {
        // Even more strategic for boss levels
        return this.getC4HardMove();
    }

    // Win Detection Functions
    checkTTTWinner() {
        return this.checkTTTWinnerForBoard(this.tttBoard);
    }

    checkTTTWinnerForBoard(board) {
        for (let combination of this.tttWinningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }
    
    checkC4Winner() {
        return this.checkC4WinnerForBoard(this.c4Board);
    }
    
    checkC4WinnerForBoard(board) {
        // Check horizontal, vertical, and diagonal wins
        for (let row = 0; row < this.c4Rows; row++) {
            for (let col = 0; col < this.c4Columns; col++) {
                const index = row * this.c4Columns + col;
                const player = board[index];
                if (!player) continue;
                
                // Check horizontal (right)
                if (col <= this.c4Columns - 4) {
                    if (board[index] === board[index + 1] && 
                        board[index] === board[index + 2] && 
                        board[index] === board[index + 3]) {
                        return player;
                    }
                }
                
                // Check vertical (down)
                if (row <= this.c4Rows - 4) {
                    if (board[index] === board[index + this.c4Columns] && 
                        board[index] === board[index + this.c4Columns * 2] && 
                        board[index] === board[index + this.c4Columns * 3]) {
                        return player;
                    }
                }
                
                // Check diagonal (down-right)
                if (row <= this.c4Rows - 4 && col <= this.c4Columns - 4) {
                    if (board[index] === board[index + this.c4Columns + 1] && 
                        board[index] === board[index + (this.c4Columns + 1) * 2] && 
                        board[index] === board[index + (this.c4Columns + 1) * 3]) {
                        return player;
                    }
                }
                
                // Check diagonal (down-left)
                if (row <= this.c4Rows - 4 && col >= 3) {
                    if (board[index] === board[index + this.c4Columns - 1] && 
                        board[index] === board[index + (this.c4Columns - 1) * 2] && 
                        board[index] === board[index + (this.c4Columns - 1) * 3]) {
                        return player;
                    }
                }
            }
        }
        return null;
    }

    isTTTBoardFull() {
        return this.isTTTBoardFullForBoard(this.tttBoard);
    }

    isTTTBoardFullForBoard(board) {
        return board.every(cell => cell !== '');
    }
    
    isC4BoardFull() {
        return this.isC4BoardFullForBoard(this.c4Board);
    }

    isC4BoardFullForBoard(board) {
        // Check if top row is full
        for (let col = 0; col < this.c4Columns; col++) {
            if (board[col] === '') return false;
        }
        return true;
    }

    endGame(result) {
        this.gameActive = false;
        
        if (result !== 'tie') {
            this.highlightWinningCells();
            if ((this.gameType === 'ttt' && result === 'X') || 
                (this.gameType === 'c4' && result === 'red')) {
                this.totalWins++;
            }
        }

        setTimeout(() => {
            this.showGameOverModal(result);
        }, 1000);
    }

    highlightWinningCells() {
        if (this.gameType === 'ttt') {
            this.highlightTTTWinningCells();
        } else {
            this.highlightC4WinningCells();
        }
    }
    
    highlightTTTWinningCells() {
        for (let combination of this.tttWinningCombinations) {
            const [a, b, c] = combination;
            if (this.tttBoard[a] && this.tttBoard[a] === this.tttBoard[b] && this.tttBoard[a] === this.tttBoard[c]) {
                combination.forEach(index => {
                    document.querySelector(`#ttt-board [data-index="${index}"]`).classList.add('winner');
                });
                break;
            }
        }
    }
    
    highlightC4WinningCells() {
        // Find winning combination and highlight
        for (let row = 0; row < this.c4Rows; row++) {
            for (let col = 0; col < this.c4Columns; col++) {
                const index = row * this.c4Columns + col;
                const player = this.c4Board[index];
                if (!player) continue;
                
                const winningCells = [];
                
                // Check all directions for a win
                // Horizontal
                if (col <= this.c4Columns - 4) {
                    let isWin = true;
                    const cells = [];
                    for (let i = 0; i < 4; i++) {
                        const cellIndex = index + i;
                        if (this.c4Board[cellIndex] !== player) {
                            isWin = false;
                            break;
                        }
                        cells.push(cellIndex);
                    }
                    if (isWin) winningCells.push(...cells);
                }
                
                // Vertical
                if (row <= this.c4Rows - 4) {
                    let isWin = true;
                    const cells = [];
                    for (let i = 0; i < 4; i++) {
                        const cellIndex = index + (this.c4Columns * i);
                        if (this.c4Board[cellIndex] !== player) {
                            isWin = false;
                            break;
                        }
                        cells.push(cellIndex);
                    }
                    if (isWin) winningCells.push(...cells);
                }
                
                // Diagonal down-right
                if (row <= this.c4Rows - 4 && col <= this.c4Columns - 4) {
                    let isWin = true;
                    const cells = [];
                    for (let i = 0; i < 4; i++) {
                        const cellIndex = index + ((this.c4Columns + 1) * i);
                        if (this.c4Board[cellIndex] !== player) {
                            isWin = false;
                            break;
                        }
                        cells.push(cellIndex);
                    }
                    if (isWin) winningCells.push(...cells);
                }
                
                // Diagonal down-left
                if (row <= this.c4Rows - 4 && col >= 3) {
                    let isWin = true;
                    const cells = [];
                    for (let i = 0; i < 4; i++) {
                        const cellIndex = index + ((this.c4Columns - 1) * i);
                        if (this.c4Board[cellIndex] !== player) {
                            isWin = false;
                            break;
                        }
                        cells.push(cellIndex);
                    }
                    if (isWin) winningCells.push(...cells);
                }
                
                if (winningCells.length > 0) {
                    winningCells.forEach(cellIndex => {
                        const row = Math.floor(cellIndex / this.c4Columns);
                        const col = cellIndex % this.c4Columns;
                        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('winner');
                    });
                    return;
                }
            }
        }
    }

    showGameOverModal(result) {
        const floor = this.floorData[this.currentFloor - 1];
        
        let isPlayerWin = false;
        if (this.gameType === 'ttt') {
            isPlayerWin = result === 'X';
        } else {
            isPlayerWin = result === 'red';
        }

        if (isPlayerWin) {
            // Show victory flash effect
            this.showVictoryFlash();
            
            // Auto-advance to next floor if not at the end
            if (this.currentFloor < 30) {
                this.maxFloor = Math.max(this.maxFloor, this.currentFloor + 1);
                
                // Brief pause to show victory, then auto-advance
                setTimeout(() => {
                    this.nextFloor();
                }, 1500);
            } else {
                // Show final victory screen for completing all floors
                setTimeout(() => {
                    this.showVictoryScreen();
                }, 1500);
            }
        } else {
            // For losses and ties, show modal
            const modal = document.getElementById('game-over-modal');
            const resultText = document.getElementById('game-result');
            const messageText = document.getElementById('game-message');
            
            if (result === 'tie') {
                resultText.textContent = '🤝 Draw!';
                messageText.textContent = 'Close match! Try again?';
            } else {
                if (floor.isBoss) {
                    resultText.textContent = '💀 Boss Victory';
                    messageText.textContent = `The ${floor.name} boss defeated you!`;
                } else {
                    resultText.textContent = '😞 Floor Failed';
                    messageText.textContent = `Floor ${this.currentFloor} got you this time!`;
                }
            }
            
            modal.classList.add('show');
        }
        
        this.saveProgress();
    }

    hideModal() {
        document.getElementById('game-over-modal').classList.remove('show');
        document.getElementById('next-floor-btn').style.display = 'none';
    }

    updateTTTBoard() {
        document.querySelectorAll('#ttt-board .cell').forEach((cell, index) => {
            const value = this.tttBoard[index];
            cell.className = 'cell';
            
            if (value) {
                cell.classList.add(value.toLowerCase());
                
                // Use themed icons for wind floors (1-5)
                if (this.currentFloor >= 1 && this.currentFloor <= 5) {
                    if (value === 'X') {
                        cell.textContent = '☁️'; // Cloud for player
                    } else if (value === 'O') {
                        cell.textContent = '🌪️'; // Tornado for AI
                    }
                }
                // Use themed icons for water floors (6-10)
                else if (this.currentFloor >= 6 && this.currentFloor <= 10) {
                    if (value === 'X') {
                        cell.textContent = '🐠'; // Fish for player
                    } else if (value === 'O') {
                        cell.textContent = '🌊'; // Wave for AI
                    }
                }
                // Use themed icons for earth floors (11-15)
                else if (this.currentFloor >= 11 && this.currentFloor <= 15) {
                    if (value === 'X') {
                        cell.textContent = '🪨'; // Rock for player
                    } else if (value === 'O') {
                        cell.textContent = '⛰️'; // Mountain for AI
                    }
                }
                // Use themed icons for fire floors (16-20)
                else if (this.currentFloor >= 16 && this.currentFloor <= 20) {
                    if (value === 'X') {
                        cell.textContent = '🔥'; // Fire for player
                    } else if (value === 'O') {
                        cell.textContent = '🌋'; // Volcano for AI
                    }
                }
                // Use themed icons for lightning floors (21-25)
                else if (this.currentFloor >= 21 && this.currentFloor <= 25) {
                    if (value === 'X') {
                        cell.textContent = '⚡'; // Lightning for player
                    } else if (value === 'O') {
                        cell.textContent = '🌩️'; // Storm for AI
                    }
                }
                // Use themed icons for toxin floors (26-30)
                else if (this.currentFloor >= 26 && this.currentFloor <= 30) {
                    if (value === 'X') {
                        cell.textContent = '☠️'; // Skull for player
                    } else if (value === 'O') {
                        cell.textContent = '☣️'; // Biohazard for AI
                    }
                } else {
                    // Use regular X and O for other floors
                    cell.textContent = value;
                }
            } else {
                cell.textContent = '';
            }
        });
    }
    
    updateC4Board() {
        document.querySelectorAll('.c4-cell').forEach((cell) => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const index = row * this.c4Columns + col;
            const value = this.c4Board[index];
            
            cell.className = 'c4-cell';
            if (value === 'red') {
                cell.classList.add('red');
                cell.textContent = '🔴';
            } else if (value === 'yellow') {
                cell.classList.add('yellow');
                cell.textContent = '🟡';
            } else {
                cell.textContent = '';
            }
        });
    }

    updateGameUI() {
        const floor = this.floorData[this.currentFloor - 1];
        const floorNumber = document.getElementById('floor-number');
        const floorType = document.getElementById('floor-type');
        const bossIndicator = document.getElementById('boss-indicator');
        const turnIndicator = document.getElementById('turn-indicator');
        
        floorNumber.textContent = `Floor ${this.currentFloor}`;
        floorType.textContent = this.gameType === 'ttt' ? 'Tic Tac Toe' : 'Connect 4';
        
        if (floor.isBoss) {
            bossIndicator.style.display = 'block';
        } else {
            bossIndicator.style.display = 'none';
        }
        
        // Show appropriate board
        const tttBoard = document.getElementById('ttt-board');
        const c4Board = document.getElementById('c4-board');
        
        if (this.gameType === 'ttt') {
            tttBoard.style.display = 'grid';
            c4Board.style.display = 'none';
            this.updateTTTBoard();
            
            if (this.gameActive) {
                if (this.currentPlayer === 'X') {
                    turnIndicator.textContent = 'Your turn (X)';
                } else {
                    turnIndicator.textContent = 'AI\'s turn (O)';
                }
            }
        } else {
            tttBoard.style.display = 'none';
            c4Board.style.display = 'flex';
            this.updateC4Board();
            
            if (this.gameActive) {
                if (this.currentPlayer === 'red') {
                    turnIndicator.textContent = 'Your turn 🔴';
                } else {
                    turnIndicator.textContent = 'AI\'s turn 🟡';
                }
            }
        }
        
        // Show/hide timer based on floor level
        const timerContainer = document.getElementById('timer-container');
        if (this.currentFloor > 25) {
            timerContainer.style.display = 'block';
        } else {
            timerContainer.style.display = 'none';
        }
    }

    updateTurnIndicator(text) {
        document.getElementById('turn-indicator').textContent = text;
    }

    updateProgressDisplay() {
        document.getElementById('current-floor').textContent = this.currentFloor;
        document.getElementById('total-wins').textContent = this.totalWins;
    }
    
    // Progress Management
    saveProgress() {
        const progress = {
            currentFloor: this.currentFloor,
            maxFloor: this.maxFloor,
            totalWins: this.totalWins
        };
        localStorage.setItem('towerGameProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('towerGameProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.currentFloor = progress.currentFloor || 1;
                this.maxFloor = progress.maxFloor || 1;
                this.totalWins = progress.totalWins || 0;
            }
        } catch (e) {
            console.log('No saved progress found');
        }
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            this.currentFloor = 1;
            this.maxFloor = 1;
            this.totalWins = 0;
            localStorage.removeItem('towerGameProgress');
            this.updateTowerMenu();
            this.updateProgressDisplay();
        }
    }
    
    showVictoryScreen() {
        const modal = document.getElementById('game-over-modal');
        const resultText = document.getElementById('game-result');
        const messageText = document.getElementById('game-message');
        
        resultText.textContent = '🏆 TOWER CONQUERED!';
        messageText.textContent = `Congratulations! You've beaten all 30 floors with ${this.totalWins} total victories!`;
        
        modal.classList.add('show');
        
        // Reset to allow replay
        this.currentFloor = 1;
        this.saveProgress();
    }
    
    // Timer System for floors 26+
    startTimer() {
        if (this.currentFloor <= 25) return;
        
        this.stopTimer(); // Clear any existing timer
        this.timeLeft = 5;
        this.timerActive = true;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timerExpired();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerActive = false;
    }
    
    timerExpired() {
        this.stopTimer();
        
        // Player loses turn - AI wins the game
        if (this.gameType === 'ttt') {
            this.endGame('O'); // AI wins
        } else {
            this.endGame('yellow'); // AI wins
        }
    }
    
    updateTimerDisplay() {
        const timerText = document.getElementById('timer-text');
        const timerProgress = document.getElementById('timer-progress');
        
        timerText.textContent = this.timeLeft;
        
        // Update progress bar
        const progressPercent = (this.timeLeft / 5) * 100;
        timerProgress.style.width = `${progressPercent}%`;
        
        // Update colors based on time remaining
        timerText.className = '';
        timerProgress.className = 'timer-progress';
        
        if (this.timeLeft <= 1) {
            timerText.classList.add('danger');
            timerProgress.classList.add('danger');
        } else if (this.timeLeft <= 2) {
            timerText.classList.add('warning');
            timerProgress.classList.add('warning');
        }
    }
    
    // Theme System
    applyTheme() {
        const container = document.querySelector('.container');
        
        // Remove all existing theme classes
        container.classList.remove('theme-wind', 'theme-water', 'theme-earth', 'theme-fire', 'theme-lightning', 'theme-toxin');
        
        // Determine theme based on floor
        let theme = '';
        if (this.currentFloor >= 1 && this.currentFloor <= 5) {
            theme = 'theme-wind';
        } else if (this.currentFloor >= 6 && this.currentFloor <= 10) {
            theme = 'theme-water';
        } else if (this.currentFloor >= 11 && this.currentFloor <= 15) {
            theme = 'theme-earth';
        } else if (this.currentFloor >= 16 && this.currentFloor <= 20) {
            theme = 'theme-fire';
        } else if (this.currentFloor >= 21 && this.currentFloor <= 25) {
            theme = 'theme-lightning';
        } else if (this.currentFloor >= 26 && this.currentFloor <= 30) {
            theme = 'theme-toxin';
            this.createSnakeAnimation();
        }
        
        container.classList.add(theme);
        
        // Remove existing snake containers
        const existingSnakes = document.querySelectorAll('.snake-container');
        existingSnakes.forEach(snake => snake.remove());
    }
    
    createSnakeAnimation() {
        const gameBoard = document.querySelector('.ttt-grid, .c4-grid');
        if (!gameBoard) return;
        
        // Create snake container
        const snakeContainer = document.createElement('div');
        snakeContainer.className = 'snake-container';
        
        // Create multiple snakes for more dynamic effect
        for (let i = 0; i < 2; i++) {
            const snake = document.createElement('div');
            snake.className = 'snake';
            
            // Create snake segments
            for (let j = 0; j < 8; j++) {
                const segment = document.createElement('div');
                segment.className = j === 0 ? 'snake-segment snake-head' : 'snake-segment';
                
                // Position segments along the snake path
                const delay = j * 0.2 + i * 4; // Stagger animation
                segment.style.animation = `snakeMove 12s ease-in-out infinite`;
                segment.style.animationDelay = `${delay}s`;
                
                // Vary snake paths
                if (i === 1) {
                    segment.style.animationDirection = 'reverse';
                }
                
                snake.appendChild(segment);
            }
            
            snakeContainer.appendChild(snake);
        }
        
        gameBoard.style.position = 'relative';
        gameBoard.appendChild(snakeContainer);
    }
    
    // Wind Effect System (Floors 1-5)
    checkWindBlowEffect() {
        if (this.currentFloor < 1 || this.currentFloor > 5 || !this.gameActive) return;
        
        // Calculate wind chance based on floor (1% to 25%)
        const windChance = this.currentFloor * 5; // Floor 1 = 5%, Floor 2 = 10%, ..., Floor 5 = 25%
        const randomChance = Math.random() * 100;
        
        if (randomChance <= windChance) {
            this.triggerWindBlowEffect();
        }
    }
    
    // Water Effect System (Floors 6-10)
    checkWaterEffect() {
        if (this.currentFloor < 6 || this.currentFloor > 10 || !this.gameActive) return;
        
        // Calculate water chance based on floor (6% to 30%)
        const waterChance = (this.currentFloor - 5) * 6; // Floor 6 = 6%, Floor 7 = 12%, ..., Floor 10 = 30%
        const randomChance = Math.random() * 100;
        
        if (randomChance <= waterChance) {
            this.triggerWaterFloodEffect();
        }
    }
    
    // Earth Effect System (Floors 11-15)
    checkEarthEffect() {
        if (this.currentFloor < 11 || this.currentFloor > 15 || !this.gameActive) return;
        
        // Calculate earth chance based on floor (7% to 35%)
        const earthChance = (this.currentFloor - 10) * 7; // Floor 11 = 7%, Floor 12 = 14%, ..., Floor 15 = 35%
        const randomChance = Math.random() * 100;
        
        if (randomChance <= earthChance) {
            this.triggerEarthQuakeEffect();
        }
    }
    
    // Fire Effect System (Floors 16-20)
    checkFireEffect() {
        if (this.currentFloor < 16 || this.currentFloor > 20 || !this.gameActive) return;
        
        // Calculate fire chance based on floor (8% to 40%)
        const fireChance = (this.currentFloor - 15) * 8; // Floor 16 = 8%, Floor 17 = 16%, ..., Floor 20 = 40%
        const randomChance = Math.random() * 100;
        
        if (randomChance <= fireChance) {
            this.triggerFireBlazeEffect();
        }
    }
    
    // Lightning Effect System (Floors 21-25)
    checkLightningEffect() {
        if (this.currentFloor < 21 || this.currentFloor > 25 || !this.gameActive) return;
        
        // Calculate lightning chance based on floor (9% to 45%)
        const lightningChance = (this.currentFloor - 20) * 9; // Floor 21 = 9%, Floor 22 = 18%, ..., Floor 25 = 45%
        const randomChance = Math.random() * 100;
        
        if (randomChance <= lightningChance) {
            this.triggerLightningStormEffect();
        }
    }
    
    triggerWindBlowEffect() {
        // Find all player pieces on the board
        const playerPieces = [];
        this.tttBoard.forEach((cell, index) => {
            if (cell === 'X') {
                playerPieces.push(index);
            }
        });
        
        if (playerPieces.length === 0) return;
        
        // Show dramatic wind warning
        this.updateTurnIndicator('🌪️ MASSIVE WINDSTORM INCOMING! 💨');
        
        // Create full-screen wind effect
        this.createFullScreenWindEffect();
        
        // Shake the board dramatically
        this.shakeBoardEffect();
        
        // Start wind protection minigame
        this.startWindProtectionMinigame(playerPieces);
    }
    
    createFullScreenWindEffect() {
        // Create wind overlay
        const windOverlay = document.createElement('div');
        windOverlay.className = 'wind-storm-overlay';
        windOverlay.id = 'wind-overlay';
        
        // Create multiple wind particle systems
        for (let i = 0; i < 15; i++) {
            const windParticle = document.createElement('div');
            windParticle.className = 'wind-particle';
            windParticle.style.animationDelay = `${Math.random() * 2}s`;
            windParticle.style.top = `${Math.random() * 100}%`;
            windParticle.style.left = `-20px`;
            windParticle.innerHTML = ['💨', '🍃', '🌪️', '💭'][Math.floor(Math.random() * 4)];
            windOverlay.appendChild(windParticle);
        }
        
        // Create swirling wind lines
        for (let i = 0; i < 8; i++) {
            const windLine = document.createElement('div');
            windLine.className = 'wind-line';
            windLine.style.animationDelay = `${Math.random() * 1.5}s`;
            windLine.style.top = `${Math.random() * 100}%`;
            windOverlay.appendChild(windLine);
        }
        
        document.body.appendChild(windOverlay);
    }
    
    removeFullScreenWindEffect() {
        const overlay = document.getElementById('wind-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    }
    
    shakeBoardEffect() {
        const gameBoard = document.querySelector('.ttt-grid');
        if (gameBoard) {
            gameBoard.classList.add('wind-shake');
            
            setTimeout(() => {
                gameBoard.classList.remove('wind-shake');
            }, 3000);
        }
    }
    
    startWindProtectionMinigame(playerPieces) {
        this.windProtectionActive = true;
        this.windProtectionTargets = [];
        this.windProtectionSuccess = 0;
        this.windProtectionRequired = 3; // Need to click 3 targets
        
        // Update indicator
        this.updateTurnIndicator('🛡️ QUICK! Click the glowing wind barriers to protect your pieces!');
        
        // Create wind protection targets around the board
        this.createWindProtectionTargets();
        
        // Start timer for minigame (5 seconds)
        this.windProtectionTimeLeft = 5;
        this.windProtectionTimer = setInterval(() => {
            this.windProtectionTimeLeft--;
            this.updateTurnIndicator(`🛡️ Protect your pieces! Click barriers: ${this.windProtectionSuccess}/${this.windProtectionRequired} - Time: ${this.windProtectionTimeLeft}s`);
            
            if (this.windProtectionTimeLeft <= 0) {
                this.endWindProtectionMinigame(false, playerPieces);
            }
        }, 1000);
    }
    
    createWindProtectionTargets() {
        const gameContainer = document.querySelector('.game-board');
        const positions = [
            { top: '10%', left: '10%' },
            { top: '10%', right: '10%' },
            { top: '50%', left: '5%' },
            { top: '50%', right: '5%' },
            { bottom: '10%', left: '10%' },
            { bottom: '10%', right: '10%' }
        ];
        
        // Shuffle positions and take required number
        const shuffled = positions.sort(() => 0.5 - Math.random());
        const targetPositions = shuffled.slice(0, this.windProtectionRequired);
        
        targetPositions.forEach((pos, index) => {
            const target = document.createElement('div');
            target.className = 'wind-protection-target';
            target.innerHTML = '🛡️';
            target.style.position = 'absolute';
            target.style.zIndex = '1000';
            
            // Set position
            if (pos.top) target.style.top = pos.top;
            if (pos.bottom) target.style.bottom = pos.bottom;
            if (pos.left) target.style.left = pos.left;
            if (pos.right) target.style.right = pos.right;
            
            target.addEventListener('click', () => {
                this.clickWindProtectionTarget(target, index);
            });
            
            gameContainer.appendChild(target);
            this.windProtectionTargets.push(target);
        });
    }
    
    clickWindProtectionTarget(target, index) {
        if (!this.windProtectionActive) return;
        
        // Mark as clicked
        target.classList.add('clicked');
        target.innerHTML = '✅';
        target.style.pointerEvents = 'none';
        
        this.windProtectionSuccess++;
        
        // Check if won the minigame
        if (this.windProtectionSuccess >= this.windProtectionRequired) {
            this.endWindProtectionMinigame(true, []);
        }
    }
    
    endWindProtectionMinigame(success, playerPieces) {
        this.windProtectionActive = false;
        
        // Clear timer
        if (this.windProtectionTimer) {
            clearInterval(this.windProtectionTimer);
            this.windProtectionTimer = null;
        }
        
        // Remove targets
        this.windProtectionTargets.forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.windProtectionTargets = [];
        
        if (success) {
            // Success - pieces are protected
            this.updateTurnIndicator('🛡️ SUCCESS! Your pieces are protected from the wind!');
            
            setTimeout(() => {
                this.updateTurnIndicator('🍃 The wind has passed... Continue playing.');
                this.removeFullScreenWindEffect();
                
                // Resume game flow after success
                if (this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => {
                        this.makeAIMove();
                    }, 500);
                }
            }, 2000);
        } else {
            // Failed - pieces get blown away
            this.updateTurnIndicator('💨 The wind barriers failed! Your pieces are getting blown away!');
            
            setTimeout(() => {
                // Randomly select 1-2 pieces to blow away
                const piecesToBlow = Math.min(Math.floor(Math.random() * 2) + 1, playerPieces.length);
                const selectedPieces = [];
                
                for (let i = 0; i < piecesToBlow; i++) {
                    const randomIndex = Math.floor(Math.random() * playerPieces.length);
                    const pieceIndex = playerPieces.splice(randomIndex, 1)[0];
                    selectedPieces.push(pieceIndex);
                }
                
                // Animate pieces being blown away
                selectedPieces.forEach((index, i) => {
                    setTimeout(() => {
                        this.animateWindBlowPiece(index);
                        this.tttBoard[index] = '';
                    }, i * 300);
                });
                
                setTimeout(() => {
                    this.updateTTTBoard();
                    this.updateTurnIndicator('🍃 The wind has passed... Continue playing.');
                    this.removeFullScreenWindEffect();
                    
                    // Check if game ended after wind effect
                    const winner = this.checkTTTWinner();
                    if (winner) {
                        this.endGame(winner);
                        return;
                    }
                    
                    if (this.isTTTBoardFull()) {
                        this.endGame('tie');
                        return;
                    }
                }, selectedPieces.length * 300 + 1000);
                
            }, 1500);
        }
    }
    
    triggerWaterFloodEffect() {
        // Find all player pieces on the board
        const playerPieces = [];
        this.tttBoard.forEach((cell, index) => {
            if (cell === 'X') {
                playerPieces.push(index);
            }
        });
        
        if (playerPieces.length === 0) return;
        
        // Show dramatic water warning
        this.updateTurnIndicator('🌊 MASSIVE FLOOD INCOMING! 💧');
        
        // Create full-screen water effect
        this.createFullScreenWaterEffect();
        
        // Shake the board dramatically
        this.shakeBoardEffect();
        
        // Start water protection minigame
        this.startWaterProtectionMinigame(playerPieces);
    }
    
    createFullScreenWaterEffect() {
        // Create water overlay
        const waterOverlay = document.createElement('div');
        waterOverlay.className = 'water-flood-overlay';
        waterOverlay.id = 'water-overlay';
        
        // Create multiple water particle systems
        for (let i = 0; i < 20; i++) {
            const waterParticle = document.createElement('div');
            waterParticle.className = 'water-particle';
            waterParticle.style.animationDelay = `${Math.random() * 3}s`;
            waterParticle.style.top = `${Math.random() * 100}%`;
            waterParticle.style.left = `-30px`;
            waterParticle.innerHTML = ['🌊', '💧', '🌀', '💦'][Math.floor(Math.random() * 4)];
            waterOverlay.appendChild(waterParticle);
        }
        
        // Create flowing water lines
        for (let i = 0; i < 10; i++) {
            const waterLine = document.createElement('div');
            waterLine.className = 'water-line';
            waterLine.style.animationDelay = `${Math.random() * 2}s`;
            waterLine.style.top = `${Math.random() * 100}%`;
            waterOverlay.appendChild(waterLine);
        }
        
        document.body.appendChild(waterOverlay);
    }
    
    removeFullScreenWaterEffect() {
        const overlay = document.getElementById('water-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    }
    
    startWaterProtectionMinigame(playerPieces) {
        this.waterProtectionActive = true;
        this.waterProtectionTargets = [];
        this.waterProtectionSuccess = 0;
        this.waterProtectionRequired = 4; // Need to click 4 targets (one more than wind)
        
        // Update indicator
        this.updateTurnIndicator('🫧 QUICK! Pop the fish bubbles to protect your pieces!');
        
        // Create water protection targets around the board
        this.createWaterProtectionTargets();
        
        // Start timer for minigame (6 seconds - slightly longer due to more targets)
        this.waterProtectionTimeLeft = 6;
        this.waterProtectionTimer = setInterval(() => {
            this.waterProtectionTimeLeft--;
            this.updateTurnIndicator(`🫧 Pop fish bubbles! Popped: ${this.waterProtectionSuccess}/${this.waterProtectionRequired} - Time: ${this.waterProtectionTimeLeft}s`);
            
            if (this.waterProtectionTimeLeft <= 0) {
                this.endWaterProtectionMinigame(false, playerPieces);
            }
        }, 1000);
    }
    
    createWaterProtectionTargets() {
        const gameContainer = document.querySelector('.game-board');
        const positions = [
            { top: '5%', left: '5%' },
            { top: '5%', right: '5%' },
            { top: '50%', left: '2%' },
            { top: '50%', right: '2%' },
            { bottom: '5%', left: '5%' },
            { bottom: '5%', right: '5%' },
            { top: '25%', left: '8%' },
            { top: '75%', right: '8%' }
        ];
        
        // Shuffle positions and take required number
        const shuffled = positions.sort(() => 0.5 - Math.random());
        const targetPositions = shuffled.slice(0, this.waterProtectionRequired);
        
        targetPositions.forEach((pos, index) => {
            const target = document.createElement('div');
            target.className = 'water-protection-target';
            target.innerHTML = '🫧🐠';
            target.style.position = 'absolute';
            target.style.zIndex = '1000';
            
            // Set position
            if (pos.top) target.style.top = pos.top;
            if (pos.bottom) target.style.bottom = pos.bottom;
            if (pos.left) target.style.left = pos.left;
            if (pos.right) target.style.right = pos.right;
            
            target.addEventListener('click', () => {
                this.clickWaterProtectionTarget(target, index);
            });
            
            gameContainer.appendChild(target);
            this.waterProtectionTargets.push(target);
        });
    }
    
    clickWaterProtectionTarget(target, index) {
        if (!this.waterProtectionActive) return;
        
        // Mark as clicked
        target.classList.add('bubble-popped');
        target.innerHTML = '💥🐠';
        target.style.pointerEvents = 'none';
        
        this.waterProtectionSuccess++;
        
        // Check if won the minigame
        if (this.waterProtectionSuccess >= this.waterProtectionRequired) {
            this.endWaterProtectionMinigame(true, []);
        }
    }
    
    endWaterProtectionMinigame(success, playerPieces) {
        this.waterProtectionActive = false;
        
        // Clear timer
        if (this.waterProtectionTimer) {
            clearInterval(this.waterProtectionTimer);
            this.waterProtectionTimer = null;
        }
        
        // Remove any remaining targets
        this.waterProtectionTargets.forEach(target => {
            if (target && target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.waterProtectionTargets = [];
        
        // Also remove any lingering targets by class name
        document.querySelectorAll('.water-protection-target').forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        
        if (success) {
            // Success - pieces are protected
            this.updateTurnIndicator('🐠 SUCCESS! Your fish are safe from the flood!');
            
            setTimeout(() => {
                this.updateTurnIndicator('🌊 The flood has receded... Continue playing.');
                this.removeFullScreenWaterEffect();
                
                // Resume game flow after success
                if (this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => {
                        this.makeAIMove();
                    }, 500);
                }
            }, 2000);
        } else {
            // Failed - pieces get washed away
            this.updateTurnIndicator('🌊 The bubbles burst! Your fish are getting washed away!');
            
            setTimeout(() => {
                // Randomly select 1-2 pieces to wash away
                const piecesToWash = Math.min(Math.floor(Math.random() * 2) + 1, playerPieces.length);
                const selectedPieces = [];
                
                for (let i = 0; i < piecesToWash; i++) {
                    const randomIndex = Math.floor(Math.random() * playerPieces.length);
                    const pieceIndex = playerPieces.splice(randomIndex, 1)[0];
                    selectedPieces.push(pieceIndex);
                }
                
                // Animate pieces being washed away
                selectedPieces.forEach((index, i) => {
                    setTimeout(() => {
                        this.animateWaterWashPiece(index);
                        this.tttBoard[index] = '';
                    }, i * 300);
                });
                
                setTimeout(() => {
                    this.updateTTTBoard();
                    this.updateTurnIndicator('🌊 The flood has receded... Continue playing.');
                    this.removeFullScreenWaterEffect();
                    
                    // Check if game ended after water effect
                    const winner = this.checkTTTWinner();
                    if (winner) {
                        this.endGame(winner);
                        return;
                    }
                    
                    if (this.isTTTBoardFull()) {
                        this.endGame('tie');
                        return;
                    }
                }, selectedPieces.length * 300 + 1000);
                
            }, 1500);
        }
    }
    
    animateWaterWashPiece(index) {
        const cell = document.querySelector(`#ttt-board [data-index="${index}"]`);
        if (cell) {
            cell.classList.add('water-washed');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cell.classList.remove('water-washed');
            }, 1000);
        }
    }
    
    triggerEarthQuakeEffect() {
        // Find all player pieces on the board
        const playerPieces = [];
        this.tttBoard.forEach((cell, index) => {
            if (cell === 'X') {
                playerPieces.push(index);
            }
        });
        
        if (playerPieces.length === 0) return;
        
        // Show dramatic earthquake warning
        this.updateTurnIndicator('🪨 MASSIVE EARTHQUAKE INCOMING! ⛰️');
        
        // Create full-screen earth effect
        this.createFullScreenEarthEffect();
        
        // Shake the board dramatically
        this.shakeBoardEffect();
        
        // Start earth protection minigame
        this.startEarthProtectionMinigame(playerPieces);
    }
    
    createFullScreenEarthEffect() {
        // Create earth overlay
        const earthOverlay = document.createElement('div');
        earthOverlay.className = 'earth-quake-overlay';
        earthOverlay.id = 'earth-overlay';
        
        // Create multiple earth particle systems
        for (let i = 0; i < 25; i++) {
            const earthParticle = document.createElement('div');
            earthParticle.className = 'earth-particle';
            earthParticle.style.animationDelay = `${Math.random() * 2.5}s`;
            earthParticle.style.top = `${Math.random() * 100}%`;
            earthParticle.style.left = `-40px`;
            earthParticle.innerHTML = ['🪨', '⛰️', '🌋', '💎'][Math.floor(Math.random() * 4)];
            earthOverlay.appendChild(earthParticle);
        }
        
        // Create cracking earth lines
        for (let i = 0; i < 12; i++) {
            const earthLine = document.createElement('div');
            earthLine.className = 'earth-crack-line';
            earthLine.style.animationDelay = `${Math.random() * 1.8}s`;
            earthLine.style.top = `${Math.random() * 100}%`;
            earthOverlay.appendChild(earthLine);
        }
        
        document.body.appendChild(earthOverlay);
    }
    
    removeFullScreenEarthEffect() {
        const overlay = document.getElementById('earth-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    }
    
    startEarthProtectionMinigame(playerPieces) {
        this.earthProtectionActive = true;
        this.earthProtectionTargets = [];
        this.earthProtectionSuccess = 0;
        this.earthProtectionRequired = 5; // Need to click 5 targets (one more than water)
        
        // Update indicator
        this.updateTurnIndicator('💎 QUICK! Break the crystal barriers to protect your pieces!');
        
        // Create earth protection targets around the board
        this.createEarthProtectionTargets();
        
        // Start timer for minigame (7 seconds - slightly longer due to more targets)
        this.earthProtectionTimeLeft = 7;
        this.earthProtectionTimer = setInterval(() => {
            this.earthProtectionTimeLeft--;
            this.updateTurnIndicator(`💎 Break crystals! Broken: ${this.earthProtectionSuccess}/${this.earthProtectionRequired} - Time: ${this.earthProtectionTimeLeft}s`);
            
            if (this.earthProtectionTimeLeft <= 0) {
                this.endEarthProtectionMinigame(false, playerPieces);
            }
        }, 1000);
    }
    
    createEarthProtectionTargets() {
        const gameContainer = document.querySelector('.game-board');
        const positions = [
            { top: '3%', left: '3%' },
            { top: '3%', right: '3%' },
            { top: '50%', left: '1%' },
            { top: '50%', right: '1%' },
            { bottom: '3%', left: '3%' },
            { bottom: '3%', right: '3%' },
            { top: '20%', left: '6%' },
            { top: '80%', right: '6%' },
            { top: '35%', left: '4%' },
            { top: '65%', right: '4%' }
        ];
        
        // Shuffle positions and take required number
        const shuffled = positions.sort(() => 0.5 - Math.random());
        const targetPositions = shuffled.slice(0, this.earthProtectionRequired);
        
        targetPositions.forEach((pos, index) => {
            const target = document.createElement('div');
            target.className = 'earth-protection-target';
            target.innerHTML = '💎🪨';
            target.style.position = 'absolute';
            target.style.zIndex = '1000';
            
            // Set position
            if (pos.top) target.style.top = pos.top;
            if (pos.bottom) target.style.bottom = pos.bottom;
            if (pos.left) target.style.left = pos.left;
            if (pos.right) target.style.right = pos.right;
            
            target.addEventListener('click', () => {
                this.clickEarthProtectionTarget(target, index);
            });
            
            gameContainer.appendChild(target);
            this.earthProtectionTargets.push(target);
        });
    }
    
    clickEarthProtectionTarget(target, index) {
        if (!this.earthProtectionActive) return;
        
        // Create crystal break effect
        target.classList.add('crystal-broken');
        target.innerHTML = '💥🪨';
        target.style.pointerEvents = 'none';
        
        this.earthProtectionSuccess++;
        
        // Check if won the minigame
        if (this.earthProtectionSuccess >= this.earthProtectionRequired) {
            this.endEarthProtectionMinigame(true, []);
        }
    }
    
    endEarthProtectionMinigame(success, playerPieces) {
        this.earthProtectionActive = false;
        
        // Clear timer
        if (this.earthProtectionTimer) {
            clearInterval(this.earthProtectionTimer);
            this.earthProtectionTimer = null;
        }
        
        // Remove targets
        this.earthProtectionTargets.forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.earthProtectionTargets = [];
        
        if (success) {
            // Success - pieces are protected
            this.updateTurnIndicator('💎 SUCCESS! Your rocks are protected from the earthquake!');
            
            setTimeout(() => {
                this.updateTurnIndicator('🪨 The earthquake has settled... Continue playing.');
                this.removeFullScreenEarthEffect();
                
                // Resume game flow after success
                if (this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => {
                        this.makeAIMove();
                    }, 500);
                }
            }, 2000);
        } else {
            // Failed - pieces get crushed
            this.updateTurnIndicator('🪨 The crystals cracked! Your rocks are getting crushed!');
            
            setTimeout(() => {
                // Randomly select 1-2 pieces to crush
                const piecesToCrush = Math.min(Math.floor(Math.random() * 2) + 1, playerPieces.length);
                const selectedPieces = [];
                
                for (let i = 0; i < piecesToCrush; i++) {
                    const randomIndex = Math.floor(Math.random() * playerPieces.length);
                    const pieceIndex = playerPieces.splice(randomIndex, 1)[0];
                    selectedPieces.push(pieceIndex);
                }
                
                // Animate pieces being crushed
                selectedPieces.forEach((index, i) => {
                    setTimeout(() => {
                        this.animateEarthCrushPiece(index);
                        this.tttBoard[index] = '';
                    }, i * 300);
                });
                
                setTimeout(() => {
                    this.updateTTTBoard();
                    this.updateTurnIndicator('🪨 The earthquake has settled... Continue playing.');
                    this.removeFullScreenEarthEffect();
                    
                    // Check if game ended after earth effect
                    const winner = this.checkTTTWinner();
                    if (winner) {
                        this.endGame(winner);
                        return;
                    }
                    
                    if (this.isTTTBoardFull()) {
                        this.endGame('tie');
                        return;
                    }
                }, selectedPieces.length * 300 + 1000);
                
            }, 1500);
        }
    }
    
    animateEarthCrushPiece(index) {
        const cell = document.querySelector(`#ttt-board [data-index="${index}"]`);
        if (cell) {
            cell.classList.add('earth-crushed');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cell.classList.remove('earth-crushed');
            }, 1000);
        }
    }
    
    triggerFireBlazeEffect() {
        // Find all player pieces on the board
        const playerPieces = [];
        this.tttBoard.forEach((cell, index) => {
            if (cell === 'X') {
                playerPieces.push(index);
            }
        });
        
        if (playerPieces.length === 0) return;
        
        // Show dramatic fire warning
        this.updateTurnIndicator('🔥 MASSIVE INFERNO INCOMING! 🌋');
        
        // Create full-screen fire effect
        this.createFullScreenFireEffect();
        
        // Shake the board dramatically
        this.shakeBoardEffect();
        
        // Start fire protection minigame
        this.startFireProtectionMinigame(playerPieces);
    }
    
    createFullScreenFireEffect() {
        // Create fire overlay
        const fireOverlay = document.createElement('div');
        fireOverlay.className = 'fire-blaze-overlay';
        fireOverlay.id = 'fire-overlay';
        
        // Create multiple fire particle systems
        for (let i = 0; i < 30; i++) {
            const fireParticle = document.createElement('div');
            fireParticle.className = 'fire-particle';
            fireParticle.style.animationDelay = `${Math.random() * 2}s`;
            fireParticle.style.top = `${Math.random() * 100}%`;
            fireParticle.style.left = `-50px`;
            fireParticle.innerHTML = ['🔥', '🌋', '💥', '🔴'][Math.floor(Math.random() * 4)];
            fireOverlay.appendChild(fireParticle);
        }
        
        // Create flame lines
        for (let i = 0; i < 15; i++) {
            const flameLine = document.createElement('div');
            flameLine.className = 'flame-line';
            flameLine.style.animationDelay = `${Math.random() * 1.5}s`;
            flameLine.style.top = `${Math.random() * 100}%`;
            fireOverlay.appendChild(flameLine);
        }
        
        document.body.appendChild(fireOverlay);
    }
    
    removeFullScreenFireEffect() {
        const overlay = document.getElementById('fire-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    }
    
    startFireProtectionMinigame(playerPieces) {
        this.fireProtectionActive = true;
        this.fireProtectionTargets = [];
        this.fireProtectionSuccess = 0;
        this.fireProtectionRequired = 6; // Need to click 6 targets (one more than earth)
        
        // Update indicator
        this.updateTurnIndicator('🚒 QUICK! Extinguish the torches to protect your pieces!');
        
        // Create fire protection targets around the board
        this.createFireProtectionTargets();
        
        // Start timer for minigame (8 seconds - slightly longer due to more targets)
        this.fireProtectionTimeLeft = 8;
        this.fireProtectionTimer = setInterval(() => {
            this.fireProtectionTimeLeft--;
            this.updateTurnIndicator(`🚒 Extinguish torches! Put out: ${this.fireProtectionSuccess}/${this.fireProtectionRequired} - Time: ${this.fireProtectionTimeLeft}s`);
            
            if (this.fireProtectionTimeLeft <= 0) {
                this.endFireProtectionMinigame(false, playerPieces);
            }
        }, 1000);
    }
    
    createFireProtectionTargets() {
        const gameContainer = document.querySelector('.game-board');
        const positions = [
            { top: '2%', left: '2%' },
            { top: '2%', right: '2%' },
            { top: '50%', left: '0%' },
            { top: '50%', right: '0%' },
            { bottom: '2%', left: '2%' },
            { bottom: '2%', right: '2%' },
            { top: '15%', left: '4%' },
            { top: '85%', right: '4%' },
            { top: '30%', left: '2%' },
            { top: '70%', right: '2%' },
            { top: '60%', left: '6%' },
            { top: '40%', right: '6%' }
        ];
        
        // Shuffle positions and take required number
        const shuffled = positions.sort(() => 0.5 - Math.random());
        const targetPositions = shuffled.slice(0, this.fireProtectionRequired);
        
        targetPositions.forEach((pos, index) => {
            const target = document.createElement('div');
            target.className = 'fire-protection-target';
            target.innerHTML = '🕯️🔥';
            target.style.position = 'absolute';
            target.style.zIndex = '1000';
            
            // Set position
            if (pos.top) target.style.top = pos.top;
            if (pos.bottom) target.style.bottom = pos.bottom;
            if (pos.left) target.style.left = pos.left;
            if (pos.right) target.style.right = pos.right;
            
            target.addEventListener('click', () => {
                this.clickFireProtectionTarget(target, index);
            });
            
            gameContainer.appendChild(target);
            this.fireProtectionTargets.push(target);
        });
    }
    
    clickFireProtectionTarget(target, index) {
        if (!this.fireProtectionActive) return;
        
        // Create torch extinguish effect
        target.classList.add('torch-extinguished');
        target.innerHTML = '💨🕯️';
        target.style.pointerEvents = 'none';
        
        this.fireProtectionSuccess++;
        
        // Check if won the minigame
        if (this.fireProtectionSuccess >= this.fireProtectionRequired) {
            this.endFireProtectionMinigame(true, []);
        }
    }
    
    endFireProtectionMinigame(success, playerPieces) {
        this.fireProtectionActive = false;
        
        // Clear timer
        if (this.fireProtectionTimer) {
            clearInterval(this.fireProtectionTimer);
            this.fireProtectionTimer = null;
        }
        
        // Remove targets
        this.fireProtectionTargets.forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.fireProtectionTargets = [];
        
        if (success) {
            // Success - pieces are protected
            this.updateTurnIndicator('🚒 SUCCESS! Your flames are safe from the inferno!');
            
            setTimeout(() => {
                this.updateTurnIndicator('🔥 The fire has died down... Continue playing.');
                this.removeFullScreenFireEffect();
                
                // Resume game flow after success
                if (this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => {
                        this.makeAIMove();
                    }, 500);
                }
            }, 2000);
        } else {
            // Failed - pieces get burned
            this.updateTurnIndicator('🔥 The torches burned out! Your flames are getting consumed!');
            
            setTimeout(() => {
                // Randomly select 1-2 pieces to burn
                const piecesToBurn = Math.min(Math.floor(Math.random() * 2) + 1, playerPieces.length);
                const selectedPieces = [];
                
                for (let i = 0; i < piecesToBurn; i++) {
                    const randomIndex = Math.floor(Math.random() * playerPieces.length);
                    const pieceIndex = playerPieces.splice(randomIndex, 1)[0];
                    selectedPieces.push(pieceIndex);
                }
                
                // Animate pieces being burned
                selectedPieces.forEach((index, i) => {
                    setTimeout(() => {
                        this.animateFireBurnPiece(index);
                        this.tttBoard[index] = '';
                    }, i * 300);
                });
                
                setTimeout(() => {
                    this.updateTTTBoard();
                    this.updateTurnIndicator('🔥 The fire has died down... Continue playing.');
                    this.removeFullScreenFireEffect();
                    
                    // Check if game ended after fire effect
                    const winner = this.checkTTTWinner();
                    if (winner) {
                        this.endGame(winner);
                        return;
                    }
                    
                    if (this.isTTTBoardFull()) {
                        this.endGame('tie');
                        return;
                    }
                }, selectedPieces.length * 300 + 1000);
                
            }, 1500);
        }
    }
    
    animateFireBurnPiece(index) {
        const cell = document.querySelector(`#ttt-board [data-index="${index}"]`);
        if (cell) {
            cell.classList.add('fire-burned');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cell.classList.remove('fire-burned');
            }, 1000);
        }
    }
    
    // Toxin Effect System (Floors 26-30)
    checkToxinEffect() {
        if (this.currentFloor < 26 || this.currentFloor > 30 || !this.gameActive) return;
        
        // Calculate toxin chance based on floor (10% to 50%)
        const toxinChance = (this.currentFloor - 25) * 10; // Floor 26 = 10%, Floor 27 = 20%, ..., Floor 30 = 50%
        const randomChance = Math.random() * 100;
        
        if (randomChance <= toxinChance) {
            this.triggerToxinCloudEffect();
        }
    }
    
    triggerLightningStormEffect() {
        // Find all player pieces on the board
        const playerPieces = [];
        this.tttBoard.forEach((cell, index) => {
            if (cell === 'X') {
                playerPieces.push(index);
            }
        });
        
        if (playerPieces.length === 0) return;
        
        // Show dramatic lightning warning
        this.updateTurnIndicator('⚡ MASSIVE LIGHTNING STORM INCOMING! 🌩️');
        
        // Create full-screen lightning effect
        this.createFullScreenLightningEffect();
        
        // Shake the board dramatically
        this.shakeBoardEffect();
        
        // Start lightning protection minigame
        this.startLightningProtectionMinigame(playerPieces);
    }
    
    createFullScreenLightningEffect() {
        // Create lightning overlay
        const lightningOverlay = document.createElement('div');
        lightningOverlay.className = 'lightning-storm-overlay';
        lightningOverlay.id = 'lightning-overlay';
        
        // Create multiple lightning particle systems
        for (let i = 0; i < 35; i++) {
            const lightningParticle = document.createElement('div');
            lightningParticle.className = 'lightning-particle';
            lightningParticle.style.animationDelay = `${Math.random() * 1.5}s`;
            lightningParticle.style.top = `${Math.random() * 100}%`;
            lightningParticle.style.left = `-60px`;
            lightningParticle.innerHTML = ['⚡', '🌩️', '⭐', '💫'][Math.floor(Math.random() * 4)];
            lightningOverlay.appendChild(lightningParticle);
        }
        
        // Create electric bolt lines
        for (let i = 0; i < 18; i++) {
            const boltLine = document.createElement('div');
            boltLine.className = 'lightning-bolt-line';
            boltLine.style.animationDelay = `${Math.random() * 1.2}s`;
            boltLine.style.top = `${Math.random() * 100}%`;
            lightningOverlay.appendChild(boltLine);
        }
        
        document.body.appendChild(lightningOverlay);
    }
    
    removeFullScreenLightningEffect() {
        const overlay = document.getElementById('lightning-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    }
    
    startLightningProtectionMinigame(playerPieces) {
        this.lightningProtectionActive = true;
        this.lightningProtectionTargets = [];
        this.lightningProtectionSuccess = 0;
        this.lightningProtectionRequired = 7; // Need to click 7 targets (one more than fire)
        
        // Update indicator
        this.updateTurnIndicator('🔌 QUICK! Discharge the lightning rods to protect your pieces!');
        
        // Create lightning protection targets around the board
        this.createLightningProtectionTargets();
        
        // Start timer for minigame (9 seconds - slightly longer due to more targets)
        this.lightningProtectionTimeLeft = 9;
        this.lightningProtectionTimer = setInterval(() => {
            this.lightningProtectionTimeLeft--;
            this.updateTurnIndicator(`🔌 Discharge rods! Zapped: ${this.lightningProtectionSuccess}/${this.lightningProtectionRequired} - Time: ${this.lightningProtectionTimeLeft}s`);
            
            if (this.lightningProtectionTimeLeft <= 0) {
                this.endLightningProtectionMinigame(false, playerPieces);
            }
        }, 1000);
    }
    
    createLightningProtectionTargets() {
        const gameContainer = document.querySelector('.game-board');
        const positions = [
            { top: '1%', left: '1%' },
            { top: '1%', right: '1%' },
            { top: '50%', left: '-1%' },
            { top: '50%', right: '-1%' },
            { bottom: '1%', left: '1%' },
            { bottom: '1%', right: '1%' },
            { top: '10%', left: '3%' },
            { top: '90%', right: '3%' },
            { top: '25%', left: '1%' },
            { top: '75%', right: '1%' },
            { top: '35%', left: '5%' },
            { top: '65%', right: '5%' },
            { top: '55%', left: '8%' },
            { top: '45%', right: '8%' }
        ];
        
        // Shuffle positions and take required number
        const shuffled = positions.sort(() => 0.5 - Math.random());
        const targetPositions = shuffled.slice(0, this.lightningProtectionRequired);
        
        targetPositions.forEach((pos, index) => {
            const target = document.createElement('div');
            target.className = 'lightning-protection-target';
            target.innerHTML = '🔌⚡';
            target.style.position = 'absolute';
            target.style.zIndex = '1000';
            
            // Set position
            if (pos.top) target.style.top = pos.top;
            if (pos.bottom) target.style.bottom = pos.bottom;
            if (pos.left) target.style.left = pos.left;
            if (pos.right) target.style.right = pos.right;
            
            target.addEventListener('click', () => {
                this.clickLightningProtectionTarget(target, index);
            });
            
            gameContainer.appendChild(target);
            this.lightningProtectionTargets.push(target);
        });
    }
    
    clickLightningProtectionTarget(target, index) {
        if (!this.lightningProtectionActive) return;
        
        // Create lightning discharge effect
        target.classList.add('rod-discharged');
        target.innerHTML = '💥⚡';
        target.style.pointerEvents = 'none';
        
        this.lightningProtectionSuccess++;
        
        // Check if won the minigame
        if (this.lightningProtectionSuccess >= this.lightningProtectionRequired) {
            this.endLightningProtectionMinigame(true, []);
        }
    }
    
    endLightningProtectionMinigame(success, playerPieces) {
        this.lightningProtectionActive = false;
        
        // Clear timer
        if (this.lightningProtectionTimer) {
            clearInterval(this.lightningProtectionTimer);
            this.lightningProtectionTimer = null;
        }
        
        // Remove targets
        this.lightningProtectionTargets.forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.lightningProtectionTargets = [];
        
        if (success) {
            // Success - pieces are protected
            this.updateTurnIndicator('⚡ SUCCESS! Your lightning is safe from the storm!');
            
            setTimeout(() => {
                this.updateTurnIndicator('🌩️ The storm has passed... Continue playing.');
                this.removeFullScreenLightningEffect();
                
                // Resume game flow after success
                if (this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => {
                        this.makeAIMove();
                    }, 500);
                }
            }, 2000);
        } else {
            // Failed - pieces get electrocuted
            this.updateTurnIndicator('⚡ The rods overloaded! Your lightning is getting electrocuted!');
            
            setTimeout(() => {
                // Randomly select 1-2 pieces to electrocute
                const piecesToZap = Math.min(Math.floor(Math.random() * 2) + 1, playerPieces.length);
                const selectedPieces = [];
                
                for (let i = 0; i < piecesToZap; i++) {
                    const randomIndex = Math.floor(Math.random() * playerPieces.length);
                    const pieceIndex = playerPieces.splice(randomIndex, 1)[0];
                    selectedPieces.push(pieceIndex);
                }
                
                // Animate pieces being electrocuted
                selectedPieces.forEach((index, i) => {
                    setTimeout(() => {
                        this.animateLightningZapPiece(index);
                        this.tttBoard[index] = '';
                    }, i * 300);
                });
                
                setTimeout(() => {
                    this.updateTTTBoard();
                    this.updateTurnIndicator('🌩️ The storm has passed... Continue playing.');
                    this.removeFullScreenLightningEffect();
                    
                    // Check if game ended after lightning effect
                    const winner = this.checkTTTWinner();
                    if (winner) {
                        this.endGame(winner);
                        return;
                    }
                    
                    if (this.isTTTBoardFull()) {
                        this.endGame('tie');
                        return;
                    }
                }, selectedPieces.length * 300 + 1000);
                
            }, 1500);
        }
    }
    
    animateLightningZapPiece(index) {
        const cell = document.querySelector(`#ttt-board [data-index="${index}"]`);
        if (cell) {
            cell.classList.add('lightning-zapped');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cell.classList.remove('lightning-zapped');
            }, 1000);
        }
    }
    
    triggerToxinCloudEffect() {
        // Find all player pieces on the board
        const playerPieces = [];
        this.tttBoard.forEach((cell, index) => {
            if (cell === 'X') {
                playerPieces.push(index);
            }
        });
        
        if (playerPieces.length === 0) return;
        
        // Show dramatic toxin warning
        this.updateTurnIndicator('☠️ MASSIVE TOXIC CLOUD INCOMING! ☣️');
        
        // Create full-screen toxin effect
        this.createFullScreenToxinEffect();
        
        // Shake the board dramatically
        this.shakeBoardEffect();
        
        // Start toxin protection minigame
        this.startToxinProtectionMinigame(playerPieces);
    }
    
    createFullScreenToxinEffect() {
        // Create toxin overlay
        const toxinOverlay = document.createElement('div');
        toxinOverlay.className = 'toxin-cloud-overlay';
        toxinOverlay.id = 'toxin-overlay';
        
        // Create multiple toxin particle systems
        for (let i = 0; i < 40; i++) {
            const toxinParticle = document.createElement('div');
            toxinParticle.className = 'toxin-particle';
            toxinParticle.style.animationDelay = `${Math.random() * 2}s`;
            toxinParticle.style.top = `${Math.random() * 100}%`;
            toxinParticle.style.left = `-80px`;
            toxinParticle.innerHTML = ['☠️', '☣️', '🧪', '💀'][Math.floor(Math.random() * 4)];
            toxinOverlay.appendChild(toxinParticle);
        }
        
        // Create toxic gas streams
        for (let i = 0; i < 20; i++) {
            const gasStream = document.createElement('div');
            gasStream.className = 'toxin-gas-stream';
            gasStream.style.animationDelay = `${Math.random() * 1.5}s`;
            gasStream.style.top = `${Math.random() * 100}%`;
            toxinOverlay.appendChild(gasStream);
        }
        
        document.body.appendChild(toxinOverlay);
    }
    
    removeFullScreenToxinEffect() {
        const overlay = document.getElementById('toxin-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    }
    
    startToxinProtectionMinigame(playerPieces) {
        this.toxinProtectionActive = true;
        this.toxinProtectionTargets = [];
        this.toxinProtectionSuccess = 0;
        this.toxinProtectionRequired = 8; // Need to click 8 targets (one more than lightning)
        
        // Update indicator
        this.updateTurnIndicator('🧴 QUICK! Neutralize the toxic vials to protect your pieces!');
        
        // Create toxin protection targets around the board
        this.createToxinProtectionTargets();
        
        // Start timer for minigame (10 seconds - longest timer due to most targets)
        this.toxinProtectionTimeLeft = 10;
        this.toxinProtectionTimer = setInterval(() => {
            this.toxinProtectionTimeLeft--;
            this.updateTurnIndicator(`🧴 Neutralize vials! Cleared: ${this.toxinProtectionSuccess}/${this.toxinProtectionRequired} - Time: ${this.toxinProtectionTimeLeft}s`);
            
            if (this.toxinProtectionTimeLeft <= 0) {
                this.endToxinProtectionMinigame(false, playerPieces);
            }
        }, 1000);
    }
    
    createToxinProtectionTargets() {
        const gameContainer = document.querySelector('.game-board');
        const positions = [
            { top: '2%', left: '2%' },
            { top: '2%', right: '2%' },
            { top: '50%', left: '-2%' },
            { top: '50%', right: '-2%' },
            { bottom: '2%', left: '2%' },
            { bottom: '2%', right: '2%' },
            { top: '15%', left: '4%' },
            { top: '85%', right: '4%' },
            { top: '30%', left: '2%' },
            { top: '70%', right: '2%' },
            { top: '40%', left: '6%' },
            { top: '60%', right: '6%' },
            { top: '20%', left: '8%' },
            { top: '80%', right: '8%' },
            { top: '65%', left: '3%' },
            { top: '35%', right: '3%' }
        ];
        
        // Shuffle positions and take required number
        const shuffled = positions.sort(() => 0.5 - Math.random());
        const targetPositions = shuffled.slice(0, this.toxinProtectionRequired);
        
        targetPositions.forEach((pos, index) => {
            const target = document.createElement('div');
            target.className = 'toxin-protection-target';
            target.innerHTML = '🧪☣️';
            target.style.position = 'absolute';
            target.style.zIndex = '1000';
            
            // Set position
            if (pos.top) target.style.top = pos.top;
            if (pos.bottom) target.style.bottom = pos.bottom;
            if (pos.left) target.style.left = pos.left;
            if (pos.right) target.style.right = pos.right;
            
            target.addEventListener('click', () => {
                this.clickToxinProtectionTarget(target, index);
            });
            
            gameContainer.appendChild(target);
            this.toxinProtectionTargets.push(target);
        });
    }
    
    clickToxinProtectionTarget(target, index) {
        if (!this.toxinProtectionActive) return;
        
        // Create toxin neutralization effect
        target.classList.add('vial-neutralized');
        target.innerHTML = '💧✅';
        target.style.pointerEvents = 'none';
        
        this.toxinProtectionSuccess++;
        
        // Check if won the minigame
        if (this.toxinProtectionSuccess >= this.toxinProtectionRequired) {
            this.endToxinProtectionMinigame(true, []);
        }
    }
    
    endToxinProtectionMinigame(success, playerPieces) {
        this.toxinProtectionActive = false;
        
        // Clear timer
        if (this.toxinProtectionTimer) {
            clearInterval(this.toxinProtectionTimer);
            this.toxinProtectionTimer = null;
        }
        
        // Remove targets
        this.toxinProtectionTargets.forEach(target => {
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });
        this.toxinProtectionTargets = [];
        
        if (success) {
            // Success - pieces are protected
            this.updateTurnIndicator('🧴 SUCCESS! Your pieces are safe from the toxins!');
            
            setTimeout(() => {
                this.updateTurnIndicator('☣️ The toxic cloud has cleared... Continue playing.');
                this.removeFullScreenToxinEffect();
                
                // Resume game flow after success
                if (this.gameActive && this.currentPlayer === 'O') {
                    setTimeout(() => {
                        this.makeAIMove();
                    }, 500);
                }
            }, 2000);
        } else {
            // Failed - pieces get poisoned
            this.updateTurnIndicator('☠️ The toxins spread! Your pieces are getting poisoned!');
            
            setTimeout(() => {
                // Randomly select 1-3 pieces to poison
                const piecesToPoison = Math.min(Math.floor(Math.random() * 3) + 1, playerPieces.length);
                const selectedPieces = [];
                
                for (let i = 0; i < piecesToPoison; i++) {
                    const randomIndex = Math.floor(Math.random() * playerPieces.length);
                    const pieceIndex = playerPieces.splice(randomIndex, 1)[0];
                    selectedPieces.push(pieceIndex);
                }
                
                // Animate pieces being poisoned
                selectedPieces.forEach((index, i) => {
                    setTimeout(() => {
                        this.animateToxinPoisonPiece(index);
                        this.tttBoard[index] = '';
                    }, i * 300);
                });
                
                setTimeout(() => {
                    this.updateTTTBoard();
                    this.updateTurnIndicator('☣️ The toxic cloud has cleared... Continue playing.');
                    this.removeFullScreenToxinEffect();
                    
                    // Check if game ended after toxin effect
                    const winner = this.checkTTTWinner();
                    if (winner) {
                        this.endGame(winner);
                        return;
                    }
                    
                    if (this.isTTTBoardFull()) {
                        this.endGame('tie');
                        return;
                    }
                }, selectedPieces.length * 300 + 1000);
                
            }, 1500);
        }
    }
    
    animateToxinPoisonPiece(index) {
        const cell = document.querySelector(`#ttt-board [data-index="${index}"]`);
        if (cell) {
            cell.classList.add('toxin-poisoned');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cell.classList.remove('toxin-poisoned');
            }, 1000);
        }
    }
    
    animateWindBlowPiece(index) {
        const cell = document.querySelector(`#ttt-board [data-index="${index}"]`);
        if (cell) {
            cell.classList.add('wind-blown');
            
            // Remove the animation class after it completes
            setTimeout(() => {
                cell.classList.remove('wind-blown');
            }, 1000);
        }
    }
    
    // Victory Flash Effect
    showVictoryFlash() {
        const flash = document.createElement('div');
        flash.className = 'victory-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 1000);
    }
    
    // Auto-advance with Random Transition
    autoAdvanceToNextFloor() {
        this.hideModal();
        
        // Create random transition
        const transitions = [
            'fade-transition',
            'slide-transition', 
            'zoom-transition',
            'spiral-transition',
            'wave-transition',
            'diamond-transition'
        ];
        
        const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
        this.playTransition(randomTransition, () => {
            this.nextFloor();
        });
    }
    
    // Transition Animation System
    playTransition(transitionClass, callback) {
        const transition = document.createElement('div');
        transition.className = `screen-transition ${transitionClass}`;
        document.body.appendChild(transition);
        
        // Execute callback at transition midpoint (1 second in)
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
        
        // Remove transition element after animation completes
        setTimeout(() => {
            if (document.body.contains(transition)) {
                document.body.removeChild(transition);
            }
        }, 2000);
    }
}

// Initialize the tower game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TowerGame();
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
