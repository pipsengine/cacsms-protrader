export class ExecutionGovernanceService {
  static async processApprovedSetup(setup: any) {
    return { status: 'SENT_TO_BRIDGE' };
  }
}
