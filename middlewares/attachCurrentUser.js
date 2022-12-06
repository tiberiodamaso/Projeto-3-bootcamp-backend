import UserModel from "../model/user.model.js"



async function attachCurrentUser(req, res, next) {
  try {
    const userData = req.auth
    const user = UserModel.findById(userData._id, {passwordHash: 0})
    
    // Checar se existe o user
    if(!user) {
      return res.status(400).json({msg: 'Usuário não encontrado'})
    }

    // Criando uma chave com o usuário corrente na requisição  
    req.currentUser = user

    next()

  } catch (error) {
    console.log(error)
    return res.status(400).json(error.errors)
  }
}

export default attachCurrentUser