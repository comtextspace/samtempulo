import { Command } from 'commander';

import {importInDb} from './source/command.js';

const INPUT_PATH = './data/';
const OUTPUT_PATH = './docs/';
const DB_FILENAME = './db.sqlite3';

const program = new Command();

program
  .name('MarxHub builder')
  .description('Программа для генерации содержимого сайта Marxhub')
  .version('0.1.0');

program.command('import')
  .description('Загрузка данных в БД sqlite')
  .option('-s, --source <string>', 'Каталог с исходными файлами', INPUT_PATH)
  .action((options) => {
    importCommand(options.source, DB_FILENAME);
  });

program.command('export')
  .description('Экспорт данных из БД sqlite в страницы сайта')
  .option('-dest, --dest <string>', 'Каталог куда сохранять файлы', OUTPUT_PATH)
  .option('-s, --source <string>', 'Каталог с исходными файлами', INPUT_PATH)
  .action((options) => {
    exportFromDb(options.source, options.dest);
  });

program.parse();

function importCommand(sourcePath, dbFilename) {
  console.log(`start import from path ${sourcePath}`);

  importInDb(sourcePath, dbFilename);
    
  console.log('finish import');
}

