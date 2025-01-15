//

class ShipFactory {
    
    // Create existing ships
    static createShip(size) {
        const shipDefinitions = {
            1: { type: "naval support", name: "Patrol Boat" },
            2: { type: "frigate", name: "Frigate" },
            3: { type: "destroyer", name: "Destroyer" },
            4: { type: "submarine", name: "Submarine" },
            5: { type: "battleship", name: "Battleship" },
            6: { type: "carrier", name: "Aircraft Carrier" }
        };

        if (!shipDefinitions[size]) {
            throw new Error(`Invalid ship size: ${size}. Supported sizes are 1 to 6.`);
        }

        const { type, name } = shipDefinitions[size];
        return new Ship(type, name, size);
    }

    // Create a custom ship
    createCustomShip(type, name, size, isAI = false) {
        if (size < 1) {
            throw new Error("Ship size must be at least 1.");
        }

        return new Ship(type, name, size, isAI);
    }
}