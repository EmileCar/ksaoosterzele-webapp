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

    public static function create($data, $collage) {
        if(!empty($data["name"])){
            $collage->internal_name = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $data["name"]));
            $collage->display_name = $data["name"];
        }
        if(!empty($data["description"])){
            $collage->description = $data["description"];
        }
        if(!empty($data["date"])){
            $collage->date = $data["date"];
        }
        if(!empty($data["active"])){
            $collage->active = $data["active"];
        }

        return $collage;
    }
}
