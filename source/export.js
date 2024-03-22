import _ from 'lodash';

const INDEX_HEADER = '# MarxHub\n';

export function makeIndex(releasesTable) {
    let res = INDEX_HEADER;

    const releases = _.groupBy(releasesTable, 'releaseDate');

    for (const release in releases) {
        res += `\n## ${release}\n`;
        
        const notes = releases[release];

        for (const note of notes) {

            res += `\n### ${note.title}\n`;
        
        }

    }
    _.groupBy(['one', 'two', 'three'], 'length');
    // => { '3': ['one', 'two'], '5': ['three'] }
    return res;
}