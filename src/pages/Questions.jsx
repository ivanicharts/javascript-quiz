import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Markdown from 'markdown-it';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'
import localForage from 'localforage';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isNil from 'lodash/isNil';

import { getQuestions, optionClassName } from '../utils';
import { useQuestion } from '../modules/question/question.module';

import 'highlight.js/styles/atom-one-dark.css';

const QUESTIONS = 'questions';
const CURRENT = 'currentQuestion';
const CORRECT_ANSWERS = 'answers/correct';
const WRONG_ANSWERS = 'answers/wrong';

export default function Resource() {
  const [questionList, questionActions] = useQuestion();

  // const [questions, setQuestions] = useState([]);
  // const [correctAnsererdQuestions, setCorrectAnsererdQuestions] = useState([]);
  // const [wrongAnsererdQuestions, setWrongAnsererdQuestions] = useState([]);

  const [currentQuestionAnswerIndex, setCurrentQuestionAnswerIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const question = questionList[currentQuestionIndex] || null;

  const onNextQuestion = useCallback(() => {
    const nextQuestion = (currentQuestionIndex + 1) % questionList.length;
  
    setCurrentQuestionIndex(nextQuestion);
    setCurrentQuestionAnswerIndex(null);
  }, [currentQuestionIndex, questionList.length]);

  const onPrevQuestion = useCallback(() => {
    const prevQuestion = (currentQuestionIndex - 1) % questionList.length;

    setCurrentQuestionIndex(prevQuestion);
    setCurrentQuestionAnswerIndex(null);
  }, [currentQuestionIndex, questionList.length]);

  const onAnswer = useCallback((answerIndex) => {
    setCurrentQuestionAnswerIndex(answerIndex);
    questionActions.setAnswer({ id: question.id, answerIndex });
  }, [question, questionActions]);

  const { correctAnsweredQuestionsCount, wrongAnsweredQuestionsCount } = useMemo(() => {
    console.log('log only on set asnwer');
    const [correct, wrong] = questionList.reduce((acc, q) => {
      if (!isNil(q.userAnswerIndex)) {
        acc[+!(q.answerIndex === q.userAnswerIndex)]++; // @TODO: refactor
      }
      return acc;
    }, [0, 0]);

    return { correctAnsweredQuestionsCount: correct, wrongAnsweredQuestionsCount: wrong };
  }, [questionList]);

  console.log('q', question);

  return (
    <div className="page">
      {
        question !== null && (
          <div className="question-group">
            <div className="question-stats-group">
              <div className="question-stats">
                <span className="question-stats--correct">Correct: {correctAnsweredQuestionsCount}</span>
                <span>Wrong: {wrongAnsweredQuestionsCount}</span>
              </div>
              <div className="question-number">Question: {currentQuestionIndex + 1} of {questionList.length}</div>
            </div>
            <div className="question-body">
              <h3 className="question-title">{question.title}</h3>
              {question.code.length && question.code.map(code => (
                <div className="question-code-group">
                  <Highlight className="javascript">{code}</Highlight>
                </div>
              ))}
              <div className="options">
                {
                  question.options.map((o, i) => (
                    <div
                      key={o}
                      className={optionClassName(currentQuestionAnswerIndex, i, question.answerIndex)}
                      onClick={currentQuestionAnswerIndex === null ? () => onAnswer(i) : null}
                    >
                      <ReactMarkdown source={o} />
                    </div>
                  ))
                }
              </div>
              {
                currentQuestionAnswerIndex !== null && (
                  <div className="question-answer--group">
                    <h4>{question.answer}</h4>
                    <div className="description">
                      {
                        question.description.map(o => typeof o === 'string' 
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
                  <CancelBtnGroup>
                    <CancelBtn>cancel</CancelBtn>
                  </CancelBtnGroup>
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
                    currentQuestionIndex < (questionList.length - 1) && (
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