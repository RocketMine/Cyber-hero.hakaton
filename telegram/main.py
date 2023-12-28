import telebot
from telebot import types
import time

bot = telebot.TeleBot('6866783136:AAFHCQPKp13ElD7ErgXLti9ztJQuQLxTxUQ')


@bot.message_handler(commands=['start'])
def start(message):
    markup = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    item1 = types.KeyboardButton("Спасибо, деньги уже пришли")
    item2 = types.KeyboardButton("Ура, сейчас отправлю")
    item3 = types.KeyboardButton("Вау! Хочу узнать подробности")
    markup.add(item1, item2, item3)

    bot.send_message(message.chat.id, "Вы выиграли! Отправьте данные вашей карты!", reply_markup=markup)


@bot.message_handler(func=lambda message: True)
def handle_messages(message):
    if message.text == "Спасибо, деньги уже пришли":
        bot.send_message(message.chat.id, "Хороший ответ! Вас не так легко провести.")
    elif message.text == "Ура, сейчас отправлю":
        bot.send_message(message.chat.id, "Так нельзя отвечать! Вы будете обмануты.\n"
                                          "Ваш номер телефона заблокирован. Для разблокировки отправьте 100$ на номер +123456789.")
    elif message.text == "Вау! Хочу узнать подробности":
        bot.send_message(message.chat.id, "Так нельзя! Вы рискуете стать жертвой мошенничества. "
                                          "Помните, что никто не раздает деньги так просто.\n"
                                          "Введение ваших данных может привести к серьезным последствиям.")

        # Вызываем вторую часть кода после успешного выполнения первой
        second_part(message)


def second_part(message):
    markup = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    item1 = types.KeyboardButton("Да, я готов!")
    item2 = types.KeyboardButton("Нет, спасибо.")
    item3 = types.KeyboardButton("Я сообщу в полицию.")
    markup.add(item1, item2, item3)

    bot.send_message(message.chat.id,
                     "Привет! Вы получили звонок от представителя банка, который говорит, что средства нужно перевести с основного счета. "
                     "Как вы поступите?", reply_markup=markup)


@bot.message_handler(func=lambda message: True)
def handle_second_part(message):
    if message.text == "Да, я готов!":
        bot.send_message(message.chat.id,
                         "Осторожнее! Банк никогда не будет просить вас перевести деньги с основного счета по телефону. "
                         "Это может быть мошенническая попытка. Никогда не раскрывайте личные данные или банковскую информацию по телефону.")
    elif message.text == "Нет, спасибо.":
        bot.send_message(message.chat.id,
                         "Правильное решение! Если вам что-то кажется подозрительным, лучше отказаться и проверить информацию непосредственно в вашем банке.")
    elif message.text == "Я сообщу в полицию.":
        bot.send_message(message.chat.id,
                         "Отлично! Если у вас есть подозрения на мошенничество, необходимо немедленно сообщить в полицию. "
                         "Это поможет предотвратить преступления и защитит других людей от мошеннических действий.")

        third_part(message)


def third_part(message):
    markup = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    item1 = types.KeyboardButton("Перейти по ссылке и ввести данные")
    item2 = types.KeyboardButton("Игнорировать и удалить письмо")
    item3 = types.KeyboardButton("Связаться с техподдержкой по официальным каналам")
    markup.add(item1, item2, item3)

    bot.send_message(message.chat.id,
                     "Вы получили электронное письмо с подозрительной ссылкой, в котором просят вас ввести личные данные. "
                     "Как вы поступите?", reply_markup=markup)


@bot.message_handler(func=lambda message: True)
def handle_third_part(message):
    if message.text == "Перейти по ссылке и ввести данные":
        bot.send_message(message.chat.id,
                         "Осторожнее! Никогда не переходите по подозрительным ссылкам и не предоставляйте личные данные в письмах. "
                         "Это может быть попытка мошенничества. Лучше удалите письмо и сообщите об этом техподдержке.")
    elif message.text == "Игнорировать и удалить письмо":
        bot.send_message(message.chat.id,
                         "Правильное решение! Если вам приходит подозрительное письмо, лучше его проигнорировать и удалить, чтобы избежать рисков.")
    elif message.text == "Связаться с техподдержкой по официальным каналам":
        bot.send_message(message.chat.id,
                         "Отлично! Если у вас есть подозрения по поводу электронного письма, лучше связаться с техподдержкой банка по официальным каналам связи, "
                         "а не отвечать на подозрительные письма.")


while True:
    try:
        bot.polling(none_stop=True)

    except Exception as e:
        print(e)
        time.sleep(15)
