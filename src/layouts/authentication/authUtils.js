export const checkTokenExpiration = () => {
  const jwtExpirationTime = localStorage.getItem("jwtExpirationTime");

  if (!jwtExpirationTime) {
    console.log("No token found.");
    return false;
  }

  const expirationDate = new Date(parseInt(jwtExpirationTime)); // Chuyển đổi thời gian thành đối tượng Date
  const currentDate = new Date();

  if (currentDate >= expirationDate) {
    console.log("Token has expired.");
    return false; // Chỉ trả về false, không xóa token tại đây
  }

  console.log("Token is still valid.");
  return true;
};
