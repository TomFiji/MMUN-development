import { ERROR_CODES } from './../../enums/error-codes';
import { SDG } from 'src/app/enums/sdg';

const localization: { [token: string]: string } = {
  appName: 'Hear Me Now',
  'core.yes': '네',
  'core.no': '아니요',
  'core.confirm': '확인',
  'core.cancel': '취소',
  'core.greeting': '안녕하세요 {{user}}',
  'core.share': '공유',
  'core.votes': '투표',
  'core.firstName': '이름',
  'core.lastName': '성',
  'core.email': '이메일 주소',
  'core.number': '전화번호',
  'core.country': '국가',
  'core.zipCode': '주소',
  'core.birthDate': '생년월일',
  'core.group': '학생 그룹',
  'core.password': '비밀번호',
  'core.userStatus': '사용자 현황',
  'core.authorType': '사용자 종류',
  'core.authorType.admin': '관리자',
  'core.authorType.teacher': '선생님',
  'core.authorType.student': '학생',
  'core.delete': '삭제',
  'core.edit': '수정',
  'core.close': '닫기',
  'core.clear': '지우기',
  'core.vote.for': '찬성하다',
  'core.vote.against': '반대하다',
  'core.vote.abstain': '기권하다',
  'core.emailToken': '보안코드',
  'core.newPassword': '새 비밀번호',
  'core.confirmPassword': '비밀번호 확인',
  'core.newInitiative': '새 게시물 만들기.',
  'core.noInitiatives': '생성된 게시물이 없습니다',
  'core.delete.item': '삭제 하시겠습니까?',
  'core.delete.project': '이 게시물을 삭제 하시겠습니까? "{{title}}"?',
  'core.closed': '종료되었습니다',

  'lang.en': '영어 (English)',
  'lang.fr': '프랑스어 (Français)',
  'lang.kr': '한국어',

  [`sdg.${SDG.POVERTY}`]: '빈곤 퇴치',
  [`sdg.${SDG.HUNGER}`]: '기아 종식',
  [`sdg.${SDG.HEALTH}`]: '건강과 웰빙',
  [`sdg.${SDG.EDUCATION}`]: '양질의 교육',
  [`sdg.${SDG.GENDER}`]: '성평등',
  [`sdg.${SDG.WATER}`]: '깨끗한 물과 위생',
  [`sdg.${SDG.ENERGY}`]: '적정 가격의 깨끗한 에너지',
  [`sdg.${SDG.ECONOMIC}`]: '양질의 일자리와 경제성장',
  [`sdg.${SDG.INDUSTRY}`]: '산업, 혁신, 사회기반 시설',
  [`sdg.${SDG.INEQUALITIES}`]: '불평등 감소',
  [`sdg.${SDG.COMMUNITIES}`]: '지속가능한 도시와 지역사회',
  [`sdg.${SDG.CONSUMPTION}`]: '책임 있는 소비와 생산',
  [`sdg.${SDG.CLIMATE}`]: '기후행동',
  [`sdg.${SDG.SEA_LIFE}`]: '수생태계 보전',
  [`sdg.${SDG.LAND_LIFE}`]: '육상생태계 보전',
  [`sdg.${SDG.PEACE}`]: '평화, 정의, 강력한 제도',
  [`sdg.${SDG.PARTNERSHIPS}`]: '목표 달성을 위한 파트너십',
  [`sdg.${SDG._TRENDING}`]: '유행의',
  [`sdg.${SDG._LOCAL}`]: '현지 사용자',

  'pages.notFound.title': '404 페이지를 찾을 수 없습니다',
  'pages.notFound.wentWrong': '알 수 없는 에러가 발생하였습니다!',
  'pages.notFound.pageNotFound': '이 페이지를 찾을 수 없습니다!',

  'pages.signup.title': '당신의 HEAR ME NOW 계정을 생성하세요!',
  'pages.signup.tab.teacher': '저는 선생님 입니다',
  'pages.signup.tab.student': '저는 학생 입니다',
  'pages.signup.button.signup': '회원가입',
  'pages.signup.login': '이미 등록된 계정이 있습니다',
  'pages.signup.success':
    '계정이 성공적으로 생성되었습니다.<br>당신의 이메일을 확인해 주세요.',

  'pages.login.title': '내 계정으로 로그인',
  'pages.login.button.login': '로그인',
  'pages.login.link.forgotPassword': '비밀번호를 잊으셨나요?',
  'pages.login.link.newAccount': '새 계정 만들기',
  'pages.login.success': '성공적으로 로그인하였습니다',
  'pages.login.error.credentials': '잘못된 자격증명입니다, 다시 시도해 주세요.',
  'pages.login.toast.logout': '로그아웃.',

  'pages.home.about.title': '~대해서',
  'pages.home.about.content':
    '"Hear Me Now" 운영은 청소년들에게 중요한 문제들에 대해 의견을 말하고 세상을 변화시킬 수 있다는 것을 가르칠 기회가 주어집니다. 젊은이들은 이 세상의 미래이며, 그들의 관점과 비전은 우리 세계의 미래이기 때문입니다. "Hear Me Now operation"은 젊은이들이 그들의 생각을 표현하고 이 지구촌을 더 나은 곳으로 만들 수 있도록 도움을 줍니다. 하지만, Hear Me Now는 다른 연령대의 학생들이 게시물을 만들고 그것에 대한 의견을 표현할 수 있도록 합니다. 공감대와 다수결은 다음 세대의 정통한 목소리로 정부와 기업에 제시될 것입니다. 게다가, 이 투표 기능은 젊은이들이 그들의 투표와 영향을 실시간으로, 지역적으로, 또는 전 세계적으로 볼 수 있도록 합니다.',
  'pages.home.sdg.title': '지속가능발전목표(SDGs)',
  'pages.home.sdg.content':
    'SDGs, 즉 지속가능 발전목표는 2015년부터 2030년까지 UN과 국제사회의 최대 공동목표를 말합니다. 인류의 보편적 문제 (빈곤, 질병, 교육, 성평등, 난민, 분쟁 등)과 지구 환경문제(기후변화, 에너지, 환경오염, 물, 생물다양성 등), 경제사회문제(기술, 주거, 노사, 고용, 생산과 소비, 사회구조, 법, 대내외 경제)를 2030년까지 17가지 주 목표와 169개 세부목표로 해결하고자 이행하는 국제사회 최대 공동목표입니다.',
  [`pages.home.sdg.${SDG.POVERTY}`]: '지구 상 모든 형태의 빈곤 종식.',
  [`pages.home.sdg.${SDG.HUNGER}`]:
    '기아의 종식, 식량 안보 확보, 영양상태 개선 및 지속가능농업 촉진.',
  [`pages.home.sdg.${SDG.HEALTH}`]:
    '건강한 삶의 보장과 전 세대를 위한 복리(well-being) 증진.',
  [`pages.home.sdg.${SDG.EDUCATION}`]:
    '모두를 위한 폭 넓고 수준 있는 교육 보장과 평생 학습 기회 제공.',
  [`pages.home.sdg.${SDG.GENDER}`]: '양성평등과 여권 신장 실현.',
  [`pages.home.sdg.${SDG.WATER}`]:
    '모두를 위한 깨끗한 물과 위생시설 접근성 보장.',
  [`pages.home.sdg.${SDG.ENERGY}`]:
    '모두를 위한 적정 가격의 신뢰할 수 있고 지속 가능하며 현대적인 에너지에의 접근 보장.',
  [`pages.home.sdg.${SDG.ECONOMIC}`]:
    '모두를 위한 포용적이고 지속가능한 성장과 고용 및 양질의 일자리 제공.',
  [`pages.home.sdg.${SDG.INDUSTRY}`]:
    '복원력이 높은 사회기반시설 구축과 포용적이고 지속가능한 산업화 증진 및 혁신 장려.',
  [`pages.home.sdg.${SDG.INEQUALITIES}`]: '국가 내∙국가 간 불평등 해소.',
  [`pages.home.sdg.${SDG.COMMUNITIES}`]:
    '포용적이고 안전하며 회복력 있는 지속가능 도시 조성.',
  [`pages.home.sdg.${SDG.CONSUMPTION}`]: '지속가능한 소비와 생산.',
  [`pages.home.sdg.${SDG.CLIMATE}`]: '기후 변화 대응.',
  [`pages.home.sdg.${SDG.SEA_LIFE}`]:
    '대양, 바다, 해양자원의 보호와 지속가능한 이용.',
  [`pages.home.sdg.${SDG.LAND_LIFE}`]:
    '지속가능한 삼림 관리, 사막화와 토지 파괴 방지 및 복원, 생물다양성 감소 방지.',
  [`pages.home.sdg.${SDG.PEACE}`]: '정의롭고, 평화로우며 포용적인 사회 조성.',
  [`pages.home.sdg.${SDG.PARTNERSHIPS}`]:
    '지속가능발전을 위한 이행수단과 글로벌파트너십 강화.',
  'pages.home.project.title': '게시물',
  'pages.home.project.link.discover': '게시물 찾기',
  'pages.home.project.link.create': '게시물 생성',
  'pages.home.project.content':
    '투표뿐만 아니라 그 이상의 것을 경험할 수 있습니다. 청소년들은 프로젝트를 시작하고, 공개 게시물에 투표하고, 친구, 학교 친구, 단체를 초대할 수 있으며, 후원자들은 그들의 영향력과 목소리를 증가시킬 수 있습니다. 공감대와 다수결로 이루어진 게시물은 다음 세대의 현명한 목소리로 정부와 기업에 제시될 것입니다.',

  'pages.discover.title': '게시물',
  'pages.discover.loading.projects': '게시물을 불러오는 중 ...',
  'pages.discover.init.title': '당신의 게시물',
  'pages.discover.loading': '게시물을 불러오는 중입니다',

  'pages.search.text': '글 본문',
  'pages.search.text.error': '글 본문은 최소 2글자 이상이어야 합니다',
  'pages.search.country': '국가',
  'pages.search.country.error': '국가의 이름은 최소 2글자 이상이어야 합니다',
  'pages.search.sdg': '지속가능한 개발 목표',
  'pages.search.search': '검색',

  'pages.profile.button.editProfile': '프로필 수정',
  'pages.profile.button.changePhoto': '사진 바꾸기',
  'pages.profile.button.changePassword': '비밀번호 변경',
  'pages.profile.button.changeEmail': '이메일 변경',
  'pages.profile.button.logout': '로그아웃',
  'pages.profile.button.admin': '관리자',
  'pages.profile.update.profile': '프로필이 변경되었습니다.',

  'pages.profileEdit.title': '프로필 변경',
  'pages.profileEdit.button.save': '저장',
  'pages.profileEdit.button.changeProfilePhoto': '프로필 사진 변경',

  'pages.favorite.title': '좋아요 & 투표',
  'pages.favorite.favorite': '좋아요',
  'pages.favorite.added': '게시물이 좋아요 목록에 추가되었습니다.',
  'pages.favorite.removed': '게시물이 좋아요 목록에서 제외되었습니다.',

  'pages.forgotPassword.title': '비밀번호 찾기',
  'pages.forgotPassword.success': '당신의 이메일의 보안코드를 확인하세요.',
  'pages.forgotPassword.button.forgotPassword': '다음',

  'pages.resetPassword.title': '비밀번호 초기화',
  'pages.resetPassword.success': '당신의 비밀번호가 변경되었습니다.',
  'pages.resetPassword.button.resetPassword': '비밀번호 변경',

  'pages.changePassword.title': '비밀번호 변경',
  'pages.changePassword.button.changePassword': '비밀번호 변경',

  'pages.confirmEmail.title': '이메일 주소 확인',
  'pages.confirmEmail.header': '"{{email}}"으로 보안코드가 전송되었습니다.',
  'pages.confirmEmail.button.confirm': '확인',
  'pages.confirmEmail.button.resend': '재전송',
  'pages.confirmEmail.button.logout': '로그아웃',
  'pages.confirmEmail.confirmed': '당신의 이메일 주소가 확인되었습니다.',
  'pages.confirmEmail.resend':
    '새로운 보안코드가 당신의 이메일로 전송되었습니다.',

  'pages.updateEmail.title': '이메일 변경',
  'pages.updateEmail.success':
    '새로운 보안코드가 당신의 이메일로 전송되었습니다.',
  'pages.updateEmail.email': '새로운 이메일',
  'pages.updateEmail.button.updateEmail': '변경',

  'pages.project.header.new.title': '새 게시물 생성: ',
  'pages.project.header.edit.title': '새 게시물 수정: ',
  'pages.project.submit.edit': '게시물 수정',
  'pages.project.submit.new': '게시물 생성',
  'pages.project.title': '제목',
  'pages.project.subtitle': '부제목',
  'pages.project.images': '사진',
  'pages.project.description': '묘사',
  'pages.project.impactStatement': '영향 평가',
  'pages.project.abstract': '개요',
  'pages.project.sdg': '지속가능한 개발 목표',
  'pages.project.country': '국가',
  'pages.project.openDate': '시작 날짜',
  'pages.project.closeDate': '종료 날짜',
  'pages.project.isSponsored': '이 게시물은 후원됩니다',
  'pages.project.created': '당신의 게시물은 성공적으로 생성되었습니다',
  'pages.project.updated': '당신의 게시물은 성공적으로 수정되었습니다',
  'pages.project.deleted': '당신의 게시물은 삭제되었습니다',
  'pages.images.add': '새 사진 추가',
  'pages.images.uploaded': '사진이 추가되었습니다',
  'pages.images.removed': '사진이 삭제되었습니다',

  'pages.admin.header': '관리자: 제한된 접근',
  'pages.admin.titles.reports': '신고',
  'pages.admin.titles.users': '사용자',
  'pages.admin.titles.projects': '프로젝트',
  'pages.admin.empty.reports': '신고 취소',
  'pages.admin.status.ban': '금지',
  'pages.admin.status.unBan': '금지 취소',
  'pages.admin.status.submissionDate': '제출 날짜',
  'pages.admin.status.reporter': '신고자',
  'pages.admin.delete.report': '신고가 삭제되었습니다',

  'pages.projectDetail.abstract': '개요',
  'pages.projectDetail.impact': '영향 평가',
  'pages.projectDetail.aboutInitiative': '게시물에 대해',
  'pages.projectDetail.readMore': '글 본문 늘리기',
  'pages.projectDetail.readLess': '글 본문 줄이기',
  'pages.projectDetail.alreadyVoted': '이미 투표하였습니다',
  'pages.projectDetail.voted': '당신의 투표는 이미 제출되었습니다',
  'pages.projectDetail.sdg': '지속가능한 개발 목표',
  'pages.projectDetail.youth': '청소년',
  'pages.projectDetail.voices': '목소리',
  'pages.projectDetail.report': '신고',
  'pages.projectDetail.reported': '이 게시물은 신고되었습니다.',
  'pages.projectDetail.share': '주소 복사',
  'pages.projectDetail.share.copied':
    '이 게시물의 주소는 당신의 클립보드에 복사되었습니다.',
  'pages.projectDetail.cancel': '취소',
  'pages.projectDetail.ellipsis': '...',

  'pages.admin.user.update': '사용자 변경',
  'pages.admin.user.title': '관리자 변경',
  'pages.admin.user.banned': '사용자가 금지되었습니다.',
  'pages.admin.user.unbanned': '사용자의 금지가 취소되었습니다',
  'pages.admin.user.deleted': '사용자가 삭제되었습니다.',

  'reports.message.guidelines': '반대 커뮤니티 지침서',
  'pages.projectVote.vote': '투표',
  'pages.projectVote.closeDate': '종료 날짜:',
  'pages.projectVote.voteToChange': '변화를 위해 투표합시다',

  'errors.field.fixIt': '모든 오류를 해결한 뒤 다시 시도해 주세요.',
  'errors.field.requiredImage': '최소 한 개 이상의 사진이 필요합니다.',
  'errors.field.required': '필수 입력공간',
  'errors.field.limit': '입력공간은 {{min}} 에서 {{max}} 사이에 있어야 합니다',
  'errors.field.maxLimit': '입력공간은 {{max}} 보다 길 수 없습니다',
  'errors.field.minLimit': '입력공간은 {{min}} 보다 짧을 수 없습니다',
  'errors.field.invalid': '무효한 {{name}} 입니다.',
  'errors.field.invalid.email': '잘못된 이메일 형식',
  'errors.field.invalid.group': '잘못된 그룹 이름입니다',
  'errors.field.emailToken.onlyNumbersRequired': '숫자만 입력해 주세요',
  'errors.field.sdg.max': '3가지 이상의 목표를 선택할 수 없습니다.',
  'errors.field.password.notMatch': '비밀번호가 일치하지 않습니다',
  'errors.field.password.week': '암호가 너무 짧습니다.',
  'errors.field.password.should.length':
    '8글자 이상의 비밀번호를 입력해주세요.',
  'errors.field.password.should.upper':
    '대문자를 포함한 비밀번호를 입력해주세요.',
  'errors.field.password.should.lower':
    '소문자를 포함한 비밀번호를 입력해주세요.',
  'errors.field.password.should.number':
    '숫자를 포함한 비밀번호를 입력해주세요.',
  'errors.field.password.should.special':
    '특수문자를 포함한 비밀번호를 입력해주세요.',
  'errors.http.unknown': '알 수 없는 오류 :(',
  [`errors.http.${ERROR_CODES.UNEXPECTED_ERROR}`]: '알 수 없는 오류 :(',
  [`errors.http.${ERROR_CODES.BAD_REQUEST}`]: '잘못된 요청입니다!',
  [`errors.http.${ERROR_CODES.NOT_AUTHENTICATED}`]: '인증에 실패하였습니다!',
  [`errors.http.${ERROR_CODES.NOT_FOUND}`]: '요청하신 항목을 찾을 수 없습니다.',
  [`errors.http.${ERROR_CODES.NOT_AUTHORIZED}`]: '승인되지 않은 작업입니다!',
  [`errors.http.${ERROR_CODES.INVALID_CREDENTIALS}`]:
    '이메일 또는 비밀번호가 올바르지 않습니다!',
  [`errors.http.${ERROR_CODES.PROJECT_ALREADY_FAVORITED}`]:
    '프로젝트가 이미 당신의 좋아요 목록에 있습니다!',
  [`errors.http.${ERROR_CODES.ACCOUNT_ALREADY_EXISTS}`]:
    '입력된 이메일이 이미 다른 계정과 일치합니다!',
  [`errors.http.${ERROR_CODES.PROJECT_NOT_FOUND}`]:
    '게시물을 찾을 수 없습니다!',
  [`errors.http.${ERROR_CODES.IMAGE_REMOVE}`]: '사진을 제거할 수 없습니다!',
  [`errors.http.${ERROR_CODES.IMAGE_UPLOAD}`]: '사진을 불러올 수 없습니다!',
  [`errors.http.${ERROR_CODES.BANNED}`]:
    '당신의 계정은 관리자에 의해 제한되었습니다, 관리자에게 문의하십시오.',
  [`errors.http.${ERROR_CODES.PROJECT_ALREADY_VOTED}`]:
    '당신은 이미 이 게시물에 투표하였습니다',
  [`errors.http.${ERROR_CODES.INVALID_GROUP}`]:
    '입력된 그룹이 존재하지 않습니다',
};

export default localization;
