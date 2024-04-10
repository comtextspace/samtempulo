import _ from 'lodash';

const INDEX_HEADER = '# MarxHub\n';

export function makeIndex(objectsTable) {
  let res = INDEX_HEADER;

  const objects = _.groupBy(objectsTable, 'date');

  for (const object in objects) {
    res += `\n## ${object}\n`;
        
    const notes = objects[object];

    for (const note of notes) {
      res += `\n### ${note.name} (${typeToText(note.type)})\n`;
      
      res += getTextFromList('Авторы', note.authors);
      res += getTextFromList('Группы', note.author_groups);

      if (note.links) {
        const links = JSON.parse(note.links);

        const linkArray = [];

        for (const link of links) {
          linkArray.push(`[${link.name}](${link.url})`);
        }
  

        res += '\nСсылки: ' + linkArray.join(', ') + '.\n';
    }
        res += '\n' + note.description;

        res += getTextFromList('В статье упоминаются', note.mentions);

      
    }

  }
  _.groupBy(['one', 'two', 'three'], 'length');
  // => { '3': ['one', 'two'], '5': ['three'] }
  return res;
}

const typeDict = {
  'book': 'Книга',
  'article': 'Статья'
};

function typeToText(type) {
  return typeDict[type];
}

function getTextFromList(caption, list) {
  if (list.length == 0) {
    return '';
  }

  return `\n${caption}: ` 
      + list.map(obj => `${obj.name}`).join(', ') 
      + '.\n';
}