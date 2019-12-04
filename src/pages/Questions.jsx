import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Markdown from 'markdown-it';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'
import localForage from 'localforage';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getQuestions, optionClassName } from '../utils';

import 'highlight.js/styles/atom-one-dark.css';

const QUESTIONS = 'questions';
const CURRENT = 'currentQuestion';
const CORRECT_ANSWERS = 'answers/correct';
const WRONG_ANSWERS = 'answers/wrong';


export default function Resource() {
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnsererdQuestions, setCorrectAnsererdQuestions] = useState([]);
  const [wrongAnsererdQuestions, setWrongAnsererdQuestions] = useState([]);

  const q = questions[currentQuestionIndex] || null;

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
        setCurrentQuestionIndex(currentQuestionFromCash || 0);
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
    const nextQuestion = (currentQuestionIndex + 1) % questions.length;

    setCurrentQuestionIndex(nextQuestion);
    setUserAnswer(null);
  }, [currentQuestionIndex, questions.length]);

  const onPrevQuestion = useCallback(() => {
    const prevQuestion = (currentQuestionIndex - 1) % questions.length;

    setCurrentQuestionIndex(prevQuestion);
    setUserAnswer(null);
  }, [currentQuestionIndex, questions.length]);

  const onAnswerClick = useCallback((i) => {
    setUserAnswer(i);
    const nextQuestion = (currentQuestionIndex + 1) % questions.length;

    if (i === q.answerIndex) {
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
  }, [currentQuestionIndex, q, questions.length])

  console.log('q', q);

  return (
    <div className="page">
      {
        q !== null && (
          <div className="question-group">
            <div className="question-stats-group">
              <div className="question-stats">
                <span className="question-stats--correct">Correct: {correctAnsererdQuestions.length}</span>
                <span>Wrong: {wrongAnsererdQuestions.length}</span>
              </div>
              <div className="question-number">Question: {currentQuestionIndex + 1} of {questions.length}</div>
            </div>
            <div className="question-body">
              <h3 className="question-title">{q.title}</h3>
              {q.code.length && q.code.map(code => (
                <div className="question-code-group">
                  <Highlight className="javascript">{code}</Highlight>
                </div>
              ))}
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
              <div className="actions-group">
                <NavGroup>
                  {/* <Link to="/"> */}
                  <CancelBtnGroup>
                    <CancelBtn>cancel</CancelBtn>
                  </CancelBtnGroup>

                  {/* </Link> */}
                  <BtnGroup>
                    <Button onClick={onPrevQuestion}>review questions</Button>
                  </BtnGroup>
                </NavGroup>
              
                <NavGroup>
                  {
                    currentQuestionIndex > 0 && (
                      <BtnGroup>
                        <Button onClick={onPrevQuestion}>prev</Button>
                      </BtnGroup>
                    )
                  }
                  {
                    currentQuestionIndex < (questions.length - 1) && (
                      <BtnGroup>
                        <Button onClick={onNextQuestion}>next</Button>
                      </BtnGroup>
                    )
                  }
                </NavGroup>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

const NavGroup = styled('div')`
  display: flex;
`;

const BtnGroup = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin: 25px 0 15px 20px;
`;

const CancelBtnGroup = styled(BtnGroup)`
  margin-left: 0;
`;

// @TODO: move to shared
const Button = styled.button`
  border: 0;
  outline: 0;
  background: #E7ECF3;
  color: #566588;
  padding: 10px 30px;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
`;

const CancelBtn = styled(Button)`
  color: #fff;
  background: #DC5454;
`;