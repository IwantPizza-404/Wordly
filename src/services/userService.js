import api from "@/api/axios";


export const fetchUser = async (user_id) => {
    try {
      const response = await api.get(`/auth/${user_id}`);
      console.log(response.data)
      return response.data.data;
    } catch (error) {
      handleError(error, 'Failed to fetch user data');
      return null;
    }
};