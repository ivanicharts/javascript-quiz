export function stripHtml(htmlStr) {
  const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
  return doc.body.textContent || 'Parse error';
}

export const getQuestions = parsed => {
  const mdMarkup = parsed
    .filter(p => p.type === 'inline' || p.tag === 'code' || p.type === 'hr');

  const HR = 'hr';
  let i = 0;
  const questions = [];

  // Omit description and go to first question
  parseWhile(t => t.tag !== HR);

  while (i < mdMarkup.length - 1) {
    const questionStart = ++i;
    const questionEnd = parseWhile(t => t.tag !== HR);
    const [title, ...question] = mdMarkup.slice(questionStart, questionEnd);
    const codeSnippets = [];

    while (question[0] && question[0].tag === 'code') {
      codeSnippets.push(question.shift().content);
    }

    const optionsEnd = question.findIndex(t => t.content.includes('<details><summary><b>Answer'));
    const descriptionEnd = question.findIndex(t => t.content.includes('</p>'));
    const answer = question[optionsEnd + 1];

    questions.push({
      title: stripHtml(title.content),
      code: codeSnippets,
      answer: answer.content,
      options: question.slice(0, optionsEnd).map(e => e.content),
      answerIndex: answer.content.slice(-1).charCodeAt(0) - 65,
      description: question.slice(optionsEnd + 2, descriptionEnd).map(e => e.tag === 'code' ? e : e.content),
    })
  }

  function parseWhile(comparator) {
    while(comparator(mdMarkup[i]) && i < mdMarkup.length - 1) i++;
    return i;
  }

  // console.log('q', questions);
  return questions;
};

export const optionClassName = (answ, option, correct) => {
  if (answ === null) {
    return '';
  }

  if (option === correct) {
    return 'correct';
  }

  if (option === answ) {
    return 'wrong';
  }
};
