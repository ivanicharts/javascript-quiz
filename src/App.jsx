import React from 'react';

import Router from './Router';
import { QuestionProvider } from 'features/question/question.store';
import { Main } from 'components';

// Add loading state on fetching
// replace localforage with abstract service
// Test if no internet and no data in local storage

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
