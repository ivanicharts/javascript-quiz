import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useQuestionsActions } from 'features/question/question.store';
import { Page, Button, PageGroup } from 'components';

export function Home() {
  const { init } = useQuestionsActions();
  return (
    <PageGroup>
      <PageTitle>Interactive list of JavaScript Questions</PageTitle>
      <Page>
        <CardGroup>
          <Title>What is this ?</Title>
          <Description>
            <p>
              This is the interactive representation of &nbsp;
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/lydiahallie/javascript-questions"
              >
              javascript-questions
              </a> 
              &nbsp; repository. All questions are parsed from there.
            </p>
            <p>The source code of this app can be found &nbsp;
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/ivanicharts/javascript-quizz">
                here
              </a>
            .</p>
          </Description>
          <LinkGroup>
            <LinkItem to="/progress">
              <Button>Continue</Button>
            </LinkItem>
            <LinkItem to="/questions">
              <Button onClick={init}>Start new</Button>
            </LinkItem>
          </LinkGroup>
        </CardGroup>
      </Page>
    </PageGroup>
  );
}

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
  flex-wrap: wrap;
`;

const LinkItem = styled(Link)`
  margin: 7px 10px;
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