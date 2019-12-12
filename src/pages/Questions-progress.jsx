import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { useQuestion } from '../modules/question/question.store';
import { Page, Button } from '../components';

const getStatus = ({ userAnswerIndex, answerIndex }) => {
  if (isNil(userAnswerIndex)) return null;
  if (userAnswerIndex === answerIndex) return 'valid';
  return 'invalid';
}

export function QuestionsProgress() {
  const [questionList] = useQuestion();
  console.log('qe', questionList);
  // #293655
  // for dark theme https://dribbble.com/shots/7430090-Pagination
  return (
    // <PageGroup>
      // <PageTitle>List of (Advanced) JavaScript Questions</PageTitle>
      <Page>
        <CardGroup>
          <Title>Quizz Progress</Title>
          <QuestionGroup>
            {questionList.map(question => (
              <Link to={{ pathname: `/questions/${question.id + 1}`}}>
                <Question status={getStatus(question)} >{question.id + 1}</Question>
              </Link>
            ))}
          </QuestionGroup>
        </CardGroup>
      </Page>
    // </PageGroup>
  );
}

const QuestionGroup = styled('div')`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));

`;

const Question = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 0;
  background: ${({ status }) => status === 'valid' ? '#65d68a' : status === 'invalid' ? '#dc5454' : '#E7ECF3'};
  color: ${({ status }) => status ? '#fff' : '#566588'};
`;

const PageGroup = styled('div')`
  width: 100%;
`;

const PageTitle = styled('h2')`
  text-align: center;
  margin: 15px 0;
  color: #5a5b5e;
  padding: 0;
`;

const LinkGroup = styled('div')`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const LinkItem = styled(Link)`
  margin: 0 20px;
`;

const CardGroup = styled('div')`
  padding: 0;
`;

const Title = styled('div')`
  font-weight: 700;
  font-size: 18px;
  margin: 15px 0;
`;

const Description = styled('div')`
  color: #5a5b5e;
 `;