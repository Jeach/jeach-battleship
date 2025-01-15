/**
 * Recommendations for Balance:
 * 
 * 1. Randomness vs. Strategy:
 * 
 *  - Use weighted randomness to decide moves:
 * 
 *      - On a miss: Randomly select the next target within a specific range.
 *      - On a hit: Focus on adjacent cells (hunt mode).
 * 
 *  - Avoid rigid patterns that are easy to predict (e.g., firing only in rows or columns).
 * 
 * 2. Skill Scaling by Difficulty:
 * 
 *  - Beginner AI: Fires completely randomly, except when following up on a hit.
 *  - Intermediate AI: Uses heuristics like targeting edges first or prioritizing high-probability zones (e.g., avoiding areas too close to other hits).
 *  - Expert AI: Simulates human-like logic:
 * 
 *      - Tracks probability maps (e.g., areas most likely to contain ships based on remaining space).
 *      - Uses strategic placement of its own ships to maximize survivability.
 * 
 * 3. AI Mistakes:
 * 
 *  - Add deliberate errors to make AI seem more human, especially at lower difficulties:
 * 
 *      - Occasionally misses an obvious follow-up target.
 *      - Misjudges probability and fires at less likely locations.
 * 
 * 
 * Examples of AI Personalities:
 * 
 * Personality	    Behavior
 * ---------------------------------------------------------------------------------------------------
 * Aggressive	    Focuses heavily on finishing ships it hits, rarely firing elsewhere.
 * Cautious	        Spends extra moves "probing" random areas before committing to hunting a hit.
 * Balanced	        Combines hunting and probing strategies with a moderate level of precision.
 * Risk-Taker	    Targets high-probability zones but takes random shots across the board to find ships.
 * Defensive	    Places ships in unconventional patterns to avoid easy hits.
 * Reckless	        Fires rapidly without much strategy, often ignoring efficient hunting methods.
 * Analytical	    Tracks a heatmap of high-probability zones and adjusts strategy based on hits and misses.
 * ---------------------------------------------------------------------------------------------------
 */

class AIPlayer {
    constructor(personality) {
        this.personality = personality;
        this.heatmap = this.initializeHeatmap(); // Tracks probability of ship presence
    }

    makeMove(boardState) {
        switch (this.personality) {
            case "Aggressive":
                return this.aggressiveMove(boardState);
            case "Cautious":
                return this.cautiousMove(boardState);
            case "Balanced":
                return this.balancedMove(boardState);
            case "Risk-Taker":
                return this.riskTakerMove(boardState);
            case "Analytical":
                return this.analyticalMove(boardState);
            default:
                return this.randomMove(boardState);
        }
    }

    //---------------------------------------------------------------------------------------------------
    // Implemented personalities...
    //---------------------------------------------------------------------------------------------------

    aggressiveMove(boardState) {
        // Focus on finishing any partially sunk ships
        let target = this.findAdjacentHit(boardState);
        return target ? target : this.randomMove(boardState);
    }

    cautiousMove(boardState) {
        // Probe new areas before committing
        if (Math.random() < 0.5) {
            return this.randomMove(boardState);
        }
        return this.findAdjacentHit(boardState);
    }

    balancedMove(boardState) {
        // Mix aggressive and cautious strategies
        return Math.random() < 0.7 
            ? this.findAdjacentHit(boardState) 
            : this.randomMove(boardState);
    }

    riskTakerMove(boardState) {
        // Focus on high-probability zones but take occasional wild shots
        if (Math.random() < 0.3) {
            return this.takeWildShot();
        }
        return this.highProbabilityMove(boardState);
    }

    analyticalMove(boardState) {
        // Use a heatmap to target areas most likely to contain ships
        return this.highProbabilityMove(boardState);
    }

    randomMove(boardState) {
        // Completely random move
        return this.chooseRandomUnfiredCell(boardState);
    }

    //---------------------------------------------------------------------------------------------------
    // Utility functions...
    //---------------------------------------------------------------------------------------------------

    initializeHeatmap() {
        // Initialize a heatmap with default probability values for each cell
        const heatmap = [];
        
        for (let row = 0; row < 10; row++) {
            const rowArray = new Array(10).fill(1); // Default probability is 1
            heatmap.push(rowArray);
        }

        return heatmap;
    }

    findAdjacentHit(boardState) {
        // Find a cell adjacent to a hit that hasn't been fired at yet
        for (let row = 0; row < boardState.length; row++) {
            for (let col = 0; col < boardState[row].length; col++) {
                if (boardState[row][col] === "hit") {
                    const neighbors = this.getValidNeighbors(row, col, boardState);
                    for (const neighbor of neighbors) {
                        if (boardState[neighbor.row][neighbor.col] === "unknown") {
                            return { row: neighbor.row, col: neighbor.col };
                        }
                    }
                }
            }
        }

        return null; // No adjacent hits found
    }

    highProbabilityMove(boardState) {
        // Choose the cell with the highest probability from the heatmap
        let bestMove = null;
        let highestProbability = -1;

        for (let row = 0; row < this.heatmap.length; row++) {
            for (let col = 0; col < this.heatmap[row].length; col++) {
                if (boardState[row][col] === "unknown" && this.heatmap[row][col] > highestProbability) {
                    highestProbability = this.heatmap[row][col];
                    bestMove = { row, col };
                }
            }
        }

        return bestMove || this.chooseRandomUnfiredCell(boardState); // Fallback to random if no high-probability cell
    }

    takeWildShot() {
        // Choose a completely random cell, ignoring heatmap and logic
        const row = Math.floor(Math.random() * this.heatmap.length);
        const col = Math.floor(Math.random() * this.heatmap[0].length);
        return { row, col };
    }

    chooseRandomUnfiredCell(boardState) {
        // Randomly choose a cell that hasn't been fired at yet
        const availableCells = [];
        for (let row = 0; row < boardState.length; row++) {
            for (let col = 0; col < boardState[row].length; col++) {
                if (boardState[row][col] === "unknown") {
                    availableCells.push({ row, col });
                }
            }
        }

        if (availableCells.length === 0) return null; // No valid cells left

        const randomIndex = Math.floor(Math.random() * availableCells.length);

        return availableCells[randomIndex];
    }

    getValidNeighbors(row, col, boardState) {
        // Get valid neighboring cells (up, down, left, right) for a given cell
        const neighbors = [];

        const directions = [
            { row: -1, col: 0 }, // Up
            { row: 1, col: 0 },  // Down
            { row: 0, col: -1 }, // Left
            { row: 0, col: 1 },  // Right
        ];

        for (const direction of directions) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;
            if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[0].length &&
                boardState[newRow][newCol] === "unknown"
            ) {
                neighbors.push({ row: newRow, col: newCol });
            }
        }

        return neighbors;
    }

    updateHeatmapAfterHit(row, col, boardState) {
        // Increase probabilities around a hit on the heatmap
        const neighbors = this.getValidNeighbors(row, col, boardState);
        for (const neighbor of neighbors) {
            this.heatmap[neighbor.row][neighbor.col] += 2; // Increase probability for surrounding cells
        }
    }

    updateHeatmapAfterMiss(row, col) {
        // Decrease the probability of the missed cell
        this.heatmap[row][col] = 0; // Missed cells are no longer probable
    }
}
