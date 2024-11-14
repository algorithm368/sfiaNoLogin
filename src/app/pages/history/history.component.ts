import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

type SkillAndLevel = {
  codeSkill: string;
  skillName: string;
  levelName: string;
  description: string[];
  percentage?: number; // Add the percentage property here
};

export type spiderChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

export type dataChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class HistoryComponent implements OnInit {
  isDropdownVisible = false;

  selectedSkill: string | null = null;

  skillDetails: any;

  filteredSkillsAndLevels: SkillAndLevel[] = [];

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  public chartOptions: dataChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {},
      },
    },
    colors: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#546E7A',
      '#26a69a',
      '#D10CE8',
    ],
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2'],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Percentage',
      },
    },
    title: {
      text: 'Job-Level',
      offsetY: 335,
      align: 'center',
      style: {
        color: '#444',
        fontSize: '12px',
      },
    },
  };

  public spiderChartOptions: spiderChartOptions = {
    series: [
      {
        name: 'Percentage',
        data: [],
      },
    ],
    chart: {
      height: 250,
      type: 'radar',
    },
    xaxis: {
      categories: [],
    },
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private envEndpointService: EnvEndpointService
  ) {
    this.chartOptions.series = [
      {
        name: 'Percentage',
        data: [],
      },
    ];
  }
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`;

  currentPage: number = 1;
  pageSize: number = 7;

  descId: string[] = [];

  allSkillsAndLevels: SkillAndLevel[] = [];

  dropdownSkillUnique: any[] = [];

  labelOfDataChart: any[] = [];

  // Declare groupedByLevel at the class level
  groupedByLevel: Map<
    string,
    {
      codeSkill: string;
      skillName: string;
      levelName: string;
      description: string[];
      percentage: number;
    }
  > = new Map();

  ngOnInit() {
    this.checkLogin();
    Emitter.authEmitter.emit(true);
    this.getHistory();
    this.filterSkills();
    this.dropDownSkills();
  }

  checkLogin() {
    // Fake response simulation
    const fakeResponse = {
      // Simulating a successful login
      status: 200,
      data: { accessToken: 'fake-access-token' },
    };

    // Fake error simulation (for a failed login)
    const fakeErrorResponse = {
      status: 401,
      message: 'Unauthorized',
    };

    // Simulate successful login (fake data)
    const isLoggedIn = true; // Change this to `false` to simulate an error

    if (isLoggedIn) {
      // Simulate a successful response
      const res: any = fakeResponse;

      // Use the fake data
      AuthInterceptor.accessToken = res.data.accessToken; // Assuming `AuthInterceptor` is your authentication handler
      Emitter.authEmitter.emit(true); // Emitting event for successful login
      console.log('Fake login successful, token:', AuthInterceptor.accessToken);
    } else {
      // Simulate an error response
      const error: any = fakeErrorResponse;

      // Simulating failed login
      this.router.navigate(['/login']); // Navigate to login page
      Emitter.authEmitter.emit(false); // Emitting event for failed login
      console.log('Fake login failed:', error.message);
    }
  }

  getHistory() {
    // Simulate the fake response
    const fakeResponse = {
      descriptionsWithLevel: [
        {
          uniqueSkills: [{ codeskill: 'CS101', skill_name: 'JavaScript' }],
          level: { level_name: 'Beginner' },
          descriptionId: 'desc001',
          description: 'Basic understanding of JavaScript',
        },
        {
          uniqueSkills: [{ codeskill: 'CS101', skill_name: 'JavaScript' }],
          level: { level_name: 'Intermediate' },
          descriptionId: 'desc002',
          description: 'Able to create basic web apps using JavaScript',
        },
        {
          uniqueSkills: [{ codeskill: 'CS102', skill_name: 'Python' }],
          level: { level_name: 'Beginner' },
          descriptionId: 'desc003',
          description: 'Basic understanding of Python',
        },
      ],
    };

    // Simulate the response handling logic
    const descriptionsWithLevels = fakeResponse.descriptionsWithLevel;

    const groupedByCodeSkillAndLevel = new Map<
      string,
      Map<string, SkillAndLevel>
    >();

    descriptionsWithLevels.forEach((description: any) => {
      const codeSkill = description.uniqueSkills[0].codeskill;
      const levelName = description.level.level_name;
      this.fetchSkillDetails(codeSkill);
      if (!groupedByCodeSkillAndLevel.has(codeSkill)) {
        groupedByCodeSkillAndLevel.set(
          codeSkill,
          new Map<string, SkillAndLevel>()
        );
      }

      const innerMap =
        groupedByCodeSkillAndLevel.get(codeSkill) ||
        new Map<string, SkillAndLevel>();

      if (!innerMap.has(levelName)) {
        innerMap.set(levelName, {
          codeSkill: codeSkill,
          skillName: description.uniqueSkills[0].skill_name,
          levelName: levelName,
          description: [description.descriptionId],
          percentage: 0, // Initialize percentage here
        });
      } else {
        innerMap.get(levelName)?.description.push(description.descriptionId);
      }
    });

    const promises: Promise<void>[] = [];

    groupedByCodeSkillAndLevel.forEach((innerMap, codeSkill) => {
      innerMap.forEach((value) => {
        // Simulate getting a fake percentage for the skill and level
        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            value.percentage = Math.floor(Math.random() * 100); // Random percentage for the fake data
            resolve();
          }, 500);
        });
        promises.push(promise);
      });
    });

    // After all promises resolve, process the fake data
    Promise.all(promises).then(() => {
      this.allSkillsAndLevels = Array.from(
        groupedByCodeSkillAndLevel.values()
      ).reduce(
        (acc: SkillAndLevel[], innerMap) =>
          acc.concat(Array.from(innerMap.values())),
        []
      );
      this.updateSpiderChartData();
      this.updateChartData();

      const dataOfLabel = Array.from(
        new Set(
          this.allSkillsAndLevels.map(
            ({ codeSkill, skillName }) => `${codeSkill}-${skillName}`
          )
        )
      ).map((entry) => {
        const [codeSkill, skillName] = entry.split('-');
        return { codeSkill, skillName };
      });
      this.labelOfDataChart = dataOfLabel;
    });
  }

  getPercentageSkillAndLevel(
    codeSkill: string,
    levelName: string,
    descIds: string[]
  ): Promise<number> {
    return new Promise((resolve) => {
      // Fake response data to simulate the API
      const fakeData = [
        {
          levels: [
            {
              level_name: 'Beginner',
              descriptions: [{ id: 'desc001' }, { id: 'desc002' }],
            },
            {
              level_name: 'Intermediate',
              descriptions: [{ id: 'desc003' }, { id: 'desc004' }],
            },
          ],
        },
      ];

      // Simulate the logic of filtering the levels by levelName
      const selectedLevels = fakeData[0]?.levels.filter(
        (level: any) => level.level_name === levelName
      );

      if (selectedLevels && selectedLevels.length > 0) {
        // Map descriptions to extract description IDs
        const descriptions = selectedLevels.map((level: any) => {
          const descid = level.descriptions[0]?.id || '';
          return { descid };
        });

        // Calculate the percentage based on descriptionIds
        const percentage = parseFloat(
          (((descIds.length || 1) / descriptions.length) * 100).toFixed(2)
        );

        // Find the skill and level in the allSkillsAndLevels array
        const skillAndLevel = this.allSkillsAndLevels.find(
          (item) => item.codeSkill === codeSkill && item.levelName === levelName
        ) as SkillAndLevel;

        if (skillAndLevel) {
          skillAndLevel.percentage = percentage;
        }

        // Resolve the fake percentage value
        resolve(percentage);
      } else {
        resolve(0); // No levels found, return 0%
      }
    });
  }

  updateSpiderChartData() {
    this.allSkillsAndLevels.sort(
      (a, b) => (b.percentage || 0) - (a.percentage || 0)
    );

    this.spiderChartOptions.series[0].data = this.allSkillsAndLevels.map(
      (item) => item.percentage || 0
    );

    if (this.spiderChartOptions.series[0].data.length < 6) {
      const remainingLength = 6 - this.spiderChartOptions.series[0].data.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.series[0].data.push('0' as any);
      }
    }
    this.spiderChartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(
        (item) => `${item.codeSkill} - ${item.levelName}`
      ),
    };

    if (this.spiderChartOptions.xaxis.categories.length < 3) {
      const remainingLength =
        6 - this.spiderChartOptions.xaxis.categories.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.xaxis.categories.push('' as any);
      }
    }
  }

  updateChartData() {
    this.allSkillsAndLevels.sort((a, b) => {
      const percentageDiff = (b.percentage || 0) - (a.percentage || 0);
      // If percentages are equal, sort alphabetically by codeSkill and levelName
      if (percentageDiff === 0) {
        const codeSkillComparison = a.codeSkill.localeCompare(b.codeSkill);
        if (codeSkillComparison === 0) {
          return a.levelName.localeCompare(b.levelName);
        }
        return codeSkillComparison;
      }
      return percentageDiff;
    });

    this.chartOptions.series[0].data = this.allSkillsAndLevels.map(
      (item) => item.percentage || 0
    );

    this.chartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(
        (item) => `${item.codeSkill} - ${item.levelName}`
      ),
    };
  }

  clickToDetail(codeSkill: string, levelName: string) {
    if (codeSkill && levelName) {
      const url = this.router.createUrlTree([`/detail-standard/${codeSkill}`]);
      window.open(`${url}`, '_blank');
    }
  }

  selectSkill(skillName: string) {
    if (skillName === '') {
      this.getHistory();
    }

    const uniqueSkills = new Set();
    this.allSkillsAndLevels.forEach((skill) => {
      const key = `${skill.skillName}-${skill.codeSkill}`;
      uniqueSkills.add(key);
    });
    const uniqueSkillsArray = Array.from(uniqueSkills);

    this.selectedSkill = skillName;
    this.filterSkills();
    this.isDropdownVisible = false;
    this.currentPage = 1;

    const filteredSkills = this.allSkillsAndLevels.filter(
      (skill) => skill.skillName === skillName
    );

    if (filteredSkills.length > 0) {
      const { codeSkill, skillName } = filteredSkills[0];
      const skillAndLevel = { codeSkill, skillName };
      this.labelOfDataChart = [skillAndLevel];
    }

    const percentages: number[] = [];

    filteredSkills.forEach((skill) => {
      const validPercentage: number = skill.percentage ?? 0;
      percentages.push(validPercentage);
    });

    this.spiderChartOptions.series[0].data = percentages;
    if (this.spiderChartOptions.series[0].data.length < 6) {
      const remainingLength = 6 - this.spiderChartOptions.series[0].data.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.series[0].data.push('0' as any);
      }
    }

    this.spiderChartOptions.xaxis = {
      categories: filteredSkills.map(
        (skill) => `${skill.codeSkill} - ${skill.levelName}`
      ),
    };
    if (this.spiderChartOptions.xaxis.categories.length < 3) {
      const remainingLength =
        6 - this.spiderChartOptions.xaxis.categories.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.xaxis.categories.push('' as any);
      }
    }

    this.chartOptions.series[0].data = percentages;
    this.chartOptions.xaxis = {
      categories: filteredSkills.map(
        (skill) => `${skill.codeSkill} - ${skill.levelName}`
      ),
    };
  }

  filterSkills() {
    if (!this.selectedSkill) {
      this.filteredSkillsAndLevels = this.allSkillsAndLevels;
    } else {
      this.filteredSkillsAndLevels = this.allSkillsAndLevels.filter(
        (skillAndLevel) => skillAndLevel.skillName === this.selectedSkill
      );
    }
  }

  dropDownSkills() {
    // Fake response data to simulate the API
    const fakeResponse = {
      descriptionsWithLevel: [
        {
          uniqueSkills: [
            { skill_name: 'JavaScript', codeskill: 'JS001' },
            { skill_name: 'TypeScript', codeskill: 'TS001' },
          ],
          level: { level_name: 'Beginner' },
        },
        {
          uniqueSkills: [
            { skill_name: 'React', codeskill: 'REACT001' },
            { skill_name: 'JavaScript', codeskill: 'JS001' },
          ],
          level: { level_name: 'Intermediate' },
        },
        {
          uniqueSkills: [{ skill_name: 'Node.js', codeskill: 'NODE001' }],
          level: { level_name: 'Advanced' },
        },
        {
          uniqueSkills: [{ skill_name: 'TypeScript', codeskill: 'TS001' }],
          level: { level_name: 'Advanced' },
        },
      ],
    };

    // Simulate the logic of the dropDownSkills() function with fake data
    const descriptionsWithLevels = fakeResponse.descriptionsWithLevel;
    const uniqueSkills = new Set<string>();

    descriptionsWithLevels.forEach((description: any) => {
      const skillName = description.uniqueSkills[0].skill_name;
      uniqueSkills.add(skillName);
    });

    // Convert the Set to an array of objects containing skill names
    this.dropdownSkillUnique = Array.from(uniqueSkills).map((skillName) => ({
      skillName,
    }));

    // Log the output for testing
    console.log(this.dropdownSkillUnique);
  }

  fetchSkillDetails(codeSkill: string) {
    // Fake response data to simulate the API
    const fakeDetails = [
      {
        levels: [
          {
            level_name: 'Beginner',
            descriptions: [{ id: 'desc001' }, { id: 'desc002' }],
          },
          { level_name: 'Intermediate', descriptions: [{ id: 'desc003' }] },
          {
            level_name: 'Advanced',
            descriptions: [{ id: 'desc004' }, { id: 'desc005' }],
          },
        ],
      },
    ];

    // Simulate the logic of the fetchSkillDetails() function with fake data
    const allDescids = fakeDetails[0].levels.length;

    // Log the result for testing
    console.log(`Total levels: ${allDescids}`);
  }
}
