import UserService from './assets/user.service';
import Validator from './assets/input.validator';
import FollowersList from './assets/followers.list';
import MessageLogger from './assets/message.logger';

import style from '../../stylesheets/src/shared.scss';

const INPUT_FIELD_ID = 'username';
const SUBMIT_BTN_ID = 'get-followers';
const LIST_SELECTOR = '.results-block__list';
const MSG_CONTAINER_SELECTOR = '.messages__wrapper';

class Task {
    constructor () {
        this.initialize();
    }

    initialize () {
        this.validator = new Validator(INPUT_FIELD_ID);
        this.userService = new UserService(SUBMIT_BTN_ID, this.validator);
        this.followersList = new FollowersList(LIST_SELECTOR);
        this.MsgLogger = new MessageLogger(MSG_CONTAINER_SELECTOR);
    }
}

new Task();