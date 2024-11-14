import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

interface Category {
  category_text: string;
}

interface Subcategory {
  subcategory_text: string;
}

interface Skills {
  codeskill: number;
  skill_name: string;
  overall: string;
  category: Category;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ENV_REST_API = ''; // No need for API URL as we're using fake data

  currentPage: number = 1;
  pageSize: number = 8;

  isLoggedIn: boolean = true; // Simulating that the user is logged in

  searchSkill: string = '';
  searchResults: Skills[] = [];
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  categories: string[] = [];
  subcategories: string[] = [];

  constructor(
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Home');
    this.checkLogin(); // Simulate login check
    this.fetchSkills(); // Fetching fake skills data
    this.selectedCategory = 'all';
    this.selectedSubcategory = 'all';
    this.fetchCategories(); // Fetching fake categories
  }

  checkLogin() {
    // Simulating a logged-in state (no actual API call)
    this.isLoggedIn = true;
  }

  fetchSkills() {
    // Simulating skills data
    const fakeSkills: Skills[] = [
      {
        codeskill: 1,
        skill_name: 'Skill A',
        overall: 'Expert',
        category: { category_text: 'Category 1' }
      },
      {
        codeskill: 2,
        skill_name: 'Skill B',
        overall: 'Intermediate',
        category: { category_text: 'Category 2' }
      },
      {
        codeskill: 3,
        skill_name: 'Skill C',
        overall: 'Beginner',
        category: { category_text: 'Category 1' }
      },
      // Add more fake skills as needed
    ];
    this.searchResults = fakeSkills;
  }

  searchSkills() {
    // Simulating skill search filtering
    const filteredSkills = this.searchResults.filter(
      (result) =>
        result.skill_name &&
        result.skill_name.toLowerCase().includes(this.searchSkill.toLowerCase())
    );
    this.searchResults = filteredSkills;
  }

  fetchCategories() {
    // Simulating categories data
    const fakeCategories: string[] = ['Category 1', 'Category 2', 'Category 3'];
    this.categories = this.removeDuplicates(fakeCategories);
  }

  onCategoryChange() {
    // Simulating category change and updating subcategories
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      this.fetchSkillsForCategory(this.selectedCategory);
      this.selectedSubcategory = 'all';
    } else {
      this.fetchSkills();
      this.selectedSubcategory = 'all';
    }
  }

  fetchSkillsForCategory(category: string | null) {
    // Simulating fetching skills by category
    const filteredSkills = this.searchResults.filter(
      (skill) => skill.category.category_text === category
    );
    this.searchResults = filteredSkills;
    this.currentPage = 1;
  }

  onSubcategoryChange() {
    // Simulating subcategory change (we will just use the same skills for now)
    if (this.selectedSubcategory && this.selectedSubcategory !== 'all') {
      // If you want to apply any filtering by subcategory, add logic here
    } else {
      if (this.selectedCategory) {
        this.fetchSkillsForCategory(this.selectedCategory);
      }
    }
    this.currentPage = 1;
  }

  removeDuplicates(items: string[]): string[] {
    const uniqueItems: string[] = [];
    const seenItems = new Set();
    for (const item of items) {
      if (!seenItems.has(item)) {
        seenItems.add(item);
        uniqueItems.push(item);
      }
    }
    return uniqueItems;
  }

  viewSkillDetail(codeskill: number) {
    // Navigate to a fake skill detail page
    this.router.navigate(['/detail-standard', codeskill]);
  }
}