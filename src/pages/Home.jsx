import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useQuestionsActions } from '../modules/question/question.store';
import { Page, Button } from '../components';

export function Home() {
  const { init } = useQuestionsActions();
  return (
    <PageGroup>
      <PageTitle>List of (Advanced) JavaScript Questions</PageTitle>
      <Page>
        <CardGroup>
          <Title>Advanced JS Questions</Title>
          <Description>
            A long list of (advanced) JavaScript questions, 
            and their explanations sparkles Updated weekly!
          </Description>
          <LinkGroup>
            <LinkItem to="/progress">
              {/* on continue go to questions review page and then select question to continue from gia */}
              {/* use reselect to cash count of answered questions */}
              <Button>Continue</Button>
            </LinkItem>
            {/* ON CLICK REMOVE IN PROGRESS AND REPLACE STATE WITH ORIGINAL Questions */}
            <LinkItem to={{ pathname: '/questions', state: { new: true } }}>
              <Button onClick={init}>Start new</Button>
            </LinkItem>
          </LinkGroup>
        </CardGroup>
      </Page>
    </PageGroup>
  );
}

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