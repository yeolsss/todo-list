import React, { useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSetRecoilState } from 'recoil';
import { todoState } from '../atom';
import { useForm } from 'react-hook-form';

interface IWrapperProps {
  isBoolean: boolean;
  isDragging: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.isDragging ? '#74b9ff' : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging
      ? '0px 2px 15px rgba(0, 0, 0, 0.1)'
      : !props.isBoolean
      ? '1px 1px 5px #44bd32, -1px -1px 5px #44bd32'
      : 'none'};
  transition: box-shadow 0.3s ease-in;
  border-radius: ${(props) => (props.isDragging ? '20px' : '5px')};

  margin-bottom: 5px;
  padding: 10px 10px;
  padding-right: 5px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  white-space: normal;
  word-break: break-word;
  width: 100%;
`;

const BtnContainer = styled.div<IWrapperProps>`
  margin-left: 5px;
  display: ${(props) => (props.isDragging ? 'none' : 'flex')};
  button {
    all: unset;
    width: 25px;
    height: 25px;
    text-align: center;
    cursor: pointer;

    > svg {
      color: #353b48;
    }
  }

  button:first-child {
    > svg {
      transition: color 0.3s ease-in-out;
      color: ${(props) => (props.isBoolean ? '#353b48' : '#44bd32')};
      &:hover {
        color: #44bd32;
      }
    }
  }
  button:last-child {
    > svg {
      transition: color 0.2s ease-in-out;
      &:hover {
        color: ${(props) => props.theme.delColor};
      }
    }
  }
`;

const Form = styled.form<{ isBoolean: boolean }>`
  display: ${(props) => (props.isBoolean ? 'none' : 'block')};
  > input {
    all: unset;
    cursor: text;
  }
`;

const ToDoSpan = styled.span<{ isBoolean: boolean }>`
  display: ${(props) => (props.isBoolean ? 'block' : 'none')};
`;
interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

interface IUpdateForm {
  toDo: string;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const { register, setValue, handleSubmit } = useForm<IUpdateForm>();
  const setToDos = useSetRecoilState(todoState);
  const [toDoCopy, setToDoCopy] = useState(toDoText);
  const [isBoolean, setIsBoolean] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  //react-hook-form에서 ref사용시 필수
  const { ref, ...rest } = register('toDo', { required: true });

  const onUpdate = () => {
    if (toDoCopy !== '') {
      setToDos((allTodos) => {
        const toDosCopy = [...allTodos[boardId]];
        const { id } = toDosCopy[index];
        const updateToDo = {
          text: toDoCopy,
          id,
        };
        toDosCopy.splice(index, 1);
        toDosCopy.splice(index, 0, updateToDo);
        const resultReturn = {
          ...allTodos,
          [boardId]: toDosCopy,
        };

        return resultReturn;
      });
      setIsBoolean(() => !isBoolean);
      setValue('toDo', toDoCopy);
    }
  };

  const onDelete = () => {
    setToDos((allTodos) => {
      const toDosCopy = [...allTodos[boardId]];
      toDosCopy.splice(index, 1);
      return {
        ...allTodos,
        [boardId]: toDosCopy,
      };
    });
  };

  const onInputDisplay = () => {
    if (!isBoolean) {
      setToDoCopy(toDoText);
    }
    setIsBoolean(() => !isBoolean);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };
  const onChangeText = (event: React.FormEvent<HTMLInputElement>) => {
    setToDoCopy(event.currentTarget.value);
  };
  return (
    <Draggable key={toDoId} draggableId={toDoId + ''} index={index}>
      {(magic, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          isBoolean={isBoolean}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          <Card>
            <ToDoSpan isBoolean={isBoolean}>{toDoCopy}</ToDoSpan>
            <Form isBoolean={isBoolean} onSubmit={handleSubmit(onUpdate)}>
              <input
                {...rest}
                value={toDoCopy}
                onChange={onChangeText}
                type="text"
                ref={(e) => {
                  ref(e);
                  inputRef.current = e;
                }}
              />
            </Form>
          </Card>
          <BtnContainer isDragging={snapshot.isDragging} isBoolean={isBoolean}>
            <button onClick={onInputDisplay}>
              <FontAwesomeIcon icon="edit" size="1x" />
            </button>
            <button onClick={onDelete}>
              <FontAwesomeIcon icon="trash" size="1x" />
            </button>
          </BtnContainer>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
