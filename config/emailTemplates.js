module.exports = {

  otp: {
    body: `Hi {{name}}
Your OTP is {{otp}}
Thanks you`,
    title: 'Login OTP',
  },

  forgotPassword: {
    body: ' Hi {{name}},'

      + `You recently requested to reset your password for your account. Use the below temporary password to reset it. This temporary password is only valid for the next 24 hours.
      
      Reset your password with temporary password: {{temproaryPassword}}         
  Thanks,`,
    title: 'Password reset request',
  },
  creating_new_user: {
    body: ' Welcome, {{username}}! <br>'

      + `Thanks for signing in!  You've been added  <br>

  Thanks,<br>
  The <br><br>`,
    title: 'Created new user',
  },
};
