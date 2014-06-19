<?php

use Swift_Mailer;

/**
 * Description of UploadedFile
 *
 * @author victor
 */
class UploadedFile extends \SplFileInfo
{
    
    function __construct($fileName)
    {
        parent::__construct($fileName);
    }

}
