import { SDG } from '../enums/sdg';
import { Vote } from '../enums/vote';
import { AuthorType } from './../enums/author-type';

export interface ProjectCardModel {
  _id: string;
  title: string;
  subtitle: string;
  images: string[];
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
