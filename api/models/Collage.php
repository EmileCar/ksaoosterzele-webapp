<?php

use \Illuminate\Database\Eloquent\Model;
require_once __DIR__ . "/CollageType.php";

class Collage extends Model
{
    public $timestamps = false;

    public function types() {
        return $this->belongsToMany(CollageType::class, 'collage_collage_types', 'collage_id', 'collage_type_id');
    }

    public static function validate($data)
    {
        $errors = [];

        if (empty($data["name"])) {
            $errors["name"] = "Gelieve een naam mee te geven.";
        }

        if (empty($data["date"])) {
            $errors["date"] = "Gelieve een datum mee te geven.";
        }

        return $errors;
    }
}
