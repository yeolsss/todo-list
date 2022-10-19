import styled from 'styled-components';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { createBoardBoolean, todoState } from '../atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useForm } from 'react-hook-form';

const CreateBoardPopup = styled.div<{ isCreateBoolean: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
  transition: all 0.3s ease;
  height: ${(props) => (props.isCreateBoolean ? '100%' : '0%')};
  visibility: ${(props) => (props.isCreateBoolean ? 'visible' : 'hidden')};
`;

const CreateBoardCard = styled.div<{ isCreateBoolean: boolean }>`
  width: 500px;
  height: 250px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.boardColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 65px 0px;
  font-size: 40px;
  position: relative;
  height: ${(props) => (props.isCreateBoolean ? '250px' : '0%')};
  visibility: ${(props) => (props.isCreateBoolean ? 'visible' : 'hidden')};

  > form {
    width: 100%;
    text-align: center;
  }
  > form > input {
    all: unset;
    padding: 10px 0px;
    width: 70%;
    background-color: white;
    border-radius: 15px;
    font-size: 30px;
    padding: 5px 15px;
    box-sizing: border-box;
    text-align: left;
  }
  > button {
    all: unset;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
`;

interface IForm {
  board: string;
}

function CreateBoard() {
  const [isCreateBoolean, setIsCreateBoolean] =
    useRecoilState(createBoardBoolean);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const setCreateBoard = useSetRecoilState(todoState);

  const onCloseBtn = () => {
    setIsCreateBoolean(!isCreateBoolean);
  };

  const onValid = ({ board }: IForm) => {
    setCreateBoard((prev) => {
      return {
        ...prev,
        [`${board}`]: [],
      };
    });
    setIsCreateBoolean(!isCreateBoolean);
  };

  return (
    <CreateBoardPopup isCreateBoolean={isCreateBoolean}>
      <CreateBoardCard isCreateBoolean={isCreateBoolean}>
        <h2>보드 추가</h2>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register('board', { required: true })}
            type="text"
            placeholder="Add task on Board"
          />
        </form>
        <button onClick={onCloseBtn}>
          <AiOutlineCloseCircle />
        </button>
      </CreateBoardCard>
    </CreateBoardPopup>
  );
}

export default CreateBoard;
