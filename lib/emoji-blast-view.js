'use babel';

export default class EmojiBlastView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('emoji-blast');

    this.emojiElement =

    // Create message element
    this.emojiElement =  document.createElement('div');
    this.emojiElement.classList.add('emoji');
    this.emojiElement.classList.add('dance');

    this.element.appendChild(this.emojiElement);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement(className) {
    this.emojiElement.classList.value = "";
    this.emojiElement.classList.add('emoji');
    this.emojiElement.classList.add(className);

    return this.element;
  }

}
