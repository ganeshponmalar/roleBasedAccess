import jwt from 'jsonwebtoken'

export const handleOAuthSuccess = (req, res) => {
  const user = req.user

  const accessToken = jwt.sign(
    { UserInfo: { username: user.name, roles: user.roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { username: user.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } 
  )

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}`)
}
