import { Vote } from "../enums/vote";
import { ProjectCardModel } from "./project-card.model";

export interface UserActivitiesModel {
  favoriteProjects?: ProjectCardModel[];
  votes?: {[vote in Vote]: ProjectCardModel[]};
  projects?: ProjectCardModel[];
}
