// profile.routes.js
import { Router } from "express";
import logger from "../controllers/logger.js";


const profileRouter = Router();

profileRouter.get("/userProfile", (req, res) => {
  if (!req.session.emailUsuario) {
    return res.redirect("/login");
  }
  res.render("userProfile", {
    title: "Vista Perfil Usuario",
    first_name: req.session.nomUsuario,
    last_name: req.session.apeUsuario,
    email: req.session.emailUsuario,
    rol: req.session.rolUsuario,
  });
});

profileRouter.get("/adminProfile", (req, res) => {
  // Renderiza la vista del perfil del administrador
  res.render("adminProfile", {
    title: "Perfil del Administrador",
    adminName: req.session.nomUsuario,
    // Otros datos necesarios
  });
});

// Agrega más rutas según sea necesario, por ejemplo, "/premiumProfile"

export default profileRouter;
