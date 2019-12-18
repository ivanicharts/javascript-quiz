import React, { createContext, useReducer, useContext, useMemo, useEffect } from 'react';
import localForage from 'localforage';
import Markdown from 'markdown-it';
import axios from 'axios';

import { formatQuestionsFromMarkdown } from '../../utils';

const StateContext = createContext();
const DispatchContext = createContext();

const SET_QUESTIONS = 'questions/set';
const SET_ANSWER = 'questions/answer/set';
const CLEAR = 'questions/clear';

const QUESTIONS_SOURCE_URL = 'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';

const QUESTIONS_ORIGINAL = 'questions/original';
const QUESTIONS_IN_PROGRESS = 'questions/in-progress';


function questionReducer(state, { type, payload }) {
  // @TODO: use immer here \^/
  switch (type) {
    case SET_QUESTIONS: 
      return payload;
    case SET_ANSWER:
      return state.map(q => payload.id === q.id ? { ...q, userAnswerIndex: payload.answerIndex } : q);
    case CLEAR:
      return [];
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}

function QuestionProvider({ children }) {
  const [state, dispatch] = useReducer(questionReducer, []);

  useEffect(() => {
    console.count('<<<<<<<<<< ONLY ONCE FETCH QUESTIONS >>>>>>>>>>>>');
    (async () => {
      const [
        isSetQuestionsFromCash,
        rawQuestions
      ] = await Promise.all([
        getQuestionsFromCash()
          .then(questionsFromCash => {
            dispatch({ type: SET_QUESTIONS, payload: questionsFromCash });
            return true;
          })
          .catch(e => {
            console.error(e);
            return false;
          }),

        axios.get(QUESTIONS_SOURCE_URL)
          .then(({ data }) => data)
          .catch(e => {
            console.error(e);
            return false;
          }),
      ]);

      if (!rawQuestions) return;

      const questionsMd = (new Markdown()).parse(rawQuestions);
      const formattedQuestions = formatQuestionsFromMarkdown(questionsMd);
      
      if (!isSetQuestionsFromCash) {
        dispatch({ type: SET_QUESTIONS, payload: formattedQuestions })
      }
      
      localForage.setItem(QUESTIONS_ORIGINAL, formattedQuestions);
    })();
  }, []);

  console.count('<<<RENDER PROVIDER>>>');

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

function useQuestionsActions() {
  const dispatch = useQuestionDispatch();
  return useMemo(() => ({
    setQuestions: payload => dispatch({ type: SET_QUESTIONS, payload }),
    setAnswer: payload => dispatch({ type: SET_ANSWER, payload }),
    clear: payload => dispatch({ type: CLEAR }),
    init: async () => {
      const payload = await localForage.getItem(QUESTIONS_ORIGINAL);
      dispatch({ type: SET_QUESTIONS, payload });
    }
  }), [dispatch]);
}

function useQuestion() {
  return [useQuestionState(), useQuestionsActions()];
}

async function getQuestionsFromCash(questionTypes = []) {
  const questionsInProgress = await localForage.getItem(QUESTIONS_IN_PROGRESS);

  if (questionsInProgress) {
    return questionsInProgress;
  }

  const originalQuestions = await localForage.getItem(QUESTIONS_ORIGINAL);

  if (originalQuestions) {
    return originalQuestions;
  }

  throw new Error(`No questions found in Cash storage`);
}

export {
  QuestionProvider,
  useQuestionState,
  useQuestionDispatch,
  useQuestion,
  useQuestionsActions,
};

