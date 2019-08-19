import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Markdown from 'markdown-it';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'
import localForage from 'localforage';

import { getQuestions, optionClassName } from './utils';

import 'highlight.js/styles/atom-one-dark.css';
import './App.scss';

const QUESTIONS = 'questions';
const CURRENT = 'currentQuestion';
const CORRECT_ANSWERS = 'answers/correct';
const WRONG_ANSWERS = 'answers/wrong';

function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnsererdQuestions, setCorrectAnsererdQuestions] = useState([]);
  const [wrongAnsererdQuestions, setWrongAnsererdQuestions] = useState([]);

  const q = questions[currentQuestion] || null;

  useEffect(() => {
    (async () => {
      // get questions from store
      const questionsFromCash = await localForage.getItem(QUESTIONS);
      const currentQuestionFromCash = await localForage.getItem(CURRENT);
      const correctAnswers = await localForage.getItem(CORRECT_ANSWERS);
      const wrongAnswers = await localForage.getItem(WRONG_ANSWERS);

      setCorrectAnsererdQuestions(correctAnswers || []);
      setWrongAnsererdQuestions(wrongAnswers || [])

      if (questionsFromCash && questionsFromCash.length) {
        setQuestions(questionsFromCash);
        setCurrentQuestion(currentQuestionFromCash || 0);
      }

      const { data } = await axios.get('https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md');
      const parsed = (new Markdown()).parse(data);
      const formattedQuestions = getQuestions(parsed);

      setQuestions(formattedQuestions);

      // save questions
      localForage.setItem(QUESTIONS, formattedQuestions);
    })();
  }, []);

  const onNextQuestion = useCallback(() => {
    const nextQuestion = (currentQuestion + 1) % questions.length;

    setCurrentQuestion(nextQuestion);
    setUserAnswer(null);
  }, [currentQuestion, questions.length]);

  const onAnswerClick = useCallback((i) => {
    setUserAnswer(i);
    const nextQuestion = (currentQuestion + 1) % questions.length;

    if (i === q.answerIndex) {
      onNextQuestion();
      setCorrectAnsererdQuestions(questions => {
        const newCorrectAnsweredQuestions = [...questions, q];
        localForage.setItem(CORRECT_ANSWERS, newCorrectAnsweredQuestions);
        localForage.setItem(CURRENT, nextQuestion);
        return newCorrectAnsweredQuestions;
      });
    } else {
      setWrongAnsererdQuestions(questions => {
        const newWrongAnsweredQuestions = [...questions, q];
        localForage.setItem(WRONG_ANSWERS, newWrongAnsweredQuestions);
        localForage.setItem(CURRENT, nextQuestion);
        return newWrongAnsweredQuestions;
      });
    }
  }, [currentQuestion, onNextQuestion, q, questions.length])


  return (
    <div className="App">
      {
        q !== null && (
          <div className="question-group">
            <div className="question-stats-group">
              <div className="question-stats">
                <span className="question-stats--correct">Correct: {correctAnsererdQuestions.length}</span>
                <span>Wrong: {wrongAnsererdQuestions.length}</span>
              </div>
              <div className="question-number">Question: {currentQuestion + 1} of {questions.length}</div>
            </div>
            <div className="question-body">
              <h3 className="question-title">{q.title}</h3>
              {q.code && (
                <div className="question-code-group">
                  <Highlight className="javascript">{q.code}</Highlight>
                </div>
              )}
              <div className="options">
                {
                  q.options.map((o, i) => (
                    <div
                      key={o}
                      className={optionClassName(userAnswer, i, q.answerIndex)}
                      onClick={userAnswer === null ? () => onAnswerClick(i) : null}
                    >
                      <ReactMarkdown source={o} />
                    </div>
                  ))
                }
              </div>
              {
                userAnswer !== null && (
                  <div className="question-answer--group">
                    <h4>{q.answer}</h4>
                    <div className="description">
                      {
                        q.description.map(o => typeof o === 'string' 
                          ? (
                            <ReactMarkdown key={o} source={o} escapeHtml={false} />
                          )
                          : (
                            <div key={o} className="question-code-group">
                              <Highlight className="javascript">{o.content}</Highlight>
                            </div>
                          )
                        )
                      }
                    </div>
                  </div>
                )
              }
              {
                userAnswer !== null && (
                  <div className="btn-group">
                    <button className="next-btn" onClick={onNextQuestion}>next</button>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
