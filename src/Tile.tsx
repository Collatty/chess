import React, { useState } from 'react';
import { useDrop } from 'react-dnd';

import { TileProps, MovingPieceProps } from './types';
import './style.css';
import BlackPawn from './pieces/BlackPawn';
import WhitePawn from './pieces/WhitePawn';
import { useBoard } from './state/useBoardReducer';
import { PromotionMenu } from './PromotionMenu';
import { DraggablePiece, pieceSwitch } from './DraggablePiece';

export const Tile = ({
    piece,
    backgroundColor,
    index,
    autoQueen,
    highlightLegalMoves,
    primaryPlayer,
}: TileProps) => {
    const [fullState, dispatch] = useBoard();
    const [menu, setMenu] = useState<JSX.Element | null>(null);
    const { boardState: state } = fullState;

    const handleMoveToTile = (item: MovingPieceProps) => {
        if (
            item.piece[1] === 'p' &&
            ([0, 1, 2, 3, 4, 5, 6, 7].includes(index) ||
                [63, 62, 61, 60, 59, 58, 57, 56].includes(index))
        ) {
            if (autoQueen) {
                dispatch({
                    type: 'move',
                    payload: {
                        piece: item.piece[0] + 'q',
                        fromTileIndex: item.fromIndex,
                        toTileIndex: index,
                    },
                });
            } else {
                dispatch({
                    type: 'clearTile',
                    payload: {
                        piece: '',
                        fromTileIndex: item.fromIndex,
                        toTileIndex: -1,
                    },
                });
                const menu = (
                    <PromotionMenu
                        color={item.piece[0]}
                        selectedPiece={(piece: string) => {
                            dispatch({
                                type: 'move',
                                payload: {
                                    piece: item.piece[0] + piece,
                                    fromTileIndex: item.fromIndex,
                                    toTileIndex: index,
                                },
                            });
                            setMenu(null);
                        }}
                    ></PromotionMenu>
                );
                setMenu(menu);
            }
        } else {
            dispatch({
                type: 'move',
                payload: {
                    piece: item.piece,
                    fromTileIndex: item.fromIndex,
                    toTileIndex: index,
                },
            });
        }
    };

    const [, drop] = useDrop(
        () => ({
            accept: 'PIECE',
            drop: (item: MovingPieceProps) => handleMoveToTile(item),
            canDrop: () => state.legalMoves.includes(index),
        }),
        [state],
    );

    console.log('Test linter');

    return (
        <div
            className={`tile ${backgroundColor}`}
            ref={drop}
            role={'Tile'}
            onClick={() => {
                state.legalMoves.includes(index)
                    ? handleMoveToTile({
                          piece: state.board[state.selectedPieceTileIndex],
                          fromIndex: state.selectedPieceTileIndex,
                      })
                    : dispatch({ type: 'unselectPiece', payload: null });
            }}
        >
            {menu}
            {menu ? (
                <div style={{ opacity: 0.3 }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].includes(index) ? (
                        <BlackPawn></BlackPawn>
                    ) : (
                        <WhitePawn></WhitePawn>
                    )}
                </div>
            ) : fullState.rewindIndex === -1 ? (
                piece &&
                piece[0] === primaryPlayer[0] &&
                !fullState.gameState.isGameOver ? (
                    <DraggablePiece piece={piece} fromIndex={index} />
                ) : (
                    pieceSwitch(piece)
                )
            ) : (
                pieceSwitch(piece)
            )}
            {highlightLegalMoves && state.legalMoves.includes(index) && (
                <div className="legal-move"></div>
            )}
        </div>
    );
};
