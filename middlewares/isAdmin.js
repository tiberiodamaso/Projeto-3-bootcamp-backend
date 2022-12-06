function isAdmin(req, res, next) {
  if (req.auth.role !== 'admin') {
    return res.status(401).json({msg: 'Usuário não autorizado'})
  }
  next()
}

export default isAdmin