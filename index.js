const telegramBot = require("node-telegram-bot-api")

const token = "6241656623:AAGbZ0Pm7Oh9WeBtllEhvG_CPyVV_Kq6pLA"

const bot = new telegramBot(token, { polling: true })
const chats = {}
const gameOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "1", callback_data: "1" }, { text: "2", callback_data: "2" }, { text: "3", callback_data: "3" }],
            [{ text: "4", callback_data: "4" }, { text: "5", callback_data: "5" }, { text: "6", callback_data: "6" }],
            [{ text: "7", callback_data: "7" }, { text: "8", callback_data: "8" }, { text: "9", callback_data: "9" }],
            [{ text: "0", callback_data: "0" }]

        ]
    })
}
const againOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Новая игра", callback_data: "/again" },]

        ]
    })
}
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю число от 0 до 9, а ты попробуй его отгадать!")
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId, "Отгадывай!", gameOption)

}



const start = () => {
    bot.setMyCommands([
        { command: "/start", description: "Начало" },
        { command: "/game", description: "Игра" }
    ])

    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === "/start") {
            await bot.sendMessage(chatId, `Добро пожаловать, ${msg.chat.first_name}!`);
            return bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/3d2/135/3d213551-8cac-45b4-bdf3-e24a81b50526/1.webp")
        }

        if (text === "/game") {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!")
    })

    bot.on("callback_query", msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === "/again") {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, "Поздравляю, верно!", againOption)
        } else {
            return bot.sendMessage(chatId, `К сожалению нет, я загадал число ${chats[chatId]}`, againOption)
        }

    })

}
start()