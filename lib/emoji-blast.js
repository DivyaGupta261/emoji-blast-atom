'use babel';

import EmojiBlastView from './emoji-blast-view';
import { CompositeDisposable } from 'atom';

export default {

  emojiBlastView: null,
  emojiBlastDecoration: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.emojiBlastView = new EmojiBlastView(state.emojiBlastViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.emojiBlastView.getElement(),
      visible: false
    });

    this.thinking = false;
    this.workedTime = new Date();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'emoji-blast:toggle': () => this.toggle(),
      'emoji-blast:dance': () => this.dance(),
      'emoji-blast:rocket': () => this.rocket(),
      'emoji-blast:sleepy': () => this.sleepy(),
      'emoji-blast:laugh': () => this.laugh(),
      'emoji-blast:tongueOut': () => this.tongueOut(),
      'emoji-blast:poop': () => this.poop(),
      'emoji-blast:cry': () => this.cry(),
      'emoji-blast:quirky': () => this.quirky(),
      'emoji-blast:think': () => this.think()
    }));

    setInterval( () => {
      let now = new Date();
      if (((now - this.workedTime)/ 1000) > 90) {
        this.think();
        this.thinking = true;
      }
    }, 10000);

    atom.workspace.observeTextEditors(editor => {
      editor.observeCursors (cursor => {
        cursor.onDidChangePosition (event => {

          if(this.thinking) {
            this.checkIfExists('think');
          }

          this.thinking = false;
          this.workedTime = new Date();

          let reactions = {
            dance: ["[dD]ivya", "[dD]ance", "[yY]aay"],
            rocket: ["rock", "launch"],
            sleepy: ["[sS]leepy"],
            laugh: ["[lL]ol"],
            tongueOut: ["\:[pP]"],
            poop: ["poo"],
            cry: ["cry"],
            quirky: ["quirk"],
            think: ["think"]
          }
          //TODO use the hashmap.
          if (
            event.cursor.isInsideWord({ wordRegex: "[dD]ivya" }) ||
            event.cursor.isInsideWord({ wordRegex: "[dD]ance" }) ||
            event.cursor.isInsideWord({ wordRegex: "[yY]aay" })
          ) {
            this.decorateEmojiMarker('dance',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "[sS]leepy" })) {
            this.decorateEmojiMarker('sleepy',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "[lL]ol" })) {
            this.decorateEmojiMarker('laugh',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "\:[pP]" })) {
            this.decorateEmojiMarker('tongueOut',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "poo" })) {
            this.decorateEmojiMarker('poop',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "cry" })) {
            this.decorateEmojiMarker('cry',editor, event)
          }
          else if (
            event.cursor.isInsideWord({ wordRegex: "[rR]ock" }) ||
            event.cursor.isInsideWord({ wordRegex: "[lL]aunch" })
          ) {
            this.decorateEmojiMarker('rocket',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "quirk" })) {
            this.decorateEmojiMarker('quirky',editor, event)
          }
          else if (event.cursor.isInsideWord({ wordRegex: "[tT]hink" })) {
            this.decorateEmojiMarker('think',editor, event)
          }
          else {
            if (this.emojiBlastDecoration) {
              this.emojiBlastDecoration.destroy()
            }
          }
        })
      })
    })

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.emojiBlastView.destroy();
  },

  serialize() {
    return {
      emojiBlastViewState: this.emojiBlastView.serialize()
    };
  },

  toggle() {
  },

  decorateEmojiMarker(name, editor, event) {
    let element = this.getEmoji(name);
    this.emojiBlastDecoration = editor.decorateMarker(event.cursor.getMarker(), {
      type: 'overlay',
      class: 'my-line-class',
      item:element
    })
  },

  dance() {
    this.createEmoji('dance');
  },

  cry() {
    this.createEmoji('cry');
  },

  quirky() {
    this.createEmoji('quirky');
  },

  poop() {
    this.createEmoji('poop');
  },

  rocket() {
    this.createEmoji('rocket');
  },

  sleepy() {
    this.createEmoji('sleepy');
  },

  laugh() {
    this.createEmoji('laugh');
  },

  tongueOut() {
    this.createEmoji('tongue-out');
  },

  think() {
    this.createEmoji('think');
  },

  checkIfExists(name) {
    let emojiBlastElements = document.getElementsByClassName('emoji-blast');

    if (emojiBlastElements.length > 0 ) {
      if (!(this.checkIfEmojiExists(name, emojiBlastElements[0]))) {
        return false;
      }
      emojiBlastElements[0].remove();
      return true;
    }
    return false;
  },

  checkIfEmojiExists(name, emojiElement) {
    if (emojiElement.getElementsByClassName(name).length > 0) {
      return true;
    }
    return false;
  },

  createEmoji(name) {
    if (this.checkIfExists(name)) {
      return;
    }
    let workspace = atom.workspace.getActivePane().getElement()
    let element = this.getEmoji(name);

    workspace.appendChild(element);

  },

  getEmoji(name) {
    return this.emojiBlastView.getElement(name);
  }

};
