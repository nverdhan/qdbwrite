<?php

class Publisher extends Eloquent {

	protected $table = 'publishers';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('id');

	public function Book(){
		return $this->hasMany('Book');
	}


}