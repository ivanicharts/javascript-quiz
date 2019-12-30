import React, { useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'
import localForage from 'localforage';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { withRouter } from 'react-router-dom';

import { CancelButton, Button, PageGroup } from 'components';
import { optionClassName, scrollToTop } from 'utils';
import { useQuestion } from 'features/question/question.store';

import 'highlight.js/styles/atom-one-dark.css';

function Resource({ history, match }) {
  const [questionList, questionActions] = useQuestion();
  const currentQuestionIndex = match.params.id ? parseInt(match.params.id - 1) : 0;
  const question = questionList[currentQuestionIndex] || null;
  
  const userAnswerIndex = question && !isNil(question.userAnswerIndex)
    ? question.userAnswerIndex
    : null;

  useEffect(() => {
    localForage.setItem('questions/in-progress', questionList);
  }, [questionList])

  const onNextQuestion = useCallback(() => {
    const nextQuestionIndex = (currentQuestionIndex + 1) % questionList.length;
    history.push(`/questions/${nextQuestionIndex + 1}`);
    scrollToTop(); 
  }, [currentQuestionIndex, history, questionList.length]);

  const onPrevQuestion = useCallback(() => {
    const prevQuestionIndex = (currentQuestionIndex - 1) % questionList.length;
    history.push(`/questions/${prevQuestionIndex + 1}`);
    scrollToTop(); 
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

  return (
    <PageGroup> 
      {
        question !== null && (
          <QuestionGroup>
            <QuestionStatsGroup>
              <QuestionStats>
                <Correct>Correct: {correctQuestionsCount}</Correct>
                <span>Wrong: {wrongQuestionsCount}</span>
              </QuestionStats>
              <QuestionNumber>Question: {currentQuestionIndex + 1} of {questionList.length}</QuestionNumber>
            </QuestionStatsGroup>
            <QuestionBody>
              <QuestionTitle>{question.title}</QuestionTitle>
              {!!question.code.length && question.code.map((code, index) => (
                <QuestionAnswerGroup key={index}>
                  <Highlight className="javascript">{code}</Highlight>
                </QuestionAnswerGroup>
              ))}
              <Options>
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
              </Options>
              {
                userAnswerIndex !== null && (
                  <QuestionAnswerGroup>
                    <h4>{question.answer}</h4>
                    <Description>
                      {
                        question.description.map(o => typeof o === 'string' 
                          ? (
                            <ReactMarkdown key={o} source={o} escapeHtml={false} />
                          )
                          : (
                            <QuestionCodeGroup key={o}>
                              <Highlight className="javascript">{o.content}</Highlight>
                            </QuestionCodeGroup>
                          )
                        )
                      }
                    </Description>
                  </QuestionAnswerGroup>
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
            </QuestionBody>
          </QuestionGroup>
        )
      }
    </PageGroup>
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

const QuestionGroup = styled('div')`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 50px;
`;

const QuestionStatsGroup = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const QuestionStats = styled('div')`
  opacity: .3;
  padding: 7px 0;
`;

const Correct = styled('span')`
  margin-right: 10px;
`;

const QuestionNumber = styled('div')`
  opacity: .3;
  padding: 7px 0;
  text-align: right;
`;

const QuestionBody = styled('div')`
  background: #fff;
  border-radius: 3px;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1);
  padding: 2px 15px;
`;

const QuestionTitle = styled('h3')`
  margin: 15px 0;
  line-height: 1;
`;

const QuestionAnswerGroup = styled('div')`
  border-top: 1px solid rgba(0,0,0, .1);
  /* margin-top: 27px;   */
`;

const QuestionCodeGroup = styled('div')`
  margin: 0 0 15px;

  pre {
    margin: 0;
  }  
`;

const Options = styled('div')`
  p {
    cursor: pointer;
    background: #f6f8fa;
    padding: 13px;
    border-radius: 3px;
    border: 1px solid rgba(0,0,0, .1);
    margin: 0 0 15px;
    
    &:hover {
      background: #e9ebec;
    }
  }

  .correct p {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }

  .wrong p {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }

  .correct code {
    background: #a5d6b1;
  }

  .wrong code {
    background: #e4b4b8;
  }

  code {
    background: #d6dade;
    padding: 2px 3px 0;
  }
  
`;

export default withRouter(Resource);