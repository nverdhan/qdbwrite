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

Route::get('/getBooks', array(
    'before'=>'auth',
    'uses' =>'TypingController@getChapterList'
));

Route::post('/getBatchID', array(
    'before' => 'auth',
    'uses' => 'TypingController@getBatchID'));

Route::post('/getQID', array(
    'before' => 'auth',
    'uses' => 'TypingController@getQID'));

Route::get('/getTopics' ,array(
    'before'=>'auth',
    'uses' =>'TypingController@getTopicList'
    ));

Route::get('/getExams', array(
    'before' => 'auth',
    'uses' => 'TypingController@getExamNames'));

Route::post('/upload/img', array(
    'before' => 'auth',
    'uses' => 'FileUploadController@imgUpload'));

Route::post('/postQues', array(
    'before' => 'auth',
    'uses' => 'TypingController@postQues'));
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
