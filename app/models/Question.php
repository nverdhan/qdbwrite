<?php

class Question extends Eloquent {

	protected $table = 'questions';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('user_id');

	public function makeNewQues($batchid){
		$question = new Question;
		$question->user_id = Auth::id();
		$question->batchentry_id = $batchid;
		$question->complete = 0;
		$question->save();
		Session::put('currentqid', $question->id);
		return $question->id;

	}

}