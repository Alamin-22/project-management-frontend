export interface IGlobalKPIs {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface IChartData {
  _id: string;
  count: number;
}

export interface IHighPriorityTask {
  _id: string;
  title: string;
  slug: string;
  dueDate: string;
  project: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface IUpcomingDeadline {
  _id: string;
  name: string;
  slug: string;
  deadline: string;
  status: string;
}

export interface IMemberWorkload {
  memberId: string;
  name: string;
  email: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface IGlobalDashboardResponse {
  kpis: IGlobalKPIs;
  charts: {
    taskStatusDistribution: IChartData[];
    tasksByPriority: IChartData[];
  };
  widgets: {
    highPriorityTasks: IHighPriorityTask[];
    upcomingDeadlines: IUpcomingDeadline[];
    memberWorkloadSummary: IMemberWorkload[];
  };
}

export interface IProjectOverviewResponse {
  projectName: string;
  slug: string;
  status: string;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  completionPercentage: string;
  deadlineStatus: string;
}

export interface IMemberWorkloadResponse {
  projectName: string;
  kpis: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  tasks: Array<{
    title: string;
    slug: string;
    status: string;
    priority: string;
    dueDate: string;
  }>;
}

export interface ITeamMemberPerformance {
  memberId: string;
  name: string;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}
