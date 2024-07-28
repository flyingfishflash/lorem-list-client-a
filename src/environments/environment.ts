declare global {
  interface Window {
    env: any
  }
}

export const environment = {
  production: true,
  api: {
    server: {
      url: window.env['apiServerUrl'] || '',
    },
  },
  oidc: {
    isEnabled: true,
    // -> Used in login page and elsewhere
    name: window['env']['oidcName'] || '',
    // -> OpenIdConfiguration.Authority
    endpoint: window['env']['oidcEndpoint'] || '',
    // -> OpenIdConfiguration.ClientId
    clientId: window['env']['oidcClientId'] || '',
    // -> OpenIdConfiguration.Authority (appended to openid email profile offline_access)
    scope: window['env']['oidcScope'] || '',
    // name of claim object containing the user role
    roleClaim: window['env']['oidcRoleClaim'] || '',
    // name of claim object containing the user name
    usernameClaim: window['env']['oidcUsernameClaim'] || '',
  },
}
