import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';

import Cropper = require('cropperjs');

@Component({
  moduleId: module.id,
  selector: 'bs-image-uploader',
  templateUrl: 'image-uploader.component.html'
})
export class ImageUploaderComponent {
  protected _file: any;
  protected _cropperModal: ModalDirective;
  protected _cropper: Cropper;
  protected _cropped: any;
  protected _imageUploaded: EventEmitter<any> = new EventEmitter<any>();
  protected _inputFile: any;

  @ViewChild('cropperModal')
  public set cropperModal(value: ModalDirective) {
    this._cropperModal = value;
  }

  @ViewChild('choosePictureInput')
  public set inputFile(value: any) {
    this._inputFile = value;
  }

  public get file(): any {
    return this._file;
  }

  @Input()
  public set file(value: any) {
    this._file = value;
  }

  public get cropped(): any {
    return this._cropped;
  }

  @Output()
  public get imageUploaded(): any {
    return this._imageUploaded;
  }

  constructor(private _element: ElementRef) {
  }

  public onPictureUpload(event: any) {
    let eventObj = <MSInputMethodContext>event;
    let target = <HTMLInputElement>eventObj.target;
    this._file = target.files[0];

    this._update();

    this._cropperModal.onHide.subscribe(() => {
      this._inputFile.nativeElement.value = '';
    });
  }

  public savePicture() {
    this._imageUploaded.emit(this._cropped);
    this._cropperModal.hide();
  }

  protected _update() {
    if (this._file) {
      this._createImageFromBlob(this._file).subscribe((picture: string) => {
        let image = this._element.nativeElement.querySelector('img');
        image.src = picture;
        if (!this._cropper) {
          this._createCropper(image);
        } else {
          this._cropper.replace(picture);
        }
      });
    }
  }

  protected _createImageFromBlob(image: Blob) {
    let obs = new Observable((observer) => {
      let reader = new FileReader();

      reader.addEventListener('load', () => {
        observer.next(reader.result);
        observer.complete();
      }, false);

      reader.addEventListener('error', () => {
        observer.error();
      }, false);

      reader.readAsDataURL(image);
    });

    return obs;
  }

  protected _createCropper(image: any) {
    this._cropper = new Cropper(image, {
      minCanvasWidth: 300,
      minContainerWidth: 300,
      minCanvasHeight: 200,
      minContainerHeight: 200,
      minCropBoxHeight: 10,
      minCropBoxWidth: 10,
      viewMode: 2,
      autoCropArea: 0.5,
      aspectRatio: 1 / 1,
      crop: (e) =>
        this._cropped = this._cropper.getCroppedCanvas({
          fillColor: '#ffffff'
        }).toDataURL('image/jpeg')
    });
  }
}