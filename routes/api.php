<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\PlatformController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/users', [UserController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::delete('/users/{user}/force', [UserController::class, 'forceDestroy']);
    Route::put('/users/{user}/restore', [UserController::class, 'restore']);

    Route::apiResource('/platforms', PlatformController::class)->only([
        'index', 'show', 'store', 'update',
    ]);
    Route::delete('/platforms/{platform}', [PlatformController::class, 'destroy']);
    Route::delete('/platforms/{platform}/force', [PlatformController::class, 'forceDestroy']);
    Route::put('/platforms/{platform}/restore', [PlatformController::class, 'restore']);

    Route::apiResource('/campaigns', CampaignController::class)->only([
        'index', 'show', 'store', 'update',
    ]);
    Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']);
    Route::delete('/campaigns/{campaign}/force', [CampaignController::class, 'forceDestroy']);
    Route::put('/campaigns/{campaign}/restore', [CampaignController::class, 'restore']);
});
