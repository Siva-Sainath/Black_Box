export type ScreenType = 
  | 'screen1_brain'
  | 'screen2_drawer'
  | 'screen3_sandbox'
  | 'screen4_analytics'
  | 'screen5_correction';

export type NodeStatus = 'idle' | 'active' | 'passed' | 'flagged' | 'dim';

export interface SaeLogitAttribution {
  token: string;
  attribution: number; // percentage, positive pushes token, negative suppresses token
  isPromoted: boolean;
}

export interface SaeFeatureDetails {
  featureId: string; // e.g. "L28.sae_latents[14892]"
  layerIndex: number; // e.g. 28
  dictionarySize: number; // e.g. 65536
  activationSigma: number; // e.g. +4.82 (standard deviations above baseline)
  activationRaw: number; // e.g. 18.42
  l0Sparsity: number; // e.g. 14
  monosemanticLabel: string;
  explanation: string;
  circuitSource: string; // e.g. "AttnHead L26.H4 -> MLP L27"
  logitAttributions: SaeLogitAttribution[];
  topActivatingTokens: string[];
  refusalCosineSim: number;
}

export interface BrainNode3D {
  id: string;
  orderIndex: number;
  label: string;
  anatomicalRegion: string; // e.g. "Orbitofrontal Cortex (OFC) - BA 11"
  lobe: 'frontal' | 'temporal' | 'parietal' | 'occipital' | 'limbic' | 'cerebellum' | 'brainstem';
  moduleName: string;
  category: 'perception' | 'memory' | 'guardrail' | 'reasoning' | 'tool_caller' | 'verifier' | 'action';
  // 3D coordinates in Three.js unit space (-10 to +10)
  x: number;
  y: number;
  z: number;
  hemisphere: 'left' | 'right' | 'center';
  description: string;
  saeFeature: SaeFeatureDetails;
}

export interface Synapse3D {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  controlOffset?: { x: number; y: number; z: number };
}

export type BrainNode = BrainNode3D;
export type Synapse = Synapse3D;

export type FlagTaxonomy = 
  | 'unsupported_claim'
  | 'coordination_gap'
  | 'spec_ambiguity'
  | 'premature_action'
  | 'verification_omission'
  | 'voice_token_drift'
  | 'voice_hallucinated_action'
  | 'payment_invariant_breach'
  | 'crm_privilege_escalation';

export interface InternalSignals {
  epistemicUncertainty: number; // 0-100%
  prematureActionBias: number;  // 0-100%
  contextDrift: number;         // 0-100%
  verificationGap: number;      // 0-100%
  saeAnomalyScore?: number;     // 0-100%
}

export interface RunStep {
  stepNumber: number;
  totalSteps: number;
  nodeId: string;
  stepName: string;
  phase: string;
  latencyMs: number;
  status: 'nominal' | 'flagged' | 'pending' | 'verified';
  confidenceScore: number; // 0-100
  reasoning: string;
  toolCall: {
    name: string;
    args: Record<string, unknown>;
  } | null;
  toolResult: Record<string, unknown> | null;
  flagReason?: string;
  flagTaxonomy?: FlagTaxonomy;
  internalSignals: InternalSignals;
  saeFeatureOverride?: Partial<SaeFeatureDetails>;
  groundTruthExpectation?: string;
}

export type ScenarioCategory = 'clean' | 'trap' | 'edge_case' | 'integration_voice' | 'integration_fintech' | 'integration_crm';
export type ScenarioRunResult = 'passed' | 'failed_and_caught' | 'failed_and_missed' | 'pending';

export interface Scenario {
  id: string;
  name: string;
  category: ScenarioCategory;
  provider?: 'native' | 'elevenlabs' | 'dodo_payments' | 'freshworks_studio';
  description: string;
  userPrompt: string;
  groundTruthExpected: string;
  lastRunResult: ScenarioRunResult;
  lastRunTimestamp: string;
  latencyMs: number;
  steps: RunStep[];
  hasActiveCorrection?: boolean;
  fixedByRuleId?: string;
}

export interface CorrectionRule {
  id: string;
  scenarioId: string;
  scenarioName: string;
  flaggedStepIndex: number;
  title: string;
  plainRule: string;
  guardrailCode: string;
  taxonomy: FlagTaxonomy;
  createdAt: string;
  status: 'pending' | 'applied' | 'verified';
  impactDelta: string;
  saeClampingTarget?: string;
}

export interface AnalyticsBatch {
  batchId: string;
  batchName: string;
  timestamp: string;
  totalScenarios: number;
  flaggedRate: number;
  passedRate: number;
  missedRate: number;
  mttcMs: number;
  activeRulesCount: number;
  ruleInjected?: string;
}

export interface Incident {
  id: string;
  scenarioId: string;
  scenarioName: string;
  stepNumber: number;
  stepName: string;
  taxonomy: FlagTaxonomy;
  flagReason: string;
  confidence: number;
  timestamp: string;
  status: 'unresolved' | 'in_review' | 'corrected';
  severity: 'critical' | 'high' | 'medium';
  saeLatentId?: string;
  provider?: 'native' | 'elevenlabs' | 'dodo_payments' | 'freshworks_studio';
}

export type PlaybackState = 'idle' | 'running' | 'flagged' | 'complete_nominal' | 'complete_verified';

export type IntegrationProviderId = 'elevenlabs' | 'dodo_payments' | 'freshworks_studio' | 'native' | 'langchain' | 'crewai';

export interface AgentStudioIntegration {
  id: IntegrationProviderId;
  name: string;
  category: 'Voice AI & Conversational' | 'Fintech & Payment Rails' | 'Enterprise CRM & Helpdesk' | 'Framework';
  tagline: string;
  description: string;
  logoBadge: string;
  isConnected: boolean;
  activeAgentsCount: number;
  lastSync: string;
  evalPassRate: number;
  webhookUrl: string;
  primarySandboxId: string;
  featuredInvariant: string;
}

export type SandboxStage = 'ingestion' | 'reasoning' | 'tool_call' | 'sae_probe' | 'judge_evaluation';
export type JudgeVerdict = 'PASSED' | 'HALTED_ANOMALY' | 'EVALUATING' | 'PENDING';

export interface LiveAgentRunner {
  id: string;
  name: string;
  provider: IntegrationProviderId;
  avatarColor: string;
  scenarioId: string;
  scenarioName: string;
  currentStage: SandboxStage;
  progressPercent: number;
  activeTokensCount: number;
  latencyMs: number;
  activeThoughtSnippet: string;
  verdict: JudgeVerdict;
  saeAnomalyDetected?: boolean;
  saeLatentSpike?: string;
}
