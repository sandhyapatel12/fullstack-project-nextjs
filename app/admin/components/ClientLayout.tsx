"use client";

import store from "@/app/store/globalstore";
import { Provider } from "react-redux";

export default function ClientLayout({children,}: {children: React.ReactNode})
 {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
