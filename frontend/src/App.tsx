import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import AppRoutes from "./config/Routes";
import { Authentication, Organization } from "./api/api";
import ExternalRoutes from "./config/ExternalRoutes";
import "react-toastify/dist/ReactToastify.css";
import "@tremor/react/dist/esm/tremor.css";
import LoadingSpinner from "./components/LoadingSpinner";
import { PlanProvider } from "./context/PlanContext";
import useGlobalStore from "./stores/useGlobalstore";
import quickStartCheck from "./helpers/quickStartCheck";
import { components } from "./gen-types";

// telemetry for cloud version only
if ((import.meta as any).env.VITE_API_URL === "https://api.uselotus.io/") {
  posthog.init((import.meta as any).env.VITE_POSTHOG_KEY, {
    api_host: "https://app.posthog.com",
  });
}

const publicRoutes = [
  "/login",
  "/register",
  "/reset-password",
  "/set-new-password",
];

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setOrgInfoToStore = useGlobalStore((state) => state.setOrgInfo);
  const setEnvironmentType = useGlobalStore(
    (state) => state.setEnvironmentType
  );
  const setQuickStartProgress = useGlobalStore(
    (state) => state.setQuickStartProgress
  );
  const { refetch } = useQuery(
    ["organization"],
    () => Organization.get().then((res) => res[0]),
    {
      onSuccess: (data) => {
        setEnvironmentType(
          data.linked_organizations.filter((el) => el.current)[0]
            .organization_type
        );

        setOrgInfoToStore(data);
      },
    }
  );
  const fetchSessionInfo = async (): Promise<{ isAuthenticated: boolean }> =>
    Authentication.getSession()
      .then((res) => res)
      .catch((error) => {
        if (
          error?.response &&
          error?.response?.status === 401 &&
          !publicRoutes.includes(pathname)
        ) {
          navigate("/");
        }
        return error;
      });

  const { data: sessionData, isLoading } = useQuery<{
    isAuthenticated: boolean;
  }>(["session"], fetchSessionInfo, { refetchInterval: 60000 });

  const isAuthenticated =
    isLoading && !sessionData ? false : sessionData?.isAuthenticated;

  useEffect(() => {
    if (isAuthenticated) {
      quickStartCheck({
        setQuickStartProgress,
      });
      refetch();
    }
  }, [isAuthenticated]);

  if (isLoading && sessionData === undefined) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <ToastContainer
          autoClose={3000}
          toastClassName="rounded-md bg-background font-main"
          bodyClassName=" text-gold font-main"
        />
        <ExternalRoutes />
      </div>
    );
  }
  return (
    <div>
      <ToastContainer
        autoClose={3000}
        bodyClassName=" text-gold font-main"
        position="top-center"
      />
      <PlanProvider>
        <AppRoutes />
      </PlanProvider>
    </div>
  );
}

export default App;
