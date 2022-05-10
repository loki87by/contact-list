export const BASIC_USER_DATA = ['name', 'avatar', 'email'];
export const BASIC_USER_INPUT_TYPES = ['text', 'url', 'email'];
export const BASIC_USER_DATA_TRANSLATES = ['Введите ваше имя', 'Установить аватар', ''];
export const ADVANCED_USER_DATA = ['name', 'email', 'quote'];
export const ADVANCED_USER_DATA_TRANSLATES = ['Пользователь еще не установил имя', 'Пользователь еще не установил email', 'Добавить заметку'];
export const FULL_USER_DATA = ['name', 'email', 'avatar', 'quote', 'phone1', 'phone2', 'phone3', 'phone4', 'phone5'];
export const FULL_USER_DATA_INPUT_TYPES = ['text', 'email', 'url', 'text', 'number', 'number', 'number', 'number', 'number'];
export const FULL_USER_DATA_INPUT_LABELS = ['Имя', 'Email', 'Url изображения', 'Текст заметки', 'Номер телефона', 'Номер телефона', 'Номер телефона', 'Номер телефона', 'Номер телефона'];

export const getRandomColor = (index: number): void|string =>  {
  let firstNumber = index
  const secondNumber = index + 1
  let string = `#${index}`
  function addSymbols(): void|string {
    if(string.length < 7) {
    const newNumber = firstNumber * secondNumber
    string += `${newNumber}`
    firstNumber = newNumber
    return addSymbols()
    } else {
      const result = string.slice(0, 7)
      return result
    }
  }
    return addSymbols()
}
