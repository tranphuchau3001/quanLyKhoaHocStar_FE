import axios from "axios";

// Lấy thông tin khóa học
export const getCourseById = async (courseId) => {
  const response = await axios.get("http://localhost:3030/course-api/getCourseById", {
    params: { courseId },
  });
  return response.data.data;
};

// Lấy danh sách module
export const getModulesByCourseId = async (courseId) => {
  const response = await axios.get("http://localhost:3030/api/v1/module/getModulesByCourseId", {
    params: { courseId },
  });
  return response.data.data;
};

// Lấy bài học theo moduleId
export const getLessonsByModuleId = async (moduleId) => {
  const response = await axios.get("http://localhost:3030/api/v1/lesson/getLessonsByModuleId", {
    params: { moduleId },
  });
  return response.data.data;
};

// Lấy quiz theo moduleId
export const getQuizByModuleId = async (moduleId) => {
  const response = await axios.get("http://localhost:3030/api/v1/Quiz/getQuizByModuleId", {
    params: { moduleId },
  });
  return response.data.data;
};

// Lấy danh sách câu hỏi theo quizId
export const getQuestionsByQuizId = async (quizId) => {
  const response = await axios.get("http://localhost:3030/api/v1/question/getQuestionByQuizId", {
    params: { quizId },
  });
  return response.data.data;
};

// Lấy danh sách lựa chọn theo questionId
export const getChoicesByQuestionId = async (questionId) => {
  const response = await axios.get("http://localhost:3030/api/v1/choice/getChoiceByQuestionId", {
    params: { questionId },
  });
  return response.data.data;
};

// Lưu tiến độ hoàn thành bài học
export const addUserProgress = async ({ userId, courseId, lessonId, status }) => {
  try {
    const response = await axios.post(
      "http://localhost:3030/api/v1/user-progress/addUserProgress",
      {
        userId,
        courseId,
        lessonId,
        status,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding user progress:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy tiến độ của người dùng theo userId và courseId
export const getUserProgress = async (userId, courseId) => {
  try {
    const response = await axios.get(
      "http://localhost:3030/api/v1/user-progress/getUserProgressByUserIdAndCourseId",
      {
        params: { userId, courseId },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user progress:", error.response?.data || error.message);
    throw error;
  }
};

// Lưu lịch sử làm bài quiz
export const saveSubmissionHistory = async ({
  userId,
  courseId,
  moduleId,
  quizId,
  score,
  assignmentStatus,
}) => {
  try {
    const response = await axios.post(
      "http://localhost:3030/api/v1/history/saveSubmissionHistory",
      {
        userId,
        courseId,
        moduleId,
        quizId,
        score,
        assignmentStatus,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error saving submission history:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy lịch sử làm bài quiz theo userId và courseId
export const getSubmissionHistories = async (userId, courseId) => {
  try {
    const response = await axios.get(
      "http://localhost:3030/api/v1/history/getSubmissionHistoriesByUserIdAndCourseId",
      {
        params: { userId, courseId },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching submission histories:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách enrollments của người dùng
export const getEnrollmentsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      "http://localhost:3030/api/v1/enrollment/getEnrollmentByUserId",
      {
        params: { userId },
      }
    );
    return response.data.data; // Trả về mảng enrollments
  } catch (error) {
    console.error("Error fetching enrollments:", error.response?.data || error.message);
    throw error; // Ném lỗi nếu có
  }
};
