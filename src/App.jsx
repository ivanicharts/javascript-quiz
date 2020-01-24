import React, { useEffect } from 'react';
import annyang from 'annyang';

import Router from './Router';
import { QuestionProvider } from 'features/question/question.store';
import { Main } from 'components';

// Add loading state on fetching
// replace localforage with abstract service
// Test case if no internet and no data in local storage

function App() {
  useEffect(() => {
    if (annyang) {
      annyang.start();
    }
  }, []);

  return (
    <QuestionProvider>
      <Main>
        <Router />
      </Main>
    </QuestionProvider>
  );
}

export default App;
