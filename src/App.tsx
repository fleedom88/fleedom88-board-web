import Footer from 'layouts/Footer';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import UserP from 'views/User';
import BoardDeatil from 'views/Board/Detail';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/Container';
import { MAIN_PATH } from 'constant';
import { AUTH_PATH } from 'constant';
import { SEARCH_PATH } from 'constant';
import { USER_PATH } from 'constant';
import { BOARD_PATH } from 'constant';
import { BOARD_WRITE_PATH } from 'constant';
import { BOARD_DETAIL_PATH } from 'constant';
import { BOARD_UPDATE_PATH } from 'constant';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';


//        component: Application 컴포넌트             //
function App() {



//        state: 로그인 유저 전역 상태              //
const  {setLoginUser, resetLoginUser} = useLoginUserStore();

//        state: cookie 상태                //
const  [cookies, setCookie] = useCookies();

//        function: get sign in user response 처리 함수         //
const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if (code === 'NU' || code === 'DBE' || code === 'AF') {
    resetLoginUser();
    return;
  }
  const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
  setLoginUser(loginUser);
}

//        effect: accessToken cookie 값이 변결될 때 마다 실행할 함수            //
useEffect( () => {
  if(!cookies.accessToken) {
    resetLoginUser();
    return;
  }
  getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
}, [cookies.accessToken]);


//         render: Application 컴포넌트 렌더링            //
//  description: 메인 화면        : '/' - Main//
//  description:로그인+회원가입    : '/auth/ - Authentication  //
//  description: 검색 화면        : '/search/:searchWord'  - Search  //
//  description: 유저 페이지       : '/user/:emailEmail'  - User  //
//  description: 게시물 상세보기   : '/board/detail/:boardNumber'  - BoardDetail //
//  description: 게시물 작성하기   : '/board/write' - BoardWrite//
//  description: 게시물 수정하기   : '/board/update/:boardNumber' - BoardUpdate //
  return (
    <Routes>
        <Route element={<Container/>}>
              <Route path={MAIN_PATH()} element={<Main/>} />
              <Route path={AUTH_PATH()} element={<Authentication/>} />
              <Route path={SEARCH_PATH(':searchWord')} element={<Search/>} />
              <Route path={USER_PATH(':userEmail')} element={<UserP/>} />
              <Route path={BOARD_PATH()}>
                <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDeatil/>} />
                <Route path={BOARD_WRITE_PATH()} element={<BoardWrite/>} />
                <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate/>} />
              </Route>
              <Route path='*' element={<h1>404 Not Found</h1>}/>
        </Route>
    </Routes>
  );
}

export default App;
