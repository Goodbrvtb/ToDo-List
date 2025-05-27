import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./style.css";
export function TaskPage() {
  const [task, setTask] = useState("");
  const [storedTasks, setStoredTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [visible, setVisible] = useState(false);
  const myToken = localStorage.getItem("myToken");
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  useEffect(() => {
    const myDataTask = async () => {
      if (myToken) {
        const tasks = await getTasks(myToken);
        setStoredTasks(tasks);
        console.log(tasks);
      } else {
        console.log("Token is missing");
      }
    };
    myDataTask();
  }, [myToken]);

  const handleChange = (event) => {
    setTask(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (task.trim() === "") {
        showModal();

        return;
      }
      console.log(task);
      const todo = { title: task };
      const createdTask = await createTask(todo, myToken);
      setStoredTasks((prev) => [...prev, createdTask]);
      setTask("");
    }
  };
  useState("");
  const addTask = async () => {
    if (task.trim() === "") {
      showModal();

      return;
    }
    console.log(task);
    const todo = { title: task };
    const createdTask = await createTask(todo, myToken);
    setStoredTasks((prev) => [...prev, createdTask]);
    setTask("");
  };

  const toggleTaskCompletion = async (item) => {
    const updatedTasks = storedTasks.map((task) =>
      task.id === item.id
        ? { ...task, isCompleted: !task.isCompleted }
        : { ...task, isCompleted: task.isCompleted }
    );
    setStoredTasks(updatedTasks);
    try {
      await patchTaskApi(item.id, myToken);
      console.log(item);
    } catch (error) {
      console.log("Error updating task completion: ", error);
      setStoredTasks(updatedTasks);
    }
  };
  const deleteTask = async (item) => {
    console.log(item, "delete");
    try {
      await deleteTaskApi(item.id, myToken);
      const updatedTasks = storedTasks.filter((task) => task.id !== item.id);
      setStoredTasks(updatedTasks);
    } catch (error) {
      console.log("Error deleting task: ", error);
    }
  };

  const editTask = (item) => {
    setEditingIndex(item.id);
    setEditingText(item.title);
  };

  const saveEdit = async (item) => {
    const updatedTasks = storedTasks.map((task) =>
      task.id === item.id ? { ...task, title: editingText } : task
    );
    await editTaskApi({ title: editingText }, item.id, myToken);
    console.log({ title: editingText });
    setStoredTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  async function getTasks(token) {
    try {
      const response = await fetch(
        `https://todo-redev.herokuapp.com/api/todos`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function createTask(todo, token) {
    try {
      const response = await fetch(
        "https://todo-redev.herokuapp.com/api/todos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(todo)
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  }
  async function deleteTaskApi(id, token) {
    try {
      const response = await fetch(
        `https://todo-redev.herokuapp.com/api/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  }
  async function patchTaskApi(id, token) {
    try {
      const response = await fetch(
        `https://todo-redev.herokuapp.com/api/todos/${id}/isCompleted`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function editTaskApi(todo, id, token) {
    try {
      const response = await fetch(
        `https://todo-redev.herokuapp.com/api/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(todo)
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  }
  const logout = () => {
    localStorage.removeItem("myToken");
    handleNavigation("/login");
  };

  return (
    <>
      <section className="container">
        <h1>Get things done!</h1>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={task}
            placeholder="What is the task today?"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button type="primary" onClick={addTask}>
            Add task
          </Button>
        </Space.Compact>
        {storedTasks.length > 0 && (
          <ul>
            {storedTasks.map((item) => (
              <li
                key={item.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                {editingIndex === item.id ? (
                  <>
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onPressEnter={() => saveEdit(item)}
                      style={{ flex: 1 }}
                    />
                    <Button type="primary" onClick={() => saveEdit(item)}>
                      Update
                    </Button>
                  </>
                ) : (
                  <>
                    <span
                      className="task-text"
                      onClick={() => toggleTaskCompletion(item)}
                      style={{
                        textDecoration: item.isCompleted
                          ? "line-through"
                          : "none",
                        cursor: "pointer",
                        flex: 1
                      }}
                    >
                      {item.title}
                    </span>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        editTask(item);
                      }}
                    >
                      <EditFilled />
                    </Button>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(item);
                      }}
                    >
                      <DeleteFilled />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <Button type="primary" onClick={logout}>
          Log out
        </Button>
      </section>
      <Modal
        title="Please inter task"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
}
