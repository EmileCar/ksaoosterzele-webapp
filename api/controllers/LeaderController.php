<?php

require_once __DIR__ . '/Controller.php';
require_once __DIR__ . '/../models/Leader.php';
require_once __DIR__ . '/../models/WorkingYear.php';
require_once __DIR__ . '/../models/Group.php';
require_once __DIR__ . '/../responses/ErrorResponse.php';
require_once __DIR__ . '/../responses/LeaderByRoleResponse.php';

class LeaderController extends Controller {

    public function getLeadersOfWorkingYear() {
        $workingYear = WorkingYear::orderBy('start_year', 'desc')->first();

        if (!$workingYear) {
            ErrorResponse::exitWithError(500, 'Er is geen werkjaar actief.');
        }

        $leaders = $workingYear->leaderPlaces()->with('leader', 'group')->get()
            ->groupBy(function ($item) {
                return $item->group->name;
        });

        $groups = Group::all()->pluck('name');

        $response = [];
        foreach ($groups as $groupName) {
            $response[$groupName] = isset($leaders[$groupName])
                ? $leaders[$groupName]->map(function ($item) {
                    return [
                        'id' => $item->leader->id,
                        'first_name' => $item->leader->first_name,
                        'last_name' => $item->leader->last_name,
                        'image_file_name' => $item->leader->image_file_name,
                    ];
                })->values()->all()
                : [];
        }

        exit(json_encode($response));
    }

    public function getLeadersByRole() {
        $currentWorkingYear = WorkingYear::orderBy('start_year', 'desc')->first();

        if (!$currentWorkingYear) {
            $roles = LeaderRole::with('leaders')->get();
        } else {
            $roles = LeaderRole::with(['leaders.groups' => function ($query) use ($currentWorkingYear) {
                $query->wherePivot('working_year_id', $currentWorkingYear->id);
            }])->get();
        }

        $leadersByRole = [];

        foreach ($roles as $role) {
            $leadersByRole[$role->name] = $role->leaders->map(function ($leader) use ($role, $currentWorkingYear) {
                $group = $currentWorkingYear ? $leader->groups->first() : null;

                $leaderResponse = new LeaderByRoleResponse($leader, $role->id, $group);
                return $leaderResponse->toArray();
            })->toArray();
        }

        exit(json_encode($leadersByRole));
    }

    public function createLeader() {
        $account = Account::is_authenticated();

        $data = json_decode(file_get_contents('php://input'), true);

        $errors = Leader::validate($data);

        if (!empty($errors)) {
			ErrorResponse::exitWithError(400, "Validatie fouten gevonden.", $errors);
		}

        $leader = new Leader();
		$leader = Leader::create($data, $leader);
		$leader->save();

		http_response_code(201);
		exit();
    }

    public function updateLeader() {
        $account = Account::is_authenticated();

        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data["id"])) {
			ErrorResponse::exitWithError(400, "Gelieve een id mee te geven.");
		}

        $leader = Leader::find($data["id"]);

        if (empty($leader)) {
            ErrorResponse::exitWithError(404, "Leider niet gevonden.");
        }

        $errors = Leader::validate($data);

        if (!empty($errors)) {
            ErrorResponse::exitWithError(400, "Validatie fouten gevonden.", $errors);
        }

        $leader = Leader::create($data, $leader);
        $leader->save();

        exit();
    }

    public function getLeaderRoles() {
        $roles = LeaderRole::get();
        exit(json_encode($roles));
    }

    public function changeRoleOfLeader() {
        if(!isset($_GET['leader_id']) || !isset($_GET['role_id'])) {
            ErrorResponse::exitWithError(400, 'Leider of rol niet opgegeven.');
        }

        $leaderId = $_GET['leader_id'];
        $roleId = $_GET['role_id'];

        $leader = Leader::find($leaderId);
        $role = LeaderRole::find($roleId);

        if (!$leader || !$role) {
            ErrorResponse::exitWithError(404, 'Leider of rol niet gevonden.');
        }

        $leader->role()->associate($role);
        $leader->save();

        exit();
    }

    public function changeGroupOfLeader() {
        if (!isset($_GET['leader_id']) || !isset($_GET['group_id'])) {
            ErrorResponse::exitWithError(400, 'Leider of groep niet opgegeven.');
        }

        $leaderId = $_GET['leader_id'];
        $groupId = $_GET['group_id'];

        $leader = Leader::find($leaderId);

        if (!$leader) {
            ErrorResponse::exitWithError(404, 'Leider niet gevonden.');
        }

        $currentWorkingYear = WorkingYear::orderBy('start_year', 'desc')->first();
        if (!$currentWorkingYear) {
            ErrorResponse::exitWithError(500, 'Er is geen werkjaar actief.');
        }

        

        $leaderPlace = LeaderPlace::where('leader_id', $leaderId)
            ->where('working_year_id', $currentWorkingYear->id)
            ->first();

        if (empty($leaderPlace)) {
            $leaderPlace = new LeaderPlace();
            $leaderPlace->leader_id = $leaderId;
            $leaderPlace->working_year_id = $currentWorkingYear->id;
        }

        if ($groupId === "0") {
            $leader->groups()->detach();
            $leader->save();
            exit();
        } else {
            $group = Group::find($groupId);
            if (!$group) {
                ErrorResponse::exitWithError(404, 'Groep niet gevonden.');
            }
            $leaderPlace->group_id = $groupId;
            $leaderPlace->save();
        }

        exit();
    }

    public function getLeaderGroups() {
        if (!isset($_GET['leader_id'])) {
            ErrorResponse::exitWithError(400, 'Leider niet opgegeven.');
        }

        $leaderId = $_GET['leader_id'];

        $leader = Leader::find($leaderId);

        if (!$leader) {
            ErrorResponse::exitWithError(404, "Leider niet gevonden.");
        }

        $currentWorkingYear = WorkingYear::orderBy('start_year', 'desc')->first();

        if (!$currentWorkingYear) {
            ErrorResponse::exitWithError(500, 'Er is geen werkjaar actief.');
        }

        $sortedLeaderPlaces = $leader->leaderPlaces
            ->filter(function ($leaderPlace) use ($currentWorkingYear) {
                return $leaderPlace->workingYear->id !== $currentWorkingYear->id;
            })
            ->sortByDesc(function ($leaderPlace) {
                return $leaderPlace->workingYear->start_year;
            });

        $groups = $sortedLeaderPlaces->map(function ($leaderPlace) {
            return [
                'group' => $leaderPlace->group->name,
                'working_year' => $leaderPlace->workingYear->name,
            ];
        })->values();
        exit(json_encode($groups));
    }

    public function getLeaderImagePaths() {
        $directory = '../assets/leiders';
		$filenames = [];
		$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

		if (is_dir($directory)) {
			if ($handle = opendir($directory)) {
				while (($file = readdir($handle)) !== false) {
					$extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
					if ($file !== '.' && $file !== '..' && in_array($extension, $allowedExtensions)) {
						$filenames[] = $file;
					}
				}
				closedir($handle);
			}
		}

		exit(json_encode($filenames));
    }

    public function getLeaders() {
        $account = Account::is_authenticated();

        $leaders = Leader::all()->map(function ($leader) {
            return [
                'id' => $leader->id,
                'name' => $leader->first_name . ' ' . $leader->last_name,
            ];
        });

        exit(json_encode($leaders));
    }

    public function getLeader() {
        $account = Account::is_authenticated();

        if (!isset($_GET['id'])) {
            ErrorResponse::exitWithError(400, 'Gelieve een id mee te geven.');
        }

        $leader = Leader::find($_GET['id']);

        if (!$leader) {
            ErrorResponse::exitWithError(404, 'Leider niet gevonden.');
        }

        exit(json_encode($leader));
    }
}