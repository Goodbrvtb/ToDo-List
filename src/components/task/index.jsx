import { Button, Input, Space } from "antd";
import { InputAndButton } from "../input";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
export function Task({
  setEditingText,
  editingText,
  storedTasks,
  editingIndex,
  saveEdit,
  handleChangeComplete,
  editTask,
  handleDelete
}) {
  return (
    <ul>
      {storedTasks.map((item) => (
        <li key={item.id} style={{ display: "flex", alignItems: "center" }}>
          {editingIndex === item.id ? (
            <>
              <InputAndButton
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onPressEnter={() => saveEdit(item)}
                style={{ flex: 1 }}
                textButton={"Update"}
                onClick={() => saveEdit(item)}
              />
            </>
          ) : (
            <>
              <span
                className="task-text"
                onClick={() => handleChangeComplete(item)}
                style={{
                  textDecoration: item.isCompleted ? "line-through" : "none",
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
                  e.stopPropagation(), handleDelete(item);
                }}
              >
                <DeleteFilled />
              </Button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
