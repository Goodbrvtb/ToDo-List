import { useCallback } from "react";

export const useFetchTasks = (taskApi) => {
  return useCallback(
    async (myToken, setStoredTasks, handleError) => {
      if (myToken) {
        try {
          const tasks = await taskApi.getTasks();
          setStoredTasks(tasks);
        } catch (error) {
          handleError(error);
        }
      } else {
        console.log("Token is missing");
      }
    },
    [taskApi]
  );
};
