declare global {
    interface Window {
      env: any
    }
  }
  
  export const environment = {
    production: false,
    api: {
      server: {
        url: 'http://localhost:8282/api/v1',
      },
    },
    oidc: {
      isEnabled: true,
      // -> Used in login page and elsewhere
      name: 'Zitadel',
      // -> OpenIdConfiguration.Authority
      endpoint: 'https://zitadel.example.net',
      // -> OpenIdConfiguration.ClientId
      clientId: '1234567890@lorem-list',
      // -> OpenIdConfiguration.Authority (appended to openid email profile offline_access)
      scope: 'urn:zitadel:iam:org:projects:roles',
      // name of claim object containing the user role
      roleClaim: 'urn:zitadel:iam:org:project:roles',
      // name of claim object containing the user name
      usernameClaim: 'preferred_username',
    },
  }
