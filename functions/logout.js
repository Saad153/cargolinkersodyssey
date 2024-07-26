import Router from "next/router";
import Cookies from "js-cookie";
import { setTempToken } from './setAccesLevels'; 

function logout(){
    setTempToken(null, true);
    Cookies.remove("username");
    Cookies.remove("companyId");
    Cookies.remove("designation");
    Cookies.remove("token");
    Cookies.remove("loginId");
    // Router.push('/login')
    if (typeof window !== 'undefined') {
        // Only run Router.push in the browser
        Router.push('/login');
    }
}

export default logout