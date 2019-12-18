import React from 'react';

import Router from './Router';
import { QuestionProvider } from './modules/question/question.store';

import './App.scss';

// on finish show results
// options: retake quizz retake with only wrong answers
// go to home
// on home show buttons to contiune last quizz or start new quizz

// move fetch logic to use fetch hook
// move useParsedQuestions to hook
// make all as resources
// questions source as resource
// with hook useResources

// Add loading state on fetching
// replace localforage with abstract service

// modules as features
// remove css, scss
// relative imports

function App() {
  return (
    <QuestionProvider>
      <main className="layout">
        <Router />
      </main>
    </QuestionProvider>
  );
}

export default App;
