//

// Import the UUID library
const { v4: uuidv4 } = require('uuid');

/**
 * The board game is zero-based indexing!
 * 
 * This means that the first cell in the grid (top-left corner) has the 
 * coordinates (0,0) rather than (1,1).
 * 
 * On a 10x10 board, the last cell (bottom right corner) has the coordinates
 * (9,9) rather than (10,10).
 */
class GameBoard {
    constructor(width, height, ships = []) {
        this.id = uuidv4();

        // Initialize board dimensions
        this.width = width;
        this.height = height;

        // Create an empty board state (2D array)
        this.board = Array.from({ length: height }, () => Array(width).fill("unknown"));

        // Store ship details
        this.ships = ships.map(ship => ({
            ...ship,
            positions: ship.positions || [], // {row, col}
            hits: new Set() // Tracks hit positions
        }));
    }

    // Method to get the unique ID of the ship
    getId() {
        return this.id;
    }

    // Get the state of a specific cell
    getCellState(row, col) {
        return this.isValidCell(row, col) ? this.board[row][col] : null;
    }

    // Set the state of a specific cell
    setCellState(row, col, state) {
        if (this.isValidCell(row, col)) {
            this.board[row][col] = state;
        }
    }

    // Check if a cell is within board boundaries
    isValidCell(row, col) {
        return row >= 0 && row < this.height && col >= 0 && col < this.width;
    }

    // Check if a ship exists at a given cell
    getShipAtCell(row, col) {
        if (!this.isValidCell(row, col)) return null;
        return this.ships.find(ship => ship.positions.some(pos => pos.row === row && pos.col === col)) || null;
    }

    // Get the state of a ship at a given cell
    getShipStateAtCell(row, col) {
        const ship = this.getShipAtCell(row, col);
        if (!ship) return null;

        const isSunk = ship.positions.every(pos => ship.hits.has(`${pos.row},${pos.col}`));

        return isSunk ? "sunk" : "floating";
    }

    // Record a hit on a given cell
    fireAtCell(row, col) {
        const ship = this.getShipAtCell(row, col);

        if (ship) {
            const hitKey = `${row},${col}`;
            ship.hits.add(hitKey);
            this.setCellState(row, col, ship.positions.every(pos => ship.hits.has(`${pos.row},${pos.col}`)) ? "sunk" : "hit");
        } else {
            this.setCellState(row, col, "miss");
        }
    }

    // Get the board size
    getBoardSize() {
        return { width: this.width, height: this.height };
    }

    // Add a ship to the board
    addShip(ship) {
        this.ships.push({
            ...ship,
            hits: new Set() // Initialize the hit tracker
        });

        ship.positions.forEach(pos => {
            if (this.isValidCell(pos.row, pos.col)) {
                this.setCellState(pos.row, pos.col, "ship");
            }
        });
    }

    removeShip(ship) {
        const positions = ship.getPositions();
    
        // Iterate over each position the ship occupies and set that cell as empty
        positions.forEach(position => {
            const { row, col } = position;
            
            // Ensure the position is within bounds and mark the cell as empty
            if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
                this.board[row][col] = "unknown";
            }
        });
    
        // Optionally return a success message or updated board state
        return `Ship of type '${ship.getName()}' removed successfully.`;
    }

    /** 
     * This function accepts a cell position (x,y), and a ship length, and 
     * horizontal or vertical positioning.
     * 
     * Based on the cell positioning provided, a "corrected" ship positioning
     * array will be provided.
     * 
     * This function does NOT add any ship to the board!
     * 
     * Examples:
     * 
     *   Board size of 10x10 and ship length of 5...
     * 
     *   Position : 1,8 (horizontal)
     *   Output   : [{ row: 1, col: 5 }, { row: 1, col: 6 }, { row: 1, col: 7 }, { row: 1, col: 8 }, { row: 1, col: 9 }]
     * 
     *   Position : 5,5 (vertical)
     *   Output   : [{ row: 5, col: 5 }, { row: 6, col: 5 }, { row: 7, col: 5 }, { row: 8, col: 5 }, { row: 9, col: 5 }]
     * 
     *   Position : 8,5 (vertical)
     *   Output   : [{ row: 6, col: 5 }, { row: 7, col: 5 }, { row: 8, col: 5 }, { row: 9, col: 5 }, { row: 10, col: 5 }]
     * 
     * @see validateShipPlacement which would subsequently be called.
     * 
     * 
     */
    validateAndCorrectShipPosition(startRow, startCol, length, isHorizontal) {
        // Ensure the start position is within bounds
        if (startRow < 0 || startCol < 0 || startRow >= this.height || startCol >= this.width) {
            return null; // Position is outside the board
        }
    
        let positions = [];
        
        if (isHorizontal) {
            // Check if the ship fits horizontally
            if (startCol + length - 1 < this.width) {
                for (let i = 0; i < length; i++) {
                    positions.push({ row: startRow, col: startCol + i });
                }
                return positions; // Return the valid horizontal position array
            } else {
                // Adjust to the rightmost possible valid position
                const adjustedStartCol = this.width - length;
                for (let i = 0; i < length; i++) {
                    positions.push({ row: startRow, col: adjustedStartCol + i });
                }
                return positions; // Return the corrected horizontal position array
            }
        } else {
            // Check if the ship fits vertically
            if (startRow + length - 1 < this.height) {
                for (let i = 0; i < length; i++) {
                    positions.push({ row: startRow + i, col: startCol });
                }
                return positions; // Return the valid vertical position array
            } else {
                // Adjust to the bottommost possible valid position
                const adjustedStartRow = this.height - length;
                for (let i = 0; i < length; i++) {
                    positions.push({ row: adjustedStartRow + i, col: startCol });
                }
                return positions; // Return the corrected vertical position array
            }
        }
    
        // TODO: Not sure how this could return 'null'?

        return null; // If no valid position, return null
    }

    /**
     * This function will validate ship placement in order to avoid potential
     * collisions with existing ships already laid out on the board.
     * 
     * This function does NOT add any ship to the board!
     * 
     * If there are no ship collisions, 'null' will be returned. Otherwise, if 
     * there are any collisions with other ships, an array of such cell positions
     * will be returned.
     * 
     * @todo Should we add the actual ship causing the collision along with the
     *       position (x,y) coordinates?
     * 
     * @see validateAndCorrectShipPosition
     * 
     * @param {} newShipPositions an array of positions that 'collide' with other ships.
     */
    validateShipPlacement(newShipPositions) {
        // This will store all positions already occupied by ships on the board
        const occupiedPositions = [];
    
        // Loop through all existing ships on the board and add their positions to occupiedPositions
        this.ships.forEach(ship => {
            const shipPositions = ship.getPosition(); // Assume each ship has a method to get its current positions
            shipPositions.forEach(position => {
                occupiedPositions.push({ row: position.row, col: position.col });
            });
        });
    
        // Check if any of the new ship's positions overlap with already occupied positions
        const conflictingPositions = [];
    
        newShipPositions.forEach(position => {
            const { row, col } = position;
    
            // If the position is already occupied, add it to the list of conflicts
            if (occupiedPositions.some(occupied => occupied.row === row && occupied.col === col)) {
                conflictingPositions.push(position);
            }
        });
    
        // If there are conflicting positions, return them; otherwise, return null (no conflict)
        return conflictingPositions.length > 0 ? conflictingPositions : null;
    }

    // Compare if two ships are the same based on their unique IDs
    compare(gameBoard) {
        return this.id === gameBoard.getId();
    }    
}

//-------------------------------------------------------------------------------------------------

// Initialize a 10x8 game board

const board = new GameBoard(10, 8);

// Add a ship
board.addShip({
    type: "battleship",
    name: "Destroyer",
    size: 4,
    positions: [
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 }
    ]
});

console.log(board.getBoardSize()); // { width: 10, height: 8 }

// Fire at a cell

board.fireAtCell(2, 4);
console.log(board.getCellState(2, 4)); // "hit"
console.log(board.getShipStateAtCell(2, 4)); // "floating"

board.fireAtCell(2, 3);
board.fireAtCell(2, 5);
board.fireAtCell(2, 6);
console.log(board.getShipStateAtCell(2, 4)); // "sunk"

// Query a ship at a given cell

const ship = board.getShipAtCell(2, 4);
console.log(ship.name); // "Destroyer"

// Add another ship

board.addShip({
    type: "submarine",
    name: "Submarine",
    size: 3,
    positions: [
        { row: 5, col: 2 },
        { row: 6, col: 2 },
        { row: 7, col: 2 }
    ]
});

console.log(board.getCellState(5, 2)); // "ship"
