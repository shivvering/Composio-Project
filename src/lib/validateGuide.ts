import { OAuthGuide, DifficultyLevel, ClaimConfidence } from '@/types/guide';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  guide?: OAuthGuide;
}

export function validateOAuthGuide(input: any): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input must be a JSON object.'] };
  }

  // Helper string checks
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
    errors.push("Field 'requirements' must be a non-empty array of strings.");
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
  } else {
    const validConf: ClaimConfidence[] = ['verified', 'from official docs', 'unverified'];
    input.claims.forEach((c: any, i: number) => {
      if (!c || typeof c !== 'object') {
        errors.push(`Claim [${i}] must be an object.`);
      } else {
        if (typeof c.claim !== 'string') errors.push(`Claim [${i}].claim must be a string.`);
        if (!validConf.includes(c.confidence)) {
          errors.push(`Claim [${i}].confidence must be 'verified', 'from official docs', or 'unverified'.`);
        }
      }
    });
  }

  // openQuestions
  if (!Array.isArray(input.openQuestions)) {
    errors.push("Field 'openQuestions' must be an array of strings.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Normalize step numbers
  const normalizedSteps = input.steps.map((step: any, index: number) => ({
    stepNumber: typeof step.stepNumber === 'number' ? step.stepNumber : index + 1,
    title: step.title,
    description: step.description,
    ...(step.actionUrl ? { actionUrl: step.actionUrl } : {}),
  }));

  const guide: OAuthGuide = {
    appName: input.appName.trim(),
    website: input.website.trim(),
    lastChecked: input.lastChecked.trim(),
    difficulty: {
      level: input.difficulty.level,
      reason: input.difficulty.reason.trim(),
    },
    timeEstimate: {
      setupTime: input.timeEstimate.setupTime.trim(),
      approvalWait: input.timeEstimate.approvalWait.trim(),
      notes: input.timeEstimate.notes ? input.timeEstimate.notes.trim() : undefined,
    },
    requirements: input.requirements.map((r: any) => String(r).trim()),
    steps: normalizedSteps,
    blockers: input.blockers.map((b: any) => ({
      problem: String(b.problem).trim(),
      solution: String(b.solution).trim(),
    })),
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
      confidence: c.confidence,
      ...(c.sourceUrl ? { sourceUrl: String(c.sourceUrl).trim() } : {}),
    })),
    openQuestions: input.openQuestions.map((q: any) => String(q).trim()),
  };

  return { valid: true, errors: [], guide };
}
