<?php

namespace Einden\Ephoto\ConnectorBundle\EventListener;

use Einden\Ephoto\ConnectorBundle\Ephoto;

abstract class AbstractModificationListener
{
    /**
     * @var Ephoto
     */
    protected $ephoto;

    /**
     * AbstractEntityModificationListener constructor.
     *
     * @param $ephoto
     */
    public function __construct(Ephoto $ephoto)
    {
        $this->ephoto = $ephoto;
    }

}