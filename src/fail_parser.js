
const qParser = (q) => {
  console.log('q', q);
  let i = 0;

  const parseWhile = (comparator) => {
    while (comparator(q[i])) i++;
    return i;
  }

  const parseCode = () => {
    const start = parseWhile(t => t !== '\n');

    while (q[i] !== '`' && q[i + 1] !== '`' && q[i + 2] !== '`') {
      parseWhile(t => t !== '`');
    }

    return q.slice(start, i);
  }
  

  // parse titlte

  
  const startTitleI = parseWhile(t => t !== '#');
  const endTitleI = parseWhile(t => t !== '\n');
  
  const code = parseCode();

  const startAnsw = parseWhile(t => t !== '#');
  const endAnsw = parseWhile(t => t !== '\n');

  const startDescr = endAnsw + 1;

  console.log('s', code);
  return {
    title: q.slice(startTitleI, endTitleI),
    code,
    answ: q.slice(startAnsw, endAnsw),
    descr: q.slice(startDescr, q.length - 17),
  }
}
