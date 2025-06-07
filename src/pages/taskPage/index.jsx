import { Button, message, Modal } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { InputAndButton } from "../../components/input";
import { Task } from "../../components/task";
import { useAddTask } from "../../hooks/useAddTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import { useFetchTasks } from "../../hooks/useFetchTasks";
import { useEditTask } from "../../hooks/useEditTask";
import { useToggleTaskCompletion } from "../../hooks/useToggleTaskCompletion";
import { TaskApi } from "../../shared/api/apiInstance";
import "./style.css";

export function TaskPage() {
  const [task, setTask] = useState("");
  const [storedTasks, setStoredTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  const myToken = useMemo(() => localStorage.getItem("myToken"), []);
  const taskApi = useMemo(() => {
    return new TaskApi("https://todo-redev.herokuapp.com", myToken);
  }, [myToken]);

  const toggleTaskCompletion = useToggleTaskCompletion(taskApi);
  const addTask = useAddTask(taskApi);
  const myDataTask = useFetchTasks(taskApi);
  const deleteTaskId = useDeleteTask(taskApi);
  const saveEdit = useEditTask(
    taskApi,
    storedTasks,
    editingText,
    setStoredTasks,
    setEditingIndex,
    setEditingText,
    myToken
  );

  const handleError = useCallback((error) => {
    message.error(error.message);
    console.error(error);
  }, []);

  const fetchData = useCallback(async () => {
    if (myToken) {
      await myDataTask(myToken, setStoredTasks);
    }
  }, [myToken, myDataTask]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleChange = (event) => {
    setTask(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await addTask(task, setVisible);
      setTask("");
      taskApi.getTasks();
      fetchData();
    }
  };

  const handleClick = async () => {
    await addTask(task, setVisible);
    setTask("");
    fetchData();
  };
  const handleDelete = async (item) => {
    await deleteTaskId(item, myDataTask);
    fetchData();
  };

  const editTask = (item) => {
    setEditingIndex(item.id);
    setEditingText(item.title);
  };
  const handleChangeComplete = async (item) => {
    await toggleTaskCompletion(
      item,
      myToken,
      handleError,
      setStoredTasks,
      storedTasks
    );
    fetchData();
  };

  const logout = () => {
    localStorage.removeItem("myToken");
    handleNavigation("/login");
  };

  return (
    <>
      <section className="container">
        <h1>Get things done!</h1>
        <InputAndButton
          value={task}
          setVisible={setVisible}
          fetchData={myDataTask}
          addTask={addTask}
          handleKeyDown={handleKeyDown}
          task={task}
          placeholderText={"What is the task today?"}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          textButton={"Add task"}
          onClick={handleClick}
        />
        {storedTasks.length > 0 && (
          <Task
            storedTasks={storedTasks}
            editingIndex={editingIndex}
            editingText={editingText}
            setEditingText={setEditingText}
            saveEdit={saveEdit}
            handleChangeComplete={handleChangeComplete}
            editTask={editTask}
            handleDelete={handleDelete}
          />
        )}
        <Button type="primary" onClick={logout}>
          Log out
        </Button>
      </section>
      <Modal
        title="Please inter task"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      ></Modal>
    </>
  );
}
