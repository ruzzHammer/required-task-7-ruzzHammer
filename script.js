var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MAX_DETAILS_USERS_SIZE = 3;
class User {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.friends = user.friends;
        this.popularity = 0;
        this.createLI();
        this.listItem.addEventListener('click', () => this.openUser());
    }
    createLI() {
        const userLI = document.createElement('li');
        usersListEl.appendChild(userLI);
        userLI.id = String(this.id);
        userLI.insertAdjacentHTML('beforeend', `<strong>${this.name}</strong>`);
        this.listItem = userLI;
    }
    openUser() {
        this.listItem.classList.add('active');
        container.classList.add('details');
        activeUser = this;
        this.checkPopularity();
        this.updateUsers();
        this.createLists();
    }
    checkPopularity() {
        this.popularity++;
        if (!popularUsers.includes(this)) {
            if (popularUsers.length < MAX_DETAILS_USERS_SIZE) {
                popularUsers.push(this);
            }
            else if (popularUsers[MAX_DETAILS_USERS_SIZE - 1].popularity < this.popularity) {
                popularUsers.splice(MAX_DETAILS_USERS_SIZE - 1, 1, this);
            }
        }
        popularUsers.sort((a, b) => b.popularity - a.popularity);
    }
    updateUsers() {
        this.friendsUsers = users.filter(user => this.friends.find(id => id === user.id));
        this.strangersUsers = users.filter(user => user !== this && !this.friendsUsers.includes(user)).
            sort(() => 0.5 - Math.random());
        this.friendsUsers.length = MAX_DETAILS_USERS_SIZE;
        this.strangersUsers.length = MAX_DETAILS_USERS_SIZE;
    }
    createLists() {
        this.createList(this.friendsUsers, friendsListEl);
        this.createList(this.strangersUsers, strangersListEl);
        this.createList(popularUsers, popularListEl);
    }
    createList(users, element) {
        const fragment = document.createDocumentFragment();
        users.forEach(user => {
            createDetailsLI(user.name, fragment);
        });
        element.appendChild(fragment);
    }
}
function createDetailsLI(name, el) {
    const clone = detailsItemTemplate.content.cloneNode(true);
    const nameSpace = clone.querySelector('span');
    nameSpace.innerText = name;
    el.appendChild(clone);
}
let users;
let activeUser = null;
const popularUsers = [];
const container = document.querySelector('#container');
const usersListEl = document.querySelector('.list-view .contacts-list');
const friendsListEl = document.querySelector('#friends');
const strangersListEl = document.querySelector('#strangers');
const popularListEl = document.querySelector('#popular');
const detailsListsEls = document.querySelectorAll('#detailsList ul');
const backButton = document.querySelector('.back');
const detailsItemTemplate = document.querySelector('#detailsItem');
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const dataResponse = yield fetch('data.json');
        const persons = yield dataResponse.json();
        users = persons.map(person => new User(person));
    }
    catch (_a) {
        throw new Error('Данные не были получены');
    }
}))();
function clearDetailsLists() {
    detailsListsEls.forEach(listEl => {
        while (listEl.children.length > 1) {
            listEl.removeChild(listEl.lastChild);
        }
    });
}
backButton.addEventListener('click', () => {
    if (container.classList.contains('details')) {
        container.classList.remove('details');
        activeUser.listItem.classList.remove('active');
        clearDetailsLists();
    }
});
