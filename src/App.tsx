import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { createBoardBoolean, createBoardDefault, todoState } from './atom';
import Board from './Components/Board';
import { BsClipboardPlus } from 'react-icons/bs';
import Trash from './Components/Trash';
import { useEffect } from 'react';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 0px 30px;
`;
const Boards = styled.div`
  display: flex;
  width: 80%;
  max-width: 1300px;
  gap: 30px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const AddBoardBtn = styled.button`
  all: unset;
  position: fixed;
  top: 100px;
  right: 50px;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @media all and (min-width: 1098px) and (max-width: 1634px) {
    right: 20px;
  }
  @media all and (min-width: 768px) and (max-width: 1097px) {
    right: 200px;
  }
  @media screen and (min-width: 480px) and (max-width: 767px) {
    right: 5px;
  }
  > svg {
    font-size: 60px;
    color: ${(props) => props.theme.btnDefaultColor};
    @media screen and (min-width: 480px) and (max-width: 767px) {
      font-size: 30px;
    }
  }
`;

function App() {
  const [isAddBoolean, setIsCreateBoolean] = useRecoilState(createBoardBoolean);

  // 앱이 실행했을때 Board가 있으면 Board 생성 화면부터 보여준다.
  useEffect(() => {
    if (Object.keys(toDos).length <= 0) {
      setIsCreateBoolean(!isAddBoolean);
    }
  }, []);

  const onCreateBoard = () => setIsCreateBoolean(!isAddBoolean);
  const [toDos, setToDos] = useRecoilState(todoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      // 같은 board에서 움직임
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // 다른 board로 이동
      if (destination.droppableId !== 'DelToDo') {
        setToDos((allBoards) => {
          const sourceBoardCopy = [...allBoards[source.droppableId]];
          const taskObj = sourceBoardCopy[source.index];
          const destinationBoardCopy = [...allBoards[destination.droppableId]];
          //삭제
          sourceBoardCopy.splice(source.index, 1);
          //추가
          destinationBoardCopy.splice(destination.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoardCopy,
            [destination.droppableId]: destinationBoardCopy,
          };
        });
      } else {
        setToDos((allBoards) => {
          const sourceBoardCopy = [...allBoards[source.droppableId]];
          sourceBoardCopy.splice(source.index, 1);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoardCopy,
          };
        });
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <AddBoardBtn onClick={onCreateBoard}>
          <BsClipboardPlus />
        </AddBoardBtn>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board toDos={toDos[boardId]} boardId={boardId} key={boardId} />
          ))}
        </Boards>
        <Trash />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
