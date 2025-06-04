export const useDeleteTask = (taskApi) => {
  const deleteTaskId = async (item, handleError) => {
    try {
      await taskApi.deleteTask(item.id);
    } catch (error) {
      handleError(error);
    }
  };

  return deleteTaskId;
};
