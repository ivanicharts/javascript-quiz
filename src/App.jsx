import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Markdown from 'markdown-it';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'

import { getQuestions, optionClassName } from './utils';

import 'highlight.js/styles/atom-one-dark.css';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md');
      const parsed = (new Markdown()).parse(data);
      const q = getQuestions(parsed);
      setQuestions(q);
      setCurrentQuestion(0);
    })();
  }, []);

  const onNextQuestion = useCallback(() => {
    setCurrentQuestion((currentQuestion + 1) % questions.length);
    setUserAnswer(null);
  }, [currentQuestion, questions.length]);

  const q = questions[currentQuestion] || null;

  return (
    <div className="App">
      {
        q !== null && (
          <div className="question-group">
            <div className="question-number">Question: {currentQuestion + 1} of {questions.length}</div>
            <div className="question-body">
              <div><h3>{q.title.content}</h3></div>
              {q.code && (
                <div>
                  <Highlight className="javascript">{q.code.content}</Highlight>
                </div>
              )}
              <div className="options">
                {
                  q.options.map((o, i) => (
                    <div
                      key={o.content}
                      className={optionClassName(userAnswer, i, q.answerIndex)}
                      onClick={userAnswer === null ? () => setUserAnswer(i) : null}
                    >
                      <ReactMarkdown source={o.content} />
                    </div>
                  ))
                }
              </div>
              {
                userAnswer !== null && (
                  <div>
                    <h4>Answer:</h4>
                    <div className="description">
                      {
                        q.description.map(o => (
                          <ReactMarkdown key={o.content} source={o.content} />
                        ))
                      }
                    </div>
                  </div>
                )
              }
              <div className="btn-group">
                <button className="next-btn" onClick={onNextQuestion}>next</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
