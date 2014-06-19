<?php


/**
 * Description of UploadManager
 * Class for handling file upload
 *
 * @author victor
 */
class UploadManager
{
    /**
     *
     * @var UploadedFile 
     */
    protected $uploadedFile;
    
    protected $uploadedImagesUrl = [];
    
    /**
     * the fiel field name
     * @var string 
     */
    protected $fileKey;
    
    const UPLOAD_DIR = "uploads";
    const URL_SEPARATOR = "/";
    const UPLOAD_OK = 0;
    
    /**
     * 
     * @param UploadedFile $uploadedFile
     * @param string $index
     */
    function __construct(UploadedFile $uploadedFile, $index)
    {
        $this->uploadedFile = $uploadedFile;
        $this->fileKey = $index;
    }
    
    public function getUploadedFile()
    {
        return $this->uploadedFile;
    }

    /**
     * 
     * @param UploadedFile $uploadedFile
     */
    public function setUploadedFile(UploadedFile $uploadedFile)
    {
        $this->uploadedFile = $uploadedFile;
    }
    
    /**
     * return the upload directory
     * @return string
     */
    protected function getUploadDir()
    {
        return self::UPLOAD_DIR. self::URL_SEPARATOR;
    }
    
    /**
     * new file name
     * @param string $newName
     */
    public function upload($newName)
    {
       
        $file = $this->uploadedFile;
        $uploadPath = $this->getUploadDir();
        $fileNewName = (null == $newName) ? rand().time() : $newName."_".  time();
        $fileExtension = $file->getExtension();
        //set file name
        $fileNewNameWithExt =  $fileNewName.".".$fileExtension;
        $fileLocation = $uploadPath. $fileNewNameWithExt;
        
        move_uploaded_file($_FILES[$this->fileKey]["tmp_name"], $fileLocation);
        
        if (self::UPLOAD_OK == $_FILES[$this->fileKey]["error"]) {
            $this->setUploadedImagesUrl($fileNewNameWithExt);
        }
    }

    /**
     * 
     * @return string web path url
     */
    public function getBasePath()
    {
        $protocol = (strstr('https',$_SERVER['SERVER_PROTOCOL']) === false)?'http':'https';
        return $protocol.'://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']);
    }
    
    /**
     * 
     * @return string path to upload directory
     */
    public function getImagePath()
    {
        return $this->getBasePath(). self::URL_SEPARATOR. self::UPLOAD_DIR. self::URL_SEPARATOR;
    }

    /**
     * 
     * @return array an array of uploaded image path
     */
    public function getUploadedImagesUrl()
    {
        return $this->uploadedImagesUrl;
    }
    
    /**
     * add newly upladed image to the array
     * @param string $imagePath
     */
    public function setUploadedImagesUrl($imagePath)
    {
        $baseUrl = $this->getImagePath();
        $this->uploadedImagesUrl[] = $baseUrl.$imagePath;
    }
    
}
