import { UserStatus } from './../enums/user-status';
import { AuthorType } from './../enums/author-type';
import { ProjectCardModel } from './project-card.model';
import { Vote } from '../enums/vote';

export interface UserModel {
    _id: string;
    group: string | null;
    authorType: AuthorType;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    birthDate: Date;
    zipCode: string;
    status: UserStatus;
    profilePicture?: string;
}
