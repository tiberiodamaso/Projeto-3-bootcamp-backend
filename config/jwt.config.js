import jwt from 'jsonwebtoken'

function generateToken(user) {
  const { _id, email, role } = user
  const signature = process.env.TOKEN_SIGN_SECRET
  const expiration = '12h'

  // Retorna um token assinado pela sua aplicação
  // 1º argumento = payload
  // 2º argumento = signature
  // 3º argumento = expiration
  return jwt.sign({ _id, email, role }, signature, { expiresIn: expiration })
}

export default generateToken