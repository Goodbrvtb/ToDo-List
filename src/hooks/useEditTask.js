export const useEditTask = (
  taskApi,
  storedTasks,
  editingText,
  setStoredTasks,
  setEditingIndex,
  setEditingText,
  myToken
) => {
  const saveEdit = async (item) => {
    const updatedTasks = storedTasks.map((task) =>
      task.id === item.id ? { ...task, title: editingText } : task
    );
    await taskApi.editTaskApi({ title: editingText }, item.id, myToken);
    setStoredTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
  };
  return saveEdit;
};
