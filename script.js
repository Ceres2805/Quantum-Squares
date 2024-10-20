const blocks = Array.from({ length: 25 }, () => ({ player1: 0, player2: 0 }));
const scores = { player1: 0, player2: 0 };
let currentPlayer = 1; // Player 1 starts first

const blockList = document.querySelector('.block-list');
const scorePlayer1 = document.getElementById('scorePlayer1');
const scorePlayer2 = document.getElementById('scorePlayer2');
const turnIndicator = document.getElementById('turnIndicator');

// Load sound
const moveSound = new Audio('move-sound.mp3'); // Ensure this path is correct

// Function to create block display
function updateBlockDisplay(index) {
    const blockDiv = document.createElement('div');
    blockDiv.className = 'block';

    // Determine number of pieces for both players
    const player1Pieces = blocks[index].player1;
    const player2Pieces = blocks[index].player2;

    // Clear previous content
    blockDiv.innerHTML = '';

    // Add circles for Player 1 (red)
    for (let i = 0; i < player1Pieces; i++) {
        const circle = document.createElement('span');
        circle.className = 'piece red';
        blockDiv.appendChild(circle);
    }

    // Add circles for Player 2 (green)
    for (let i = 0; i < player2Pieces; i++) {
        const circle = document.createElement('span');
        circle.className = 'piece green';
        blockDiv.appendChild(circle);
    }

    blockDiv.onclick = () => handleBlockClick(index);
    return blockDiv;
}

// Initialize blocks
blocks.forEach((_, index) => {
    blockList.appendChild(updateBlockDisplay(index));
});

// Handle block click
function handleBlockClick(index) {
    const playerKey = currentPlayer === 1 ? 'player1' : 'player2';
    const otherPlayerKey = currentPlayer === 1 ? 'player2' : 'player1';

    // Check if the block is occupied by the other player
    if (blocks[index][playerKey] === 0 && blocks[index][otherPlayerKey] > 0) {
        alert("Cannot add pieces to an occupied block!");
        return; // Exit if the block is occupied by the other player
    }

    // Increment the piece count for the current player
    blocks[index][playerKey]++;
    
    // Play sound for a legal move
    playMoveSound();

    // Check for blasting immediately after incrementing
    checkForBlast(index, playerKey);

    // Update the display
    updateDisplay();

    // Check for a winner after all blasting events
    setTimeout(() => checkForWinner(), 0); // Ensure winner check happens after all events

    // Switch players after updating the display
    switchPlayer();
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnIndicator.innerText = `Player ${currentPlayer}'s turn`; // Update turn display
}

// Play the move sound
function playMoveSound() {
    const sound = moveSound.cloneNode(); // Create a new instance
    sound.play();
}

// Check for blasting
function checkForBlast(index, player) {
    // If the player's pieces reach 4, initiate blasting
    if (blocks[index][player] === 4) {
        scores[player]++; // Increase score for the current player
        blastAdjacent(index, player);
        blocks[index][player] = 0; // Reset the current block pieces
    }
}

// Blast pieces to adjacent blocks
function blastAdjacent(index, player) {
    const adjacentIndices = [
        index - 5, // Above
        index + 5, // Below
        index - 1, // Left
        index + 1  // Right
    ];

    adjacentIndices.forEach(adjIndex => {
        if (adjIndex >= 0 && adjIndex < blocks.length) {
            const otherPlayer = player === 'player1' ? 'player2' : 'player1';
            
            // Only proceed if the adjacent block is not already at maximum capacity
            if (blocks[adjIndex][player] < 4) {
                // If the adjacent block is empty, add a piece for the current player
                if (blocks[adjIndex][otherPlayer] === 0) {
                    blocks[adjIndex][player]++;
                } else {
                    // If the block is occupied by the other player, they gain a piece
                    blocks[adjIndex][otherPlayer]++;
                }
            }

            // Check for a blast in the adjacent block
            checkForBlast(adjIndex, player);
            checkForBlast(adjIndex, otherPlayer);
        }
    });
}

// Check for a winner
function checkForWinner() {
    if (scores.player1 >= 10) {
        alert("Player 1 wins!");
        resetGame();
    } else if (scores.player2 >= 10) {
        alert("Player 2 wins!");
        resetGame();
    }
}

// Reset game state
function resetGame() {
    blocks.forEach(block => {
        block.player1 = 0;
        block.player2 = 0;
    });
    scores.player1 = 0;
    scores.player2 = 0;
    currentPlayer = 1;
    updateDisplay();
    turnIndicator.innerText = `Player ${currentPlayer}'s turn`;
}

// Update the display
function updateDisplay() {
    blockList.innerHTML = '';
    blocks.forEach((_, index) => {
        blockList.appendChild(updateBlockDisplay(index));
    });

    scorePlayer1.innerText = `Player 1 Score: ${scores.player1}`;
    scorePlayer2.innerText = `Player 2 Score: ${scores.player2}`;
}

// Initial display update
updateDisplay();
turnIndicator.innerText = `Player ${currentPlayer}'s turn`; // Set initial turn display
