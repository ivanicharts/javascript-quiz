import styled from 'styled-components';

export const Button = styled('button')`
  border: 0;
  outline: 0;
  background: #E7ECF3;
  color: #566588;
  padding: 10px 30px;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  text-transform: capitalize;
  transition: .2s background;

  &:hover {
    background: #b8c4d6;
  }
`;


export const CancelButton = styled(Button)`
  color: #fff;
  background: #DC5454;

  &:hover {
    background: #b94141;
  }
`;
