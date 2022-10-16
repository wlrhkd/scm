//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 로그인 사용자 아이디 설정
// 인자 : userId --> 설정할 userId                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetLoginId("test");
//------------------------------------------------------------------------------
function cfSetLoginId(userId) {
    sessionStorage.setItem("userId", userId);    
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 설정한 로그인 사용자 아이디 조회
// 인자 : 없음                 
// 반환 : 세션 스토리지에 설정된 로그인 사용자 아이디 
// 작성 : 2021.05.14 by dykim
// 예시 : const sId = cfGetLoginId();
//------------------------------------------------------------------------------
function cfGetLoginId() {
    return sessionStorage.getItem("userId");
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 로그인 사용자 거래처코드 설정
// 인자 : userCvcod --> 설정할 userCvcod                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetLoginCvcod("300001");
//------------------------------------------------------------------------------
function cfSetLoginCvcod(userCvcod) {
    sessionStorage.setItem("userCvcod", userCvcod);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 설정한 로그인 사용자 거래처코드 조회
// 인자 : 없음                 
// 반환 : 세션 스토리지에 설정된 로그인 사용자 거래처코드 
// 작성 : 2021.05.14 by dykim
// 예시 : const sCvcod = cfGetLoginCvcod();
//------------------------------------------------------------------------------
function cfGetLoginCvcod() {
    return sessionStorage.getItem("userCvcod");
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 로그인 사용자 거래처명 설정
// 인자 : userCvcod --> 설정할 userCvnas                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetLoginCvnas("(주)에이치제이메탈");
//------------------------------------------------------------------------------
function cfSetLoginCvnas(userCvnas) {
    sessionStorage.setItem("userCvnas", userCvnas);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 설정한 로그인 사용자 거래처명 조회
// 인자 : 없음                 
// 반환 : 세션 스토리지에 설정된 로그인 사용자 거래처명 
// 작성 : 2021.05.14 by dykim
// 예시 : const sCvnas = cfGetLoginCvnas();
//------------------------------------------------------------------------------
function cfGetLoginCvnas() {
    return sessionStorage.getItem("userCvnas");
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 로그인 사용자 권한 설정
// 인자 : userAuth --> 설정할 userAuth                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetLoginAuth("1");
//------------------------------------------------------------------------------
function cfSetLoginAuth(userAuth) {
    sessionStorage.setItem("userAuth", userAuth);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 설정한 로그인 사용자 권한 조회
// 인자 : 없음                 
// 반환 : 세션 스토리지에 설정된 로그인 사용자 권한 
// 작성 : 2021.05.14 by dykim
// 예시 : const sAuth = cfGetLoginAuth();
//------------------------------------------------------------------------------
function cfGetLoginAuth() {
    return sessionStorage.getItem("userAuth");
} 
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 로그인 사용자 구분 설정
// 인자 : userGubun --> 설정할 userGubun                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetLoginGubun("1");
//------------------------------------------------------------------------------
function cfSetLoginGubun(userGubun) {
    sessionStorage.setItem("userGubun", userGubun);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 설정한 로그인 사용자 구분 조회
// 인자 : 없음                 
// 반환 : 세션 스토리지에 설정된 로그인 사용자 구분 
// 작성 : 2021.05.14 by dykim
// 예시 : const sGubun = cfGetLoginGubun();
//------------------------------------------------------------------------------
function cfGetLoginGubun() {
    return sessionStorage.getItem("userGubun");
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 로그인 사용자 사업장 설정
// 인자 : userSaupj --> 설정할 userSaupj                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetLoginSaupj("10");
//------------------------------------------------------------------------------
function cfSetLoginSaupj(userSaupj) {
    sessionStorage.setItem("userSaupj", userSaupj);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지에 설정한 로그인 사용자 사업장 조회
// 인자 : 없음                 
// 반환 : 세션 스토리지에 설정된 로그인 사용자 사업장 
// 작성 : 2021.05.14 by dykim
// 예시 : const sSaupj = cfGetLoginSaupj();
//------------------------------------------------------------------------------
function cfGetLoginSaupj() {
    return sessionStorage.getItem("userSaupj");
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지 데이터 생성
// 인자 : key --> 설정할 key값
//     value --> 설정할 value값                 
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfSetSessionData("userName", "김철수");
//------------------------------------------------------------------------------
function cfSetSessionData(key, value) {
    sessionStorage.setItem(key, value);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지 데이터 조회
// 인자 : key --> 세션 스토리지에 설정된 key값                 
// 반환 : 세션 스토리지에 설정된 value값 
// 작성 : 2021.05.14 by dykim
// 예시 : const sSaupj = cfGetSessionData("userSaupj");
//------------------------------------------------------------------------------
function cfGetSessionData(key) {
    return sessionStorage.getItem(key);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지의 특정 데이터 삭제
// 인자 : key --> 설정된 key값
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfClearStorage(userId);
//------------------------------------------------------------------------------
function cfClearStorage(key) {
    sessionStorage.removeItem(key);
}
//------------------------------------------------------------------------------
// 기능 : 세션 스토리지 데이터 모두 삭제
// 인자 : 없음
// 반환 : 없음 
// 작성 : 2021.05.14 by dykim
// 예시 : cfClearAllStorage();
//------------------------------------------------------------------------------
function cfClearAllStorage() {
    sessionStorage.clear();
}