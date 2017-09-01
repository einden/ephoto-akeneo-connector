<?php

namespace Einden\Ephoto\ConnectorBundle\EventListener;

use Einden\Component\Classification\Model\CategoryInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class CategoryModificationListener extends AbstractModificationListener
{

    public function onPostSave(GenericEvent $event)
    {
        $subject = $event->getSubject();

        if ($subject instanceof CategoryInterface) {
           #$this->ephoto->notifyAboutCategoryModifications($subject);
        }
    }

}