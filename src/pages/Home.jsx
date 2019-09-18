import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Page, Button } from '../components';

export function Home() {
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
            <LinkItem to="/questions">
              <Button>Continue</Button>
            </LinkItem>
            <Link to={{ pathname: '/questions', state: { new: true } }}>
              <Button>Start new</Button>
            </Link>
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
`;

const LinkItem = styled(Link)`
  margin: 0 20px;
`;

const CardGroup = styled('div')`
  padding: 0;
`;

const Card = styled('div')`
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,.15);
  position: relative;
  transition: box-shadow .25s ease-in;
  padding: 25px 15px;
  text-decoration: none;
  color: #000;
  border-top: 5px solid #f1e05a;

  &:hover {
    box-shadow: -2px 8px 22px 0 rgba(0,0,0,.15);
  }
`;

const Subtitle = styled('div')`
  color: #5a5b5e;
  font-size: 14px;
  /* margin: 15px 0; */
`;

const Title = styled('div')`
  font-weight: 700;
  font-size: 18px;
  margin: 15px 0;
`;

const Description = styled('div')`
  color: #5a5b5e;
// `;