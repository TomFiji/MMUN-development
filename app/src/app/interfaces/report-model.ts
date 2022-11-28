export interface ReportModel {
  _id: string,
  projectId: string;
  message: string;
  reporter: string;
  submissionDate: Date;
}
