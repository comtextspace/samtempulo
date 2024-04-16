import _ from 'lodash';

const INDEX_HEADER = '# Samtempulo\n';

export function makeMainPage(notes) {
  let res = INDEX_HEADER;

  const objects = _.groupBy(notes, 'date');

  for (const object in objects) {
    res += `\n## ${object}\n`;
        
    const notes = objects[object];

    for (const note of notes) {
      res += `\n### ${note.name} (${typeToText(note.type)})\n`;
      
      res += getTextFromList('Авторы:', note.getConnections('to', 'author'));
      res += getTextFromList('Группы:', note.getConnections('to', 'author_group'));

      res += makeLinksText(note.links);

        res += '\n' + note.description;

        res += getTextFromList('В статье упоминаются:', note.getConnections('to', 'mention'));
    }

  }
  return res;
}

export function makeIndex(pageName, objects) {
  let res = `# ${pageName}\n\n`;

  const sortedObjects = _.sortBy(objects, ['name'], ['asc']);

  for (const object of sortedObjects) {
    res += `* [${object.name}](${object.id}.md)\n`;
  }
  
  return res;
}

export function makePages(objects) {
    const pages = [];
    let page = '';
  
    for (const object of objects) {
      page = `# ${object.name}\n`;

      page += makeLinksText(object.links);

      page += getTextFromList('Состоит в', object.getConnections('to', 'member'));

      page += getTextFromList('Автор:', object.getConnections('from', 'author'));

      page += getTextFromList('Упоминается в', object.getConnections('from', 'mention'));
      
      page += getTextFromList('Участники:', object.getConnections('from', 'member'));


      pages.push({
        filename: object.id + '.md',
        content: page
      });
    }

    return pages;
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

  return `\n${caption} ` 
      + list.map(obj => `[${obj.name}](${obj.id}.md)`).join(', ') 
      + '.\n';
}

function makeLinksText(linksRaw) {
    if (!linksRaw) {
        return '';
    }

    const links = JSON.parse(linksRaw);
    const linkList = links.map(link => `[${link.name}](${link.url})`);
    return '\nСсылки: ' + linkList.join(', ') + '.\n';
}