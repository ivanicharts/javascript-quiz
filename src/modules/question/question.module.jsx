import { useEffect } from 'react';
import localForage from 'localforage';
import Markdown from 'markdown-it';
import axios from 'axios';

import { useQuestionsActions, useQuestionState, useQuestionDispatch } from './question.store';
import { formatQuestionsFromMarkdown, optionClassName } from '../../utils';

const QUESTIONS_SOURCE_URL = 'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';

const QUESTIONS_RAW = 'questions/raw';
const QUESTIONS_IN_PROGRESS = 'questions/in-progress';

// move this to store to provider component IMHO
export function useQuestion() {
  const { setQuestions } = useQuestionsActions();

  useEffect(() => {
    (async () => {
      // const questionsFromCash = await getQuestionsFromCash();

      const [isSetQuestionsFromCash, rawQuestions] = await Promise.all([
        getQuestionsFromCash().then(questionsFromCash => {
          console.log('questionsFromCash', questionsFromCash);
          if (questionsFromCash) {
            setQuestions(questionsFromCash);
            return true;
          }
          return false;
        }),
        axios.get(QUESTIONS_SOURCE_URL).then(({ data }) => data),
      ]);

      console.log('isSetQuestionsFromCash, rawQuestions', isSetQuestionsFromCash);

      const questionsMd = (new Markdown()).parse(rawQuestions);
      const formattedQuestions = formatQuestionsFromMarkdown(questionsMd);
      
      if (!isSetQuestionsFromCash) {
        setQuestions(formattedQuestions)
      }

      localForage.setItem(QUESTIONS_RAW, formattedQuestions);
    })();
  }, [setQuestions]);

  return [useQuestionState(), useQuestionsActions()];
}

async function getQuestionsFromCash() {
  const questionsInProgress = await localForage.getItem(QUESTIONS_IN_PROGRESS);

  if (questionsInProgress) {
    return questionsInProgress;
  }

  return localForage.getItem(QUESTIONS_RAW);
}