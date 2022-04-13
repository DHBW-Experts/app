import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { alertController } from '@ionic/core';
import { LoginPage } from 'src/app/auth/login/login.page';
import { Persistence } from 'src/app/models/persistence';
import { Tag } from 'src/app/models/tag';
import { TagValidation } from 'src/app/models/tag-validation';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-view-foreign-profile',
  templateUrl: './view-foreign-profile.page.html',
  styleUrls: ['./view-foreign-profile.page.scss'],
})
export class ViewForeignProfilePage implements OnInit {
  user: User;
  tags: Tag[];
  tagValidations = [];
  isDataAvailable: boolean = false;
  isUserInContacts: boolean = false;
  contacts: User[];
  isUserLoggedInUser: boolean;
  isTagSelected: boolean = false;
  selectedTag: Tag;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {}

  ionViewWillEnter() {
    const persistence = new Persistence();
    const userId = +this.route.snapshot.paramMap.get('id');
    const userPromise = persistence.getUserById(userId);
    userPromise.then((result) => {
      this.user = result;
      this.isDataAvailable = true;
      const contactsPromise = persistence.getContactsByUserId(
        LoginPage.user.userId
      );
      contactsPromise.then((result) => {
        this.contacts = result;
        if (LoginPage.user.userId === this.user.userId) {
          this.isUserLoggedInUser = true;
          return;
        }
        this.isUserInContacts = this.contacts.some(
          (element) => element.userId === this.user.userId
        );
      });
    });

    const tagPromise = persistence.getTags(userId);
    tagPromise.then((result) => {
      this.tags = result;
    });
  }

  tagSelected(tag: Tag) {
    this.isTagSelected = true;
    this.selectedTag = tag;
    let persistence = new Persistence();
    const tagValidationsPromise = persistence.getTagValidation(tag.tagId);
    tagValidationsPromise.then((result) => {
      this.tagValidations = result.map((validation) => validation.comment);
    });
  }
  addContact() {
    const persistence = new Persistence();
    persistence.addUserToContacts(LoginPage.user.userId, this.user.userId);
  }
  removeContact() {
    const persistence = new Persistence();
    persistence.removeUserFromContacts(LoginPage.user.userId, this.user.userId);
  }
  async addValidation() {
    const persistence = new Persistence();
    const alert = await alertController.create({
      cssClass: 'my-custom-class',
      header: 'Kommentar eingeben',
      inputs: [
        {
          name: 'tagText',
          type: 'text',
          label: 'tagText',
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (alertData) => {
            //todo persistence.addTagValidatio();
          },
        },
      ],
    });
    await alert.present();
  }
}
