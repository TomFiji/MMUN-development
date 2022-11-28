import { ERROR_CODES } from './../../enums/error-codes';
import { SDG } from 'src/app/enums/sdg';

const localization: { [token: string]: string } = {
  appName: 'Hear Me Now',
  'core.yes': 'Oui',
  'core.no': 'Non',
  'core.confirm': 'Confirmer',
  'core.cancel': 'Annuler',
  'core.greeting': 'Bonjour {{user}}',
  'core.share': 'Partager',
  'core.votes': 'votes',
  'core.firstName': 'prénom',
  'core.lastName': 'nom',
  'core.email': 'courriel',
  'core.number': 'numéro de téléphone',
  'core.country': 'pays',
  'core.zipCode': 'code zip/postal ',
  'core.birthDate': 'date de naissance',
  'core.group': 'groupe d`étudiant',
  'core.password': 'mot de passe',
  'core.userStatus': "statut de l'utilisateur",
  'core.authorType': "Type d'utilisateur",
  'core.authorType.admin': 'Admin',
  'core.authorType.teacher': 'Enseignant(e)',
  'core.authorType.student': 'Étudiant(e)',
  'core.delete': 'effacer',
  'core.edit': 'modifier',
  'core.close': 'fermer',
  'core.clear': 'clairer',
  'core.vote.for': 'Pour',
  'core.vote.against': 'Contre',
  'core.vote.abstain': "Abstention",
  'core.emailToken': 'Code de Sécurité',
  'core.newPassword': 'nouveau mot de passe',
  'core.confirmPassword': 'confirmer votre mot de passe',
  'core.newInitiative': 'Créer une nouvelle initiative',
  'core.noInitiatives': 'Aucune initiative trouvée',
  'core.delete.item': 'Êtes-vous certain(e)?',
  'core.delete.project':
    "Êtes-vous certain(e) de vouloir supprimer l'initiative '{{title}}'?",
  'core.closed': 'fermé',

  'lang.en': 'Anglais (English)',
  'lang.fr': 'Français',
  'lang.kr': 'Coréen (한국어)',

  [`sdg.${SDG.POVERTY}`]: 'Pas de Pauvreté',
  [`sdg.${SDG.HUNGER}`]: 'Faim "Zéro"',
  [`sdg.${SDG.HEALTH}`]: 'Bonne Santé',
  [`sdg.${SDG.EDUCATION}`]: 'Éducation de Qualité',
  [`sdg.${SDG.GENDER}`]: 'Égalité Entre les Sexes',
  [`sdg.${SDG.WATER}`]: 'Eau Propre',
  [`sdg.${SDG.ENERGY}`]: "Énergie Propre",
  [`sdg.${SDG.ECONOMIC}`]: 'Croissance Économique',
  [`sdg.${SDG.INDUSTRY}`]: 'Innovation et Infrastructure',
  [`sdg.${SDG.INEQUALITIES}`]: 'Inégalités Réduite',
  [`sdg.${SDG.COMMUNITIES}`]: 'Communautés Durables',
  [`sdg.${SDG.CONSUMPTION}`]: 'Consommation Responsable',
  [`sdg.${SDG.CLIMATE}`]: 'Lutte Contre les Changements Climatiques',
  [`sdg.${SDG.SEA_LIFE}`]: 'Vie Aquatique',
  [`sdg.${SDG.LAND_LIFE}`]: 'Vie Terrestre',
  [`sdg.${SDG.PEACE}`]: 'Paix et Justice',
  [`sdg.${SDG.PARTNERSHIPS}`]: "Partenariats Pour la Réalisation D'objectifs",
  [`sdg.${SDG._TRENDING}`]: 'Populaire',
  [`sdg.${SDG._LOCAL}`]: 'Local pour vous',

  'pages.notFound.title': '404 Page Introuvable',
  'pages.notFound.wentWrong': "Quelque chose s'est mal passé!",
  'pages.notFound.pageNotFound': "La clé pour cette page est perdue!",

  'pages.signup.title': 'Créez votre compte HearMeNow maintenant!',
  'pages.signup.tab.teacher': "Je suis un enseignant(e)",
  'pages.signup.tab.student': "Je suis un étudiant(e)",
  'pages.signup.button.signup': "s'inscrire",
  'pages.signup.login': 'Vous avez déjà un compte',
  'pages.signup.success':
    "Vote compte a été créé avec succès.<br>Veuillez vérifier votre courriel pour l'e-mail de confirmation.",

  'pages.login.title': 'Connectez-vous à votre compte',
  'pages.login.button.login': 'Se Connecter',
  'pages.login.link.forgotPassword': 'Mot de passe oublié?',
  'pages.login.link.newAccount': 'Créer un nouveau compte',
  'pages.login.success': 'Connexion réussie',
  'pages.login.error.credentials': 'Informations erronées, veuillez réessayer.',
  'pages.login.toast.logout': 'Déconnecté.',

  'pages.discover.title': 'Découvrir',
  'pages.discover.loading.projects': 'Chargement des initiatives ...',
  'pages.discover.init.title': 'vos initiatives',
  'pages.discover.loading': 'Chargement des initiatives',

  'pages.search.text': 'Requête textuelle',
  'pages.search.text.error': 'La requête textuelle doit comporter au moins 2 caractères',
  'pages.search.country': 'Pays',
  'pages.search.country.error': 'Le nom du pays doit comporter au moins 2 caractères',
  'pages.search.sdg': 'ODD',
  'pages.search.search': 'Rechercher',

  'pages.profile.button.editProfile': 'Modifier votre profil',
  'pages.profile.button.changePhoto': 'Modifier votre photo',
  'pages.profile.button.changePassword': 'Modifier votre mot de passe',
  'pages.profile.button.changeEmail': 'Modifier votre courriel',
  'pages.profile.button.logout': 'Déconnexion',
  'pages.profile.button.admin': 'Admin',
  'pages.profile.update.profile': 'Profil modifier.',

  'pages.profileEdit.title': 'Modifier Votre Profil',
  'pages.profileEdit.button.save': 'Sauvegarder',
  'pages.profileEdit.button.changeProfilePhoto': 'Modifier votre photo de profil',

  'pages.home.about.title': 'À Propos',
  'pages.home.about.content': "L'opération Hear Me Now apprend aux jeunes qu'ils peuvent changer le monde en leur donnant l'occasion d'exprimer leurs opinions sur les questions qui les intéressent. Les jeunes sont l'avenir de ce monde, et leur point de vue et leur vision façonneront l'avenir. Hear Me Now sert d'outil à la jeune génération pour exprimer leur idées et faire de ce monde un endroit meilleur. Cette plateforme permet aux étudiants de différentes âges de créer leurs propres initiatives et d'exprimer leur opinion en s'abstenant ou en votant pour ou contre d'autres initiatives. De plus, cette fonction de vote permet aux jeunes de voir leurs votes et l'impact local ou mondial résultant en temps réel.",
  'pages.home.sdg.title': 'ODD',
  'pages.home.sdg.content': "Les objectifs de développement durable sont un appel universel à l'action pour éliminer la pauvreté, protéger la planète et améliorer le quotidien de toutes les personnes partout dans le monde, tout en leur ouvrant des perspectives d'avenir. Au nombre de 17, les objectifs de développement durable ont été adoptés en 2015 par l'ensemble des États Membres de l'Organisation des Nations Unies dans le cadre du Programme de développement durable à l'horizon 2030, qui définit un plan sur 15 ans visant à réaliser ces objectifs",
  [`pages.home.sdg.${SDG.POVERTY}`]: 'Éliminer la pauvreté sous toutes ses formes et partout dans le monde.',
  [`pages.home.sdg.${SDG.HUNGER}`]: "Éliminer la faim, assurer la sécurité alimentaire, améliorer la nutrition et promouvoir l'agriculture durable.",
  [`pages.home.sdg.${SDG.HEALTH}`]: 'Permettre à tous de vivre en bonne santé et promouvoir le bien-être de tous à tout âge.',
  [`pages.home.sdg.${SDG.EDUCATION}`]: "Assurer à tous une éducation équitable, inclusive et de qualité et des possibilités d'apprentissage tout au long de la vie.",
  [`pages.home.sdg.${SDG.GENDER}`]: "Parvenir à l'égalité des sexes et autonomiser toutes les femmes et les filles.",
  [`pages.home.sdg.${SDG.WATER}`]: "Garantir l'accès de tous à des services d'alimentation en eau et d'assainissement gérés de façon durable.",
  [`pages.home.sdg.${SDG.ENERGY}`]: "Garantir l'accès de tous à des services énergétiques fiables, durables et modernes, à un coût abordable.",
  [`pages.home.sdg.${SDG.ECONOMIC}`]: 'Promouvoir une croissance économique soutenue, partagée et durable, le plein emploi productif et un travail décent pour tous.',
  [`pages.home.sdg.${SDG.INDUSTRY}`]: "Bâtir une infrastructure résiliente, promouvoir une industrialisation durable qui profite à tous et encourager l'innovation.",
  [`pages.home.sdg.${SDG.INEQUALITIES}`]: "Réduire les inégalités dans les pays et d'un pays à l'autre.",
  [`pages.home.sdg.${SDG.COMMUNITIES}`]: 'Faire en sorte que les villes et les établissements humains soient ouverts à tous, sûrs, résilients et durables.',
  [`pages.home.sdg.${SDG.CONSUMPTION}`]: 'Établir des modes de consommation et de production durables.',
  [`pages.home.sdg.${SDG.CLIMATE}`]: "Prendre d'urgence des mesures pour lutter contre les changements climatiques et leurs répercussions.",
  [`pages.home.sdg.${SDG.SEA_LIFE}`]: 'Conserver et exploiter de manière durable les océans, les mers et les ressources marines aux fins du développement durable.',
  [`pages.home.sdg.${SDG.LAND_LIFE}`]: "Préserver et restaurer les écosystèmes terrestres, en veillant à les exploiter de façon durable, gérer durablement les forêts, lutter contre la désertification, enrayer et inverser le processus de dégradation des terres et mettre fin à l'appauvrissement de la biodiversité.",
  [`pages.home.sdg.${SDG.PEACE}`]: "Promouvoir l'avènement de sociétés pacifiques et inclusives aux fins du développement durable, assurer l'accès de tous à la justice et mettre en place, à tous les niveaux, des institutions efficaces, responsables et ouvertes à tous.",
  [`pages.home.sdg.${SDG.PARTNERSHIPS}`]: 'Renforcer les moyens de mettre en œuvre le Partenariat mondial pour le développement durable et le revitaliser.',
  'pages.home.project.title': 'Initiatives',
  'pages.home.project.link.discover': 'découvrir les initiatives',
  'pages.home.project.link.create': 'créer une initiative',
  'pages.home.project.content': "Plus qu'une simple application de vote, Hear Me Now permet les jeunes de lancer des projets, voter pour les initiatives ouvertes et inviter leurs amis, leurs camarades de classe et autres organisations. De plus, les sponsors peuvent multiplier leur impact et leur voix. Le consensus et les votes majoritaires seront présentés aux gouvernements et aux entreprises comme représentation de la voix de la prochaine génération",

  'pages.favorite.title': 'Favoris et Votes',
  'pages.favorite.favorite': 'Favoris',
  'pages.favorite.added': "L'initiative a été ajoutée à votre liste de favoris.",
  'pages.favorite.removed':
    "L'initiative a été supprimée de votre liste de favoris.",

  'pages.forgotPassword.title': 'Mot de Passe Oublié',
  'pages.forgotPassword.success': "S'il vous plaît vérifier votre e-mail pour un code.",
  'pages.forgotPassword.button.forgotPassword': 'prochain',

  'pages.resetPassword.title': "Réinitialiser votre mot de passe",
  'pages.resetPassword.success': 'Votre mot de passe a été mis à jour.',
  'pages.resetPassword.button.resetPassword': 'mettre à jour votre mot de passe',

  'pages.changePassword.title': 'Changer votre mot de passe',
  'pages.changePassword.button.changePassword': 'mettre à jour votre mot de passe',

  'pages.confirmEmail.title': 'Confirmez votre adresse e-mail',
  'pages.confirmEmail.header': 'Un code de sécurité a été envoyé à "{{email}}".',
  'pages.confirmEmail.button.confirm': 'Confirmer',
  'pages.confirmEmail.button.resend': 'Renvoyer le Code',
  'pages.confirmEmail.button.logout': 'Se déconnecter',
  'pages.confirmEmail.confirmed': 'Votre adresse e-mail a été confirmée.',
  'pages.confirmEmail.resend': 'un nouveau code a été envoyé à votre e-mail.',

  'pages.updateEmail.title': 'Mettre à jour votre e-mail',
  'pages.updateEmail.success': 'Un code de sécurité a été envoyé à votre adresse e-mail.',
  'pages.updateEmail.email': 'Nouvelle addresse e-mail',
  'pages.updateEmail.button.updateEmail': 'mettre à jour',

  'pages.project.header.new.title': "Création de l'initiative: ",
  'pages.project.header.edit.title': "Modification de l'initiative: ",
  'pages.project.submit.edit': "modifier l'initiative",
  'pages.project.submit.new': 'créer une initiative',
  'pages.project.title': 'Titre',
  'pages.project.subtitle': 'sous-titre',
  'pages.project.images': 'images',
  'pages.project.description': 'description',
  'pages.project.impactStatement': "déclaration d'impact",
  'pages.project.abstract': 'résumé',
  'pages.project.sdg': 'Objectifs de Développement Durable',
  'pages.project.country': 'pays',
  'pages.project.openDate': "date d'ouverture",
  'pages.project.closeDate': 'date de clôture',
  'pages.project.isSponsored': "l'initiative est-elle sponsorisée?",
  'pages.project.created': 'Votre initiative a été créée avec succès',
  'pages.project.updated': 'Votre initiative a été mise à jour avec succès',
  'pages.project.deleted': 'Votre initiative a été supprimée',
  'pages.images.add': 'Ajouter une nouvelle image',
  'pages.images.uploaded': "L'image a été téléchargée",
  'pages.images.removed': "L'image a été supprimée",

  'pages.admin.header': 'Admin : accès restreint',
  'pages.admin.titles.reports': 'rapports',
  'pages.admin.titles.users': 'utilisateurs',
  'pages.admin.titles.projects': 'projets',
  'pages.admin.empty.reports': 'aucun rapport',
  'pages.admin.status.ban': 'bannir',
  'pages.admin.status.unBan': 'dé-bannir',
  'pages.admin.status.submissionDate': 'Date de Soumission',
  'pages.admin.status.reporter': 'Auteur du rapport',
  'pages.admin.delete.report': 'Le rapport a été supprimé',

  'pages.projectDetail.abstract': 'Résumé',
  'pages.projectDetail.impact': "Déclaration d'impact",
  'pages.projectDetail.aboutInitiative': "À propos de l'Initiative",
  'pages.projectDetail.readMore': 'Montrer plus',
  'pages.projectDetail.readLess': 'Montrer moins',
  'pages.projectDetail.alreadyVoted': 'Compte de Votes',
  'pages.projectDetail.voted': 'Vos votes ont été soumis',
  'pages.projectDetail.sdg': 'ODD',
  'pages.projectDetail.youth': 'jeunesse',
  'pages.projectDetail.voices': 'voix',
  'pages.projectDetail.report': 'Rapporter',
  'pages.projectDetail.reported': 'Le Projet a été Rapporter.',
  'pages.projectDetail.share': 'Copier le Lien',
  'pages.projectDetail.share.copied':
    "Le lien de l'initiative a été copié dans votre presse-papier.",
  'pages.projectDetail.cancel': 'Annuler',
  'pages.projectDetail.ellipsis': '...',

  'pages.admin.user.update': "Mettre à Jour l'Utilisateur",
  'pages.admin.user.title': "Modification d'Utilisateur comme Admin",
  'pages.admin.user.banned': "L'utilisateur est banni.",
  'pages.admin.user.unbanned': "L'utilisateur n'est plus banni",
  'pages.admin.user.deleted': "L'utilisateur a été supprimé.",

  'reports.message.guidelines': 'Contre les directives de la communauté',
  'pages.projectVote.vote': 'Voter',
  'pages.projectVote.closeDate': 'Date de Clôture:',
  'pages.projectVote.voteToChange': "Votons pour le changer",

  'errors.field.fixIt': 'Veuillez résoudre toutes les erreurs et réessayer.',
  'errors.field.requiredImage': "Vous avez besoin d'au moins une image.",
  'errors.field.required': 'Champ requis',
  'errors.field.limit': 'Le champ doit être entre {{min}} et {{max}}',
  'errors.field.maxLimit': 'Le champ ne peut pas être plus long que {{max}}',
  'errors.field.minLimit': 'Le champ ne peut pas être plus court que {{min}}',
  'errors.field.invalid': 'Valeur {{name}} invalide.',
  'errors.field.invalid.email': "Format d'e-mail invalide",
  'errors.field.invalid.group': 'Nom de groupe invalide',
  'errors.field.emailToken.onlyNumbersRequired': 'Seuls les chiffres sont requis',
  'errors.field.sdg.max': 'Il est interdit de sélectionner plus de 3 objectifs.',
  'errors.field.password.notMatch': 'Les mots de passe ne correspondent pas',
  'errors.field.password.week': 'Le mot de passe est trop faible.',
  'errors.field.password.should.length':
    'Le mot de passe doit comporter au moins 8 caractères.',
  'errors.field.password.should.upper':
    'Le mot de passe doit contenir des lettres majuscules.',
  'errors.field.password.should.lower':
    'Le mot de passe doit contenir des lettres minuscules.',
  'errors.field.password.should.number': 'Le mot de passe doit comporter des chiffres.',
  'errors.field.password.should.special':
    'Le mot de passe doit avoir un caractère spécial.',
  'errors.http.unknown': "Quelque chose s'est mal passé :(",
  [`errors.http.${ERROR_CODES.UNEXPECTED_ERROR}`]: "Quelque chose s'est mal passé :(",
  [`errors.http.${ERROR_CODES.BAD_REQUEST}`]: 'Requête invalide!',
  [`errors.http.${ERROR_CODES.NOT_AUTHENTICATED}`]: 'Authentification échouée!',
  [`errors.http.${ERROR_CODES.NOT_FOUND}`]:
    "Impossible de trouver l'élément demandé.",
  [`errors.http.${ERROR_CODES.NOT_AUTHORIZED}`]: 'Action non autorisée!',
  [`errors.http.${ERROR_CODES.INVALID_CREDENTIALS}`]:
    "L'e-mail ou le mot de passe est invalide !",
  [`errors.http.${ERROR_CODES.PROJECT_ALREADY_FAVORITED}`]:
    "Le projet est déjà dans les favoris de l'utilisateur!",
  [`errors.http.${ERROR_CODES.ACCOUNT_ALREADY_EXISTS}`]:
    "L'addresse e-mail entré est déjà associé à un compte!",
  [`errors.http.${ERROR_CODES.PROJECT_NOT_FOUND}`]:
    "Impossible de trouver l'initiative!",
  [`errors.http.${ERROR_CODES.IMAGE_REMOVE}`]: "Impossible de supprimer l'image!",
  [`errors.http.${ERROR_CODES.IMAGE_UPLOAD}`]: "Impossible de télécharger l'image!",
  [`errors.http.${ERROR_CODES.BANNED}`]:
    "Votre compte a été banni par l'administrateur, veuillez contacter le support.",
  [`errors.http.${ERROR_CODES.PROJECT_ALREADY_VOTED}`]:
    'Vous avez déjà utilisé cette option de vote pour cette initiative',
  [`errors.http.${ERROR_CODES.INVALID_GROUP}`]: "Le groupe entré n'existe pas",
};

export default localization;