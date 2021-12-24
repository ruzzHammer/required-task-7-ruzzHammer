const MAX_DETAILS_USERS_SIZE = 3;

interface Person {
    id: number,
    name: string,
    friends: number[],
}

class User implements Person {
    id: number
    name: string
    friends: number[]
    popularity: number
    listItem: HTMLLIElement
    friendsUsers: User[]
    strangersUsers: User[]

    constructor(user: Person) {
        this.id = user.id;
        this.name = user.name;
        this.friends = user.friends;
        this.popularity = 0;
        
        this.createLI();
        this.listItem.addEventListener('click', () => this.openUser());
    }

    createLI(): void {
        const userLI = document.createElement('li');
        usersListEl.appendChild(userLI);
        userLI.id = String(this.id);
        userLI.insertAdjacentHTML('beforeend', `<strong>${this.name}</strong>`);
        this.listItem = userLI;
    }

    openUser(): void {
        this.listItem.classList.add('active');
        container.classList.add('details');
        activeUser = this;

        this.checkPopularity();
        this.updateUsers();
        this.createLists(); 
    }

    checkPopularity(): void {
        this.popularity++;
        if (!popularUsers.includes(this)) {
            
            if (popularUsers.length < MAX_DETAILS_USERS_SIZE) {
                popularUsers.push(this);
            } else if (popularUsers[MAX_DETAILS_USERS_SIZE - 1].popularity < this.popularity) {
                popularUsers.splice(MAX_DETAILS_USERS_SIZE - 1, 1, this);
            }

        }
        popularUsers.sort((a, b) => b.popularity - a.popularity);
    }

    updateUsers(): void {
        this.friendsUsers = users.filter(user => this.friends.find(id => id === user.id));
        this.strangersUsers = users.filter(user => user !== this && !this.friendsUsers.includes(user)).
                                    sort(() => 0.5 - Math.random());

        this.friendsUsers.length = MAX_DETAILS_USERS_SIZE;
        this.strangersUsers.length = MAX_DETAILS_USERS_SIZE;
    }

    createLists(): void {
        this.createList(this.friendsUsers, friendsListEl);
        this.createList(this.strangersUsers, strangersListEl);
        this.createList(popularUsers, popularListEl);
    }

    createList(users: User[], element: Element | Node): void {
        const fragment = document.createDocumentFragment();
        users.forEach(user => {
            createDetailsLI(user.name, fragment);
        })
        element.appendChild(fragment);
    }
}

function createDetailsLI(name: string, el: Node): void {
    const clone = detailsItemTemplate.content.cloneNode(true) as Element;
    const nameSpace = clone.querySelector('span');
    nameSpace.innerText = name;
    el.appendChild(clone);
}

let users: User[];
let activeUser: User = null;
const popularUsers: User[] = [];

// HTMLElements
const container:       HTMLDivElement   = document.querySelector('#container');

const usersListEl:     HTMLUListElement = document.querySelector('.list-view .contacts-list');
const friendsListEl:   HTMLUListElement = document.querySelector('#friends');
const strangersListEl: HTMLUListElement = document.querySelector('#strangers');
const popularListEl:   HTMLUListElement = document.querySelector('#popular');

const detailsListsEls = document.querySelectorAll('#detailsList ul');
const backButton: HTMLDivElement = document.querySelector('.back');
const detailsItemTemplate: HTMLTemplateElement = document.querySelector('#detailsItem');

(async () => {
    try {
        const dataResponse = await fetch('data.json');
        const persons = await dataResponse.json() as Person[];
        users = persons.map(person => new User(person));
    } catch {
        throw new Error('Данные не были получены');
    }
})();

function clearDetailsLists(): void {
    detailsListsEls.forEach(listEl => {
        while (listEl.children.length > 1) {
            listEl.removeChild(listEl.lastChild);
        }
    })
}

backButton.addEventListener('click', (): void => {
    if (container.classList.contains('details')) {
        container.classList.remove('details');
        activeUser.listItem.classList.remove('active');
        clearDetailsLists();
    } 
})
