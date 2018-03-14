import AWS from 'aws-sdk/global'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

export default (config) => {
  const userPool = new CognitoUserPool(config)
  let cognitoUser = userPool.getCurrentUser()
  let refreshIntervalTimer

  const stopRefreshInterval = () => {
    clearInterval(refreshIntervalTimer)
  }
  const startRefreshInterval = (store) => {
    stopRefreshInterval()

    refreshIntervalTimer = setInterval(() => {
      store.dispatch(actions.cognitoRefreshCredentials())
    }, config.RefreshSessionIntervalSeconds * 1000 || 1000 * 60 * 15)
  }
  const putUserAttributes = (attributes) => {
    let i
    for (i = 0; i < attributes.length; i++) {
      cognitoUser[attributes[i].getName()] = attributes[i].getValue()
    }
  }
  const refreshCredentials = () =>
    new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
        } else if (config.RetrieveCredentials) {
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.IdentityPoolId,
            RoleArn: config.AuthRoleArn,
            Logins: {
              [`cognito-idp.${userPool.client.config.region}.amazonaws.com/${userPool.userPoolId}`]:
              session.getIdToken().getJwtToken(),
            },
          })
          AWS.config.region = 'eu-west-1'
          AWS.config.credentials.refresh((error) => {
            if (error) {
              reject(error)
            } else {
              resolve(session)
            }
          })
        } else {
          resolve(session)
        }
      })
    })

  return (store) => (next) => (action) => {
    switch (action.type) {
      case actions.COGNITO_START: {
        const user = userPool.getCurrentUser()
        if (user != null) {
          startRefreshInterval(store)
          return store.dispatch(actions.cognitoRefreshCredentials())
        }
        return false
      }
      case actions.COGNITO_USER_ATTRIBUTES: {
        if (cognitoUser != null) {
          cognitoUser.getUserAttributes((error, attributes) => {
            if (error) {
              store.dispatch(actions.cognitoUserAttributesError(error))
            } else {
              store.dispatch(actions.cognitoUserAttributesSuccess(attributes, config.userProfileAttributes || []))
            }
          })
        }
        break
      }
      case actions.COGNITO_RESET_PASSWORD: {
        if (cognitoUser != null) {
          const { verificationCode, newPassword } = action
          cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => {
              store.dispatch(actions.cognitoResetPasswordSuccess())
            },
            onFailure: (err) => {
              store.dispatch(actions.cognitoResetPasswordFailure(err))
            },
          })
        } else {
          // TODO: Offer a solution to restart the reset password flow.
          // Dispatch RESET_PASSWORD_START?
          setTimeout(() => {
            store.dispatch(actions.cognitoResetPasswordRestart())
          }, 50)
        }
        break
      }
      case actions.COGNITO_SEND_VERIFICATION_CODE: {
        const { email } = action
        cognitoUser = new CognitoUser({ Username: email, Pool: userPool })
        cognitoUser.forgotPassword({
          // onSuccess: (result) => {
          //   console.log(result)
          //   store.dispatch(actions.cognitoSendVerificationCodeSuccess())
          //   console.log('wat')
          // },
          onFailure: (err) => {
            console.log(err)
            store.dispatch(actions.cognitoSendVerificationCodeFailure(err))
          },
          inputVerificationCode: () => {
            store.dispatch(actions.cognitoSendVerificationCodeSuccess())
          },
        })
        break
      }
      case actions.COGNITO_SIGNOUT: {
        stopRefreshInterval()
        if (cognitoUser != null) {
          try {
            if (action.signoutFromEverywhere) {
              cognitoUser.globalSignout()
            } else {
              cognitoUser.signOut(() => {
              })
            }
            AWS.config.credentials.clearCachedId()
          } catch (e) {
            store.dispatch(actions.cognitoSignOutFailure(e))
          } finally {
            store.dispatch(actions.cognitoSignOutSuccess())
          }
        }
        break
      }
      case actions.COGNITO_SIGNOUT_SUCCESS: {
        break
      }
      case actions.COGNITO_REGISTER: {
        const { name, email, password } = action
        const attributes = [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
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
        const auth = new AuthenticationDetails({ Username: email, Password: password })
        const userData = { Username: email, Pool: userPool }
        cognitoUser = new CognitoUser(userData)
        cognitoUser.authenticateUser(auth, {
          onSuccess: () => {
            startRefreshInterval(store)
            store.dispatch(actions.cognitoRefreshCredentials())
          },
          onFailure: (error) => store.dispatch(actions.cognitoLoginFailure(error)),
        })
        break
      }
      case actions.COGNITO_REFRESH_CREDENTIALS: {
        if (cognitoUser != null) {
          refreshCredentials(cognitoUser).then((session) => {
            cognitoUser.getUserAttributes((error, attributes) => {
              if (error) {
                store.dispatch(actions.cognitoError(error))
              } else {
                putUserAttributes(attributes)
                if (!config.RetrieveCredentials) {
                  store.dispatch(actions.cognitoLoginSuccess(cognitoUser))
                } else {
                  cognitoUser.identityId = AWS.config.credentials.params.IdentityId
                  const data = AWS.config.credentials.data.Credentials
                  const creds = {
                    accessKeyId: data.AccessKeyId,
                    secretAccessKey: data.SecretAccessKey || data.SecretKey,
                    sessionToken: data.SessionToken,
                    expiration: data.Expiration,
                  }
                  store.dispatch(actions.cognitoLoginSuccess(cognitoUser, session, creds))
                }
              }
            })
          }).catch((err) => {
            store.dispatch(actions.cognitoLoginFailure(err))
          })
        }
        break
      }
      default: break
    }
    return next(action)
  }
}
