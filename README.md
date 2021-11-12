# @collatty/chess

A complete chess board with implemented rules as a react component.

## Installation

`npm i @collatty/chess`

## Live demo

[Try it yourself](https://chess.collatty.com)

## Example usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Chess from '@collatty/chess';

const App = () => (
       <div
           style={{
               width: '80vw',
               height: '80vh',
               maxWidth: '80vh',
               maxHeight: '80vw',
           }}
       >
           <Chess/>
       </div>
   );

ReactDOM.render(<App></App>, document.getElementById('root'));

```

Note that the board should be wrapped in a square container. Future versions might support auto adjusting the board to be square regardless of the parent element's shape.

## Performing side effects

If you wish to perform side effects after moves etc, you can import `useBoardReducer`, initialize it and pass it as a prop. A use case could be if you wish to play against an AI and programmatically perform whatever move your AI decides to play, like shown in the example below.

```jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Chess, { useBoardReducer } from '@collatty/chess';

const App = () => {
   const [state, dispatch] = useBoardReducer();
   const [primaryPlayer] = useState('black')

   useEffect(() => {
       const makeAIMove = async () => {
           const move = await getMoveFromFancyAI(state.fenString)
           dispatch({type: 'move',  move})
       }
       if (state.boardState.playerToMove !== primaryPlayer) makeAIMove()

   }, [state.gameState.fenString, state.boardState.playerToMove]);

   return (
           <div
               style={{
                   width: '80vw',
                   height: '80vh',
                   maxWidth: '80vh',
                   maxHeight: '80vw',
               }}
           >
               <Chess
                   primaryPlayer={primaryPlayer}
                   autoQueen={true}
                   externalStateHandler={[state, dispatch]}
                   highlightLegalMoves={true}
               />
           </div>

   );
};

ReactDOM.render(<App></App>, document.getElementById('root'));

```

## Contributing

Feel free to raise issues regarding feature requests and bugs in the repo. I will be maintaining it for the forseeable future. PRs are also welcome.
