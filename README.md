![ePhoto - Akeneo Connector](akeneo_connector.png)
# ePhoto - Akeneo Connector

## Description
After installing the connector, you will be able to directly access assets from the ePhoto DAM.

More information are available at our [website](https://ephoto.fr/). 

## Requirements

| Ephoto Connector Bundle  | Akeneo PIM Community Edition |
|:--------------------:|:----------------------------:|
| v1.0.*               | v1.7.*                       |

## Installation
You can install this bundle with composer (see requirements section):
```bash
    php /path/to/your/composer.phar require ephoto/akeneo-connector:~1.0
```

Then add the following lines **at the end** of your app/config/routing.yml :
```yaml
ephoto:
    resource: "@EindenEphotoConnectorBundle/Resources/config/routing.yml"
```

and enable the bundle in the `app/AppKernel.php` file in the `registerProjectBundles()` method:
```php
protected function registerProjectBundles()
{
    return [
        // ...
        new Einden\Ephoto\ConnectorBundle\EindenEphotoConnectorBundle(),
    ];
}

```

After all, run the following commands in your project root:
```bash
php app/console cache:clear --env=prod --no-warmup
php app/console cache:warmup --env=prod
php app/console pim:installer:assets --env=prod
php app/console oro:translation:dump en fr en_US en_UK fr_FR --env=prod
```

Within the Akeneo system configuration, you have to enter all required URL parameter to connect to your Ephoto DAM instance.
