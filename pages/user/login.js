import useFetch from "@/hooks/useFetch";
import Head from "next/head";
import { Button, Form, FormField, Input } from "semantic-ui-react";
import { APP_NAME } from "../_app";
import { useApp } from "@/hooks/useApp";

const Login = () => {

  const { isLoading, errors, isError, error, postJson } = useFetch();
  const app = useApp();

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    await postJson('auth/login', formData, (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      app.login(data);
    });
  }

  return <>

    <Head>
      <title>Авторизация | {APP_NAME}</title>
    </Head>

    <div className={`flex min-h-screen flex-col items-center justify-between py-24 px-5`}>

      <div className="min-w-[400px] border-[1px] border-gray-200 rounded-xl p-5 cursor-default">

        <div className="flex flex-col items-center mb-4 px-3">
          <div>
            <img src="/favicon.svg" width="60" height="60" alt="Диск" className="rounded" />
          </div>
          <h1 className="my-0">Файлообменник</h1>
        </div>

        <h3 className="mb-5 text-center">Авторизация</h3>

        <Form onSubmit={onSubmit} loading={isLoading} error={isError}>

          <FormField error={Boolean(errors.login)}>
            <label>Логин</label>
            <Input
              fluid
              placeholder="Email, логин или телефон..."
              name="login"
              error={Boolean(errors.login)}
            />
          </FormField>

          <FormField error={Boolean(errors.password)}>
            <label>Пароль</label>
            <Input
              fluid
              placeholder="Введите пароль..."
              type="password"
              name="password"
              error={Boolean(errors.password)}
            />
          </FormField>

          <div className="mb-8" />
          {error && <div className="mb-5">
            <strong className="text-red-600">{error}</strong>
          </div>}

          <Button fluid type="submit" color="blue">Войти</Button>

        </Form>
      </div>
    </div>
  </>
}

export default Login;
