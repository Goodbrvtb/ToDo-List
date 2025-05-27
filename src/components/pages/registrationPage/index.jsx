import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Modal, Radio, message } from "antd";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { NavLink, useNavigate } from "react-router";
const schema = z.object({
  username: z.string().min(1, "Name required"),
  email: z.string().min(1, "email required").email("Enter a correct email"),
  password: z
    .string()
    .min(6, "Password is required minimum 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "The password must be at least 8 characters long, including at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol"
    ),

  gender: z.string().min(1, "Please indicate your gender"),
  age: z.string().min(1, "age required").regex(/^\d+$/, "only number")
});

export function RegistrationPage() {
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const navigate = useNavigate();
  const handleOk = () => {
    setVisible(false);
    navigate("/login");
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
      username: "",
      email: "",
      password: "",
      gender: "",
      age: ""
    }
  });

  async function registration(regUser) {
    try {
      const response = await fetch(
        "https://todo-redev.herokuapp.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(regUser)
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      message.success("Registration successful!");
      navigate("/login");
      showModal();
      return data;
    } catch (error) {
      message.error("Registration failed");
      console.log("error: ", error);
    }
  }
  const onSubmit = async (data) => {
    await registration(data);
  };

  return (
    <>
      <Form ref={formRef} onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Form.Item
          label="Name"
          validateStatus={errors.username ? "error" : ""}
          help={errors.username?.message}
        >
          <Controller
            name="username"
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
                placeholder="12345678A!"
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

        <Form.Item
          label="Age"
          validateStatus={errors.age ? "error" : ""}
          help={errors.age?.message}
        >
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="25" autoComplete="age" />
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
      <Modal title="Successfully registered" open={visible} onOk={handleOk}>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </Modal>
    </>
  );
}
