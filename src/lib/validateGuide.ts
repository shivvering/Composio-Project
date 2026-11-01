import {
  OAuthGuide,
  DifficultyLevel,
  ConfidenceLabel,
  RequirementItem,
  SetupStep,
  Blocker,
} from '@/types/guide';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  guide?: OAuthGuide;
}

const VALID_CONFIDENCE_LABELS: ConfidenceLabel[] = [
  'From official docs',
  'Community reported',
  'Unverified estimate',
];

function normalizeConfidence(conf: any, defaultVal: ConfidenceLabel = 'Unverified estimate'): ConfidenceLabel {
  if (typeof conf !== 'string') return defaultVal;
  const lower = conf.toLowerCase().trim();
  if (lower.includes('official') || lower.includes('docs')) return 'From official docs';
  if (lower.includes('community')) return 'Community reported';
  return 'Unverified estimate';
}

export function validateOAuthGuide(input: any): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input must be a JSON object.'] };
  }

  const checkString = (val: any, field: string) => {
    if (typeof val !== 'string' || val.trim().length === 0) {
      errors.push(`Field '${field}' must be a non-empty string.`);
    }
  };

  checkString(input.appName, 'appName');
  checkString(input.website, 'website');
  checkString(input.lastChecked, 'lastChecked');

  // difficulty
  if (!input.difficulty || typeof input.difficulty !== 'object') {
    errors.push("Field 'difficulty' must be an object with 'level' and 'reason'.");
  } else {
    const validLevels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    if (!validLevels.includes(input.difficulty.level)) {
      errors.push("Field 'difficulty.level' must be 'easy', 'medium', or 'hard'.");
    }
    checkString(input.difficulty.reason, 'difficulty.reason');
  }

  // timeEstimate
  if (!input.timeEstimate || typeof input.timeEstimate !== 'object') {
    errors.push("Field 'timeEstimate' must be an object with 'setupTime' and 'approvalWait'.");
  } else {
    checkString(input.timeEstimate.setupTime, 'timeEstimate.setupTime');
    checkString(input.timeEstimate.approvalWait, 'timeEstimate.approvalWait');
  }

  // requirements
  if (!Array.isArray(input.requirements) || input.requirements.length === 0) {
    errors.push("Field 'requirements' must be a non-empty array.");
  }

  // steps
  if (!Array.isArray(input.steps) || input.steps.length === 0) {
    errors.push("Field 'steps' must be a non-empty array of setup steps.");
  } else {
    input.steps.forEach((step: any, i: number) => {
      if (!step || typeof step !== 'object') {
        errors.push(`Step [${i}] must be an object.`);
      } else {
        if (typeof step.title !== 'string') errors.push(`Step [${i}].title must be a string.`);
        if (typeof step.description !== 'string') errors.push(`Step [${i}].description must be a string.`);
      }
    });
  }

  // blockers
  if (!Array.isArray(input.blockers) || input.blockers.length === 0) {
    errors.push("Field 'blockers' must be a non-empty array of problem/solution objects.");
  } else {
    input.blockers.forEach((b: any, i: number) => {
      if (!b || typeof b !== 'object' || typeof b.problem !== 'string' || typeof b.solution !== 'string') {
        errors.push(`Blocker [${i}] must have 'problem' and 'solution' strings.`);
      }
    });
  }

  // agentVsDeveloper
  if (!input.agentVsDeveloper || typeof input.agentVsDeveloper !== 'object') {
    errors.push("Field 'agentVsDeveloper' must be an object with 'agentCanDo' and 'developerMustDo'.");
  } else {
    if (!Array.isArray(input.agentVsDeveloper.agentCanDo)) {
      errors.push("Field 'agentVsDeveloper.agentCanDo' must be an array of strings.");
    }
    if (!Array.isArray(input.agentVsDeveloper.developerMustDo)) {
      errors.push("Field 'agentVsDeveloper.developerMustDo' must be an array of strings.");
    }
  }

  // managedOption
  if (!input.managedOption || typeof input.managedOption !== 'object') {
    errors.push("Field 'managedOption' must be an object with 'managedSufficientWhen' and 'customRequiredWhen'.");
  } else {
    checkString(input.managedOption.managedSufficientWhen, 'managedOption.managedSufficientWhen');
    checkString(input.managedOption.customRequiredWhen, 'managedOption.customRequiredWhen');
  }

  // sources
  if (!Array.isArray(input.sources)) {
    errors.push("Field 'sources' must be an array of { title, url }.");
  } else {
    input.sources.forEach((s: any, i: number) => {
      if (!s || typeof s !== 'object' || typeof s.title !== 'string' || typeof s.url !== 'string') {
        errors.push(`Source [${i}] must have 'title' and 'url' strings.`);
      }
    });
  }

  // claims
  if (!Array.isArray(input.claims) || input.claims.length === 0) {
    errors.push("Field 'claims' must be a non-empty array of claims with confidence labels.");
  }

  // openQuestions
  if (!Array.isArray(input.openQuestions)) {
    errors.push("Field 'openQuestions' must be an array of strings.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Normalize requirements with confidence labels
  const normalizedRequirements: RequirementItem[] = input.requirements.map((req: any) => {
    if (typeof req === 'string') {
      return {
        text: req.trim(),
        confidence: 'From official docs',
      };
    }
    return {
      text: String(req.text || '').trim(),
      confidence: normalizeConfidence(req.confidence, 'From official docs'),
      ...(req.sourceUrl ? { sourceUrl: String(req.sourceUrl).trim() } : {}),
    };
  });

  // Normalize setup steps with confidence labels
  const normalizedSteps: SetupStep[] = input.steps.map((step: any, index: number) => ({
    stepNumber: typeof step.stepNumber === 'number' ? step.stepNumber : index + 1,
    title: String(step.title || '').trim(),
    description: String(step.description || '').trim(),
    confidence: normalizeConfidence(step.confidence, 'From official docs'),
    ...(step.sourceUrl ? { sourceUrl: String(step.sourceUrl).trim() } : {}),
    ...(step.actionUrl ? { actionUrl: String(step.actionUrl).trim() } : {}),
  }));

  // Normalize blockers with confidence labels
  const normalizedBlockers: Blocker[] = input.blockers.map((b: any) => ({
    problem: String(b.problem || '').trim(),
    solution: String(b.solution || '').trim(),
    confidence: normalizeConfidence(b.confidence, 'Community reported'),
    ...(b.sourceUrl ? { sourceUrl: String(b.sourceUrl).trim() } : {}),
  }));

  const guide: OAuthGuide = {
    appName: input.appName.trim(),
    website: input.website.trim(),
    lastChecked: input.lastChecked.trim(),
    manuallyChecked: Boolean(input.manuallyChecked),
    ...(typeof input.spotChecked === 'boolean' ? { spotChecked: input.spotChecked } : {}),
    ...(input.lastVerified ? { lastVerified: String(input.lastVerified).trim() } : {}),
    ...(typeof input.groundedWithSearch === 'boolean' ? { groundedWithSearch: input.groundedWithSearch } : {}),
    difficulty: {
      level: input.difficulty.level,
      reason: input.difficulty.reason.trim(),
      confidence: normalizeConfidence(input.difficulty.confidence, 'From official docs'),
      ...(input.difficulty.sourceUrl ? { sourceUrl: String(input.difficulty.sourceUrl).trim() } : {}),
    },
    timeEstimate: {
      setupTime: input.timeEstimate.setupTime.trim(),
      setupTimeConfidence: normalizeConfidence(input.timeEstimate.setupTimeConfidence, 'Unverified estimate'),
      ...(input.timeEstimate.setupTimeSourceUrl
        ? { setupTimeSourceUrl: String(input.timeEstimate.setupTimeSourceUrl).trim() }
        : {}),
      approvalWait: input.timeEstimate.approvalWait.trim(),
      approvalWaitConfidence: normalizeConfidence(input.timeEstimate.approvalWaitConfidence, 'From official docs'),
      ...(input.timeEstimate.approvalWaitSourceUrl
        ? { approvalWaitSourceUrl: String(input.timeEstimate.approvalWaitSourceUrl).trim() }
        : {}),
      notes: input.timeEstimate.notes ? input.timeEstimate.notes.trim() : undefined,
    },
    requirements: normalizedRequirements,
    steps: normalizedSteps,
    blockers: normalizedBlockers,
    agentVsDeveloper: {
      agentCanDo: input.agentVsDeveloper.agentCanDo.map((a: any) => String(a).trim()),
      developerMustDo: input.agentVsDeveloper.developerMustDo.map((d: any) => String(d).trim()),
    },
    managedOption: {
      managedSufficientWhen: input.managedOption.managedSufficientWhen.trim(),
      customRequiredWhen: input.managedOption.customRequiredWhen.trim(),
    },
    sources: input.sources.map((s: any) => ({
      title: String(s.title).trim(),
      url: String(s.url).trim(),
    })),
    claims: input.claims.map((c: any) => ({
      claim: String(c.claim).trim(),
      confidence: normalizeConfidence(c.confidence, 'From official docs'),
      ...(c.sourceUrl ? { sourceUrl: String(c.sourceUrl).trim() } : {}),
    })),
    openQuestions: input.openQuestions.map((q: any) => String(q).trim()),
  };

  return { valid: true, errors: [], guide };
}
