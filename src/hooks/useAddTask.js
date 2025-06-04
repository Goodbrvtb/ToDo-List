export const useAddTask = (taskApi) => {
  const addTask = async (task, setVisible) => {
    if (task.trim() === "") {
      setVisible(true);
      return;
    }
    const todo = { title: task };
    await taskApi.createTask(todo);
  };
  return addTask;
};
