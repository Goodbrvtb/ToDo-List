import { createBrowserRouter } from "react-router";
import { App } from "./App";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/registration",
        lazy: {
          Component: async () =>
            (await import("./pages/registrationPage")).RegistrationPage
        }
      },
      {
        path: "/login",
        lazy: {
          Component: async () => (await import("./pages/loginPage")).LoginPage
        }
      },
      {
        path: "/task",
        lazy: {
          Component: async () => (await import("./pages/taskPage")).TaskPage
        }
      },
      {
        path: "*",
        lazy: {
          Component: async () => (await import("./pages/notFound")).NotFound
        }
      }
    ]
  }
]);
