import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  private itemDeletedSubject = new Subject<void>();
  private newItemAddedSubject = new Subject<void>();
  private selectedSkillSubject = new Subject<string>();
  private nameSkill: string = "";
  private filteredSkills: any[] = [];

  // Fake data
  private fakeEducationData = [
    { education_id: '1', name: 'Bachelor of Engineering', institution: 'University A', year: 2020 },
    { education_id: '2', name: 'Master of Engineering', institution: 'University B', year: 2023 },
  ];

  private fakeExperienceData = [
    { exp_id: '1', title: 'Software Engineer', company: 'TechCorp', year: 2022 },
    { exp_id: '2', title: 'Frontend Developer', company: 'WebWorks', year: 2023 },
  ];

  private fakeLinkData = [
    { id: '1', title: 'GitHub', url: 'https://github.com/username' },
    { id: '2', title: 'LinkedIn', url: 'https://linkedin.com/in/username' },
  ];

  private fakeSkillsData = [
    { skill_id: '1', skill_name: 'JavaScript' },
    { skill_id: '2', skill_name: 'React' },
    { skill_id: '3', skill_name: 'Node.js' },
  ];

  constructor() {}

  setFilteredSkills(filteredSkills: any[]): void {
    this.filteredSkills = filteredSkills;
  }

  setNameSkills(nameSkill: string): void {
    this.nameSkill = nameSkill;
  }

  getFilteredSkills(): any[] {
    return this.filteredSkills;
  }

  getNameSkills(): string {
    return this.nameSkill;
  }

  // Fake GET methods
  getEducationData(): Observable<any> {
    return of(this.fakeEducationData);
  }

  getExperienceData(): Observable<any> {
    return of(this.fakeExperienceData);
  }

  getLinkData(): Observable<any> {
    return of(this.fakeLinkData);
  }

  getAllSkillNames(): Observable<any> {
    return of(this.fakeSkillsData);
  }

  // Fake POST methods
  saveEducation(formData: any): Observable<any> {
    this.fakeEducationData.push(formData);
    return of(formData).pipe(tap(() => this.newItemAddedSubject.next()));
  }

  saveExperience(formData: any): Observable<any> {
    this.fakeExperienceData.push(formData);
    return of(formData).pipe(tap(() => this.newItemAddedSubject.next()));
  }

  getNewItemAddedSubject(): Observable<void> {
    return this.newItemAddedSubject.asObservable();
  }

  // Fake PUT methods
  updateEducation(formData: any): Observable<any> {
    const index = this.fakeEducationData.findIndex((item) => item.education_id === formData.education_id);
    if (index !== -1) {
      this.fakeEducationData[index] = formData;
    }
    return of(formData);
  }

  updateExperience(formData: any): Observable<any> {
    const index = this.fakeExperienceData.findIndex((item) => item.exp_id === formData.exp_id);
    if (index !== -1) {
      this.fakeExperienceData[index] = formData;
    }
    return of(formData);
  }

  // Fake DELETE methods
  deleteEducation(educationId: string): Observable<any> {
    this.fakeEducationData = this.fakeEducationData.filter(item => item.education_id !== educationId);
    return of({}).pipe(
      tap(() => this.itemDeletedSubject.next())
    );
  }

  deleteExperience(experienceId: string): Observable<any> {
    this.fakeExperienceData = this.fakeExperienceData.filter(item => item.exp_id !== experienceId);
    return of({}).pipe(
      tap(() => this.itemDeletedSubject.next())
    );
  }

  getItemDeletedSubject(): Observable<void> {
    return this.itemDeletedSubject.asObservable();
  }

  // Notify skill selected
  notifySkillSelected(skill: string): void {
    this.selectedSkillSubject.next(skill);
  }

  getSelectedSkillSubject(): Observable<string> {
    return this.selectedSkillSubject.asObservable();
  }
}