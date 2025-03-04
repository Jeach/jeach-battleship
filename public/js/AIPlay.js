// Sample Board State Legend:
//
//  'unknown' - Cell has not been fired at
//  'miss'    - Cell was fired at but no ship is present
//  'hit'     - Cell was fired at and a ship was hit
//  'sunk'    - Ship at this cell has been sunk

function simulateAITurn(aiPlayer, boardState, playerShips) {
    // Determine the AI's next move
    let nextMove;
    if (aiPlayer.personality === "aggressive") {
        // Aggressive AI prefers targeting adjacent hits
        nextMove = aiPlayer.findAdjacentHit(boardState) || aiPlayer.highProbabilityMove(boardState);
    } else if (aiPlayer.personality === "cautious") {
        // Cautious AI sticks to high-probability moves or wild shots
        nextMove = aiPlayer.highProbabilityMove(boardState);
    } else if (aiPlayer.personality === "random") {
        // Random AI makes completely random moves
        nextMove = aiPlayer.takeWildShot();
    }

    // If no valid moves are left, return (game over or board full)
    if (!nextMove) {
        console.log("AI has no valid moves left.");
        return;
    }

    const { row, col } = nextMove;

    // Simulate firing at the chosen cell
    const cellStatus = boardState[row][col];
    if (cellStatus === "unknown") {
        if (playerShips[row][col]) {
            // Hit a ship
            boardState[row][col] = "hit";
            aiPlayer.updateHeatmapAfterHit(row, col, boardState);
            console.log(`AI fired at (${row}, ${col}) and hit a ship!`);
        } else {
            // Missed
            boardState[row][col] = "miss";
            aiPlayer.updateHeatmapAfterMiss(row, col);
            console.log(`AI fired at (${row}, ${col}) and missed.`);
        }
    } else {
        console.log(`AI tried to fire at (${row}, ${col}), but it was already fired at.`);
    }

    // Optional: Check if a ship has been sunk
    checkAndHandleSunkShips(boardState, playerShips);
}

function checkAndHandleSunkShips(boardState, playerShips) {
    // Logic to mark ships as sunk if all cells are hit
    for (const ship of playerShips) {
        const isSunk = ship.positions.every(pos => boardState[pos.row][pos.col] === "hit");
        if (isSunk && !ship.sunk) {
            ship.sunk = true;
            ship.positions.forEach(pos => {
                boardState[pos.row][pos.col] = "sunk";
            });
            console.log(`AI has sunk the ship: ${ship.name}`);
        }
    }
}

// Example Usage
const boardState = Array(10).fill().map(() => Array(10).fill("unknown"));

const playerShips = [
    { name: "Battleship", positions: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sunk: false },
    { name: "Cruiser", positions: [{ row: 5, col: 5 }, { row: 5, col: 6 }, { row: 5, col: 7 }], sunk: false },
];

const aiPlayer = new AIPlayer("aggressive"); // AI Personality: aggressive

// Simulate a turn
simulateAITurn(aiPlayer, boardState, playerShips);
