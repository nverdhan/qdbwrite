<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
App::missing(function($exception)
{
    return View::make('papersetterapp');
});

Route::get('/', function()
{
	return View::make('papersetterapp');
});


Route::post('/auth/login', array(
	'before' => 'csrf_json', 
	'uses' => 'AuthController@login'));
Route::get('/auth/logout', 'AuthController@logout');
Route::get('/auth/status', 'AuthController@status');


// Remove this later

Route::get('dbset', function(){
	$users = array(
            array(
                'email'      => 'nverdhan@edroot.com',
                'password'   => Hash::make('manager!123'),
                'created_at' => new DateTime,
                'updated_at' => new DateTime
            )
        );

        DB::table('users')->insert( $users );
});
