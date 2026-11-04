"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F8FAFC",
    },
    text: {
      primary: "#111827",
    },
    divider: "#E5E7EB",
  },
  typography: {
    fontFamily: 'var(--font-inter), Arial, sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#E5E7EB",
        },
      },
    },
  },
});

export default theme;
