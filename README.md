![alt text](http://eikona-media.de/files/cto_layout/img/logo.png "Eikona")
# Eikona PDF generator bundle
[![build status](https://git.eikona-server.de/akeneo-bundles/akeneo-mammut-connector/badges/master/build.svg)](https://git.eikona-server.de/akeneo-bundles/akeneo-mammut-connector/commits/master)
[![coverage report](https://git.eikona-server.de/akeneo-bundles/akeneo-mammut-connector/badges/master/coverage.svg)](https://git.eikona-server.de/akeneo-bundles/akeneo-mammut-connector/commits/master)


Also available on the Akeneo marketplace: https://marketplace.akeneo.com/

## Description
After installing the this bundle, you will be able to use WkHtmlToPdf renderer as default render engine for data specification sheets. WkHtmlToPdf is, other than domPDF, the render akeneo uses by default, a render engine which generates PDFs on base of Webkit. 

Advantages:
- Create your own templates for data specification sheets
- Add header and footer to each ob your pages
- Attach a cover page to your sheet 

## Requirements

| Ephoto Connector Bundle  | Akeneo PIM Community Edition |
|:--------------------:|:----------------------------:|
| v1.0.*               | v1.7.*                       |

## Installation
You can install this bundle with composer (see requirements section):
```bash
    php composer.phar require eikona/pdf-generator-bundle @stable
```

Enable the bundle in the `app/AppKernel.php` file in the `registerProjectBundles()` method:
```php
protected function registerProjectBundles()
{
    return [
        // ...
        new Eikona\PdfGeneratorBundle\EikonaPdfGeneratorBundle(),
        new \Knp\Bundle\SnappyBundle\KnpSnappyBundle(),
    ];
}

```


Add to `app/config/parameters.yml`
```yaml
parameters:
    # other parameters ...
    EikonaPdfGenerator:
        footer: false             # Should a footer template be attached to data sheet
        header: null              # Should a header template be attached to data sheet
        cover: true               # Render the cover page?
        cover-template: null      # Overwrites the default template. Path to template required
        footer-template : null    # Overwrites the default template. Path to template required
        header-template: null     # Overwrites the default template. Path to template required
        footer-height: '10'       # Depending on your footer template, this value scales the spacing between bottom and content
        header-height: '10'       # Depending on your header template, this value scales the spacing between top and content
```

After all, run the following command in your project root:
```bash
php app/console cache:clear --env=prod
```

## Possible errors and known bugs
```
Failed to create ".../app/../web/media/cache/thumbnail/...": The ability to pass file names to the Symfony\Component\Yaml\Yaml::parse method is deprecated since version 2.2 and will be removed in 3.0. Pass the YAML contents of the file instead..
```
In this case, please create directory `web/media/cache/thumbnail` manually.