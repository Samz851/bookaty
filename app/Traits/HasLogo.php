<?php

namespace App\Traits;

use App\Models\File;
use App\Requestan\Models\File as ModelsFile;
use App\Requestan\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use \Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HasLogo
{
    /**
     * Check if has logo and valid
     * 
     * @param Request $request
     * 
     * @return boolean
     */
    public function hasLogo()
    {
        return $this->logo !== null;
    }

    /**
     * Save logo to user
     * 
     * @param string $filepath
     * 
     * @return Model
     */
    public function saveLogoToModel ( string $filepath ): Model
    {
        $this->logo = asset('storage/' . $filepath);
        return $this;
    }

    /**
     * Delete logo from user
     *
     * @return void
     */
    public function deleteLogoFromModel ()
    {
        $this->logo = null;
    }

    /**
     * Delete stored File
     * 
     * @param string $filepath
     * 
     * @return boolean
     */
    public function deleteLogoFile ( string $filepath )
    {
        return Storage::delete($filepath);
    }

    /**
     * Delete file model
     *
     * @return void
     */
    public function deleteLogo ( string $logoPath )
    {

        $deleted = $this->deleteLogoFile( $logoPath);
        $this->deleteLogoFromModel();
        return $deleted ? $this : false;
    }
}