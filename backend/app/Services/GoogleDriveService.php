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
        $this->client->addScope(Drive::DRIVE);
        $this->service = new Drive($this->client);
    }

    /**
     * Sube un archivo a Google Drive dentro de la carpeta 'aplicacion_a_medida' y una subcarpeta con el correo del usuario.
     * Retorna la URL pública o false en caso de error.
     *
     * @param UploadedFile $file
     * @param string $userEmail
     * @return string|false
     */
    public function uploadFile(UploadedFile $file, string $userEmail)
    {
        try {
            // Obtener o crear carpeta principal
            $parentFolderId = $this->getOrCreateFolder('aplicacion_a_medida');

            // Obtener o crear subcarpeta usuario
            $userFolderId = $this->getOrCreateFolder($userEmail, $parentFolderId);

            $fileMetadata = new DriveFile([
                'name' => time() . '_' . $file->getClientOriginalName(),
                'parents' => [$userFolderId],
            ]);

            $content = file_get_contents($file->getRealPath());
            if ($content === false) {
                Log::error("No se pudo leer el archivo para subir a Google Drive.");
                return false;
            }

            $uploadedFile = $this->service->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => $file->getMimeType(),
                'uploadType' => 'multipart',
                'fields' => 'id',
            ]);

            // Hacer la imagen pública
            $this->service->permissions->create($uploadedFile->id, [
                'role' => 'reader',
                'type' => 'anyone',
            ]);

            return 'https://drive.google.com/uc?id=' . $uploadedFile->id;

        } catch (\Exception $e) {
            Log::error('Error al subir archivo a Google Drive: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Busca o crea una carpeta en Drive.
     * 
     * @param string $folderName
     * @param string|null $parentId
     * @return string
     * @throws \Exception
     */
    private function getOrCreateFolder(string $folderName, string $parentId = null): string
    {
        $query = "name='{$folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false";
        if ($parentId) {
            $query .= " and '{$parentId}' in parents";
        }

        $response = $this->service->files->listFiles([
            'q' => $query,
            'spaces' => 'drive',
            'fields' => 'files(id, name)', // optimiza la consulta
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
