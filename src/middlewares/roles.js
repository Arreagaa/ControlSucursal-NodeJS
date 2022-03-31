exports.verAdmin = function (req, res, next) {
    if (req.user.rol !== "ROL_ADMINISTRADOR")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
  };
  
 exports.verEmpresa = function (req, res, next) {
    if (req.user.rol !== "ROL_EMPRESA")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
  };
  