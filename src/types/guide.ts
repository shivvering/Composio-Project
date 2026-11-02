export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type ConfidenceLabel =
  | 'From official docs'
  | 'Community reported'
  | 'Unverified estimate'
  | 'Could not confirm';

export type ClaimConfidence =
  | 'verified'
  | 'From official docs'
  | 'from official docs'
  | 'Community reported'
  | 'Unverified estimate'
  | 'Could not confirm'
  | 'unverified';

export interface ConfidenceMetadata {
  confidence?: ConfidenceLabel | string;
  sourceUrl?: string;
}

export interface Difficulty extends ConfidenceMetadata {
  level: DifficultyLevel;
  reason: string;
}

export interface TimeEstimate {
  setupTime: string; // If model has no source for a number, says "Not stated in sources"
  setupTimeConfidence?: ConfidenceLabel | string;
  setupTimeSourceUrl?: string;
  approvalWait: string; // If model has no source for a number, says "Not stated in sources"
  approvalWaitConfidence?: ConfidenceLabel | string;
  approvalWaitSourceUrl?: string;
  notes?: string;
}

export interface RequirementItem {
  text: string;
  confidence?: ConfidenceLabel | string;
  sourceUrl?: string;
}

export interface SetupStep extends ConfidenceMetadata {
  stepNumber: number;
  title: string;
  description: string;
  actionUrl?: string;
}

export interface Blocker extends ConfidenceMetadata {
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
  manuallyChecked?: boolean;
  spotChecked?: boolean;
  lastVerified?: string;
  groundedWithSearch?: boolean;
  difficulty: Difficulty;
  timeEstimate: TimeEstimate;
  requirements: (string | RequirementItem)[];
  steps: SetupStep[];
  blockers: Blocker[];
  agentVsDeveloper: AgentVsDeveloper;
  managedOption: ManagedOption;
  sources: Source[];
  claims: Claim[];
  openQuestions: string[];
}
