import { Button, Input, Space, Modal } from "antd";
import { useEffect, useState } from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import "./style.css";
function TaskPage() {
  const [task, setTask] = useState("");
  const [storedTasks, setStoredTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [visible, setVisible] = useState(false);
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
    const myData = localStorage.getItem("myData");
    if (myData) {
      setStoredTasks(JSON.parse(myData));
    }
  }, []);

  const handleChange = (event) => {
    setTask(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  const addTask = () => {
    if (task.trim() === "") {
      showModal();

      return;
    }
    const updatedTasks = [...storedTasks, { text: task, completed: false }];
    localStorage.setItem("myData", JSON.stringify(updatedTasks));
    setStoredTasks(updatedTasks);
    setTask("");
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = storedTasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem("myData", JSON.stringify(updatedTasks));
    setStoredTasks(updatedTasks);
  };
  const deleteTask = (index) => {
    const updatedTasks = storedTasks.filter((_, i) => i !== index);
    localStorage.setItem("myData", JSON.stringify(updatedTasks));
    setStoredTasks(updatedTasks);
  };

  const editTask = (index) => {
    setEditingIndex(index);
    setEditingText(storedTasks[index].text);
  };

  const saveEdit = (index) => {
    const updatedTasks = storedTasks.map((task, i) =>
      i === index ? { ...task, text: editingText } : task
    );
    localStorage.setItem("myData", JSON.stringify(updatedTasks));
    setStoredTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  return (
    <>
      <section className="container">
        <h1>Get things done!</h1>
        <Space.Compact style={{ width: "100%" }}>
          <Input
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
            {storedTasks.map((item, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center" }}>
                {editingIndex === index ? (
                  <>
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onPressEnter={() => saveEdit(index)}
                      style={{ flex: 1 }}
                    />
                    <Button type="primary" onClick={() => saveEdit(index)}>
                      Update
                    </Button>
                  </>
                ) : (
                  <>
                    <span
                      className="task-text"
                      onClick={() => toggleTaskCompletion(index)}
                      style={{
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                        cursor: "pointer",
                        flex: 1
                      }}
                    >
                      {item.text}
                    </span>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        editTask(index);
                      }}
                    >
                      <EditFilled />
                    </Button>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(index);
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

export default TaskPage;
