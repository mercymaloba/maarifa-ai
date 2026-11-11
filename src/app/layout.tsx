import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "../components/ui/FeedbackStates";
import { StoreProvider } from "../store/StoreProvider";
import { AppShell } from "../components/layout/AppShell";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/themes";
import { CssBaseline } from "@mui/material";

export const metadata: Metadata = {
  title: { default: "Maarifa AI", template: "%s | Maarifa AI" },
  description: "Your AI-powered knowledge workspace.",
};

const inter = Inter({
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<LoadingState />}>
              <StoreProvider><AppShell>{children}</AppShell></StoreProvider>
            </Suspense>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
