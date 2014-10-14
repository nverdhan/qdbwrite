<?php

class Subject extends Eloquent {

	protected $table = 'subjects';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('id');

	public function getTopics(){
		return Subject::with('Topic')->
				where('id','=',$this->id)->get();
	}

	public function Topic()
	{
		return $this->hasMany('Topic');
	}	

	public function Chapter()
	{
		return $this->hasMany('Chapter');
	}
}