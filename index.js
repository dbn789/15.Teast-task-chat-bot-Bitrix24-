const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT
const url = process.env.URL
const clientId = process.env.CLIENT_ID

const getData = async (apiMethod, options = {}) => {
    try {
        const response = await axios.post(`${url}${apiMethod}.json?`, options)
        return response.data
    } catch (e) {
        console.log('Error', e)
    }
}

const begin = async () => {
    let phrase = ''
    const requestData = {
        'CHAT_ID': 1,
        'CLIENT_ID': clientId,
    }
    let data = await getData('imbot.register', {
        'CODE': 'TestTaskBot', // Строковой идентификатор бота, уникальный в рамках вашего приложения (обяз.)
        'TYPE': 'B', // Тип, B – чат-бот, ответы поступают сразу, O – чат-бот для Открытых линий, S – чат-бот с повышенными привилегиями (supervisor)
        'EVENT_HANDLER': 'http://www.hazz/chatApi/event.php', // Ссылка на обработчик событий, поступивших от сервера - см. Обработчики событий ниже (обяз).
        'OPENLINE': 'Y', // Включение режима поддержки Открытых линий, можно не указывать, если TYPE = 'O'
        'CLIENT_ID': clientId, // строковый идентификатор, используется только в режиме Вебхуков
        'PROPERTIES': { // Личные данные чат-бота (обяз.)
            'NAME': 'TestTaskBot', // Имя чат-бота (обязательное одно из полей NAME или LAST_NAME)
            'LAST_NAME': '', // Фамилия (обязательное одно из полей NAME или LAST_NAME)
            'COLOR': 'AQUA', // Цвет для мобильного приложения RED, GREEN, MINT, LIGHT_BLUE, DARK_BLUE, PURPLE, AQUA, PINK, LIME, BROWN,  AZURE, KHAKI, SAND, MARENGO, GRAY, GRAPHITE
            'EMAIL': 'test@test.ru', // E-mail для связи. НЕЛЬЗЯ использовать e-mail, дублирующий e-mail реальных пользователей
            'PERSONAL_BIRTHDAY': '2024-09-09', // День рождения в формате YYYY-mm-dd
            'WORK_POSITION': 'Лучший сотрудник', // Занимаемая должность, используется как описание чат-бота
            'PERSONAL_WWW': '', // Ссылка на сайт
            'PERSONAL_GENDER': 'F', // Пол, допустимые значения M – мужской, F – женский, пусто, если не требуется указывать
            'PERSONAL_PHOTO': process.env.BASE_64, // Аватар - base64
        }
    })

    const timestamp = Math.round(data.time.start)
    const date = new Date(timestamp * 1000)
    const hour = +date.getHours()

    if (hour < 11) phrase = 'Доброе утро!'
    if (hour >= 11 && hour < 17) phrase = 'Добрый день!'
    if (hour >= 17) phrase = 'Добрый вечер!'

    requestData['BOT_ID'] = +data.result
    requestData['DIALOG_ID'] = '1'
    requestData['MESSAGE'] = phrase

    await getData('imbot.message.add', requestData)

    setTimeout(async () => {
        data = await getData('imbot.unregister', requestData)
        console.log(data)
    }, 20000)

}

app.listen(PORT, () => {
    begin()
})