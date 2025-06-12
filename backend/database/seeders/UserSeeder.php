<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Crear el rol SuperAdmin si no existe
        $role = Role::firstOrCreate(
            ['nombre' => 'SuperAdmin'],
            ['descripcion' => 'Rol con todos los permisos del sistema']
        );

        // Crear el usuario
        $user = User::create([
            'name' => 'SuperAdmin',
            'email' => 'SuperAdmin@gmail.com',
            'password' => Hash::make('12345678'),
        ]);

        // Asignar el rol al usuario en la tabla user_role
        UserRole::create([
            'user_id' => $user->id,
            'role_id' => $role->id,
        ]);
    }
}
