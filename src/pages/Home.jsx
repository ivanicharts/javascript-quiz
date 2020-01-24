import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import annyang from 'annyang';
// ^ move to service with fallback

import { useQuestionsActions } from 'features/question/question.store';
import { Page, Button, PageGroup } from 'components';

export const Home = withRouter(function Home({ history }) {
  const { init } = useQuestionsActions();

  useEffect(() => {
    annyang.setLanguage('ru');
    annyang.addCallback('result', (...args) => {
      console.log('result', args);
    });
    annyang.addCallback('resultMatch', (...args) => {
      console.log('resultMatch', args);
    });
    annyang.addCallback('resultNoMatch', (...args) => {
      console.log('resultNoMatch', args);
    });
    annyang.addCallback('error', (...args) => {
      console.log('err', args);
    });
    annyang.addCallback('errorNetwork', (...args) => {
      console.log('errorNetwork', args);
    });
    annyang.addCallback('errorPermissionBlocked', (...args) => {
      console.log('errorPermissionBlocked', args);
    });
    annyang.addCallback('errorPermissionDenied', (...args) => {
      console.log('errorPermissionDenied', args);
    });
    annyang.addCallback('start', (...args) => {
      console.log('start', args);
    });
    annyang.addCallback('end', (...args) => {
      console.log('end', args);
    });
    annyang.addCallback('soundstart', (...args) => {
      console.log('soundstart', args);
    });
    annyang.addCommands({
      // 'continue': () => history.push('/progress'),
      'continue': () => console.log('asd continue'),
    });
  }, []);

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
});

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