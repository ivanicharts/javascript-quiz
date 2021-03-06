export function stripHtml(htmlStr) {
  const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
  return doc.body.textContent || 'Parse error';
}

export const formatQuestionsFromMarkdown = parsed => {
  const mdMarkup = parsed
    .filter(p => p.type === 'inline' || p.tag === 'code' || p.type === 'hr');

  const HR = 'hr';
  let i = 0;
  const questions = [];

  // Omit description and go to first question
  let hrCount = 0;
  parseWhile(t => {
    if (t.tag !== HR) return true;
    hrCount++;
    if (hrCount >= 3) return false;
    return true;
  });

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
    const description = descriptionEnd > -1
      ? question.slice(optionsEnd + 2, descriptionEnd)
      : question.slice(optionsEnd + 2);

    questions.push({
      id: questions.length,
      title: stripHtml(title.content),
      code: codeSnippets,
      answer: answer.content,
      options: question.slice(0, optionsEnd).map(e => e.content),
      answerIndex: answer.content.slice(-1).charCodeAt(0) - 65,
      description: description.map(e => e.tag === 'code' ? e : e.content),
    })
  }

  function parseWhile(comparator) {
    while(comparator(mdMarkup[i]) && i < mdMarkup.length - 1) i++;
    return i;
  }

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

export const isDev = () => process.env === 'development';

export const allSettled = promises => Promise.all(promises.map(promise => promise.catch(e => e)));

export const scrollToTop = () => window && window.scrollTo(0, 0);