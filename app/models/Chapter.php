<?php

class Chapter extends Eloquent {

	protected $table = 'chapters';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('book_id');

	public function getSubjectID(){
		return DB::table('chapters')
				->join('subjects','chapters.subject_id','=','subjects.id')
				->where('chapters.id','=',$this->id)
				->pluck('subjects.id');
	}

	public function Book()
	{
		return $this->belongsTo('Book');
	}

	public function Subject()
	{
		return $this->belongsTo('Subject');
	}

}