<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class GoogleDriveService
{
    protected $client;
    protected $service;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setAuthConfig(storage_path('app/credentials/google-drive.json'));
        $this->client->addScope(Drive::DRIVE_FILE);
        $this->client->addScope('https://www.googleapis.com/auth/drive');
        $this->service = new Drive($this->client);
    }

    /**
     * Sube un archivo a Google Drive dentro de la carpeta del usuario.
     */
    public function uploadFile(UploadedFile $file, string $userEmail)
    {
        try {
            $parentFolderId = $this->getOrCreateFolder('aplicacion_a_medida');
            $userFolderId = $this->getOrCreateFolder($userEmail, $parentFolderId);
    
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
    
            $fileMetadata = new DriveFile([
                'name' => $fileName,
                'parents' => [$userFolderId],
            ]);
    
            $content = file_get_contents($file->getRealPath());
    
            if ($content === false) {
                Log::error("No se pudo leer el archivo.");
                return false;
            }
    
            // Subir archivo
            $uploadedFile = $this->service->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => $file->getMimeType(),
                'uploadType' => 'multipart',
                'fields' => 'id, webContentLink',
            ]);
            
    
            // Hacer público el archivo de forma correcta y segura
            $permission = new \Google\Service\Drive\Permission([
                'type' => 'anyone',
                'role' => 'reader',
                'allowFileDiscovery' => false // Asegura que sea público sin ser indexado
            ]);

            $this->service->permissions->create(
                $uploadedFile->id,
                $permission,
                ['fields' => 'id'] // 👈 importante
            );

// URL pública
Log::info("Archivo subido a Drive: ID={$uploadedFile->id}");

return "https://drive.google.com/uc?export=view&id={$uploadedFile->id}";

        } catch (\Exception $e) {
            Log::error('Error al subir archivo a Google Drive: ' . $e->getMessage());
            return false;
        }
    }

    private function getOrCreateFolder(string $folderName, string $parentId = null): string
    {
        $query = "name = '{$folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        if ($parentId) {
            $query .= " and '{$parentId}' in parents";
        }

        $response = $this->service->files->listFiles([
            'q' => $query,
            'spaces' => 'drive',
            'fields' => 'files(id)',
        ]);

        if (count($response->files) > 0) {
            return $response->files[0]->id;
        }

        $folderMetadata = new DriveFile([
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
        ]);

        if ($parentId) {
            $folderMetadata->setParents([$parentId]);
        }

        $folder = $this->service->files->create($folderMetadata, [
            'fields' => 'id',
        ]);

        return $folder->id;
    }
}
