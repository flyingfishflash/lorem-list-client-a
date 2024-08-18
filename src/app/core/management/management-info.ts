export class ManagementInfo {
  build:
    | {
        artifact: string;
        ciPipelineId: string;
        ciPlatform: string;
        commit: string;
        group: string;
        name: string;
        time: string;
        version: string;
      }
    | undefined;
}
