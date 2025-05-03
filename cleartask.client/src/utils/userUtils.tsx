import { getUserDetails } from '../services/userService';

export const getUserName = async (userId: string): Promise<string> => {
  const user = await getUserDetails(userId);
  return user.userdto.userName;
};


export default getUserName;
