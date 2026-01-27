import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Divider,
  IconButton,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TableRowsIcon from "@mui/icons-material/TableRows";
import SchoolIcon from "@mui/icons-material/School";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Link } from "react-router-dom";
import Logo from "../layout/img/FOTON.png";
import AuthContext from "../../context/Auth/AuthContext";
import AgendaContext from "../../context/Agenda/AgendaContext";
import CursosFavoritosContext from "../../context/CursosFavoritos/CursosFavoritosContext";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: `calc(${theme.spacing(7)} + 1px)`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    duration: theme.transitions.duration.leavingScreen,
    easing: theme.transitions.easing.sharp,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Header({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const { cerrarSesion } = React.useContext(AuthContext);
  const { agendasCount, GetAgendasCount } = React.useContext(AgendaContext);
  const { cursos, GetCursosFavoritos } = React.useContext(
    CursosFavoritosContext,
  );

  const type_user = localStorage.getItem("type_user");

  const baseUrl = process.env.REACT_APP_BACKEND_URL.replace(/\/api$/, "");

  const manualUrl =
    type_user === "1"
      ? `${baseUrl}/storage/Manuales/PicAdmin.pdf`
      : type_user === "2"
        ? `${baseUrl}/storage/Manuales/PicInstructor.pdf`
        : type_user === "6"
          ? `${baseUrl}/storage/Manuales/PicSubAdmin.pdf`
          : `${baseUrl}/storage/Manuales/PicCliente.pdf`;

  React.useEffect(() => {
    GetAgendasCount();
    GetCursosFavoritos();
  }, []);

  const menus = {
    1: [
      { name: "Inicio", value: "/Inicio", icon: <HomeIcon /> },
      { name: "Categorías", value: "/Categorias", icon: <CategoryIcon /> },
      { name: "Modelos", value: "/Modelos", icon: <LocalShippingIcon /> },
      { name: "Cursos", value: "/Cursos", icon: <MenuBookIcon /> },
      {
        name: "Cursos reservados",
        value: "/Agenda",
        icon: (
          <Badge badgeContent={agendasCount.length} color="error">
            <SchoolIcon />
          </Badge>
        ),
      },
      { name: "Calendario", value: "/Calendario", icon: <CalendarMonthIcon /> },
      { name: "Usuarios", value: "/Usuarios", icon: <GroupIcon /> },
      { name: "Mi perfil", value: "/Perfil", icon: <PersonIcon /> },
    ],
    2: [
      { name: "Mis cursos", value: "/Cursos", icon: <MenuBookIcon /> },
      {
        name: "Mis cursos reservados",
        value: "/Agenda",
        icon: (
          <Badge badgeContent={agendasCount.length} color="error">
            <SchoolIcon />
          </Badge>
        ),
      },
      {
        name: "Mi calendario",
        value: "/Calendario",
        icon: <CalendarMonthIcon />,
      },
      { name: "Mi perfil", value: "/Perfil", icon: <PersonIcon /> },
    ],
    3: [
      { name: "Todos los cursos", value: "/Cursos", icon: <MenuBookIcon /> },
      {
        name: "Mis favoritos",
        value: "/CursosFavoritos",
        icon: (
          <Badge badgeContent={cursos.length} color="error">
            <FavoriteIcon />
          </Badge>
        ),
      },
      {
        name: "Mis reservados",
        value: "/Agenda",
        icon: (
          <Badge badgeContent={agendasCount.length} color="error">
            <EventIcon />
          </Badge>
        ),
      },
      {
        name: "Mi calendario",
        value: "/Calendario",
        icon: <CalendarMonthIcon />,
      },
      { name: "Perfil", value: "/Perfil", icon: <PersonIcon /> },
    ],
    6: [
      { name: "Cursos", value: "/Cursos", icon: <MenuBookIcon /> },
      {
        name: "Todos los reservados",
        value: "/CursosTabla",
        icon: <TableRowsIcon />,
      },
      { name: "Calendario", value: "/Calendario", icon: <CalendarMonthIcon /> },
      { name: "Mi perfil", value: "/Perfil", icon: <PersonIcon /> },
    ],
    7: [
      { name: "Todos los cursos", value: "/Cursos", icon: <MenuBookIcon /> },
      {
        name: "Mis favoritos",
        value: "/CursosFavoritos",
        icon: (
          <Badge badgeContent={cursos.length} color="error">
            <FavoriteIcon />
          </Badge>
        ),
      },
      {
        name: "Mis reservados",
        value: "/Agenda",
        icon: (
          <Badge badgeContent={agendasCount.length} color="error">
            <EventIcon />
          </Badge>
        ),
      },
      {
        name: "Mi calendario",
        value: "/Calendario",
        icon: <CalendarMonthIcon />,
      },
      { name: "Perfil", value: "/Perfil", icon: <PersonIcon /> },
    ],
  };

  const menuItems = menus[type_user] ?? [];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open} sx={{ background: "#E8F5E9" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              ...(open && { display: "none" }),
              color: "black",
              transition: ".2s",
              "&:hover": { rotate: "40deg" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              right: "100%",
              transform: "translateX(-100%)",
            }}
          >
            <img src={Logo} alt="logo" style={{ width: 80, height: 80 }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ backgroundColor: "#E8F5E9" }}>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: "black" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "black" }} />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <Box sx={{ flexGrow: 1 }}>
          <List>
            {menuItems.map((item, i) => (
              <ListItem key={i} disablePadding sx={{ display: "block" }}>
                <Tooltip title={item.name} placement="right">
                  <ListItemButton
                    component={Link}
                    to={item.value}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "black",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.name}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: "black",
                        fontWeight: "bold",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton component="a" href={manualUrl} target="_blank">
              <ListItemIcon>
                <PictureAsPdfIcon />
              </ListItemIcon>
              <ListItemText primary="Manual de usuario" />
            </ListItemButton>
          </ListItem>

          {type_user !== "3" && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  (window.location.href =
                    "https://ldrhsys.ldrhumanresources.com/Cliente/interfaces/Inicio.php?resultado=ingreso")
                }
              >
                <ListItemIcon>
                  <KeyboardReturnIcon />
                </ListItemIcon>
                <ListItemText primary="Regresar" />
              </ListItemButton>
            </ListItem>
          )}

          {type_user === "3" && (
            <ListItem disablePadding>
              <ListItemButton onClick={cerrarSesion}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" sx={{ color: "#000" }} />
              </ListItemButton>
            </ListItem>
          )}
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
