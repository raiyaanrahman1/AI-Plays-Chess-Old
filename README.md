# AI-Plays-Chess
A chess web app made with React and includes an AI I designed myself

Not mobile friendly

Check it out here: https://raiyaanrahman1.github.io/AI-Plays-Chess/

## Current version: 0.7 - Dummy AI
By default, the gamemode is set to AI mode. This is a dumb AI, that simply makes a random legal move. The AI will still try to avoid checkmate, since if it's in check, it the only legal moves are to move the king, capture the piece putting it in check, or block the check.

Click the button labeled "Self-play" to make moves for both players. You can use this mode to play with yourself to practice, or take turns with a friend (on the same computer).

<!-- ### Notes
- My previous strategy for the AI was to calculate all possible positions up to a few moves in the future, and evaluate each position to find the best branch (or sequence of moves the AI should take), however I realized this would be impossible, as even after each player makes 5 moves, there are about 69 trillion different games that can arise (source: https://en.wikipedia.org/wiki/Shannon_number). Modern chess engines like Stockfish can check over 20 moves in the future, however it disregards many of the possible moves in each turn.

- My goal with this project is to design my own AI. Therefore I do not want to use an established chess engine, and I would like to come up with a somewhat original method, so I will also not copy the same method modern chess engines use. My current plan is to apply knowledge and skills I've gained in school to train a supervised machine learning model such as random forests (bagged decision trees) from a database of chess games. I would like to use a decently large dataset, and this is available to me thanks to the nonprofit, open-source chess app lichess. However, in order to deal with such large data and use the same tools I've used in school, I will need to create a python backend, and migrate significant parts of my code such as my calculateLegalMoves() function to python, as well as develop the training and testing procedure for the machine learning model. This unfortunately will take a lot of time, thought and energy, which is why I've released this dummy AI. -->

### Previous versions
- v0.5 - main chess game working, no AI option yet, only self-play
