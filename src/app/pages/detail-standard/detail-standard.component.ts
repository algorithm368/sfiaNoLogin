import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

interface Information {
  info_id: number;
  info_text: string;
  descid: string;
}

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class DetailStandardComponent implements OnInit {
  updateInfoText: string | null = null;
  codeskill!: number;
  levelNames: string[] = ['Level 1', 'Level 2', 'Level 3']; // Example levels
  skillDetails: any = [
    { level_name: 'Level 1', description: { desc: ['desc1', 'desc2'] } },
    { level_name: 'Level 2', description: { desc: ['desc3', 'desc4'] } },
    { level_name: 'Level 3', description: { desc: ['desc5', 'desc6'] } }
  ];
  selectedMetal: string | null = null;
  selectedLevelDescriptions: { description_text: string; descid: string }[] = [];
  selectedDescriptionIndex: number | null = null;
  descid: string[] = [];
  visible: boolean[] = [];
  percentage!: number;
  isLoggedIn: boolean = true; // Simulate logged-in status
  information: Information[] = [
    { info_id: 1, info_text: 'Info 1', descid: 'desc1' },
    { info_id: 2, info_text: 'Info 2', descid: 'desc2' },
    { info_id: 3, info_text: 'Info 3', descid: 'desc3' },
  ]; // Example data

  updateForm: FormGroup;
  percentageMap: Map<string, number> = new Map();
  isLoading: boolean = false; // Added the isLoading property

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: Title
  ) {
    this.updateForm = this.formBuilder.group({
      info_id: '',
      info_text: ['', [Validators.required, Validators.pattern('^(https?|ftp):\\/\\/(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+(\\/[^\\s]*)?$')]],
      descid: '',
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Detail');
    this.route.params.subscribe((params) => {
      this.codeskill = params['codeskill']; // Get the skill code from route parameters
      this.fetchSkillDetails();
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = true; // Simulating that user is logged in
    Emitter.authEmitter.emit(true);
  }

  fetchSkillDetails() {
    let temporarySkillDetails: any[] = [];
    temporarySkillDetails = this.skillDetails;
    let descids: string[] = [];
    let levelNameList: string[] = [];
    this.skillDetails.forEach((level) => {
      levelNameList.push(level.level_name);
      descids = descids.concat(level.description.desc);
    });
    let descIdsWithInformation = this.information.map((info) => info.descid);
    levelNameList.forEach((levelName) => {
      const levelDetails = this.skillDetails.find(
        (detail) => detail.level_name === levelName
      );
      if (levelDetails) {
        const descIdsForLevel = levelDetails.description.desc;
        const descIdsWithInformationForLevel = descIdsWithInformation.filter((descid) =>
          descIdsForLevel.includes(descid)
        );
        const percentageForLevel = parseFloat(((descIdsWithInformationForLevel.length / descIdsForLevel.length) * 100).toFixed(2));
        this.percentageMap.set(levelName, percentageForLevel);
      }
    });
    this.percentage = (descIdsWithInformation.length / descids.length) * 100;
    this.percentage = +this.percentage.toFixed(2);
  }

  showDetails(levelName: string) {
    this.selectedMetal = levelName;
    const selectedLevels = this.skillDetails.filter(
      (level: any) => level.level_name === levelName
    );
    if (selectedLevels && selectedLevels.length > 0) {
      const descriptions = selectedLevels.map((level: any) => {
        const description_text = level.description.desc.join(', ');
        const descid = level.description.desc.join('');
        return { description_text, descid };
      });
      this.selectedLevelDescriptions = descriptions;
    } else {
      this.selectedLevelDescriptions = [
        { description_text: 'Level not found', descid: '' },
      ];
    }
  }

  getInformationByDescid(descid: string): string {
    const informationRecord = this.information.find(
      (info) => info.descid === descid
    );
    return informationRecord ? informationRecord.info_text : '';
  }

  addInformation(i: number) {
    if (this.isLoggedIn) {
      this.visible[i] = true;
      this.selectedDescriptionIndex = i;
      this.updateForm.patchValue({
        info_text: '',
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveAddInformation() {
    if (this.selectedDescriptionIndex !== null) {
      const formData = this.updateForm.value;
      const descid = this.selectedLevelDescriptions[this.selectedDescriptionIndex].descid;
      const newInformation = { info_id: Date.now(), info_text: formData.info_text, descid };
      this.information.push(newInformation);
      this.information.sort((a, b) => {
        return a.descid.localeCompare(b.descid);
      });
      this.updateForm.reset({
        info_text: '',
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Add data successfully',
      });
      setTimeout(() => {
        this.messageService.clear();
      }, 2500);
    }
  }

  getSkillColorClass(percentage: number | undefined): string {
    if (percentage === undefined) return 'low-skill'; // Default if undefined
    if (percentage > 75) {
      return 'high-skill';
    } else if (percentage > 50) {
      return 'medium-skill';
    } else {
      return 'low-skill';
    }
  }

  displayEditInformation: boolean = false;

  editInformation(information: any) {
    this.updateForm.patchValue({
      info_id: information.info_id,
      info_text: information.info_text,
      descid: information.descid,
    });
    this.updateInfoText = information.info_text;
    this.displayEditInformation = true;
  }

  displayPartialURL(value: string): boolean {
    const partialUrlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;
    return partialUrlPattern.test(value);
  }

  onReject(): void {
    this.messageService.clear(); // Corrected to use MessageService
  }

  isLink(value: string): boolean {
    const urlPattern = /^(https?:\/\/)/;
    return urlPattern.test(value);
  }

  saveEditInformation() {
    // Add logic to save edited information if needed
    if (this.updateForm.valid) {
      const updatedInfo = this.updateForm.value;
      const index = this.information.findIndex(info => info.info_id === updatedInfo.info_id);
      if (index !== -1) {
        this.information[index] = updatedInfo;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Information updated successfully',
        });
      }
      this.displayEditInformation = false;
      this.updateForm.reset();
    }
  }

  deleteInformation(information: any) {
    const index = this.information.findIndex(info => info.info_id === information.info_id);
    if (index !== -1) {
      this.information.splice(index, 1);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Information deleted successfully',
      });
    }
  }

  onConfirm() {
    // Confirm logic
  }
}