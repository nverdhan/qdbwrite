<?php

class Topic extends Eloquent {

	protected $table = 'topics';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('subject_id');

	public function Topic()
	{
		return $this->belongsTo('Subject');
	}	

}