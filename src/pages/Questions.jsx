import React, { useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'
import localForage from 'localforage';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { withRouter } from 'react-router-dom';

import { CancelButton, Button } from '../components';
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
    console.count('>>>>>SAVE PROGRESS TO STORAGE<<<<<');
    localForage.setItem('questions/in-progress', questionList);
  }, [questionList])

  const onNextQuestion = useCallback(() => {
    const nextQuestionIndex = (currentQuestionIndex + 1) % questionList.length;
    history.push(`/questions/${nextQuestionIndex + 1}`);
  }, [currentQuestionIndex, history, questionList.length]);

  const onPrevQuestion = useCallback(() => {
    const prevQuestionIndex = (currentQuestionIndex - 1) % questionList.length;
    history.push(`/questions/${prevQuestionIndex + 1}`);
  }, [currentQuestionIndex, history, questionList.length]);

  const onAnswer = useCallback((answerIndex) => {
    questionActions.setAnswer({ id: question.id, answerIndex });
  }, [question, questionActions]);

  const { correctQuestionsCount, wrongQuestionsCount } = useMemo(() => {
    const [correctCount, wrongCount] = questionList.reduce((acc, q) => {
      if (!isNil(q.userAnswerIndex)) {
        acc[+!(q.answerIndex === q.userAnswerIndex)]++; // @TODO: refactor as it looks weird and unclear, but works :)
      }
      return acc;
    }, [0, 0]);

    return { correctQuestionsCount: correctCount, wrongQuestionsCount: wrongCount };
  }, [questionList]);

  // @TODO replace class name with styled ?
  return (
    <div className="page">
      {
        question !== null && (
          <div className="question-group">
            <div className="question-stats-group">
              <div className="question-stats">
                <span className="question-stats--correct">Correct: {correctQuestionsCount}</span>
                <span>Wrong: {wrongQuestionsCount}</span>
              </div>
              <div className="question-number">Question: {currentQuestionIndex + 1} of {questionList.length}</div>
            </div>
            <div className="question-body">
              <h3 className="question-title">{question.title}</h3>
              {question.code.length && question.code.map((code, index) => (
                <div key={index} className="question-code-group">
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
              <Actions>
                <NavGroup>
                  <CancelBtnGroup>
                    <Link to="/">
                      <CancelButton>cancel</CancelButton>
                    </Link>
                  </CancelBtnGroup>
                  <BtnGroup>
                    <Link to="/progress">
                      <Button>progress</Button>
                    </Link>
                  </BtnGroup>
                </NavGroup>
              
                <NavGroup>
                  {currentQuestionIndex > 0 && (
                    <BtnGroup>
                      <Button onClick={onPrevQuestion}>prev</Button>
                    </BtnGroup>
                  )}
                  {currentQuestionIndex < (questionList.length - 1) && (
                    <BtnGroup>
                      <Button onClick={onNextQuestion}>next</Button>
                    </BtnGroup>
                  )}
                </NavGroup>
              </Actions>
            </div>
          </div>
        )
      }
    </div>
  );
}

const Actions = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  @media screen and (max-width: 616px) {
    flex-direction: column-reverse;
  }
`;

const NavGroup = styled('div')`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 616px) {
    /* background: red; */
    justify-content: center;
    width: 100%;
  }
`;

const BtnGroup = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin: 25px 0 15px 20px;
  
  @media screen and (max-width: 616px) {
    margin: 5px;
  }
`;

const CancelBtnGroup = styled(BtnGroup)`
  margin-left: 0;
`;

const Description = styled('div')`
  line-height: 23px;

  p code {
    background: #eaeef3;
    padding: 2px 3px 0;
  }
`;

export default withRouter(Resource);