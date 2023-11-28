# 프로젝트 소개

뮤지션을 위한 음원 거래, 커뮤니티 웹사이트


# 개발 환경

개발 언어:

  - 프론트엔드: Next.js, React, JavaScript, TypeScript
  - 백엔드: Express, TypeORM, Node.js, AWS
  - DB: PostgreSQL
  - 형상관리 툴: Docker, GitHub


# ERD 구성

![ERD](https://github.com/kofhoom/everyspace/assets/64389254/75afa782-4017-4d2e-a9d5-4cf47fdd5ba5)


# 페이지 구성

메인, 회원가입, 로그인, 아이디 찾기, 비밀번호 찾기, 마이페이지, 음원 등록, 음원 상세, 아지트 생성, 나의 상점, 검색결과, 어드민민


# 주요 기능

메인 : 
  - useSWR을 통하여 각 섹션에 해당하는 item을 get 방식으로 가져오도록 설계
  - 전체보기를 누를 경 get방식으로 파라미터를 전달하여 DB에 해당 전체 정보들 가져올 수 있도록 api를 구현
  - 검색 아이콘을 누를 경우 아티스트, 트랙명, 장르명을 파라미터로 받아 검색할 수 있도록 TypeORM의 Like문을 사용하여 검색 기능을 구현

회원가입:
  - 회원가입 시 post로 전달된 파라미터 값을 통해 유효성을 체크할 수 있도록 함. 에러가 발생하면 해당 에러를 반환
  - 프로필 이미지 등록 시 "multipart/form-data"로 전달된 이미지 파일을 multer 라이브러리를 사용하여 DB에 저장할 수 있도록 구현함. 이미지가 중복될 경우 이전 이미지를 삭제처리 함
  - bcrypt 라이브러리를 사용하여 사용자 비밀번호를 암호화하여 저장
    
로그인:
  - 로그인 시 post로 전달된 바디 값으로 DB에서 조회를 수행. 조회 결과가 없을 경우 에러를 반환
  - 조회 된 사용자가 존재하는 경우 bcrypt 라이브러리를 사용하여 비밀번호를 비교
  - 로그인 검 통과 시 jwt 토큰을 생성하고 쿠키에 토큰을 저장하여 보안 정보를 설정한 후, 유저 정보와 토큰을 반환하여 로그인 처리를 구현

아이디찾기:
  - 아이디 찾기 버튼을 클릭하면 전달된 파라미터로 등록된 회원 아이디를 검색하여 값을 반환. 실패할 경우 에러 문구를 반환

비밀번호 찾기:
  - 입력된 사용자 정보를 통해 전달받은 파라미터 값으로 Express에서 일치 여부를 검증
  - 검증 후 임시 비밀번호 생성 함수를 사용하여 임시 비밀번호를 생성하고, 새로운 비밀번호를 bcrypt로 해싱하여 사용자 비밀번호를 업데이트함
    
마이페이지:
  - 내가 쓴 글, 내가 쓴 댓글, 아지트 가입 신청 리스트, 구매 곡 목록, 나의 곡 판매 현황 등 해당 정보를 확인할 수 있는 페이지를 구현

음원:
  - 오디오 컨트롤 기능은 외부 라이브러리 없이 useRef를 사용하여 직접 구현
  - 공통 컴포넌트를 사용하여 사용성을 개선
  - 음원 업로드 페이지를 통해 사용자가 직접 음원을 업로드할 수 있도록 개발

음원상세 페이지:
  - 기본적인 CRUD 기능을 구현
  - 댓글 기능을 구현
  - 링크 공유 기능을 구현

아지트:
  - 해당 유저는 한 개의 아지트 커뮤니티 그룹을 생성할 수 있도록 설계
  - 생성된 아지트에 대한 편집 기능 개발
  - 생성된 아지트에 다른 유져가 가입 신청을 할 수 있는 가입신청 기능 구현
  - 마이페이지에서 해당 유져가 만든 아지트에 가입을 신청한 유저를 승인 or 거절할 수 있는 승인 시스템을 구현함
    
나의상점:
  - 유져가 생성되면 해당 유져 전용 상점이 생성
  - 해당 유져가 등록한 모든 글을 볼 수 있음
  - 베너 디자인 프로필 디자인 변경 가능

검색, 정렬, 좋아요:
  - post로 전달된 검색 파라미터 값을 통해 Join한 엔티티의 결과값을 정렬하여 반환
  - 유저가 올린 게시물에 대한 선호도를 표현할 수 있는 좋아요 기능을 구현

결제:
  - 이니시스(포트원)에서 제공하는 API를 통해 결제 로직을 구현
  - 음원 결제시 카카오창 결제창이 생성되며 모든 결제 수단으로 결제할 수 있게 테스트 모듈을 적용함
  - 음원 결제시 판매 내역을 저장하고, 마이페이지에서 구매한 내역을 확인할 수 있도록 개발함함

어드민:
  - 


# 프로젝트를 통해 경험한 것

- 웹 프로그래밍 프로세스 이해도 향상
    - useSwR를 통한 프론트엔드와 백엔드의 통신 상호작용에 대한 이해
    - PostgreSQL을 이용하며 TypeORM을 이용해서 데이터베이스를 관리
    - AWS, ec2를 활용, SSR 배포를 통해서 접근이 가능하도록 코드를 구현, RBS 및 네트워크 보안에 중요성을 깨달음
    
- DB 모델링 설계 및 정규화 작업
    - 회원, 상품, 좋아요 등 주요 Entity 중심의 DB 모델링 설계
    - 반복적인 데이터와 테이블 내의 데이터 배치 등을 고려해 정규화 진행
    - 초기 데이터 모델링의 미흡으로 오류를 겪으며, 좋은 데이터 모델링의 중요성을 깨달음
    
- 기본적인 CRUD API 구현과 외부 API의 도입 경험
    - 상품 게시판을 통한 기본적인 CRUD API 구현
    - 결제 API도입을 통한 비즈니스 로직 구현 및 응용

- UI/UX 라이브러리를 통한 화면 구현**
    - Ant Design, React-icons, Tailwind, UI/UX 라이브러리를 통한 화면 디자인 개발 등 다양한 측면을 직접 경험