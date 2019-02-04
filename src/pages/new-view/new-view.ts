import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, Modal, ToastController, NavController, normalizeURL } from 'ionic-angular';
import { SetCoordinatesPage } from '../set-coordinates/set-coordinates';
import { Camera } from '@ionic-native/camera/ngx';
import { NatureViewService } from '../../services/natureView.service';
import { NatureView } from '../../models/NatureView.model';

@Component({
  selector: 'page-new-view',
  templateUrl: 'new-view.html',
})
export class NewViewPage implements OnInit {

  natureViewForm: FormGroup;
  latitude: number;
  longitude: number;
  imageUrl: string;

  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private camera: Camera,
    private toastCtrl: ToastController,
    private natureViewService: NatureViewService,
    private navCtrl: NavController) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.natureViewForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  onOpenCoordsModal() {
    let modal: Modal;
    if (this.latitude) {
      modal = this.modalCtrl.create(
        SetCoordinatesPage,
        {latitude: this.latitude, longitude: this.longitude}
      );
    } else {
      modal = this.modalCtrl.create(
        SetCoordinatesPage
      );
    }
    modal.present();
    modal.onDidDismiss(
      (data) => {
        if (data) {
          this.latitude = data.latitude;
          this.longitude = data.longitude;
        }
      }
    );
  }

  onTakePhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then(
      (data) => {
        this.imageUrl = normalizeURL(data);
      }
    ).catch(
      (error) => {
        this.toastCtrl.create({
          message: error.message,
          duration: 3000,
          position: 'bottom'
        }).present();
      }
    );
  }

  onSubmitForm() {
    let newView = new NatureView(
      this.natureViewForm.get('name').value,
      new Date(),
      this.natureViewForm.get('description').value,
      this.latitude,
      this.longitude,
      this.imageUrl
    );
    this.natureViewService.addNatureView(newView);
    this.navCtrl.pop();
  }

}
