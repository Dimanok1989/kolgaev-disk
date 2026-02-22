import useFetch from "@/hooks/useFetch";
import Head from "next/head";
import {
  Button,
  Form,
  FormField,
  Input,
  Modal
} from "semantic-ui-react";
import { APP_NAME } from "../_app";
import { useApp } from "@/hooks/useApp";
import Cookies from "js-cookie";
import { useState } from "react";

const Login = () => {

  const { isLoading, errors, isError, error, postJson } = useFetch();
  const app = useApp();
  const [termsOpen, setTermsOpen] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    await postJson('auth/login', formData, (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('kolgaev_api_token', data.token);
      Cookies.set('kolgaev_api_token', data.token, {
        domain: process.env.NEXT_PUBLIC_APP_COOKIE_DOMAIN || '.kolgaev.ru'
      });
      app.login(data);
    });
  }

  return <>

    <Head>
      <title>Авторизация | {APP_NAME}</title>
    </Head>

    <div className={`flex min-h-screen flex-col items-center justify-between py-24 px-5`}>

      <div className="min-w-[400px] border-none rounded-xl p-5 cursor-default bg-white">

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

          {/* <strong className="text-red-600 text-center mx-auto w-full block">Временно не работает</strong> */}

          <div className="max-w-[300px] text-center mx-auto mt-8 text-sm opacity-50">
            Нажимая «Войти», вы принимаете <a href="#" onClick={e => { e.preventDefault(); setTermsOpen(true); }}>пользовательское соглашение</a>
            <Modal
              open={termsOpen}
              centered={false}
              closeOnDocumentClick
              closeIcon
              onClose={() => setTermsOpen(false)}
              content={<div className="px-4 py-5">
                <div className="mx-auto">

                  <h1 className="text-3xl font-bold mb-6">Пользовательское соглашение сервиса «Файлообменник»</h1>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1 mt-8">1. Общие положения</h2>
                    <p className="mb-0">1.1. Настоящее Пользовательское соглашение (далее – Соглашение) регулирует отношения между Администрацией сервиса «Файлообменник» (далее – Сервис) и Пользователем.</p>
                    <p className="mb-0">1.2. Сервис представляет собой онлайн-платформу для хранения и обмена файлами между пользователями.</p>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">2. Термины и определения</h2>
                    <ul className="list-disc pl-6">
                      <li><strong>Пользователь</strong> – физическое лицо, получившее доступ к Сервису.</li>
                      <li><strong>Администрация</strong> – владелец и оператор Сервиса.</li>
                      <li><strong>Аккаунт</strong> – личная учетная запись Пользователя в системе.</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">3. Порядок регистрации и авторизации</h2>
                    <p className="mb-0">3.1. Регистрация на Сервисе осуществляется исключительно по приглашению Администрации.</p>
                    <p className="mb-0">3.2. Авторизация производится с использованием предоставленных Администрацией логина или email.</p>
                    <p className="mb-0">3.3. Пользователь обязуется:</p>
                    <ul className="list-disc pl-6">
                      <li>Не передавать учетные данные третьим лицам</li>
                      <li>Немедленно уведомить Администрацию о компрометации данных</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">4. Права и обязанности сторон</h2>
                    <p className="mb-0">4.1. Администрация вправе:</p>
                    <ul className="list-disc pl-6 mb-0">
                      <li>Ограничивать доступ к Сервису</li>
                      <li>Модифицировать условия Соглашения</li>
                      <li>Удалять нарушающий правила контент</li>
                    </ul>
                    <p className="mb-0">4.2. Пользователь обязуется:</p>
                    <ul className="list-disc pl-6 mb-0">
                      <li>Использовать Сервис исключительно в законных целях</li>
                      <li>Не размещать запрещенный контент</li>
                      <li>Соблюдать правила конфиденциальности</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">5. Обработка и хранение персональных данных</h2>
                    <p className="mb-0">5.1. <stropng>Персональные данные</stropng> – любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных).</p>
                    <p className="mb-0">5.2. Администрация является оператором персональных данных и обязуется:</p>
                    <ul className="list-disc pl-6 mb-0">
                      <li>Обрабатывать персональные данные в соответствии с ФЗ №152 «О персональных данных»</li>
                      <li>Обеспечивать безопасность персональных данных при их обработке</li>
                      <li>Не допускать неправомерного использования персональных данных</li>
                    </ul>
                    <p className="mb-0">5.3. Пользователь предоставляет следующие персональные данные:</p>
                    <ul className="list-disc pl-6 mb-0">
                      <li>Адрес электронной почты</li>
                      <li>Логин</li>
                      <li>Иные данные, необходимые для использования Сервиса</li>
                    </ul>
                    <p className="mb-0">5.4. Персональные данные хранятся на защищенных серверах Администрации и используются исключительно для:</p>
                    <ul className="list-disc pl-6 mb-0">
                      <li>Идентификации Пользователя</li>
                      <li>Предоставления доступа к Сервису</li>
                      <li>Технической поддержки</li>
                    </ul>
                    <p className="mb-0">5.5. Пользователь соглашается с тем, что:</p>
                    <ul className="list-disc pl-6 mb-0">
                      <li>Предоставляет достоверную информацию</li>
                      <li>Несет ответственность за актуальность предоставленных данных</li>
                      <li>Имеет право на доступ к своим персональным данным и их исправление</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">6. Ограничение ответственности</h2>
                    <p className="mb-0">6.1. Администрация не несет ответственности за потерю данных Пользователя, технические сбои и действия третьих лиц.</p>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">7. Конфиденциальность</h2>
                    <p className="mb-0">7.1. Администрация обязуется защищать персональные данные Пользователя и не передавать их третьим лицам без согласия.</p>
                  </div>

                  <div className="mb-5">
                    <h2 className="text-xl font-bold mb-1">8. Заключительные положения</h2>
                    <p className="mb-0">8.1. Настоящее Соглашение регулируется законодательством РФ.</p>
                  </div>

                  <div className="mb-5"><i>Дата обновления: 22.02.2026</i></div>
                  <div><small>Администрация оставляет за собой право вносить изменения в настоящее Соглашение. Обновленная версия публикуется на сайте Сервиса. Продолжение использования Сервиса после внесения изменений означает принятие Пользователем таких изменений.</small></div>
                </div>
              </div>}
            />
          </div>

        </Form>
      </div>
    </div>
  </>
}

export default Login;
