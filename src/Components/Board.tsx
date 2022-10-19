import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodo, todoState } from '../atom';
import DraggableCard from './DraggableCard';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Wrapper = styled.div`
  width: 400px;
  padding-top: 20px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? '#dfe6e9'
      : props.isDraggingFromThis
      ? '#b2bec3'
      : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  padding: 10px 10px;
`;

const Input = styled.input`
  all: unset;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  padding: 15px 10px;
  border-radius: 10px;
`;
const DelBoardBtn = styled.button`
  all: unset;
  width: 30px;
  height: 30px;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.delColor};
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  /* const inputRef = useRef<HTMLInputElement>(null);
  const onClick = () => {
    inputRef.current?.focus();
    setTimeout(() => {
      inputRef.current?.blur();
    }, 5000);
  }; */

  const { register, setValue, handleSubmit } = useForm<IForm>();
  const setToDos = useSetRecoilState(todoState);
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newTodo, ...allBoards[boardId]],
      };
    });
    setValue('toDo', '');
  };

  const onDelBoard = () => {
    setToDos((allBoards) => {
      const boardsCopy = { ...allBoards };
      delete boardsCopy[boardId];
      return {
        ...boardsCopy,
      };
    });
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <DelBoardBtn onClick={onDelBoard}>
        <AiOutlineCloseCircle />
      </DelBoardBtn>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register('toDo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
