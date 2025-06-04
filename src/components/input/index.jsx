import { Button, Input, Space } from "antd";

export function InputAndButton({
  textButton,

  handleKeyDown,

  placeholderText,
  value,
  onChange,
  onPressEnter,
  onClick
}) {
  return (
    <Space.Compact style={{ width: "100%" }}>
      <Input
        onChange={onChange}
        value={value}
        onKeyDown={handleKeyDown}
        placeholder={placeholderText}
        onPressEnter={onPressEnter}
      />
      <Button type="primary" onClick={onClick}>
        {textButton}{" "}
      </Button>
    </Space.Compact>
  );
}
