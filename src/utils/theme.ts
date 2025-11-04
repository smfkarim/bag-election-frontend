import { createTheme, MantineColorsTuple } from "@mantine/core";

const primary: MantineColorsTuple = [
  "#E9F5EE",
  "#CDE8D8",
  "#A9D7BC",
  "#7FC59D",
  "#58B17E",
  "#359D62",
  "#1E864B",
  "#156C3D",
  "#10542B",
  "#0A3820",
];

export const theme = createTheme({
  colors: {
    primary,
  },
  primaryColor: "primary",
  primaryShade: 6, // you can adjust (6–8 recommended)
});
