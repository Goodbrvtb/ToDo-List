import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Modal, Radio } from "antd";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { NavLink } from "react-router";
const schema = z.object({
  email: z
    .string()
    .min(1, "email required")
    .email("Please enter correct email"),
  password: z.string().min(1, "Password required")
});

export function LoginPage() {
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
  const formRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (data) => {
    console.log("Форма отправлена:", data);
    showModal();
  };

  return (
    <>
      <Form ref={formRef} onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email ? errors.email.message : null}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="example@mail.com"
                autoComplete="email"
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password ? errors.password.message : null}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Please enter password"
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
      <p>
        Don't have an account? <NavLink to="/registration">Sign Up!</NavLink>
      </p>
      <Modal
        title="Успешно зарегистрированы"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </Modal>
    </>
  );
}
