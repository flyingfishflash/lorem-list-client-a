(function (window) {
  window['env'] = window['env'] || {};

  /**
  
      When running in a container, environment variable values replace ${} tokens,
      and the output is saved to runtimeEnvironment.js
  
      See /container/docker-entrypoint-custom.sh:
      /usr/local/bin/envsubst < /usr/share/nginx/html/assets/runtimeEnvironment.template.js > /usr/share/nginx/html/assets/runtimeEnvironment.js
  
      When developing locally, the values could be set in src/public/assets/runtimeEnvironment.development.js,
      however they should be set in /src/environments/environment.ts
  
    */

  // API_SERVER_URL
  window['env']['apiServerUrl'] = '${API_SERVER_URL}';

  // OIDC_NAME
  window['env']['oidcName'] = '${OIDC_NAME}';
  // OIDC_ENDPOINT -> OpenIdConfiguration.Authority
  window['env']['oidcEndpoint'] = '${OIDC_ENDPOINT}';
  // OIDC_CLIENT_ID -> OpenIdConfiguration.ClientId
  window['env']['oidcClientId'] = '${OIDC_CLIENT_ID}';
  // OIDC_SCOPE -> OpenIdConfiguration.Authority (appended to 'openid email profile offline_access')
  window['env']['oidcScope'] = '${OIDC_SCOPE}';
  // OIDC_ROLE_CLAIM: name of claim object containing the user role
  window['env']['oidcRoleClaim'] = '${OIDC_ROLE_CLAIM}';
  // OIDC_USERNAME_CLAIM: name of claim object containing the user name
  window['env']['oidcUsernameClaim'] = '${OIDC_USERNAME_CLAIM}';
})(this);
