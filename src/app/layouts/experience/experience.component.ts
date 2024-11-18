import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

interface ExperienceInfo {
  exp_id: string;
  exp_text: string;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
  providers: [MessageService],
})
export class ExperienceComponent implements OnInit {
  experience: ExperienceInfo[] = [
    { exp_id: '1', exp_text: 'Web Developer at XYZ Company' },
    { exp_id: '2', exp_text: 'Software Engineer at ABC Corp' },
    { exp_id: '3', exp_text: 'Project Manager at DEF Ltd.' },
  ];
  updateForm: FormGroup;
  displayAddExperience: boolean = false;
  displayEditExperience: boolean = false;
  confirmEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.updateForm = this.formBuilder.group({
      exp_id: '',
      exp_text: '',
    });
  }

  ngOnInit(): void {
    // No need to fetch data, as we use static data
  }

  AddExperience() {
    this.updateForm.patchValue({
      exp_text: '',
    });
    this.displayAddExperience = true;
  }

  EditExperience(experience: ExperienceInfo) {
    this.updateForm.patchValue({
      exp_id: experience.exp_id,
      exp_text: experience.exp_text,
    });

    this.displayEditExperience = true;
  }

  saveAddExperience(): void {
    const formData = this.updateForm.value;

    // Add the new experience to the static data
    this.experience.push({
      exp_id: (this.experience.length + 1).toString(),
      exp_text: formData.exp_text,
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Experience created successfully',
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 2500);

    this.displayAddExperience = false;
    this.updateForm.reset({
      exp_text: '',
    });
  }

  saveEditExperience(): void {
    if (!this.confirmEdit) {
      this.messageService.add({
        key: 'confirm1',
        sticky: true,
        severity: 'warn',
        summary: 'Are you sure?',
        detail: 'Are you sure you want to proceed?',
      });
      this.confirmEdit = true;
    }
  }

  onConfirmEdit() {
    const formData = this.updateForm.value;

    // Update the experience in static data
    const experience = this.experience.find((exp) => exp.exp_id === formData.exp_id);
    if (experience) {
      experience.exp_text = formData.exp_text;
    }

    this.messageService.clear('confirm1');
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Experience updated successfully',
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 2500);
    this.displayEditExperience = false;
    this.confirmEdit = false;
  }

  onRejectEdit() {
    this.messageService.clear('confirm1');
    this.displayEditExperience = false;
    this.confirmEdit = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected the changes',
    });
  }

  DeleteExperience(experience: ExperienceInfo) {
    this.updateForm.patchValue({
      exp_id: experience.exp_id,
      exp_text: experience.exp_text,
    });
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmation',
      detail: 'Are you sure you want to delete this experience?',
    });
  }

  onConfirm() {
    const formData = this.updateForm.value;
    const experienceId = formData.exp_id;

    // Remove the experience from static data
    this.experience = this.experience.filter((exp) => exp.exp_id !== experienceId);

    this.messageService.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'Experience deleted successfully',
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 2500);
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected the deletion',
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 2500);
  }
}