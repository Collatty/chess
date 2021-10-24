import { initBoard } from './../Board';
import { createContext, Dispatch, useContext, useReducer } from 'react';

interface State {
    playerToMove: 'white' | 'black';
    board: JSX.Element[];
}
interface Tile extends Rank, File {}

export interface Rank {
    rank: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
}

export interface File {
    file: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
}

interface Action {
    type: 'move';
    payload: {
        fromTile: Tile;
        toTile: Tile;
    };
}

export const useBoardReducer = () =>
    useReducer(reducer, {
        playerToMove: 'white',
        board: initBoard(),
    });

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'move':
            return { ...state, board: [] };
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    { playerToMove: 'white', board: [] },
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
