import Layout from "@/layouts/layout";
import "@/styles/tailwind.css";
import "semantic-ui-css/semantic.min.css";
import "@/styles/globals.css";
import "@/styles/player.css";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { AppConsumer, AppProvider } from "@/contexts/appContext";
import { Loader } from "semantic-ui-react";
// import { Provider } from "react-redux";
// import { store } from "@/store";

// export async function getServerSideProps() {
//   // Здесь можно выполнить запрос к бэкэнд серверу для получения данных аутентифицированного пользователя
//   // Например:
//   const userData = await fetch('your-backend-api-url');
//   const user = await userData.json();

//   return {
//     props: {
//       user,
//     },
//   };
// }

export const APP_NAME = "Файлообменник";

const App = props => {

  const { Component, pageProps } = props;

  return (
    <AppProvider>
      <AppConsumer>
        {app => app.loading
          ? <div className="flex items-center justify-center w-full px-4 py-10">
            <Loader active inline />
          </div>
          : <Layout app={app}>
            <Component {...pageProps} />
          </Layout>
        }
      </AppConsumer>
    </AppProvider>
  );
}

export default App;
