import { useEffect } from 'react';
import localForage from 'localforage';
import Markdown from 'markdown-it';
import axios from 'axios';

import { useQuestionsActions, useQuestionState, useQuestionDispatch } from './question.store';
import { formatQuestionsFromMarkdown, optionClassName } from '../../utils';

const QUESTIONS_SOURCE_URL = 'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';
// const QUESTIONS = 'questions';
// const CURRENT = 'currentQuestion';
// const CORRECT_ANSWERS = 'answers/correct';
// const WRONG_ANSWERS = 'answers/wrong';

const QUESTIONS_RAW = 'questions/raw';
const QUESTIONS_IN_PROGRESS = 'questions/in-progress';

async function getQuestionsFromCash() {
  const questionsInProgress = await localForage.getItem(QUESTIONS_IN_PROGRESS);

  if (questionsInProgress) {
    return questionsInProgress;
  }

  return await localForage.getItem(QUESTIONS_RAW);
}

function useQuestion() {
  const { setQuestions } = useQuestionsActions();

  useEffect(() => {
    (async () => {
      
      const questionsFromCash = await getQuestionsFromCash();

      const [isSetQuestionsFromCash, rawQuestions] = await Promise.all([
        getQuestionsFromCash().then(questionsFromCash => {
          if (questionsFromCash) {
            setQuestions(questionsFromCash);
            return true;
          }
          return false;
        }),
        axios.get(QUESTIONS_SOURCE_URL).then(({ data }) => data),
      ]);


      const questionsMd = (new Markdown()).parse(rawQuestions);
      const formattedQuestions = formatQuestionsFromMarkdown(questionsMd);
      
      if (!isSetQuestionsFromCash) {
        setQuestions(formattedQuestions)
      }

      localForage.setItem(QUESTIONS_RAW, formattedQuestions);
    })();
  }, [setQuestions]);

  return [useQuestionState(), useQuestionDispatch()];
}