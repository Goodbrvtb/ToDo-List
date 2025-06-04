export const useToggleTaskCompletion = (taskApi) => {
  const toggleTaskCompletion = async (
    item,
    myToken,
    handleError,
    setStoredTasks,
    storedTasks
  ) => {
    const updatedTasks = storedTasks.map((task) =>
      task.id === item.id
        ? { ...task, isCompleted: !task.isCompleted }
        : { ...task, isCompleted: task.isCompleted }
    );
    try {
      await taskApi.patchTaskApi(item.id, myToken);
    } catch (error) {
      handleError(error);
      setStoredTasks(updatedTasks);
    }
  };
  return toggleTaskCompletion;
};
