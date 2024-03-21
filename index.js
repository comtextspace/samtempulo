import fs from 'fs';
import path from 'path';

import { Command } from 'commander';
import { load } from 'js-toml';

import {openDb, closeDb, createSchema} from './source/data.js';
// import {importRelease} from './source/import.js';

const INPUT_PATH = './data/';
const OUTPUT_PATH = './docs/';

const program = new Command();

program
  .name('Marxhub builder')
  .description('Программа для генерации содержимого сайта Marxhub')
  .version('0.1.0');

program.command('import')
  .description('Загрузка данных в БД sqlite')
  .option('-s, --source <string>', 'Каталог с исходными файлами', INPUT_PATH)
  .action((options) => {
    importInDb(options.source);
  });

program.command('export')
  .description('Экспорт данных из БД sqlite в страницы сайта')
  .option('-dest, --dest <string>', 'Каталог куда сохранять файлы', OUTPUT_PATH)
  .option('-s, --source <string>', 'Каталог с исходными файлами', INPUT_PATH)
  .action((options) => {
    exportFromDb(options.source, options.dest);
  });

program.parse();

function importInDb(sourcePath) {
  openDb();
  createSchema();

  console.log(`start parsing from path ${sourcePath}`);

  const inputFiles = fs.readdirSync(sourcePath);
  console.log('Input files: ' + inputFiles.length);

  for (const releaseFilename of inputFiles) {
    const fileContent = fs.readFileSync(path.join(sourcePath, releaseFilename), 'utf8');
    const release = load(fileContent);
    console.log(release);
  }

  console.log('finish parsing');
  closeDb();
}