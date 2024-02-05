import GitHubStrategy from "passport-github2"
import { createHash, isValidPassword, authToken, PRIVATE_KEY } from "../utils.js"
import passport from "passport"
import local from "passport-local"
import usersDao from "../DAO/classes/users.dao.js"
import logger from "../controllers/logger.js"
import usersModel from "../DAO/models/user.js";
import mongoose from 'mongoose';
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["token"];
    }
    return token;
  };


// const localStrategy = local.Strategy
const usersDaoInstance = new usersDao();



const initializaPassport = () => {

    passport.serializeUser((user, done) => {
        console.log("Serializando usuario desde passport, _id:", user._id);
        done(null, user._id || user.id); // Intenta utilizar user.id si user._id es undefined
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            let user = await usersDaoInstance.getUserById(_id);
            done(null, user);
        } catch (error) {
            console.error("Error en getUserById:", error);
            done(error, false);
        }
    });
    


    //--------- Estrategia JWT -----------
    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey:process.env.PRIVATE_KEY}, 
        async (jwtPayload, done) => {
            try {
            // jwtPayload contendrá la información del usuario
            const user = await usersDaoInstance.getUserById(jwtPayload.user._id);
            //const user = authToken.UsersDao.getUserById(jwtPayload.user._id);
            if (!user) {
                return done(null, false);
            }
            if (user) {
                // Si el token es válido, se pasa al siguiente middleware
                console.log("JWT Strategy - User:", user);
                return done(null, user);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

     // Estrategia de autenticación JWT para la sesión actual
    passport.use(
        "current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: process.env.PRIVATE_KEY,
                //secretOrKey: process.env.PRIVATE_KEY,
            },
            async (payload, done) => {
                try {
                    console.log("Payload en estrategia 'current':", payload);
                    const user = await usersModel.findOne({ email: payload.user.email });
                    console.log("", user);
    
                    if (!user) {
                        console.log("Usuario no encontrado, se niega el acceso");
                        // Usuario no encontrado, se niega el acceso
                        return done(null, false);
                    }
    
                    // Se pasa al siguiente middleware con el objeto UserDTO
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )

        
    );

    // Manejo de errores de Passport
    passport.use("errores", (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      // Error de autenticación JWT no válida
      return res.status(401).json({ error: 'Token no válido' });
    }
  
    // Otros errores
    console.error('Error en el middleware:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });


    


    //_________________ESTRATEGIA DE AUTENTIFICACIÓN DE PASSPORT-GITHUB (GitHubStrategy)________________
    ////Configuración de Passport-GitHub:
    passport.use('github', new GitHubStrategy({ //establece una estrategia de autentificación con el nombre github y crea una nueva instancia de la estrategia de aut.de github
        
        clientID: "Iv1.1cce9042759205e6", //identificador único de tu app en github
        clientSecret: "ec77c739b76d5d416dd4393f2a970bcdbe1406a3", //clave secreta asociada a mi app de github
        callbackURL: "http://localhost:8080/api/sessions/githubcallback" //la URL a la que GitHub redirigirá después de que un usuario haya autenticado con éxito. //se puede poner cualquier url mientras que corresponda al localhost8080 que es el puerto que estamos usando

        ////Manejo de la autenticación:
    }, async (accessToken, refreshToken, profile, done) => { //lA FIRMA DE LA FUNCIÓN//es una función asincrónica que maneja la autenticación una vez que GitHub ha devuelto la información del perfil del usuario.
        //accesToken: token de acceso utilizado para realizar acciones en nombre del usuario autentificado, en el contexto de github este token permite a la app realizar operaciones en la cuenta del usuario que ha iniciado sesión.
        //refreshToken: token parobteber un nuevo accessToken cuando el actual expira.
        //profile: objeto que contiene la información del perfil del usuario obtenida en github, el profile.__json.email se usa para acceder al correo electrónico del usuario.
        //done:se utiliza para indicar a passport si la utentificación fue exitosa y proporcionar información sobre el usuario autentificado. 
        console.log("Ejecutando github strategy");
        try {
            logger.debug(profile)
            ////Verificación del Usuario:
            let user = await usersDaoInstance.findEmail({ email: profile.__json.email }) //busca en la base de datos si ya existe un usuario con la dirección de correo electrónico proporcionada por GitHub.
            if (!user) { //si usuario no existe 
                ////Creación de un Nuevo Usuario:
                let newUser = { //vamos a crear un nuevo usuario 
                    first_name: profile.__json.name,
                    last_name: "github",
                    age: 20,
                    email: profile.__json.email,
                    rol: "user", //cuando pongo usuario no abre con el botón "ingresar con github"?
                    password: generateRandomPassword(), //prueba, antes era "" vacías.

                }

                let result = await usersDaoInstance.addUser(newUser) //agrega el nuevo usuario a la base de datos.
                done(null, result) //indica que la autenticación ha tenido éxito y proporciona el resultado (el nuevo usuario) a Passport.
            }
            ////Manejo de Errores:
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))



}

export { initializaPassport, JwtStrategy };