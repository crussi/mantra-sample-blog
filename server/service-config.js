var createServiceConfiguration;

createServiceConfiguration = function(service, clientId, secret) {
    var config;
    ServiceConfiguration.configurations.remove({
        service: service
    });
    config = {
        generic: {
            service: service,
            clientId: clientId,
            secret: secret
        },
        facebook: {
            service: service,
            appId: clientId,
            secret: secret
        },
        twitter: {
            service: service,
            consumerKey: clientId,
            secret: secret
        },
        cronofy: {
            service: service,
            client_id: clientId,
            client_secret: secret
        }
    };
    switch (service) {
        case 'facebook':
            return ServiceConfiguration.configurations.insert(config.facebook);
        case 'twitter':
            return ServiceConfiguration.configurations.insert(config.twitter);
        case 'cronofy':
            return ServiceConfiguration.configurations.insert(config.cronofy);
        default:
            return ServiceConfiguration.configurations.insert(config.generic);
    }
};
createServiceConfiguration('cronofy', '_QOoOhBwuUfl3ZDBhN9lsNGXPdKJwZqP', 'CMlCEvq12kk_Ogrt_5KOHvHnpRiEfgRELxDsxoZHDxO0gyx6xGlQ2hnU6HPJOo-Gm2l6hTXvWZPNJylveEqIhw')
