# Contacts List

[Ссылка на API](https://github.com/loki87by/contacts-list-api).

## Технологии используемые в проекте:
- React
- TypeScript
- Redux
- Webpack
- eslint
- Методология БЭМ

## Руководство по использованию:
- Режим редактирования открывается нажатием на кнопку с изображением карандаша. На экранах шире 768 пикселей она появляется при наведении на поле, которое нуждается в редактировании. На экранах меньшей ширины она появляется после тапа\клика по полю, которое нужно отредактировать.
- Чтобы удалить контакт нужно вызвать контекстное меню. Для этого на экранах шире 768 пикселей нужно нажать правой кнопкой мыши на удаляемом контакте. На меньших экранах контекстное меню вызывается лонгтапом или удержанием левой кнопки мыши.
- Остальной функционал интуитивно понятен

## Установка и запуск

Для начала нужно запустить сервер. Сам сервер и описание его запуска находится [здесь](https://github.com/loki87by/contacts-list-api).
После этого, не закрывая окно в котором запущен сервер:

- Можно запустить задеплоенную версию по [этой ссылке](https://loki87by.github.io/contact-list/).

ИЛИ

## Запуск локально:
- Используйте `node 12.x` или выше.
- Откройте командную строку (`PowerShell`, `Git Bash`, и.т.п.)
- Клонируйте данный репозиторий: `$ git clone https://github.com/loki87by/contacts-list.git`.
- Перейдите в загруженную папку: `$ cd contacts-list`.
- Установите зависимости: `$ npm install`.
- Запуск приложения: `$ npm start`.
- После страница будет доступна по адресу: `http://localhost:8080/`
