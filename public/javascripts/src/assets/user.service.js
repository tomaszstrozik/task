import axios from 'axios';

export default class UserService {

    constructor (submitBtnId, validator) {
        this.followersApiUrl = 'http://localhost:3000/followers/';
        this.submitBtnId = submitBtnId;
        this.validator = validator;

        this.initialize();
    }

    initialize () {

        this.btn = document.getElementById(this.submitBtnId);
        this.setListener();
    }

    setListener () {
        this.btn.addEventListener('click', this.submit.bind(this));
    }

    submit (e) {
        var that = this;

        e.preventDefault();

        if (this.validator.isValid()) {
            axios.get(this.followersApiUrl + this.validator.getValue())
                .then((response) => {
                    that.createResults(response);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    createResults (response) {
        let data = response.data;

        if (data.success) {
            this.successCallback(data);
        } else {
            this.errorCallback(data);
        };
    }

    successCallback (data) {
        let createListEvent = new CustomEvent('followers.create', { detail: data.results }),
            hideMsg = new CustomEvent('request.success');

        window.dispatchEvent(createListEvent);
        window.dispatchEvent(hideMsg);
    }

    errorCallback (data) {
        let showError = new CustomEvent('request.failed', { detail: data });

        window.dispatchEvent(showError);
    }
}