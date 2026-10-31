export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type ClaimConfidence = 'verified' | 'from official docs' | 'unverified';

export interface Difficulty {
  level: DifficultyLevel;
  reason: string;
}

export interface TimeEstimate {
  setupTime: string;
  approvalWait: string;
  notes?: string;
}

export interface SetupStep {
  stepNumber: number;
  title: string;
  description: string;
  actionUrl?: string;
}

export interface Blocker {
  problem: string;
  solution: string;
}

export interface AgentVsDeveloper {
  agentCanDo: string[];
  developerMustDo: string[];
}

export interface ManagedOption {
  managedSufficientWhen: string;
  customRequiredWhen: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface Claim {
  claim: string;
  confidence: ClaimConfidence;
  sourceUrl?: string;
}

export interface OAuthGuide {
  slug?: string;
  appName: string;
  website: string;
  lastChecked: string;
  difficulty: Difficulty;
  timeEstimate: TimeEstimate;
  requirements: string[];
  steps: SetupStep[];
  blockers: Blocker[];
  agentVsDeveloper: AgentVsDeveloper;
  managedOption: ManagedOption;
  sources: Source[];
  claims: Claim[];
  openQuestions: string[];
}
