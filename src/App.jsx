import React from 'react';

import Router from './Router';
import { QuestionProvider } from 'features/question/question.store';
import { Main } from 'components';

import './App.scss';

// Add loading state on fetching
// replace localforage with abstract service

// modules as features
// remove css, scss

function App() {
  return (
    <QuestionProvider>
      <Main>
        <Router />
      </Main>
    </QuestionProvider>
  );
}

export default App;
