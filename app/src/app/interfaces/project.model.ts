import { SDG } from '../enums/sdg';
import { Vote } from './../enums/vote';
import { ProjectCardModel } from './project-card.model';
export interface ProjectModel {
  _id: string,
  title: string;
  subtitle: string;
  images: string[];
  description: string;
  impactStatement: string;
  abstract: string;
  sdg: SDG[];
  country: string;
  author: string;
  datePublished: Date;
  openDate: Date;
  closeDate: Date;
  isSponsored: boolean;
  createdBy: string;
  votes?: {[vote in Vote]: number};
}
export interface NewProjectModel {
  title: string;
  subtitle: string;
  images: string[];
  description: string;
  impactStatement: string;
  abstract: string;
  sdg: SDG[];
  country: string;
  openDate: Date | string;
  closeDate: Date | string;
  isSponsored: boolean;
}
