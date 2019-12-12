import React, { useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'
import localForage from 'localforage';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { withRouter } from 'react-router-dom';

import { optionClassName } from '../utils';
import { useQuestion } from '../modules/question/question.store';

import 'highlight.js/styles/atom-one-dark.css';

function Resource({ history, match }) {
  const [questionList, questionActions] = useQuestion();
  const currentQuestionIndex = match.params.id ? parseInt(match.params.id - 1) : 0;
  const question = questionList[currentQuestionIndex] || null;
  
  const userAnswerIndex = question && !isNil(question.userAnswerIndex)
    ? question.userAnswerIndex
    : null;

  useEffect(() => {
    console.count('SAVE TO STORAGE');
    localForage.setItem('questions/in-progress', questionList);
  }, [questionList])

  const onNextQuestion = useCallback(() => {
    const nextQuestion = (currentQuestionIndex + 1) % questionList.length;
    history.push(`/questions/${nextQuestion + 1}`);
  }, [currentQuestionIndex, history, questionList.length]);

  const onPrevQuestion = useCallback(() => {
    const prevQuestion = (currentQuestionIndex - 1) % questionList.length;
    history.push(`/questions/${prevQuestion + 1}`);
  }, [currentQuestionIndex, history, questionList.length]);

  const onAnswer = useCallback((answerIndex) => {
    questionActions.setAnswer({ id: question.id, answerIndex });
  }, [question, questionActions]);

  const onCancel = useCallback((answerIndex) => {
    history.push('/');
    questionActions.clear();
  }, [history, questionActions]);

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
                      className={optionClassName(userAnswerIndex, i, question.answerIndex)}
                      onClick={userAnswerIndex === null ? () => onAnswer(i) : null}
                    >
                      <ReactMarkdown source={o} />
                    </div>
                  ))
                }
              </div>
              {
                userAnswerIndex !== null && (
                  <div className="question-answer--group">
                    <h4>{question.answer}</h4>
                    <Description>
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
                    </Description>
                  </div>
                )
              }
              <div className="actions-group">
                <NavGroup>
                  <CancelBtnGroup>
                    <CancelBtn onClick={onCancel}>cancel</CancelBtn>
                  </CancelBtnGroup>
                  <BtnGroup>
                    <Link to="/progress">
                      <Button>review questions</Button>
                    </Link>
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

const Description = styled('div')`
  line-height: 23px;

  p code {
    background: #eaeef3;
    padding: 2px 3px 0;
  }
`;

export default withRouter(Resource);