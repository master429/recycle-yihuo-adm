import {action, configure, observable} from 'mobx';

configure({enforceActions: 'observed'});
export default class Admin {

    @observable profile = {};

    get getProfile() {
        return this.profile;
    }

    @action setProfile(profile) {
        this.profile = profile;
    }
}
