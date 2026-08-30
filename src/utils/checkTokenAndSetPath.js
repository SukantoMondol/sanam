import { getCookie, setCookie } from "cookies-next";

export const checkTokenAndSetPath = (pathname) => {
  const token = getCookie("token");
  if (token) {
    return true;
  } else {
    setCookie("lastVisitedPath", pathname);
    return false;
  }
};
