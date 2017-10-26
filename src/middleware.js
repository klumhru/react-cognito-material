import AWS from 'aws-sdk/global'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

export default (config) => {
  const userPool = new CognitoUserPool(config)
  let cognitoUser
  let cognitoIdentity
  const putAttributes = (store, creds, user, session, identity) => {
    user.getUserAttributes((err, res) => {
      if (err) {
        return store.dispatch(actions.cognitoError(err))
      }
      let i
      const user = {}
      for (i = 0; i < res.length; i++) {
        user[res[i].getName()] = res[i].getValue()
      }
      store.dispatch(actions.cognitoLoginSuccess(AWS.config.credentials, user, session, identity))
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
            AWS.config.region = userPool.client.config.region
            cognitoIdentity = new AWS.CognitoIdentity()
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: userPool.userPoolId,
              Logins: {
                [`cognito-idp.${userPool.client.config.region}.amazonaws.com/${userPool.userPoolId}`]:
                  result.getIdToken().getJwtToken(),
              },
            })
            store.dispatch(actions.cognitoRefreshCredentials())
          },
          onFailure: (error) => store.dispatch(actions.cognitoLoginFailure(error)),
        })
        break
      }
      case actions.COGNITO_REFRESH_CREDENTIALS: {
        console.log('COGNITO_REFRESH_CREDENTIALS START')
        cognitoUser = userPool.getCurrentUser()
        console.log('got cognitoUser:', cognitoUser)
        if (cognitoUser != null) {
          cognitoUser.getSession((err, session) => {
            if (err) {
              return store.dispatch(actions.cognitoLoginFailure(err))
            }
            AWS.config.region = userPool.client.config.region
            if (!cognitoIdentity) cognitoIdentity = new AWS.CognitoIdentity()

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: config.IdentityPoolId,
              // IdentityPoolId: userPool.userPoolId,
              Logins: {
                [`cognito-idp.${userPool.client.config.region}.amazonaws.com/${userPool.userPoolId}`]:
                session.getIdToken().getJwtToken(),
              },
            })
            AWS.config.credentials.refresh((error) => {
              if (error) {
                store.dispatch(actions.cognitoLoginFailure(error))
              }
              else {
                console.log('AWS.config.credentials', AWS.config.credentials)
                const params = AWS.config.credentials.webIdentityCredentials.params
                cognitoIdentity.getCredentialsForIdentity({
                  IdentityId: params.IdentityId,
                  Logins: params.Logins,
                }, (error, identity) => {
                  if (error) store.dispatch(actions.cognitoLoginFailure(error))
                  else {
                    AWS.config.credentials.get((error) => {
                      if (error) {
                        console.log('error calling CredentialsForIdentity.get', error)
                      } else {
                        console.log('cognitoIdentity.getCredentialsForIdentity', identity)
                        putAttributes(store, AWS.config.credentials, cognitoUser, session, identity)
                      }
                    })
                  }
                })
              }
            })
          })
        }
        break
      }
      default: break
    }
    return next(action)
  }
}
