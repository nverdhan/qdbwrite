<?php

class Exam extends Eloquent {

	protected $table = 'exams';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	// protected $hidden = array('publisher_id', 'subject_id');

	public function getExamNames(){
		return Exam::all();
	}

}