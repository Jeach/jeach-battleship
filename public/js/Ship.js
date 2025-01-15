//

// Import the UUID library
const { v4: uuidv4 } = require('uuid');

class Ship {
    constructor(type, name, size, isAI = false) {
        this.id = uuidv4();
        this.type = type; // e.g., "naval support", "carrier"
        this.name = name; // e.g., "Patrol Boat", "Jet Carrier"
        this.size = size; // Size of the ship (1x1 to 1x6)
        this.positions = []; // Array of positions
        this.hits = new Set(); // Tracks hits on this ship
        this.isAI = isAI; // Boolean to indicate if the ship is controlled by AI
    }

    // Method to get the unique ID of the ship
    getId() {
        return this.id;
    }

    // Getter for type
    getType() {
        return this.type;
    }

    // Getter for name
    getName() {
        return this.name;
    }

    // Getter for size
    getSize() {
        return this.size;
    }

    // Set the positions of the ship
    setPositions(positions) {
        if (positions.length !== this.size) {
            throw new Error(`Invalid number of positions. Expected ${this.size}, got ${positions.length}`);
        }
        this.positions = positions;
    }

    // Get the positions of the ship
    getPositions() {
        return this.positions;
    }

    // Determine if the ship is floating or sunk
    getState() {
        return this.hits.size === this.size ? "sunk" : "floating";
    }

    // Method to check if the ship is sunk
    isSunk() {
        return this.getState() === "sunk";
    }

    
    // Method to check if the ship is sunk
    isSunk() {
        return this.getState() === "floating";
    }

    // Record a hit on the ship
    hit(position) {
        const positionKey = `${position.row},${position.col}`;
        const isHitValid = this.positions.some(pos => pos.row === position.row && pos.col === position.col);

        if (!isHitValid) {
            throw new Error(`Position {row: ${position.row}, col: ${position.col}} is not part of this ship.`);
        }

        this.hits.add(positionKey); // Record the hit
    }

    isSingleCell() {
        return this.positions.length === 1;
    }

    // Determine if the ship is positioned horizontally or vertically
    isHorizontal() {
        if (this.positions.length < 2) {
            // A single-cell ship is neither horizontal nor vertical, so return null
            return null;
        }

        // Check if all positions have the same row
        const firstRow = this.positions[0].row;
        return this.positions.every(pos => pos.row === firstRow);
    }

    isVertical() {
        if (this.positions.length < 2) {
            // A single-cell ship is neither horizontal nor vertical, so return null
            return null;
        }

        // Check if all positions have the same column
        const firstCol = this.positions[0].col;
        return this.positions.every(pos => pos.col === firstCol);
    }

    isDiagonal() {
        if (this.positions.length < 2) {
            // A single-cell ship cannot be diagonal, so return false
            return false;
        }
    
        // Calculate the row and column differences between the first two positions
        const rowDiff = this.positions[1].row - this.positions[0].row;
        const colDiff = this.positions[1].col - this.positions[0].col;
    
        // For a ship to be diagonal, the absolute row and column differences must be equal
        return this.positions.every((pos, index, arr) => {
            if (index === 0) return true; // Skip the first position
            const currentRowDiff = pos.row - arr[index - 1].row;
            const currentColDiff = pos.col - arr[index - 1].col;
            return Math.abs(currentRowDiff) === Math.abs(currentColDiff) &&
                   currentRowDiff === rowDiff &&
                   currentColDiff === colDiff;
        });
    }

    // Compare if two ships are the same based on their unique IDs
    compare(ship) {
        return this.id === ship.getId();
    }
}


//--------------------------------------------------------------------------------------------

// Create a ship

const battleship = new Ship("battleship", "Destroyer", 4);
console.log(battleship.getType()); // "battleship"
console.log(battleship.getName()); // "Destroyer"
console.log(battleship.getSize()); // 4

// Set position for the ship

battleship.setPositions([
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 2, col: 5 },
    { row: 2, col: 6 }
]);

console.log(battleship.getPositions());
/*
[
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 2, col: 5 },
    { row: 2, col: 6 }
]
*/

// Fire at the ship

battleship.hit({ row: 2, col: 4 }); // Hit at position {row: 2, col: 4}
console.log(battleship.getState()); // "floating"

battleship.hit({ row: 2, col: 3 });
battleship.hit({ row: 2, col: 5 });
battleship.hit({ row: 2, col: 6 });
console.log(battleship.getState()); // "sunk"

// Invalid hit

try {
    battleship.hit({ row: 3, col: 3 }); // Not a valid position for the ship
} catch (error) {
    console.error(error.message);
    // "Position {row: 3, col: 3} is not part of this ship."
}

// Determine if horizontally or vertically positioned

const ship1 = new Ship("carrier", "Jet Carrier", 5);
ship.setPositions([
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 4 },
    { row: 3, col: 5 },
]);

console.log(ship1.isHorizontal()); // true
console.log(ship1.isVertical());   // false


// Is diagonally positioned?

const ship2 = new Ship("destroyer", "Diagonal Ship", 3);
ship.setPositions([
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 },
]);

console.log(ship2.isDiagonal()); // true

// If it is neither horizontal, vertical or diagonal

const ship3 = new Ship("scout", "Single Cell Vessel", 1);
ship.setPositions([{ row: 5, col: 5 }]);

console.log(ship2.isSingleCell()); // true
