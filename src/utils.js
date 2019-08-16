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
    const code = question[0].tag === 'code' ? question.shift() : null;
    const optionsEnd = question.findIndex(t => t.content.includes('<details><summary><b>Answer'));
    const descriptionEnd = question.findIndex(t => t.content.includes('</p>'));

    const answer = question[optionsEnd + 1];

    questions.push({
      title,
      code,
      answer,
      options: question.slice(0, optionsEnd),
      answerIndex: answer.content.slice(-1).charCodeAt(0) - 65,
      description: question.slice(optionsEnd + 2, descriptionEnd),
    })
  }

  function parseWhile(comparator) {
    while(comparator(mdMarkup[i]) && i < mdMarkup.length - 1) i++;
    return i;
  }

  return questions;
};