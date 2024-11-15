import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';

// Fake UserProfile Data
const fakeUserProfile = {
  profileImage: 'https://via.placeholder.com/150',
  email: 'example@example.com',
  line: 'lineId123',
  firstNameTH: 'ชื่อ',
  lastNameTH: 'นามสกุล',
  firstNameEN: 'FirstName',
  lastNameEN: 'LastName',
  phone: '0812345678',
  address: '123 Address Street',
  updated_at: new Date(),
};

const thaiNameValidator = /^[ก-๏\s]+$/;
const thaiSurnameValidator = /^[ก-๏\s]+$/;
const englishNameValidator = /^[A-Za-z\s]+$/;
const englishSurnameValidator = /^[A-Za-z\s]+$/;
const phoneValidator = /^[0-9]{10}$/;
const addressValidator = /^[a-zA-Z0-9\sก-๏,.-/]+$/;
const lineIdValidator = /^[\w-.@]{1,100}$/;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  images: any;
  selectedImageURL: string | undefined;

  updateForm: FormGroup;
  user: any = fakeUserProfile; // Use fake data here

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private titleService: Title
  ) {
    this.updateForm = this.formBuilder.group({
      profileImage: '',
      line: ['', [Validators.required, Validators.pattern(lineIdValidator)]],
      firstNameTH: ['', [Validators.required, Validators.pattern(thaiNameValidator)]],
      lastNameTH: ['', [Validators.required, Validators.pattern(thaiSurnameValidator)]],
      firstNameEN: ['', [Validators.required, Validators.pattern(englishNameValidator)]],
      lastNameEN: ['', [Validators.required, Validators.pattern(englishSurnameValidator)]],
      phone: ['', [Validators.required, Validators.pattern(phoneValidator)]],
      address: ['', [Validators.required, Validators.pattern(addressValidator)]],
      updated_at: new Date(),
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Profile');
    this.fetchUserData(); // Simulate fetching data with fake data
  }

  // Simulating fetching user data
  fetchUserData(): void {
    // Use fake data directly
    this.user = fakeUserProfile;
    this.setFormValuesFromUserData();
  }

  private setFormValuesFromUserData(): void {
    this.updateForm.patchValue({
      profileImage: this.user.profileImage,
      line: this.user.line,
      firstNameTH: this.user.firstNameTH,
      lastNameTH: this.user.lastNameTH,
      firstNameEN: this.user.firstNameEN,
      lastNameEN: this.user.lastNameEN,
      phone: this.user.phone,
      address: this.user.address,
    });
  }

  private updateUserWithNewData(updatedData: any): void {
    this.user = { ...this.user, ...updatedData };
  }

  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      this.selectedImageURL = URL.createObjectURL(file);
    } else {
      const fileName = event.target.value;
    }
  }

  visible: boolean = false;

  showConfirm() {
    if (!this.visible) {
      this.messageService.add({
        key: 'confirm',
        sticky: true,
        severity: 'warn',
        summary: 'Are you sure?',
        detail: 'Confirm to proceed',
      });
      this.visible = true;
    }
  }

  // Simulate updating profile with fake data
  updateProfile() {
    const phoneRegex = /[^0-9]/g;
    const updatedData = {
      ...this.updateForm.value,
      phone: this.updateForm.value.phone
        ? this.updateForm.value.phone.replace(phoneRegex, '')
        : '',
    };

    const formData = new FormData();
    if (this.images) {
      formData.append('file', this.images);
    }

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== null && updatedData[key] !== undefined) {
        formData.append(key, updatedData[key]);
      }
    });

    // Simulating successful API response
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully',
    });

    this.updateUserWithNewData(updatedData);
    this.user.updated_at = new Date();

    this.messageService.clear('confirm');
    this.visible = false;
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'Error updating profile',
    });
    this.visible = false;
  }
}