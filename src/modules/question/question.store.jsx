import React, { createContext, useReducer, useContext, useEffect } from 'react';

const StateContext = createContext();
const DispatchContext = createContext();

const SET_QUESTIONS = 'set-questions';
const SET_ANSWER = 'set-answer';

function questionReducer(state, { type, payload }) {
  switch (type) {
    case SET_QUESTIONS: 
      return payload;
    case SET_ANSWER:
      return state.map(q => payload.id === q.id ? { ...q, answer: payload.anser } : q);
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}

function QuestionProvider({ children }) {
  const [state, dispatch] = useReducer(questionReducer, []);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useQuestionState(params) {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useQuestionState must be used within a QuestionProvider');
  }
  return context;
}

function useQuestionDispatch(params) {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useQuestionDispatch must be used within a QuestionProvider');
  }
  return context;
}

function useQuestion() {
  return [useQuestionState(), useQuestionDispatch()];
}

function useQuestionsActions() {
  const dispatch = useQuestionDispatch();
  return {
    setQuestions: payload => dispatch({ type: SET_QUESTIONS, payload }),
    setAnswer: payload => dispatch({ type: SET_ANSWER, payload }),
  }
}

export {
  QuestionProvider,
  useQuestionState,
  useQuestionDispatch,
  useQuestion,
  useQuestionsActions,
};