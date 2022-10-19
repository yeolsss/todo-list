import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { IoTrashBinOutline, IoTrashBinSharp } from 'react-icons/io5';
import styled from 'styled-components';

interface ITrashProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const TrashWrapper = styled.div`
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 100px;
  right: 50px;
  @media all and (min-width: 1098px) and (max-width: 1634px) {
    right: 20px;
  }
  @media all and (min-width: 768px) and (max-width: 1097px) {
    right: 200px;
  }
  @media screen and (min-width: 480px) and (max-width: 767px) {
    right: 5px;
  }
`;
const TrashBoard = styled.div<ITrashProps>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    font-size: 60px;
    color: ${(props) => props.theme.btnDefaultColor};
    @media screen and (min-width: 480px) and (max-width: 767px) {
      right: 10px;
      font-size: 30px;
    }
  }
  > svg:first-child {
    display: ${(props) =>
      props.isDraggingOver
        ? 'none'
        : props.isDraggingFromThis
        ? 'none'
        : 'block'};
  }
  > svg:last-child {
    display: ${(props) =>
      props.isDraggingOver
        ? 'block'
        : props.isDraggingFromThis
        ? 'block'
        : 'none'};
    scale: 1.5;
    color: ${(props) => props.theme.delColor};
  }
`;

function Trash() {
  return (
    <TrashWrapper>
      <Droppable droppableId="DelToDo">
        {(magic, snapshot) => (
          <TrashBoard
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            <IoTrashBinOutline />
            <IoTrashBinSharp />
          </TrashBoard>
        )}
      </Droppable>
    </TrashWrapper>
  );
}

export default React.memo(Trash);
