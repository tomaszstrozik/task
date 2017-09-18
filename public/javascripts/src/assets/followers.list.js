import style from '../../../stylesheets/src/followers-list.scss';

export default class FollowersList {
    constructor (listSelector) {
        this.listEl = document.querySelector(listSelector);

        this.initialize();
    }

    initialize () {
        window.addEventListener(
            'followers.create',
            this.renderList.bind(this)
        );

        window.addEventListener(
            'request.failed',
            this.removeList.bind(this)
        );
    }

    createList (data) {
        let html = data
            .map(result => {
                return `<li><span>follower: ${result.follower}, distance: ${result.distance}</span></li>`
            })
            .join('');
        
        return html;
    }

    removeList () {
        while (this.listEl.lastChild) {
            this.listEl.removeChild(this.listEl.lastChild);
        }
    }

    renderList (e) {
        var that = this,
        isListExist = this.listEl.childNodes.length;

        if (isListExist) {
            this.removeList();
        }

        let html = this.createList(e.detail);

        this.listEl.innerHTML = html;
    }
} 