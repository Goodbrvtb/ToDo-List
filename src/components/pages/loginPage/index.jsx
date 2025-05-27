import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, message } from "antd";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import * as z from "zod";
const schema = z.object({
  email: z
    .string()
    .min(1, "email required")
    .email("Please enter correct email"),
  password: z.string().min(1, "Password required")
});

export function LoginPage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function login(regUser) {
    try {
      const response = await fetch(
        "https://todo-redev.herokuapp.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(regUser)
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      message.success("Login successful!");
      localStorage.setItem("myToken", data.token);
      handleNavigation("/task");
      return data;
    } catch (error) {
      message.error(error.message);
      console.log("error: ", error);
    }
  }
  const onSubmit = async (data) => {
    await login(data);
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
    </>
  );
}
