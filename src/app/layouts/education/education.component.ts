import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

interface EducationInfo {
  education_id: string;
  syear: number;
  eyear: number;
  level_edu: string;
  universe: string;
  faculty: string;
  branch: string;
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  providers: [MessageService],
})
export class EducationComponent implements OnInit {
  education: EducationInfo[] = [
    {
      education_id: '1',
      syear: 2015,
      eyear: 2019,
      level_edu: 'Bachelor',
      universe: 'ABC University',
      faculty: 'Engineering',
      branch: 'Computer Science',
    },
    {
      education_id: '2',
      syear: 2020,
      eyear: 2022,
      level_edu: 'Master',
      universe: 'XYZ University',
      faculty: 'Engineering',
      branch: 'Information Technology',
    },
  ];

  updateForm: FormGroup;
  displayAddEducation = false;
  displayEditEducation = false;
  confirmEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.updateForm = this.formBuilder.group(
      {
        education_id: '',
        syear: ['', Validators.required],
        eyear: ['', Validators.required],
        level_edu: '',
        universe: '',
        faculty: '',
        branch: '',
      },
      { validators: this.yearRangeValidator }
    );
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  yearRangeValidator: ValidatorFn = (control: AbstractControl) => {
    const startYear = control.get('syear')?.value;
    const endYear = control.get('eyear')?.value;

    if (startYear !== null && endYear !== null && startYear >= endYear) {
      return { yearRange: true };
    }

    return null;
  };

  AddEducation(): void {
    this.updateForm.reset();
    this.displayAddEducation = true;
  }

  saveAddEducation(): void {
    const formData = this.updateForm.value;
    if (formData.syear >= formData.eyear) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Start Year must be less than End Year',
      });
      return;
    }

    formData.education_id = (this.education.length + 1).toString();
    this.education.push(formData);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Education added successfully',
    });

    this.displayAddEducation = false;
  }

  EditEducation(education: EducationInfo): void {
    this.updateForm.patchValue(education);
    this.displayEditEducation = true;
  }

  saveEditEducation(): void {
    const formData = this.updateForm.value;
    const index = this.education.findIndex((e) => e.education_id === formData.education_id);

    if (index > -1) {
      this.education[index] = formData;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Education updated successfully',
      });

      this.displayEditEducation = false;
    }
  }

  DeleteEducation(education: EducationInfo): void {
    this.education = this.education.filter((e) => e.education_id !== education.education_id);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Education deleted successfully',
    });
  }
}