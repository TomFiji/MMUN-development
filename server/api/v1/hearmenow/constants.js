// Should be identical to app\src\app\enums\error-codes.ts
const ERROR_CODES = {
  NOT_FOUND: "NF404",
  NOT_AUTHENTICATED: "NAUTH",
  UNEXPECTED_ERROR: "NTEXP",
  NOT_AUTHORIZED: "NAUZE",
  ACCOUNT_ALREADY_EXISTS: "NEXIS",
  PROJECT_ALREADY_FAVORITED: "PRFAV",
  PROJECT_ALREADY_VOTED: "PRVOT",
  INVALID_CREDENTIALS: "NCRED",
  IMAGE_UPLOAD: "IMGUP",
  IMAGE_REMOVE: "IMGRM",
  PROJECT_NOT_FOUND: "PRJNF",
  BAD_REQUEST: "BDREQ",
  BANNED: "BANND",
  INVALID_GROUP: "NOGRP",
};

const COOKIES = {
  AUTH: "auth",
  AUTH_EXP: 3600 * 24,
  AUTH_EXP_MILLISECOND: 3600 * 24 * 1000,
  SESSION: "session",
  CSRF: "csrf",
};

const SDG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const VOTE_TYPES = {
  FOR: "for",
  AGAINST: "against",
  ABSTAIN: "abstain",
};

const AUTHOR_TYPES = {
  STUDENT: "student",
  TEACHER: "teacher",
  USER: "user",
  ADMIN: "admin",
  ORGANIZATION: "organization"
};

const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  BANNED: "banned",
};

const EMAIL_SUBJECTS = {
  RESET_PASSWORD: "HearMeNow Reset Password Request",
  CONFIRM_EMAIL: "HearMeNow Confirm Email Request",
  WELCOME: "HearMeNow Welcome",
};

const EMAIL_TYPES = {
  RESET_PASSWORD: "RESET_PASSWORD",
  CONFIRM_EMAIL: "CONFIRM_EMAIL",
  WELCOME: "WELCOME",
};

const EMAIL_TEMPLATES_RELATIVE_PATHS = {
  RESET_PASSWORD: [__dirname, "templates", "reset-password.template.html"],
  CONFIRM_EMAIL: [__dirname, "templates", "confirm-email.template.html"],
  WELCOME: [__dirname, "templates", "welcome.template.html"],
};

const EMAIL_TEMPLATES = {
  RESET_PASSWORD: `
    <h2> Hello {{{name}}} </h2>
    <p> We have received a request to change the password for "{{{email}}}" </p>
    <p> You would need the following token to reset your password</p><br>
    <p><b>{{{token}}}<b></p>
    <br><br>
    <small> Hear Me Now Project</small>
  `,
  CONFIRM_EMAIL: `
  <h2> Hello {{{name}}} </h2>
  <p> Please confirm your email for the HearMeNow Project using the following token </p><br>
  <p>{{{token}}}</p>
  <br><br>
  <small> Hear Me Now Project</small>
  `,
  WELCOME: `
  <h2> Hello {{{name}}} </h2>
  <p> Your account has been successfully registered</p>
  <p> You can now start helping in changing the future </p>
  <small> Hear Me Now Project</small>
  `,
};

const PAGINATION_LIMIT = 15;
const GROUP_SEARCH_MAX_RESULT = 10;

const CACHE_UPDATE_DURATION = 180000
const TOP_PROJECTS_CACHE = {
  CACHED_DATA: null,
  LAST_UPDATE: 0,
  SHOW_ALL: 0,
}

module.exports = {
  ERROR_CODES,
  COOKIES,
  SDG,
  VOTE_TYPES,
  AUTHOR_TYPES,
  STATUS,
  EMAIL_TEMPLATES,
  EMAIL_TYPES,
  EMAIL_SUBJECTS,
  PAGINATION_LIMIT,
  GROUP_SEARCH_MAX_RESULT,
  EMAIL_TEMPLATES_RELATIVE_PATHS,
  CACHE_UPDATE_DURATION,
  TOP_PROJECTS_CACHE
};
