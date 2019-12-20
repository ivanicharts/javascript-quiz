import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { useQuestion } from 'features/question/question.store';
import { Page, Button, CancelButton } from 'components';

const getStatus = ({ userAnswerIndex, answerIndex }) => {
  if (isNil(userAnswerIndex)) return null;
  if (userAnswerIndex === answerIndex) return 'valid';
  return 'invalid';
}

export function Progress() {
  const [questionList] = useQuestion();
  // for dark theme https://dribbble.com/shots/7430090-Pagination , #293655
  return (
    <Page>
      <CardGroup>
        <Title>Progress</Title>
        <QuestionGroup>
          {questionList.map(question => (
            <Link key={question.id} to={{ pathname: `/questions/${question.id + 1}`}}>
              <Question status={getStatus(question)} >{question.id + 1}</Question>
            </Link>
          ))}
        </QuestionGroup>
        <Actions>
          <Link to="/">
            <CancelButton>cancel</CancelButton>
          </Link>
        </Actions>
      </CardGroup>
    </Page>
  );
}

const Actions = styled('section')`
  margin: 20px 0 0;
`;

const QuestionGroup = styled('div')`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
`;

const Question = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 0;
  /* @TODO refactor with styledMap */
  background: ${({ status }) => status === 'valid' ? '#65d68a' : status === 'invalid' ? '#dc5454' : '#E7ECF3'};
  color: ${({ status }) => status ? '#fff' : '#566588'};
`;

const CardGroup = styled('div')`
  padding: 0;
`;

const Title = styled('div')`
  font-weight: 700;
  font-size: 18px;
  margin: 0 0 15px 0;
`;
