import { Inject, Injectable, EventEmitter } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Subject } from 'rxjs';

const USERS_KEY = 'local_user';
const FLASH_KEY = 'local_flash';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  user: any = null;
  flash: string = null;

  userChange: Subject<any> = new Subject<any>();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  init() {
    this.user = this.storage.get(USERS_KEY) || null;
    this.flash = this.storage.get(FLASH_KEY) || null;
  }

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
    this.userChange.next(this.user);
    this.storage.set(USERS_KEY, user);
  }

  clearUser() {
    this.user = null;
    this.storage.set(USERS_KEY, this.user);
  }
  
  getFlash() {
    return this.flash;
  }

  setFlash(message) {
    this.flash = message;
    this.storage.set(FLASH_KEY, message);
  }

  clearFlash() {
    this.flash = null;
    this.storage.set(FLASH_KEY, this.flash);
  }
}
