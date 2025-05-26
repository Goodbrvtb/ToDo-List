import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Modal, Radio } from "antd";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { NavLink } from "react-router";

const schema = z
  .object({
    name: z.string().min(1, "Name required"),
    email: z.string().min(1, "email required").email("Enter a correct email"),
    password: z
      .string()
      .min(6, "Password is required minimum 6 characters")
      .regex(
        /^(?=.*[A-Z]).*$/,
        "The password must contain at least one capital letter of the Latin alphabet"
      ),
    confirmPassword: z.string().min(6, "Password confirmation is required"),

    gender: z.string().min(1, "Please indicate your gender")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"]
  });

export function RegistrationPage() {
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: ""
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
          label="Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your name"
                autoComplete="name"
              />
            )}
          />
        </Form.Item>
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Password confirmation"
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword ? errors.confirmPassword.message : null}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          validateStatus={errors.gender ? "error" : ""}
          help={errors.gender?.message}
        >
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value="male"> Male </Radio>
                <Radio value="female"> Female </Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <p>
        Already have an account? <NavLink to="/login">Log In!</NavLink>
      </p>
      <Modal
        title="Успешно зарегистрировано"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </Modal>
    </>
  );
}
