export class GlobalRiskService {
  static async evaluateSetup(setup: any) {
    return { approved: true, reasons: [] };
  }
}
