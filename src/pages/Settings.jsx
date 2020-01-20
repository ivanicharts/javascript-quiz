import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useSettings } from 'features/settings/settings.store';
import { Page, Button, PageGroup, CancelButton } from 'components';

export function Settings() {
  const [settings, settingsActions] = useSettings();

  return (
    <PageGroup>
      <PageTitle>Settings</PageTitle>
      <Page>
        <CardGroup>
          <Description>
            <div>
              <label htmlFor="">Use voice commands: </label>
              <input type="checkbox" checked={settings.useVoiceCommands}/>
            </div>
          </Description>
          <LinkGroup>
            <LinkItem to="/progress">
              <Button>Save</Button>
            </LinkItem>
            <LinkItem to="/">
              <CancelButton>Home</CancelButton>
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