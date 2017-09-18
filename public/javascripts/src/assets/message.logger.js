export default class MessageLogger {
    constructor (selector) {
        this.msgContainer = document.querySelector(selector);

        this.initialize();
    }

    initialize () {
        window.addEventListener(
            'request.failed',
            this.showErrorMsg.bind(this)
        );

        window.addEventListener(
            'request.success',
            this.removeMsg.bind(this)
        );
    }

    createErrorMsg (msg) {
        return `<span class="message message--error">${msg}</span>`;
    }

    showErrorMsg (e) {
        let error = e.detail,
            msgHtml = this.createErrorMsg(error.message);

        this.removeMsg();

        this.msgContainer.innerHTML = msgHtml;
    }

    removeMsg () {
        if (this.msgContainer.childNodes.length) {
            this.msgContainer.removeChild(this.msgContainer.lastChild);
        }
    }
}