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
createServiceConfiguration('google', '937484174984-udu5l6ovmq7c9t88mo2mchisvsrgpstu.apps.googleusercontent.com', 'DJWJ17_WPiPuR3vGyrd1AxIg')
createServiceConfiguration('cronofy', 'p7RnSo-0arld61IThftToaOd7wKJN4qx', 'eC34_meTGi05QtQcC7XJ-YSub6VJ-8r3HshSk67Kpt6_fBN_zYP4Sw9FVZhT-y0czGByN_DgX8SdLOawrw50OQ')
