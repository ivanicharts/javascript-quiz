import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Markdown from 'markdown-it';
import ReactMarkdown from 'react-markdown';
import Highlight from 'react-highlight'

import 'highlight.js/styles/atom-one-dark.css';
import './App.css';



const getQuestions = mdMarkup => {
  const HR = 'hr';
  let i = 0;
  const questions = [];

  // Omit description and go to first question
  parseWhile(t => t.tag !== HR);

  while (i < mdMarkup.length - 1) {
    const questionStart = ++i;
    const questionEnd = parseWhile(t => t.tag !== HR);
    const [title, code, ...question] = mdMarkup.slice(questionStart, questionEnd);
    const optionsEnd = question.findIndex(t => t.content.includes('<details><summary><b>Answer'));

    questions.push({
      title,
      code,
      options: question.slice(0, optionsEnd),
      answer: question[optionsEnd + 1],
      description: question.slice(optionsEnd + 2, questions.length - 1),
    })
  }

  function parseWhile(comparator) {
    while(comparator(mdMarkup[i]) && i < mdMarkup.length - 1) i++;
    return i;
  }

  return questions;
};

function App() {

  const [questions, setQuestions] = useState([]);

  useEffect(() => {

    (async () => {
      const { data } = await axios.get('/questions.txt');
      const parsed = (new Markdown()).parse(data);

      const res = parsed
        .filter(p => p.type === 'inline' || p.tag === 'code' || p.type === 'hr');

        
        const q = getQuestions(res);
        console.log('res', q);
      // const q = data.split('---').slice(1, 5).map(question => {
      //   // console.log('question', qParser(question));
      //   return qParser(question);
      // })

      setQuestions(q);

      // console.log('res', data.split('---'));
    })();

  }, []);

  console.log('questions', questions);
  return (
    <div className="App">
      {
        questions.map(q => (
          <div>
            <p><ReactMarkdown source={q.title.content} /></p>
            {/* <div><ReactMarkdown source={q.code.content} /></div> */}
            <div><Highlight className="javascript">{q.code.content}</Highlight></div>
            <div>{q.options.map(o => <ReactMarkdown source={o.content} />)}</div>
            <div><ReactMarkdown source={q.answer.content} /></div>
            <div>{q.description.map(o => <ReactMarkdown source={o.content} />)}</div>
          </div>
        ))
      }
    </div>
  );
}

export default App;
