# MarxHub

Для запуска потребуются

* [Node.js](https://nodejs.org/en) > v20
* [Yarn](https://yarnpkg.com/) > v1.22
* [Make](https://www.gnu.org/software/make/manual/)

Проверка проверялся на Linux, совместимость с другими операционными системами не гарантирована.

Установка

```
make install
```

Импорт данных в базу данных sqlite3:

```
make import
```

Экспорт данных в Markdown файлы

```
make export
```

Запуск сайта

```
make dev-site
```

Запуск тестов

```
make test
```

Исходные данные находятся в каталоге `data`, каталог сайта `docs`.

Как добавить в проект изменения написано в [contributing.md](contributing.md).