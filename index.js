//tes
const TelegramApi = require("node-telegram-bot-api");
const token = "5507429366:AAEgdPgiUC7iz2mkhXxA37A209Ewc22rFKA";

// const weather = await new AsyncWeather();
const apiKey = "575dfdf79af8c871fffbeab5537ce8c0";
const weather = require("openweather-apis");
weather.setAPPID(apiKey);

const bot = new TelegramApi(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard:[
      [{text: 'Current weather', callback_data: '/current'}]
    ]
  })
}

const sendCurrentWeather = async (chatId) => {
  weather.setLang("en");
  weather.setCity("Kosice");
  weather.getAllWeather(function (err, result) {
        bot.sendMessage(
          chatId,
          "The weather in Kosice right now is as follows:"
        );
        bot.sendMessage(
          chatId,
          `Temperature: ${result.main.temp} and feels like ${result.main.feels_like}`
        );
        bot.sendMessage(
          chatId,
          `Description of the weather: ${result.weather[0].description}`
        );
        bot.sendMessage(chatId, `Humidity: ${result.main.humidity}`);
  });
}

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Start the bot" },
    { command: "/current", description: "Show current weather"}
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        "Hi. I'm your new assistant. For now I only can send you the current weather in your location, but soon I will learn other useful skills!",
        options
      );
    } else if (text === "/current") {
      return sendCurrentWeather(chatId);
    }else{
      await bot.sendMessage(chatId, "Sorry, I don't know that command yet.");
    }
  });

  bot.on('callback_query', msg=>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    console.log(data);
    if(data === '/current'){
      return sendCurrentWeather(chatId);
    }
    console.log(msg);
  })
};

start();
