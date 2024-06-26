import { getToken } from "./jwt.js";
export const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const formatDataToSend = (user) => {
  const token = getToken({ id: user._id, isAdmin: user.isAdmin });

  return {
    token,
  };
};
