package comm;

/**
 *
 * @author Administrator
 */
public class comm_userData {
    private String userID; //사용자계정
    private String userPw; //암호
    private String userSaupj; //사업장  
    private String userCvcod; //거래처코드
    private String userCvnas; //거래처명
    private String userAuth; //권한
    private String userGubun;
    private int userResult; //로그인 성공여부
   
    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getUserPw() {
        return userPw;
    }

    public void setUserPw(String userPw) {
        this.userPw = userPw;
    }
    
    public String getUserSaupj() {
        return userSaupj;
    }

    public void setUserSaupj(String userSaupj) {
        this.userSaupj = userSaupj;
    }
    
    public String getUserAuth() {
        return userAuth;
    }

    public void setUserAuth(String userAuth) {
        this.userAuth = userAuth;
    }   
    
    public String getUserCvcod() {
        return userCvcod;
    }

    public void setUserCvcod(String userCvcod) {
        this.userCvcod = userCvcod;
    }    
  
    public String getUserCvnas() {
        return userCvnas;
    }
    
    public void setUserCvnas(String userCvnas) {
        this.userCvnas = userCvnas;
    }
    
    public String getUserGubun() {
        return userGubun;
    }
    
    public void setUserGubun(String userGubun) {
        this.userGubun = userGubun;
    }
    
    public int getUserResult() {
        return userResult;
    }

    public void setUserResult(int userResult) {
        this.userResult = userResult;        
    }      
    
}
