# Jeach Battleship

## Introduction

This game is intended to be a simple multi-player battleship game which can also be played against the computer.

Both my sons, at the early age of 4 and 5, loved the game of battleship. But lacking the capability and understanding of the coordinate system (ie: A3, B7, etc.), it was almost impossible for them to play. This game is intended to solve this problem.

## Timeline

Created project on December 30th, 2024, and will be committing periodically until a core game has been created. Intend to add features with time.

Current priority is to get something up as quickly as possible. Once we have a working version, refactoring will be required to clean things up.

## Project License and Copyright

This project is licensed under the **MIT License** and is **Copyright (C) 2024 Christian Jean**. All rights reserved under copyright law, except as provided by the MIT License.

### Essence of the MIT License

The MIT License is a permissive open-source software license that is simple and
developer-friendly. Its essence lies in granting users broad freedoms while
imposing minimal obligations.

Below is an overview of the rights and obligations associated with the
MIT License:

1. **Rights Granted by the MIT License**

   a) **Freedom to Use** - You can use the licensed software for any purpose,
   including commercial, educational, or private use.

   b) **Freedom to Copy** - You are allowed to copy and redistribute the
   software in its original form or modified versions.

   c) **Freedom to Modify** - You can alter the software to suit your needs, fix
   bugs, or enhance its functionality.

   d) **Freedom to Distribute** - You can distribute the original or modified
   versions of the software, either free of charge or for a fee.

2. **Obligations Under the MIT License**

   a) **Include the License** - You must include a copy of the original License
   text (the `LICENSE` file) in any distributed copy of the software, whether
   original or modified.

   b) **Maintain Copyright Notice** - The copyright notice of the original
   author(s) must remain intact in the source code or any distribution of the
   software.

   c) **No Warranty** - The license explicitly states that the software is
   provided "_as-is_" without any warranty, and the authors are not liable for
   any damages that may arise from using the software.

3. **Key Features of the MIT License**

   a) **Minimal Restrictions** - Unlike more restrictive licenses (ie: GPL), the
   MIT License does not require derivative works or modifications to be
   licensed under the same terms.

   b) **Flexibility** - It allows for integration into proprietary projects, making
   it widely used in both open-source and commercial software development.

## Music Rights

All audio tracks and instrumentals are provided royalty-free and are free to use. We extend our gratitude to the following providers:

1. [Pixabay](https://pixabay.com/music/search/intense/?pagi=5&theme=background+music) - 35 audio tracks being used.
2. [Chosic](https://www.chosic.com/free-music/energetic/) - 0 audio tracks being used.

**Upcoming** - A comprehensive list of media files utilized will soon be made available to acknowledge and promote their creators individually, including providing direct links to the corresponding digital assets.

## Game Play

### Minimal Grid Size Configuration

#### Suggested Size: 6x6

#### Why?

1. Quick Gameplay: A smaller grid allows for faster games, ideal for casual players or those with limited time.
2. Increased Engagement: Players have less area to scan, increasing the likelihood of early hits, which keeps the game dynamic.
3. Simplified Strategy: With fewer cells, players can focus more on attacking rather than extensive searching, making it beginner-friendly.
4. Appropriate for Fewer Ships: Works well if the number of ships and their sizes are reduced (e.g., 1 ship of size 3, 2 ships of size 2).

### Maximum Grid Size Configuration

#### Suggested Size: 16x16

#### Why?

1. Strategic Depth: A larger grid creates more room for strategic placement and searching, appealing to experienced players.
2. Longer Gameplay: The game takes longer to complete, suitable for dedicated sessions.
3. Accommodates More Ships: Supports a higher number of ships or larger ships (e.g., aircraft carriers, battleships, submarines).
4. Enhanced Stealth: The larger area reduces the likelihood of random hits, requiring players to use more deductive reasoning.


| Grid Size | Type of Gameplay     | Ideal For                          | Ship Configuration Example | Total Ships |
|-----------|----------------------|------------------------------------|----------------------------|-------------|
| 6x6       | Quick, Casual        | Beginners, Limited Time            | 1x3, 2x2, 3x1              | 3           |
| 10x10     | Standard             | Most Players                       | 1x5, 2x4, 3x3, 4x2, 5x1    | 5           |
| 16x16     | Extended, Tactical   | Experienced Players, Long Sessions | 1x6, 2x5, 3x4, 4x3, 5x2    |5            |


### Types of Ships and Submarines

| Size | Ship Name      | Description |
|------|----------------|-------------|
| 1    | Patrol Boat    | A Patrol Boat is a small, fast vessel typically used for coastal defense, reconnaissance, and policing waters. They are agile and often armed with small-caliber weapons for defense against small targets such as pirate vessels or intruding ships. |
| 2    | Frigate        | A Frigate is a medium-sized warship designed for escort and protection duties, including anti-submarine warfare, air defense, and surface warfare. Frigates are more heavily armed than patrol boats, with advanced radar and weaponry, and are often used in naval task forces. |
| 3    | Destroyer      | A Destroyer is a fast and heavily armed warship used for a variety of roles, including escorting larger ships, anti-aircraft defense, and anti-submarine operations. They are often equipped with guided missiles, advanced radar systems, and torpedoes, making them versatile in modern naval combat. |
| 4    | Submarine      | A Submarine is a highly specialized vessel designed for stealth and underwater operations. Submarines can be nuclear or diesel-powered and are capable of launching torpedoes or missiles. They are primarily used for stealthy reconnaissance, attack missions, and nuclear deterrence. |
| 5    | Battleship     | A Battleship is a large, heavily armored warship equipped with massive guns capable of long-range bombardment. Though battleships were the backbone of naval power in the early to mid-20th century, they have largely been replaced by missile ships and aircraft carriers. Their primary role was in naval warfare, providing firepower and defense for fleets. |
| 6    | Aircraft Carrier | An Aircraft Carrier is a massive carrier that serves as a mobile base for jet fighter aircraft. These ships are capable of launching, recovering, and storing multiple aircraft, making them central to modern naval operations. Jet carriers project air power over vast distances and are often the centerpiece of naval fleets.