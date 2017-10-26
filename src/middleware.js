import AWS from 'aws-sdk/global'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

export default (config) => {
  const userPool = new CognitoUserPool(config)
  let cognitoUser
  let cognitoIdentity
  const putAttributes = (store, user, session) => {
    user.getUserAttributes((err, res) => {
      if (err) {
        return store.dispatch(actions.cognitoError(err))
      }
      let i
      const user = {}
      for (i = 0; i < res.length; i++) {
        user[res[i].getName()] = res[i].getValue()
      }
      store.dispatch(actions.cognitoLoginSuccess(user, session))
    })
  }

  return (store) => (next) => (action) => {
    switch (action.type) {
      case actions.COGNITO_SIGNOUT: {
        try {
          cognitoUser.signOut()
          AWS.config.credentials.clearCacheId()
        } catch (e) {
          store.dispatch(actions.cognitoSignOutFailure(e))
        } finally {
          store.dispatch(actions.cognitoSignOutSuccess())
        }
        break
      }
      case actions.COGNITO_SIGNOUT_SUCCESS: {
        cognitoUser = undefined
        break
      }
      case actions.COGNITO_REGISTER: {
        const { name, email, password } = action
        const attributes = [
          { Name: "name", Value: name },
          { Name: "email", Value: email },
        ]
        store.dispatch(actions.cognitoRegistering({ email, password }))
        userPool.signUp(email, password, attributes, null, (err, result) => {
          if (err) {
            store.dispatch(actions.cognitoRegisterFailure(err))
          }
          store.dispatch(actions.cognitoRegisterSuccess(result.user))
        })
        break
      }
      case actions.COGNITO_LOGIN: {
        const { email, password } = action
        store.dispatch(actions.cognitoLoggingIn({ email, password }))
        const auth = new AuthenticationDetails({ Username: email, Password: password })
        const userData = { Username: email, Pool: userPool }
        cognitoUser = new CognitoUser(userData)
        cognitoUser.authenticateUser(auth, {
          onSuccess: (result) => {
            store.dispatch(actions.cognitoRefreshCredentials())
          },
          onFailure: (error) => store.dispatch(actions.cognitoLoginFailure(error)),
        })
        break
      }
      case actions.COGNITO_REFRESH_CREDENTIALS: {
        console.log('COGNITO_REFRESH_CREDENTIALS START')
        cognitoUser = userPool.getCurrentUser()
        if (cognitoUser != null) {
          cognitoUser.getSession((err, session) => {
            if (err) {
              return store.dispatch(actions.cognitoLoginFailure(err))
            }
            console.log('got cognitoUser:', cognitoUser, 'with session:', session)
            putAttributes(store, cognitoUser, session)
          })
        }
        break
      }
      default: break
    }
    return next(action)
  }
}
