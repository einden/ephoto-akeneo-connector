<?php

namespace Einden\Ephoto\ConnectorBundle\EventListener;

use Pim\Component\Catalog\Model\ProductInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class ProductModificationListener extends AbstractModificationListener
{

    public function onPostSave(GenericEvent $event)
    {
        $subject = $event->getSubject();

        if ($subject instanceof ProductInterface) {
            $this->ephoto->notifyAboutProductModifications($subject);
        }


    }
}