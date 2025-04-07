<?php

namespace App\Traits;

use App\Models\File;
use App\Requestan\Models\File as ModelsFile;
use App\Requestan\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use \Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait HasFileUploads
{
    /**
     * Validation rule
     *
     * @var string
     */
    protected string $rule = 'max:200048';

    /**
     * Validation rule for avatar
     *
     * @var string
     */
    protected string $LogoRule = 'required|mimes:jpg,jpeg,png,bmp,gif|max:2048';

    /**
     * File
     *
     * @var UploadedFile[]
     */
    protected array $files;

    /**
     * Check if has avatar and valid
     * 
     * @param Request $request
     * @param string[]|string $keys
     * 
     * @return boolean
     */
    protected function haveFiles( Request &$request,  array|string $keys): bool
    {
        $keys = is_array($keys) ? $keys : [$keys];

        foreach ($keys as $key) {

            $rules[$key] = $key === 'logo' ? $this->LogoRule : $this->rule;

            if ( ! $request->file($key) ) {
                return false;
            } 
            // else if ( !$request->validate($rules) ) {
            //     return false;
            // }
        }
        // Log::info(json_encode($request->file()), ['the file exist' ]);
        return true;
        
    }


    /**
     * Validate files property
     *
     * @param string $type
     * @return boolean
     */
    protected function validateFilesProperty ( string $type ): bool
    {
        if ( ! $this->files ) return false;

        // if ( $type !== 'UploadedFile' && $type !== 'ModelsFile' ) return false;

        $class = UploadedFile::class;
        
        foreach ($this->files as $k => $i ) {
            if ( is_array($i) ) {
                foreach ($i as $o => $f) {
                    if ( ! $f instanceof $class ) return false;
                }
            } else {
                if ( ! $i instanceof $class ) return false;

            }
        }

        return true;

    }

    // /**
    //  * Setter for User
    //  *
    //  * @param string $property
    //  * @param mixed $values
    //  * @return void
    //  */
    // public function __set ( string $property, mixed $value ): void
    // {
    //         if ( $property === 'files' ) {
    //             if ( is_array($value) ) {
    //                 $this->files = array_merge($this->files, $value);
    //             } else if ( is_object($value) && ( $value instanceof UploadedFile || $value instanceof ModelsFile ) ) {
    //                 $this->files[] = $value;
    //             } else if ( is_numeric($value) ) {
    //                 $this->files[] = ModelsFile::find($value);
    //             }
    //         } else if ( $property === 'user' ) {
    //             if ( is_object($value) && $value instanceof User) $this->user = $value;
    //             if ( is_numeric($value) ) $this->user = $this->Model::find($value);
    //         }

    // }

    /**
     * Upload file to server
     * and save to models
     * 
     * @param string $directory
     * @param string $symbol org symbol
     * @param Model $owner of file
     * @param int $id
     * 
     * @return array|false
     */
    protected function uploadFiles( 
        string $directory, 
        string $symbol, 
        Model &$owner, 
        ?int $id=null 
    ): array|false
    {
        if ( ! $this->files 
            || ! $this->validateFilesProperty('UploadedFile') 
        ) return false;

        $fullDirectory = $directory . '/';

        $fullDirectory .= strtolower($symbol);

        if ( $id ) $fullDirectory .= '/' . $id;

        if ( isset($this->files['logo']) ) {
            return $this->uploadLogoFile($this->files['logo'], $fullDirectory, $owner->id);
        }

        $filePaths = [];

        foreach ($this->files as $k => $i) {
            if ( is_array($i) ) {
                $filePaths[$k] = [];
                foreach ($i as $o => $f) {
                    $filePaths[$k][$o] = $this->uploadSingleFile($f, $fullDirectory);
                }
            } else {
                $filePaths[$k] = $this->uploadSingleFile($i, $fullDirectory);
            }

        }


        if ( empty($filePaths) ) return false;

        return $filePaths;
    }

    /**
     * Upload an avatar file
     *
     * For avatars we always only process one
     * file
     * 
     * @param UploadedFile $file
     * @param string $fullDirectory full directory path
     * @param integer $owner_id
     * @return array|false
     */
    private function uploadLogoFile(
        UploadedFile $file,
        string $fullDirectory, 
        int $owner_id
    ): array|false
    {
        $filename = $owner_id . '.' . $file->extension();

        $filepath = $file->storeAs($fullDirectory, $filename, 'public');

        if ( ! $filepath ) return false;

        return ['filename' => $filename, 'filepath' => $filepath, 'mimetype' => $file->getMimeType()];

    }

    /**
     * Upload Single file
     *
     * @param UploadedFile $file
     * @param string $fullDirectory
     * @return array|false
     */
    private function uploadSingleFile(
        UploadedFile $file,
        string $fullDirectory
    ): array|false
    {
        $filename = time().'_'.$file->getClientOriginalName();
        
        $filepath = $file->storeAs($fullDirectory, $filename, 'public');
        if ( ! $filepath ) return false;

        return ['filename' => $filename, 'filepath' => $filepath, 'mimetype' => $file->getMimeType()];
    }

     /**
     * Save File Model
     * 
     * @param array $file
     * @param string $type
     * 
     * @return int|false
     */
    // protected function saveFileModel( array $file, string $type, Model &$owner, ?string $thumbnail=null ): int|false
    // {
    //     $saveFile = ModelsFile::create([
    //         'name' => $file['filename'],
    //         'file_path' => $file['filepath'],
    //         'userable_type' => get_class($owner),
    //         'userable_id' => $owner->id,
    //         'type' => $type,
    //         'mimetype' => $file['mimetype']
    //     ]);

    //     if ( $saveFile ) return $saveFile->id;

    //     return false;
    // }

    /**
     * Delete stored File
     *
     * @param string $filepath
     * @return boolean
     */
    protected function deleteFile ( string $filepath ): bool
    {
        return Storage::delete($filepath);
    }

    /**
     * Delete File Model
     *
     * @return boolean
     */
    // protected function deleteFileModel (): bool
    // {
    //     if ( ! $this->files || ! $this->validateFilesProperty('ModelsFile') ) return false;

    //     foreach ( $this->files as $file ) {
            
    //         $deleteStorage = $this->deleteFile($file->file_path);

    //         if ( ! $deleteStorage ) return false;

    //         $deleteModel = $file->delete();

    //         if ( ! $deleteModel ) return false;
    //     }

    //     return true;
    // }

}