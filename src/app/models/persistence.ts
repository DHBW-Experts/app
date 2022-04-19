import { Tag } from './tag';
import { TagValidation } from './tag-validation';
import { User } from './user';
import { alertController } from '@ionic/core';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../auth/login/login.page';

const API_BASE = 'https://dhbw-experts-api.azurewebsites.net';
export class Persistence {


  deleteTag(tagId: number) {
    deleteData('tags/' + tagId);
  }
  deleteUser(userId: number) {
    deleteData('users/' + userId);
  }
  removeUserFromContacts(contactOwnerUserId: number, toRemoveUserId: number) {
    deleteData('users/' + contactOwnerUserId + '/contacts/' + toRemoveUserId);
  }

  addUserToContacts(contactOwnerUserId: number, toAddUserId: number) {
    postData('users/' + contactOwnerUserId + '/contacts/add/' + toAddUserId);
  }
  getContactsByUserId(userId: number): Promise<User[]> {
    return fetch(API_BASE + '/users/' + userId + '/contacts')
      .then((res) => res.json())
      .then((res) => {
        return res as User[];
      });
  }
  getDistinctTagsByText(searchText: any): Promise<Tag[]> {
    return fetch(API_BASE + '/search/tags/' + searchText)
      .then((res) => res.json())
      .then((res) => {
        return res as Tag[];
      });
  }

  saveUserEmailToLocalStorage(email: string): void {
    const storage = new Storage();
    storage.create();
    storage.set('email', email);
  }

  async getUserEmailFromLocalStorage(): Promise<string> {
    const storage = new Storage();
    storage.create();
    let result = await storage.get('email');
    return result;
  }

  getUsersByTag(searchText: any): Promise<User[]> {
    return fetch(API_BASE + '/search/users/tags/' + searchText)
      .then((res) => res.json())
      .then((res) => {
        return res as User[];
      });
  }

  getUserByEmail(email: String): Promise<User> {
    return fetch(API_BASE + '/login/' + email)
      .then((res) => res.json())
      .then((res) => {
        return res as User;
      });
  }
  addTag(user: User, tagText: String): Promise<any> {
    return postData('users/' + user.userId + '/tags/add/' + tagText, user);
  }
  getTags(userId: number): Promise<Tag[]> {
    return fetch(API_BASE + '/users/' + userId + '/tags')
      .then((res) => res.json())
      .then((res) => {
        return res as Tag[];
      });
  }
  getTagValidation(tagId: number): Promise<TagValidation[]> {
    return fetch(API_BASE + '/tags/' + tagId + '/validations')
      .then((res) => res.json())
      .then((res) => {
        return res as TagValidation[];
      });
  }
  editUser(user: User): Promise<Number> {
    return postData('users/' + user.userId + '/edit', user);
  }

  registerUser(user: User) {
    const response = postData('register', user);
  }

  verifyUser(userId: number, verificationId: String) {
    putData('register/' + userId + '/' + verificationId);
  }

  getUserById(id: number): Promise<User> {
    return fetch(API_BASE + '/users/' + id)
      .then((res) => res.json())
      .then((res) => {
        return res as User;
      });
  }

  getUserByRFID(rfid: String): Promise<User> {
    return fetch(API_BASE + '/users/rfid/' + rfid)
      .then((res) => res.json())
      .then((res) => {
        return res as User;
      });
  }
}



async function postData(path = '', data = {}) {
  const response = await fetch(API_BASE + '/' + path, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  const status = String(response.status);
  if (!status.startsWith('2')) {
    console.log('Error while posting data, status code: ' + status);
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Fehler ' + status,
      buttons: ['Ok'],
    });
    await alert.present();   
  } else {
    console.log('success with status ' + status);
    return new Promise((number) => {
      number(200);
    });
  }
    return response.json();
}

async function putData(path = '', data = {}) {
  const response = await fetch(API_BASE + '/' + path, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  const status = String(response.status);

  if (!status.startsWith('2')) {
    console.log('Error while putting data, status code: ' + status);
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Fehler ' + status,
      buttons: ['Ok'],
    });
    await alert.present();
  } else {
    console.log('success' + status);
  }
  return response.json();
}

async function deleteData(path = '') {
  const response = await fetch(API_BASE + '/' + path, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });

  const status = String(response.status);

  if (!status.startsWith('2')) {
    console.log('Error while deleting data, status code: ' + status);
    const alert = await alertController.create({
      header: 'Fehler',
      message: 'Fehler ' + status,
      buttons: ['Ok'],
    });
    await alert.present();
  } else {
    console.log('success' + status);
  }
  return response.json();
}
